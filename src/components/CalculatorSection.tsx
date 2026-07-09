"use client";

import React, { useState } from 'react';
import { Calculator, Award, Landmark, TrendingUp, CheckCircle, Percent, AlertCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function CalculatorSection() {
  const [activeTab, setActiveTab] = useState<'emi' | 'eligibility'>('emi');

  // EMI Calculator State
  const [emiAmount, setEmiAmount] = useState(1000000); // 10L default
  const [emiRate, setEmiRate] = useState(8.5); // 8.5% default
  const [emiTenure, setEmiTenure] = useState(15); // 15 years default

  // Eligibility State
  const [age, setAge] = useState(30);
  const [monthlyIncome, setMonthlyIncome] = useState(60000);
  const [existingEmi, setExistingEmi] = useState(10000);
  const [cibilScore, setCibilScore] = useState(750);
  const [empType, setEmpType] = useState<'Salaried' | 'Self-Employed'>('Salaried');

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

  // Eligibility Calculations
  const checkEligibility = () => {
    const maxAllowedEmiRatio = 0.50;
    const eligibleAmountForEmi = (monthlyIncome * maxAllowedEmiRatio) - existingEmi;

    let cibilFactor = 1.0;
    let approvalChance: 'Excellent' | 'Good' | 'Fair' | 'Poor' = 'Good';

    if (cibilScore >= 780) {
      cibilFactor = 1.2;
      approvalChance = 'Excellent';
    } else if (cibilScore >= 720) {
      cibilFactor = 1.0;
      approvalChance = 'Good';
    } else if (cibilScore >= 650) {
      cibilFactor = 0.7;
      approvalChance = 'Fair';
    } else {
      cibilFactor = 0.3;
      approvalChance = 'Poor';
    }

    if (age < 21 || age > 60) {
      cibilFactor *= 0.5;
    }

    const factorPerLakh = 868;
    const rawEligibleLoan = (eligibleAmountForEmi > 0) ? (eligibleAmountForEmi / factorPerLakh) * 100000 : 0;
    
    const maxLoan = Math.max(0, Math.round(rawEligibleLoan * cibilFactor));
    
    return {
      maxLoan,
      approvalChance,
      interestEstimate: cibilScore >= 750 ? '8.40% - 9.50%' : '9.75% - 13.50%',
      eligibleBanks: cibilScore >= 750 ? 'HDFC, SBI, ICICI, Kotak' : 'IDFC First, Federal Bank, NBFCs'
    };
  };

  const eligibleResult = checkEligibility();

  // Ratio breakdown
  const totalVal = emiAmount + totalInterest;
  const principalPercent = Math.round((emiAmount / totalVal) * 100) || 0;
  const interestPercent = 100 - principalPercent;

  return (
    <section className="py-20 bg-slate-50 dark:bg-slate-900/50" id="calculators">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-14">
          <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider bg-primary/5 dark:bg-accent/10 px-3.5 py-1.5 rounded-full">
            Financial Suite
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-4">
            Calculate your EMI & Eligibility Instantly
          </h2>
          <p className="font-sans text-slate-500 dark:text-slate-400 mt-3">
            Interact with our premium tools to plan your budget and verify your approval chances across top institutions.
          </p>
        </div>

        {/* Tab Switcher */}
        <div className="flex justify-center mb-12">
          <div className="p-1 rounded-2xl glass border border-slate-200/50 dark:border-slate-800 flex gap-2 relative">
            <button
              onClick={() => setActiveTab('emi')}
              className={`relative flex items-center gap-2 px-6 h-12 rounded-xl text-sm font-semibold transition-all cursor-pointer z-10 ${
                activeTab === 'emi'
                  ? 'text-white dark:text-slate-950 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary'
              }`}
            >
              <Calculator className="w-4 h-4" />
              <span>EMI Calculator</span>
              {activeTab === 'emi' && (
                <motion.div 
                  layoutId="activeCalcIndicator"
                  className="absolute inset-0 bg-primary dark:bg-accent rounded-xl -z-10 shadow-md shadow-primary/10"
                />
              )}
            </button>
            <button
              onClick={() => setActiveTab('eligibility')}
              className={`relative flex items-center gap-2 px-6 h-12 rounded-xl text-sm font-semibold transition-all cursor-pointer z-10 ${
                activeTab === 'eligibility'
                  ? 'text-white dark:text-slate-950 font-bold'
                  : 'text-slate-600 dark:text-slate-300 hover:text-primary'
              }`}
            >
              <Award className="w-4 h-4" />
              <span>Eligibility Checker</span>
              {activeTab === 'eligibility' && (
                <motion.div 
                  layoutId="activeCalcIndicator"
                  className="absolute inset-0 bg-primary dark:bg-accent rounded-xl -z-10 shadow-md shadow-primary/10"
                />
              )}
            </button>
          </div>
        </div>

        {/* Main Section */}
        <div className="overflow-hidden">
          <AnimatePresence mode="wait">
            {activeTab === 'emi' ? (
              /* EMI CALCULATOR VIEW */
              <motion.div 
                key="emi-view"
                initial={{ opacity: 0, x: -15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: 15 }}
                transition={{ duration: 0.25 }}
                className="grid lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto"
              >
                {/* Sliders Input */}
                <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass shadow-sm border border-slate-200/40 dark:border-slate-800 space-y-8 flex flex-col justify-center">
                  
                  {/* Amount Slider */}
                  <div className="space-y-3">
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
                  <div className="space-y-3">
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
                  <div className="space-y-3">
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
                <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-primary via-primary/95 to-secondary text-white shadow-xl flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-accent opacity-10 rounded-full blur-2xl" />
                  
                  <div>
                    <span className="text-[10px] font-bold uppercase tracking-wider text-accent/80 block mb-1">
                      Estimated Payment Breakdown
                    </span>
                    <p className="text-xs text-slate-300">Monthly Installment</p>
                    <h3 className="text-4xl font-extrabold tracking-tight mt-1 text-white">
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
              </motion.div>
            ) : (
              /* ELIGIBILITY CHECKER VIEW */
              <motion.div 
                key="eligibility-view"
                initial={{ opacity: 0, x: 15 }}
                animate={{ opacity: 1, x: 0 }}
                exit={{ opacity: 0, x: -15 }}
                transition={{ duration: 0.25 }}
                className="grid lg:grid-cols-12 gap-8 items-stretch max-w-5xl mx-auto"
              >
                {/* Input Form Column */}
                <div className="lg:col-span-7 p-6 sm:p-8 rounded-3xl glass shadow-sm border border-slate-200/40 dark:border-slate-800 space-y-6 flex flex-col justify-center">
                  
                  {/* Age Slider */}
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Age</span>
                      <div className="flex items-center gap-1 bg-primary/5 dark:bg-accent/5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-primary dark:text-accent font-extrabold text-xs">
                        <input
                          type="number"
                          value={age || ''}
                          onChange={(e) => setAge(Number(e.target.value))}
                          className="w-10 bg-transparent text-primary dark:text-accent font-extrabold text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                        <span className="text-slate-450 text-[10px] font-bold">Yrs</span>
                      </div>
                    </div>
                    <input
                      type="range"
                      min={18}
                      max={75}
                      value={Math.min(75, Math.max(18, age))}
                      onChange={(e) => setAge(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-primary dark:accent-accent outline-none cursor-pointer"
                    />
                  </div>

                  {/* Monthly Income Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Net Monthly Salary/Income</span>
                      <div className="flex items-center gap-1 bg-primary/5 dark:bg-accent/5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-primary dark:text-accent font-extrabold text-xs">
                        <span className="text-slate-400 font-bold">₹</span>
                        <input
                          type="number"
                          value={monthlyIncome || ''}
                          onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                          className="w-20 bg-transparent text-primary dark:text-accent font-extrabold text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min={10000}
                      max={500000}
                      step={5000}
                      value={Math.min(500000, Math.max(10000, monthlyIncome))}
                      onChange={(e) => setMonthlyIncome(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-primary dark:accent-accent outline-none cursor-pointer"
                    />
                  </div>

                  {/* Existing EMI Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Current Monthly EMIs</span>
                      <div className="flex items-center gap-1 bg-primary/5 dark:bg-accent/5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 font-extrabold text-xs">
                        <span className="text-slate-450 font-bold">₹</span>
                        <input
                          type="number"
                          value={existingEmi === 0 ? '0' : existingEmi || ''}
                          onChange={(e) => setExistingEmi(Number(e.target.value))}
                          className="w-20 bg-transparent text-slate-700 dark:text-slate-200 font-extrabold text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min={0}
                      max={100000}
                      step={1000}
                      value={Math.min(100000, Math.max(0, existingEmi))}
                      onChange={(e) => setExistingEmi(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-primary dark:accent-accent outline-none cursor-pointer"
                    />
                  </div>

                  {/* CIBIL Score Slider */}
                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-300">Estimated CIBIL Score</span>
                      <div className="flex items-center gap-1 bg-primary/5 dark:bg-accent/5 px-2.5 py-1 rounded-lg border border-slate-200 dark:border-slate-800 text-primary dark:text-accent font-extrabold text-xs">
                        <input
                          type="number"
                          value={cibilScore || ''}
                          onChange={(e) => setCibilScore(Number(e.target.value))}
                          className="w-10 bg-transparent text-primary dark:text-accent font-extrabold text-right outline-none [appearance:textfield] [&::-webkit-outer-spin-button]:appearance-none [&::-webkit-inner-spin-button]:appearance-none"
                        />
                      </div>
                    </div>
                    <input
                      type="range"
                      min={300}
                      max={900}
                      step={10}
                      value={Math.min(900, Math.max(300, cibilScore))}
                      onChange={(e) => setCibilScore(Number(e.target.value))}
                      className="w-full h-2 rounded-lg bg-slate-200 dark:bg-slate-700 accent-primary dark:accent-accent outline-none cursor-pointer"
                    />
                  </div>

                  {/* Employment Type */}
                  <div>
                    <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block mb-2">Employment Category</span>
                    <div className="grid grid-cols-2 gap-2">
                      <button
                        onClick={() => setEmpType('Salaried')}
                        className={`h-12 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                          empType === 'Salaried'
                            ? 'bg-primary/10 border-primary text-primary dark:bg-accent/10 dark:border-accent dark:text-accent font-extrabold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Salaried
                      </button>
                      <button
                        onClick={() => setEmpType('Self-Employed')}
                        className={`h-12 rounded-xl text-xs font-bold border transition-all cursor-pointer flex items-center justify-center ${
                          empType === 'Self-Employed'
                            ? 'bg-primary/10 border-primary text-primary dark:bg-accent/10 dark:border-accent dark:text-accent font-extrabold'
                            : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300'
                        }`}
                      >
                        Self-Employed
                      </button>
                    </div>
                  </div>

                </div>

                {/* Results Column */}
                <div className="lg:col-span-5 p-6 sm:p-8 rounded-3xl bg-slate-900 text-white shadow-xl border border-slate-800 flex flex-col justify-between relative overflow-hidden">
                  <div className="absolute top-0 right-0 w-32 h-32 bg-primary/20 rounded-full blur-2xl -z-10" />

                  <div>
                    <span className="text-[10px] font-bold text-accent uppercase tracking-wider block mb-1">
                      Eligibility Assessment
                    </span>
                    
                    <span className="text-xs text-slate-400 block mt-2">Maximum Estimated Loan</span>
                    <h3 className="text-4xl font-extrabold text-white tracking-tight mt-0.5">
                      ₹{eligibleResult.maxLoan.toLocaleString('en-IN')}
                    </h3>
                  </div>

                  {/* Details Metrics */}
                  <div className="space-y-4 my-8">
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs text-slate-400">Approval Probability</span>
                      <span className={`text-xs font-extrabold px-2.5 py-1 rounded-full ${
                        eligibleResult.approvalChance === 'Excellent' || eligibleResult.approvalChance === 'Good'
                          ? 'bg-emerald-500/20 text-emerald-400'
                          : 'bg-red-500/20 text-red-400'
                      }`}>
                        {eligibleResult.approvalChance}
                      </span>
                    </div>
                    
                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs text-slate-400">Interest rate window</span>
                      <span className="text-xs font-bold text-white">{eligibleResult.interestEstimate}</span>
                    </div>

                    <div className="flex items-center justify-between border-b border-slate-800 pb-3">
                      <span className="text-xs text-slate-400">Recommended channels</span>
                      <span className="text-xs font-semibold text-accent max-w-[200px] text-right truncate">
                        {eligibleResult.eligibleBanks}
                      </span>
                    </div>
                  </div>

                  {/* CIBIL / Security Tips */}
                  <div className="p-3.5 bg-slate-800/40 border border-slate-800 rounded-2xl flex gap-2.5 items-start">
                    {cibilScore < 700 ? (
                      <>
                        <AlertCircle className="w-5 h-5 text-red-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-300 leading-normal">
                          CIBIL is currently below 700. Consider reducing credit utilization below 30% and clearing active card balances to boost eligibility.
                        </p>
                      </>
                    ) : (
                      <>
                        <CheckCircle className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-slate-300 leading-normal">
                          Great credit standing! Keep avoiding multiple parallel loan applications to sustain this premium score tier.
                        </p>
                      </>
                    )}
                  </div>

                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>

      </div>
    </section>
  );
}
