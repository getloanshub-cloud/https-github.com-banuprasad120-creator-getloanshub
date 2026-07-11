"use client";

import React, { useState, useEffect } from 'react';
import { ChevronRight, ArrowUpRight, Sparkles, MessageCircle, Percent, Compass, ShieldCheck } from 'lucide-react';
import { motion, Variants } from 'framer-motion';

interface HeroProps {
  setView: (view: string) => void;
  setSelectedLoanType?: (type: string) => void;
}

export default function Hero({ setView, setSelectedLoanType }: HeroProps) {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      setMousePos({
        x: (e.clientX - window.innerWidth / 2) * 0.04,
        y: (e.clientY - window.innerHeight / 2) * 0.04
      });
    };
    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const popularLoans = [
    { name: 'Personal Loans', val: 'Personal Loan', desc: 'No collateral instant cash', icon: '👤' },
    { name: 'Home Loans', val: 'Home Loan', desc: 'Build or buy your dream house', icon: '🏠' },
    { name: 'Doctor Loans', val: 'Doctor Loan', desc: 'Custom financing for medical clinics', icon: '🩺' }
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
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 25 },
    visible: {
      opacity: 1,
      y: 0,
      transition: { type: "spring", stiffness: 100, damping: 15 }
    }
  };

  const wordRevealVariants: Variants = {
    hidden: { opacity: 0, y: 20, filter: 'blur(8px)' },
    visible: {
      opacity: 1,
      y: 0,
      filter: 'blur(0px)',
      transition: { duration: 0.6, ease: [0.16, 1, 0.3, 1] }
    }
  };

  return (
    <section className="relative overflow-hidden pt-16 pb-20 md:pt-24 md:pb-28 lg:pt-32 lg:pb-36 w-full bg-gradient-to-b from-[#EBF3FF] to-white dark:from-slate-950 dark:to-slate-900">
      
      {/* Decorative Glow Elements with Mouse Parallax */}
      <motion.div 
        style={{ x: mousePos.x * 0.5, y: mousePos.y * 0.5 }}
        className="absolute top-[10%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] sm:w-[700px] sm:h-[700px] bg-gradient-to-tr from-[#0A4D9D]/15 to-accent/15 rounded-full blur-[120px] pointer-events-none -z-10" 
      />
      <motion.div 
        style={{ x: -mousePos.x * 0.8, y: -mousePos.y * 0.8 }}
        className="absolute top-20 left-10 w-36 h-36 bg-primary/5 rounded-full blur-3xl pointer-events-none -z-10 animate-pulse" 
      />
      <motion.div 
        style={{ x: mousePos.x * 1.2, y: mousePos.y * 1.2 }}
        className="absolute bottom-20 right-10 w-44 h-44 bg-accent/8 rounded-full blur-3xl pointer-events-none -z-10" 
      />

      {/* Floating Glass Shapes in 3D Space */}
      <motion.div 
        style={{ x: mousePos.x * -0.7, y: mousePos.y * -0.7 }}
        animate={{ y: [0, -12, 0] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
        className="absolute top-1/4 right-[8%] p-4 rounded-2xl glass border border-white/20 dark:border-slate-800 shadow-2xl hidden lg:flex items-center gap-3 select-none pointer-events-none z-10"
      >
        <div className="w-9 h-9 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center font-bold">✓</div>
        <div className="text-left">
          <p className="text-[10px] uppercase font-bold text-slate-400">Status</p>
          <p className="text-xs font-black text-slate-800 dark:text-white">Active Sanction</p>
        </div>
      </motion.div>

      <motion.div 
        style={{ x: mousePos.x * 0.9, y: mousePos.y * 0.9 }}
        animate={{ y: [0, 15, 0] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
        className="absolute bottom-1/3 left-[6%] p-4 rounded-2xl glass border border-white/20 dark:border-slate-800 shadow-2xl hidden lg:flex items-center gap-3 select-none pointer-events-none z-10"
      >
        <div className="w-9 h-9 rounded-xl bg-accent/10 text-accent flex items-center justify-center font-bold">%</div>
        <div className="text-left">
          <p className="text-[10px] uppercase font-bold text-slate-400">Lowest Rate</p>
          <p className="text-xs font-black text-slate-800 dark:text-white">From 7.10% p.a.</p>
        </div>
      </motion.div>

      <div className="container-custom w-full space-y-16">
        
        {/* Unified Main Content Grid */}
        <div className="max-w-5xl mx-auto text-center flex flex-col items-center space-y-8">
          
          {/* Copy & Call to actions */}
          <motion.div
            className="flex flex-col items-center text-center space-y-6 md:space-y-7"
            variants={containerVariants}
            initial="hidden"
            animate="visible"
          >
            {/* Tagline Badge */}
            <motion.div
              className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-primary/20 bg-primary/5 text-primary dark:text-accent text-xs font-bold tracking-wider uppercase select-none shadow-sm shadow-primary/5 hover:border-primary/30 transition-colors"
              variants={itemVariants}
            >
              <Sparkles className="w-3.5 h-3.5 text-[#F5B301] animate-spin-slow" />
              <span>One Step Closer to your Dream</span>
            </motion.div>

            {/* Headline and Subtitle with Word Reveal */}
            <motion.div className="space-y-4" variants={itemVariants}>
              <h1 className="font-display font-[900] fluid-title tracking-tight text-[#0A2540] dark:text-white leading-[1.08]">
                {['Get', 'Loans', 'Hub'].map((word, i) => (
                  <motion.span 
                    key={i} 
                    className="inline-block mr-3" 
                    variants={wordRevealVariants}
                  >
                    {word}
                  </motion.span>
                ))}
              </h1>
              <p className="font-display font-extrabold fluid-heading text-primary dark:text-[#F5B301] tracking-tight">
                One-Stop Solution for all Your Financial Needs
              </p>
            </motion.div>

            {/* Description */}
            <motion.p
              className="font-sans fluid-body text-slate-600 dark:text-slate-350 max-w-2xl font-medium leading-relaxed"
              variants={itemVariants}
            >
              Compare loans from leading trusted banks and NBFCs. Get expert guidance, competitive interest rates, and quick approvals—all from one secure platform.
            </motion.p>

            {/* Action Buttons: Stack on mobile */}
            <motion.div
              className="flex flex-col sm:flex-row items-stretch sm:items-center justify-center gap-4 w-full sm:w-auto pt-2"
              variants={itemVariants}
            >
              <motion.button
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={() => setView('apply')}
                className="h-14 px-8 rounded-2xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 text-white font-bold text-sm shadow-lg shadow-primary/20 flex items-center justify-center gap-2 cursor-pointer transition-all active:scale-[0.98] w-full sm:w-auto hover:shadow-primary/30"
              >
                <span>Apply Now</span>
                <ChevronRight className="w-4 h-4" />
              </motion.button>

              <motion.a
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="tel:9000100262"
                className="h-14 px-6 rounded-2xl border-2 border-primary/20 hover:border-primary/40 bg-white dark:bg-slate-800 hover:bg-slate-50 dark:hover:bg-slate-700 text-primary dark:text-slate-200 font-bold text-sm flex items-center justify-center gap-2 shadow-sm transition-all w-full sm:w-auto"
              >
                <span>📞 Call: 9000100262</span>
              </motion.a>

              <motion.a
                whileHover={{ y: -3, scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                href="https://wa.me/919000100262"
                target="_blank"
                rel="noreferrer"
                className="h-14 px-6 rounded-2xl bg-[#16A34A] hover:bg-green-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-md shadow-green-600/10 transition-all w-full sm:w-auto"
              >
                <MessageCircle className="w-4.5 h-4.5" />
                <span>WhatsApp</span>
              </motion.a>
            </motion.div>

            {/* Quick trust metrics */}
            <motion.div
              className="grid grid-cols-2 sm:grid-cols-4 gap-3 w-full pt-4 select-none justify-center text-left"
              variants={itemVariants}
            >
              {['Multiple Banking Partners', 'Competitive Rates', 'Fast Verification', 'Expert Loan Guidance'].map((badge) => (
                <div key={badge} className="flex items-center gap-2 px-3 py-2.5 rounded-xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-800 text-xs font-semibold text-slate-700 dark:text-slate-300 shadow-sm justify-center sm:justify-start">
                  <span className="text-emerald-500 font-extrabold text-sm">✓</span>
                  <span>{badge}</span>
                </div>
              ))}
            </motion.div>

            {/* 4-Step How It Works Flow */}
            <motion.div 
              className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 w-full pt-10 border-t border-slate-250/60 dark:border-slate-800/80 mt-2 select-none text-left"
              variants={itemVariants}
            >
              {[
                { step: '01', title: 'Choose Your Loan', desc: 'Select the personal or business loan category that fits your needs.', icon: '📁' },
                { step: '02', title: 'Check Eligibility', desc: 'Instantly check interest rates and match criteria with lending partners.', icon: '🔍' },
                { step: '03', title: 'Submit Details', desc: 'Fill out our single-page form with basic details in under 2 minutes.', icon: '📤' },
                { step: '04', title: 'Get Assistance', desc: 'Our certified loan advisors coordinate with banks for fast disbursals.', icon: '🤝' }
              ].map((item, idx) => (
                <motion.div
                  key={idx}
                  whileHover={{ y: -4, scale: 1.01 }}
                  className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 shadow-sm flex flex-col gap-2 transition-all hover:border-primary/20 hover:shadow-md"
                >
                  <span className="text-[9px] font-black uppercase text-primary dark:text-accent tracking-widest">Step {item.step}</span>
                  <span className="font-bold text-xs text-slate-850 dark:text-white flex items-center gap-1.5">
                    <span className="w-5 h-5 rounded bg-primary/10 flex items-center justify-center text-[10px]">{item.icon}</span>
                    <span>{item.title}</span>
                  </span>
                  <p className="text-[10px] sm:text-[11px] text-slate-455 leading-relaxed font-semibold">{item.desc}</p>
                </motion.div>
              ))}
            </motion.div>

          </motion.div>

        </div>

        {/* Loan Category cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mt-8">
          {popularLoans.map((loan) => (
            <motion.div
              key={loan.name}
              onClick={() => handleQuickApply(loan.val)}
              whileHover={{ y: -5, scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="p-5 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/60 shadow-sm cursor-pointer text-left group flex flex-col justify-between h-[130px] transition-all hover:shadow-md hover:border-primary/20"
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
            </motion.div>
          ))}
        </div>

      </div>
    </section>
  );
}
