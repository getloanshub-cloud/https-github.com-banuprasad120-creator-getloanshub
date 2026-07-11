"use client";

import React, { useState, useEffect } from 'react';
import { ShieldCheck, MessageCircle, Phone, Calendar, Search, Filter, Plus, ChevronRight, CheckSquare } from 'lucide-react';
import { DigiDb, Lead, Appointment } from '@/lib/db';

export default function EmployeePortal() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [appointments, setAppointments] = useState<Appointment[]>([]);
  const [selectedLead, setSelectedLead] = useState<Lead | null>(null);
  
  // Call Logger form
  const [showCallForm, setShowCallForm] = useState(false);
  const [callNotes, setCallNotes] = useState('');
  const [nextCall, setNextCall] = useState('');
  const [callDuration, setCallDuration] = useState('2m 30s');

  // Search & Filter state
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');

  useEffect(() => {
    const loadData = async () => {
      const [leadsData, aptsData] = await Promise.all([
        DigiDb.getLeadsAsync(),
        DigiDb.getAppointmentsAsync()
      ]);
      setLeads(leadsData);
      setAppointments(aptsData);
    };
    loadData();
  }, []);

  const refreshData = async () => {
    const leadsData = await DigiDb.getLeadsAsync();
    setLeads(leadsData);
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

  const filteredLeads = leads.filter(l => {
    const matchesSearch = l.fullName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          l.mobileNumber.includes(searchTerm) || 
                          l.loanType.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'All' || l.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-200 dark:border-slate-800 pb-6 flex justify-between items-center">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-primary dark:text-accent" />
            <span>Employee CRM Hub</span>
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
            Get Loans Hub | Huzurabad Advisor Profile
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid lg:grid-cols-12 gap-8 items-start">
        
        {/* Left Side: Leads List Table */}
        <div className="lg:col-span-7 space-y-6">
          <div className="p-6 rounded-3xl glass border border-slate-200/40 dark:border-slate-800 space-y-4">
            
            {/* Search and filter controls */}
            <div className="flex flex-col sm:flex-row gap-2 justify-between">
              <div className="relative flex-1">
                <Search className="w-4 h-4 text-slate-400 absolute left-3 top-3.5" />
                <input
                  type="text"
                  placeholder="Search lead by name, phone, product..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  className="w-full pl-9 pr-4 py-2.5 bg-white/50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                />
              </div>

              <select
                value={statusFilter}
                onChange={(e) => setStatusFilter(e.target.value)}
                className="px-3.5 py-2.5 bg-white/50 dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none font-semibold text-slate-700 dark:text-slate-300"
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

            {/* List */}
            <div className="space-y-3">
              <h3 className="font-display font-extrabold text-sm text-slate-400 uppercase tracking-wider">
                Assigned leads ({filteredLeads.length})
              </h3>
              {filteredLeads.length > 0 ? (
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
                      <div className="space-y-1">
                        <div className="flex items-center gap-2">
                          <span className="font-bold text-slate-800 dark:text-white text-xs sm:text-sm">{lead.fullName}</span>
                          <span className="text-[9px] font-bold px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-450 uppercase">
                            {lead.loanType}
                          </span>
                        </div>
                        <p className="text-[10px] text-slate-400 font-semibold">
                          Phone: {lead.mobileNumber} | Amount: ₹{lead.loanAmount.toLocaleString('en-IN')}
                        </p>
                      </div>

                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-0.5 rounded-full text-[9px] font-bold ${
                          lead.priority === 'High' ? 'bg-danger/25 text-danger' : 'bg-slate-100 text-slate-500'
                        }`}>
                          {lead.priority}
                        </span>
                        <span className="px-2 py-0.5 rounded bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent font-bold text-[9px] uppercase">
                          {lead.status}
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              ) : (
                <div className="text-center py-8 text-slate-400 text-xs">
                  No matching leads located in the CRM.
                </div>
              )}
            </div>

          </div>
        </div>

        {/* Right Side: Lead Workspace Detail Pane */}
        <div className="lg:col-span-5">
          {selectedLead ? (
            <div className="p-6 rounded-3xl glass border border-primary/20 dark:border-accent/20 shadow-md space-y-6">
              
              {/* Header Info */}
              <div className="border-b border-slate-200 dark:border-slate-800 pb-4 flex justify-between items-start">
                <div>
                  <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
                    {selectedLead.fullName}
                  </h3>
                  <p className="text-[10px] text-slate-400 font-semibold uppercase">
                    Lead ID: {selectedLead.id} | Source: {selectedLead.source}
                  </p>
                </div>
                <div className="flex gap-1.5">
                  <a href={`tel:${selectedLead.mobileNumber}`} className="p-2 rounded-xl bg-primary/10 hover:bg-primary/20 text-primary transition-colors cursor-pointer">
                    <Phone className="w-4 h-4" />
                  </a>
                  <a href={`https://wa.me/91${selectedLead.mobileNumber}`} target="_blank" rel="noreferrer" className="p-2 rounded-xl bg-green-600/10 hover:bg-green-600/20 text-green-600 transition-colors cursor-pointer">
                    <MessageCircle className="w-4 h-4" />
                  </a>
                </div>
              </div>

              {/* Status Update Dropdown */}
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Current Lead Status</label>
                <select
                  value={selectedLead.status}
                  onChange={(e) => handleUpdateStatus(selectedLead.id, e.target.value as Lead['status'])}
                  className="w-full px-3.5 py-2.5 bg-slate-100 dark:bg-slate-800 text-xs rounded-xl border border-slate-200 dark:border-slate-700 outline-none font-bold text-slate-800 dark:text-white"
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

              {/* Call Logger Toggle Form */}
              <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
                <div className="flex justify-between items-center">
                  <span className="text-[10px] uppercase font-bold text-slate-400">Call Log & CRM Tracker</span>
                  <button
                    onClick={() => setShowCallForm(!showCallForm)}
                    className="flex items-center gap-1 text-[10px] font-bold text-primary dark:text-accent cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>Log Call Details</span>
                  </button>
                </div>

                {showCallForm && (
                  <form onSubmit={handleAddCallLog} className="p-3 bg-slate-50 dark:bg-slate-900/50 rounded-2xl border border-slate-200/50 dark:border-slate-850 space-y-3 animate-in slide-in-from-top-1">
                    <textarea
                      required
                      rows={2}
                      placeholder="Enter details of conversation..."
                      value={callNotes}
                      onChange={(e) => setCallNotes(e.target.value)}
                      className="w-full px-3 py-2 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-xl outline-none"
                    />
                    <div className="grid sm:grid-cols-2 gap-2">
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase block">Next follow-up date</label>
                        <input
                          type="date"
                          value={nextCall}
                          onChange={(e) => setNextCall(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg outline-none"
                        />
                      </div>
                      <div className="space-y-1">
                        <label className="text-[8px] font-bold text-slate-400 uppercase block">Call Duration</label>
                        <input
                          type="text"
                          value={callDuration}
                          onChange={(e) => setCallDuration(e.target.value)}
                          className="w-full px-2.5 py-1.5 bg-white dark:bg-slate-950 border border-slate-200 dark:border-slate-800 text-xs rounded-lg outline-none"
                        />
                      </div>
                    </div>
                    <button
                      type="submit"
                      className="w-full py-2 bg-primary text-white font-bold text-[10px] rounded-lg shadow-sm"
                    >
                      Save Call Record
                    </button>
                  </form>
                )}
              </div>

              {/* Documents Checklist for Lead Verification */}
              {selectedLead.documents && selectedLead.documents.length > 0 && (
                <div className="space-y-2 border-t border-slate-200 dark:border-slate-800 pt-4">
                  <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Documents Verification</span>
                  <div className="space-y-2">
                    {selectedLead.documents.map((doc, idx) => (
                      <div key={idx} className="flex justify-between items-center p-2 rounded-xl bg-slate-100/50 dark:bg-slate-800/30 border border-slate-200/30 text-xs">
                        <span className="font-semibold text-slate-700 dark:text-slate-200">{doc.name}</span>
                        <div className="flex gap-1.5">
                          {doc.status === 'Pending' ? (
                            <>
                              <button
                                onClick={() => handleVerifyDocument(selectedLead.id, idx, 'Approved')}
                                className="px-2 py-1 rounded bg-success/20 hover:bg-success/30 text-success text-[9px] font-bold cursor-pointer"
                              >
                                Approve
                              </button>
                              <button
                                onClick={() => handleVerifyDocument(selectedLead.id, idx, 'Rejected')}
                                className="px-2 py-1 rounded bg-danger/20 hover:bg-danger/30 text-danger text-[9px] font-bold cursor-pointer"
                              >
                                Reject
                              </button>
                            </>
                          ) : (
                            <span className={`px-2 py-1 rounded text-[9px] font-bold ${
                              doc.status === 'Approved' ? 'bg-success/20 text-success' : 'bg-danger/20 text-danger'
                            }`}>
                              {doc.status}
                            </span>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Timeline events history */}
              <div className="space-y-3.5 border-t border-slate-200 dark:border-slate-800 pt-4">
                <span className="text-[10px] uppercase font-bold text-slate-400 block">Lead Audit & Timeline History</span>
                <div className="space-y-3.5 max-h-40 overflow-y-auto pr-1">
                  {selectedLead.timeline.map((event) => (
                    <div key={event.id} className="relative pl-4 border-l border-slate-200 dark:border-slate-800 text-[11px] space-y-0.5">
                      <div className="absolute left-[-4.5px] top-1.5 w-2.5 h-2.5 bg-primary dark:bg-accent rounded-full" />
                      <div className="flex justify-between text-slate-400 font-bold text-[9px]">
                        <span>{event.title}</span>
                        <span>{new Date(event.date).toLocaleDateString('en-IN')}</span>
                      </div>
                      <p className="text-slate-650 dark:text-slate-350">{event.description}</p>
                      <span className="text-[8px] text-slate-400 block font-semibold">By: {event.createdBy}</span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          ) : (
            <div className="h-48 border border-dashed border-slate-200 dark:border-slate-800 rounded-3xl flex items-center justify-center text-slate-400 text-xs">
              Select a customer lead from the list to manage call notes and verification logs.
            </div>
          )}
        </div>

      </div>

    </div>
  );
}
