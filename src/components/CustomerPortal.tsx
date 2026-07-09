"use client";

import React, { useState, useEffect } from 'react';
import { Shield, Sparkles, FileText, CheckCircle2, AlertCircle, Plus, Send, Clock, User } from 'lucide-react';
import { DigiDb, Lead, Appointment } from '@/lib/db';

export default function CustomerPortal() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  
  // Custom states
  const [showApplyTicket, setShowApplyTicket] = useState(false);
  const [ticketMessage, setTicketMessage] = useState('');
  const [ticketSubject, setTicketSubject] = useState('Personal Loan Status');
  const [tickets, setTickets] = useState<{ id: string; subject: string; message: string; date: string; status: string }[]>([
    { id: 'tk-1', subject: 'Document confirmation', message: 'Have you verified my uploaded Salary Certificate?', date: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), status: 'Replied' }
  ]);

  useEffect(() => {
    const loadData = async () => {
      // Look up leads matching default customer phone in mock/Supabase db
      const allLeads = await DigiDb.getLeadsAsync();
      // Filter matching "Rajesh Goud" (mock client number: 9988776655)
      const clientLeads = allLeads.filter(l => l.mobileNumber === '9988776655');
      setLeads(clientLeads);

      // Look up appointments matching Rajesh
      const allApts = await DigiDb.getAppointmentsAsync();
      const clientApts = allApts.filter(a => a.mobileNumber === '9988776655');
      setAppointments(clientApts);
    };
    loadData();
  }, []);

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

  const representative = {
    name: 'Loans Advisor',
    title: 'Representative',
    phone: '9000100262',
    email: 'info@getloanshub.com'
  };

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header bar */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
            <User className="w-6 h-6 text-primary dark:text-accent" />
            <span>Rajesh Goud - Customer Workspace</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
            Registered Mobile: 9988776655 | Huzurabad HQ
          </p>
        </div>
        <div className="p-3 bg-primary/5 dark:bg-accent/5 border border-primary/20 dark:border-accent/20 rounded-2xl flex items-center gap-2">
          <Shield className="w-5 h-5 text-primary dark:text-accent" />
          <div className="text-left">
            <span className="text-[10px] text-slate-400 block uppercase font-bold">Assigned Advisor</span>
            <span className="text-xs font-bold text-slate-800 dark:text-white">{representative.name}</span>
          </div>
        </div>
      </div>

      {/* Grid columns */}
      <div className="grid lg:grid-cols-3 gap-8">
        
        {/* Left column: Leads / applications lists */}
        <div className="lg:col-span-2 space-y-6">
          
          {/* Applications list */}
          <div className="p-6 rounded-3xl glass border border-slate-200/40 dark:border-slate-800 space-y-6">
            <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
              My Active Applications
            </h3>
            
            {leads.length > 0 ? (
              <div className="space-y-4">
                {leads.map((lead) => (
                  <div
                    key={lead.id}
                    className="p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 flex flex-col sm:flex-row justify-between sm:items-center gap-4 hover:border-primary/30 transition-colors"
                  >
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="px-2.5 py-0.5 rounded bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent text-[10px] font-bold uppercase tracking-wider">
                          {lead.loanType}
                        </span>
                        <span className="text-[10px] text-slate-450 font-medium">
                          Ref: {lead.id}
                        </span>
                      </div>
                      <h4 className="font-display font-extrabold text-lg mt-2 text-slate-850 dark:text-white">
                        ₹{lead.loanAmount.toLocaleString('en-IN')}
                      </h4>
                      <p className="text-[10px] text-slate-400 font-semibold uppercase mt-0.5">
                        Submitted: {new Date(lead.createdAt).toLocaleDateString('en-IN')}
                      </p>
                    </div>

                    <div className="text-left sm:text-right space-y-2">
                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${
                        lead.status === 'Approved' || lead.status === 'Disbursed'
                          ? 'bg-success/15 text-success'
                          : lead.status === 'Rejected'
                          ? 'bg-danger/15 text-danger'
                          : 'bg-primary/15 text-primary dark:text-accent dark:bg-accent/15'
                      }`}>
                        Status: {lead.status}
                      </span>
                      <p className="text-xs text-slate-400">
                        Priority: <strong className="text-slate-650 dark:text-slate-350">{lead.priority}</strong>
                      </p>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-8 text-slate-450">
                You have no active applications registered under this phone. Click &quot;Apply Now&quot; on the website to submit.
              </div>
            )}
          </div>

          {/* Document list repository */}
          <div className="p-6 rounded-3xl glass border border-slate-200/40 dark:border-slate-800 space-y-4">
            <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
              Document Vault
            </h3>
            <div className="grid sm:grid-cols-3 gap-4">
              <div className="p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl flex flex-col justify-between h-32 border border-slate-200/40 dark:border-slate-800">
                <FileText className="w-6 h-6 text-primary dark:text-accent" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">PAN CARD</span>
                  <span className="text-xs font-bold text-success">Approved ✓</span>
                </div>
              </div>
              <div className="p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl flex flex-col justify-between h-32 border border-slate-200/40 dark:border-slate-800">
                <FileText className="w-6 h-6 text-primary dark:text-accent" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">AADHAAR CARD</span>
                  <span className="text-xs font-bold text-success">Approved ✓</span>
                </div>
              </div>
              <div className="p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl flex flex-col justify-between h-32 border border-slate-200/40 dark:border-slate-800">
                <FileText className="w-6 h-6 text-slate-400" />
                <div>
                  <span className="text-[10px] text-slate-400 font-semibold block uppercase">SALARY SLIPS</span>
                  <span className="text-xs font-bold text-primary dark:text-accent">Pending Verification</span>
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right column: support tickets, advisor info */}
        <div className="space-y-6">
          
          {/* Advisor Quick Action Card */}
          <div className="p-6 rounded-3xl bg-slate-900 text-white border border-slate-800 space-y-4">
            <h3 className="font-display font-extrabold text-base text-white">
              Advisor Support Hub
            </h3>
            <p className="font-sans text-xs text-slate-400 leading-relaxed">
              If you have any queries, you can request support or call your assigned Huzurabad advisor.
            </p>
            <div className="space-y-2 text-xs">
              <p>Name: <strong className="text-white">{representative.name}</strong></p>
              <p>Phone: <strong className="text-accent">{representative.phone}</strong></p>
              <p>Email: <strong className="text-accent">{representative.email}</strong></p>
            </div>
            <div className="grid grid-cols-2 gap-2 pt-2">
              <a href="tel:9949822071" className="text-center py-2.5 rounded-xl bg-primary text-xs font-semibold text-white shadow-md">
                Call Now
              </a>
              <a href="https://wa.me/919949822071" target="_blank" rel="noreferrer" className="text-center py-2.5 rounded-xl bg-green-600 text-xs font-semibold text-white shadow-md">
                WhatsApp
              </a>
            </div>
          </div>

          {/* Support Ticket Section */}
          <div className="p-6 rounded-3xl glass border border-slate-200/40 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                Support Tickets
              </h3>
              <button
                onClick={() => setShowApplyTicket(!showApplyTicket)}
                className="p-1 rounded-lg bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent cursor-pointer"
              >
                <Plus className="w-4.5 h-4.5" />
              </button>
            </div>

            {showApplyTicket && (
              <form onSubmit={handleCreateTicket} className="space-y-3 p-3 bg-slate-100/50 dark:bg-slate-800/40 border border-slate-200/50 dark:border-slate-800 rounded-2xl animate-in slide-in-from-top duration-200">
                <input
                  type="text"
                  required
                  placeholder="Ticket Subject"
                  value={ticketSubject}
                  onChange={(e) => setTicketSubject(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs rounded-xl outline-none focus:ring-1"
                />
                <textarea
                  required
                  rows={2}
                  placeholder="Write message details..."
                  value={ticketMessage}
                  onChange={(e) => setTicketMessage(e.target.value)}
                  className="w-full px-3 py-2 border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-950 text-xs rounded-xl outline-none focus:ring-1"
                />
                <button
                  type="submit"
                  className="w-full py-2 bg-primary text-white text-xs font-bold rounded-lg flex items-center justify-center gap-1 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Ticket</span>
                </button>
              </form>
            )}

            {/* Tickets lists */}
            <div className="space-y-3">
              {tickets.map((t) => (
                <div key={t.id} className="p-3 bg-slate-50/50 dark:bg-slate-800/30 rounded-xl border border-slate-200/30 dark:border-slate-800 text-xs space-y-1.5">
                  <div className="flex justify-between items-center">
                    <span className="font-bold text-slate-800 dark:text-white">{t.subject}</span>
                    <span className={`px-2 py-0.5 rounded text-[8px] font-bold ${
                      t.status === 'Replied' ? 'bg-success/20 text-success' : 'bg-primary/20 text-primary dark:text-accent'
                    }`}>
                      {t.status}
                    </span>
                  </div>
                  <p className="text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                    {t.message}
                  </p>
                  <span className="text-[9px] text-slate-400 block font-semibold">
                    {new Date(t.date).toLocaleDateString('en-IN')}
                  </span>
                </div>
              ))}
            </div>

          </div>

        </div>

      </div>

    </div>
  );
}
