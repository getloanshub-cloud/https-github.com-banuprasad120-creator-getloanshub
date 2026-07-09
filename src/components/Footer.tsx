"use client";

import React, { useState } from 'react';
import { 
  Shield, Mail, Phone, MapPin, Heart, 
  ArrowRight, MessageCircle, ChevronDown, ChevronUp, Compass, ArrowUp
} from 'lucide-react';
import Logo from './Logo';

interface FooterProps {
  setView: (view: string) => void;
  setSelectedLoanType?: (type: string) => void;
}

export default function Footer({ setView, setSelectedLoanType }: FooterProps) {
  const currentYear = new Date().getFullYear();
  const [expandedSection, setExpandedSection] = useState<string | null>(null);

  const representative = {
    name: 'Loans Advisor',
    title: 'Representative',
    phone: '+91 9000100262',
    email: 'info@getloanshub.com',
    company: 'Starpowerz Digital Technologies Pvt. Ltd.',
    address: 'Paigah Plaza, Basheerbagh, Hyderabad, Telangana - 500063'
  };

  const handleProductClick = (productName: string) => {
    if (setSelectedLoanType) {
      setSelectedLoanType(productName);
    }
    setView('apply');
  };

  const toggleSection = (section: string) => {
    setExpandedSection(prev => prev === section ? null : section);
  };

  return (
    <footer className="relative bg-[#070B19] text-slate-400 border-t border-slate-800/60 pt-20 pb-8 mt-auto overflow-hidden">
      {/* Decorative Blur Backgrounds */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-primary/10 rounded-full blur-[100px] pointer-events-none -z-10" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-accent/5 rounded-full blur-[120px] pointer-events-none -z-10" />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 space-y-16">
        
        {/* ==================================================
            1. PREMIUM PRE-FOOTER CTA
            ================================================== */}
        <div className="relative rounded-[32px] overflow-hidden bg-gradient-to-br from-[#0A2540] via-[#0D3866] to-[#0A1D33] border border-slate-700/40 p-8 sm:p-12 shadow-2xl flex flex-col lg:flex-row items-center justify-between gap-8 z-10">
          <div className="absolute top-0 right-0 w-64 h-64 bg-accent/15 rounded-full blur-3xl -z-10 pointer-events-none" />
          
          <div className="space-y-4 max-w-2xl text-left">
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-3.5 py-1.5 rounded-full">
              Get Started
            </span>
            <h2 className="font-display font-extrabold text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight">
              Ready to Get Your Loan Approved?
            </h2>
            <p className="font-sans text-xs sm:text-sm text-slate-300 leading-relaxed">
              Compare offers from 71+ Banks & NBFCs and receive expert guidance from experienced loan advisors.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3.5 w-full lg:w-auto shrink-0">
            <button
              onClick={() => setView('apply')}
              className="px-6 py-4 rounded-xl bg-[#F5B301] hover:bg-[#E0A200] text-slate-950 font-bold text-xs shadow-md shadow-accent/20 transition-all transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer flex items-center justify-center gap-1.5"
            >
              <span>Apply Now</span>
              <ArrowRight className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setView('contact')}
              className="px-6 py-4 rounded-xl border border-slate-600 hover:border-white text-white font-bold text-xs bg-slate-800/40 hover:bg-slate-800/80 transition-all transform hover:scale-[1.03] active:scale-[0.98] cursor-pointer text-center"
            >
              Talk to Advisor
            </button>
            <a
              href="https://wa.me/919000100262"
              target="_blank"
              rel="noreferrer"
              className="px-6 py-4 rounded-xl bg-[#16A34A] hover:bg-green-700 text-white font-bold text-xs shadow-md shadow-green-600/15 transition-all transform hover:scale-[1.03] active:scale-[0.98] flex items-center justify-center gap-1.5"
            >
              <MessageCircle className="w-4 h-4" />
              <span>WhatsApp</span>
            </a>
          </div>
        </div>

        {/* ==================================================
            2. FOOTER LAYOUT (5 Columns)
            ================================================== */}
        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-12 gap-10 lg:gap-8 pb-8 border-b border-slate-800/60 text-left">
          
          {/* COLUMN 1: Company Brand (Spans 3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-5">
            <div className="flex items-center cursor-pointer" onClick={() => setView('home')}>
              <Logo className="h-10 w-auto" light={true} />
            </div>

            <div className="space-y-2">
              <span className="block text-slate-350 text-xs font-bold uppercase tracking-wider">
                {representative.company}
              </span>
              <p className="font-sans text-[11px] sm:text-xs text-slate-400 leading-relaxed">
                Get Loans Hub is one of India's premier digital sourcing platforms. We match customer requirements with matched banking partners for swift credit processing.
              </p>
            </div>
          </div>

          {/* COLUMN 2: Loan Products (Spans 2 cols on desktop, Collapsible on Mobile) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2 md:border-b-0 md:pb-0 cursor-pointer md:cursor-default" onClick={() => toggleSection('products')}>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                Loan Products
              </h4>
              <span className="md:hidden text-slate-400">
                {expandedSection === 'products' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </div>

            <ul className={`space-y-2 text-xs md:block ${expandedSection === 'products' ? 'block animate-fade-in' : 'hidden'}`}>
              {[
                { label: 'Personal Loans', val: 'Personal Loan' },
                { label: 'Business Loans', val: 'Business Loan' },
                { label: 'Car Loans', val: 'Car Loan' },
                { label: 'Educational Loans', val: 'Educational Loan' },
                { label: 'Insurance', val: 'Insurance' },
                { label: 'Credit Cards', val: 'Credit Cards' }
              ].map((prod) => (
                <li key={prod.label}>
                  <button 
                    onClick={() => handleProductClick(prod.val)}
                    className="hover:text-accent transition-colors cursor-pointer text-[11px] sm:text-xs block w-full text-left"
                  >
                    {prod.label}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 3: Tools & FAQ (Spans 2 cols on desktop, Collapsible on Mobile) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2 md:border-b-0 md:pb-0 cursor-pointer md:cursor-default" onClick={() => toggleSection('tools')}>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                Tools & FAQ
              </h4>
              <span className="md:hidden text-slate-400">
                {expandedSection === 'tools' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </div>

            <ul className={`space-y-2 text-xs md:block ${expandedSection === 'tools' ? 'block animate-fade-in' : 'hidden'}`}>
              {[
                { name: 'EMI Calculator', id: 'calculators' },
                { name: 'Eligibility Checker', id: 'calculators' },
                { name: 'FAQ & Tips', id: 'faq' }
              ].map((tool) => (
                <li key={tool.name}>
                  <button 
                    onClick={() => setView(tool.id)}
                    className="hover:text-accent transition-colors cursor-pointer text-[11px] sm:text-xs block w-full text-left"
                  >
                    {tool.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 4: Legal & Info (Spans 2 cols on desktop, Collapsible on Mobile) */}
          <div className="lg:col-span-2 space-y-4">
            <div className="flex items-center justify-between border-b border-slate-850 pb-2 md:border-b-0 md:pb-0 cursor-pointer md:cursor-default" onClick={() => toggleSection('legal')}>
              <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
                Legal & Info
              </h4>
              <span className="md:hidden text-slate-400">
                {expandedSection === 'legal' ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </span>
            </div>

            <ul className={`space-y-2 text-xs md:block ${expandedSection === 'legal' ? 'block animate-fade-in' : 'hidden'}`}>
              {[
                { name: 'Privacy Policy', id: 'privacy' },
                { name: 'Terms of Use', id: 'terms' },
                { name: 'Careers', id: 'careers' }
              ].map((legal) => (
                <li key={legal.name}>
                  <button 
                    onClick={() => setView(legal.id)}
                    className="hover:text-accent transition-colors cursor-pointer text-[11px] sm:text-xs block w-full text-left"
                  >
                    {legal.name}
                  </button>
                </li>
              ))}
            </ul>
          </div>

          {/* COLUMN 5: Contact Center & Lazy Embedded Map (Spans 3 cols on desktop) */}
          <div className="lg:col-span-3 space-y-4">
            <h4 className="font-display font-bold text-xs uppercase tracking-wider text-white">
              Contact Center
            </h4>
            
            <address className="not-italic space-y-3 text-[11px] sm:text-xs">
              <div className="flex items-start gap-2.5">
                <MapPin className="w-4 h-4 text-accent shrink-0 mt-0.5" />
                <div>
                  <span className="block font-semibold text-slate-200">Head Office</span>
                  <a
                    href="https://www.google.com/maps/search/?api=1&query=Paigah+Plaza,+Basheerbagh,+Hyderabad,+Telangana+-+500063"
                    target="_blank"
                    rel="noreferrer"
                    className="hover:text-accent hover:underline leading-relaxed block"
                  >
                    {representative.address}
                  </a>
                </div>
              </div>

              <div className="flex items-center gap-2.5">
                <Phone className="w-4 h-4 text-accent shrink-0" />
                <a
                  href={`tel:${representative.phone.replace(/[^0-9]/g, '')}`}
                  className="hover:text-accent hover:underline"
                >
                  {representative.phone}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <Mail className="w-4 h-4 text-accent shrink-0" />
                <a
                  href={`mailto:${representative.email}`}
                  className="hover:text-accent hover:underline"
                >
                  {representative.email}
                </a>
              </div>

              <div className="flex items-center gap-2.5">
                <MessageCircle className="w-4 h-4 text-accent shrink-0" />
                <a
                  href="https://wa.me/919000100262"
                  target="_blank"
                  rel="noreferrer"
                  className="hover:text-accent hover:underline"
                >
                  Instant WhatsApp
                </a>
              </div>
            </address>
            <button
              onClick={() => setView('customer-portal')}
              className="w-full py-2.5 rounded-lg bg-primary/20 hover:bg-primary/40 text-[11px] text-center font-bold text-accent transition-all border border-accent/20 cursor-pointer"
            >
              Support Ticket
            </button>
          </div>

        </div>

        {/* ==================================================
            11. COPYRIGHT BAR
            ================================================== */}
        <div className="pt-8 flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-semibold text-slate-500 border-t border-slate-800/60">
          <div className="text-left">
            <p>© {currentYear} Get Loans Hub. All Rights Reserved.</p>
          </div>
          
          <div className="flex items-center gap-1.5 justify-center">
            <span>Designed & Developed by</span>
            <a 
              href="https://starpowerz.com" 
              target="_blank" 
              rel="noreferrer" 
              className="text-[#F5B301] hover:underline"
            >
              Starpowerz Digital Technologies Pvt. Ltd.
            </a>
          </div>

          <div className="text-right flex items-center gap-4">
            <button
              onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
              className="hover:text-accent transition-colors flex items-center gap-1 cursor-pointer text-slate-400 font-bold hover:underline"
              title="Scroll to top of page"
              aria-label="Scroll to top of page"
            >
              <span>Back to Top</span>
              <ArrowUp className="w-3.5 h-3.5" />
            </button>
            <div className="flex items-center gap-1">
              <span>Made with</span>
              <Heart className="w-3.5 h-3.5 text-rose-500 fill-current" />
              <span>in India</span>
            </div>
            <span className="px-2 py-0.5 rounded bg-slate-900 border border-slate-805 text-[10px] font-mono">v2.5.0-premium</span>
          </div>
        </div>

      </div>
    </footer>
  );
}
