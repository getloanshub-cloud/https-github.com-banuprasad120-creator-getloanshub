"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  FileText, Shield, Sparkles, Plus, Send, Clock, User, LogOut, 
  Menu, X, Sun, Moon, Calculator, MessageSquare, History, CheckCircle2 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DigiDb, Lead, Appointment } from '@/lib/db';
import ApplyForm from '@/components/ApplyForm';
import CalculatorSection from '@/components/CalculatorSection';
import Logo from '@/components/Logo';

export default function CustomerDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'track' | 'apply' | 'calculator' | 'support' | 'profile'>('track');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Database Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [user, setUser] = useState<any>(null);

  // Support state
  const [showApplyTicket, setShowApplyTicket] = useState(false);
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubject, setTicketSubject] = useState('Personal Loan Status');
  const [tickets, setTickets] = useState<{ id: string; subject: string; message: string; date: string; status: string }[]>([
    { id: 'tk-1', subject: 'Document Confirmation', message: 'Have you verified my uploaded Salary Certificate?', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), status: 'Replied' }
  ]);

  // Enforce Route Protection
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const checkCustomer = async () => {
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

      if (!data || data.role !== 'customer') {
        router.push('/unauthorized');
        return;
      }

      // Load DB Data: filter matching default Rajesh Goud number (or current logged-in user email)
      const [leadsData, aptsData] = await Promise.all([
        DigiDb.getLeadsAsync(),
        DigiDb.getAppointmentsAsync()
      ]);
      
      // Filter leads & appointments matching current user email or Rajesh Goud phone
      const clientLeads = leadsData.filter(l => l.email === session.user.email || l.mobileNumber === '9988776655');
      const clientApts = aptsData.filter(a => a.email === session.user.email || a.mobileNumber === '9988776655');
      
      setLeads(clientLeads);
      setAppointments(clientApts);
      setLoading(false);
    };

    checkCustomer();
  }, [router]);
  const refreshData = async () => {
    if (!user) return;
    const leadsData = await DigiDb.getLeadsAsync();
    const aptsData = await DigiDb.getAppointmentsAsync();
    
    const clientLeads = leadsData.filter(l => l.email === user.email || l.mobileNumber === '9988776655');
    const clientApts = aptsData.filter(a => a.email === user.email || a.mobileNumber === '9988776655');
    
    setLeads(clientLeads);
    setAppointments(clientApts);
  };

  const handleCreateTicket = (e: React.FormEvent) => {
    e.preventDefault();
    if (ticketMessage.trim() && ticketSubject.trim()) {
      const newTicket = {
        id: `tk-${Date.now()}`,
        subject: ticketSubject,
        message: ticketMessage,
        date: new Date().toISOString(),
        status: 'Open'
      };
      setTickets(prev => [newTicket, ...prev]);
      setTicketMessage('');
      setShowApplyTicket(false);
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

  const representative = {
    name: 'Loans Advisor',
    title: 'Representative',
    phone: '9000100262',
    email: 'info@getloanshub.com'
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading customer workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-955 flex font-sans text-slate-800 dark:text-slate-200">
      
      {/* SIDEBAR NAVIGATION */}
      <motion.aside 
        animate={{ width: sidebarOpen ? 260 : 70 }}
        className="hidden md:flex flex-col justify-between bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 shrink-0 h-screen sticky top-0"
      >
        <div className="p-4 space-y-8">
          <div className="flex items-center gap-2 justify-between">
            {sidebarOpen && <Logo className="h-9 w-auto" light={theme === 'dark'} />}
            <button 
              onClick={() => setSidebarOpen(!sidebarOpen)}
              className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-400 hover:text-slate-600 cursor-pointer"
            >
              {sidebarOpen ? <X className="w-4 h-4" /> : <Menu className="w-4 h-4" />}
            </button>
          </div>

          <nav className="space-y-1">
            {[
              { id: 'track', label: 'Track Applications', icon: FileText },
              { id: 'apply', label: 'Apply For Loan', icon: Sparkles },
              { id: 'calculator', label: 'EMI Calculator', icon: Calculator },
              { id: 'support', label: 'Support Center', icon: MessageSquare },
              { id: 'profile', label: 'My Profile', icon: User },
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

        <div className="p-4 border-t border-slate-200 dark:border-slate-800">
          <button
            onClick={handleSignOut}
            className="w-full flex items-center gap-3 px-3 h-12 rounded-xl text-sm font-bold text-danger hover:bg-red-50 dark:hover:bg-red-955/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* VIEW PANEL */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[68px] border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between select-none">
          <div className="flex items-center gap-3">
            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
              Customer Workspace
            </span>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 cursor-pointer"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </button>
            <div className="w-8 h-8 rounded-full bg-primary/10 text-primary dark:text-accent font-extrabold flex items-center justify-center text-xs">
              U
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'track' && (
            <div className="grid lg:grid-cols-3 gap-8 items-start">
              {/* Applications List */}
              <div className="lg:col-span-2 space-y-6 text-left">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/40 dark:border-slate-800 space-y-6">
                  <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                    My Active Applications
                  </h3>
                  
                  {leads.length > 0 ? (
                    <div className="space-y-4">
                      {leads.map((lead) => (
                        <div
                          key={lead.id}
                          className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/45 dark:bg-slate-900/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-primary/30 transition-colors"
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent text-[10px] font-bold uppercase tracking-wider">
                                {lead.loanType}
                              </span>
                              <span className="text-[10px] text-slate-450 font-medium">
                                Lead ID: {lead.id}
                              </span>
                            </div>
                            <h4 className="font-display font-bold text-lg text-slate-800 dark:text-white mt-3">
                              ₹{lead.loanAmount.toLocaleString('en-IN')}
                            </h4>
                            <p className="text-xs text-slate-400 mt-1">
                              City: {lead.city} | Filed: {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                            </p>
                          </div>

                          <div className="flex sm:flex-col items-start sm:items-end gap-2 shrink-0">
                            <span className="px-3 py-1 rounded bg-success/20 text-success text-[10px] font-bold uppercase">
                              {lead.status}
                            </span>
                            <span className="text-[10px] text-slate-400 font-semibold">
                              SLA: 30 Mins Verification
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="text-center py-12 text-slate-400 text-xs">
                      No active loan applications found. Submit a request to get started!
                    </div>
                  )}
                </div>
              </div>

              {/* Advisor Card */}
              <div className="lg:col-span-1 text-left">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/40 dark:border-slate-800 space-y-4">
                  <div className="flex items-center gap-3">
                    <Shield className="w-6 h-6 text-primary" />
                    <div>
                      <span className="text-[10px] text-slate-400 block uppercase font-bold">Assigned Advisor</span>
                      <span className="text-xs font-bold text-slate-800 dark:text-white">{representative.name}</span>
                    </div>
                  </div>
                  <div className="pt-2 border-t border-slate-100 dark:border-slate-800 space-y-2 text-xs">
                    <a href={`tel:${representative.phone}`} className="block font-semibold text-primary hover:underline">
                      📞 Call: {representative.phone}
                    </a>
                    <a href={`mailto:${representative.email}`} className="block text-slate-400 hover:underline">
                      ✉️ {representative.email}
                    </a>
                  </div>
                </div>
              </div>

            </div>
          )}

          {activeTab === 'apply' && (
            <div className="max-w-2xl mx-auto">
              <ApplyForm onSuccess={refreshData} />
            </div>
          )}

          {activeTab === 'calculator' && (
            <div className="max-w-4xl mx-auto">
              <CalculatorSection />
            </div>
          )}

          {activeTab === 'support' && (
            <div className="grid lg:grid-cols-12 gap-8 items-start text-left">
              {/* Ticket list */}
              <div className="lg:col-span-7 space-y-6">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/40 dark:border-slate-800 space-y-4">
                  <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-3">
                    <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                      Support Ticket Inbox
                    </h3>
                    <button
                      onClick={() => setShowApplyTicket(!showApplyTicket)}
                      className="flex items-center gap-1 text-xs font-bold text-primary dark:text-accent cursor-pointer"
                    >
                      <Plus className="w-4 h-4" />
                      <span>New Ticket</span>
                    </button>
                  </div>

                  {showApplyTicket && (
                    <form onSubmit={handleCreateTicket} className="space-y-4">
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Subject</label>
                        <select
                          value={ticketSubject}
                          onChange={(e) => setTicketSubject(e.target.value)}
                          className="w-full px-4 h-11 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-250 dark:border-slate-800 outline-none"
                        >
                          <option>Personal Loan Status</option>
                          <option>Documents upload issue</option>
                          <option>Interest rate query</option>
                          <option>Others / General enquiry</option>
                        </select>
                      </div>
                      <div className="space-y-1.5">
                        <label className="text-[10px] uppercase font-bold text-slate-400">Message</label>
                        <textarea
                          required
                          rows={3}
                          placeholder="Type your concern..."
                          value={ticketMessage}
                          onChange={(e) => setTicketMessage(e.target.value)}
                          className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-250 dark:border-slate-800 outline-none"
                        />
                      </div>
                      <button type="submit" className="w-full h-11 bg-primary text-white text-xs font-bold rounded-lg shadow cursor-pointer">
                        Send Ticket
                      </button>
                    </form>
                  )}

                  <div className="space-y-3 pt-2">
                    {tickets.map((t) => (
                      <div key={t.id} className="p-4 bg-slate-50/50 dark:bg-slate-800/10 rounded-2xl border border-slate-200/30 dark:border-slate-800 text-xs">
                        <div className="flex justify-between items-baseline mb-2">
                          <span className="font-bold text-slate-800 dark:text-white">{t.subject}</span>
                          <span className={`px-2 py-0.5 rounded text-[9px] font-bold uppercase ${
                            t.status === 'Replied' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary dark:text-accent'
                          }`}>
                            {t.status}
                          </span>
                        </div>
                        <p className="text-slate-500 dark:text-slate-450 leading-relaxed">{t.message}</p>
                        <span className="text-[9px] text-slate-400 block mt-2">{new Date(t.date).toLocaleDateString('en-IN')}</span>
                      </div>
                    ))}
                  </div>

                </div>
              </div>
            </div>
          )}

          {activeTab === 'profile' && (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-4 text-left">
              <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                Customer Profile
              </h3>
              <div className="space-y-2 text-xs">
                <p><strong>Email:</strong> {user?.email}</p>
                <p><strong>Database ID:</strong> {user?.id}</p>
              </div>
            </div>
          )}
        </main>
      </div>

    </div>
  );
}
