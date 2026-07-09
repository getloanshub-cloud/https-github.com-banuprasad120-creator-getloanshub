"use client";

import React from 'react';
import { MapPin, Phone, Mail } from 'lucide-react';

export default function FocusedInfo() {
  return (
    <section className="py-16 bg-slate-50 dark:bg-slate-950 border-t border-slate-200/50 dark:border-slate-800/80">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-12">
          <span className="text-xs font-bold text-[#F5B301] uppercase tracking-widest bg-[#F5B301]/10 px-3.5 py-1.5 rounded-full">
            FOCUSED WITH WORK
          </span>
          <h2 className="font-display font-extrabold text-2xl sm:text-3xl text-slate-900 dark:text-white mt-4 leading-tight">
            We're India's Leading Financial Consulting Firm To Help With Your Business & Personal Needs
          </h2>
        </div>

        {/* 3 Columns Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-6xl mx-auto">

          {/* Column 1: Head Office */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#0A4D9D]/10 dark:bg-[#F5B301]/10 flex items-center justify-center text-[#0A4D9D] dark:text-[#F5B301] mb-5">
                <MapPin className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-3">
                Head Office
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-550 dark:text-slate-450 leading-relaxed font-medium">
                <a
                  href="https://www.google.com/maps/search/?api=1&query=Paigah+Plaza,+Basheerbagh,+Hyderabad,+Telangana+-+500063"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-[#0A4D9D] dark:hover:text-[#F5B301] hover:underline transition-colors"
                >
                  Paigah Plaza, Basheerbagh,<br />Hyderabad, Telangana - 500063
                </a>
              </p>
            </div>
          </div>

          {/* Column 2: Calling Support */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#0A4D9D]/10 dark:bg-[#F5B301]/10 flex items-center justify-center text-[#0A4D9D] dark:text-[#F5B301] mb-5">
                <Phone className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-3">
                Calling Support
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-555 dark:text-slate-400 leading-relaxed">
                24/7 Line: <a href="tel:9000100262" className="font-semibold text-[#0A4D9D] dark:text-[#F5B301] hover:underline">+91 9000100262</a><br />
                Email: <a href="mailto:admin@getloanshub.com" className="hover:underline">admin@getloanshub.com</a>
              </p>
            </div>
          </div>

          {/* Column 3: Email Information */}
          <div className="p-8 rounded-3xl bg-white dark:bg-slate-900 border border-slate-200/60 dark:border-slate-800 shadow-sm hover:shadow-md transition-shadow text-center flex flex-col items-center justify-between">
            <div className="flex flex-col items-center">
              <div className="w-12 h-12 rounded-full bg-[#0A4D9D]/10 dark:bg-[#F5B301]/10 flex items-center justify-center text-[#0A4D9D] dark:text-[#F5B301] mb-5">
                <Mail className="w-6 h-6" />
              </div>
              <h3 className="font-display font-bold text-base text-slate-900 dark:text-white mb-3">
                Email Information
              </h3>
              <p className="font-sans text-xs sm:text-sm text-slate-555 dark:text-slate-400 leading-relaxed">
                <a href="mailto:support@getloanshub.com" className="hover:underline">support@getloanshub.com</a><br />
                <a href="mailto:reply@getloanshub.com" className="hover:underline">reply@getloanshub.com</a>
              </p>
            </div>
          </div>

        </div>

      </div>
    </section>
  );
}
