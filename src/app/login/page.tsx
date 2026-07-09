"use client";

import React, { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { motion } from 'framer-motion';
import { LogIn, Sparkles, Key, Mail, ArrowLeft } from 'lucide-react';
import { supabase } from '@/lib/supabase';

export default function LoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMsg, setErrorMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [successMsg, setSuccessMsg] = useState('');

  useEffect(() => {
    if (!supabase) return;
    const client = supabase;
    const checkUser = async () => {
      const { data: { session } } = await client.auth.getSession();
      if (session) {
        // Fetch role and redirect
        const { data } = await client
          .from('profiles')
          .select('role')
          .eq('id', session.user.id)
          .single();
        
        if (data && (data.role === 'admin' || data.role === 'employee')) {
          router.push(`/${data.role}`);
        } else if (data) {
          // If not staff, sign them out
          await client.auth.signOut();
        }
      }
    };
    checkUser();
  }, [router]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMsg('');
    setSuccessMsg('');
    setLoading(true);

    if (!supabase) {
      setErrorMsg('Supabase is not configured yet. Check your environment variables.');
      setLoading(false);
      return;
    }
    const client = supabase;

    try {
      // Sign In Flow
      const { data, error } = await client.auth.signInWithPassword({
        email,
        password
      });

      if (error) throw error;

      if (data.user) {
        // Fetch profile role and redirect
        const { data: profile } = await client
          .from('profiles')
          .select('role')
          .eq('id', data.user.id)
          .single();

        if (profile?.role !== 'admin' && profile?.role !== 'employee') {
          setErrorMsg('Access denied. This portal is restricted to internal staff only.');
          await client.auth.signOut();
          setLoading(false);
          return;
        }

        router.push(`/${profile.role}`);
      }
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || 'Authentication failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="min-h-screen bg-gradient-to-b from-[#EBF3FF] to-white dark:from-slate-950 dark:to-slate-900 flex items-center justify-center p-4 relative overflow-hidden">
      {/* Decorative Blur BG */}
      <div className="absolute top-[20%] left-1/2 -translate-x-1/2 w-[350px] h-[350px] sm:w-[500px] sm:h-[500px] bg-primary/10 dark:bg-accent/5 rounded-full blur-[80px] pointer-events-none -z-10" />

      <div className="w-full max-w-md space-y-6">
        
        {/* Logo and Back Home Link */}
        <div className="flex justify-between items-center px-2">
          <a
            href="/"
            className="flex items-center gap-1.5 text-xs font-bold text-slate-500 hover:text-primary dark:hover:text-accent transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to website</span>
          </a>
          <span className="text-[10px] uppercase font-bold tracking-widest text-[#0A4D9D] dark:text-[#F5B301]">
            Secure Gateway
          </span>
        </div>

        {/* Card Frame */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4 }}
          className="p-6 sm:p-8 rounded-[32px] bg-white/80 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-slate-800/80 shadow-2xl space-y-6 text-left animate-fade-in"
        >
          <div className="space-y-1.5">
            <h2 className="font-display font-[900] text-2xl text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-primary dark:text-accent" />
              <span>Sign In</span>
            </h2>
            <p className="text-xs text-slate-400 leading-normal">
              Secure staff portal for Get Loans Hub administrators and advisors.
            </p>
          </div>

          {errorMsg && (
            <div className="p-3.5 bg-danger/10 border border-danger/20 text-danger rounded-2xl text-xs font-bold leading-normal">
              {errorMsg}
            </div>
          )}

          {successMsg && (
            <div className="p-3.5 bg-success/10 border border-success/20 text-success rounded-2xl text-xs font-bold leading-normal">
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Mail className="w-3.5 h-3.5" />
                <span>Email Address</span>
              </label>
              <input
                type="email"
                required
                placeholder="name@stardigiloans.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent text-slate-900 dark:text-white"
              />
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Key className="w-3.5 h-3.5" />
                <span>Secret Password</span>
              </label>
              <input
                type="password"
                required
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 h-12 rounded-xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-1 focus:ring-primary dark:focus:ring-accent text-slate-900 dark:text-white"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full h-12 bg-gradient-to-r from-primary to-secondary text-white rounded-xl font-bold text-sm shadow-md hover:opacity-95 transition-opacity cursor-pointer flex items-center justify-center gap-2 disabled:opacity-40"
            >
              <LogIn className="w-4.5 h-4.5" />
              <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            </button>
          </form>

        </motion.div>
      </div>
    </main>
  );
}
