"use client";

import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, ChevronUp, HelpCircle } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { DigiDb, FAQ } from '@/lib/db';

export default function FAQSection() {
  const [faqs, setFaqs] = useState<FAQ[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    setFaqs(DigiDb.getFAQs());
  }, []);

  const categories = ['All', 'General', 'Eligibility', 'Interest Rates', 'Processing Time', 'Documents', 'CIBIL'];

  const filteredFaqs = faqs.filter(faq => {
    const matchesSearch = faq.question.toLowerCase().includes(searchQuery.toLowerCase()) || 
                          faq.answer.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = activeCategory === 'All' || faq.category.toLowerCase() === activeCategory.toLowerCase();
    return matchesSearch && matchesCategory;
  });

  const toggleExpand = (id: string) => {
    setExpandedId(expandedId === id ? null : id);
  };

  return (
    <section className="py-16 md:py-20 lg:py-32" id="faq">
      <div className="container-custom max-w-4xl">
        
        {/* Title */}
        <div className="text-center mb-12">
          <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-wider bg-primary/5 dark:bg-accent/10 px-3.5 py-1.5 rounded-full">
            Knowledge Base
          </span>
          <h2 className="font-display font-extrabold fluid-heading text-slate-900 dark:text-white mt-2">
            Frequently Asked Questions
          </h2>
          <p className="font-sans text-xs text-slate-500 dark:text-slate-400 mt-2">
            Explore our comprehensive FAQ library covering credit scores, documents, and banking processes.
          </p>
        </div>

        {/* Search Bar */}
        <div className="relative mb-8 max-w-lg mx-auto">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <Search className="w-4.5 h-4.5 text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Type your query (e.g. CIBIL, interest rates...)"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="block w-full pl-10 pr-4 py-3 rounded-2xl border border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 text-sm outline-none focus:ring-2 focus:ring-primary dark:focus:ring-accent"
          />
        </div>

        {/* Category Badges */}
        <div className="flex flex-wrap justify-center gap-1.5 mb-8">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => { setActiveCategory(cat); setExpandedId(null); }}
              className={`px-3.5 py-1.5 rounded-lg text-xs font-semibold transition-all cursor-pointer ${
                activeCategory === cat
                  ? 'bg-primary dark:bg-accent text-white dark:text-slate-950 font-bold'
                  : 'bg-slate-100 dark:bg-slate-850 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-350'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* FAQs List */}
        <div className="space-y-3">
          {filteredFaqs.length > 0 ? (
            filteredFaqs.map((faq) => {
              const isExpanded = expandedId === faq.id;
              return (
                <div
                  key={faq.id}
                  className="rounded-2xl border border-slate-200/50 dark:border-slate-800/80 bg-white/40 dark:bg-slate-900/30 overflow-hidden transition-all duration-300"
                >
                  <button
                    onClick={() => toggleExpand(faq.id)}
                    className="w-full text-left px-6 py-4 flex items-center justify-between gap-4 cursor-pointer hover:bg-slate-50 dark:hover:bg-slate-800/20"
                  >
                    <div className="flex items-center gap-3">
                      <HelpCircle className="w-4.5 h-4.5 text-primary dark:text-accent shrink-0" />
                      <span className="font-display font-bold text-sm sm:text-base text-slate-800 dark:text-white leading-snug">
                        {faq.question}
                      </span>
                    </div>
                    <motion.div
                      animate={{ rotate: isExpanded ? 180 : 0 }}
                      transition={{ duration: 0.2 }}
                      className="shrink-0 text-slate-400"
                    >
                      <ChevronDown className="w-4 h-4" />
                    </motion.div>
                  </button>

                  <AnimatePresence initial={false}>
                    {isExpanded && (
                      <motion.div
                        key="content"
                        initial="collapsed"
                        animate="open"
                        exit="collapsed"
                        variants={{
                          open: { opacity: 1, height: "auto" },
                          collapsed: { opacity: 0, height: 0 }
                        }}
                        transition={{ duration: 0.25, ease: [0.04, 0.62, 0.23, 0.98] }}
                        className="overflow-hidden"
                      >
                        <div className="px-6 pb-5 pt-1 border-t border-slate-200/40 dark:border-slate-800/40">
                          <p className="font-sans text-xs sm:text-sm text-slate-600 dark:text-slate-350 leading-relaxed">
                            {faq.answer}
                          </p>
                          <span className="inline-block mt-3 px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-[10px] font-bold text-slate-400 uppercase">
                            {faq.category}
                          </span>
                        </div>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              );
            })
          ) : (
            <div className="text-center py-10 text-slate-400">
              No matching FAQs found. Please check spelling or query.
            </div>
          )}
        </div>

      </div>
    </section>
  );
}
