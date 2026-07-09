"use client";

import React from 'react';
import { User, Briefcase, Home, Car, Stethoscope, Activity, Scale, GraduationCap, Shield, CreditCard, ArrowUpRight } from 'lucide-react';
import { motion } from 'framer-motion';

interface ServicesSectionProps {
  setView: (view: string) => void;
  setSelectedLoanType?: (type: string) => void;
}

export default function ServicesSection({ setView, setSelectedLoanType }: ServicesSectionProps) {

  const handleApply = (name: string) => {
    if (setSelectedLoanType) {
      setSelectedLoanType(name);
    }
    setView('apply');
  };

  const PRODUCTS = [
    {
      name: 'Personal Loans',
      image: '/images/personal_loan.png',
      icon: User,
      desc: 'Personal loans are provided by most of the banks/NBFCs but with distinct eligibility requirements'
    },
    {
      name: 'Business Loans',
      image: '/images/business_loan.png',
      icon: Briefcase,
      desc: 'Business loans help your small business grow, allowing you to invest in infrastructure, operations, and machinery'
    },
    {
      name: 'Home Loans',
      image: '/images/home_loan.png',
      icon: Home,
      desc: 'Home Loan is a secured loan where Banks & NBFCs provide finances for the purchase or construction of residential/commercial property'
    },
    {
      name: 'Car Loans',
      image: '/images/car_loan.png',
      icon: Car,
      desc: 'Car Loans provide custom features and advantages with low interest rates for purchase of new or used vehicles'
    },
    {
      name: 'Doctor Loans',
      image: '/images/doctors_loan.png',
      icon: Stethoscope,
      desc: 'Specialized high-value funding and practice expansion loans designed exclusively for medical practitioners and doctors'
    },
    {
      name: 'Educational Loans',
      image: '/images/educational_loan.png',
      icon: GraduationCap,
      desc: 'Educational loans help your study grow, allowing you to invest in your future, studies, and abroad courses'
    },
    {
      name: 'Insurance',
      image: '/images/insurance.png',
      icon: Shield,
      desc: 'Comprehensive life, health, and asset insurance policies to safeguard your family and business assets'
    },
    {
      name: 'Credit Cards',
      image: '/images/credit_card.png',
      icon: CreditCard,
      desc: 'Compare and apply for top credit cards with premium rewards, cashback, and lounge access benefits'
    }
  ];

  return (
    <section className="py-24 bg-white dark:bg-slate-900" id="services">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header Text */}
        <div className="text-center max-w-3xl mx-auto mb-20">
          <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-widest bg-primary/5 dark:bg-accent/10 px-3.5 py-1.5 rounded-full">
            OUR PRODUCTS
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[42px] text-slate-900 dark:text-white mt-4">
            Secure your Financial Future Through Our Transparent & Safe Financial Solutions
          </h2>
          <p className="font-sans text-slate-500 dark:text-slate-400 mt-4 text-base">
            Experience our Esteem Services
          </p>
        </div>

        {/* Services Grid (4 Columns) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {PRODUCTS.map((product, idx) => {
            const IconComponent = product.icon;
            return (
              <motion.div
                key={product.name}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-50px" }}
                transition={{ duration: 0.5, delay: idx * 0.08 }}
                whileHover={{ y: -6, scale: 1.02 }}
                className="rounded-3xl overflow-hidden glass-card flex flex-col justify-between border border-slate-200/50 dark:border-slate-800/80 hover:border-primary/30 dark:hover:border-accent/30 transition-all hover:shadow-lg text-left group bg-slate-50/50 dark:bg-slate-800/20"
              >
                {/* Product Image Header */}
                <div className="relative w-full aspect-[16/11] overflow-hidden bg-slate-100 dark:bg-slate-800">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {/* Absolute overlay icon */}
                  <div className="absolute top-3 right-3 w-8 h-8 rounded-full bg-white/90 dark:bg-slate-900/90 shadow-sm flex items-center justify-center text-primary dark:text-accent">
                    <IconComponent className="w-4 h-4" />
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-6 flex-1 flex flex-col justify-between h-full">
                  <div>
                    <h3 className="font-display font-extrabold text-lg text-slate-900 dark:text-white mb-2 group-hover:text-primary dark:group-hover:text-accent transition-colors">
                      {product.name}
                    </h3>
                    
                    <p className="font-sans text-xs text-slate-500 dark:text-slate-455 leading-relaxed mb-6">
                      {product.desc}
                    </p>
                  </div>

                  <motion.button
                    whileTap={{ scale: 0.98 }}
                    onClick={() => handleApply(product.name)}
                    className="w-full text-center h-12 rounded-xl border border-slate-200 dark:border-slate-705 hover:border-primary dark:hover:border-accent text-sm font-bold text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-accent hover:bg-primary/5 transition-all cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <span>Apply Online</span>
                    <ArrowUpRight className="w-4 h-4" />
                  </motion.button>
                </div>
              </motion.div>
            );
          })}
        </div>

        {/* Fast Comparative Analysis Section */}
        <motion.div 
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 rounded-[40px] bg-gradient-to-br from-primary to-secondary text-white shadow-2xl text-left relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent opacity-15 rounded-full blur-3xl -z-10" />
          <div className="flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="space-y-4 max-w-2xl">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/10 text-accent text-xs font-bold uppercase tracking-wider">
                <Scale className="w-3.5 h-3.5" />
                <span>Fast Comparative Analysis</span>
              </div>
              <p className="font-sans text-base sm:text-lg leading-relaxed text-white">
                For any loan services, we provide complete comparative analysis and assist you in your final decision.
              </p>
            </div>
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => setView('apply')}
              className="px-8 py-4 rounded-2xl bg-white text-primary hover:bg-slate-50 font-bold transition-all text-sm whitespace-nowrap cursor-pointer shadow-lg shadow-black/10"
            >
              Get Analysis Now
            </motion.button>
          </div>
        </motion.div>

      </div>
    </section>
  );
}
