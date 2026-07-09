"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { 
  Users, MessageCircle, Phone, Calendar, Search, Filter, Plus, 
  ChevronRight, CheckSquare, Sun, Moon, LogOut, LayoutDashboard, 
  ShieldCheck, FileText, Menu, X, Star, Clock, MessageSquare, Send 
} from 'lucide-react';
import { supabase } from '@/lib/supabase';
import { DigiDb, Lead, Appointment, Conversation, ChatMessage } from '@/lib/db';
import Logo from '@/components/Logo';

export default function EmployeeDashboard() {
  const router = useRouter();
  const [loading, setLoading] = useState(true);
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  
  // Navigation tabs
  const [activeTab, setActiveTab] = useState<'leads' | 'calendar' | 'performance' | 'chat'>('leads');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Database Data
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  const [user, setUser] = useState<any>(null);

  // Chat Advisor states
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [selectedConv, setSelectedConv] = useState<Conversation | null>(null);
  const [convMessages, setConvMessages] = useState<ChatMessage[]>([]);
  const [chatReplyText, setChatReplyText] = useState('');

  // Call Logger form
  const [showCallForm, setShowCallForm] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [nextCall, setNextCall] = useState('');
  const [callDuration, setCallDuration] = useState('2m 30s');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  // Enforce Route Protection
  useEffect(() => {
    if (!supabase) {
      setLoading(false);
      return;
    }

    const checkEmployee = async () => {
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

      // Verify Role (Both 'employee' and 'admin' can access advisor views)
      const { data } = await client
        .from('profiles')
        .select('role')
        .eq('id', session.user.id)
        .single();

      if (!data || (data.role !== 'employee' && data.role !== 'admin')) {
        router.push('/unauthorized');
        return;
      }

      // Load DB Data
      const [leadsData, aptsData, convsData] = await Promise.all([
        DigiDb.getLeadsAsync(),
        DigiDb.getAppointmentsAsync(),
        DigiDb.getConversationsAsync()
      ]);
      setLeads(leadsData);
      setAppointments(aptsData);
      setConversations(convsData);
      setLoading(false);
    };

    checkEmployee();
  }, [router]);

  const refreshData = async () => {
    const [leadsData, aptsData, convsData] = await Promise.all([
      DigiDb.getLeadsAsync(),
      DigiDb.getAppointmentsAsync(),
      DigiDb.getConversationsAsync()
    ]);
    setLeads(leadsData);
    setAppointments(aptsData);
    setConversations(convsData);
    if (selectedLead) {
      const refreshedLead = leadsData.find(l => l.id === selectedLead.id);
      if (refreshedLead) {
        setSelectedLead(refreshedLead);
      }
    }
  };

  const handleUpdateStatus = async (leadId: string, newStatus: Lead['status']) => {
    const allLeads = await DigiDb.getLeadsAsync();
    const lead = allLeads.find(l => l.id === leadId);
    if (lead) {
      const prevStatus = lead.status;
      lead.status = newStatus;
      lead.timeline.unshift({
        id: `t-${Date.now()}`,
        date: new Date().toISOString(),
        title: 'Status Updated',
        description: `Lead status changed from ${prevStatus} to ${newStatus}.`,
        createdBy: 'Advisor'
      });
      await DigiDb.updateLeadAsync(lead);
      await refreshData();
    }
  };

  const handleAddCallLog = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedLead && callNotes.trim()) {
      await DigiDb.addCallLogAsync(selectedLead.id, {
        notes: callNotes,
        nextCallDate: nextCall || undefined,
        duration: callDuration,
        advisor: 'Advisor'
      });
      setCallNotes('');
      setNextCall('');
      setShowCallForm(false);
      await refreshData();
    }
  };

  const handleVerifyDocument = async (leadId: string, docIndex: number, action: 'Approved' | 'Rejected') => {
    const allLeads = await DigiDb.getLeadsAsync();
    const lead = allLeads.find(l => l.id === leadId);
    if (lead && lead.documents && lead.documents[docIndex]) {
      lead.documents[docIndex].status = action;
      lead.timeline.unshift({
        id: `t-${Date.now()}`,
        date: new Date().toISOString(),
        title: `Document ${action}`,
        description: `Verified document: ${lead.documents[docIndex].name} - Marked as ${action}`,
        createdBy: 'Advisor'
      });
      await DigiDb.updateLeadAsync(lead);
      await refreshData();
    }
  };

  const handleSelectConversation = async (conv: Conversation) => {
    setSelectedConv(conv);
    const msgs = await DigiDb.getConversationMessagesAsync(conv.id);
    setConvMessages(msgs);
  };

  const handleSendChatReply = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedConv || !chatReplyText.trim() || !user) return;

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

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.mobileNumber.includes(searchTerm) || 
                          l.loanType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex items-center justify-center">
        <div className="flex flex-col items-center gap-3">
          <div className="w-10 h-10 border-2 border-primary border-t-transparent rounded-full animate-spin" />
          <span className="text-xs font-semibold text-slate-400">Loading advisor workspace...</span>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 flex font-sans text-slate-800 dark:text-slate-200">
      
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
              { id: 'leads', label: 'Assigned Leads', icon: Users },
              { id: 'chat', label: 'AI Chat Inbox', icon: MessageSquare },
              { id: 'calendar', label: 'Advisor Calendar', icon: Calendar },
              { id: 'performance', label: 'My Performance', icon: Star },
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
            className="w-full flex items-center gap-3 px-3 h-12 rounded-xl text-sm font-bold text-danger hover:bg-red-50 dark:hover:bg-red-950/20 cursor-pointer"
          >
            <LogOut className="w-4 h-4 shrink-0" />
            {sidebarOpen && <span>Sign Out</span>}
          </button>
        </div>
      </motion.aside>

      {/* VIEW PANEL */}
      <div className="flex-1 flex flex-col min-w-0">
        <header className="h-[68px] border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6 flex items-center justify-between select-none">
          <div>
            <span className="text-xs font-bold text-slate-400 bg-slate-100 dark:bg-slate-800 px-2.5 py-1 rounded">
              Loans Advisor Profile
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
              AD
            </div>
          </div>
        </header>

        <main className="flex-1 p-6 overflow-y-auto">
          {activeTab === 'leads' && (
            <div className="grid lg:grid-cols-12 gap-8 items-start">
              
              {/* Leads List */}
              <div className="lg:col-span-7 space-y-6 text-left">
                <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/40 dark:border-slate-800 space-y-4">
                  <div className="flex flex-col sm:flex-row gap-2 justify-between">
                    <div className="relative flex-1">
                      <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                      <input
                        type="text"
                        placeholder="Search lead by name, phone, product..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-9 pr-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                      />
                    </div>

                    <select
                      value={statusFilter}
                      onChange={(e) => setStatusFilter(e.target.value)}
                      className="px-3.5 py-2.5 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-700 dark:text-slate-300"
                    >
                      <option value="All">All Statuses</option>
                      <option value="New">New</option>
                      <option value="Called">Called</option>
                      <option value="Interested">Interested</option>
                      <option value="Documents Pending">Docs Pending</option>
                      <option value="Submitted to Bank">Submitted to Bank</option>
                      <option value="Approved">Approved</option>
                    </select>
                  </div>

                  <div className="space-y-3">
                    <h3 className="font-display font-extrabold text-sm text-slate-400 uppercase tracking-wider">
                      Assigned Leads ({filteredLeads.length})
                    </h3>
                    <div className="space-y-2.5">
                      {filteredLeads.map((lead) => (
                        <div
                          key={lead.id}
                          onClick={() => setSelectedLead(lead)}
                          className={`p-4 rounded-2xl border transition-all cursor-pointer flex justify-between items-center ${
                            selectedLead?.id === lead.id
                              ? 'border-primary bg-primary/5 dark:border-accent dark:bg-accent/5'
                              : 'border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 hover:border-slate-350'
                          }`}
                        >
                          <div>
                            <div className="flex items-center gap-2">
                              <span className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">{lead.fullName}</span>
                              <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-150 dark:bg-slate-800 text-slate-450 uppercase">
                                {lead.loanType}
                              </span>
                            </div>
                            <p className="text-[10px] text-slate-400 mt-1">
                              Phone: {lead.mobileNumber} | Amount: ₹{lead.loanAmount.toLocaleString('en-IN')}
                            </p>
                          </div>
                          <span className="px-2 py-0.5 rounded bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent font-bold text-[9px] uppercase">
                            {lead.status}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Lead Workspace Detail Pane */}
              <div className="lg:col-span-5 text-left">
                {selectedLead ? (
                  <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-primary/20 dark:border-accent/20 shadow-md space-y-6">
                    <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-start">
                      <div>
                        <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                          {selectedLead.fullName}
                        </h3>
                        <p className="text-[10px] text-slate-400 font-semibold uppercase">
                          Lead ID: {selectedLead.id}
                        </p>
                      </div>
                      <div className="flex gap-1.5">
                        <a href={`tel:${selectedLead.mobileNumber}`} className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer">
                          <Phone className="w-4 h-4" />
                        </a>
                      </div>
                    </div>

                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Current Status</label>
                      <select
                        value={selectedLead.status}
                        onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value as any)}
                        className="w-full px-3.5 h-12 bg-slate-50 dark:bg-slate-850 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-bold text-slate-800 dark:text-white"
                      >
                        <option value="New">New</option>
                        <option value="Called">Called</option>
                        <option value="Interested">Interested</option>
                        <option value="Documents Pending">Documents Pending</option>
                        <option value="Documents Received">Documents Received</option>
                        <option value="Submitted to Bank">Submitted to Bank</option>
                        <option value="Under Verification">Under Verification</option>
                        <option value="Approved">Approved</option>
                        <option value="Rejected">Rejected</option>
                        <option value="Disbursed">Disbursed</option>
                        <option value="Closed">Closed</option>
                      </select>
                    </div>

                    {/* CRM Logs Form */}
                    <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
                      <div className="flex justify-between items-center">
                        <span className="text-[10px] uppercase font-bold text-slate-400">CRM Tracker Notes</span>
                        <button
                          onClick={() => setShowCallForm(!showCallForm)}
                          className="text-xs font-bold text-primary dark:text-accent cursor-pointer"
                        >
                          {showCallForm ? 'Hide Form' : 'Log Note'}
                        </button>
                      </div>

                      {showCallForm && (
                        <form onSubmit={handleAddCallLog} className="space-y-3 pt-2">
                          <textarea
                            required
                            rows={2}
                            placeholder="Enter call notes..."
                            value={callNotes}
                            onChange={(e) => setCallNotes(e.target.value)}
                            className="w-full px-4 py-2.5 bg-slate-50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                          />
                          <div className="grid grid-cols-2 gap-2">
                            <div>
                              <label className="text-[9px] uppercase font-bold text-slate-400 block mb-1">Follow-up Date</label>
                              <input
                                type="date"
                                value={nextCall}
                                onChange={(e) => setNextCall(e.target.value)}
                                className="w-full px-3 h-10 bg-slate-50 dark:bg-slate-955 text-[10px] rounded-lg border border-slate-200 dark:border-slate-800 outline-none"
                              />
                            </div>
                            <div className="flex items-end">
                              <button type="submit" className="w-full h-10 bg-primary text-white text-xs font-bold rounded-lg shadow-sm">
                                Save Log
                              </button>
                            </div>
                          </div>
                        </form>
                      )}
                    </div>

                    {/* Docs Checklist */}
                    {selectedLead.documents && selectedLead.documents.length > 0 && (
                      <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
                        <span className="text-[10px] uppercase font-bold text-slate-400 block">Verification Checklist</span>
                        <div className="space-y-2.5">
                          {selectedLead.documents.map((doc, idx) => (
                            <div key={idx} className="flex justify-between items-center p-2.5 bg-slate-50 dark:bg-slate-800/30 rounded-xl border border-slate-200/40 dark:border-slate-800 text-xs">
                              <span className="font-semibold text-slate-750 dark:text-slate-200">{doc.name}</span>
                              <div className="flex gap-1.5">
                                <button
                                  onClick={() => handleVerifyDocument(selectedLead.id, idx, 'Approved')}
                                  className={`px-2 h-7 rounded text-[10px] font-bold ${
                                    doc.status === 'Approved' ? 'bg-success/20 text-success' : 'bg-slate-100 text-slate-400'
                                  }`}
                                >
                                  Approve
                                </button>
                                <button
                                  onClick={() => handleVerifyDocument(selectedLead.id, idx, 'Rejected')}
                                  className={`px-2 h-7 rounded text-[10px] font-bold ${
                                    doc.status === 'Rejected' ? 'bg-danger/20 text-danger' : 'bg-slate-100 text-slate-400'
                                  }`}
                                >
                                  Reject
                                </button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                  </div>
                ) : (
                  <div className="p-8 bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl text-center text-xs text-slate-400">
                    Select a customer lead from the list to display workspace.
                  </div>
                )}
              </div>

            </div>
          )}

          {activeTab === 'calendar' && (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-4 text-left">
              <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                Advisor Consultation Meetings
              </h3>
              <div className="space-y-3">
                {appointments.map((apt) => (
                  <div key={apt.id} className="p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl flex justify-between items-center border border-slate-200/40 dark:border-slate-800">
                    <div className="flex items-center gap-3">
                      <Calendar className="w-5 h-5 text-primary" />
                      <div>
                        <span className="font-bold text-slate-800 dark:text-white text-xs block">{apt.fullName}</span>
                        <span className="text-[10px] text-slate-450 block">{apt.purpose}</span>
                        <span className="text-[9px] text-slate-400 block mt-0.5">Date: {apt.date} | Slot: {apt.time} | Mobile: {apt.mobileNumber}</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {activeTab === 'performance' && (
            <div className="p-6 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 space-y-4 text-left">
              <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                My Performance Dashboard
              </h3>
              <p className="text-xs text-slate-450">
                Performance indices, conversions, and SLA timings are processed automatically by the system admin.
              </p>
            </div>
          )}

          {activeTab === 'chat' && (() => {
            const myConversations = conversations.filter(c => c.assignedTo === user?.id);

            return (
              <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 h-[calc(100vh-170px)] text-left items-stretch">
                
                {/* Left: Chat list */}
                <div className="lg:col-span-4 bg-white dark:bg-slate-900 rounded-3xl border border-slate-200/50 dark:border-slate-800 p-4 overflow-y-auto space-y-3 flex flex-col">
                  <h3 className="font-display font-extrabold text-sm text-slate-400 uppercase tracking-wider mb-2">
                    My Assigned Dialogues
                  </h3>
                  {myConversations.length === 0 ? (
                    <p className="text-xs text-slate-400 text-center py-8">No chatbot conversations assigned to you yet.</p>
                  ) : (
                    <div className="space-y-2 flex-1 overflow-y-auto pr-1">
                      {myConversations.map((conv) => {
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

                            {(conv.customerPhone || conv.loanInterest) && (
                              <div className="text-[10px] text-slate-550 leading-tight">
                                {conv.loanInterest && <span className="block font-semibold">Interest: {conv.loanInterest}</span>}
                                {conv.customerPhone && <span className="block">Phone: {conv.customerPhone}</span>}
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  )}
                </div>

                {/* Right: Message panel */}
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
                                {msg.sender === 'user' ? 'Customer' : msg.sender === 'bot' ? 'AI Bot' : 'Advisor (You)'}
                              </span>
                              <span>{msg.content}</span>
                            </div>
                          </div>
                        ))}
                      </div>

                      {/* Input */}
                      <form
                        onSubmit={handleSendChatReply}
                        className="p-4 border-t border-slate-100 dark:border-slate-850 flex gap-2 items-center bg-white dark:bg-slate-900 shrink-0"
                      >
                        <input
                          type="text"
                          placeholder="Type reply to intervene and send message..."
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
                        Select an assigned customer conversation from the list on the left to monitor live logs or intervene directly as their dedicated advisor.
                      </p>
                    </div>
                  )}
                </div>

              </div>
            );
          })()}
        </main>
      </div>

    </div>
  );
}
