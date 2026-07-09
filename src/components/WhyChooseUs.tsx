"use client";

import React from 'react';
import { Smartphone, Truck, Percent, FileSearch, Users, Smile } from 'lucide-react';
import { motion } from 'framer-motion';

export default function WhyChooseUs() {
  const cards = [
    { 
      title: 'Digital Platform', 
      desc: 'Get Loans Hub is the best loan assistance digital platform providing all services at a single click and you can gather all information from our website.', 
      icon: Smartphone, 
      color: 'from-blue-500 to-indigo-600' 
    },
    { 
      title: 'Competitive Interest Rate', 
      desc: 'Get Loans hub is partnered with more than 40+ Banks & NBFCs to provide the lowest loan interest rate for the client desired loan.', 
      icon: Percent, 
      color: 'from-amber-500 to-orange-600' 
    },
    { 
      title: 'Loan Analysis', 
      desc: 'Get detailed, bank-neutral comparative analysis of all eligible loan offers to choose the most cost-effective and suitable plan.', 
      icon: FileSearch, 
      color: 'from-purple-500 to-pink-600' 
    },
    { 
      title: 'Loan Advisors', 
      desc: 'Dedicated certified experts guide you step-by-step from documentation to hassle-free disbursal, ensuring higher approval rates.', 
      icon: Users, 
      color: 'from-cyan-500 to-blue-600' 
    },
    { 
      title: 'Client Satisfaction', 
      desc: 'We prioritize your ease and peace of mind, delivering seamless support and transparent communication at every stage.', 
      icon: Smile, 
      color: 'from-rose-500 to-red-600' 
    }
  ];

  return (
    <section className="py-24 relative overflow-hidden bg-slate-50 dark:bg-slate-900/30">
      {/* Subtle radial backdrop accent */}
      <div className="absolute top-1/2 left-1/2 w-[600px] h-[600px] bg-primary/5 rounded-full blur-[120px] -translate-x-1/2 -translate-y-1/2 -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Title Section */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-widest bg-primary/5 dark:bg-accent/10 px-4 py-2 rounded-full border border-primary/10 dark:border-accent/10">
            Our Advantage
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[46px] text-slate-900 dark:text-white mt-4 leading-tight">
            Why Choose Us
          </h2>
        </div>

        {/* Advantage Grid with 3D perspective */}
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8 [perspective:1000px]">
          {cards.map((card, index) => {
            const IconComponent = card.icon;
            return (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 25 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.25, delay: index * 0.05 }}
                whileHover={{ y: -6, rotateY: 3, rotateX: -1, scale: 1.015 }}
                className="p-8 rounded-3xl glass-card premium-border flex flex-col items-start text-left border border-slate-200/50 dark:border-slate-800/80 hover:border-primary/25 dark:hover:border-accent/25 hover:shadow-xl hover:shadow-primary/5 transition-all duration-150 group preserve-3d cursor-pointer"
              >
                {/* Gradient-circled icon container */}
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-tr ${card.color} flex items-center justify-center text-white shadow-lg transition-transform group-hover:scale-110 duration-200 mb-6`}>
                  <IconComponent className="w-5 h-5" />
                </div>
                
                <h3 className="font-display font-bold text-lg text-slate-900 dark:text-white mb-3">
                  {card.title}
                </h3>
                <p className="font-sans text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                  {card.desc}
                </p>
              </motion.div>
            );
          })}
        </div>

      </div>
    </section>
  );
}
