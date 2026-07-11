"use client";

import React, { useState, useEffect, useRef } from 'react';
import { 
  User, Briefcase, Home, Car, Stethoscope, Landmark,
  GraduationCap, Shield, ArrowRight, ChevronLeft, ChevronRight,
  TrendingUp, Clock, Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

interface ServicesSectionProps {
  setView: (view: string) => void;
  setSelectedLoanType?: (type: string) => void;
}

interface Product {
  name: string;
  image: string;
  icon: React.ComponentType<{ className?: string }>;
  desc: string;
  rate: string;
  time: string;
}

// Cover Flow Individual Card
const CoverFlowCard = ({ 
  product, 
  offset, 
  isActive, 
  isFar,
  handleApply,
  onClick
}: { 
  product: Product; 
  offset: number; 
  isActive: boolean; 
  isFar: boolean;
  handleApply: (name: string) => void;
  onClick: () => void;
}) => {
  const [mousePos, setMousePos] = useState({ x: 0, y: 0 });
  const [radialPos, setRadialPos] = useState({ x: 0, y: 0 });
  const [isHovered, setIsHovered] = useState(false);
  const IconComponent = product.icon;

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!isActive) return;
    const rect = e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - rect.left) / rect.width - 0.5) * 24; // -12px to +12px
    const y = ((e.clientY - rect.top) / rect.height - 0.5) * 24; // -12px to +12px
    setMousePos({ x, y });
    setRadialPos({
      x: e.clientX - rect.left,
      y: e.clientY - rect.top
    });
  };

  const handleMouseLeave = () => {
    setMousePos({ x: 0, y: 0 });
    setRadialPos({ x: 0, y: 0 });
    setIsHovered(false);
  };

  // Determine rotateY based on position
  const rotateY = offset < 0 ? 18 : offset > 0 ? -18 : 0;
  const blurVal = isActive ? 0 : 2;
  const opacity = isActive ? 1 : isFar ? 0.2 : 0.45;
  const scale = isActive ? 1.08 : isFar ? 0.82 : 0.88;
  const zIndex = 10 - Math.abs(offset);

  // Position offset translation logic
  const getXTranslation = () => {
    if (offset === 0) return 0;
    // Desktop separation layout mapping
    return offset * 230;
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onMouseEnter={() => setIsHovered(true)}
      onClick={onClick}
      animate={{
        x: getXTranslation(),
        y: isActive ? -24 : 0,
        scale: scale,
        rotateY: rotateY,
        opacity: opacity,
        filter: `blur(${blurVal}px)`,
        boxShadow: isActive
          ? "0 25px 50px -12px rgba(10, 77, 157, 0.5), 0 0 25px rgba(30, 100, 184, 0.35)"
          : "0 10px 20px -10px rgba(0,0,0,0.5)"
      }}
      transition={{
        type: "spring",
        mass: 1,
        stiffness: 120,
        damping: 20
      }}
      style={{ 
        zIndex: zIndex,
        pointerEvents: "auto"
      }}
      className={`absolute w-[290px] sm:w-[310px] md:w-[325px] h-[480px] rounded-[20px] overflow-hidden bg-slate-900/80 dark:bg-slate-950/80 backdrop-blur-xl border flex flex-col justify-between text-left group transition-colors relative ${
        isActive 
          ? 'border-accent/40 bg-slate-800/90 dark:bg-slate-900/90' 
          : 'border-slate-800/50'
      }`}
    >
      {/* Vercel-style interactive spotlight mask */}
      {isActive && isHovered && (
        <div 
          className="absolute inset-0 opacity-100 transition-opacity duration-300 pointer-events-none z-0" 
          style={{
            background: `radial-gradient(280px circle at ${radialPos.x}px ${radialPos.y}px, rgba(245, 179, 1, 0.08), transparent 70%)`
          }}
        />
      )}

      {/* Active Gradient Border Overlay */}
      {isActive && (
        <div className="absolute inset-0 border border-gradient-to-r from-accent to-primary rounded-[20px] opacity-30 pointer-events-none z-30" />
      )}

      {/* Image Block */}
      <div className="relative w-full h-[170px] overflow-hidden bg-slate-950 select-none">
        <motion.img
          src={product.image}
          alt={product.name}
          loading="lazy"
          animate={{
            scale: isActive && isHovered ? 1.08 : isActive ? 1.05 : 1,
            x: mousePos.x,
            y: mousePos.y
          }}
          transition={{ type: "spring", stiffness: 100, damping: 15 }}
          className="w-full h-full object-cover origin-center"
        />

        {/* Floating Category Icon */}
        <motion.div 
          animate={{ 
            y: isActive ? [-4, 4, -4] : 0,
            scale: isActive && isHovered ? 1.15 : 1,
            rotate: isActive && isHovered ? 15 : 0,
            boxShadow: isActive && isHovered ? "0 0 20px rgba(245, 179, 1, 0.4)" : "none"
          }}
          transition={{ 
            y: { repeat: Infinity, duration: 3, ease: "easeInOut" },
            default: { type: "spring", stiffness: 150, damping: 15 }
          }}
          className="absolute bottom-4 left-4 w-11 h-11 rounded-2xl bg-slate-900 border border-slate-800 shadow-lg flex items-center justify-center text-accent"
        >
          <IconComponent className="w-5 h-5" />
        </motion.div>
      </div>

      {/* Card Metadata Details */}
      <div className="p-5 flex-1 flex flex-col justify-between">
        <div className="space-y-3">
          <h3 className="font-display font-extrabold text-xl text-white group-hover:text-accent transition-colors">
            {product.name}
          </h3>
          
          <p className="font-sans text-xs text-slate-400 leading-relaxed min-h-[48px] line-clamp-3">
            {product.desc}
          </p>

          {/* Glowing Interest and Approval stats */}
          <div className="flex flex-wrap gap-2 pt-1">
            <motion.div 
              animate={{
                boxShadow: isActive && isHovered ? "0 0 12px rgba(245, 179, 1, 0.25)" : "none",
                borderColor: isActive && isHovered ? "rgba(245, 179, 1, 0.3)" : "rgba(255, 255, 255, 0.06)"
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-850 text-[10px] font-bold text-slate-300"
            >
              <TrendingUp className="w-3.5 h-3.5 text-accent animate-pulse" />
              <span>{product.rate}</span>
            </motion.div>
            <motion.div 
              animate={{
                boxShadow: isActive && isHovered ? "0 0 12px rgba(16, 185, 129, 0.25)" : "none",
                borderColor: isActive && isHovered ? "rgba(16, 185, 129, 0.3)" : "rgba(255, 255, 255, 0.06)"
              }}
              className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-950/60 border border-slate-850 text-[10px] font-bold text-slate-300"
            >
              <Clock className="w-3.5 h-3.5 text-emerald-500" />
              <span>{product.time}</span>
            </motion.div>
          </div>
        </div>

        {/* Dynamic CTAs */}
        <div className="grid grid-cols-2 gap-3 mt-4 z-10 relative">
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.stopPropagation();
              handleApply(product.name);
            }}
            className="h-10 rounded-xl bg-gradient-to-r from-primary to-secondary text-white text-[11px] font-extrabold shadow-md hover:shadow-primary/30 cursor-pointer flex items-center justify-center gap-1 relative overflow-hidden"
          >
            <span>Apply Now</span>
            <motion.span
              animate={{ x: isActive && isHovered ? 4 : 0 }}
              transition={{ type: "spring", stiffness: 200 }}
            >
              <ArrowRight className="w-3 h-3" />
            </motion.span>
          </motion.button>
          
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={(e) => {
              e.stopPropagation();
              handleApply(product.name);
            }}
            className="h-10 rounded-xl border border-slate-800 bg-slate-950 hover:bg-slate-900 transition-colors text-slate-300 hover:text-white text-[11px] font-bold cursor-pointer flex items-center justify-center gap-1"
          >
            <span>Learn More</span>
          </motion.button>
        </div>
      </div>
    </motion.div>
  );
};

export default function ServicesSection({ setView, setSelectedLoanType }: ServicesSectionProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [visibleCount, setVisibleCount] = useState(3);
  const [isPaused, setIsPaused] = useState(false);
  const [wheelCooldown, setWheelCooldown] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const PRODUCTS: Product[] = [
    {
      name: 'Personal Loan',
      image: '/images/personal_loan.png',
      icon: User,
      desc: 'Get fast cash without collateral. Ideal for medical emergencies, travel, weddings, or home renovation.',
      rate: '9.9% p.a. onwards',
      time: 'Instant approval in 3 mins'
    },
    {
      name: 'Home Loan',
      image: '/images/home_loan.png',
      icon: Home,
      desc: 'Own your dream house. Competitive interest rates and flexible tenures for purchase or construction.',
      rate: '7.10% p.a. onwards',
      time: 'Sanction in 3 days'
    },
    {
      name: 'Doctor Loan',
      image: '/images/doctors_loan.png',
      icon: Stethoscope,
      desc: 'Customized financing options designed exclusively to help medical practitioners scale clinics and practices.',
      rate: '9.99% p.a. onwards',
      time: 'Instant approval'
    }
  ];

  // Breakpoints listener
  useEffect(() => {
    const handleResize = () => {
      const w = window.innerWidth;
      if (w >= 1024) setVisibleCount(3);
      else if (w >= 768) setVisibleCount(3);
      else setVisibleCount(1);
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Cooldown slider ticks
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
    setCurrentIndex((prev) => (prev + 1) % PRODUCTS.length);
  };

  const handlePrev = () => {
    setCurrentIndex((prev) => (prev - 1 + PRODUCTS.length) % PRODUCTS.length);
  };

  // Mouse wheel scroll change
  const handleWheel = (e: React.WheelEvent) => {
    if (wheelCooldown) return;
    if (Math.abs(e.deltaY) < 30) return;

    if (e.deltaY > 0) {
      handleNext();
    } else {
      handlePrev();
    }
    setWheelCooldown(true);
    setTimeout(() => setWheelCooldown(false), 550);
  };

  const handleApply = (name: string) => {
    if (setSelectedLoanType) {
      setSelectedLoanType(name);
    }
    setView('apply');
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') handleNext();
    if (e.key === 'ArrowLeft') handlePrev();
  };

  // Helper calculating relative cyclic offsets for infinite loops
  const getOffset = (idx: number) => {
    let offset = idx - currentIndex;
    const half = Math.floor(PRODUCTS.length / 2);
    
    if (offset > half) {
      offset -= PRODUCTS.length;
    } else if (offset < -half) {
      offset += PRODUCTS.length;
    }
    return offset;
  };

  // Top progress calculations
  const progressPercent = ((currentIndex + 1) / PRODUCTS.length) * 100;
  const currentCounter = String(currentIndex + 1).padStart(2, '0');
  const totalCounter = String(PRODUCTS.length).padStart(2, '0');

  // Swipe / Drag controls
  const dragXRef = useRef(0);
  const handleDragEnd = (event: any, info: any) => {
    if (info.offset.x < -60) {
      handleNext();
    } else if (info.offset.x > 60) {
      handlePrev();
    }
  };

  return (
    <section 
      className="section-py bg-slate-950 text-white overflow-hidden relative focus:outline-none select-none" 
      id="services"
      onKeyDown={handleKeyDown}
      onWheel={handleWheel}
      tabIndex={0}
      aria-label="Financial Services Cover Flow Showcase"
    >
      {/* Ambient Moving Radial Background Mesh Gradients */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none z-0">
        <motion.div
          animate={{
            x: [0, 50, 0],
            y: [0, -30, 0]
          }}
          transition={{ repeat: Infinity, duration: 12, ease: "easeInOut" }}
          className="absolute top-[15%] left-[-10%] w-[550px] h-[550px] bg-primary/10 rounded-full blur-[140px]"
        />
        <motion.div
          animate={{
            x: [0, -50, 0],
            y: [0, 30, 0]
          }}
          transition={{ repeat: Infinity, duration: 14, ease: "easeInOut" }}
          className="absolute bottom-[15%] right-[-10%] w-[550px] h-[550px] bg-accent/5 rounded-full blur-[140px]"
        />
        
        {/* Active Card Spotlight behind the cover flow */}
        <div className="absolute top-[45%] left-1/2 -translate-x-1/2 -translate-y-1/2 w-[350px] h-[350px] bg-primary/10 rounded-full blur-[100px] opacity-60" />

        {/* Floating background particles */}
        <div className="absolute inset-0 opacity-10">
          {[...Array(10)].map((_, i) => (
            <div
              key={i}
              className="absolute w-1 h-1 bg-white rounded-full"
              style={{
                top: `${(i * 19) % 100}%`,
                left: `${(i * 29) % 100}%`,
                opacity: 0.4,
                boxShadow: "0 0 10px rgba(255,255,255,0.7)"
              }}
            />
          ))}
        </div>
      </div>

      <div className="container-custom relative z-10">
        
        {/* Top Progress Tracker */}
        <div className="w-full mb-10 flex items-center justify-between gap-6">
          <div className="flex-1 h-[3px] bg-slate-900 rounded-full overflow-hidden">
            <motion.div 
              className="h-full bg-accent" 
              animate={{ width: `${progressPercent}%` }}
              transition={{ type: "spring", stiffness: 100, damping: 18 }}
            />
          </div>
          <div className="font-mono text-xs text-slate-400 select-none font-bold">
            <span className="text-accent">{currentCounter}</span> / <span>{totalCounter}</span>
          </div>
        </div>

        {/* Title Grid */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-16 text-left">
          <div className="space-y-4 max-w-2xl">
            <span className="text-xs font-bold text-accent uppercase tracking-widest bg-accent/10 px-4 py-2 rounded-full border border-accent/10 flex items-center gap-1.5 w-fit select-none">
              <Sparkles className="w-3.5 h-3.5" />
              <span>3D COVER FLOW</span>
            </span>
            <h2 className="font-display font-extrabold text-3xl sm:text-4xl lg:text-[42px] leading-tight text-white mt-4">
              Secure your Financial Future Through Our Safe Solutions
            </h2>
            <p className="font-sans text-slate-400 text-sm sm:text-base">
              Use mouse wheel, keyboard arrows, or swipe/drag to explore. Click side cards to shift focus.
            </p>
          </div>

          {/* Navigation controls */}
          <div className="flex items-center gap-3 self-start md:self-end">
            <button
              onClick={handlePrev}
              className="w-12 h-12 rounded-full border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 flex items-center justify-center text-white transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Previous service"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>
            <button
              onClick={handleNext}
              className="w-12 h-12 rounded-full border border-slate-800 bg-slate-900/60 hover:bg-slate-900 hover:border-slate-700 flex items-center justify-center text-white transition-all cursor-pointer outline-none focus-visible:ring-2 focus-visible:ring-accent"
              aria-label="Next service"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* 3D Cover Flow Viewport */}
        <motion.div 
          className="relative h-[530px] w-full flex items-center justify-center [perspective:1200px] overflow-visible cursor-grab active:cursor-grabbing"
          onMouseEnter={() => setIsPaused(true)}
          onMouseLeave={() => setIsPaused(false)}
          onTouchStart={() => setIsPaused(true)}
          onTouchEnd={() => setIsPaused(false)}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          onDragEnd={handleDragEnd}
        >
          <div className="relative w-full h-[500px] flex items-center justify-center overflow-visible pointer-events-none">
            {PRODUCTS.map((product, idx) => {
              const offset = getOffset(idx);
              const absOffset = Math.abs(offset);

              // Responsive visible stack mapping
              let isVisible = false;
              if (visibleCount === 5) {
                isVisible = absOffset <= 2;
              } else if (visibleCount === 3) {
                isVisible = absOffset <= 1;
              } else {
                isVisible = absOffset === 0;
              }

              if (!isVisible) return null;

              const isActive = offset === 0;
              const isFar = absOffset > 1;

              return (
                <CoverFlowCard
                  key={product.name}
                  product={product}
                  offset={offset}
                  isActive={isActive}
                  isFar={isFar}
                  handleApply={handleApply}
                  onClick={() => {
                    setCurrentIndex(idx);
                  }}
                />
              );
            })}
          </div>
        </motion.div>

        {/* Pagination Dots */}
        <div className="flex justify-center items-center gap-2.5 mt-8">
          {PRODUCTS.map((_, index) => (
            <button
              key={index}
              onClick={() => {
                setCurrentIndex(index);
              }}
              className={`h-2.5 rounded-full transition-all duration-300 outline-none focus-visible:ring-2 focus-visible:ring-accent ${
                index === currentIndex 
                  ? 'w-9 bg-accent' 
                  : 'w-2.5 bg-slate-800 hover:bg-slate-700'
              }`}
              aria-label={`Go to slide ${index + 1}`}
            />
          ))}
        </div>

      </div>
    </section>
  );
}
