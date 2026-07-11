"use client";

import React, { useState } from 'react';
import { Calculator } from 'lucide-react';
import { motion } from 'framer-motion';

export default function CalculatorSection() {
  // EMI Calculator State
  const [emiAmount, setEmiAmount] = useState(1000000); // 10L default
  const [emiRate, setEmiRate] = useState(8.5); // 8.5% default
  const [emiTenure, setEmiTenure] = useState(15); // 15 years default

  // EMI Calculations
  const calculateEMI = () => {
    const P = emiAmount;
    const r = emiRate / 12 / 100;
    const n = emiTenure * 12;
    
    const emiVal = (P * r * Math.pow(1 + r, n)) / (Math.pow(1 + r, n) - 1);
    
    const monthlyEmi = isFinite(emiVal) ? Math.round(emiVal) : 0;
    const totalAmount = monthlyEmi * n;
    const totalInterest = totalAmount - P;

    return {
      monthlyEmi,
      totalInterest: Math.max(0, totalInterest),
      totalAmount: Math.max(P, totalAmount)
    };
  };

  const { monthlyEmi, totalInterest, totalAmount } = calculateEMI();

  // Ratio breakdown
  const totalVal = emiAmount + totalInterest;
  const principalPercent = Math.round((emiAmount / totalVal) * 100) || 0;
  const interestPercent = 100 - principalPercent;

  return (
    <section className="section-py bg-slate-50 dark:bg-slate-900/50" id="calculators">
      <div className="container-custom">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider bg-primary/5 dark:bg-accent/10 px-3.5 py-1.5 rounded-full">
            Financial Suite
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-4">
            Calculate your EMI Instantly
          </h2>
          <p className="font-sans text-slate-550 dark:text-slate-400 mt-3 text-sm sm:text-base">
            Interact with our premium tools to plan your budget and monthly repayments.
          </p>
        </div>

        {/* Main Section */}
        <div className="overflow-hidden">
          <div className="grid lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto">
            {/* Sliders Input */}
            <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass shadow-sm border border-slate-200/40 dark:border-slate-800 space-y-8 flex flex-col justify-center text-left">
              
              {/* Amount Slider */}
              <div className="space-y-3 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all hover:border-primary/20 dark:hover:border-accent/20 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Loan Amount</span>
                  <div className="flex items-center gap-1 bg-primary/5 dark:bg-accent/5 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800 text-primary dark:text-accent font-extrabold text-xs sm:text-sm">
                    <span className="text-slate-400 font-bold">₹</span>
                    <input
                      type="number"
                      value={emiAmount || ''}
                      onChange={(e) => setEmiAmount(Number(e.target.value))}
                      className="w-24 bg-transparent text-primary dark:text-accent font-extrabold text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                  </div>
                </div>
                <input
                  type="range"
                  min={100000}
                  max={50000000}
                  step={100000}
                  value={Math.min(50000000, Math.max(100000, emiAmount))}
                  onChange={(e) => setEmiAmount(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-primary dark:accent-accent outline-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>₹1 Lakh</span>
                  <span>₹5 Crores</span>
                </div>
              </div>

              {/* Interest Rate Slider */}
              <div className="space-y-3 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all hover:border-primary/20 dark:hover:border-accent/20 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Interest Rate (p.a.)</span>
                  <div className="flex items-center gap-1 bg-primary/5 dark:bg-accent/5 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800 text-primary dark:text-accent font-extrabold text-xs sm:text-sm">
                    <input
                      type="number"
                      step="0.1"
                      value={emiRate || ''}
                      onChange={(e) => setEmiRate(Number(e.target.value))}
                      className="w-12 bg-transparent text-primary dark:text-accent font-extrabold text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-slate-400 font-bold">%</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={5}
                  max={24}
                  step={0.1}
                  value={Math.min(24, Math.max(5, emiRate))}
                  onChange={(e) => setEmiRate(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-primary dark:accent-accent outline-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>5%</span>
                  <span>24%</span>
                </div>
              </div>

              {/* Tenure Slider */}
              <div className="space-y-3 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/30 transition-all hover:border-primary/20 dark:hover:border-accent/20 hover:shadow-md">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-slate-700 dark:text-slate-300">Tenure (Years)</span>
                  <div className="flex items-center gap-1 bg-primary/5 dark:bg-accent/5 px-3 py-1 rounded-xl border border-slate-200 dark:border-slate-800 text-primary dark:text-accent font-extrabold text-xs sm:text-sm">
                    <input
                      type="number"
                      value={emiTenure || ''}
                      onChange={(e) => setEmiTenure(Number(e.target.value))}
                      className="w-12 bg-transparent text-primary dark:text-accent font-extrabold text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                    />
                    <span className="text-slate-450 text-[10px] font-bold">Years</span>
                  </div>
                </div>
                <input
                  type="range"
                  min={1}
                  max={30}
                  step={1}
                  value={Math.min(30, Math.max(1, emiTenure))}
                  onChange={(e) => setEmiTenure(Number(e.target.value))}
                  className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-primary dark:accent-accent outline-none cursor-pointer"
                />
                <div className="flex justify-between text-[10px] font-bold text-slate-400">
                  <span>1 Year</span>
                  <span>30 Years</span>
                </div>
              </div>
            </div>

            {/* Results Display */}
            <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-secondary text-white shadow-xl flex flex-col justify-between relative overflow-hidden text-left">
              <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full blur-2xl" />
              
              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider text-accent/80 block mb-1">
                  Estimated Payment Breakdown
                </span>
                <p className="text-xs text-slate-305">Monthly Installment</p>
                <h3 className="text-3xl sm:text-4xl font-extrabold tracking-tight mt-1 text-white">
                  ₹{monthlyEmi.toLocaleString('en-IN')}
                </h3>
              </div>

              {/* Visual Chart & Legends */}
              <div className="flex items-center gap-6 my-6 bg-white/5 p-4 rounded-2xl">
                <div className="relative w-24 h-24 shrink-0">
                  <svg className="w-full h-full transform -rotate-90" viewBox="0 0 36 36">
                    <circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke="rgba(255, 255, 255, 0.1)"
                      strokeWidth="3.5"
                    />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke="#ffffff"
                      strokeWidth="3.5"
                      strokeDasharray={`${principalPercent} ${100 - principalPercent}`}
                      strokeDashoffset="0"
                      animate={{ strokeDasharray: `${principalPercent} ${100 - principalPercent}` }}
                      transition={{ duration: 0.3 }}
                    />
                    <motion.circle
                      cx="18"
                      cy="18"
                      r="15.915"
                      fill="transparent"
                      stroke="#F5B301"
                      strokeWidth="3.5"
                      strokeDasharray={`${interestPercent} ${100 - interestPercent}`}
                      strokeDashoffset={-principalPercent}
                      animate={{ 
                        strokeDasharray: `${interestPercent} ${100 - interestPercent}`,
                        strokeDashoffset: -principalPercent
                      }}
                      transition={{ duration: 0.3 }}
                    />
                  </svg>
                  <div className="absolute inset-0 flex flex-col items-center justify-center">
                    <span className="text-[9px] font-extrabold text-white">{principalPercent}%</span>
                    <span className="text-[7px] text-slate-350 tracking-wider uppercase">Principal</span>
                  </div>
                </div>
                
                <div className="flex-1 space-y-2 text-left text-xs">
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-white block shrink-0" />
                    <span className="text-slate-300 font-medium">Principal: {principalPercent}%</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-[#F5B301] block shrink-0" />
                    <span className="text-slate-300 font-medium">Interest: {interestPercent}%</span>
                  </div>
                </div>
              </div>

              <div className="space-y-3.5 mt-2">
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs text-slate-300">Principal Amount</span>
                  <span className="text-xs sm:text-sm font-bold">₹{emiAmount.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between border-b border-white/10 pb-2.5">
                  <span className="text-xs text-slate-300">Total Interest Payable</span>
                  <span className="text-xs sm:text-sm font-bold">₹{totalInterest.toLocaleString('en-IN')}</span>
                </div>
                <div className="flex items-center justify-between pb-1">
                  <span className="text-xs text-slate-300">Total Amount Payable</span>
                  <span className="text-xs sm:text-sm font-bold text-accent">₹{totalAmount.toLocaleString('en-IN')}</span>
                </div>
              </div>

            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
