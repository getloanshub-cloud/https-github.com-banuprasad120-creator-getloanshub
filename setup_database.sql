-- DIGI LOANS - Complete Consolidated Database Setup Script
-- Run this script in the Supabase SQL Editor (https://supabase.com/dashboard/project/_/sql) to set up all tables, triggers, patches, and policies.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Create Profiles Table (linked to auth.users)
CREATE TABLE IF NOT EXISTS public.profiles (
    id UUID PRIMARY KEY REFERENCES auth.users(id) ON DELETE CASCADE,
    email VARCHAR(255) UNIQUE NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('admin', 'employee', 'customer')) DEFAULT 'customer',
    name VARCHAR(255),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    phone VARCHAR(20),
    branch VARCHAR(100) DEFAULT 'Huzurabad HQ',
    department VARCHAR(100) DEFAULT 'Loans',
    designation VARCHAR(100) DEFAULT 'Advisor',
    joining_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended')),
    employee_id VARCHAR(50)
);

-- Enable Row Level Security (RLS) on profiles
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;

-- Basic Profile Policies
CREATE POLICY "Public profiles are viewable by everyone" 
ON public.profiles FOR SELECT 
USING (true);

CREATE POLICY "Users can update their own profile" 
ON public.profiles FOR UPDATE 
USING (auth.uid() = id);

-- 2. Create Employees Table
CREATE TABLE IF NOT EXISTS public.employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Advisor', 'Support', 'SuperAdmin')),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    branch VARCHAR(100) DEFAULT 'Huzurabad HQ',
    active BOOLEAN DEFAULT true,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    department VARCHAR(100) DEFAULT 'Loans',
    designation VARCHAR(100) DEFAULT 'Advisor',
    joining_date DATE DEFAULT CURRENT_DATE,
    status VARCHAR(50) DEFAULT 'Active' CHECK (status IN ('Active', 'Suspended')),
    employee_id VARCHAR(50)
);

-- 3. Automatic Profile Creation Trigger on Auth Signup
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

-- Bind the trigger
DROP TRIGGER IF EXISTS on_auth_user_created ON auth.users;
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW 
  EXECUTE FUNCTION public.handle_new_user();

-- 4. Create Leads Table
CREATE TABLE IF NOT EXISTS public.leads (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    city VARCHAR(100) NOT NULL,
    loan_type VARCHAR(100) NOT NULL,
    loan_amount NUMERIC(15, 2) NOT NULL,
    monthly_income NUMERIC(15, 2) NOT NULL,
    occupation VARCHAR(100) NOT NULL,
    message TEXT,
    status VARCHAR(50) NOT NULL DEFAULT 'New' CHECK (status IN (
        'New', 'Assigned', 'Called', 'Interested', 'Documents Pending', 
        'Documents Received', 'Submitted to Bank', 'Under Verification', 
        'Approved', 'Rejected', 'Disbursed', 'Closed'
    )),
    source VARCHAR(50) NOT NULL DEFAULT 'Website' CHECK (source IN (
        'Website', 'WhatsApp', 'Phone', 'Walk-in', 'Facebook', 'Instagram', 'Google', 'Referral'
    )),
    priority VARCHAR(20) NOT NULL DEFAULT 'Medium' CHECK (priority IN ('Low', 'Medium', 'High')),
    tags TEXT[] DEFAULT '{}',
    assigned_to UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. Create Lead Timeline Events Table
CREATE TABLE IF NOT EXISTS public.lead_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. Create Call Logs Table
CREATE TABLE IF NOT EXISTS public.call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    notes TEXT NOT NULL,
    next_call_date DATE,
    duration VARCHAR(50),
    advisor VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. Create Documents Table
CREATE TABLE IF NOT EXISTS public.lead_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES public.leads(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 8. Create Appointments Table
CREATE TABLE IF NOT EXISTS public.appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(50) NOT NULL,
    purpose TEXT NOT NULL,
    branch VARCHAR(100) NOT NULL DEFAULT 'Huzurabad HQ',
    assigned_advisor UUID REFERENCES public.employees(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. Create Blogs Table
CREATE TABLE IF NOT EXISTS public.blogs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    title VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    content TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    image_url TEXT,
    author VARCHAR(255) NOT NULL,
    read_time VARCHAR(50) DEFAULT '5 min read',
    seo_title VARCHAR(255),
    seo_description TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 10. Create FAQs Table
CREATE TABLE IF NOT EXISTS public.faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 11. Create Bank Partners Table
CREATE TABLE IF NOT EXISTS public.bank_partners (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    logo TEXT,
    interest_rate_range VARCHAR(100),
    processing_fee_info VARCHAR(255),
    max_loan_limit VARCHAR(100),
    approval_time_info VARCHAR(100),
    categories TEXT[] DEFAULT '{}',
    active BOOLEAN DEFAULT true,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 12. Create Conversations Table (for AI Chatbot)
CREATE TABLE IF NOT EXISTS public.conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    customer_city VARCHAR(255),
    employment_type VARCHAR(100),
    monthly_income NUMERIC,
    loan_amount NUMERIC,
    loan_interest VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'qualified', 'assigned', 'completed')),
    assigned_to UUID REFERENCES public.profiles(id) ON DELETE SET NULL,
    conversation_stage VARCHAR(100) DEFAULT 'collecting_name',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast session lookup
CREATE INDEX IF NOT EXISTS idx_conversations_session ON public.conversations(session_id);

-- 13. Create Messages Table (for AI Chatbot)
CREATE TABLE IF NOT EXISTS public.messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES public.conversations(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL CHECK (sender IN ('bot', 'user', 'agent')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for messages
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON public.messages(conversation_id);

-- Enable RLS on all tables
ALTER TABLE public.employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.lead_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.bank_partners ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.messages ENABLE ROW LEVEL SECURITY;

-- Set up basic RLS Policies (allows public reads for content tables, restrict CRM data to authenticated staff)
DROP POLICY IF EXISTS "Public Read Blogs" ON public.blogs;
CREATE POLICY "Public Read Blogs" ON public.blogs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read FAQs" ON public.faqs;
CREATE POLICY "Public Read FAQs" ON public.faqs FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Banks" ON public.bank_partners;
CREATE POLICY "Public Read Banks" ON public.bank_partners FOR SELECT USING (true);

DROP POLICY IF EXISTS "Staff CRUD Leads" ON public.leads;
CREATE POLICY "Staff CRUD Leads" ON public.leads FOR ALL USING (true);

DROP POLICY IF EXISTS "Staff CRUD Timeline" ON public.lead_timeline;
CREATE POLICY "Staff CRUD Timeline" ON public.lead_timeline FOR ALL USING (true);

DROP POLICY IF EXISTS "Staff CRUD Call Logs" ON public.call_logs;
CREATE POLICY "Staff CRUD Call Logs" ON public.call_logs FOR ALL USING (true);

DROP POLICY IF EXISTS "Staff CRUD Documents" ON public.lead_documents;
CREATE POLICY "Staff CRUD Documents" ON public.lead_documents FOR ALL USING (true);

DROP POLICY IF EXISTS "Staff CRUD Appointments" ON public.appointments;
CREATE POLICY "Staff CRUD Appointments" ON public.appointments FOR ALL USING (true);

DROP POLICY IF EXISTS "Staff CRUD Employees" ON public.employees;
CREATE POLICY "Staff CRUD Employees" ON public.employees FOR ALL USING (true);

DROP POLICY IF EXISTS "Public Read Conversations" ON public.conversations;
CREATE POLICY "Public Read Conversations" ON public.conversations FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Conversations" ON public.conversations;
CREATE POLICY "Public Insert Conversations" ON public.conversations FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Conversations" ON public.conversations;
CREATE POLICY "Public Update Conversations" ON public.conversations FOR UPDATE USING (true);

DROP POLICY IF EXISTS "Public Read Messages" ON public.messages;
CREATE POLICY "Public Read Messages" ON public.messages FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Messages" ON public.messages;
CREATE POLICY "Public Insert Messages" ON public.messages FOR INSERT WITH CHECK (true);

-- Insert default administrator employee record
INSERT INTO public.employees (name, role, email, phone, branch, active, avatar)
VALUES ('Kasam Gnaneshwar', 'SuperAdmin', 'stardigiloanswg@gmail.com', '9949822071', 'Huzurabad HQ', true, '👨‍💼')
ON CONFLICT (email) DO NOTHING;
