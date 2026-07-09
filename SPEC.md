# SPEC.md: AI Loan Advisor Chatbot Application

## Value Proposition
An intelligent, stateful AI Loan Advisor for **Get Loans Hub** that assists public website visitors in exploring loan products, calculating estimates (EMIs), performing eligibility checks, and collecting contact parameters to dynamically create qualified CRM leads, with a seamless handoff to human advisors.

**Core Actions**:
1. Explore Loans & FAQs (collateral-free options, interest rates, timelines, CIBIL prerequisites).
2. Statefully screen/qualify profiles (Name, Phone, Email, City, Employment, Monthly Income, Loan Type, Loan Amount).
3. Live human handoff/intervention request.

---

## Why LLM?
* **Conversational Win**: Describing financial situations in plain language ("I make 50k a month as a software engineer and need a 20 lakh loan for a car") instantly extracts multiple parameters, skipping tedious multi-field form wizards.
* **LLM Adds**: Natural language entity parsing, keyword classifications, contextual QA handling mid-flow, and English/Telugu translation triggers.
* **What LLM Lacks**: Secure lead ingestion databases, dynamic EMI mathematical solvers, and direct real-time agent assignment mappings.

---

## UI Overview
* **First View**: A responsive chat bubble overlay displaying an online AI Advisor avatar. Clicking it launches the sliding dialogue pane showing a greeting.
* **Key Interactions**:
  * Quick replies tray ("Apply Online", "Calculate EMI", "Talk to Advisor").
  * Interruption queries: Answers questions about documentation, interest rates, and locations, then immediately pivots back to the lead capture flow.
* **End State**: Displays a summarized confirmation of the parameters captured and submits the profile to the admin CRM lead roster.

---

## Product Context
* **API / Web Router**: Stateful server handler at `/api/chat` processing sessions in memory and backing them up to Supabase.
* **Supabase Tables**: `conversations`, `messages`, `leads`, `profiles`, `employees`.
* **Language Support**: English and Telugu (both voice readback and speech input).

---

## UX Flows

### 1. Loan Qualification Flow
1. Visitor triggers the chat widget.
2. Bot welcomes the visitor and prompts for their Name.
3. Bot prompts for Loan Type, City, Employment status, Monthly Income, and Loan Amount.
4. Bot prompts for Mobile Phone and Email.
5. Bot summarizes parameters and registers a new qualified Lead in the `leads` table.

### 2. Conversational Interruption Flow
1. Midway through qualification, visitor asks: *"What documents are needed?"*
2. Bot detects question, matches documentation FAQ, answers it, and adds: *"Anyway, let's continue... [Name], what is your monthly income?"*
3. Qualification flow resumes.

### 3. Human Advisor Handoff Flow
1. Visitor requests a human agent or asks: *"Can I speak to an officer?"*
2. Bot marks conversation status as `assigned`.
3. Informs the user they are being transferred.
4. Super Admins/Employees can see the chat logs in their portals and type active interventions to take over the dialogue.
