-- ALTER TABLE patch to support stateful AI chatbot
ALTER TABLE conversations 
ADD COLUMN IF NOT EXISTS customer_city VARCHAR(255),
ADD COLUMN IF NOT EXISTS employment_type VARCHAR(100),
ADD COLUMN IF NOT EXISTS monthly_income NUMERIC,
ADD COLUMN IF NOT EXISTS loan_amount NUMERIC,
ADD COLUMN IF NOT EXISTS conversation_stage VARCHAR(100) DEFAULT 'collecting_name';
