"use client";

import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Sparkles, CheckCircle2, AlertCircle, RefreshCw, 
  TrendingUp, Landmark, ShieldCheck, HelpCircle 
} from 'lucide-react';

export default function CreditMatchSection() {
  const [cibil, setCibil] = useState<number>(750);
  const [employment, setEmployment] = useState<'Salaried' | 'Self-Employed'>('Salaried');
  const [income, setIncome] = useState<number>(50000);
  const [emi, setEmi] = useState<number>(0);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<any | null>(null);

  const handleMatch = (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setResult(null);

    // Simulate match algorithm after 1.5 seconds loading state
    setTimeout(() => {
      let matchedLoan = 'Personal Loan';
      let probability: 'High' | 'Medium' | 'Low' = 'High';
      let recommendedLender = 'HDFC Bank';
      let interestRate = '9.9% p.a.';

      // Logic based on inputs
      if (cibil >= 780) {
        probability = 'High';
        recommendedLender = 'HDFC Bank';
        interestRate = '9.9% p.a.';
      } else if (cibil >= 720) {
        probability = 'High';
        recommendedLender = 'ICICI Bank';
        interestRate = '10.5% p.a.';
      } else if (cibil >= 650) {
        probability = 'Medium';
        recommendedLender = 'Axis Bank';
        interestRate = '11.5% p.a.';
      } else {
        probability = 'Low';
        recommendedLender = 'NBFC Partner (Bajaj Finserv)';
        interestRate = '13.5% p.a.';
      }

      // Check loan types based on inputs
      if (income >= 80000 && cibil >= 740) {
        matchedLoan = 'Home Loan';
        if (cibil >= 780) {
          interestRate = '7.10% p.a.';
          recommendedLender = 'SBI (State Bank of India)';
        } else {
          interestRate = '7.45% p.a.';
          recommendedLender = 'HDFC Bank';
        }
      }

      setResult({
        loan: matchedLoan,
        probability,
        lender: recommendedLender,
        rate: interestRate
      });
      setLoading(false);
    }, 1500);
  };

  return (
    <section className="section-py bg-gradient-to-b from-slate-50 to-white dark:from-slate-950 dark:to-slate-900/50 relative overflow-hidden" id="credit-match">
      {/* Background visual elements */}
      <div className="absolute top-1/2 left-1/2 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -translate-x-1/2 -translate-y-1/2 -z-10 pointer-events-none" />

      <div className="container-custom">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-widest bg-primary/5 dark:bg-accent/10 px-4 py-2 rounded-full border border-primary/10 dark:border-accent/10 select-none">
            INTELLIGENT MATCHING
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-4 leading-tight">
            Find Your Best Credit Match Instantly
          </h2>
          <p className="font-sans text-slate-550 dark:text-slate-400 mt-3 text-sm sm:text-base">
            Enter your credit parameters below. Our matchmaking algorithm will analyze top lenders and find your optimal loan.
          </p>
        </div>

        <div className="grid lg:grid-cols-12 gap-12 items-start text-left">
          {/* Match Parameters Form */}
          <div className="lg:col-span-6">
            <motion.form 
              onSubmit={handleMatch}
              className="p-8 rounded-3xl bg-white dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 shadow-xl space-y-6"
            >
              {/* CIBIL Score slider */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200">CIBIL Score: {cibil}</label>
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider ${
                    cibil >= 750 ? 'bg-emerald-500/10 text-emerald-500' :
                    cibil >= 680 ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                  }`}>
                    {cibil >= 750 ? 'Excellent' : cibil >= 680 ? 'Good' : 'Fair / Poor'}
                  </span>
                </div>
                <input 
                  type="range"
                  min="300"
                  max="900"
                  value={cibil}
                  onChange={(e) => setCibil(Number(e.target.value))}
                  className="w-full h-2 bg-slate-200 dark:bg-slate-800 rounded-lg appearance-none cursor-pointer accent-accent"
                />
                <div className="flex justify-between text-[10px] text-slate-450">
                  <span>300</span>
                  <span>650</span>
                  <span>750</span>
                  <span>900</span>
                </div>
              </div>

              {/* Employment Type dropdown */}
              <div className="space-y-2">
                <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Employment Type</label>
                <div className="grid grid-cols-2 gap-4">
                  {['Salaried', 'Self-Employed'].map((type) => (
                    <button
                      key={type}
                      type="button"
                      onClick={() => setEmployment(type as any)}
                      className={`h-12 rounded-xl border text-xs font-bold transition-all cursor-pointer ${
                        employment === type 
                          ? 'border-primary dark:border-accent bg-primary/5 dark:bg-accent/5 text-primary dark:text-accent' 
                          : 'border-slate-250 dark:border-slate-800 hover:border-slate-350 dark:hover:border-slate-700 text-slate-600 dark:text-slate-400'
                      }`}
                    >
                      {type}
                    </button>
                  ))}
                </div>
              </div>

              {/* Monthly Income and EMI Row */}
              <div className="grid sm:grid-cols-2 gap-6">
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Monthly Net Income (₹)</label>
                  <input
                    type="number"
                    required
                    min="10000"
                    value={income || ''}
                    onChange={(e) => setIncome(Number(e.target.value))}
                    className="w-full h-12 px-4 rounded-xl border border-slate-250 dark:border-slate-800 bg-transparent dark:text-white text-sm outline-none focus:border-primary dark:focus:border-accent"
                    placeholder="e.g. 50000"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-bold text-slate-800 dark:text-slate-200">Existing Monthly EMIs (₹)</label>
                  <input
                    type="number"
                    min="0"
                    value={emi || ''}
                    onChange={(e) => setEmi(Number(e.target.value))}
                    className="w-full h-12 px-4 rounded-xl border border-slate-250 dark:border-slate-800 bg-transparent dark:text-white text-sm outline-none focus:border-primary dark:focus:border-accent"
                    placeholder="e.g. 10000"
                  />
                </div>
              </div>

              {/* Submit trigger button */}
              <button
                type="submit"
                disabled={loading}
                className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-white font-extrabold text-xs shadow-md shadow-primary/10 hover:opacity-95 transition-all cursor-pointer flex items-center justify-center gap-1.5"
              >
                {loading ? (
                  <>
                    <RefreshCw className="w-4 h-4 animate-spin" />
                    <span>Analyzing Credit Profile...</span>
                  </>
                ) : (
                  <>
                    <Sparkles className="w-4 h-4" />
                    <span>Match Credit Offers</span>
                  </>
                )}
              </button>
            </motion.form>
          </div>

          {/* Results Side Panel */}
          <div className="lg:col-span-6 flex flex-col justify-center min-h-[380px]">
            <AnimatePresence mode="wait">
              {loading && (
                <motion.div
                  key="loading"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  className="flex flex-col items-center justify-center space-y-4 p-8 text-center"
                >
                  <div className="relative w-16 h-16 flex items-center justify-center">
                    <span className="absolute w-full h-full rounded-full border-[3px] border-primary/20 dark:border-accent/20 border-t-primary dark:border-t-accent animate-spin" />
                    <Sparkles className="w-6 h-6 text-primary dark:text-accent animate-pulse" />
                  </div>
                  <h4 className="font-display font-extrabold text-lg text-slate-800 dark:text-white">Connecting with Underwriters</h4>
                  <p className="font-sans text-xs text-slate-450 max-w-xs">Scanning interest rates across 40+ matched financial institutions...</p>
                </motion.div>
              )}

              {!loading && !result && (
                <motion.div
                  key="empty"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="p-8 rounded-3xl border border-dashed border-slate-200 dark:border-slate-850 flex flex-col items-center text-center justify-center space-y-4 text-slate-450 h-full"
                >
                  <Landmark className="w-12 h-12 text-slate-300 dark:text-slate-700" />
                  <div>
                    <h4 className="font-display font-extrabold text-sm text-slate-800 dark:text-slate-200">No Offer Matched Yet</h4>
                    <p className="font-sans text-xs mt-1">Submit your basic parameters on the left to verify real-time loan matches.</p>
                  </div>
                </motion.div>
              )}

              {!loading && result && (
                <motion.div
                  key="result"
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -15 }}
                  className="p-8 rounded-3xl border border-slate-200/50 dark:border-slate-800 bg-white dark:bg-slate-900/60 shadow-2xl space-y-6"
                >
                  <div className="flex items-center gap-3 pb-4 border-b border-slate-100 dark:border-slate-800">
                    <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                      <ShieldCheck className="w-5 h-5" />
                    </div>
                    <div>
                      <span className="text-[10px] font-black uppercase text-slate-400">Match Found</span>
                      <h4 className="font-display font-extrabold text-lg text-slate-900 dark:text-white">Optimal Loan Proposal</h4>
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-6">
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Best Matching Loan</span>
                      <p className="font-display font-extrabold text-base text-slate-900 dark:text-white">{result.loan}</p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Approval Probability</span>
                      <span className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase mt-1 ${
                        result.probability === 'High' ? 'bg-emerald-500/10 text-emerald-500' :
                        result.probability === 'Medium' ? 'bg-amber-500/10 text-amber-500' : 'bg-rose-500/10 text-rose-500'
                      }`}>
                        {result.probability} Chance
                      </span>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Recommended Lender</span>
                      <p className="font-sans font-bold text-sm text-slate-800 dark:text-slate-250 flex items-center gap-1.5 mt-0.5">
                        <Landmark className="w-4 h-4 text-primary dark:text-accent shrink-0" />
                        <span>{result.lender}</span>
                      </p>
                    </div>
                    <div className="space-y-1">
                      <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Est. Interest Rate</span>
                      <p className="font-sans font-bold text-sm text-emerald-500 flex items-center gap-1 mt-0.5">
                        <TrendingUp className="w-4 h-4 shrink-0" />
                        <span>{result.rate} onwards</span>
                      </p>
                    </div>
                  </div>

                  <div className="pt-4 border-t border-slate-100 dark:border-slate-800 flex items-center gap-3">
                    <p className="text-[11px] text-slate-450 leading-relaxed">
                      *Note: Interest rate and bank matches are estimated based on your CIBIL rating and income ratio. Final underwriting approvals depend on profile check.
                    </p>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </div>

      </div>
    </section>
  );
}
