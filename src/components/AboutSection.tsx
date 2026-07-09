"use client";

import React from 'react';
import { Mail, Phone, HeartHandshake, Eye, Target, Compass } from 'lucide-react';
import { motion } from 'framer-motion';

export default function AboutSection() {
  const representativeInfo = {
    name: 'Loans Advisor',
    title: 'Representative',
    company: 'Starpowerz Digital Technologies Pvt. Ltd.',
    phone: '9000100262',
    email: 'info@getloanshub.com'
  };

  const stats = [
    { label: 'Associated Company', value: 'Starpowerz Digital Technologies Pvt Ltd.' },
    { label: 'Experience', value: 'Over 15 years of experience working with more than 100 financial institutions across India' },
    { label: 'Banks & NBFCs', value: 'Partnering with over 71 Banks/NBFCs' },
    { label: 'Coverage across states', value: 'Vast yet well-connected network spread across 29 states' },
    { label: 'Team Information', value: 'Our dedicated team of professional representatives and offices located across the country' }
  ];

  return (
    <section className="py-24 bg-gradient-to-b from-white to-slate-50 dark:from-slate-900 dark:to-slate-950" id="about">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* About Main Intro */}
        <div className="grid lg:grid-cols-12 gap-16 items-center mb-20 text-left">
          {/* Left: About Text */}
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5 }}
            className="lg:col-span-7 space-y-6"
          >
            <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-widest bg-primary/5 dark:bg-accent/10 px-3.5 py-1.5 rounded-full">
              ABOUT GET LOANS HUB
            </span>
            <h2 className="font-display font-extrabold fluid-heading text-slate-900 dark:text-white">
              Empowering Your Financial Future
            </h2>
            <div className="font-sans text-slate-650 dark:text-slate-350 space-y-4 leading-relaxed text-sm sm:text-base">
              <p>
                Get Loans Hub is one of the most trusted, bank-neutral platforms that works closely with its partner banks to secure the lowest interest rates, highest loan eligibility, premium offers, and superior customer service for customers across the country. Apply online at Get Loans Hub to get loans across India. Many banks and NBFCs run special personal loan offers from time to time. Our personalized loan advisors guide you closely throughout the entire loan process, from initial application to final disbursal.
              </p>
              <p>
                Get Loans Hub is associated with Starpowerz Digital Technologies Pvt. Ltd. We are backed by a team of expert professionals with over 15 years of experience working with more than 100 financial institutions across India. Starpowerz is driven by the vision of extending our financial solutions to remote areas and assisting everyone in need of financial support. Our dedicated team of professional representatives and offices located nationwide help us maintain a vast, well-connected network spread across 29 states, partnering with over 71 banks and NBFCs.
              </p>
            </div>
          </motion.div>

          {/* Right: Advisor Card */}
          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.5, delay: 0.15 }}
            whileHover={{ y: -5, scale: 1.015 }}
            className="lg:col-span-5 w-full"
          >
            <div className="relative p-8 rounded-3xl glass shadow-xl border border-slate-200/50 dark:border-slate-800/80 max-w-md mx-auto glow-primary overflow-hidden">
              <div className="absolute top-[-50px] right-[-50px] w-36 h-36 bg-gradient-to-tr from-accent to-secondary opacity-15 rounded-full blur-2xl -z-10" />
              
              {/* Profile Header */}
              <div className="flex items-center gap-4 mb-6">
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-3xl shadow-inner shadow-primary/10">
                  👨‍💼
                </div>
                <div>
                  <h3 className="font-display font-extrabold text-xl text-slate-950 dark:text-white">
                    {representativeInfo.name}
                  </h3>
                  <p className="text-xs font-semibold text-primary dark:text-accent uppercase tracking-wider">
                    {representativeInfo.title}
                  </p>
                </div>
              </div>

              {/* Quick Contact Links */}
              <div className="space-y-4 border-t border-slate-200/60 dark:border-slate-800/60 pt-6">
                <div className="flex items-center gap-3 text-sm text-slate-755 dark:text-slate-350">
                  <HeartHandshake className="w-5 h-5 text-primary dark:text-accent shrink-0" />
                  <span className="font-semibold text-slate-900 dark:text-white">Trusted Representation</span>
                </div>
                <a
                  href={`tel:${representativeInfo.phone}`}
                  className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-accent transition-colors"
                >
                  <Phone className="w-5 h-5 text-primary dark:text-accent" />
                  <span className="font-bold">{representativeInfo.phone}</span>
                </a>
                <a
                  href={`mailto:${representativeInfo.email}`}
                  className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-300 hover:text-primary dark:hover:text-accent transition-colors"
                >
                  <Mail className="w-5 h-5 text-primary dark:text-accent" />
                  <span className="truncate font-medium">{representativeInfo.email}</span>
                </a>
              </div>
            </div>
          </motion.div>
        </div>

        {/* Vision, Mission, Strategy */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8 mb-20 text-left">
          {/* Vision */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="p-8 rounded-3xl glass border border-slate-200/50 dark:border-slate-850 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-amber-500/10 flex items-center justify-center text-amber-500 mb-6">
                <Eye className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white mb-4">
                Vision
              </h3>
              <p className="font-sans text-sm text-slate-550 dark:text-slate-400 leading-relaxed font-bold">
                Living a Confident Life
              </p>
            </div>
          </motion.div>

          {/* Mission */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: 0.1 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="p-8 rounded-3xl glass border border-slate-200/50 dark:border-slate-850 hover:shadow-lg transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-primary/10 flex items-center justify-center text-primary dark:text-accent mb-6">
                <Target className="w-6 h-6" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white mb-4">
                Mission
              </h3>
              <p className="font-sans text-sm text-slate-550 dark:text-slate-400 leading-relaxed">
                Our goal at Get Loans Hub is to provide access to home loans, personal loans, mortgage loans, business loans & MSME loans at competitive interest rates.
              </p>
            </div>
          </motion.div>

          {/* Strategy */}
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-80px" }}
            transition={{ duration: 0.4, delay: 0.2 }}
            whileHover={{ y: -8, scale: 1.02 }}
            className="p-8 rounded-3xl glass premium-border border border-slate-200/50 dark:border-slate-850 hover:shadow-lg hover:border-teal-500/25 transition-all flex flex-col justify-between cursor-pointer"
          >
            <div>
              <div className="w-12 h-12 rounded-2xl bg-teal-500/10 flex items-center justify-center text-teal-500 mb-6">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="font-display font-extrabold text-xl text-slate-900 dark:text-white mb-4">
                Strategy
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Leveraging state-of-the-art digital matchmaking pipelines and robust localized advisor networks to provide instant credit verification and doorstep assistance across all Indian states.
              </p>
            </div>
          </motion.div>
        </div>

        {/* Company Information Grid */}
        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, margin: "-100px" }}
          transition={{ duration: 0.6 }}
          className="p-8 sm:p-12 rounded-[40px] bg-slate-900 dark:bg-slate-950 border border-slate-800 text-white shadow-2xl relative overflow-hidden text-left"
        >
          <div className="absolute top-0 right-0 w-80 h-80 bg-primary/10 rounded-full blur-[100px]" />
          
          <div className="max-w-3xl mb-12">
            <span className="text-xs font-bold text-accent uppercase tracking-widest">
              TRUSTED NUMBERS
            </span>
            <h3 className="font-display font-extrabold text-2xl sm:text-3xl mt-2 text-white">
              Company Information
            </h3>
          </div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {stats.map((stat, idx) => (
              <motion.div 
                key={idx} 
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.05 }}
                className="space-y-2 border-l-2 border-accent/40 pl-5"
              >
                <p className="text-xs font-extrabold text-slate-400 uppercase tracking-wider">
                  {stat.label}
                </p>
                <p className="text-sm font-semibold text-slate-100 leading-snug">
                  {stat.value}
                </p>
              </motion.div>
            ))}
          </div>
        </motion.div>

      </div>
    </section>
  );
}
