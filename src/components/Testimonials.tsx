"use client";

import React, { useState, useEffect, useRef } from 'react';
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface Testimonial {
  id: number;
  name: string;
  loanType: string;
  location: string;
  rating: number;
  text: string;
  photo: string;
}

export default function Testimonials() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [direction, setDirection] = useState(1); // 1 = next, -1 = prev
  const [isPaused, setIsPaused] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const testimonials: Testimonial[] = [
    {
      id: 1,
      name: "Ramesh Kumar",
      loanType: "Home Loan",
      location: "Warangal, Telangana",
      rating: 5,
      text: "The doorstep document collection service was a lifesaver for me. The Get Loans Hub advisors matched my requirements with the best HDFC Bank offer. I got my business capital disbursed in less than 3 days. Extremely professional team!",
      photo: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: 2,
      name: "Sujatha Reddy",
      loanType: "Personal Loan",
      location: "Huzurabad, Telangana",
      rating: 5,
      text: "I was looking for a personal loan with minimal interest rates. DIGI LOANS team helped me verify my credit score rating, optimized my eligibility, and represented my application directly to ICICI bank. Instant sanction, excellent guidance!",
      photo: "https://images.unsplash.com/photo-1494790108377-be9c29b29330?w=150&auto=format&fit=crop&q=80"
    },
    {
      id: 3,
      name: "Mohammad Ali",
      loanType: "Doctor Loan",
      location: "Karimnagar, Telangana",
      rating: 5,
      text: "Outstanding loan advisory platform. They provided a transparent comparative analysis between three top private sector banks, which made it super easy to select. The representative was friendly and took care of everything.",
      photo: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80"
    }
  ];

  // Auto-playing slider interval (5s)
  useEffect(() => {
    if (isPaused) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = setInterval(() => {
      handleNext();
    }, 5000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isPaused]);

  const handleNext = () => {
    setDirection(1);
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const handlePrev = () => {
    setDirection(-1);
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  // Swipe / Drag controls
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -65) {
      handleNext();
    } else if (info.offset.x > 65) {
      handlePrev();
    }
  };

  // Variants for fade and slide animations
  const slideVariants = {
    enter: (dir: number) => ({
      x: dir > 0 ? 100 : -100,
      opacity: 0
    }),
    center: {
      x: 0,
      opacity: 1,
      transition: {
        x: { type: "spring" as const, stiffness: 220, damping: 25 },
        opacity: { duration: 0.3 }
      }
    },
    exit: (dir: number) => ({
      x: dir < 0 ? 100 : -100,
      opacity: 0,
      transition: {
        x: { type: "spring" as const, stiffness: 220, damping: 25 },
        opacity: { duration: 0.3 }
      }
    })
  };

  return (
    <section className="section-py bg-white dark:bg-slate-900 border-t border-slate-100 dark:border-slate-800/60 relative overflow-hidden" id="testimonials">
      {/* Background ambient light */}
      <div className="absolute bottom-[-100px] left-[10%] w-[400px] h-[400px] bg-secondary/5 rounded-full blur-[100px] -z-10" />

      <div className="container-custom text-center">
        
        {/* Title */}
        <div className="max-w-3xl mx-auto mb-16 text-center">
          <span className="text-xs font-bold text-primary dark:text-accent uppercase tracking-widest bg-primary/5 dark:bg-accent/10 px-4 py-2 rounded-full border border-primary/10 dark:border-accent/10">
            TESTIMONIALS
          </span>
          <h2 className="font-display font-extrabold text-3xl sm:text-4xl text-slate-900 dark:text-white mt-4">
            Loved By Thousands of Happy Borrowers
          </h2>
          <p className="font-sans text-xs sm:text-sm text-slate-550 dark:text-slate-400 mt-2">
            Hear from our satisfied clients about their financing journeys with DIGI LOANS.
          </p>
        </div>

        {/* Carousel Slider */}
        <div 
          className="relative max-w-3xl mx-auto px-4 select-none cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
        >
          
          <AnimatePresence mode="wait" custom={direction}>
            <motion.div
              key={currentIndex}
              custom={direction}
              variants={slideVariants}
              initial="enter"
              animate="center"
              exit="exit"
              drag="x"
              dragConstraints={{ left: 0, right: 0 }}
              onDragEnd={handleDragEnd}
              className="p-8 sm:p-12 rounded-[32px] bg-slate-50 dark:bg-slate-900/60 border border-slate-200/50 dark:border-slate-800 shadow-xl text-left relative overflow-hidden flex flex-col sm:flex-row gap-6 sm:gap-8 items-center"
            >
              {/* Big Quote Symbol */}
              <Quote className="absolute top-6 right-8 w-16 h-16 text-slate-100 dark:text-slate-800/30 -z-10 pointer-events-none" />

              {/* Avatar Photo Frame */}
              <div className="relative shrink-0">
                <div className="w-20 h-20 rounded-2xl overflow-hidden border-2 border-primary/20 dark:border-accent/20 shadow-lg select-none">
                  <img 
                    src={testimonials[currentIndex].photo} 
                    alt={testimonials[currentIndex].name}
                    className="w-full h-full object-cover pointer-events-none"
                    loading="lazy"
                  />
                </div>
              </div>

              {/* Review Copy */}
              <div className="flex-1 space-y-4">
                {/* 5-Star Rating */}
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
                  <p className="text-xs font-semibold text-primary dark:text-accent uppercase tracking-wider mt-0.5">
                    {testimonials[currentIndex].loanType} — {testimonials[currentIndex].location}
                  </p>
                </div>
              </div>
            </motion.div>
          </AnimatePresence>

          {/* Navigation Controls */}
          <div className="flex justify-center gap-3 mt-8">
            <button
              onClick={handlePrev}
              className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer outline-none"
              title="Previous testimonial"
            >
              <ChevronLeft className="w-4.5 h-4.5" />
            </button>
            <button
              onClick={handleNext}
              className="p-3 rounded-full border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800 transition-all shadow-sm cursor-pointer outline-none"
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
