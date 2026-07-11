"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Sparkles, Menu, Sun, Moon, LogIn, LogOut, ChevronRight, LayoutDashboard } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { supabase } from '@/lib/supabase';
import Logo from './Logo';

interface NavbarProps {
  currentView: string;
  setView: (view: string) => void;
  theme: 'light' | 'dark';
  setTheme: (theme: 'light' | 'dark') => void;
}

const MenuButton = ({ isOpen, onClick }: { isOpen: boolean; onClick: () => void }) => {
  return (
    <button
      onClick={onClick}
      className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex flex-col items-center justify-center gap-1.5 cursor-pointer focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-accent outline-none relative overflow-hidden bg-white/40 dark:bg-slate-900/40 backdrop-blur-md"
      title={isOpen ? "Close menu" : "Open menu"}
      aria-label={isOpen ? "Close menu" : "Open menu"}
    >
      <motion.span
        animate={isOpen ? { rotate: 45, y: 5.5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-5 h-0.5 bg-current rounded-full"
      />
      <motion.span
        animate={isOpen ? { opacity: 0, x: -10 } : { opacity: 1, x: 0 }}
        transition={{ duration: 0.2 }}
        className="w-5 h-0.5 bg-current rounded-full"
      />
      <motion.span
        animate={isOpen ? { rotate: -45, y: -5.5 } : { rotate: 0, y: 0 }}
        transition={{ duration: 0.2 }}
        className="w-5 h-0.5 bg-current rounded-full"
      />
    </button>
  );
};

export default function Navbar({
  currentView,
  setView,
  theme,
  setTheme,
}: NavbarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const drawerRef = useRef<HTMLDivElement>(null);
  
  // Auth state
  const [user, setUser] = useState<any>(null);
  const [profileRole, setProfileRole] = useState<string | null>(null);

  useEffect(() => {
    if (!isOpen || !drawerRef.current) return;
    const focusableElements = drawerRef.current.querySelectorAll(
      'button, [href], input, select, textarea, [tabindex]:not([tabindex="-1"])'
    );
    if (focusableElements.length === 0) return;
    const firstElement = focusableElements[0] as HTMLElement;
    const lastElement = focusableElements[focusableElements.length - 1] as HTMLElement;

    const handleFocusTrap = (e: KeyboardEvent) => {
      if (e.key !== 'Tab') return;
      if (e.shiftKey) {
        if (document.activeElement === firstElement) {
          lastElement.focus();
          e.preventDefault();
        }
      } else {
        if (document.activeElement === lastElement) {
          firstElement.focus();
          e.preventDefault();
        }
      }
    };

    window.addEventListener('keydown', handleFocusTrap);
    return () => window.removeEventListener('keydown', handleFocusTrap);
  }, [isOpen]);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    
    const getSession = async () => {
      const { data: { session } } = await client.auth.getSession();
      if (session) {
        setUser(session.user);
        const { data } = await client
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (data) setProfileRole(data.role);
      }
    };
    getSession();

    const { data: { subscription } } = client.auth.onAuthStateChange(async (event, session) => {
      if (session) {
        setUser(session.user);
        const { data } = await client
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        if (data) setProfileRole(data.role);
      } else {
        setUser(null);
        setProfileRole(null);
      }
    });

    return () => subscription.unsubscribe();
  }, []);

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if (isOpen) {
        document.body.style.overflow = 'hidden';
      } else {
        document.body.style.overflow = '';
      }
    }
    
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      window.addEventListener('keydown', handleKeyDown);
    }

    return () => {
      if (typeof window !== 'undefined') {
        document.body.style.overflow = '';
      }
      window.removeEventListener('keydown', handleKeyDown);
    };
  }, [isOpen]);

  const toggleTheme = () => {
    const nextTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(nextTheme);
    const root = window.document.documentElement;
    if (nextTheme === 'dark') {
      root.classList.add('dark-theme');
    } else {
      root.classList.remove('dark-theme');
    }
  };

  const handleSignOut = async () => {
    localStorage.removeItem('digi-mock-session');
    if (supabase) {
      await supabase.auth.signOut();
    }
    window.location.href = '/';
  };

  const getDashboardUrl = () => {
    if (profileRole === 'admin') return '/admin';
    if (profileRole === 'employee') return '/employee';
    return '/customer';
  };

  const menuItems = [
    { label: 'Home', id: 'home' },
    { label: 'Services', id: 'services' },
    { label: 'Calculators', id: 'calculators' },
    { label: 'Blogs', id: 'blogs' },
    { label: 'Contact', id: 'contact' },
  ];

  return (
    <motion.nav 
      initial={{ y: -20, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.5, ease: 'easeOut' }}
      className={`sticky top-0 z-50 w-full transition-all duration-300 ${
        isScrolled || isOpen
          ? 'h-[60px] md:h-[72px] shadow-lg border-b border-slate-200/20 dark:border-slate-800/40 bg-white/80 dark:bg-slate-950/80 backdrop-blur-md' 
          : 'h-[68px] md:h-[84px] bg-transparent border-b border-transparent'
      }`} 
      aria-label="Main Navigation"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-8 lg:px-12 h-full">
        <div className="flex items-center justify-between h-full">
          {/* Logo */}
          <motion.div 
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            className="flex items-center cursor-pointer select-none" 
            onClick={() => setView('home')}
            tabIndex={0}
            aria-label="Get Loans Hub Home"
            onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') setView('home'); }}
          >
            <Logo className="h-10 sm:h-12 w-auto" light={theme === 'dark'} />
          </motion.div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center gap-8" role="menubar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                role="menuitem"
                aria-label={`Navigate to ${item.label}`}
                onClick={() => { setView(item.id); setIsOpen(false); }}
                className={`relative font-sans font-medium text-sm transition-colors duration-200 cursor-pointer px-1 py-2 rounded-lg focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-accent outline-none ${
                  currentView === item.id
                    ? 'text-primary dark:text-accent font-semibold'
                    : 'text-slate-600 dark:text-slate-300 hover:text-primary dark:hover:text-accent'
                }`}
              >
                {item.label}
                {currentView === item.id && (
                  <motion.div 
                    layoutId="activeNavIndicator"
                    className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary dark:bg-accent rounded-full"
                    transition={{ type: 'spring', stiffness: 380, damping: 30 }}
                  />
                )}
              </button>
            ))}
          </div>

          {/* Utilities & Authentication Toggles (Desktop) */}
          <div className="hidden md:flex items-center gap-4">
            {/* Theme Toggle */}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={toggleTheme}
              className="p-2.5 rounded-xl border border-slate-200/60 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-slate-600 dark:text-slate-300 cursor-pointer h-11 w-11 flex items-center justify-center focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-accent outline-none"
              title="Toggle Dark/Light Mode"
              aria-label="Toggle Dark/Light Theme Mode"
            >
              {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
            </motion.button>

            {/* Auth Controls */}
            {user && (profileRole === 'admin' || profileRole === 'employee') ? (
              <>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href={getDashboardUrl()}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-primary/20 bg-primary/5 hover:bg-primary/10 dark:border-accent/20 dark:bg-accent/5 dark:hover:bg-accent/10 text-primary dark:text-accent font-semibold text-xs transition-colors cursor-pointer h-11"
                >
                  <LayoutDashboard className="w-3.5 h-3.5" />
                  <span>My Dashboard</span>
                </motion.a>

                <motion.button
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  onClick={handleSignOut}
                  className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer h-11"
                >
                  <LogOut className="w-3.5 h-3.5" />
                  <span>Sign Out</span>
                </motion.button>
              </>
            ) : user ? (
              <motion.button
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                onClick={handleSignOut}
                className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 font-semibold text-xs transition-colors cursor-pointer h-11"
              >
                <LogOut className="w-3.5 h-3.5" />
                <span>Sign Out</span>
              </motion.button>
            ) : (
              <>
                <motion.a
                  whileHover={{ scale: 1.02 }}
                  whileTap={{ scale: 0.98 }}
                  href="/login"
                  className="flex items-center gap-2 px-4.5 py-2.5 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 hover:bg-slate-50 dark:hover:bg-slate-855 text-slate-700 dark:text-slate-200 font-bold text-xs transition-colors cursor-pointer h-11"
                >
                  <LogIn className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </motion.a>

                <motion.button
                  whileHover={{ scale: 1.03 }}
                  whileTap={{ scale: 0.97 }}
                  onClick={() => setView('apply')}
                  className="relative overflow-hidden px-6 py-2.5 rounded-xl bg-gradient-to-r from-primary to-secondary hover:opacity-95 font-semibold text-sm text-white shadow-md shadow-primary/20 hover:shadow-primary/30 transition-all transform cursor-pointer h-11 flex items-center justify-center"
                >
                  <div className="flex items-center gap-1.5">
                    <Sparkles className="w-4 h-4" />
                    <span>Apply Now</span>
                  </div>
                </motion.button>
              </>
            )}
          </div>

          {/* Mobile menu controls (Touch Safe: min 48px) */}
          <div className="flex items-center gap-2 md:hidden">
            <button
              onClick={toggleTheme}
              className="w-12 h-12 rounded-xl border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-300 flex items-center justify-center cursor-pointer focus-visible:ring-2 focus-visible:ring-primary dark:focus-visible:ring-accent outline-none"
              title="Toggle theme"
              aria-label="Toggle Theme Mode"
            >
              {theme === 'light' ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
            </button>

            <MenuButton isOpen={isOpen} onClick={() => setIsOpen(!isOpen)} />
          </div>
        </div>
      </div>

      {/* Mobile Drawer (Glassmorphism & Staggered Animations) */}
      <AnimatePresence>
        {isOpen && (
          <>
            {/* Backdrop overlay */}
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.45 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.3 }}
              onClick={() => setIsOpen(false)}
              className="fixed inset-x-0 bottom-0 z-[55] bg-slate-950/45 backdrop-blur-sm md:hidden top-[60px]"
            />

            {/* Drawer */}
            <motion.div
              ref={drawerRef}
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'tween', ease: 'easeInOut', duration: 0.3 }}
              className="fixed top-[60px] left-0 bottom-0 w-[85vw] max-w-[320px] rounded-r-[24px] bg-white/95 dark:bg-slate-900/95 backdrop-blur-xl shadow-2xl z-[60] pt-[calc(80px+env(safe-area-inset-top))] pb-[calc(24px+env(safe-area-inset-bottom))] pl-[calc(24px+env(safe-area-inset-left))] pr-[calc(24px+env(safe-area-inset-right))] flex flex-col justify-between border-r border-slate-200/40 dark:border-slate-800 md:hidden overflow-y-auto"
              role="dialog"
              aria-modal="true"
              aria-label="Mobile navigation sidebar menu"
            >
              {/* Navigation Items */}
              <div className="flex-1 py-8 space-y-2">
                {menuItems.map((item, index) => (
                  <motion.button
                    key={item.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    onClick={() => { setView(item.id); setIsOpen(false); }}
                    className={`w-full text-left px-4 rounded-xl text-sm font-semibold transition-colors flex items-center justify-between cursor-pointer h-12 ${
                      currentView === item.id
                        ? 'bg-primary/10 text-primary dark:bg-accent/10 dark:text-accent font-bold'
                        : 'text-slate-600 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850'
                    }`}
                  >
                    <span>{item.label}</span>
                    <ChevronRight className="w-4 h-4 text-slate-400" />
                  </motion.button>
                ))}
              </div>

              {/* Drawer Actions */}
              <div className="space-y-4 pt-6 border-t border-slate-200 dark:border-slate-850">
                {user && (profileRole === 'admin' || profileRole === 'employee') ? (
                  <div className="grid grid-cols-2 gap-2">
                    <a
                      href={getDashboardUrl()}
                      className="h-12 px-3 text-center border border-slate-200 dark:border-slate-805 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <LayoutDashboard className="w-4 h-4" />
                      <span>Dashboard</span>
                    </a>
                    <button
                      onClick={handleSignOut}
                      className="h-12 px-3 text-center border border-slate-200 dark:border-slate-805 rounded-xl text-xs font-bold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer flex items-center justify-center gap-1"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : user ? (
                  <div className="space-y-2">
                    <button
                      onClick={handleSignOut}
                      className="w-full h-12 border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-250 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Sign Out</span>
                    </button>
                  </div>
                ) : (
                  <div className="space-y-2">
                    <a
                      href="/login"
                      className="w-full h-12 border border-slate-250 dark:border-slate-800 text-slate-700 dark:text-slate-250 rounded-xl text-sm font-bold flex items-center justify-center gap-1.5 cursor-pointer"
                    >
                      <LogIn className="w-4.5 h-4.5" />
                      <span>Sign In</span>
                    </a>
                    <button
                      onClick={() => { setView('apply'); setIsOpen(false); }}
                      className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-sm shadow-md hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-1.5"
                    >
                      <Sparkles className="w-4 h-4" />
                      <span>Apply Online</span>
                    </button>
                  </div>
                )}
              </div>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}
