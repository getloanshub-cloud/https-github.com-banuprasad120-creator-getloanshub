"use client";

import React, { useState } from 'react';
import { Mail, Phone, MapPin, Calendar, Clock, Sparkles, MessageCircle } from 'lucide-react';
import { DigiDb } from '@/lib/db';

export default function ContactSection() {
  const [activeAction, setActiveAction] = useState<'appointment' | 'callback'>('appointment');

  // Appointment Form
  const [aptName, setAptName] = useState('');
  const [aptPhone, setAptPhone] = useState('');
  const [aptEmail, setAptEmail] = useState('');
  const [aptDate, setAptDate] = useState('');
  const [aptTime, setAptTime] = useState('10:00 AM');
  const [aptPurpose, setAptPurpose] = useState('Personal Loan Consultation');
  const [showAptSuccess, setShowAptSuccess] = useState(false);

  // Callback Form
  const [callName, setCallName] = useState('');
  const [callPhone, setCallPhone] = useState('');
  const [callPurpose, setCallPurpose] = useState('Business Loan');
  const [showCallSuccess, setShowCallSuccess] = useState(false);

  const handleBookAppointment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (aptName && aptPhone && aptDate) {
      await DigiDb.saveAppointmentAsync({
        fullName: aptName,
        mobileNumber: aptPhone,
        email: aptEmail,
        date: aptDate,
        time: aptTime,
        purpose: aptPurpose,
        branch: 'Huzurabad HQ',
        advisor: 'Loans Advisor'
      });
      setShowAptSuccess(true);
      // Reset
      setAptName('');
      setAptPhone('');
      setAptEmail('');
      setAptDate('');
      setTimeout(() => setShowAptSuccess(false), 5000);
    }
  };

  const handleRequestCallback = async (e: React.FormEvent) => {
    e.preventDefault();
    if (callName && callPhone) {
      await DigiDb.saveLeadAsync({
        fullName: callName,
        mobileNumber: callPhone,
        email: '',
        city: 'Huzurabad',
        loanType: callPurpose,
        loanAmount: 0,
        monthlyIncome: 0,
        occupation: 'Other',
        message: 'Callback request submitted from Contact section.',
        source: 'Website',
        priority: 'Medium',
        tags: ['Callback Request']
      });
      setShowCallSuccess(true);
      setCallName('');
      setCallPhone('');
      setTimeout(() => setShowCallSuccess(false), 5000);
    }
  };

  return (
    <section className="section-py bg-slate-50 dark:bg-slate-900/50" id="contact">
      <div className="container-custom">
        
        <div className="grid lg:grid-cols-12 gap-12">
          
          {/* Office Contact Info */}
          <div className="lg:col-span-5 space-y-8 flex flex-col justify-between">
            <div>
              <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider">
                Get In Touch
              </span>
              <h2 className="font-display font-extrabold fluid-heading text-slate-900 dark:text-white mt-2">
                Connect with our Advisors
              </h2>
              <p className="font-sans text-slate-500 dark:text-slate-400 mt-4 leading-relaxed">
                Have immediate questions about CIBIL eligibility, loan terms, or documentation? Feel free to contact our office directly.
              </p>
            </div>

            {/* Structured details */}
            <div className="space-y-6 my-8">

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-accent shrink-0 mt-0.5">
                  <Phone className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white">Call/WhatsApp</h4>
                  <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-1 font-semibold text-primary dark:text-accent">
                    9000100262
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-accent shrink-0 mt-0.5">
                  <Mail className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white">Email Address</h4>
                  <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-1">
                    info@getloanshub.com
                  </p>
                </div>
              </div>

              <div className="flex items-start gap-4">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center text-primary dark:text-accent shrink-0 mt-0.5">
                  <Clock className="w-5 h-5" />
                </div>
                <div>
                  <h4 className="font-display font-extrabold text-sm text-slate-900 dark:text-white">Working Hours</h4>
                  <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-1">
                    Mon - Sat: 9:30 AM - 6:30 PM | Sunday: Closed
                  </p>
                </div>
              </div>
            </div>

            {/* Quick action buttons */}
            <div className="flex flex-col sm:flex-row gap-3 w-full sm:w-auto">
              <a
                href="tel:9000100262"
                className="h-12 px-6 rounded-xl bg-primary hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-primary/15 transition-all flex items-center justify-center gap-1.5"
              >
                <Phone className="w-4 h-4" />
                <span>Call Now</span>
              </a>
              <a
                href="https://wa.me/919000100262"
                target="_blank"
                rel="noreferrer"
                className="h-12 px-6 rounded-xl bg-green-600 hover:opacity-95 text-white text-xs font-semibold shadow-md shadow-green-600/10 transition-all flex items-center justify-center gap-1.5"
              >
                <MessageCircle className="w-4.5 h-4.5" />
                <span>WhatsApp</span>
              </a>
            </div>
          </div>

          {/* Booking Widget Column */}
          <div className="lg:col-span-7">
            <div className="p-6 sm:p-8 rounded-3xl glass shadow-md border border-slate-200/40 dark:border-slate-800">
              
              {/* Form header tab selector */}
              <div className="flex border-b border-slate-200 dark:border-slate-850 pb-4 mb-6 gap-6">
                <button
                  onClick={() => setActiveAction('appointment')}
                  className={`text-sm font-bold pb-2 relative transition-all cursor-pointer ${
                    activeAction === 'appointment'
                      ? 'text-primary dark:text-accent border-b-2 border-primary dark:border-accent'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Book Appointment
                </button>
                <button
                  onClick={() => setActiveAction('callback')}
                  className={`text-sm font-bold pb-2 relative transition-all cursor-pointer ${
                    activeAction === 'callback'
                      ? 'text-primary dark:text-accent border-b-2 border-primary dark:border-accent'
                      : 'text-slate-400 hover:text-slate-600'
                  }`}
                >
                  Request Callback
                </button>
              </div>

              {activeAction === 'appointment' ? (
                /* APPOINTMENT FORM */
                <form onSubmit={handleBookAppointment} className="space-y-4">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                      <input
                        type="text"
                        required
                        placeholder="Enter full name"
                        value={aptName}
                        onChange={(e) => setAptName(e.target.value)}
                        className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Mobile Number</label>
                      <input
                        type="tel"
                        required
                        placeholder="Enter mobile number"
                        value={aptPhone}
                        onChange={(e) => setAptPhone(e.target.value)}
                        className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Email Address (Optional)</label>
                      <input
                        type="email"
                        placeholder="Enter email address"
                        value={aptEmail}
                        onChange={(e) => setAptEmail(e.target.value)}
                        className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Preferred Date</label>
                      <input
                        type="date"
                        required
                        value={aptDate}
                        onChange={(e) => setAptDate(e.target.value)}
                        className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent"
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Preferred Time Slot</label>
                      <select
                        value={aptTime}
                        onChange={(e) => setAptTime(e.target.value)}
                        className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent font-semibold text-slate-700 dark:text-slate-355"
                      >
                        <option>10:00 AM</option>
                        <option>11:30 AM</option>
                        <option>2:00 PM</option>
                        <option>3:30 PM</option>
                        <option>5:00 PM</option>
                      </select>
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-[10px] uppercase font-bold text-slate-400">Purpose</label>
                      <select
                        value={aptPurpose}
                        onChange={(e) => setAptPurpose(e.target.value)}
                        className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent font-semibold text-slate-700 dark:text-slate-355"
                      >
                        <option>Personal Loan Consultation</option>
                        <option>Business Expansion capital</option>
                        <option>Home/Construction advice</option>
                        <option>Insurance cover checks</option>
                      </select>
                    </div>
                  </div>

                  {showAptSuccess && (
                    <div className="p-3 bg-success/15 border border-success text-success rounded-xl text-xs font-semibold">
                      Success! Your appointment request has been submitted. Our advisor will contact you shortly to confirm.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold shadow-md shadow-primary/20 hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Calendar className="w-4 h-4" />
                    <span>Confirm Appointment Request</span>
                  </button>
                </form>
              ) : (
                /* CALLBACK REQUEST */
                <form onSubmit={handleRequestCallback} className="space-y-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Full Name</label>
                    <input
                      type="text"
                      required
                      placeholder="Enter full name"
                      value={callName}
                      onChange={(e) => setCallName(e.target.value)}
                      className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Mobile Number</label>
                    <input
                      type="tel"
                      required
                      placeholder="Enter mobile number"
                      value={callPhone}
                      onChange={(e) => setCallPhone(e.target.value)}
                      className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] uppercase font-bold text-slate-400">Loan Type of Interest</label>
                    <select
                      value={callPurpose}
                      onChange={(e) => setCallPurpose(e.target.value)}
                      className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent font-semibold text-slate-700 dark:text-slate-355"
                    >
                      <option>Personal Loan</option>
                      <option>Business Loan</option>
                      <option>Home Loan</option>
                      <option>Mortgage Loan</option>
                      <option>Gold Loan</option>
                    </select>
                  </div>

                  {showCallSuccess && (
                    <div className="p-3 bg-success/15 border border-success text-success rounded-xl text-xs font-semibold">
                      Success! Callback request registered. Our advisors will call you back within 15 minutes.
                    </div>
                  )}

                  <button
                    type="submit"
                    className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-sm font-bold shadow-md shadow-primary/20 hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Sparkles className="w-4 h-4" />
                    <span>Request Callback</span>
                  </button>
                </form>
              )}

            </div>
          </div>

        </div>
      </div>
    </section>
  );
}
