"use client";

import React, { useState, useEffect } from 'react';
import { Send, FileCheck, Landmark, CheckSquare, Coins, ChevronLeft, ChevronRight, Clock, ShieldCheck, RefreshCw } from 'lucide-react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

interface Step {
  num: string;
  title: string;
  duration: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

export default function TimelineSection() {
  const [activeStep, setActiveStep] = useState(0);
  const [isPlaying, setIsPlaying] = useState(true);
  const [typedText, setTypedText] = useState("");

  const steps: Step[] = [
    {
      num: '01',
      title: 'Application Submission',
      duration: '10 MINUTES',
      desc: 'Begin your journey by submitting your basic financial profile through our secure portal. Our intelligent system instantly validates your credentials to ensure a seamless start.',
      icon: Send
    },
    {
      num: '02',
      title: 'Profile Verification',
      duration: '30 MINUTES',
      desc: 'Provide basic verification details. Our advisors and banking partners securely verify your profile in real-time.',
      icon: FileCheck
    },
    {
      num: '03',
      title: 'Bank Matching & Rates Comparison',
      duration: '2 HOURS',
      desc: 'Our platform matches your profile with top banking partners to find the lowest interest rates and highest loan eligibility.',
      icon: Landmark
    },
    {
      num: '04',
      title: 'Sanction Letter Approval',
      duration: '4 HOURS',
      desc: 'Receive your official digital sanction letter from the matched bank. Review your sanctioned loan limit and terms instantly.',
      icon: CheckSquare
    },
    {
      num: '05',
      title: 'Direct Fund Disbursement',
      duration: '24 HOURS',
      desc: 'Once approved, the funds are credited directly to your registered bank account, with doorstep document support if needed.',
      icon: Coins
    }
  ];

  // Auto-advance step effect (Speeded up to 4000ms)
  useEffect(() => {
    if (!isPlaying) return;
    const interval = setInterval(() => {
      setActiveStep((prev) => (prev + 1) % steps.length);
    }, 4000);
    return () => clearInterval(interval);
  }, [isPlaying]);

  // Typing animation for Step 1 (Speeded up to 75ms)
  useEffect(() => {
    if (activeStep !== 0) {
      setTypedText("");
      return;
    }
    const fullText = "Banu Prakash";
    let currentIdx = 0;
    let isMounted = true;

    const interval = setInterval(() => {
      if (!isMounted) return;
      if (currentIdx < fullText.length) {
        setTypedText(fullText.substring(0, currentIdx + 1));
        currentIdx++;
      } else {
        setTimeout(() => {
          if (isMounted) {
            setTypedText("");
            currentIdx = 0;
          }
        }, 1000);
      }
    }, 75);

    return () => {
      isMounted = false;
      clearInterval(interval);
    };
  }, [activeStep]);

  const handleNext = () => {
    setActiveStep((prev) => (prev + 1) % steps.length);
  };

  const handlePrev = () => {
    setActiveStep((prev) => (prev - 1 + steps.length) % steps.length);
  };

  // Helper to render responsive animated mockup content in the tablet view
  const renderTabletContent = () => {
    switch (activeStep) {
      case 0: // Application Submission
        return (
          <motion.div
            key="step0"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-[280px] sm:max-w-[320px] bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5 text-left text-xs text-slate-300 space-y-3 relative shadow-2xl"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
              <span className="font-bold text-[#F5B301]">Get Loans Hub Form</span>
              <span className="w-1.5 h-1.5 rounded-full bg-green-500 animate-ping" />
            </div>
            <div className="space-y-2">
              <div>
                <label className="text-[9px] uppercase tracking-wider text-slate-500">Name</label>
                <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 h-7 flex items-center font-mono">
                  {typedText}
                  <span className="w-1.5 h-3.5 bg-primary ml-0.5 animate-pulse" />
                </div>
              </div>
              <div className="grid grid-cols-2 gap-2">
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-slate-500">Type</label>
                  <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 h-7 flex items-center text-[10px]">
                    Business Loan
                  </div>
                </div>
                <div>
                  <label className="text-[9px] uppercase tracking-wider text-slate-500">Amount</label>
                  <div className="w-full bg-slate-900 border border-slate-700 rounded-lg p-2 h-7 flex items-center text-[10px]">
                    ₹15,00,000
                  </div>
                </div>
              </div>
            </div>
            <motion.div
              className="w-full text-center py-2 bg-primary text-white font-bold rounded-lg text-[10px]"
              animate={{ opacity: [1, 0.7, 1] }}
              transition={{ repeat: Infinity, duration: 2 }}
            >
              Submit Application
            </motion.div>
          </motion.div>
        );

      case 1: // Document Verification
        return (
          <motion.div
            key="step1"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-[280px] sm:max-w-[320px] bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5 text-left text-xs text-slate-300 space-y-3 relative shadow-2xl overflow-hidden"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
              <span className="font-bold text-[#F5B301]">Verifying Files</span>
              <span className="text-[10px] text-emerald-400 font-bold flex items-center gap-1">
                <Clock className="w-3 h-3" /> SSL Secured
              </span>
            </div>
            
            {/* Glowing Laser Scan Line */}
            <motion.div
              className="absolute left-0 right-0 h-[2px] bg-gradient-to-r from-transparent via-[#F5B301] to-transparent blur-[1px]"
              animate={{ top: ['15%', '85%', '15%'] }}
              transition={{ duration: 2.5, repeat: Infinity, ease: "easeInOut" }}
            />

            <div className="space-y-2 relative z-10">
              {['Aadhaar Card Verification', 'PAN Card Verification', '12 Months Bank Statements'].map((doc, idx) => (
                <motion.div
                  key={idx}
                  className="flex justify-between items-center bg-slate-900 border border-slate-700/60 rounded-xl p-2.5"
                  initial={{ x: -10, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  transition={{ delay: idx * 0.2 }}
                >
                  <span className="text-[10px]">{doc}</span>
                  <motion.span
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ delay: 0.5 + idx * 0.3 }}
                    className="w-4 h-4 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center text-[8px]"
                  >
                    ✓
                  </motion.span>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 2: // Bank Processing
        return (
          <motion.div
            key="step2"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-[280px] sm:max-w-[320px] bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5 text-left text-xs text-slate-300 space-y-3 relative shadow-2xl overflow-hidden flex flex-col justify-between h-[180px]"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
              <span className="font-bold text-[#F5B301]">Matching Lenders</span>
              <span className="text-[10px] text-blue-400 animate-pulse">Scanning 71+ Banks</span>
            </div>

            {/* Radar scanner visual */}
            <div className="relative flex items-center justify-center h-28 my-auto">
              <motion.div
                className="w-20 h-20 rounded-full border border-primary/40 absolute"
                animate={{ scale: [1, 1.4, 1], opacity: [0.6, 0.1, 0.6] }}
                transition={{ duration: 3, repeat: Infinity }}
              />
              <motion.div
                className="w-12 h-12 rounded-full border border-primary/60 absolute"
                animate={{ scale: [1, 1.3, 1], opacity: [0.8, 0.3, 0.8] }}
                transition={{ duration: 3, repeat: Infinity, delay: 0.5 }}
              />
              <div className="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-xs font-bold text-white shadow-lg shadow-primary/40 relative z-10">
                Hub
              </div>

              {/* Bank matches */}
              {[
                { name: 'HDFC', top: '10%', left: '15%', rate: '8.4%' },
                { name: 'ICICI', top: '15%', right: '15%', rate: '8.5%' },
                { name: 'AXIS', bottom: '15%', left: '20%', rate: '8.6%' },
                { name: 'SBI', bottom: '10%', right: '20%', rate: '8.4%' }
              ].map((bank, i) => (
                <motion.div
                  key={i}
                  className="absolute p-1 px-2 rounded-lg bg-slate-900 border border-slate-700 text-[8px] font-bold text-center"
                  style={{ top: bank.top, left: bank.left, right: bank.right }}
                  animate={{ scale: [1, 1.05, 1] }}
                  transition={{ repeat: Infinity, duration: 2, delay: i * 0.4 }}
                >
                  <p>{bank.name}</p>
                  <p className="text-emerald-400">{bank.rate}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        );

      case 3: // Loan Approval
        return (
          <motion.div
            key="step3"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-[280px] sm:max-w-[320px] bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5 text-left text-xs text-slate-300 space-y-3 relative shadow-2xl overflow-hidden h-[180px] flex flex-col justify-between"
          >
            <div className="flex justify-between items-center pb-2 border-b border-slate-700">
              <span className="font-bold text-[#F5B301]">Sanction Letter</span>
              <span className="text-[10px] text-green-400 font-bold">Approved</span>
            </div>

            {/* Sanction Sheet Document mockup */}
            <motion.div
              className="bg-white text-slate-950 p-3.5 rounded-xl flex-1 flex flex-col justify-between border-t-4 border-emerald-500 mt-2 relative shadow-md"
              initial={{ y: 20 }}
              animate={{ y: 0 }}
            >
              <div>
                <h5 className="font-bold text-[10px] border-b border-slate-100 pb-1">GET LOANS HUB SANCTION</h5>
                <div className="space-y-1 mt-1 text-[8px] text-slate-500 font-medium">
                  <p className="flex justify-between"><span>Approved Limit:</span><strong className="text-slate-900">₹35,00,000</strong></p>
                  <p className="flex justify-between"><span>Rate:</span><strong className="text-slate-900">8.4% p.a.</strong></p>
                  <p className="flex justify-between"><span>Tenure:</span><strong className="text-slate-900">5 Years</strong></p>
                </div>
              </div>

              {/* Bouncing Approval Stamp */}
              <motion.div
                className="absolute right-4 bottom-2 px-2 py-1 border-2 border-emerald-500 text-emerald-500 font-black rounded-lg text-[9px] uppercase tracking-wider select-none rotate-12"
                initial={{ scale: 3, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ type: 'spring', stiffness: 200, delay: 0.5 }}
              >
                Approved
              </motion.div>
            </motion.div>
          </motion.div>
        );

      case 4: // Money Disbursed
        return (
          <motion.div
            key="step4"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="w-full max-w-[280px] sm:max-w-[320px] bg-slate-800 border border-slate-700 rounded-2xl p-4 sm:p-5 text-left text-xs text-slate-300 space-y-3 relative shadow-2xl overflow-hidden h-[180px] flex flex-col justify-center text-center"
          >
            {/* Floating Coins Effect */}
            {[...Array(6)].map((_, i) => (
              <motion.span
                key={i}
                className="absolute text-xl pointer-events-none"
                initial={{ y: 130, opacity: 0, x: 25 + i * 45 }}
                animate={{ y: -50, opacity: [0, 1, 0] }}
                transition={{
                  duration: 2.2 + i * 0.3,
                  repeat: Infinity,
                  delay: i * 0.25,
                  ease: "easeOut"
                }}
              >
                🪙
              </motion.span>
            ))}

            <div className="space-y-2 relative z-10 bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 backdrop-blur-sm">
              <div className="w-10 h-10 rounded-full bg-emerald-500/10 text-emerald-400 flex items-center justify-center mx-auto mb-2 border border-emerald-500/20">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <h5 className="font-extrabold text-xs text-white">Disbursement Successful</h5>
              <p className="text-[14px] font-black text-emerald-400">₹35,00,000</p>
              <p className="text-[8px] text-slate-400 uppercase tracking-widest mt-0.5">Credited to registered account</p>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <section className="section-py bg-[#080B11] text-white overflow-hidden border-t border-slate-900 relative">
      {/* Background visual glow */}
      <div className="absolute top-1/2 left-1/4 w-[500px] h-[500px] bg-primary/10 rounded-full blur-[120px] -translate-y-1/2 -z-10 pointer-events-none" />

      <div className="container-custom">
        
        {/* Section Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3.5 py-1.5 rounded-full">
            How It Works
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[42px] text-white mt-4 leading-tight">
            Simple 5-Step Path to Funding
          </h2>
        </div>

        {/* Steps slider block */}
        <div 
          className="grid lg:grid-cols-12 gap-12 lg:gap-16 items-center mt-12 bg-slate-950/40 border border-slate-900 rounded-[48px] p-8 sm:p-12 shadow-2xl"
          onMouseEnter={() => setIsPlaying(false)}
          onMouseLeave={() => setIsPlaying(true)}
        >
          {/* Left panel: Tablet Mockup Frame */}
          <div className="col-span-12 lg:col-span-6 flex justify-center items-center">
            <div className="w-full max-w-[440px] aspect-[1.38] bg-slate-900 border-[7px] border-slate-800 rounded-[32px] p-4 relative shadow-2xl overflow-hidden flex items-center justify-center select-none">
              {/* Camera Notch details */}
              <div className="absolute left-1/2 top-2 -translate-x-1/2 w-16 h-3 rounded-full bg-slate-800 flex items-center justify-center gap-1.5 px-3">
                <div className="w-1.5 h-1.5 rounded-full bg-slate-950" />
                <div className="w-1 h-1 rounded-full bg-slate-900" />
              </div>

              {/* Inner screen content */}
              <div className="w-full h-full bg-slate-950 rounded-2xl flex items-center justify-center border border-slate-850 p-2 sm:p-4">
                <AnimatePresence mode="wait">
                  {renderTabletContent()}
                </AnimatePresence>
              </div>

              {/* Tablet Home Button / Stripe */}
              <div className="absolute bottom-1 w-20 h-1 rounded-full bg-slate-700 left-1/2 -translate-x-1/2" />
            </div>
          </div>

          {/* Right panel: Active Step Info */}
          <div className="col-span-12 lg:col-span-6 flex flex-col justify-center text-left space-y-6">
            
            {/* Outline Numeric Indicator */}
            <div className="relative h-16 flex items-center select-none">
              <span className="text-[72px] font-black leading-none opacity-10 tracking-tight text-white select-none absolute left-0 font-display">
                {steps[activeStep].num}
              </span>
              <div className="w-8 h-px bg-accent ml-20" />
            </div>

            {/* Active Step Details */}
            <div className="space-y-4">
              <h3 className="font-display font-extrabold text-2xl sm:text-3xl text-white tracking-tight">
                {steps[activeStep].title}
              </h3>
              
              {/* Yellow Time Tag */}
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-xl bg-accent/10 border border-accent/25 text-accent text-xs font-bold uppercase tracking-wider">
                <Clock className="w-3.5 h-3.5" />
                <span>~ {steps[activeStep].duration}</span>
              </div>

              <p className="font-sans text-sm sm:text-base text-slate-300 leading-relaxed max-w-xl">
                {steps[activeStep].desc}
              </p>
            </div>

            {/* Slide Navigation Buttons & Dot Indicators */}
            <div className="flex items-center gap-4 pt-4 border-t border-slate-900">
              <div className="flex items-center gap-2">
                <button
                  onClick={handlePrev}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                  title="Previous Step"
                >
                  <ChevronLeft className="w-4 h-4" />
                </button>
                <button
                  onClick={handleNext}
                  className="p-2.5 rounded-xl border border-slate-800 bg-slate-900/50 text-slate-400 hover:text-white hover:bg-slate-800 transition-all cursor-pointer"
                  title="Next Step"
                >
                  <ChevronRight className="w-4 h-4" />
                </button>
              </div>

              {/* Progress Dots */}
              <div className="flex gap-2">
                {steps.map((_, idx) => (
                  <button
                    key={idx}
                    onClick={() => setActiveStep(idx)}
                    className={`h-2 rounded-full transition-all duration-300 ${
                      activeStep === idx ? 'w-6 bg-accent' : 'w-2 bg-slate-700 hover:bg-slate-600'
                    }`}
                  />
                ))}
              </div>

              {/* Auto play status details */}
              <span className="text-[9px] font-bold text-slate-500 uppercase tracking-widest ml-auto flex items-center gap-1.5">
                <RefreshCw className={`w-2.5 h-2.5 ${isPlaying ? 'animate-spin' : ''}`} />
                {isPlaying ? 'Auto-Advancing' : 'Paused'}
              </span>
            </div>

          </div>
        </div>

      </div>
    </section>
  );
}
