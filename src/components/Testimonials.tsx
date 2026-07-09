"use client";

import React, { useState } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  location: string;
  rating: number;
  text: string;
  avatar: string;
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Ramesh Kumar",
      role: "SME Business Owner",
      location: "Warangal, Telangana",
      rating: 5,
      text: "The doorstep document collection service was a lifesaver for me. The Get Loans Hub advisors matched my requirements with the best HDFC Bank offer. I got my business capital disbursed in less than 3 days. Extremely professional team!",
      avatar: "RK"
    },
    {
      id: 2,
      name: "Sujatha Reddy",
      role: "Software Engineer",
      location: "Huzurabad, Telangana",
      rating: 5,
      text: "I was looking for a personal loan with minimal interest rates. DIGI LOANS team helped me verify my credit score rating, optimized my eligibility, and represented my application directly to ICICI bank. Instant sanction, excellent guidance!",
      avatar: "SR"
    },
    {
      id: 3,
      name: "Mohammad Ali",
      role: "Retail Trader",
      location: "Karimnagar, Telangana",
      rating: 5,
      text: "Outstanding loan advisory platform. They provided a transparent comparative analysis between three top private sector banks, which made it super easy to select. The representative was friendly and took care of everything.",
      avatar: "MA"
    }
  ];

  const handleNext = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 relative overflow-hidden bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/60">
      {/* Background ambient light */}
      <div className="absolute bottom-[-100px] left-[10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10" />

      <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-widest bg-primary/5 dark:bg-accent/10 px-4 py-2 rounded-full border border-primary/10 dark:border-accent/10">
            TESTIMONIALS
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-4">
            Loved By Thousands of Happy Borrowers
          </h2>
          <p className="font-sans text-xs sm:text-sm text-slate-500 dark:text-slate-400 mt-2">
            Hear from our satisfied clients about their financing journeys with DIGI LOANS.
          </p>
        </div>

        {/* Carousel Slider */}
        <div className="relative max-w-3xl mx-auto px-4">
          
          <AnimatePresence mode="wait">
            <motion.div
              key={currentIndex}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.3 }}
              className="p-8 sm:p-12 rounded-[32px] glass premium-border border border-slate-200/50 dark:border-slate-800/80 shadow-xl text-left relative overflow-hidden flex flex-col sm:flex-row gap-6 sm:gap-8 items-start"
            >
              {/* Big Quote Symbol */}
              <Quote className="absolute top-6 right-8 w-16 h-16 text-slate-100 dark:text-slate-800/30 -z-10" />

              {/* Avatar Indicator */}
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-primary to-secondary text-white flex items-center justify-center font-extrabold text-xl shrink-0 shadow-lg shadow-primary/15">
                {testimonials[currentIndex].avatar}
              </div>

              {/* Review Copy */}
              <div className="flex-1 space-y-4">
                {/* Stars */}
                <div className="flex items-center gap-1">
                  {[...Array(testimonials[currentIndex].rating)].map((_, i) => (
                    <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                  ))}
                </div>

                <p className="font-sans text-sm sm:text-base text-slate-655 dark:text-slate-350 leading-relaxed italic">
                  "{testimonials[currentIndex].text}"
                </p>

                <div className="pt-2">
                  <h4 className="font-display font-extrabold text-base text-slate-900 dark:text-white">
                    {testimonials[currentIndex].name}
                  </h4>
                  <p className="text-xs font-semibold text-slate-400 uppercase tracking-wider mt-0.5">
                    {testimonials[currentIndex].role} — {testimonials[currentIndex].location}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              title="Previous testimonial"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
              title="Next testimonial"
            >
              <ChevronRight className="w-4.5 h-4.5" />
            </button>
          </div>

        </div>

      </div>
    </section>
  );
}
