"use client";

import React from 'react';
import { ShieldAlert, ArrowLeft, LogIn } from 'lucide-react';
import { motion } from 'framer-motion';

export default function UnauthorizedPage() {
  return (
    <main className="min-h-screen bg-gradient-to-b from-[#FFF2F2] to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden text-center">
      {/* Glow */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] bg-danger/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.4 }}
          className="p-8 rounded-[32px] bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/80 shadow-2xl space-y-6 flex flex-col items-center"
        >
          {/* Alert icon */}
          <div className="w-16 h-16 rounded-full bg-danger/10 border border-danger/25 text-danger flex items-center justify-center">
            <ShieldAlert className="w-8 h-8 font-bold" />
          </div>

          <div className="space-y-2">
            <h2 className="font-display font-[900] text-2xl text-slate-900 dark:text-white">
              Access Restricted (403)
            </h2>
            <p className="text-xs sm:text-sm text-slate-450 leading-relaxed max-w-xs mx-auto">
              Your profile credentials do not have permission clearances to access this protected area database.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 w-full pt-4">
            <a
              href="/"
              className="flex-1 h-12 border border-slate-200 dark:border-slate-800 text-slate-700 dark:text-slate-200 rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:bg-slate-50 dark:hover:bg-slate-850 cursor-pointer"
            >
              <ArrowLeft className="w-4 h-4" />
              <span>Back Home</span>
            </a>
            <a
              href="/login"
              className="flex-1 h-12 bg-danger text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 hover:opacity-95 shadow-md shadow-danger/10 cursor-pointer"
            >
              <LogIn className="w-4 h-4" />
              <span>Sign In Again</span>
            </a>
          </div>
        </motion.div>
      </div>
    </main>
  );
}
