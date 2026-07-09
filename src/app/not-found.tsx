"use client";

import React from 'react';
import { ArrowLeft, HelpCircle } from 'lucide-react';
import { motion } from 'framer-motion';

export default function NotFound() {
  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 bg-grid-pattern text-center relative overflow-hidden select-none">
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-primary/5 rounded-full blur-3xl -z-10" />
      
      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md p-8 sm:p-10 rounded-3xl glass shadow-2xl border border-slate-200/50 dark:border-slate-800 space-y-6"
      >
        <div className="w-16 h-16 bg-primary/10 rounded-2xl flex items-center justify-center text-primary dark:text-accent mx-auto">
          <HelpCircle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-4xl text-slate-900 dark:text-white">404</h1>
          <h2 className="font-display font-bold text-lg text-slate-850 dark:text-slate-200">Page Not Found</h2>
          <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed">
            The page you are looking for does not exist, has been archived, or moved to a different workspace route.
          </p>
        </div>

        <button
          onClick={() => window.location.href = '/'}
          className="w-full h-12 bg-primary dark:bg-accent text-white dark:text-slate-950 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-95"
        >
          <ArrowLeft className="w-4 h-4" />
          <span>Go Back Home</span>
        </button>
      </motion.div>
    </div>
  );
}
