"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Users, Landmark, DollarSign, TrendingUp, Download, Plus, Trash, 
  Sparkles, Sun, Moon, LogOut, LayoutDashboard, Shield, ShieldCheck, 
  Briefcase, BookOpen, Settings, Bell, FileText, Menu, X, Search, MessageSquare, Send 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DigiDb, Lead, FAQ, Employee, BankPartner, Conversation, ChatMessage } from '@/lib/db';
import Logo from '@/components/Logo';

export default function AdminDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Navigation
  const [activeTab, setActiveTab] = useState<'analytics' | 'leads' | 'employees' | 'customers' | 'banks' | 'cms' | 'settings' | 'chat'>('analytics');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Database Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [banks, setBanks] = useState<BankPartner[]>([]);
  const [user, setUser] = useState<any>(null);

  // AI Chat states
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [convMessages, setConvMessages] = useState<ChatMessage[]>([]);
  const [chatReplyText, setChatReplyText] = useState('');

  // New Content Forms state
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newFaqCat, setNewFaqCat] = useState('General');

  // Revenue Settings
  const [commissionRate, setCommissionRate] = useState(1.0);

  // Employee Management States
  const [showAddEmp, setShowAddEmp] = useState(false);
  const [showEditEmp, setShowEditEmp] = useState(false);
  const [showViewEmp, setShowViewEmp] = useState(false);
  const [selectedEmp, setSelectedEmp] = useState<Employee | null>(null);

  // Notifications
  const [toastMsg, setToastMsg] = useState('');
  const [toastType, setToastType] = useState<'success' | 'error'>('success');

  // Employee Form fields
  const [empName, setEmpName] = useState('');
  const [empPhone, setEmpPhone] = useState('');
  const [empEmail, setEmpEmail] = useState('');
  const [empPassword, setEmpPassword] = useState('');
  const [empRole, setEmpRole] = useState<'Admin' | 'Advisor' | 'Support' | 'SuperAdmin'>('Advisor');
  const [empBranch, setEmpBranch] = useState('Huzurabad HQ');
  const [empDept, setEmpDept] = useState('Loans');
  const [empDesig, setEmpDesig] = useState('Consultant');
  const [empJoiningDate, setEmpJoiningDate] = useState('');
  const [empStatus, setEmpStatus] = useState<'Active' | 'Suspended'>('Active');
  const [empId, setEmpId] = useState('');

  // Table Filters, Search, Sort & Pagination
  const [empSearch, setEmpSearch] = useState('');
  const [empBranchFilter, setEmpBranchFilter] = useState('All');
  const [empStatusFilter, setEmpStatusFilter] = useState('All');
  const [empRoleFilter, setEmpRoleFilter] = useState('All');
  const [empSortField, setEmpSortField] = useState<'name' | 'email' | 'employeeId' | 'joiningDate'>('name');
  const [empSortOrder, setEmpSortOrder] = useState<'asc' | 'desc'>('asc');
  const [empPage, setEmpPage] = useState(1);
  const empPerPage = 5;

  // Enforce Route Protection
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const checkAdmin = async () => {
      if (!supabase) {
        router.push('/login');
        return;
      }
      const client = supabase!;
      const { data: { session } } = await client.auth.getSession();
      if (!session) {
        router.push('/login');
        return;
      }
      setUser(session.user);

      // Verify Role
      const { data } = await client
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!data || data.role !== 'admin') {
        router.push('/unauthorized');
        return;
      }

      // Load DB Data
      const [leadsData, faqsData, employeesData, convsData] = await Promise.all([
        DigiDb.getLeadsAsync(),
        DigiDb.getFAQsAsync(),
        DigiDb.getEmployeesAsync(),
        DigiDb.getConversationsAsync()
      ]);
      setLeads(leadsData);
      setFaqs(faqsData);
      setEmployees(employeesData);
      setConversations(convsData);
      setBanks(DigiDb.getBankPartners());

      setLoading(false);
    };

    checkAdmin();
  }, [router]);

  const refreshData = async () => {
    const [leadsData, faqsData, employeesData, convsData] = await Promise.all([
      DigiDb.getLeadsAsync(),
      DigiDb.getFAQsAsync(),
      DigiDb.getEmployeesAsync(),
      DigiDb.getConversationsAsync()
    ]);
    setLeads(leadsData);
    setFaqs(faqsData);
    setEmployees(employeesData);
    setConversations(convsData);
    setBanks(DigiDb.getBankPartners());
  };

  const handleAddFaq = async (e: React.FormEvent) => {
    e.preventDefault();
    if (newFaqQ && newFaqA) {
      await DigiDb.saveFAQAsync({
        id: `faq-${Date.now()}`,
        question: newFaqQ,
        answer: newFaqA,
        category: newFaqCat
      });
      setNewFaqQ('');
      setNewFaqA('');
      setShowAddFaq(false);
      await refreshData();
    }
  };

  const handleDeleteFaq = async (id: string) => {
    await DigiDb.deleteFAQAsync(id);
    await refreshData();
  };

  const handleToggleBank = async (bank: BankPartner) => {
    const updated = { ...bank, active: !bank.active };
    DigiDb.updateBankPartner(updated);
    await refreshData();
  };

  const handleOpenAddEmployee = () => {
    setEmpName('');
    setEmpPhone('');
    setEmpEmail('');
    setEmpPassword('');
    setEmpRole('Advisor');
    setEmpBranch('Huzurabad HQ');
    setEmpDept('Loans');
    setEmpDesig('Consultant');
    setEmpJoiningDate(new Date().toISOString().split('T')[0]);
    setEmpStatus('Active');
    const random = Math.floor(1000 + Math.random() * 9000);
    setEmpId(`EMP-${new Date().getFullYear()}-${random}`);
    setShowAddEmp(true);
  };

  const handleOpenEditEmployee = (emp: Employee) => {
    setSelectedEmp(emp);
    setEmpName(emp.name);
    setEmpPhone(emp.phone);
    setEmpEmail(emp.email);
    setEmpRole(emp.role);
    setEmpBranch(emp.branch);
    setEmpDept(emp.department || 'Loans');
    setEmpDesig(emp.designation || 'Advisor');
    setEmpJoiningDate(emp.joiningDate || new Date().toISOString().split('T')[0]);
    setEmpStatus(emp.status || 'Active');
    setEmpId(emp.employeeId || '');
    setShowEditEmp(true);
  };

  const handleOpenViewEmployee = (emp: Employee) => {
    setSelectedEmp(emp);
    setShowViewEmp(true);
  };

  const handleAddEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setToastMsg('');

    try {
      const response = await fetch('/api/employees', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          email: empEmail,
          password: empPassword || 'TempPass123!',
          name: empName,
          phone: empPhone,
          role: empRole,
          branch: empBranch,
          department: empDept,
          designation: empDesig,
          joiningDate: empJoiningDate,
          status: empStatus,
          employeeId: empId
        })
      });

      const data = await response.json();
      if (!response.ok) {
        throw new Error(data.error || 'Failed to create employee.');
      }

      setToastType('success');
      setToastMsg('Employee account created and registered successfully!');
      setShowAddEmp(false);
      await refreshData();
    } catch (err: any) {
      console.error(err);
      setToastType('error');
      setToastMsg(err.message || 'Error occurred during registration.');
    } finally {
      setLoading(false);
    }
  };

  const handleEditEmployeeSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedEmp) return;
    setLoading(true);
    setToastMsg('');

    try {
      const updated: Employee = {
        ...selectedEmp,
        name: empName,
        phone: empPhone,
        branch: empBranch,
        role: empRole,
        department: empDept,
        designation: empDesig,
        joiningDate: empJoiningDate,
        status: empStatus,
        active: empStatus === 'Active'
      };

      await DigiDb.saveEmployeeAsync(updated);
      setToastType('success');
      setToastMsg('Employee profile updated successfully!');
      setShowEditEmp(false);
      await refreshData();
    } catch (err: any) {
      console.error(err);
      setToastType('error');
      setToastMsg(err.message || 'Error updating employee profile.');
    } finally {
      setLoading(false);
    }
  };

  const handleToggleEmployeeStatus = async (emp: Employee) => {
    setLoading(true);
    setToastMsg('');
    try {
      const nextStatus = emp.status === 'Active' ? 'Suspended' : 'Active';
      const updated: Employee = {
        ...emp,
        status: nextStatus,
        active: nextStatus === 'Active'
      };
      await DigiDb.saveEmployeeAsync(updated);
      setToastType('success');
      setToastMsg(`Employee status updated to ${nextStatus}.`);
      await refreshData();
    } catch (err: any) {
      console.error(err);
      setToastType('error');
      setToastMsg('Error toggling employee status.');
    } finally {
      setLoading(false);
    }
  };

  const handleDeleteEmployee = async (id: string) => {
    if (!confirm('Are you sure you want to delete this employee? This action is irreversible.')) return;
    setLoading(true);
    setToastMsg('');
    try {
      await DigiDb.deleteEmployeeAsync(id);
      setToastType('success');
      setToastMsg('Employee account deleted successfully.');
      await refreshData();
    } catch (err: any) {
      console.error(err);
      setToastType('error');
      setToastMsg('Error deleting employee.');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (emp: Employee) => {
    setToastType('success');
    setToastMsg(`Password reset link dispatched to ${emp.email}!`);
  };

  const handleExportEmployeesCSV = () => {
    const headers = 'Employee ID,Full Name,Email,Phone,Branch,Department,Designation,Joining Date,Role,Status\n';
    const rows = employees.map(emp => 
      `"${emp.employeeId || ''}","${emp.name}","${emp.email}","${emp.phone}","${emp.branch}","${emp.department || ''}","${emp.designation || ''}","${emp.joiningDate || ''}","${emp.role}","${emp.status || 'Active'}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'digi_loans_employees.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleImportEmployeesCSV = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = async (evt) => {
      const text = evt.target?.result as string;
      if (!text) return;

      const lines = text.split('\n').map(l => l.trim()).filter(l => l.length > 0);
      if (lines.length <= 1) return;

      let importCount = 0;
      for (let i = 1; i < lines.length; i++) {
        const cols = lines[i].split(',').map(c => c.replace(/^"|"$/g, ''));
        if (cols.length >= 4) {
          const [emp_id, name, email, phone, branch, dept, desig, joining, role, status] = cols;
          const mockId = `mock-emp-${Date.now()}-${i}`;
          await DigiDb.saveEmployeeAsync({
            id: mockId,
            name: name || 'Imported User',
            email: email || `user${i}@import.com`,
            phone: phone || '0000000000',
            branch: branch || 'Huzurabad HQ',
            role: (role as any) || 'Advisor',
            active: status !== 'Suspended',
            avatar: '👨‍💼',
            department: dept || 'Loans',
            designation: desig || 'Consultant',
            joiningDate: joining || new Date().toISOString().split('T')[0],
            status: (status as any) || 'Active',
            employeeId: emp_id || `EMP-${Date.now()}-${i}`
          });
          importCount++;
        }
      }
      setToastType('success');
      setToastMsg(`Successfully imported ${importCount} employees from CSV.`);
      await refreshData();
    };
    reader.readAsText(file);
  };

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConv(conv);
    const msgs = await DigiDb.getConversationMessagesAsync(conv.id);
    setConvMessages(msgs);
  };

  const handleSendChatReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !chatReplyText.trim()) return;

    const newMsg: ChatMessage = {
      id: `msg-${Date.now()}`,
      conversationId: selectedConv.id,
      sender: 'agent',
      content: chatReplyText,
      createdAt: new Date().toISOString()
    };

    await DigiDb.saveChatMessageAsync(newMsg);
    setConvMessages(prev => [...prev, newMsg]);
    setChatReplyText('');

    // Update conversation state to show active intervention
    const updatedConv = {
      ...selectedConv,
      status: 'assigned' as const
    };
    await DigiDb.saveConversationAsync(updatedConv);
    setSelectedConv(updatedConv);
  };

  const handleAssignConversation = async (convId: string, empId: string) => {
    const conv = conversations.find(c => c.id === convId);
    if (!conv) return;
    const updated = {
      ...conv,
      assignedTo: empId,
      status: 'assigned' as const
    };
    await DigiDb.saveConversationAsync(updated);
    await refreshData();
    if (selectedConv?.id === convId) {
      setSelectedConv(updated);
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem('digi-mock-session');
    if (supabase) {
      await supabase.auth.signOut();
    }
    router.push('/login');
  };

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    const root = window.document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
  };

  const handleExportCSV = () => {
    const headers = 'Lead ID,Full Name,Phone,Email,City,Loan Type,Amount,Income,Occupation,Status,Priority,Created At\n';
    const rows = leads.map(l => 
      `"${l.id}","${l.fullName}","${l.mobileNumber}","${l.email || ''}","${l.city}","${l.loanType}",${l.loanAmount},${l.monthlyIncome},"${l.occupation}","${l.status}","${l.priority}","${l.createdAt}"`
    ).join('\n');

    const blob = new Blob([headers + rows], { type: 'text/csv;charset=utf-8;' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.setAttribute('href', url);
    link.setAttribute('download', 'digi_loans_leads_export.csv');
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Metrics
  const totalLeadsCount = leads.length;
  const approvedLeadsCount = leads.filter(l => l.status === 'Approved' || l.status === 'Disbursed').length;
  const rejectedLeadsCount = leads.filter(l => l.status === 'Rejected').length;
  const conversionRate = totalLeadsCount > 0 ? ((approvedLeadsCount / totalLeadsCount) * 100).toFixed(1) : '0';
  const disbursedAmountSum = leads.filter(l => l.status === 'Disbursed').reduce((sum, l) => sum + l.loanAmount, 0);
  const calculatedRevenue = (disbursedAmountSum * (commissionRate / 100));

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading system admin console...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-800 dark:text-slate-200">
      
      {/* SIDEBAR NAVIGATION (Desktop) */}
      <motion.aside 
        animate={{ width: sidebarOpen ? 260 : 70 }}
        className="hidden md:flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 h-screen sticky top-0"
      >
        <div className="p-4 space-y-8">
          {/* Logo Frame */}
          <div className="flex items-center gap-2 justify-between">
            {sidebarOpen && <Logo className="h-9 w-auto" light={theme === 'dark'} />}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          {/* Sidebar Menu Links */}
          <nav className="space-y-1">
            {[
              { id: 'analytics', label: 'Analytics', icon: LayoutDashboard },
              { id: 'leads', label: 'Leads Database', icon: FileText },
              { id: 'employees', label: 'Employees', icon: ShieldCheck },
              { id: 'customers', label: 'Customers', icon: Users },
              { id: 'banks', label: 'Loan Products', icon: Landmark },
              { id: 'cms', label: 'FAQ Manager (CMS)', icon: BookOpen },
              { id: 'chat', label: 'AI Chat Advisor', icon: MessageSquare },
              { id: 'settings', label: 'Settings', icon: Settings },
            ].map((item) => {
              const Icon = item.icon;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as any)}
                  className={`w-full flex items-center gap-3 px-3 h-12 rounded-xl text-sm font-semibold transition-colors cursor-pointer ${
                    activeTab === item.id 
                      ? 'bg-primary text-white dark:bg-accent dark:text-slate-950 font-bold'
                      : 'text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-4 h-4 shrink-0" />
                  {sidebarOpen && <span>{item.label}</span>}
                </button>
              );
            })}
          </nav>
        </div>

        {/* User profile footer */}
        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 h-12 rounded-xl text-sm font-bold text-danger hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* MAIN VIEW AREA */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Header bar */}
        <header className="h-[68px] border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between select-none">
          <div className="flex items-center gap-4">
            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
              SuperAdmin Portal
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary dark:text-accent font-extrabold flex items-center justify-center text-xs">
              AD
            </div>
          </div>
        </header>

        {/* Inner Content Grid */}
        <main className="flex-1 p-6 sm:p-8 overflow-y-auto space-y-6">
          
          {/* TAB PANELS */}
          {activeTab === 'analytics' && (
            <div className="space-y-6">
              {/* Stats Cards */}
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-accent">
                    <Users className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Total Leads</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-850 dark:text-white">{totalLeadsCount}</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-green-500/10 flex items-center justify-center text-green-500">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Conversion Rate</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-850 dark:text-white">{conversionRate}%</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-red-500/10 flex items-center justify-center text-red-500">
                    <Shield className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Rejected Rate</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-850 dark:text-white">
                      {totalLeadsCount > 0 ? ((rejectedLeadsCount / totalLeadsCount) * 100).toFixed(0) : 0}%
                    </span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/80 flex items-center gap-4">
                  <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
                    <DollarSign className="w-5 h-5" />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 font-bold uppercase block">Advisory Revenue</span>
                    <span className="text-xl sm:text-2xl font-black text-slate-850 dark:text-white">
                      ₹{calculatedRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
                    </span>
                  </div>
                </div>
              </div>

              {/* Modeler & Performance Chart */}
              <div className="grid lg:grid-cols-2 gap-6">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/60 dark:border-slate-800/80 space-y-4">
                  <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                    Commission & Revenue Modeler
                  </h3>
                  <div className="space-y-4 pt-2">
                    <div className="space-y-2">
                      <div className="flex justify-between text-xs font-bold">
                        <span>Partner Commission Rate</span>
                        <span className="text-primary dark:text-accent">{commissionRate}%</span>
                      </div>
                      <input
                        type="range"
                        min={0.5}
                        max={3.0}
                        step={0.1}
                        value={commissionRate}
                        onChange={(e) => setCommissionRate(Number(e.target.value))}
                        className="w-full h-1.5 rounded bg-slate-200 dark:bg-slate-700 accent-primary dark:accent-accent outline-none cursor-pointer"
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'leads' && (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-4">
              <div className="flex justify-between items-center">
                <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                  Lead Management CRM
                </h3>
                <button
                  onClick={handleExportCSV}
                  className="flex items-center gap-1 px-4 h-10 rounded-xl bg-primary text-white text-xs font-bold hover:opacity-95 shadow cursor-pointer"
                >
                  <Download className="w-4 h-4" />
                  <span>Export leads (CSV)</span>
                </button>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase">
                      <th className="py-3 px-2">Customer Name</th>
                      <th className="py-3 px-2">Loan Type</th>
                      <th className="py-3 px-2">Amount</th>
                      <th className="py-3 px-2">Monthly Income</th>
                      <th className="py-3 px-2">Status</th>
                      <th className="py-3 px-2">Created Date</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                    {leads.map((l) => (
                      <tr key={l.id} className="hover:bg-slate-50 dark:hover:bg-slate-800/10">
                        <td className="py-3.5 px-2 font-bold text-slate-800 dark:text-white">{l.fullName}</td>
                        <td className="py-3.5 px-2 font-semibold text-slate-500">{l.loanType}</td>
                        <td className="py-3.5 px-2 font-extrabold text-slate-800 dark:text-slate-200">
                          ₹{l.loanAmount.toLocaleString('en-IN')}
                        </td>
                        <td className="py-3.5 px-2">₹{l.monthlyIncome.toLocaleString('en-IN')}</td>
                        <td className="py-3.5 px-2">
                          <span className={`px-2 py-0.5 rounded font-bold text-[10px] uppercase ${
                            l.status === 'Disbursed' || l.status === 'Approved' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary dark:text-accent'
                          }`}>
                            {l.status}
                          </span>
                        </td>
                        <td className="py-3.5 px-2 text-slate-400">{new Date(l.createdAt).toLocaleDateString('en-IN')}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {activeTab === 'employees' && (() => {
            const filteredEmployees = employees.filter(emp => {
              const matchesSearch = emp.name.toLowerCase().includes(empSearch.toLowerCase()) || 
                                    emp.email.toLowerCase().includes(empSearch.toLowerCase()) || 
                                    (emp.employeeId || '').toLowerCase().includes(empSearch.toLowerCase());
              const matchesBranch = empBranchFilter === 'All' || emp.branch === empBranchFilter;
              const matchesStatus = empStatusFilter === 'All' || (emp.status || 'Active') === empStatusFilter;
              const matchesRole = empRoleFilter === 'All' || emp.role === empRoleFilter;
              return matchesSearch && matchesBranch && matchesStatus && matchesRole;
            });

            const sortedEmployees = [...filteredEmployees].sort((a, b) => {
              let valA = a[empSortField] || '';
              let valB = b[empSortField] || '';
              if (valA < valB) return empSortOrder === 'asc' ? -1 : 1;
              if (valA > valB) return empSortOrder === 'asc' ? 1 : -1;
              return 0;
            });

            const totalEmpPages = Math.ceil(sortedEmployees.length / empPerPage) || 1;
            const paginatedEmployees = sortedEmployees.slice((empPage - 1) * empPerPage, empPage * empPerPage);

            const uniqueBranches = Array.from(new Set(employees.map(e => e.branch)));
            const uniqueRoles = Array.from(new Set(employees.map(e => e.role)));

            const handleRequestSort = (field: typeof empSortField) => {
              const isAsc = empSortField === field && empSortOrder === 'asc';
              setEmpSortOrder(isAsc ? 'desc' : 'asc');
              setEmpSortField(field);
            };

            return (
              <div className="space-y-6 text-left relative">
                
                {/* Custom Inline Notification Toast */}
                {toastMsg && (
                  <div className={`p-4.5 rounded-2xl text-xs font-bold flex items-center justify-between shadow-md border ${
                    toastType === 'success' 
                      ? 'bg-green-500/10 border-green-500/20 text-green-600 dark:text-green-400' 
                      : 'bg-red-500/10 border-red-500/20 text-danger'
                  }`}>
                    <div className="flex items-center gap-2">
                      <span className="w-2 h-2 rounded-full bg-current animate-pulse" />
                      <span>{toastMsg}</span>
                    </div>
                    <button onClick={() => setToastMsg('')} className="p-1 hover:opacity-80 cursor-pointer">
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                )}

                {/* Directory Controls Frame */}
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
                    <div>
                      <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                        Employee Directory
                      </h3>
                      <p className="text-[11px] text-slate-400 font-semibold mt-0.5">
                        Manage corporate credentials, user clearances, and bank consultant profiles.
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center gap-2.5">
                      <button
                        onClick={handleOpenAddEmployee}
                        className="flex items-center gap-1.5 px-4.5 py-2.5 rounded-xl bg-primary hover:opacity-95 text-white text-xs font-bold shadow-md shadow-primary/10 transition-all cursor-pointer h-11"
                      >
                        <Plus className="w-4.5 h-4.5" />
                        <span>Add Employee</span>
                      </button>

                      <button
                        onClick={handleExportEmployeesCSV}
                        className="flex items-center gap-1.5 px-4 h-11 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                        title="Export current filter records to CSV"
                      >
                        <Download className="w-4 h-4" />
                        <span>Export CSV</span>
                      </button>

                      <label
                        htmlFor="csv-import-employees"
                        className="flex items-center gap-1.5 px-4 h-11 rounded-xl border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-955 text-slate-700 dark:text-slate-300 text-xs font-bold hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer transition-colors"
                        title="Import employees spreadsheet"
                      >
                        <Plus className="w-4 h-4" />
                        <span>Import CSV</span>
                        <input
                          id="csv-import-employees"
                          type="file"
                          accept=".csv"
                          onChange={handleImportEmployeesCSV}
                          className="hidden"
                        />
                      </label>
                    </div>
                  </div>

                  {/* Filters Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 pt-2">
                    <div className="relative">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search by name, email, ID..."
                        value={empSearch}
                        onChange={(e) => { setEmpSearch(e.target.value); setEmpPage(1); }}
                        className="w-full pl-9 pr-4 py-3 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                      />
                    </div>

                    <select
                      value={empBranchFilter}
                      onChange={(e) => { setEmpBranchFilter(e.target.value); setEmpPage(1); }}
                      className="px-3.5 py-3 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <option value="All">All Branches</option>
                      {uniqueBranches.map(b => <option key={b} value={b}>{b}</option>)}
                    </select>

                    <select
                      value={empRoleFilter}
                      onChange={(e) => { setEmpRoleFilter(e.target.value); setEmpPage(1); }}
                      className="px-3.5 py-3 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <option value="All">All Roles</option>
                      {uniqueRoles.map(r => <option key={r} value={r}>{r}</option>)}
                    </select>

                    <select
                      value={empStatusFilter}
                      onChange={(e) => { setEmpStatusFilter(e.target.value); setEmpPage(1); }}
                      className="px-3.5 py-3 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <option value="All">All Statuses</option>
                      <option value="Active">Active</option>
                      <option value="Suspended">Suspended</option>
                    </select>
                  </div>

                  {/* Employees Table Grid */}
                  <div className="overflow-x-auto pt-2">
                    <table className="w-full text-left text-xs border-collapse">
                      <thead>
                        <tr className="border-b border-slate-200 dark:border-slate-800 text-slate-400 font-bold uppercase select-none">
                          <th onClick={() => handleRequestSort('employeeId')} className="py-3 px-2 cursor-pointer hover:text-primary transition-colors">
                            ID {empSortField === 'employeeId' ? (empSortOrder === 'asc' ? '▲' : '▼') : ''}
                          </th>
                          <th onClick={() => handleRequestSort('name')} className="py-3 px-2 cursor-pointer hover:text-primary transition-colors">
                            Full Name {empSortField === 'name' ? (empSortOrder === 'asc' ? '▲' : '▼') : ''}
                          </th>
                          <th onClick={() => handleRequestSort('email')} className="py-3 px-2 cursor-pointer hover:text-primary transition-colors">
                            Email address {empSortField === 'email' ? (empSortOrder === 'asc' ? '▲' : '▼') : ''}
                          </th>
                          <th className="py-3 px-2">Role & Department</th>
                          <th onClick={() => handleRequestSort('joiningDate')} className="py-3 px-2 cursor-pointer hover:text-primary transition-colors">
                            Join Date {empSortField === 'joiningDate' ? (empSortOrder === 'asc' ? '▲' : '▼') : ''}
                          </th>
                          <th className="py-3 px-2 text-center">Status</th>
                          <th className="py-3 px-2 text-right">Actions</th>
                        </tr>
                      </thead>
                      <tbody className="divide-y divide-slate-100 dark:divide-slate-850">
                        {paginatedEmployees.map((emp) => (
                          <tr key={emp.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/10 transition-colors">
                            <td className="py-3.5 px-2 font-mono font-bold text-slate-500">{emp.employeeId || 'N/A'}</td>
                            <td className="py-3.5 px-2 font-bold text-slate-850 dark:text-white flex items-center gap-2">
                              <span>{emp.avatar || '👨‍💼'}</span>
                              <span>{emp.name}</span>
                            </td>
                            <td className="py-3.5 px-2 text-slate-650 dark:text-slate-300 font-medium">{emp.email}</td>
                            <td className="py-3.5 px-2 text-slate-500 font-medium">
                              {emp.role} / <span className="text-[10px] text-slate-400">{emp.department || 'Loans'}</span>
                            </td>
                            <td className="py-3.5 px-2 text-slate-400">
                              {emp.joiningDate ? new Date(emp.joiningDate).toLocaleDateString('en-IN') : 'N/A'}
                            </td>
                            <td className="py-3.5 px-2 text-center">
                              <span className={`px-2 py-0.5 rounded text-[9px] font-black uppercase ${
                                (emp.status || 'Active') === 'Active' ? 'bg-success/20 text-success' : 'bg-danger/25 text-danger'
                              }`}>
                                {emp.status || 'Active'}
                              </span>
                            </td>
                            <td className="py-3.5 px-2 text-right space-x-1.5 shrink-0 whitespace-nowrap">
                              <button
                                onClick={() => handleOpenViewEmployee(emp)}
                                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:text-primary dark:hover:text-accent cursor-pointer transition-colors"
                              >
                                View
                              </button>
                              <button
                                onClick={() => handleOpenEditEmployee(emp)}
                                className="px-2 py-1 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-500 hover:text-primary dark:hover:text-accent cursor-pointer transition-colors"
                              >
                                Edit
                              </button>
                              <button
                                onClick={() => handleToggleEmployeeStatus(emp)}
                                className={`px-2 py-1 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                                  (emp.status || 'Active') === 'Active' 
                                    ? 'bg-danger/10 text-danger hover:bg-danger/20' 
                                    : 'bg-green-500/10 text-green-600 dark:text-green-400 hover:bg-green-500/25'
                                }`}
                              >
                                {emp.status === 'Active' ? 'Suspend' : 'Activate'}
                              </button>
                              <button
                                onClick={() => handleResetPassword(emp)}
                                className="px-2 py-1 rounded bg-amber-500/10 text-[10px] font-bold text-amber-600 dark:text-amber-500 hover:bg-amber-500/20 cursor-pointer transition-colors"
                                title="Reset Secret Password"
                              >
                                Reset Pass
                              </button>
                              <button
                                onClick={() => handleDeleteEmployee(emp.id)}
                                className="px-2 py-1 rounded bg-red-650/10 text-[10px] font-bold text-danger hover:bg-red-600 hover:text-white cursor-pointer transition-colors"
                              >
                                Delete
                              </button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>

                  {/* Pagination Controls */}
                  <div className="flex flex-col sm:flex-row justify-between items-center gap-4 pt-4 border-t border-slate-100 dark:border-slate-850">
                    <span className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">
                      Showing {sortedEmployees.length > 0 ? (empPage - 1) * empPerPage + 1 : 0} to {Math.min(empPage * empPerPage, sortedEmployees.length)} of {sortedEmployees.length} employees
                    </span>

                    <div className="flex gap-2">
                      <button
                        disabled={empPage === 1}
                        onClick={() => setEmpPage(prev => Math.max(prev - 1, 1))}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Previous
                      </button>
                      <button
                        disabled={empPage === totalEmpPages}
                        onClick={() => setEmpPage(prev => Math.min(prev + 1, totalEmpPages))}
                        className="px-3 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-[10px] font-bold disabled:opacity-40 hover:bg-slate-50 dark:hover:bg-slate-800 cursor-pointer"
                      >
                        Next
                      </button>
                    </div>
                  </div>

                </div>

                {/* MODALS RENDER OVERLAYS */}
                
                {/* 1. Add Employee Modal */}
                {showAddEmp && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/60 backdrop-blur-sm">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-display font-[900] text-xl text-slate-900 dark:text-white">
                            Add New Employee
                          </h3>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                            Auto-Generated ID: {empId}
                          </p>
                        </div>
                        <button onClick={() => setShowAddEmp(false)} className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-650 cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleAddEmployeeSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Full Name *</label>
                            <input
                              type="text"
                              required
                              placeholder="E.g. Rajesh Kumar"
                              value={empName}
                              onChange={(e) => setEmpName(e.target.value)}
                              className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Mobile Number *</label>
                            <input
                              type="text"
                              required
                              placeholder="10-digit number"
                              value={empPhone}
                              onChange={(e) => setEmpPhone(e.target.value)}
                              className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Email address *</label>
                            <input
                              type="email"
                              required
                              placeholder="name@company.com"
                              value={empEmail}
                              onChange={(e) => setEmpEmail(e.target.value)}
                              className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Temporary Password *</label>
                            <input
                              type="password"
                              required
                              placeholder="Temp password"
                              value={empPassword}
                              onChange={(e) => setEmpPassword(e.target.value)}
                              className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Branch *</label>
                            <select
                              value={empBranch}
                              onChange={(e) => setEmpBranch(e.target.value)}
                              className="w-full px-3 h-11 bg-slate-50 dark:bg-slate-955 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-700 dark:text-slate-350"
                            >
                              <option value="Huzurabad HQ">Huzurabad HQ</option>
                              <option value="Karimnagar Center">Karimnagar Center</option>
                              <option value="Warangal Hub">Warangal Hub</option>
                              <option value="Hyderabad Corporate">Hyderabad Corporate</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Department *</label>
                            <input
                              type="text"
                              required
                              placeholder="E.g. Loans, Credit, Risk"
                              value={empDept}
                              onChange={(e) => setEmpDept(e.target.value)}
                              className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-955 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Designation *</label>
                            <input
                              type="text"
                              required
                              placeholder="E.g. Advisor, Credit Officer"
                              value={empDesig}
                              onChange={(e) => setEmpDesig(e.target.value)}
                              className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-955 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-455">Joining Date *</label>
                            <input
                              type="date"
                              required
                              value={empJoiningDate}
                              onChange={(e) => setEmpJoiningDate(e.target.value)}
                              className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-955 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-700 dark:text-slate-300"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Portal Role *</label>
                            <select
                              value={empRole}
                              onChange={(e) => setEmpRole(e.target.value as any)}
                              className="w-full px-3 h-11 bg-slate-50 dark:bg-slate-955 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-700 dark:text-slate-350"
                            >
                              <option value="Advisor">Advisor</option>
                              <option value="Admin">Admin</option>
                              <option value="Support">Support</option>
                              <option value="SuperAdmin">SuperAdmin</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-455">Status *</label>
                            <select
                              value={empStatus}
                              onChange={(e) => setEmpStatus(e.target.value as any)}
                              className="w-full px-3 h-11 bg-slate-50 dark:bg-slate-955 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-700 dark:text-slate-350"
                            >
                              <option value="Active">Active</option>
                              <option value="Suspended">Suspended</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => setShowAddEmp(false)}
                            className="px-4.5 h-11 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 h-11 bg-primary text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                          >
                            Add Employee Account
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}

                {/* 2. Edit Employee Modal */}
                {showEditEmp && selectedEmp && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/60 backdrop-blur-sm">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full max-w-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl p-6 sm:p-8 space-y-6 max-h-[90vh] overflow-y-auto"
                    >
                      <div className="flex justify-between items-start">
                        <div>
                          <h3 className="font-display font-[900] text-xl text-slate-900 dark:text-white">
                            Edit Employee Profile
                          </h3>
                          <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                            Employee ID: {empId}
                          </p>
                        </div>
                        <button onClick={() => setShowEditEmp(false)} className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-650 cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <form onSubmit={handleEditEmployeeSubmit} className="space-y-4">
                        <div className="grid sm:grid-cols-2 gap-4">
                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Full Name *</label>
                            <input
                              type="text"
                              required
                              value={empName}
                              onChange={(e) => setEmpName(e.target.value)}
                              className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Mobile Number *</label>
                            <input
                              type="text"
                              required
                              value={empPhone}
                              onChange={(e) => setEmpPhone(e.target.value)}
                              className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Branch *</label>
                            <select
                              value={empBranch}
                              onChange={(e) => setEmpBranch(e.target.value)}
                              className="w-full px-3 h-11 bg-slate-50 dark:bg-slate-955 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-700 dark:text-slate-350"
                            >
                              <option value="Huzurabad HQ">Huzurabad HQ</option>
                              <option value="Karimnagar Center">Karimnagar Center</option>
                              <option value="Warangal Hub">Warangal Hub</option>
                              <option value="Hyderabad Corporate">Hyderabad Corporate</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Department *</label>
                            <input
                              type="text"
                              required
                              value={empDept}
                              onChange={(e) => setEmpDept(e.target.value)}
                              className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-955 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-455">Designation *</label>
                            <input
                              type="text"
                              required
                              value={empDesig}
                              onChange={(e) => setEmpDesig(e.target.value)}
                              className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-955 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-455">Joining Date *</label>
                            <input
                              type="date"
                              required
                              value={empJoiningDate}
                              onChange={(e) => setEmpJoiningDate(e.target.value)}
                              className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-955 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-750 dark:text-slate-300"
                            />
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-450">Portal Role *</label>
                            <select
                              value={empRole}
                              onChange={(e) => setEmpRole(e.target.value as any)}
                              className="w-full px-3 h-11 bg-slate-50 dark:bg-slate-955 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-700 dark:text-slate-350"
                            >
                              <option value="Advisor">Advisor</option>
                              <option value="Admin">Admin</option>
                              <option value="Support">Support</option>
                              <option value="SuperAdmin">SuperAdmin</option>
                            </select>
                          </div>

                          <div className="space-y-1.5">
                            <label className="text-[10px] uppercase font-bold text-slate-455">Status *</label>
                            <select
                              value={empStatus}
                              onChange={(e) => setEmpStatus(e.target.value as any)}
                              className="w-full px-3 h-11 bg-slate-50 dark:bg-slate-955 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-700 dark:text-slate-350"
                            >
                              <option value="Active">Active</option>
                              <option value="Suspended">Suspended</option>
                            </select>
                          </div>
                        </div>

                        <div className="pt-4 flex justify-end gap-2.5">
                          <button
                            type="button"
                            onClick={() => setShowEditEmp(false)}
                            className="px-4.5 h-11 border border-slate-200 dark:border-slate-800 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50"
                          >
                            Cancel
                          </button>
                          <button
                            type="submit"
                            className="px-6 h-11 bg-primary text-white text-xs font-bold rounded-xl shadow cursor-pointer"
                          >
                            Save Profile Changes
                          </button>
                        </div>
                      </form>
                    </motion.div>
                  </div>
                )}

                {/* 3. View Employee Modal */}
                {showViewEmp && selectedEmp && (
                  <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-955/60 backdrop-blur-sm">
                    <motion.div 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      className="w-full max-w-md bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-[32px] shadow-2xl p-6 sm:p-8 space-y-6 text-left"
                    >
                      <div className="flex justify-between items-start">
                        <div className="flex items-center gap-3">
                          <span className="text-3xl">{selectedEmp.avatar || '👨‍💼'}</span>
                          <div>
                            <h3 className="font-display font-[900] text-lg text-slate-900 dark:text-white">
                              {selectedEmp.name}
                            </h3>
                            <span className="text-[10px] text-slate-400 font-semibold uppercase block">
                              ID: {selectedEmp.employeeId || 'N/A'}
                            </span>
                          </div>
                        </div>
                        <button onClick={() => setShowViewEmp(false)} className="p-2 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-650 cursor-pointer">
                          <X className="w-4 h-4" />
                        </button>
                      </div>

                      <div className="space-y-4 border-t border-slate-100 dark:border-slate-850 pt-4 text-xs leading-relaxed text-slate-600 dark:text-slate-300">
                        <div className="grid grid-cols-2 gap-y-3 gap-x-4">
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Email address</span>
                            <span className="font-semibold text-slate-850 dark:text-white">{selectedEmp.email}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Phone Number</span>
                            <span className="font-semibold text-slate-850 dark:text-white">{selectedEmp.phone}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Branch office</span>
                            <span className="font-semibold text-slate-850 dark:text-white">{selectedEmp.branch}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Department</span>
                            <span className="font-semibold text-slate-850 dark:text-white">{selectedEmp.department || 'Loans'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Designation</span>
                            <span className="font-semibold text-slate-850 dark:text-white">{selectedEmp.designation || 'Consultant'}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Joining Date</span>
                            <span className="font-semibold text-slate-850 dark:text-white">
                              {selectedEmp.joiningDate ? new Date(selectedEmp.joiningDate).toLocaleDateString('en-IN') : 'N/A'}
                            </span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Portal Role</span>
                            <span className="font-semibold text-slate-850 dark:text-white">{selectedEmp.role}</span>
                          </div>
                          <div>
                            <span className="text-[9px] uppercase font-bold text-slate-400 block mb-0.5">Current Status</span>
                            <span className="font-bold text-primary dark:text-accent">{selectedEmp.status || 'Active'}</span>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  </div>
                )}

              </div>
            );
          })()}

          {activeTab === 'customers' && (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-4">
              <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                Customer Management Profiles
              </h3>
              <div className="space-y-3">
                {leads.map((l) => (
                  <div key={l.id} className="p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl flex justify-between items-center border border-slate-200/40 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center text-primary text-xs font-bold">
                        {l.fullName.substring(0, 2).toUpperCase()}
                      </div>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white text-xs block">{l.fullName}</span>
                        <span className="text-[10px] text-slate-400">Phone: {l.mobileNumber} | City: {l.city} | Email: {l.email || 'N/A'}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'banks' && (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-4">
              <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                Bank Partner Configurations
              </h3>
              <div className="grid sm:grid-cols-2 gap-4 pt-2">
                {banks.map((bank) => (
                  <div key={bank.id} className="p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl flex justify-between items-center border border-slate-200/40 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <span className="text-2xl">{bank.logo}</span>
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white text-xs">{bank.name}</span>
                        <span className="block text-[10px] text-slate-400">Interest Range: {bank.interestRate}</span>
                      </div>
                    </div>
                    <button
                      onClick={() => handleToggleBank(bank)}
                      className={`px-3 py-1.5 rounded-lg text-[10px] font-bold cursor-pointer transition-all uppercase ${
                        bank.active ? 'bg-success/20 text-success' : 'bg-slate-200 dark:bg-slate-800 text-slate-400'
                      }`}
                    >
                      {bank.active ? 'Active' : 'Inactive'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'cms' && (
            <div className="space-y-6">
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-4 text-left">
                <div className="flex justify-between items-center">
                  <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                    Website FAQ Content Manager
                  </h3>
                  <button
                    onClick={() => setShowAddFaq(!showAddFaq)}
                    className="flex items-center gap-1 text-xs font-bold text-primary dark:text-accent cursor-pointer"
                  >
                    <Plus className="w-4 h-4" />
                    <span>Add FAQ</span>
                  </button>
                </div>

                {showAddFaq && (
                  <form onSubmit={handleAddFaq} className="space-y-4 max-w-xl">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Question</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter question..."
                        value={newFaqQ}
                        onChange={(e) => setNewFaqQ(e.target.value)}
                        className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Answer</label>
                      <textarea
                        required
                        rows={2}
                        placeholder="Enter answer..."
                        value={newFaqA}
                        onChange={(e) => setNewFaqA(e.target.value)}
                        className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Category</label>
                      <select
                        value={newFaqCat}
                        onChange={(e) => setNewFaqCat(e.target.value)}
                        className="px-3 h-11 border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl font-semibold text-slate-700 dark:text-slate-300"
                      >
                        <option>General</option>
                        <option>Eligibility</option>
                        <option>Interest Rates</option>
                        <option>Processing Time</option>
                        <option>Documents</option>
                        <option>CIBIL</option>
                      </select>
                    </div>
                    <button type="submit" className="px-6 h-10 bg-primary text-white text-xs font-bold rounded-lg shadow-sm">
                      Save FAQ
                    </button>
                  </form>
                )}
              </div>

              {/* FAQ Lists */}
              <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-3">
                <h4 className="font-display font-extrabold text-sm text-slate-400 uppercase tracking-wider">
                  FAQ Database List
                </h4>
                <div className="space-y-3">
                  {faqs.map((faq) => (
                    <div key={faq.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-2xl flex justify-between gap-4 border border-slate-200/30 text-xs text-left">
                      <div>
                        <h5 className="font-bold text-slate-800 dark:text-white">{faq.question}</h5>
                        <p className="text-slate-500 dark:text-slate-400 mt-1 leading-normal">{faq.answer}</p>
                        <span className="inline-block mt-2 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-450 uppercase">
                          {faq.category}
                        </span>
                      </div>
                      <button
                        onClick={() => handleDeleteFaq(faq.id)}
                        className="p-2 rounded bg-red-600/10 hover:bg-red-600 hover:text-white text-danger transition-colors cursor-pointer shrink-0 h-9 w-9 flex items-center justify-center"
                      >
                        <Trash className="w-4 h-4" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {activeTab === 'settings' && (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-4 text-left">
              <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                Admin Panel Settings
              </h3>
              <p className="text-xs text-slate-450 leading-relaxed">
                Configure payout modeling and commission ranges. These variables dictate dynamic revenue estimations on your analytics sub-menus.
              </p>
            </div>
          )}

          {activeTab === 'chat' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-170px)] text-left items-stretch">
              
              {/* Left sidebar: Conversations directory list */}
              <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-4 overflow-y-auto space-y-3 flex flex-col">
                <h3 className="font-display font-extrabold text-sm text-slate-400 uppercase tracking-wider mb-2">
                  AI Advisor Dialogues
                </h3>
                {conversations.length === 0 ? (
                  <p className="text-xs text-slate-400 text-center py-8">No chatbot conversations logged yet.</p>
                ) : (
                  <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                    {conversations.map((conv) => {
                      const isSelected = selectedConv?.id === conv.id;
                      return (
                        <div
                          key={conv.id}
                          onClick={() => handleSelectConversation(conv)}
                          className={`p-3.5 rounded-2xl border transition-all cursor-pointer text-left flex flex-col gap-2 ${
                            isSelected 
                              ? 'bg-primary/5 dark:bg-accent/5 border-primary dark:border-accent shadow-sm'
                              : 'bg-slate-50/50 dark:bg-slate-800/10 border-slate-200/30 dark:border-slate-850 hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex justify-between items-start">
                            <div>
                              <span className="font-bold text-xs block text-slate-800 dark:text-white">
                                {conv.customerName || 'Anonymous Visitor'}
                              </span>
                              <span className="text-[9px] text-slate-400 font-mono block mt-0.5">
                                Session: {conv.sessionId.substring(0, 12)}...
                              </span>
                            </div>
                            <span className={`px-2 py-0.5 rounded text-[8px] font-black uppercase ${
                              conv.status === 'qualified' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary dark:text-accent'
                            }`}>
                              {conv.status}
                            </span>
                          </div>

                          {/* Details */}
                          {(conv.customerPhone || conv.loanInterest) && (
                            <div className="text-[10px] text-slate-500 leading-tight">
                              {conv.loanInterest && <span className="block font-semibold">Interest: {conv.loanInterest}</span>}
                              {conv.customerPhone && <span className="block">Phone: {conv.customerPhone}</span>}
                            </div>
                          )}

                          {/* Assign to Employee dropdown */}
                          <div className="pt-2 border-t border-slate-200/40 dark:border-slate-800/60 flex items-center gap-1.5 justify-between">
                            <span className="text-[9px] text-slate-450 font-bold uppercase">Assign To:</span>
                            <select
                              value={conv.assignedTo || ''}
                              onChange={(e) => handleAssignConversation(conv.id, e.target.value)}
                              onClick={(e) => e.stopPropagation()}
                              className="px-2 py-1 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-850 text-[10px] rounded-md font-semibold text-slate-650 dark:text-slate-350"
                            >
                              <option value="">Choose Advisor</option>
                              {employees.filter(e => e.role === 'Advisor').map(emp => (
                                <option key={emp.id} value={emp.id}>{emp.name}</option>
                              ))}
                            </select>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>

              {/* Right view: Live chat history screen & inputs */}
              <div className="lg:col-span-8 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 flex flex-col justify-between overflow-hidden">
                {selectedConv ? (
                  <>
                    {/* Header */}
                    <div className="p-4 border-b border-slate-100 dark:border-slate-850 bg-slate-50/20 dark:bg-slate-950/25 flex justify-between items-center shrink-0">
                      <div>
                        <span className="font-bold text-sm block text-slate-800 dark:text-white">
                          {selectedConv.customerName || 'Anonymous Visitor'}
                        </span>
                        <span className="text-[9px] text-slate-400">
                          ID: {selectedConv.id} | Session: {selectedConv.sessionId}
                        </span>
                      </div>
                      <span className="px-2.5 py-1 bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 font-bold text-[9px] uppercase rounded-full border border-emerald-500/10">
                        {selectedConv.status}
                      </span>
                    </div>

                    {/* Message stream */}
                    <div className="flex-1 p-6 overflow-y-auto space-y-4 bg-slate-50/20 dark:bg-slate-955/10">
                      {convMessages.map((msg) => (
                        <div
                          key={msg.id}
                          className={`flex ${msg.sender === 'user' ? 'justify-start' : 'justify-end'}`}
                        >
                          <div
                            className={`max-w-[70%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                              msg.sender === 'user'
                                ? 'bg-slate-100 dark:bg-slate-800 text-slate-800 dark:text-slate-200 rounded-tl-none border border-slate-200/30'
                                : msg.sender === 'agent'
                                ? 'bg-secondary text-white rounded-tr-none shadow'
                                : 'bg-primary/90 text-white rounded-tr-none shadow'
                            }`}
                          >
                            <span className="text-[9px] font-black uppercase text-white/70 block mb-1">
                              {msg.sender === 'user' ? 'Customer' : msg.sender === 'bot' ? 'AI Bot' : 'Human Advisor'}
                            </span>
                            <span>{msg.content}</span>
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Chat Form Input */}
                    <form
                      onSubmit={handleSendChatReply}
                      className="p-4 border-t border-slate-100 dark:border-slate-850 flex gap-2 items-center bg-white dark:bg-slate-900 shrink-0"
                    >
                      <input
                        type="text"
                        placeholder="Type reply to intervene and send message to visitor..."
                        value={chatReplyText}
                        onChange={(e) => setChatReplyText(e.target.value)}
                        className="flex-1 px-4 h-11 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm border border-slate-250 dark:border-slate-800 rounded-xl outline-none"
                      />
                      <button
                        type="submit"
                        disabled={!chatReplyText.trim()}
                        className="px-5 h-11 bg-secondary hover:opacity-95 text-white text-xs font-bold rounded-xl flex items-center justify-center gap-1.5 shadow transition-all cursor-pointer disabled:opacity-40"
                      >
                        <Send className="w-4 h-4" />
                        <span>Send Reply</span>
                      </button>
                    </form>
                  </>
                ) : (
                  <div className="flex-1 flex flex-col items-center justify-center text-slate-400 p-8 text-center gap-2">
                    <span className="text-4xl">💬</span>
                    <h4 className="font-bold text-sm text-slate-650 dark:text-slate-350">No Dialogue Selected</h4>
                    <p className="text-[10px] max-w-xs leading-relaxed">
                      Select an active conversation from the dialogue list on the left to monitor live logs, assign consultants, or intervene as a human agent.
                    </p>
                  </div>
                )}
              </div>

            </div>
          )}

        </main>
      </div>

    </div>
  );
}
