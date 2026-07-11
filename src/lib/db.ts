// DIGI LOANS Database Manager
// Supports Supabase and falls back to local storage for instant running.

import { supabase } from './supabase';

export interface Lead {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  city: string;
  loanType: string;
  loanAmount: number;
  monthlyIncome: number;
  occupation: string;
  message?: string;
  documents?: { name: string; url: string; type: string; status: 'Pending' | 'Approved' | 'Rejected' }[];
  status:
    | 'New'
    | 'Assigned'
    | 'Called'
    | 'Interested'
    | 'Documents Pending'
    | 'Documents Received'
    | 'Submitted to Bank'
    | 'Under Verification'
    | 'Approved'
    | 'Rejected'
    | 'Disbursed'
    | 'Closed';
  assignedTo?: string;
  createdAt: string;
  source: 'Website' | 'WhatsApp' | 'Phone' | 'Walk-in' | 'Facebook' | 'Instagram' | 'Google' | 'Referral';
  priority: 'Low' | 'Medium' | 'High';
  tags: string[];
  timeline: {
    id: string;
    date: string;
    title: string;
    description: string;
    createdBy: string;
  }[];
  callLogs: {
    id: string;
    date: string;
    notes: string;
    nextCallDate?: string;
    duration?: string;
    advisor: string;
  }[];
}

export interface Appointment {
  id: string;
  fullName: string;
  mobileNumber: string;
  email: string;
  date: string;
  time: string;
  purpose: string;
  branch: string;
  advisor: string;
  status: 'Pending' | 'Approved' | 'Rejected' | 'Completed';
  createdAt: string;
}

export interface Blog {
  id: string;
  title: string;
  slug: string;
  content: string;
  category: string;
  image: string;
  author: string;
  createdAt: string;
  readTime: string;
  seoTitle?: string;
  seoDescription?: string;
}

export interface FAQ {
  id: string;
  question: string;
  answer: string;
  category: string;
}

export interface BankPartner {
  id: string;
  name: string;
  logo: string;
  interestRate: string;
  processingFee: string;
  maxLoan: string;
  approvalTime: string;
  categories: string[];
  active: boolean;
}

export interface Employee {
  id: string;
  name: string;
  role: 'Admin' | 'Advisor' | 'Support' | 'SuperAdmin';
  email: string;
  phone: string;
  branch: string;
  active: boolean;
  avatar: string;
  department?: string;
  designation?: string;
  joiningDate?: string;
  status?: 'Active' | 'Suspended';
  employeeId?: string;
}

export interface Conversation {
  id: string;
  sessionId: string;
  customerName?: string;
  customerPhone?: string;
  customerEmail?: string;
  loanInterest?: string;
  status: 'active' | 'qualified' | 'assigned' | 'completed';
  assignedTo?: string;
  createdAt: string;
  updatedAt: string;
  assignedEmployeeName?: string;
  customerCity?: string;
  employmentType?: string;
  monthlyIncome?: number;
  loanAmount?: number;
  conversationStage?: string;
}

export interface ChatMessage {
  id: string;
  conversationId: string;
  sender: 'bot' | 'user' | 'agent';
  content: string;
  createdAt: string;
}

const DEFAULT_BANKS: BankPartner[] = [
  { id: 'hdfc', name: 'HDFC Bank', logo: '🏦', interestRate: '8.40% - 14.50%', processingFee: 'Upto 1.00%', maxLoan: '₹75 Lakhs', approvalTime: '2-3 Days', categories: ['Personal Loan', 'Home Loan', 'Business Loan'], active: true },
  { id: 'icici', name: 'ICICI Bank', logo: '🏛️', interestRate: '8.65% - 15.00%', processingFee: 'Upto 1.50%', maxLoan: '₹50 Lakhs', approvalTime: '1-2 Days', categories: ['Personal Loan', 'Home Loan', 'Business Loan', 'Auto Loan'], active: true },
  { id: 'axis', name: 'Axis Bank', logo: '🏠', interestRate: '8.75% - 16.00%', processingFee: 'Flat ₹4,999', maxLoan: '₹40 Lakhs', approvalTime: '3 Days', categories: ['Personal Loan', 'Home Loan', 'Auto Loan'], active: true },
  { id: 'idfc', name: 'IDFC Bank', logo: '💵', interestRate: '8.90% - 16.50%', processingFee: 'Zero - 1%', maxLoan: '₹35 Lakhs', approvalTime: '1 Day', categories: ['Personal Loan', 'Business Loan', 'Auto Loan'], active: true },
  { id: 'yesbank', name: 'Yes Bank', logo: '🏦', interestRate: '9.00% - 15.50%', processingFee: 'Upto 1.50%', maxLoan: '₹40 Lakhs', approvalTime: '2 Days', categories: ['Personal Loan', 'Business Loan'], active: true },
  { id: 'kotak', name: 'Kotak Mahindra Bank', logo: '🛡️', interestRate: '8.50% - 14.25%', processingFee: 'Upto 1.25%', maxLoan: '₹45 Lakhs', approvalTime: '2 Days', categories: ['Personal Loan', 'Home Loan', 'Working Capital Loan'], active: true }
];

const DEFAULT_FAQS: FAQ[] = [
  { id: '1', category: 'General', question: 'What is Get Loans Hub?', answer: 'Get Loans Hub is a premium financial advisory and loan consulting brand dedicated to helping customers secure the right loans at the best interest rates from multiple leading banks.' },
  { id: '2', category: 'Eligibility', question: 'What is the minimum CIBIL score required for a Personal Loan?', answer: 'A CIBIL score of 750 or above is ideal and ensures faster approvals with lower interest rates. However, we also have bank partners who process applications for scores starting at 650+.' },
  { id: '3', category: 'Interest Rates', question: 'Are interest rates fixed or floating?', answer: 'It depends on the loan product. Home loans usually have floating interest rates that vary with market index rates, while personal and auto loans are mostly offered with fixed interest rates.' }
];

const DEFAULT_EMPLOYEES: Employee[] = [
  { id: 'emp-1', name: 'Loans Advisor', role: 'SuperAdmin', email: 'stardigiloanswg@gmail.com', phone: '9000100262', branch: 'Huzurabad HQ', active: true, avatar: '👨‍💼' }
];

const DEFAULT_LEADS: Lead[] = [
  {
    id: 'lead-1',
    fullName: 'Ananth Kumar',
    mobileNumber: '9848022338',
    email: 'ananth.kumar@gmail.com',
    city: 'Huzurabad',
    loanType: 'Personal Loan',
    loanAmount: 500000,
    monthlyIncome: 45000,
    occupation: 'Salaried',
    message: 'Need urgent loan for medical treatment.',
    status: 'New',
    createdAt: new Date(Date.now() - 1000 * 60 * 30).toISOString(),
    source: 'Website',
    priority: 'High',
    tags: ['Medical Emergency', 'First Time Customer'],
    timeline: [
      { id: 't-1', date: new Date().toISOString(), title: 'Lead Created', description: 'Lead submitted via Website enquiry form.', createdBy: 'System' }
    ],
    callLogs: []
  }
];

const isBrowser = typeof window !== 'undefined';

function getStored<T>(key: string, defaults: T): T {
  if (!isBrowser) return defaults;
  const val = localStorage.getItem(key);
  if (!val) {
    localStorage.setItem(key, JSON.stringify(defaults));
    return defaults;
  }
  try {
    return JSON.parse(val);
  } catch {
    return defaults;
  }
}

function setStored<T>(key: string, value: T): void {
  if (isBrowser) {
    localStorage.setItem(key, JSON.stringify(value));
  }
}

// Helper to generate UUIDs safely
function generateUUID(): string {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) {
    return crypto.randomUUID();
  }
  return Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
}

// Mapping Helpers
function mapSupabaseLeadToLocal(row: any): Lead {
  return {
    id: row.id,
    fullName: row.full_name,
    mobileNumber: row.mobile_number,
    email: row.email || '',
    city: row.city,
    loanType: row.loan_type,
    loanAmount: Number(row.loan_amount),
    monthlyIncome: Number(row.monthly_income),
    occupation: row.occupation,
    message: row.message || '',
    status: row.status,
    source: row.source,
    priority: row.priority,
    tags: row.tags || [],
    assignedTo: row.assigned_to || undefined,
    createdAt: row.created_at || new Date().toISOString(),
    timeline: (row.lead_timeline || []).map((t: any) => ({
      id: t.id,
      date: t.created_at,
      title: t.title,
      description: t.description || '',
      createdBy: t.created_by
    })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    callLogs: (row.call_logs || []).map((c: any) => ({
      id: c.id,
      date: c.created_at,
      notes: c.notes,
      nextCallDate: c.next_call_date || undefined,
      duration: c.duration || undefined,
      advisor: c.advisor
    })).sort((a: any, b: any) => new Date(b.date).getTime() - new Date(a.date).getTime()),
    documents: (row.lead_documents || []).map((d: any) => ({
      name: d.name,
      url: d.url,
      type: d.type || '',
      status: d.status
    }))
  };
}

function mapSupabaseAptToLocal(row: any): Appointment {
  return {
    id: row.id,
    fullName: row.full_name,
    mobileNumber: row.mobile_number,
    email: row.email || '',
    date: row.appointment_date,
    time: row.appointment_time,
    purpose: row.purpose,
    branch: row.branch,
    advisor: 'Loans Advisor',
    status: row.status,
    createdAt: row.created_at
  };
}

function mapSupabaseFaqToLocal(row: any): FAQ {
  return {
    id: row.id,
    question: row.question,
    answer: row.answer,
    category: row.category
  };
}

function mapSupabaseBlogToLocal(row: any): Blog {
  return {
    id: row.id,
    title: row.title,
    slug: row.slug,
    content: row.content,
    category: row.category,
    image: row.image_url || '',
    author: row.author,
    createdAt: row.created_at,
    readTime: row.read_time || '5 min read'
  };
}

function mapSupabaseEmployeeToLocal(row: any): Employee {
  return {
    id: row.id,
    name: row.name,
    role: row.role,
    email: row.email,
    phone: row.phone,
    branch: row.branch || 'Huzurabad HQ',
    active: row.active ?? true,
    avatar: row.avatar || '👨‍💼',
    department: row.department || 'Loans',
    designation: row.designation || 'Advisor',
    joiningDate: row.joining_date || new Date().toISOString().split('T')[0],
    status: row.status || 'Active',
    employeeId: row.employee_id || `EMP-${row.id.substring(0, 5).toUpperCase()}`
  };
}

export const DigiDb = {
  // Sync fallbacks for instant UI setup
  getLeads: (): Lead[] => getStored('digi_leads', DEFAULT_LEADS),
  saveLead: (lead: Omit<Lead, 'id' | 'createdAt' | 'timeline' | 'callLogs' | 'status'> & { id?: string; status?: Lead['status'] }): Lead => {
    const leads = DigiDb.getLeads();
    const newLead: Lead = {
      ...lead,
      id: lead.id || `lead-${Date.now()}`,
      status: lead.status || 'New',
      createdAt: new Date().toISOString(),
      timeline: [
        { id: `t-${Date.now()}`, date: new Date().toISOString(), title: 'Lead Created', description: `Enquiry submitted for ${lead.loanType} of ₹${lead.loanAmount.toLocaleString('en-IN')}`, createdBy: 'System' }
      ],
      callLogs: []
    };
    leads.unshift(newLead);
    setStored('digi_leads', leads);
    return newLead;
  },
  updateLead: (updatedLead: Lead): void => {
    const leads = DigiDb.getLeads();
    const idx = leads.findIndex(l => l.id === updatedLead.id);
    if (idx !== -1) {
      leads[idx] = updatedLead;
      setStored('digi_leads', leads);
    }
  },
  addCallLog: (leadId: string, log: Omit<Lead['callLogs'][0], 'id' | 'date'>): void => {
    const leads = DigiDb.getLeads();
    const lead = leads.find(l => l.id === leadId);
    if (lead) {
      const newLog = {
        ...log,
        id: `c-${Date.now()}`,
        date: new Date().toISOString()
      };
      lead.callLogs.unshift(newLog);
      lead.timeline.unshift({
        id: `t-${Date.now()}`,
        date: new Date().toISOString(),
        title: 'Call Notes Logged',
        description: `Call by ${log.advisor}: "${log.notes}"${log.nextCallDate ? `. Next call scheduled: ${log.nextCallDate}` : ''}`,
        createdBy: log.advisor
      });
      DigiDb.updateLead(lead);
    }
  },
  getFAQs: (): FAQ[] => getStored('digi_faqs', DEFAULT_FAQS),
  saveFAQ: (faq: FAQ): void => {
    const faqs = DigiDb.getFAQs();
    const idx = faqs.findIndex(f => f.id === faq.id);
    if (idx !== -1) {
      faqs[idx] = faq;
    } else {
      faqs.push(faq);
    }
    setStored('digi_faqs', faqs);
  },
  deleteFAQ: (id: string): void => {
    const faqs = DigiDb.getFAQs().filter(f => f.id !== id);
    setStored('digi_faqs', faqs);
  },
  getBlogs: (): Blog[] => getStored('digi_blogs', []),
  saveBlog: (blog: Blog): void => {
    const blogs = DigiDb.getBlogs();
    const idx = blogs.findIndex(b => b.id === blog.id);
    if (idx !== -1) {
      blogs[idx] = blog;
    } else {
      blogs.unshift(blog);
    }
    setStored('digi_blogs', blogs);
  },
  deleteBlog: (id: string): void => {
    const blogs = DigiDb.getBlogs().filter(b => b.id !== id);
    setStored('digi_blogs', blogs);
  },
  getBankPartners: (): BankPartner[] => getStored('digi_banks', DEFAULT_BANKS),
  updateBankPartner: (bank: BankPartner): void => {
    const banks = DigiDb.getBankPartners();
    const idx = banks.findIndex(b => b.id === bank.id);
    if (idx !== -1) {
      banks[idx] = bank;
      setStored('digi_banks', banks);
    }
  },
  getEmployees: (): Employee[] => getStored('digi_employees', DEFAULT_EMPLOYEES),
  saveEmployee: (emp: Employee): void => {
    const employees = DigiDb.getEmployees();
    const idx = employees.findIndex(e => e.id === emp.id);
    if (idx !== -1) {
      employees[idx] = emp;
    } else {
      employees.push(emp);
    }
    setStored('digi_employees', employees);
  },
  deleteEmployee: (id: string): void => {
    const employees = DigiDb.getEmployees().filter(e => e.id !== id);
    setStored('digi_employees', employees);
  },
  getConversations: (): Conversation[] => getStored('digi_conversations', []),
  saveConversation: (conv: Conversation): void => {
    const convs = DigiDb.getConversations();
    const idx = convs.findIndex(c => c.id === conv.id);
    if (idx >= 0) {
      convs[idx] = conv;
    } else {
      convs.push(conv);
    }
    setStored('digi_conversations', convs);
  },
  getMessages: (): ChatMessage[] => getStored('digi_messages', []),
  saveMessage: (msg: ChatMessage): void => {
    const msgs = DigiDb.getMessages();
    msgs.push(msg);
    setStored('digi_messages', msgs);
  },
  getAppointments: (): Appointment[] => getStored('digi_appointments', []),
  saveAppointment: (apt: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Appointment => {
    const apts = DigiDb.getAppointments();
    const newApt: Appointment = {
      ...apt,
      id: `apt-${Date.now()}`,
      status: 'Pending',
      createdAt: new Date().toISOString()
    };
    apts.unshift(newApt);
    setStored('digi_appointments', apts);
    return newApt;
  },
  updateAppointmentStatus: (id: string, status: Appointment['status']): void => {
    const apts = DigiDb.getAppointments();
    const apt = apts.find(a => a.id === id);
    if (apt) {
      apt.status = status;
      setStored('digi_appointments', apts);
    }
  },

  // Asynchronous Supabase Methods (Triggered when Supabase URL + Key are configured)
  getLeadsAsync: async (): Promise<Lead[]> => {
    if (!supabase) return DigiDb.getLeads();
    try {
      const { data, error } = await supabase
        .from('leads')
        .select(`
          *,
          lead_timeline (*),
          call_logs (*),
          lead_documents (*)
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(row => mapSupabaseLeadToLocal(row));
    } catch (err) {
      console.error('Supabase getLeads error, falling back:', err);
      return DigiDb.getLeads();
    }
  },

  saveLeadAsync: async (lead: Omit<Lead, 'id' | 'createdAt' | 'timeline' | 'callLogs' | 'status'> & { id?: string; status?: Lead['status'] }): Promise<Lead> => {
    if (!supabase) return DigiDb.saveLead(lead);
    try {
      const leadId = lead.id || generateUUID();
      const insertData = {
        id: leadId,
        full_name: lead.fullName,
        mobile_number: lead.mobileNumber,
        email: lead.email || '',
        city: lead.city,
        loan_type: lead.loanType,
        loan_amount: lead.loanAmount,
        monthly_income: lead.monthlyIncome,
        occupation: lead.occupation,
        message: lead.message || '',
        status: lead.status || 'New',
        source: lead.source || 'Website',
        priority: lead.priority || 'Medium',
        tags: lead.tags || [],
        assigned_to: lead.assignedTo || null
      };

      const { data, error } = await supabase
        .from('leads')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      // Add default timeline entry
      await supabase.from('lead_timeline').insert([{
        lead_id: leadId,
        title: 'Lead Created',
        description: `Enquiry submitted for ${lead.loanType} of ₹${lead.loanAmount.toLocaleString('en-IN')}`,
        created_by: 'System'
      }]);

      // If docs exist, insert them
      if (lead.documents && lead.documents.length > 0) {
        const docsData = lead.documents.map(d => ({
          lead_id: leadId,
          name: d.name,
          url: d.url,
          type: d.type,
          status: d.status
        }));
        await supabase.from('lead_documents').insert(docsData);
      }

      const fullRow = {
        ...data,
        lead_timeline: [{ title: 'Lead Created', description: `Enquiry submitted for ${lead.loanType} of ₹${lead.loanAmount.toLocaleString('en-IN')}`, created_by: 'System', created_at: new Date().toISOString() }],
        call_logs: [],
        lead_documents: lead.documents || []
      };

      // Keep cache in step
      const localLeads = DigiDb.getLeads();
      const localObj = mapSupabaseLeadToLocal(fullRow);
      localLeads.unshift(localObj);
      setStored('digi_leads', localLeads);

      return localObj;
    } catch (err) {
      console.error('Supabase saveLead error, falling back:', err);
      return DigiDb.saveLead(lead);
    }
  },

  updateLeadAsync: async (lead: Lead): Promise<void> => {
    if (!supabase) {
      DigiDb.updateLead(lead);
      return;
    }
    try {
      const { error } = await supabase
        .from('leads')
        .update({
          full_name: lead.fullName,
          mobile_number: lead.mobileNumber,
          email: lead.email,
          city: lead.city,
          loan_type: lead.loanType,
          loan_amount: lead.loanAmount,
          monthly_income: lead.monthlyIncome,
          occupation: lead.occupation,
          status: lead.status,
          priority: lead.priority,
          tags: lead.tags,
          assigned_to: lead.assignedTo || null,
          updated_at: new Date().toISOString()
        })
        .eq('id', lead.id);

      if (error) throw error;
      DigiDb.updateLead(lead);
    } catch (err) {
      console.error('Supabase updateLead error, falling back:', err);
      DigiDb.updateLead(lead);
    }
  },

  addCallLogAsync: async (leadId: string, log: Omit<Lead['callLogs'][0], 'id' | 'date'>): Promise<void> => {
    if (!supabase) {
      DigiDb.addCallLog(leadId, log);
      return;
    }
    try {
      const { error: callError } = await supabase
        .from('call_logs')
        .insert([{
          lead_id: leadId,
          notes: log.notes,
          next_call_date: log.nextCallDate || null,
          duration: log.duration || null,
          advisor: log.advisor
        }]);

      if (callError) throw callError;

      await supabase.from('lead_timeline').insert([{
        lead_id: leadId,
        title: 'Call Notes Logged',
        description: `Call by ${log.advisor}: "${log.notes}"${log.nextCallDate ? `. Next call scheduled: ${log.nextCallDate}` : ''}`,
        created_by: log.advisor
      }]);

      const leads = DigiDb.getLeads();
      const lead = leads.find(l => l.id === leadId);
      if (lead) {
        lead.callLogs.unshift({
          id: `c-${Date.now()}`,
          date: new Date().toISOString(),
          notes: log.notes,
          nextCallDate: log.nextCallDate,
          duration: log.duration,
          advisor: log.advisor
        });
        lead.timeline.unshift({
          id: `t-${Date.now()}`,
          date: new Date().toISOString(),
          title: 'Call Notes Logged',
          description: `Call by ${log.advisor}: "${log.notes}"${log.nextCallDate ? `. Next call scheduled: ${log.nextCallDate}` : ''}`,
          createdBy: log.advisor
        });
        DigiDb.updateLead(lead);
      }
    } catch (err) {
      console.error('Supabase addCallLog error, falling back:', err);
      DigiDb.addCallLog(leadId, log);
    }
  },

  getAppointmentsAsync: async (): Promise<Appointment[]> => {
    if (!supabase) return DigiDb.getAppointments();
    try {
      const { data, error } = await supabase
        .from('appointments')
        .select('*')
        .order('appointment_date', { ascending: false });

      if (error) throw error;
      return (data || []).map(row => mapSupabaseAptToLocal(row));
    } catch (err) {
      console.error('Supabase getAppointments error, falling back:', err);
      return DigiDb.getAppointments();
    }
  },

  saveAppointmentAsync: async (apt: Omit<Appointment, 'id' | 'createdAt' | 'status'>): Promise<Appointment> => {
    if (!supabase) return DigiDb.saveAppointment(apt);
    try {
      const insertData = {
        full_name: apt.fullName,
        mobile_number: apt.mobileNumber,
        email: apt.email || '',
        appointment_date: apt.date,
        appointment_time: apt.time,
        purpose: apt.purpose,
        branch: apt.branch,
        status: 'Pending'
      };

      const { data, error } = await supabase
        .from('appointments')
        .insert([insertData])
        .select()
        .single();

      if (error) throw error;

      const mapped = mapSupabaseAptToLocal(data);
      const localApts = DigiDb.getAppointments();
      localApts.unshift(mapped);
      setStored('digi_appointments', localApts);

      return mapped;
    } catch (err) {
      console.error('Supabase saveAppointment error, falling back:', err);
      return DigiDb.saveAppointment(apt);
    }
  },

  updateAppointmentStatusAsync: async (id: string, status: Appointment['status']): Promise<void> => {
    if (!supabase) {
      DigiDb.updateAppointmentStatus(id, status);
      return;
    }
    try {
      const { error } = await supabase
        .from('appointments')
        .update({ status })
        .eq('id', id);

      if (error) throw error;
      DigiDb.updateAppointmentStatus(id, status);
    } catch (err) {
      console.error('Supabase updateAppointmentStatus error, falling back:', err);
      DigiDb.updateAppointmentStatus(id, status);
    }
  },

  getFAQsAsync: async (): Promise<FAQ[]> => {
    if (!supabase) return DigiDb.getFAQs();
    try {
      const { data, error } = await supabase
        .from('faqs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(row => mapSupabaseFaqToLocal(row));
    } catch (err) {
      console.error('Supabase getFAQs error, falling back:', err);
      return DigiDb.getFAQs();
    }
  },

  saveFAQAsync: async (faq: FAQ): Promise<void> => {
    if (!supabase) {
      DigiDb.saveFAQ(faq);
      return;
    }
    try {
      const { error } = await supabase
        .from('faqs')
        .upsert([{
          id: faq.id.startsWith('faq-') ? undefined : faq.id,
          question: faq.question,
          answer: faq.answer,
          category: faq.category
        }]);

      if (error) throw error;
      DigiDb.saveFAQ(faq);
    } catch (err) {
      console.error('Supabase saveFAQ error, falling back:', err);
      DigiDb.saveFAQ(faq);
    }
  },

  deleteFAQAsync: async (id: string): Promise<void> => {
    if (!supabase) {
      DigiDb.deleteFAQ(id);
      return;
    }
    try {
      const { error } = await supabase
        .from('faqs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      DigiDb.deleteFAQ(id);
    } catch (err) {
      console.error('Supabase deleteFAQ error, falling back:', err);
      DigiDb.deleteFAQ(id);
    }
  },

  getBlogsAsync: async (): Promise<Blog[]> => {
    if (!supabase) return DigiDb.getBlogs();
    try {
      const { data, error } = await supabase
        .from('blogs')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(row => mapSupabaseBlogToLocal(row));
    } catch (err) {
      console.error('Supabase getBlogs error, falling back:', err);
      return DigiDb.getBlogs();
    }
  },

  saveBlogAsync: async (blog: Blog): Promise<void> => {
    if (!supabase) {
      DigiDb.saveBlog(blog);
      return;
    }
    try {
      const { error } = await supabase
        .from('blogs')
        .upsert([{
          id: blog.id.startsWith('blog-') ? undefined : blog.id,
          title: blog.title,
          slug: blog.slug,
          content: blog.content,
          category: blog.category,
          image_url: blog.image,
          author: blog.author,
          read_time: blog.readTime
        }]);

      if (error) throw error;
      DigiDb.saveBlog(blog);
    } catch (err) {
      console.error('Supabase saveBlog error, falling back:', err);
      DigiDb.saveBlog(blog);
    }
  },

  deleteBlogAsync: async (id: string): Promise<void> => {
    if (!supabase) {
      DigiDb.deleteBlog(id);
      return;
    }
    try {
      const { error } = await supabase
        .from('blogs')
        .delete()
        .eq('id', id);

      if (error) throw error;
      DigiDb.deleteBlog(id);
    } catch (err) {
      console.error('Supabase deleteBlog error, falling back:', err);
      DigiDb.deleteBlog(id);
    }
  },

  getEmployeesAsync: async (): Promise<Employee[]> => {
    if (!supabase) return DigiDb.getEmployees();
    try {
      const { data, error } = await supabase
        .from('employees')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(row => mapSupabaseEmployeeToLocal(row));
    } catch (err) {
      console.error('Supabase getEmployees error, falling back:', err);
      return DigiDb.getEmployees();
    }
  },

  saveEmployeeAsync: async (emp: Employee): Promise<void> => {
    if (!supabase) {
      DigiDb.saveEmployee(emp);
      return;
    }
    try {
      const { error } = await supabase
        .from('employees')
        .upsert([{
          id: emp.id.startsWith('emp-') || emp.id.startsWith('mock-') ? undefined : emp.id,
          name: emp.name,
          role: emp.role,
          email: emp.email,
          phone: emp.phone,
          branch: emp.branch,
          active: emp.active,
          avatar: emp.avatar,
          department: emp.department,
          designation: emp.designation,
          joining_date: emp.joiningDate,
          status: emp.status,
          employee_id: emp.employeeId
        }]);

      if (error) throw error;
      DigiDb.saveEmployee(emp);
    } catch (err) {
      console.error('Supabase saveEmployee error, falling back:', err);
      DigiDb.saveEmployee(emp);
    }
  },
  deleteEmployeeAsync: async (id: string): Promise<void> => {
    if (!supabase) {
      DigiDb.deleteEmployee(id);
      return;
    }
    try {
      const { error } = await supabase
        .from('employees')
        .delete()
        .eq('id', id);

      if (error) throw error;
      DigiDb.deleteEmployee(id);
    } catch (err) {
      console.error('Supabase deleteEmployee error, falling back:', err);
      DigiDb.deleteEmployee(id);
    }
  },
  getConversationsAsync: async (): Promise<Conversation[]> => {
    if (!supabase) {
      return DigiDb.getConversations();
    }
    try {
      const { data, error } = await supabase
        .from('conversations')
        .select(`
          id,
          session_id,
          customer_name,
          customer_phone,
          customer_email,
          loan_interest,
          status,
          assigned_to,
          created_at,
          updated_at,
          customer_city,
          employment_type,
          monthly_income,
          loan_amount,
          conversation_stage
        `)
        .order('updated_at', { ascending: false });

      if (error) throw error;
      return (data || []).map(c => ({
        id: c.id,
        sessionId: c.session_id,
        customerName: c.customer_name,
        customerPhone: c.customer_phone,
        customerEmail: c.customer_email,
        loanInterest: c.loan_interest,
        status: c.status,
        assignedTo: c.assigned_to,
        createdAt: c.created_at,
        updatedAt: c.updated_at,
        customerCity: c.customer_city,
        employmentType: c.employment_type,
        monthlyIncome: c.monthly_income ? parseFloat(c.monthly_income) : undefined,
        loanAmount: c.loan_amount ? parseFloat(c.loan_amount) : undefined,
        conversationStage: c.conversation_stage
      }));
    } catch (err) {
      console.error('Supabase getConversations error, falling back:', err);
      return DigiDb.getConversations();
    }
  },
  getConversationMessagesAsync: async (convId: string): Promise<ChatMessage[]> => {
    if (!supabase) {
      return DigiDb.getMessages().filter(m => m.conversationId === convId);
    }
    try {
      const { data, error } = await supabase
        .from('messages')
        .select('*')
        .eq('conversation_id', convId)
        .order('created_at', { ascending: true });

      if (error) throw error;
      return (data || []).map(m => ({
        id: m.id,
        conversationId: m.conversation_id,
        sender: m.sender as any,
        content: m.content,
        createdAt: m.created_at
      }));
    } catch (err) {
      console.error('Supabase getConversationMessages error, falling back:', err);
      return DigiDb.getMessages().filter(m => m.conversationId === convId);
    }
  },
  saveConversationAsync: async (conv: Conversation): Promise<void> => {
    if (!supabase) {
      DigiDb.saveConversation(conv);
      return;
    }
    try {
      const { error } = await supabase
        .from('conversations')
        .upsert([{
          id: conv.id,
          session_id: conv.sessionId,
          customer_name: conv.customerName,
          customer_phone: conv.customerPhone,
          customer_email: conv.customerEmail,
          loan_interest: conv.loanInterest,
          status: conv.status,
          assigned_to: conv.assignedTo,
          created_at: conv.createdAt,
          updated_at: new Date().toISOString(),
          customer_city: conv.customerCity,
          employment_type: conv.employmentType,
          monthly_income: conv.monthlyIncome,
          loan_amount: conv.loanAmount,
          conversation_stage: conv.conversationStage
        }]);

      if (error) throw error;
      DigiDb.saveConversation(conv);
    } catch (err) {
      console.error('Supabase saveConversation error, falling back:', err);
      DigiDb.saveConversation(conv);
    }
  },
  saveChatMessageAsync: async (msg: ChatMessage): Promise<void> => {
    if (!supabase) {
      DigiDb.saveMessage(msg);
      return;
    }
    try {
      const { error } = await supabase
        .from('messages')
        .insert([{
          id: msg.id,
          conversation_id: msg.conversationId,
          sender: msg.sender,
          content: msg.content,
          created_at: msg.createdAt
        }]);

      if (error) throw error;
      DigiDb.saveMessage(msg);
    } catch (err) {
      console.error('Supabase saveChatMessage error, falling back:', err);
      DigiDb.saveMessage(msg);
    }
  }
};
