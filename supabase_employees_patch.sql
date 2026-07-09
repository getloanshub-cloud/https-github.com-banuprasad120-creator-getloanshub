-- DIGI LOANS - Employee Columns Database Patch
-- Run this in your Supabase SQL Editor to extend the profiles and employees tables.

-- 1. Extend public.profiles table
ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone VARCHAR(20),
ADD COLUMN IF NOT EXISTS branch VARCHAR(100) DEFAULT 'Huzurabad HQ',
ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'Loans',
ADD COLUMN IF NOT EXISTS designation VARCHAR(100) DEFAULT 'Advisor',
ADD COLUMN IF NOT EXISTS joining_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended')),
ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50);

-- 2. Extend public.employees table
ALTER TABLE public.employees 
ADD COLUMN IF NOT EXISTS department VARCHAR(100) DEFAULT 'Loans',
ADD COLUMN IF NOT EXISTS designation VARCHAR(100) DEFAULT 'Advisor',
ADD COLUMN IF NOT EXISTS joining_date DATE DEFAULT CURRENT_DATE,
ADD COLUMN IF NOT EXISTS status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended')),
ADD COLUMN IF NOT EXISTS employee_id VARCHAR(50);

-- 3. Update handle_new_user trigger function to map metadata to extended columns
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS trigger AS $$
BEGIN
  INSERT INTO public.profiles (
    id, 
    email, 
    name, 
    role,
    phone,
    branch,
    department,
    designation,
    joining_date,
    status,
    employee_id
  )
  VALUES (
    new.id,
    new.email,
    COALESCE(new.raw_user_meta_data->>'name', split_part(new.email, '@', 1)),
    COALESCE(new.raw_user_meta_data->>'role', 'customer'),
    new.raw_user_meta_data->>'phone',
    COALESCE(new.raw_user_meta_data->>'branch', 'Huzurabad HQ'),
    COALESCE(new.raw_user_meta_data->>'department', 'Loans'),
    COALESCE(new.raw_user_meta_data->>'designation', 'Advisor'),
    COALESCE((new.raw_user_meta_data->>'joining_date')::date, CURRENT_DATE),
    COALESCE(new.raw_user_meta_data->>'status', 'Active'),
    new.raw_user_meta_data->>'employee_id'
  );
  RETURN new;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;
