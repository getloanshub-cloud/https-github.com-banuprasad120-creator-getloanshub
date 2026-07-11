"use client";

import React from 'react';
import { motion } from 'framer-motion';
import { 
  User, Home, Stethoscope, ArrowRight, CheckCircle2, 
  TrendingUp, ShieldCheck, Percent 
} from 'lucide-react';

export default function InterestRatesSection() {
  const rates = [
    {
      name: 'Personal Loan',
      rate: '9.9% p.a.',
      icon: User,
      color: 'bg-blue-500/10 text-blue-500',
      border: 'hover:border-blue-500/25',
      features: ['No security needed', 'Min. income ₹15,000/mo', 'Flexible 1-5 year tenure']
    },
    {
      name: 'Home Loan',
      rate: '7.10% p.a.',
      icon: Home,
      color: 'bg-emerald-500/10 text-emerald-500',
      border: 'hover:border-emerald-500/25',
      features: ['Longest tenure up to 30 yrs', 'Balance transfer benefits', 'Doorstep document support']
    },
    {
      name: 'Doctor Loan',
      rate: '9.99% p.a.',
      icon: Stethoscope,
      color: 'bg-amber-500/10 text-amber-500',
      border: 'hover:border-amber-500/25',
      features: ['Exclusive for MD/MS/BDS', 'No collateral up to 50L', 'Approval within 24 hours']
    }
  ];

  return (
    <section className="section-py bg-slate-900/40 text-white relative overflow-hidden" id="rates">
      {/* Background ambient light */}
      <div className="absolute top-[30%] left-[20%] w-[450px] h-[450px] bg-primary/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="container-custom">
        {/* Title */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-4 py-2 rounded-full border border-accent/10">
            TRANSPARENT CORRIDORS
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-white mt-4 leading-tight">
            Compare Real-Time Interest Rates
          </h2>
          <p className="font-sans text-slate-400 mt-3 text-sm sm:text-base">
            Get Loans Hub coordinates with India's top 40+ lending institutions to secure the lowest possible interest rate grids.
          </p>
        </div>

        {/* Rate Cards Grid */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
          {rates.map((item, idx) => {
            const IconComponent = item.icon;
            return (
              <motion.div
                key={idx}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-60px" }}
                transition={{ duration: 0.5, delay: idx * 0.1 }}
                whileHover={{ y: -6 }}
                className={`p-8 rounded-3xl bg-[#0B0F19] border border-slate-800 transition-all text-left flex flex-col justify-between h-[380px] hover:shadow-2xl hover:shadow-primary/5 ${item.border} group`}
              >
                <div>
                  <div className="flex justify-between items-start mb-6">
                    <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${item.color}`}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                    <span className="text-[10px] font-black uppercase text-slate-500 tracking-wider bg-slate-950 border border-slate-850 px-2.5 py-1 rounded-md flex items-center gap-1">
                      <Percent className="w-3 h-3 text-accent" />
                      <span>Best Rate</span>
                    </span>
                  </div>

                  <span className="text-xs font-extrabold text-slate-400 uppercase tracking-widest block mb-1">
                    {item.name}
                  </span>
                  <h3 className="font-display font-extrabold text-3xl text-white mb-6">
                    {item.rate} <span className="text-xs font-semibold text-slate-400 uppercase">onwards</span>
                  </h3>

                  <ul className="space-y-2.5">
                    {item.features.map((feature, fIdx) => (
                      <li key={fIdx} className="font-sans text-xs text-slate-300 flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-accent shrink-0" />
                        <span>{feature}</span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-6 border-t border-slate-850 flex justify-between items-center text-xs font-bold text-accent group-hover:text-white transition-colors cursor-pointer select-none">
                  <span>Check eligibility guidelines</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </div>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
