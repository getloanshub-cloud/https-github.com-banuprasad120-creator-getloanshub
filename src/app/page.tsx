"use client";

import React, { useState, useEffect } from 'react';
import { Phone, MessageCircle, ArrowUp } from 'lucide-react';

// Import Custom Components
import Navbar from '@/components/Navbar';
import Hero from '@/components/Hero';
import AboutSection from '@/components/AboutSection';
import ServicesSection from '@/components/ServicesSection';
import CalculatorSection from '@/components/CalculatorSection';
import TimelineSection from '@/components/TimelineSection';
import WhyChooseUs from '@/components/WhyChooseUs';
import FAQSection from '@/components/FAQSection';
import BlogsSection from '@/components/BlogsSection';
import ContactSection from '@/components/ContactSection';
import ApplyForm from '@/components/ApplyForm';
import Testimonials from '@/components/Testimonials';
import FocusedInfo from '@/components/FocusedInfo';
import Footer from '@/components/Footer';

export default function Home() {
  const [currentView, setView] = useState('home');

  const handleViewChange = (view: string) => {
    const sectionIds = ['home', 'services', 'calculators', 'faq', 'blogs', 'contact'];
    if (sectionIds.includes(view)) {
      setView('home');
      setTimeout(() => {
        if (view === 'home') {
          window.scrollTo({ top: 0, behavior: 'smooth' });
        } else {
          const element = document.getElementById(view);
          if (element) {
            const navbarOffset = 90;
            const elementPosition = element.getBoundingClientRect().top + window.scrollY;
            const offsetPosition = elementPosition - navbarOffset;
            window.scrollTo({ top: offsetPosition, behavior: 'smooth' });
          }
        }
      }, 100);
    } else {
      setView(view);
      window.scrollTo({ top: 0, behavior: 'smooth' });
    }
  };
  const [selectedLoanType, setSelectedLoanType] = useState('Personal Loan');
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Scroll to top tracker
  useEffect(() => {
    const handleScroll = () => {
      setShowScrollTop(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  // Mock static page render helper
  const renderStaticPage = (title: string, content: string) => (
    <div className="py-16 max-w-4xl mx-auto px-4 sm:px-6 w-full animate-fade-in">
      <h2 className="font-display font-extrabold text-3xl text-slate-900 dark:text-white mb-6">
        {title}
      </h2>
      <div className="font-sans text-slate-650 dark:text-slate-350 leading-relaxed space-y-4 text-sm sm:text-base border-t border-slate-200 dark:border-slate-800 pt-6">
        {content.split('\n\n').map((p, idx) => (
          <p key={idx}>{p}</p>
        ))}
      </div>
    </div>
  );

  return (
    <div className="min-h-screen flex flex-col justify-between bg-grid-pattern">
      {/* Premium Navbar */}
      <Navbar
        currentView={currentView}
        setView={handleViewChange}
        theme={theme}
        setTheme={setTheme}
      />

      {/* Main View Router */}
      <main className="flex-1 relative">
        {/* Ambient background glows for fintech product look */}
        <div className="absolute top-[20%] left-[-150px] w-[500px] h-[500px] bg-primary/5 rounded-full blur-[100px] -z-10 pointer-events-none" />
        <div className="absolute top-[60%] right-[-150px] w-[600px] h-[600px] bg-accent/5 rounded-full blur-[120px] -z-10 pointer-events-none" />

        {currentView === 'home' && (
          <>
            <Hero setView={handleViewChange} setSelectedLoanType={setSelectedLoanType} />

            <AboutSection />
            <ServicesSection setView={handleViewChange} setSelectedLoanType={setSelectedLoanType} />
            <CalculatorSection />
            <TimelineSection />
            <WhyChooseUs />
            <Testimonials />
            <FAQSection />
            <BlogsSection />
            <ContactSection />
          </>
        )}

        {currentView === 'services' && (
          <ServicesSection setView={handleViewChange} setSelectedLoanType={setSelectedLoanType} />
        )}

        {currentView === 'calculators' && (
          <CalculatorSection />
        )}

        {currentView === 'faq' && (
          <FAQSection />
        )}

        {currentView === 'blogs' && (
          <BlogsSection />
        )}

        {currentView === 'contact' && (
          <ContactSection />
        )}

        {currentView === 'apply' && (
          <ApplyForm defaultLoanType={selectedLoanType} />
        )}


        {/* Static Pages Router */}
        {currentView === 'privacy' &&
          renderStaticPage(
            'Privacy Policy',
            'At DIGI LOANS (Starpowerz Digital Technologies Pvt. Ltd.), we prioritize your data privacy. We secure all document files (Aadhaar, PAN, and bank statements) using standard SSL encryption.\n\nWe do not share your private contact information with third-party callers. Data is submitted directly to our matched banking partners for credit verification. Read our legal clauses for more details on user consent.'
          )}

        {currentView === 'terms' &&
          renderStaticPage(
            'Terms of Service',
            'Welcome to DIGI LOANS. By submitting an application, you agree to allow the Get Loans Hub and StarPowerz team to verify credit scores and represent your files before our bank partners.\n\nWe do not guarantee approvals; final sanction decisions are determined exclusively by respective lending institutions and underwriting teams.'
          )}

        {currentView === 'careers' && (
          renderStaticPage(
            'Careers at DIGI LOANS',
            'Want to join the fastest-growing financial advisory startup in Telangana? We are actively seeking experienced Loan Advisors and Relationship Managers.\n\nSend your resume directly to info@getloanshub.com with the subject line "Advisor Application - Huzurabad".'
          )
        )}

        {currentView === 'cookie-policy' && (
          renderStaticPage(
            'Cookie Policy',
            'DIGI LOANS uses cookies to optimize your browsing experience. Cookies help us analyze web traffic, remember your preferences, and track application flows. You can manage or disable cookies in your browser settings at any time.'
          )
        )}

        {currentView === 'disclaimer' && (
          renderStaticPage(
            'Legal Disclaimer',
            'DIGI LOANS (Starpowerz Digital Technologies Pvt. Ltd.) is a loan facilitation marketplace. We represent banking products and interest rates for informational purposes. Final approvals, sanction amounts, interest rates, and processing fees are determined solely by lending partners under RBI guidelines.'
          )
        )}

        {currentView === 'refund-policy' && (
          renderStaticPage(
            'Refund & Cancellation Policy',
            'DIGI LOANS does not charge upfront application fees or processing fees directly to customers. Any processing charges are collected directly by the disbursing bank or NBFC partner. In case of any technical advisory fee disputes, please mail admin@getloanshub.com.'
          )
        )}

        {currentView === 'responsible-lending' && (
          renderStaticPage(
            'Responsible Lending Policy',
            'We strictly align with the RBI Fair Practices Code for digital lenders. We do not support predatory lending, hidden charges, or unauthorized collection tactics. Our lending partners provide clear terms sheets including APR, tenure, and installment breakdowns.'
          )
        )}

        {currentView === 'rbi-disclosure' && (
          renderStaticPage(
            'RBI Disclosure & Compliance',
            'Starpowerz Digital Technologies Pvt. Ltd. operates as a digital sourcing partner and Corporate Business Correspondent for regulated banking entities. We display product disclosures and matched credit policies in strict accordance with RBI digital lending guidelines.'
          )
        )}

        {currentView === 'nbfc-info' && (
          renderStaticPage(
            'NBFC Partner Information',
            'We work with leading RBI-regulated Banks and NBFC partners to disburse loans. Full lists of our co-lending partners, corporate ties, and interest rate corridors are made transparently available during file submissions.'
          )
        )}

        {currentView === 'data-protection' && (
          renderStaticPage(
            'Data Protection Policy',
            'Your document files (Aadhaar, PAN, bank statements) are encrypted using 256-bit SSL tunnels. We store your data on ISO-certified servers and strictly restrict employee access. Data is purged automatically after loan matching completes.'
          )
        )}

        {currentView === 'security-policy' && (
          renderStaticPage(
            'Security & Vulnerability Policy',
            'We protect our digital portals using advanced firewalls, rate limiters, and automated threat detection tools. If you identify any security loophole or vulnerability, please report it immediately to security@getloanshub.com.'
          )
        )}
      </main>

      {/* Floating Action Buttons */}
      <div className="fixed bottom-6 right-6 z-40 flex flex-col gap-3">
        {/* Back to Top */}
        {showScrollTop && (
          <button
            onClick={scrollToTop}
            className="p-3.5 rounded-full bg-slate-900/80 hover:bg-slate-950 text-white shadow-lg backdrop-blur-sm transition-all duration-300 transform hover:scale-105 cursor-pointer"
            title="Scroll to Top"
          >
            <ArrowUp className="w-5 h-5" />
          </button>
        )}

        {/* Quick Phone Call */}
        <a
          href="tel:9000100262"
          className="p-3.5 rounded-full bg-primary text-white shadow-lg hover:shadow-primary/20 transition-all duration-300 transform hover:scale-105"
          title="Call Loan Representative"
        >
          <Phone className="w-5 h-5 animate-pulse" />
        </a>

        {/* Quick WhatsApp */}
        <a
          href="https://wa.me/919000100262"
          target="_blank"
          rel="noreferrer"
          className="p-3.5 rounded-full bg-green-600 text-white shadow-lg hover:shadow-green-600/20 transition-all duration-300 transform hover:scale-105"
          title="Instant WhatsApp Support"
        >
          <MessageCircle className="w-5 h-5" />
        </a>
      </div>

      {/* Focused Info */}
      <FocusedInfo />

      {/* Footer */}
      <Footer setView={handleViewChange} setSelectedLoanType={setSelectedLoanType} />
    </div>
  );
}
