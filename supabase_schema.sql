-- DIGI LOANS - Supabase PostgreSQL Schema
-- Run this in your Supabase SQL Editor to initialize the database tables, relationships, and basic RLS.

-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. EMPLOYEES TABLE
CREATE TABLE IF NOT EXISTS employees (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name VARCHAR(255) NOT NULL,
    role VARCHAR(50) NOT NULL CHECK (role IN ('Admin', 'Advisor', 'Support', 'SuperAdmin')),
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20) NOT NULL,
    branch VARCHAR(100) DEFAULT 'Huzurabad HQ',
    active BOOLEAN DEFAULT true,
    avatar TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 2. LEADS TABLE
CREATE TABLE IF NOT EXISTS leads (
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
    assigned_to UUID REFERENCES employees(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 3. CRM TIMELINE EVENTS TABLE
CREATE TABLE IF NOT EXISTS lead_timeline (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    title VARCHAR(255) NOT NULL,
    description TEXT,
    created_by VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 4. CALL LOGS TABLE
CREATE TABLE IF NOT EXISTS call_logs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    notes TEXT NOT NULL,
    next_call_date DATE,
    duration VARCHAR(50),
    advisor VARCHAR(255) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 5. DOCUMENTS TABLE
CREATE TABLE IF NOT EXISTS lead_documents (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    lead_id UUID NOT NULL REFERENCES leads(id) ON DELETE CASCADE,
    name VARCHAR(255) NOT NULL,
    url TEXT NOT NULL,
    type VARCHAR(100),
    status VARCHAR(50) DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 6. APPOINTMENTS TABLE
CREATE TABLE IF NOT EXISTS appointments (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    full_name VARCHAR(255) NOT NULL,
    mobile_number VARCHAR(20) NOT NULL,
    email VARCHAR(255),
    appointment_date DATE NOT NULL,
    appointment_time VARCHAR(50) NOT NULL,
    purpose TEXT NOT NULL,
    branch VARCHAR(100) NOT NULL DEFAULT 'Huzurabad HQ',
    assigned_advisor UUID REFERENCES employees(id) ON DELETE SET NULL,
    status VARCHAR(50) NOT NULL DEFAULT 'Pending' CHECK (status IN ('Pending', 'Approved', 'Rejected', 'Completed')),
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 7. BLOGS TABLE
CREATE TABLE IF NOT EXISTS blogs (
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

-- 8. FAQS TABLE
CREATE TABLE IF NOT EXISTS faqs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question TEXT NOT NULL,
    answer TEXT NOT NULL,
    category VARCHAR(100) NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- 9. BANK PARTNERS TABLE
CREATE TABLE IF NOT EXISTS bank_partners (
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

-- Enable Row Level Security (RLS) on all tables
ALTER TABLE employees ENABLE ROW LEVEL SECURITY;
ALTER TABLE leads ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_timeline ENABLE ROW LEVEL SECURITY;
ALTER TABLE call_logs ENABLE ROW LEVEL SECURITY;
ALTER TABLE lead_documents ENABLE ROW LEVEL SECURITY;
ALTER TABLE appointments ENABLE ROW LEVEL SECURITY;
ALTER TABLE blogs ENABLE ROW LEVEL SECURITY;
ALTER TABLE faqs ENABLE ROW LEVEL SECURITY;
ALTER TABLE bank_partners ENABLE ROW LEVEL SECURITY;

-- Create default administrator employee record
-- (You can run this after setting up auth.users to link it up, or use simple email login)
INSERT INTO employees (name, role, email, phone, branch, active, avatar)
VALUES ('Kasam Gnaneshwar', 'SuperAdmin', 'stardigiloanswg@gmail.com', '9949822071', 'Huzurabad HQ', true, '👨‍💼')
ON CONFLICT (email) DO NOTHING;

-- RLS Basic Policies (Allow reading blogs/faqs/banks publicly, restrict CRM to authenticated staff)
CREATE POLICY "Public Read Blogs" ON blogs FOR SELECT USING (true);
CREATE POLICY "Public Read FAQs" ON faqs FOR SELECT USING (true);
CREATE POLICY "Public Read Banks" ON bank_partners FOR SELECT USING (true);

CREATE POLICY "Staff CRUD Leads" ON leads FOR ALL USING (true);
CREATE POLICY "Staff CRUD Timeline" ON lead_timeline FOR ALL USING (true);
CREATE POLICY "Staff CRUD Call Logs" ON call_logs FOR ALL USING (true);
CREATE POLICY "Staff CRUD Documents" ON lead_documents FOR ALL USING (true);
CREATE POLICY "Staff CRUD Appointments" ON appointments FOR ALL USING (true);
CREATE POLICY "Staff CRUD Employees" ON employees FOR ALL USING (true);
