"use client";

import React, { useState } from 'react';
import { ChevronRight, ArrowUpRight, Sparkles, MessageCircle } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface HeroProps {
  setView: (view: string) => void;
  setSelectedLoanType?: (type: string) => void;
}


export default function Hero({ setView, setSelectedLoanType }: HeroProps) {
  const [cibilScore, setCibilScore] = useState(785);

  const getCibilStatus = (score: number) => {
    if (score >= 800) return { tier: 'Excellent', textColor: 'text-emerald-500', barColor: 'bg-emerald-500' };
    if (score >= 720) return { tier: 'Good', textColor: 'text-green-600', barColor: 'bg-green-500' };
    if (score >= 620) return { tier: 'Fair', textColor: 'text-amber-500', barColor: 'bg-amber-500' };
    return { tier: 'Poor', textColor: 'text-red-500', barColor: 'bg-red-500' };
  };

  const { tier: tierName, textColor, barColor } = getCibilStatus(cibilScore);

  const popularLoans = [
    { name: 'Personal Loans', val: 'Personal Loan', desc: 'No collateral cash', icon: '👤' },
    { name: 'Business Loans', val: 'Business Loan', desc: 'Working capital boost', icon: '💼' },
    { name: 'Home Loans', val: 'Home Loan', desc: 'Build your dream house', icon: '🏠' },
    { name: 'Working Capital', val: 'Working Capital', desc: 'Daily cash management', icon: '🪙' }
  ];

  const handleQuickApply = (type: string) => {
    if (setSelectedLoanType) setSelectedLoanType(type);
    setView('apply');
  };

  const containerVariants: Variants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.08,
        delayChildren: 0.05
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 15 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { duration: 0.3, ease: 'easeOut' }
    }
  };

  return (
    <section className="relative overflow-hidden pt-12 pb-16 md:pt-20 md:pb-24 lg:pt-24 lg:pb-32 w-full bg-gradient-to-b from-[#EBF3FF] to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* Decorative Glow Elements */}
      <div className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[300px] h-[300px] sm:w-[600px] sm:h-[600px] bg-[#0A4D9D]/10 dark:bg-[#F5B301]/5 rounded-full blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-10 left-10 w-24 h-24 bg-primary/5 rounded-full blur-2xl animate-pulse pointer-events-none -z-10" />
      <div className="absolute bottom-20 right-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl animate-pulse pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 w-full space-y-16">
        
        {/* Unified Main Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-8 items-center">
          
          {/* LEFT SIDE: Copy & Call to actions */}
          <motion.div
            className="lg:col-span-7 flex flex-col items-center text-center lg:items-start lg:text-left space-y-6 md:space-y-7"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Tagline Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-[#0A4D9D]/30 bg-[#0A4D9D]/8 text-[#0A4D9D] dark:text-[#F5B301] text-xs font-bold tracking-wider uppercase select-none"
              variants={itemVariants}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5B301]" />
              <span>One Step Closer to your Dream</span>
            </motion.div>

            {/* Headline and Subtitle */}
            <motion.div className="space-y-3" variants={itemVariants}>
              <h1 className="font-display font-[900] fluid-title tracking-tight text-[#0A2540] dark:text-white">
                Get Loans Hub
              </h1>
              <p className="font-display font-extrabold fluid-heading text-primary dark:text-[#F5B301]">
                One-Stop Solution for all Your Loan Needs
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              className="font-sans fluid-body text-slate-600 dark:text-slate-350 max-w-2xl font-medium"
              variants={itemVariants}
            >
              Compare loans from leading trusted banks and NBFCs. Get expert guidance, competitive interest rates, and quick approvals—all from one secure platform.
            </motion.p>

            {/* Action Buttons: Stack on mobile (min 48px heights) */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full sm:w-auto pt-2"
              variants={itemVariants}
            >
              <button
                onClick={() => setView('apply')}
                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] w-full sm:w-auto"
              >
                <span>Apply Now</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <a
                href="tel:9000100262"
                className="h-14 px-6 rounded-2xl border-2 border-primary/20 hover:border-primary/40 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-primary dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all w-full sm:w-auto"
              >
                <span>📞 Call: 9000100262</span>
              </a>

              <a
                href="https://wa.me/919000100262"
                target="_blank"
                rel="noreferrer"
                className="h-14 px-6 rounded-2xl bg-[#16A34A] hover:bg-green-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-green-600/10 transition-all w-full sm:w-auto"
              >
                <MessageCircle className="w-4.5 h-4.5" />
                <span>WhatsApp</span>
              </a>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              className="grid grid-cols-2 gap-3 w-full max-w-md pt-2 select-none text-left"
              variants={itemVariants}
            >
              {['Multiple Banking Partners', 'Competitive Rates', 'Fast Verification', 'Expert Loan Guidance'].map((badge) => (
                <div key={badge} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm">
                  <span className="text-emerald-500 font-extrabold text-sm">✓</span>
                  <span>{badge}</span>
                </div>
              ))}
            </motion.div>

            {/* 4-Step How It Works Flow */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-8 border-t border-slate-250/60 dark:border-slate-800/80 mt-2 select-none text-left"
              variants={itemVariants}
            >
              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 shadow-sm flex flex-col gap-2 transition-colors hover:border-primary/20">
                <span className="text-[9px] font-black uppercase text-primary dark:text-accent tracking-widest">Step 01</span>
                <span className="font-bold text-xs text-slate-850 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-[10px]">📁</span>
                  <span>Choose Your Loan</span>
                </span>
                <p className="text-[10px] sm:text-[11px] text-slate-450 leading-relaxed font-semibold">Select the personal or business loan category that fits your needs.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 shadow-sm flex flex-col gap-2 transition-colors hover:border-primary/20">
                <span className="text-[9px] font-black uppercase text-primary dark:text-accent tracking-widest">Step 02</span>
                <span className="font-bold text-xs text-slate-850 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-[10px]">🔍</span>
                  <span>Check Eligibility</span>
                </span>
                <p className="text-[10px] sm:text-[11px] text-slate-450 leading-relaxed font-semibold">Instantly check interest rates and match criteria with lending partners.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 shadow-sm flex flex-col gap-2 transition-colors hover:border-primary/20">
                <span className="text-[9px] font-black uppercase text-primary dark:text-accent tracking-widest">Step 03</span>
                <span className="font-bold text-xs text-slate-850 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-[10px]">📤</span>
                  <span>Upload Documents</span>
                </span>
                <p className="text-[10px] sm:text-[11px] text-slate-450 leading-relaxed font-semibold">Securely submit Aadhaar, PAN, and statements for digital verification.</p>
              </div>

              <div className="p-4 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 shadow-sm flex flex-col gap-2 transition-colors hover:border-primary/20">
                <span className="text-[9px] font-black uppercase text-primary dark:text-accent tracking-widest">Step 04</span>
                <span className="font-bold text-xs text-slate-850 dark:text-white flex items-center gap-1.5">
                  <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-[10px]">🤝</span>
                  <span>Get Assistance</span>
                </span>
                <p className="text-[10px] sm:text-[11px] text-slate-450 leading-relaxed font-semibold">Our certified loan advisors coordinate with banks for fast disbursals.</p>
              </div>
            </motion.div>

          </motion.div>

          {/* RIGHT SIDE: Interactive Widgets Column */}
          <div className="lg:col-span-5 flex flex-col items-center justify-center w-full relative pt-6 lg:pt-0">
            {/* Background grid box glow decoration */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-gradient-to-tr from-primary to-[#1E64B8] opacity-5 rounded-full blur-[80px] -z-10 pointer-events-none" />

            {/* Slider Widget Card */}
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, ease: [0.16, 1, 0.3, 1], delay: 0.3 }}
              className="w-full max-w-sm p-6 sm:p-7 rounded-[32px] bg-white/70 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/80 shadow-2xl space-y-6 relative overflow-hidden select-none"
            >
              <div className="flex justify-between items-start">
                <div>
                  <span className="text-[10px] font-bold uppercase tracking-widest text-[#0A4D9D] dark:text-[#F5B301]">Real-time Matcher</span>
                  <h4 className="font-display font-extrabold text-base sm:text-lg text-[#0A2540] dark:text-white mt-0.5">Credit Matcher</h4>
                </div>
                <div className="px-2 py-1 bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 font-bold text-[9px] uppercase tracking-wider rounded-lg">
                  Instant Verification
                </div>
              </div>

              {/* Slider for CIBIL */}
              <div className="space-y-1.5 text-left">
                <div className="flex justify-between items-baseline">
                  <span className="text-xs font-bold text-slate-400">Current CIBIL Score</span>
                  <span className="text-2xl font-black text-[#0A2540] dark:text-white">{cibilScore}</span>
                </div>
                <input
                  type="range"
                  min={300}
                  max={900}
                  step={5}
                  value={cibilScore}
                  onChange={(e) => setCibilScore(Number(e.target.value))}
                  className="w-full h-1.5 mt-2 rounded-lg bg-slate-100 dark:bg-slate-700 accent-primary dark:accent-accent outline-none cursor-pointer"
                />
                <div className="w-full bg-slate-100 dark:bg-slate-700 h-1.5 rounded-full mt-2 overflow-hidden">
                  <div className={`${barColor} h-full transition-all duration-300`} style={{ width: `${((cibilScore - 300) / 600) * 100}%` }} />
                </div>
                <span className={`text-[10px] font-bold ${textColor} block mt-1 transition-colors duration-200`}>
                  {tierName} Approval Chance
                </span>
              </div>
            </motion.div>

            {/* Overlay Sanction Limit Card */}
            <motion.div
              className="absolute bottom-[-20px] right-2 sm:right-[-20px] w-48 sm:w-52 p-4 rounded-2xl bg-[#0A2540] border border-slate-750 text-white shadow-2xl text-left z-10 hidden sm:block"
              animate={{ y: [0, 8, 0] }}
              transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
            >
              <div className="flex items-center justify-between mb-1.5">
                <span className="text-[9px] uppercase font-bold text-[#F5B301]">Active Sanction</span>
              </div>
              <p className="text-xs text-slate-350 font-medium">Approved Limit</p>
              <p className="text-lg sm:text-xl font-extrabold text-white">₹35,00,000</p>
            </motion.div>
          </div>

        </div>

        {/* Loan Category cards (Rendered on both mobile and desktop) */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-8">
          {popularLoans.map((loan) => (
            <div
              key={loan.name}
              onClick={() => handleQuickApply(loan.val)}
              className="p-5 rounded-2xl bg-white/70 dark:bg-slate-800/40 border border-[#DBEAFE]/60 dark:border-slate-800 hover:border-primary/30 dark:hover:border-accent/30 shadow-sm hover:shadow-md cursor-pointer text-left group flex flex-col justify-between h-[130px] transition-all hover:scale-[1.02]"
            >
              <div className="flex justify-between items-start">
                <span className="text-2xl">{loan.icon}</span>
                <span className="p-1 rounded-lg bg-[#EBF3FF] dark:bg-slate-800 group-hover:bg-primary dark:group-hover:bg-accent group-hover:text-white dark:group-hover:text-slate-950 transition-colors">
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </span>
              </div>
              <div>
                <h4 className="font-display font-extrabold text-xs sm:text-sm text-[#0A2540] dark:text-white">{loan.name}</h4>
                <p className="font-sans text-[10px] text-slate-400 mt-1">{loan.desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Endless Marquee Logo Carousel */}
        <div className="w-full pt-16 border-t border-slate-200/50 dark:border-slate-800/60 overflow-hidden select-none">
          <div className="text-center mb-6">
            <span className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-widest">Partnering with leading financial institutions</span>
          </div>
          <div className="relative w-full flex items-center overflow-hidden py-4">
            <div className="absolute left-0 top-0 bottom-0 w-16 bg-gradient-to-r from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
            <div className="absolute right-0 top-0 bottom-0 w-16 bg-gradient-to-l from-white dark:from-slate-950 to-transparent z-10 pointer-events-none" />
            
            <div className="animate-marquee flex gap-8">
              {[
                { name: 'HDFC Bank', tier: 'Partner' },
                { name: 'ICICI Bank', tier: 'Partner' },
                { name: 'SBI', tier: 'Associate' },
                { name: 'Axis Bank', tier: 'Partner' },
                { name: 'Kotak Mahindra', tier: 'Partner' },
                { name: 'IDFC First', tier: 'Partner' },
                { name: 'Bajaj Finserv', tier: 'NBFC Partner' },
                { name: 'Tata Capital', tier: 'NBFC Partner' }
              ].concat([
                { name: 'HDFC Bank', tier: 'Partner' },
                { name: 'ICICI Bank', tier: 'Partner' },
                { name: 'SBI', tier: 'Associate' },
                { name: 'Axis Bank', tier: 'Partner' },
                { name: 'Kotak Mahindra', tier: 'Partner' },
                { name: 'IDFC First', tier: 'Partner' },
                { name: 'Bajaj Finserv', tier: 'NBFC Partner' },
                { name: 'Tata Capital', tier: 'NBFC Partner' }
              ]).map((bank, index) => (
                <div 
                  key={index}
                  className="px-6 py-3 rounded-2xl glass-card flex flex-col justify-center items-center gap-0.5 border border-slate-250 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/40 backdrop-blur-md shrink-0 shadow-sm"
                >
                  <span className="font-display font-extrabold text-xs text-slate-800 dark:text-white uppercase tracking-wider">{bank.name}</span>
                  <span className="text-[9px] font-semibold text-primary dark:text-accent uppercase tracking-widest">{bank.tier}</span>
                </div>
              ))
            }
            </div>
          </div>
        </div>

      </div>
    </section>
  );
}
