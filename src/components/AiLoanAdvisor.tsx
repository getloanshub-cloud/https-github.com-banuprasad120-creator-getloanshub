"use client";

import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, X, Send, Mic, Volume2, VolumeX, Globe } from 'lucide-react';
import { supabase } from '@/lib/supabase';

interface Message {
  sender: 'bot' | 'user' | 'agent';
  content: string;
  timestamp: Date;
}

export default function AiLoanAdvisor() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      sender: 'bot',
      content: 'Hello! I am your DIGI LOANS AI Advisor. To assist you with customized loan offers, could you please tell me your full name?',
      timestamp: new Date()
    }
  ]);
  const [inputMsg, setInputMsg] = useState('');
  const [loading, setLoading] = useState(false);
  const [language, setLanguage] = useState<'en' | 'te'>('en');
  const [soundOn, setSoundOn] = useState(false);
  const [sessionId, setSessionId] = useState('');
  const [isListening, setIsListening] = useState(false);

  const listEndRef = useRef<HTMLDivElement>(null);

  // Initialize session ID
  useEffect(() => {
    let sid = localStorage.getItem('digi_chat_session');
    if (!sid) {
      sid = 'session_' + Math.random().toString(36).substring(2, 15);
      localStorage.setItem('digi_chat_session', sid);
    }
    setSessionId(sid);
  }, []);

  // Scroll to bottom helper
  useEffect(() => {
    listEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, loading]);

  // Real-time voice speech playback
  const speakText = (text: string) => {
    if (!soundOn || typeof window === 'undefined' || !window.speechSynthesis) return;
    window.speechSynthesis.cancel(); // Stop active voices
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = language === 'te' ? 'te-IN' : 'en-IN';
    window.speechSynthesis.speak(utterance);
  };

  // Real-time speech input (Speech recognition)
  const startListening = () => {
    if (typeof window === 'undefined') return;
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert('Speech recognition is not supported in this browser. Try Chrome/Safari.');
      return;
    }

    const rec = new SpeechRecognition();
    rec.lang = language === 'te' ? 'te-IN' : 'en-US';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onstart = () => {
      setIsListening(true);
    };

    rec.onresult = (e: any) => {
      const transcript = e.results[0][0].transcript;
      setInputMsg(transcript);
    };

    rec.onerror = (e: any) => {
      console.error('Speech recognition error:', e);
      setIsListening(false);
    };

    rec.onend = () => {
      setIsListening(false);
    };

    rec.start();
  };

  const handleSendMessage = async (msgText: string) => {
    if (!msgText.trim()) return;

    // Append user message
    const userMessage: Message = {
      sender: 'user',
      content: msgText,
      timestamp: new Date()
    };
    setMessages(prev => [...prev, userMessage]);
    setInputMsg('');
    setLoading(true);

    try {
      const response = await fetch('/api/chat', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          sessionId,
          message: msgText,
          language
        })
      });

      const data = await response.json();
      if (response.ok && data.reply) {
        const botMessage: Message = {
          sender: 'bot',
          content: data.reply,
          timestamp: new Date()
        };
        setMessages(prev => [...prev, botMessage]);
        speakText(data.reply);
      } else {
        throw new Error(data.error || 'Server error.');
      }
    } catch (err) {
      console.error(err);
      const errorMessage: Message = {
        sender: 'bot',
        content: 'Apologies, I encountered a connection issue. Please check your network or try again.',
        timestamp: new Date()
      };
      setMessages(prev => [...prev, errorMessage]);
    } finally {
      setLoading(false);
    }
  };

  const handleQuickReply = (text: string, teText: string) => {
    const activeText = language === 'te' ? teText : text;
    handleSendMessage(activeText);
  };

  const toggleLanguage = () => {
    const nextLang = language === 'en' ? 'te' : 'en';
    setLanguage(nextLang);
    const welcome = nextLang === 'te'
      ? 'నమస్కారం! నేను మీ డిజి లోన్స్ ఏఐ సహాయకుడిని. మొదట, దయచేసి మీ పూర్తి పేరు చెప్పండి?'
      : 'Hello! I am your DIGI LOANS AI Advisor. To assist you with customized loan offers, could you please tell me your full name?';

    setMessages([
      {
        sender: 'bot',
        content: welcome,
        timestamp: new Date()
      }
    ]);
  };

  return (
    <div className="fixed bottom-6 right-6 z-40 select-none font-sans">
      
      {/* Floating Trigger Bubble */}
      <motion.button
        onClick={() => setIsOpen(!isOpen)}
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        className="w-14 h-14 rounded-full bg-gradient-to-r from-primary to-secondary text-white shadow-xl shadow-primary/20 flex items-center justify-center cursor-pointer relative"
        aria-label="Open AI Loan Advisor"
        id="ai-chatbot-trigger"
      >
        <MessageSquare className="w-6 h-6" />
        <span className="absolute -top-1 -right-1 w-3.5 h-3.5 bg-emerald-500 border-2 border-white rounded-full animate-pulse" />
      </motion.button>

      {/* Slide-up Chat Panel Container */}
      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: 30, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 30, scale: 0.95 }}
            className="fixed inset-0 sm:inset-auto sm:bottom-24 sm:right-6 w-full h-full sm:w-[380px] sm:h-[520px] bg-white dark:bg-slate-900 border-0 sm:border border-slate-200/60 dark:border-slate-800 rounded-none sm:rounded-3xl shadow-2xl overflow-hidden flex flex-col z-50 text-left"
          >
            {/* Header */}
            <div className="p-4 bg-gradient-to-r from-primary to-secondary text-white flex justify-between items-center shrink-0">
              <div className="flex items-center gap-3">
                <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center text-xl">
                  🤖
                </div>
                <div>
                  <span className="font-bold text-sm block leading-tight">AI Loan Advisor</span>
                  <span className="text-[10px] text-emerald-300 font-bold uppercase tracking-wider flex items-center gap-1 mt-0.5">
                    <span className="w-1.5 h-1.5 bg-emerald-400 rounded-full" />
                    <span>Always Active</span>
                  </span>
                </div>
              </div>

              {/* Controls */}
              <div className="flex items-center gap-1.5">
                <button
                  onClick={toggleLanguage}
                  className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                  title="Switch Language"
                >
                  <Globe className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setSoundOn(!soundOn)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                  title={soundOn ? 'Mute voice' : 'Enable voice readback'}
                >
                  {soundOn ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4 text-white/60" />}
                </button>
                <button
                  onClick={() => setIsOpen(false)}
                  className="p-2 rounded-lg hover:bg-white/10 text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Chat Messages Log */}
            <div className="flex-1 p-4 overflow-y-auto space-y-4 bg-slate-50/50 dark:bg-slate-950/20">
              {messages.map((msg, index) => (
                <div
                  key={index}
                  className={`flex ${msg.sender === 'user' ? 'justify-end' : 'justify-start'}`}
                >
                  <div
                    className={`max-w-[82%] px-4 py-3 rounded-2xl text-xs sm:text-sm leading-relaxed ${
                      msg.sender === 'user'
                        ? 'bg-primary text-white rounded-tr-none'
                        : 'bg-white dark:bg-slate-800 text-slate-800 dark:text-slate-200 border border-slate-200/40 dark:border-slate-800/80 rounded-tl-none shadow-sm'
                    }`}
                  >
                    <span>{msg.content}</span>
                  </div>
                </div>
              ))}

              {/* Typing indicator dots */}
              {loading && (
                <div className="flex justify-start">
                  <div className="bg-white dark:bg-slate-800 px-4 py-3 rounded-2xl rounded-tl-none border border-slate-200/40 dark:border-slate-800/80 flex gap-1.5 items-center justify-center">
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-75" />
                    <span className="w-1.5 h-1.5 bg-slate-400 rounded-full animate-bounce delay-150" />
                  </div>
                </div>
              )}

              <div ref={listEndRef} />
            </div>

            {/* Quick replies tray */}
            <div className="px-4 py-2 flex flex-wrap gap-1.5 border-t border-slate-100 dark:border-slate-850 shrink-0">
              <button
                onClick={() => handleQuickReply('Apply for Loan', 'లోన్ కోసం అప్లై చేయి')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-[10px] font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer"
              >
                Apply Online
              </button>
              <button
                onClick={() => handleQuickReply('Calculate EMI', 'ఈఎంఐ లెక్కించు')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-[10px] font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer"
              >
                Calculate EMI
              </button>
              <button
                onClick={() => handleQuickReply('Talk to Advisor', 'అడ్వైజర్‌తో మాట్లాడు')}
                className="px-2.5 py-1.5 rounded-lg border border-slate-200 dark:border-slate-800 hover:bg-slate-50 dark:hover:bg-slate-850 text-[10px] font-bold text-slate-500 hover:text-primary transition-colors cursor-pointer"
              >
                Talk to Advisor
              </button>
            </div>

            {/* Input Bar */}
            <form
              onSubmit={(e) => {
                e.preventDefault();
                handleSendMessage(inputMsg);
              }}
              className="p-3 border-t border-slate-200/50 dark:border-slate-800/80 flex gap-2 items-center bg-white dark:bg-slate-900 shrink-0"
            >
              <button
                type="button"
                onClick={startListening}
                className={`p-2.5 rounded-xl border border-slate-250 dark:border-slate-800 flex items-center justify-center cursor-pointer transition-colors ${
                  isListening 
                    ? 'bg-danger text-white border-danger animate-pulse' 
                    : 'bg-slate-50 dark:bg-slate-950 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-850'
                }`}
                title="Speak message"
              >
                <Mic className="w-4.5 h-4.5" />
              </button>

              <input
                type="text"
                placeholder={isListening ? 'Listening...' : language === 'te' ? 'సందేశాన్ని టైప్ చేయండి...' : 'Type message here...'}
                value={inputMsg}
                onChange={(e) => setInputMsg(e.target.value)}
                disabled={isListening}
                className="flex-1 px-4 h-11 bg-slate-50 dark:bg-slate-950 text-xs sm:text-sm border border-slate-250 dark:border-slate-800 rounded-xl outline-none"
              />

              <button
                type="submit"
                disabled={!inputMsg.trim() || loading}
                className="w-11 h-11 bg-primary hover:opacity-95 text-white rounded-xl flex items-center justify-center shadow cursor-pointer disabled:opacity-40"
              >
                <Send className="w-4 h-4" />
              </button>
            </form>
          </motion.div>
        )}
      </AnimatePresence>

    </div>
  );
}
