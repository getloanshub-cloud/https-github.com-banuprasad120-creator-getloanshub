import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

export async function POST(request: Request) {
  if (!supabaseUrl || !supabaseServiceKey) {
    return NextResponse.json(
      { error: 'Supabase credentials are not configured in environment variables.' },
      { status: 500 }
    );
  }

  try {
    const body = await request.json();
    const { 
      email, 
      password, 
      name, 
      phone, 
      role, 
      branch, 
      department, 
      designation, 
      joiningDate, 
      status, 
      employeeId 
    } = body;

    if (!email || !password || !name) {
      return NextResponse.json(
        { error: 'Email, Password, and Full Name are required.' },
        { status: 400 }
      );
    }

    // Initialize Supabase Admin Client
    const supabaseAdmin = createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false
      }
    });

    // 1. Create the user in Supabase Auth
    const { data: authData, error: authError } = await supabaseAdmin.auth.admin.createUser({
      email,
      password,
      email_confirm: true,
      user_metadata: {
        name,
        role: 'employee',
        phone,
        branch,
        department,
        designation,
        joining_date: joiningDate,
        status,
        employee_id: employeeId
      }
    });

    if (authError) {
      // Map common Supabase errors
      if (authError.message.includes('already exists') || authError.status === 422) {
        return NextResponse.json(
          { error: 'An account with this email address already exists.' },
          { status: 409 }
        );
      }
      throw authError;
    }

    const authUser = authData.user;
    if (!authUser) {
      throw new Error('User creation succeeded but no auth user reference returned.');
    }

    // Note: The SQL database trigger on auth.users automatically copies new signups to profiles.
    // However, to ensure all extended fields are saved, we perform an explicit update/insert check.
    
    // 2. Update extended profile attributes
    await supabaseAdmin
      .from('profiles')
      .update({
        phone,
        branch,
        department,
        designation,
        joining_date: joiningDate,
        status,
        employee_id: employeeId
      })
      .eq('id', authUser.id);

    // 3. Insert into the local employees table
    const { error: employeeError } = await supabaseAdmin
      .from('employees')
      .insert([{
        id: authUser.id,
        name,
        role: role === 'admin' ? 'Admin' : 'Advisor',
        email,
        phone,
        branch,
        active: status === 'Active',
        avatar: '👨‍💼',
        department,
        designation,
        joining_date: joiningDate,
        status,
        employee_id: employeeId
      }]);

    if (employeeError) {
      console.error('Error inserting into employees table:', employeeError);
      // Don't fail the whole request since auth user was successfully registered
    }

    return NextResponse.json({
      success: true,
      user: {
        id: authUser.id,
        email: authUser.email,
        name,
        role,
        phone,
        branch,
        employeeId
      }
    });

  } catch (err: any) {
    console.error('Create Employee API error:', err);
    return NextResponse.json(
      { error: err.message || 'An unexpected error occurred during employee creation.' },
      { status: 500 }
    );
  }
}
