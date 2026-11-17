import React, { useState, useEffect } from 'react';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const HeroCarousel: React.FC = () => {
  const { currentExamData, setActiveTab, setIsFocusModeActive } = useApp();
  const [currentSlide, setCurrentSlide] = useState(0);

  const slides = [
    {
      id: 1,
      badge: 'TOP RECOMMENDATION',
      title: `Top 500 Must-Solve PYQs for ${currentExamData.name}`,
      description: 'Hand-picked previous year questions with step-by-step solutions, key traps, and formula insights.',
      actionText: 'Start Solving PYQs',
      actionTab: 'short-notes',
      extraPill: '100% Free'
    },
    {
      id: 2,
      badge: 'NEW SIMULATOR',
      title: `${currentExamData.name} Full Mock Test Series 2025/2026`,
      description: 'Real exam pattern with countdown timer, negative marking, instant scorecard, and percentile analysis.',
      actionText: 'Take Free Mock Test',
      actionTab: 'tests',
      extraPill: 'Official Pattern'
    },
    {
      id: 3,
      badge: 'FOCUS ROOM',
      title: 'Distraction-Free Deep Study with 40Hz Audio',
      description: 'Pomodoro timer with popup blocker. Silence external distractions and achieve flow state study sessions.',
      actionText: 'Launch Focus Room',
      actionTab: 'focus',
      extraPill: 'Zen Mode'
    }
  ];

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  useEffect(() => {
    const timer = setInterval(nextSlide, 7000);
    return () => clearInterval(timer);
  }, [slides.length]);

  const slide = slides[currentSlide];

  return (
    <div className="relative group my-5">
      {/* Slide Container */}
      <div 
        className="relative overflow-hidden rounded-2xl border border-slate-200 dark:border-[#1D8676]/30 bg-gradient-to-r from-teal-50/60 via-slate-50 to-white dark:from-[#122e28] dark:via-[#0d1f1c] dark:to-[#0a1614] p-6 sm:p-8 min-h-[190px] flex flex-col justify-between shadow-sm transition-all duration-300"
      >
        {/* Soft gaussian fade */}
        <div className="absolute right-0 top-0 w-64 h-64 bg-[#1D8676]/5 dark:bg-[#1D8676]/15 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10">
          <div className="flex items-center gap-2 mb-2">
            <span className="text-[11px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1D8676]/10 dark:bg-[#1D8676]/30 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/40">
              {slide.badge}
            </span>
            <span className="text-[11px] font-semibold text-slate-500 dark:text-slate-400">
              {slide.extraPill}
            </span>
          </div>

          <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white max-w-xl leading-snug">
            {slide.title}
          </h2>
          <p className="text-xs sm:text-sm text-slate-600 dark:text-slate-300 max-w-lg mt-1.5 leading-relaxed line-clamp-2">
            {slide.description}
          </p>
        </div>

        {/* Action button */}
        <div className="mt-4 flex items-center gap-3 relative z-10">
          <button
            onClick={() => {
              if (slide.actionTab === 'focus') {
                setIsFocusModeActive(true);
              } else {
                setActiveTab(slide.actionTab as any);
              }
            }}
            className="px-4 py-2 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold flex items-center gap-2 transition-all shadow-sm hover:translate-x-0.5"
          >
            <span>{slide.actionText}</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </button>
        </div>

        {/* Navigation Arrows */}
        <button
          onClick={prevSlide}
          className="absolute left-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 transition-all opacity-0 group-hover:opacity-100 z-20"
          title="Previous slide"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
        <button
          onClick={nextSlide}
          className="absolute right-2.5 top-1/2 -translate-y-1/2 p-2 rounded-full bg-white/80 dark:bg-slate-900/60 hover:bg-white dark:hover:bg-slate-900 text-slate-600 dark:text-white/70 hover:text-slate-900 dark:hover:text-white border border-slate-200 dark:border-slate-700/60 transition-all opacity-0 group-hover:opacity-100 z-20"
          title="Next slide"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>

      {/* Pagination Dots */}
      <div className="flex justify-center items-center gap-1.5 mt-2.5">
        {slides.map((_, idx) => (
          <button
            key={idx}
            onClick={() => setCurrentSlide(idx)}
            className={`h-1.5 rounded-full transition-all ${
              currentSlide === idx 
                ? 'w-6 bg-[#1D8676]' 
                : 'w-2 bg-slate-300 dark:bg-slate-700 hover:bg-slate-400'
            }`}
          />
        ))}
      </div>
    </div>
  );
};
