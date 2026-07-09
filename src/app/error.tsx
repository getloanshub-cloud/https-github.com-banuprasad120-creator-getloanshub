"use client";

import React, { useEffect } from 'react';
import { AlertTriangle, RefreshCw } from 'lucide-react';
import { motion } from 'framer-motion';

interface ErrorProps {
  error: Error & { digest?: string };
  reset: () => void;
}

export default function ErrorPage({ error, reset }: ErrorProps) {
  useEffect(() => {
    console.error('Next.js Router encountered runtime crash error:', error);
  }, [error]);

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center px-4 py-16 bg-grid-pattern text-center relative overflow-hidden select-none">
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-danger/5 rounded-full blur-3xl -z-10" />

      <motion.div 
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5 }}
        className="max-w-md p-8 sm:p-10 rounded-3xl glass shadow-2xl border border-slate-200/50 dark:border-slate-800 space-y-6"
      >
        <div className="w-16 h-16 bg-danger/10 rounded-2xl flex items-center justify-center text-danger mx-auto">
          <AlertTriangle className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h1 className="font-display font-extrabold text-2xl text-slate-900 dark:text-white">Something Went Wrong</h1>
          <p className="font-sans text-xs sm:text-sm text-slate-400 leading-relaxed">
            An unexpected error occurred while loading this page. Let's try reloading the route module cache.
          </p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={() => reset()}
            className="flex-1 h-12 bg-primary dark:bg-accent text-white dark:text-slate-950 rounded-xl font-bold text-sm shadow-md flex items-center justify-center gap-2 cursor-pointer transition-opacity hover:opacity-95"
          >
            <RefreshCw className="w-4 h-4" />
            <span>Try Again</span>
          </button>
          
          <button
            onClick={() => window.location.href = '/'}
            className="flex-1 h-12 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-350 rounded-xl font-bold text-sm hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors cursor-pointer"
          >
            <span>Go Home</span>
          </button>
        </div>
      </motion.div>
    </div>
  );
}
