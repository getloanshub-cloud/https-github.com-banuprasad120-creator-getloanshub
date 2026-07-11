"use client";

import React, { useState, useEffect } from 'react';
import { Send, Upload, Sparkles, FileText, CheckCircle2, ChevronRight, ChevronLeft } from 'lucide-react';
import { motion } from 'framer-motion';
import { DigiDb } from '@/lib/db';

interface ApplyFormProps {
  defaultLoanType?: string;
  onSuccess?: () => void;
}

const ConfettiShower = () => {
  const particles = Array.from({ length: 50 });
  return (
    <div className="absolute inset-0 pointer-events-none overflow-hidden rounded-3xl z-50">
      {particles.map((_, i) => {
        const x = Math.random() * 100;
        const delay = Math.random() * 0.8;
        const duration = 1.5 + Math.random() * 1.5;
        const colors = ['bg-[#0A4D9D]', 'bg-[#1E64B8]', 'bg-[#F5B301]', 'bg-emerald-500', 'bg-rose-500'];
        const randomColor = colors[Math.floor(Math.random() * colors.length)];
        return (
          <motion.div
            key={i}
            initial={{ y: -20, x: `${x}%`, opacity: 1, scale: 0.5 + Math.random() * 0.5, rotate: 0 }}
            animate={{ 
              y: '110%', 
              x: `${x + (Math.random() * 20 - 10)}%`, 
              opacity: 0,
              rotate: 360 + Math.random() * 360
            }}
            transition={{ duration, delay, ease: 'easeOut' }}
            className={`absolute w-1.5 h-3 ${randomColor} rounded-sm`}
          />
        );
      })}
    </div>
  );
};

export default function ApplyForm({ defaultLoanType = 'Personal Loan', onSuccess }: ApplyFormProps) {
  const [step, setStep] = useState(1);

  // Form Fields
  const [fullName, setFullName] = useState('');
  const [mobileNumber, setMobileNumber] = useState('');
  const [email, setEmail] = useState('');
  const [city, setCity] = useState('');
  const [aadhaar, setAadhaar] = useState('');
  const [pan, setPan] = useState('');
  const [loanType, setLoanType] = useState(defaultLoanType);
  const [loanAmount, setLoanAmount] = useState(500000);
  const [monthlyIncome, setMonthlyIncome] = useState(50000);
  const [occupation, setOccupation] = useState('Salaried');
  const [message, setMessage] = useState('');
  
  // Validation States
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validateField = (name: string, value: string) => {
    let err = '';
    if (name === 'fullName' && value.trim().length < 3) {
      err = 'Name must be at least 3 characters.';
    } else if (name === 'mobileNumber' && !/^[6-9]\d{9}$/.test(value)) {
      err = 'Enter a valid 10-digit Indian mobile number.';
    } else if (name === 'email' && value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)) {
      err = 'Enter a valid email address.';
    } else if (name === 'city' && value.trim().length < 2) {
      err = 'City must be at least 2 characters.';
    } else if (name === 'aadhaar' && value && !/^\d{12}$/.test(value.replace(/\s/g, ''))) {
      err = 'Aadhaar must be exactly 12 digits.';
    } else if (name === 'pan' && value && !/^[A-Z]{5}[0-9]{4}[A-Z]$/.test(value.toUpperCase())) {
      err = 'PAN must match format ABCDE1234F.';
    }
    setErrors(prev => ({ ...prev, [name]: err }));
  };

  // Document Uploads Simulation
  const [selectedFiles, setSelectedFiles] = useState<{ name: string; size: string; type: string }[]>([]);

  useEffect(() => {
    if (defaultLoanType) {
      setLoanType(defaultLoanType);
    }
  }, [defaultLoanType]);

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const filesArray = Array.from(e.target.files).map(f => ({
        name: f.name,
        size: `${(f.size / (1024 * 1024)).toFixed(2)} MB`,
        type: f.type
      }));
      setSelectedFiles(prev => [...prev, ...filesArray]);
    }
  };

  const handleRemoveFile = (index: number) => {
    setSelectedFiles(prev => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (fullName && mobileNumber && city && loanType && loanAmount && monthlyIncome) {
      
      await DigiDb.saveLeadAsync({
        fullName,
        mobileNumber,
        email,
        city,
        loanType,
        loanAmount,
        monthlyIncome,
        occupation,
        message,
        source: 'Website',
        priority: loanAmount > 1000000 ? 'High' : 'Medium',
        tags: ['Web Application'],
        documents: selectedFiles.map(f => ({
          name: f.name,
          url: '#',
          type: f.type,
          status: 'Pending'
        }))
      });

      // Clear Form & Redirect to Success screen
      setStep(4);
      if (onSuccess) {
        onSuccess();
      }
    }
  };

  return (
    <section className="py-12 max-w-2xl mx-auto px-4 sm:px-6 w-full">
      <div className="p-6 sm:p-8 rounded-3xl glass shadow-xl border border-slate-200/50 dark:border-slate-800 relative">
        <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-tr from-accent to-secondary opacity-15 rounded-bl-full -z-10 pointer-events-none" />

        {step !== 4 ? (
          <form onSubmit={handleSubmit} className="space-y-6 text-left">
            <div>
              <h2 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                Apply for Loan
              </h2>
              <p className="text-xs text-slate-400 mt-1">Please provide your details below to instantly match with top lenders.</p>
            </div>

            {/* Fields directly in page layout */}
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
              <input
                type="text"
                required
                placeholder="Enter full name"
                value={fullName}
                onChange={(e) => { setFullName(e.target.value); validateField('fullName', e.target.value); }}
                className={`w-full px-4 h-12 rounded-xl border bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent ${errors.fullName ? 'border-danger focus:ring-danger' : 'border-slate-200 dark:border-slate-800'}`}
              />
              {errors.fullName && <p className="text-[10px] text-danger font-bold leading-none mt-1">{errors.fullName}</p>}
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Mobile Number</label>
                <input
                  type="tel"
                  required
                  placeholder="Enter mobile number"
                  value={mobileNumber}
                  onChange={(e) => { setMobileNumber(e.target.value); validateField('mobileNumber', e.target.value); }}
                  className={`w-full px-4 h-12 rounded-xl border bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent ${errors.mobileNumber ? 'border-danger focus:ring-danger' : 'border-slate-200 dark:border-slate-800'}`}
                />
                {errors.mobileNumber && <p className="text-[10px] text-danger font-bold leading-none mt-1">{errors.mobileNumber}</p>}
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Email Address</label>
                <input
                  type="email"
                  placeholder="Enter email address"
                  value={email}
                  onChange={(e) => { setEmail(e.target.value); validateField('email', e.target.value); }}
                  className={`w-full px-4 h-12 rounded-xl border bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent ${errors.email ? 'border-danger focus:ring-danger' : 'border-slate-200 dark:border-slate-800'}`}
                />
                {errors.email && <p className="text-[10px] text-danger font-bold leading-none mt-1">{errors.email}</p>}
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">City / Town</label>
              <input
                type="text"
                required
                placeholder="Enter city or town name"
                value={city}
                onChange={(e) => { setCity(e.target.value); validateField('city', e.target.value); }}
                className={`w-full px-4 h-12 rounded-xl border bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent ${errors.city ? 'border-danger focus:ring-danger' : 'border-slate-200 dark:border-slate-800'}`}
              />
              {errors.city && <p className="text-[10px] text-danger font-bold leading-none mt-1">{errors.city}</p>}
            </div>

            {/* Divider */}
            <div className="border-t border-slate-200/50 dark:border-slate-800/50 my-6" />

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Loan Product</label>
                <select
                  value={loanType}
                  onChange={(e) => setLoanType(e.target.value)}
                  className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent font-semibold text-slate-700 dark:text-slate-300"
                >
                  <option>Personal Loan</option>
                  <option>Home Loan</option>
                  <option>Doctor Loan</option>
                </select>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] uppercase font-bold text-slate-400">Occupation Category</label>
                <select
                  value={occupation}
                  onChange={(e) => setOccupation(e.target.value)}
                  className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent font-semibold text-slate-700 dark:text-slate-300"
                >
                  <option>Salaried</option>
                  <option>Self-Employed Professional</option>
                  <option>Business Owner / Trader</option>
                  <option>Other / Freelance</option>
                </select>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex justify-between">
                <span>Required Loan Amount</span>
                <span className="font-extrabold text-primary dark:text-accent">₹{loanAmount.toLocaleString('en-IN')}</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min={50000}
                  max={10000000}
                  value={loanAmount || ''}
                  onChange={(e) => setLoanAmount(Number(e.target.value))}
                  className="w-full pl-8 pr-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent font-semibold text-slate-800 dark:text-white"
                  placeholder="Enter custom loan amount"
                />
              </div>
              <input
                type="range"
                min={50000}
                max={10000000}
                step={50000}
                value={loanAmount > 10000000 ? 10000000 : loanAmount}
                onChange={(e) => setLoanAmount(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-primary dark:accent-accent outline-none cursor-pointer"
              />
            </div>

            <div className="space-y-2">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex justify-between">
                <span>Net Monthly Salary / Income</span>
                <span className="font-extrabold text-slate-700 dark:text-slate-200">₹{monthlyIncome.toLocaleString('en-IN')}</span>
              </label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 pl-4 flex items-center text-slate-400 font-bold text-sm">
                  ₹
                </span>
                <input
                  type="number"
                  min={10000}
                  max={500000}
                  value={monthlyIncome || ''}
                  onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                  className="w-full pl-8 pr-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent font-semibold text-slate-800 dark:text-white"
                  placeholder="Enter custom monthly salary/income"
                />
              </div>
              <input
                type="range"
                min={10000}
                max={500000}
                step={5000}
                value={monthlyIncome > 500000 ? 500000 : monthlyIncome}
                onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-primary dark:accent-accent outline-none cursor-pointer"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400">Additional Message / Remarks</label>
              <textarea
                rows={2}
                placeholder="Enter details..."
                value={message}
                onChange={(e) => setMessage(e.target.value)}
                className="w-full px-4 py-3 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent"
              />
            </div>



            {/* Submit Button */}
            <button
              type="submit"
              disabled={!fullName || !mobileNumber || !city || Object.values(errors).some(x => x)}
              className="w-full h-[52px] bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-sm shadow-lg shadow-primary/20 hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-1.5 disabled:opacity-40"
            >
              <Send className="w-4 h-4" />
              <span>Submit Application</span>
            </button>
          </form>
        ) : (
          /* Success screen */
          <div className="text-center py-8 space-y-6 relative">
            <ConfettiShower />
            <div className="w-16 h-16 bg-success/15 border border-success text-success rounded-full flex items-center justify-center mx-auto">
              <CheckCircle2 className="w-8 h-8 font-bold" />
            </div>
            <div>
              <h3 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">
                Application Submitted!
              </h3>
              <p className="text-sm text-slate-500 dark:text-slate-400 mt-2">
                Thank you for choosing DIGI LOANS. Your request has been saved to the CRM database.
              </p>
            </div>

            <div className="p-5 bg-slate-100/50 dark:bg-slate-800/40 rounded-2xl max-w-sm mx-auto space-y-3.5 text-xs text-left">
              <p className="text-slate-600 dark:text-slate-350 font-medium">
                <strong>Lead Advisor:</strong> Loans Advisor
              </p>
              <p className="text-slate-655 dark:text-slate-350 leading-relaxed">
                <strong>Next Step:</strong> Our advisors will review your income papers and reach out to you within 30 minutes.
              </p>
              <div className="flex gap-2 pt-3 border-t border-slate-200/50 dark:border-slate-800/50">
                <a 
                  href="tel:9000100262" 
                  className="flex-1 text-center h-10 rounded-xl bg-primary text-white font-bold text-[11px] flex items-center justify-center"
                >
                  Call Office
                </a>
                <a 
                  href="https://wa.me/919000100262" 
                  target="_blank" 
                  rel="noreferrer" 
                  className="flex-1 text-center h-10 rounded-xl bg-green-600 text-white font-bold text-[11px] flex items-center justify-center gap-1"
                >
                  WhatsApp
                </a>
              </div>
            </div>

            <button
              onClick={() => { setStep(1); setSelectedFiles([]); setFullName(''); setMobileNumber(''); setEmail(''); setCity(''); setAadhaar(''); setPan(''); setMessage(''); }}
              className="h-11 px-6 rounded-xl border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-850 cursor-pointer"
            >
              Submit Another Application
            </button>
          </div>
        )}

      </div>
    </section>
  );
}
