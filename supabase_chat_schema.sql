-- DIGI LOANS - Supabase Chat Schema Patch
-- Run this in your Supabase SQL Editor to initialize tables for the AI Loan Advisor.

-- 1. CONVERSATIONS TABLE
CREATE TABLE IF NOT EXISTS conversations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    session_id VARCHAR(255) NOT NULL,
    customer_name VARCHAR(255),
    customer_phone VARCHAR(50),
    customer_email VARCHAR(255),
    loan_interest VARCHAR(100),
    status VARCHAR(50) NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'qualified', 'assigned', 'completed')),
    assigned_to UUID REFERENCES profiles(id) ON DELETE SET NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast session lookup
CREATE INDEX IF NOT EXISTS idx_conversations_session ON conversations(session_id);

-- 2. MESSAGES TABLE
CREATE TABLE IF NOT EXISTS messages (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    conversation_id UUID NOT NULL REFERENCES conversations(id) ON DELETE CASCADE,
    sender VARCHAR(50) NOT NULL CHECK (sender IN ('bot', 'user', 'agent')),
    content TEXT NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT CURRENT_TIMESTAMP
);

-- Indexing for fast message history retrieval
CREATE INDEX IF NOT EXISTS idx_messages_conversation ON messages(conversation_id);

-- 3. ENABLE RLS (Row Level Security)
ALTER TABLE conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE messages ENABLE ROW LEVEL SECURITY;

-- 4. RLS POLICIES FOR PUBLIC READ/WRITE ACCESS
-- Allows website visitors (anonymous or authenticated) to manage their chat logs
CREATE POLICY "Public Read Conversations" ON conversations FOR SELECT USING (true);
CREATE POLICY "Public Insert Conversations" ON conversations FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Update Conversations" ON conversations FOR UPDATE USING (true);

CREATE POLICY "Public Read Messages" ON messages FOR SELECT USING (true);
CREATE POLICY "Public Insert Messages" ON messages FOR INSERT WITH CHECK (true);
