"use client";

import React, { useState, useEffect } from 'react';
import { Landmark, TrendingUp, Users, DollarSign, Download, Plus, Trash, Check, Edit3, Settings } from 'lucide-react';
import { DigiDb, Lead, FAQ, Blog, BankPartner, Employee } from '@/lib/db';

export default function AdminPanel() {
  const [leads, setLeads] = useState<Lead[]>([]);
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [banks, setBanks] = useState<BankPartner[]>([]);
  const [employees, setEmployees] = useState<Employee[]>([]);

  // Navigation sub-tabs inside Admin Panel
  const [adminTab, setAdminTab] = useState<'analytics' | 'leads' | 'faqs' | 'blogs' | 'banks' | 'employees'>('analytics');

  // New Content Forms state
  const [showAddFaq, setShowAddFaq] = useState(false);
  const [newFaqQ, setNewFaqQ] = useState('');
  const [newFaqA, setNewFaqA] = useState('');
  const [newFaqCat, setNewFaqCat] = useState('General');

  // Revenue Settings
  const [commissionRate, setCommissionRate] = useState(1.0); // 1% commission average

  useEffect(() => {
    const loadData = async () => {
      const [leadsData, faqsData, blogsData, employeesData] = await Promise.all([
        DigiDb.getLeadsAsync(),
        DigiDb.getFAQsAsync(),
        DigiDb.getBlogsAsync(),
        DigiDb.getEmployeesAsync()
      ]);
      setLeads(leadsData);
      setFaqs(faqsData);
      setBlogs(blogsData);
      setEmployees(employeesData);
      setBanks(DigiDb.getBankPartners());
    };
    loadData();
  }, []);

  const refreshData = async () => {
    const [leadsData, faqsData, blogsData, employeesData] = await Promise.all([
      DigiDb.getLeadsAsync(),
      DigiDb.getFAQsAsync(),
      DigiDb.getBlogsAsync(),
      DigiDb.getEmployeesAsync()
    ]);
    setLeads(leadsData);
    setFaqs(faqsData);
    setBlogs(blogsData);
    setEmployees(employeesData);
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

  // CSV Exporter for CRM Lead Management
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

  // Metrics calculators
  const totalLeadsCount = leads.length;
  const approvedLeadsCount = leads.filter(l => l.status === 'Approved' || l.status === 'Disbursed').length;
  const rejectedLeadsCount = leads.filter(l => l.status === 'Rejected').length;
  const conversionRate = totalLeadsCount > 0 ? ((approvedLeadsCount / totalLeadsCount) * 100).toFixed(1) : '0';

  // Calculate simulated revenue based on disbursed loan amounts
  const disbursedAmountSum = leads
    .filter(l => l.status === 'Disbursed')
    .reduce((sum, l) => sum + l.loanAmount, 0);
  const calculatedRevenue = (disbursedAmountSum * (commissionRate / 100));

  return (
    <div className="py-8 max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-8">
      {/* Header with quick CSV Exporter */}
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 border-b border-slate-200 dark:border-slate-800 pb-6">
        <div>
          <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
            DIGI LOANS - SuperAdmin Platform
          </h2>
          <p className="text-xs text-slate-400 font-semibold uppercase tracking-wider mt-1">
            Corporate ID: STAR-DL-HUZURABAD | Security Clearance Level: Maximum
          </p>
        </div>
        <button
          onClick={handleExportCSV}
          className="flex items-center gap-1.5 px-4.5 py-3 rounded-xl bg-primary hover:opacity-95 text-white text-xs font-bold shadow-md shadow-primary/10 transition-all cursor-pointer"
        >
          <Download className="w-4 h-4" />
          <span>Export leads data (CSV)</span>
        </button>
      </div>

      {/* Analytics Dashboard Grid Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6">
        <div className="p-5 rounded-2xl glass border border-slate-200/40 dark:border-slate-850 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-accent">
            <Users className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Total leads</span>
            <span className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white">{totalLeadsCount}</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass border border-slate-200/40 dark:border-slate-850 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-green-150 text-green-700 flex items-center justify-center bg-green-600/10">
            <Landmark className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Conversion rate</span>
            <span className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white">{conversionRate}%</span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass border border-slate-200/40 dark:border-slate-850 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-red-150 text-red-700 flex items-center justify-center bg-red-650/10">
            <TrendingUp className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Rejected Rate</span>
            <span className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white">
              {totalLeadsCount > 0 ? ((rejectedLeadsCount / totalLeadsCount) * 100).toFixed(0) : 0}%
            </span>
          </div>
        </div>

        <div className="p-5 rounded-2xl glass border border-slate-200/40 dark:border-slate-850 flex items-center gap-4">
          <div className="w-10 h-10 rounded-xl bg-amber-500/10 flex items-center justify-center text-amber-500">
            <DollarSign className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] text-slate-400 font-bold uppercase block">Est Revenue ({commissionRate}%)</span>
            <span className="text-lg sm:text-2xl font-black text-slate-800 dark:text-white">
              ₹{calculatedRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}
            </span>
          </div>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex border-b border-slate-200 dark:border-slate-800 pb-3 gap-6 overflow-x-auto">
        {(['analytics', 'leads', 'faqs', 'banks', 'employees'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setAdminTab(tab)}
            className={`text-xs sm:text-sm font-bold pb-2 relative transition-all uppercase tracking-wider cursor-pointer shrink-0 ${
              adminTab === tab
                ? 'text-primary dark:text-accent border-b-2 border-primary dark:border-accent'
                : 'text-slate-400 hover:text-slate-600'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {adminTab === 'analytics' && (
        <div className="grid lg:grid-cols-2 gap-8">
          
          {/* Revenue calculator widget */}
          <div className="p-6 rounded-3xl glass border border-slate-200/40 dark:border-slate-800 space-y-4">
            <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
              Commission & Revenue Modeler
            </h3>
            <p className="font-sans text-xs text-slate-500 dark:text-slate-400">
              Configure advisory payouts. Calculate commissions from total active disbursements.
            </p>
            
            <div className="space-y-4 pt-4">
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold">
                  <span>Partner Commission Rate</span>
                  <span className="text-primary dark:text-accent">{commissionRate}%</span>
                </div>
                <input
                  type="range"
                  min={0.25}
                  max={5}
                  step={0.05}
                  value={commissionRate}
                  onChange={(e) => setCommissionRate(Number(e.target.value))}
                  className="w-full h-1.5 rounded-lg bg-slate-200 dark:bg-slate-700 accent-primary outline-none cursor-pointer"
                />
              </div>

              <div className="p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl space-y-3 text-xs">
                <div className="flex justify-between">
                  <span>Total Active Disbursements:</span>
                  <span className="font-bold">₹{disbursedAmountSum.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex justify-between border-t border-slate-200/50 dark:border-slate-700 pt-2 font-bold text-slate-900 dark:text-white">
                  <span>DIGI LOANS Net Share:</span>
                  <span className="text-primary dark:text-accent">₹{calculatedRevenue.toLocaleString('en-IN', { maximumFractionDigits: 2 })}</span>
                </div>
              </div>
            </div>
          </div>

          {/* Quick CMS Settings Summary */}
          <div className="p-6 rounded-3xl glass border border-slate-200/40 dark:border-slate-800 space-y-4">
            <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
              Advisory Office Settings
            </h3>
            <div className="space-y-3 text-xs pt-2">
              <div className="flex justify-between">
                <span className="text-slate-400">Active branches:</span>
                <span className="font-bold">Huzurabad HQ, Warangal Branch</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">Lead representatives:</span>
                <span className="font-bold">sneha, rohan</span>
              </div>
              <div className="flex justify-between">
                <span className="text-slate-400">DB backups:</span>
                <span className="text-success font-bold">Enabled (Supabase Sync)</span>
              </div>
            </div>
          </div>

        </div>
      )}

      {adminTab === 'leads' && (
        <div className="p-6 rounded-3xl glass border border-slate-200/40 dark:border-slate-800 space-y-4">
          <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">
            Lead Management CRM Database
          </h3>
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
                    <td className="py-3.5 px-2 font-bold text-slate-850 dark:text-white">{l.fullName}</td>
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

      {adminTab === 'faqs' && (
        <div className="space-y-6">
          
          {/* Add FAQ form */}
          <div className="p-6 rounded-3xl glass border border-slate-200/40 dark:border-slate-800 space-y-4">
            <div className="flex justify-between items-center">
              <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                Website Content FAQ Manager
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
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
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
                    className="w-full px-4 py-2.5 bg-white dark:bg-slate-950 text-xs rounded-xl border border-slate-200 dark:border-slate-800 outline-none"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-[10px] uppercase font-bold text-slate-400">Category</label>
                  <select
                    value={newFaqCat}
                    onChange={(e) => setNewFaqCat(e.target.value)}
                    className="px-3 py-2 border border-slate-250 dark:border-slate-800 bg-white dark:bg-slate-950 text-xs rounded-xl"
                  >
                    <option>General</option>
                    <option>Eligibility</option>
                    <option>Interest Rates</option>
                    <option>Processing Time</option>
                    <option>Documents</option>
                    <option>CIBIL</option>
                  </select>
                </div>
                <button type="submit" className="px-6 py-2 bg-primary text-white text-xs font-bold rounded-lg shadow-sm">
                  Save FAQ
                </button>
              </form>
            )}
          </div>

          {/* List of current FAQs */}
          <div className="p-6 rounded-3xl glass border border-slate-200/40 dark:border-slate-800 space-y-3">
            <h4 className="font-display font-extrabold text-sm text-slate-400 uppercase tracking-wider">
              FAQ Database List
            </h4>
            <div className="space-y-3">
              {faqs.map((faq) => (
                <div key={faq.id} className="p-4 bg-slate-105/60 dark:bg-slate-800/20 rounded-2xl flex justify-between gap-4 border border-slate-200/30 text-xs">
                  <div>
                    <h5 className="font-bold text-slate-800 dark:text-white">{faq.question}</h5>
                    <p className="text-slate-500 dark:text-slate-400 mt-1 leading-normal">{faq.answer}</p>
                    <span className="inline-block mt-2 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[9px] font-bold text-slate-450 uppercase">
                      {faq.category}
                    </span>
                  </div>
                  <button
                    onClick={() => handleDeleteFaq(faq.id)}
                    className="p-2 rounded bg-red-650/10 hover:bg-red-600 hover:text-white text-danger transition-colors cursor-pointer shrink-0 align-self-start"
                  >
                    <Trash className="w-4 h-4" />
                  </button>
                </div>
              ))}
            </div>
          </div>

        </div>
      )}

      {adminTab === 'banks' && (
        <div className="p-6 rounded-3xl glass border border-slate-200/40 dark:border-slate-800 space-y-4">
          <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
            Bank Partner Configurations
          </h3>
          <p className="font-sans text-xs text-slate-500 dark:text-slate-400">
            Activate or deactivate lenders shown dynamically in quote calculators.
          </p>
          <div className="grid sm:grid-cols-2 gap-4 pt-2">
            {banks.map((bank) => (
              <div key={bank.id} className="p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl flex justify-between items-center border border-slate-200/40 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{bank.logo}</span>
                  <div>
                    <span className="font-bold text-slate-800 dark:text-white text-xs">{bank.name}</span>
                    <span className="block text-[10px] text-slate-400">Interest rate range: {bank.interestRate}</span>
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

      {adminTab === 'employees' && (
        <div className="p-6 rounded-3xl glass border border-slate-200/40 dark:border-slate-800 space-y-4">
          <h3 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
            Employee Accounts List
          </h3>
          <div className="space-y-3">
            {employees.map((emp) => (
              <div key={emp.id} className="p-4 bg-slate-100/50 dark:bg-slate-800/30 rounded-2xl flex justify-between items-center border border-slate-200/40 dark:border-slate-800">
                <div className="flex items-center gap-3">
                  <span className="text-2xl">{emp.avatar}</span>
                  <div>
                    <span className="font-bold text-slate-850 dark:text-white text-xs block">{emp.name}</span>
                    <span className="text-[10px] text-slate-400">{emp.role} | {emp.branch} | {emp.email}</span>
                  </div>
                </div>
                <span className="px-2.5 py-1 bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent font-bold text-[9px] uppercase rounded-full">
                  Verified ✓
                </span>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
}
