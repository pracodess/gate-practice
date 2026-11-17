import React, { useEffect, useState } from 'react';
import { ChevronRight, X, Sparkles, Check, CheckCircle2 } from 'lucide-react';
import { useApp } from '../context/AppContext';

interface TourStep {
  targetId: string;
  title: string;
  description: string;
  position: 'top' | 'bottom' | 'right' | 'left';
}

const TOUR_STEPS: TourStep[] = [
  {
    targetId: 'tour-daily-goal',
    title: 'Daily Goal & Milestone Track',
    description: 'Track your daily target questions (0/30 Qs) with progress checkpoints and log offline practice with "+1 Solved". Click here or click Next!',
    position: 'bottom'
  },
  {
    targetId: 'tour-digital-books',
    title: 'High-Yield Digital Books',
    description: 'Access verified formula handbooks and chapter-wise cheat sheets for your exam. Click here to see the next section!',
    position: 'bottom'
  },
  {
    targetId: 'tour-pyq-bank',
    title: 'Chapter-Wise PYQ Bank',
    description: 'Filter real past exam questions by year (2021-2024), solve with instant solution reveal and key formulas. Click here!',
    position: 'top'
  },
  {
    targetId: 'tour-tests-nav',
    title: 'Mock Tests & Exam Engine',
    description: 'Give timed tests with official pattern, question palette, and get detailed scorecards. Click here!',
    position: 'right'
  },
  {
    targetId: 'tour-focus-nav',
    title: 'Zen Focus Mode & Popup Blocker',
    description: 'Deep study room with Pomodoro timer, 40Hz focus soundscapes, and automatic popup blocker. Click here!',
    position: 'right'
  }
];

export const InteractiveTour: React.FC = () => {
  const { isTourActive, tourStep, nextTourStep, stopTour, triggerCelebration } = useApp();
  const [tooltipPos, setTooltipPos] = useState<{ top: number; left: number } | null>(null);
  const [isCompleted, setIsCompleted] = useState(false);

  const currentStep = TOUR_STEPS[tourStep];

  useEffect(() => {
    if (!isTourActive) {
      // Remove highlight from any previous element
      document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));
      return;
    }

    if (tourStep >= TOUR_STEPS.length) {
      setIsCompleted(true);
      triggerCelebration();
      return;
    }

    setIsCompleted(false);
    const targetEl = document.getElementById(currentStep.targetId);

    // Clean up previous highlights
    document.querySelectorAll('.tour-highlight').forEach(el => el.classList.remove('tour-highlight'));

    if (targetEl) {
      targetEl.classList.add('tour-highlight');
      targetEl.scrollIntoView({ behavior: 'smooth', block: 'center' });

      const rect = targetEl.getBoundingClientRect();
      const scrollY = window.scrollY;
      const scrollX = window.scrollX;

      let top = rect.bottom + scrollY + 12;
      let left = rect.left + scrollX + Math.min(20, rect.width / 4);

      if (currentStep.position === 'top') {
        top = rect.top + scrollY - 140;
      } else if (currentStep.position === 'right') {
        top = rect.top + scrollY;
        left = rect.right + scrollX + 16;
      }

      setTooltipPos({ top, left: Math.max(10, Math.min(window.innerWidth - 320, left)) });

      // Click handler on the highlighted target element itself advances the tour
      const handleTargetClick = (e: MouseEvent) => {
        e.stopPropagation();
        nextTourStep();
      };

      targetEl.addEventListener('click', handleTargetClick, { once: true });

      return () => {
        targetEl.removeEventListener('click', handleTargetClick);
      };
    }
  }, [isTourActive, tourStep]);

  // Click outside listener: If the user does not click on the highlighted button/section or tooltip, stop the tour
  useEffect(() => {
    if (!isTourActive) return;

    const handleDocumentClick = (e: MouseEvent) => {
      const tooltip = document.getElementById('tour-tooltip-box');
      const targetEl = currentStep ? document.getElementById(currentStep.targetId) : null;

      if (tooltip && tooltip.contains(e.target as Node)) {
        return;
      }
      if (targetEl && targetEl.contains(e.target as Node)) {
        return;
      }

      // User clicked outside the highlighted element / tooltip -> stop popups gracefully
      stopTour();
    };

    window.addEventListener('click', handleDocumentClick);
    return () => window.removeEventListener('click', handleDocumentClick);
  }, [isTourActive, currentStep]);

  if (!isTourActive) return null;

  // Final step completion banner
  if (isCompleted) {
    return (
      <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm flex items-center justify-center p-4 animate-in fade-in">
        <div className="bg-white dark:bg-[#12181d] border border-[#1D8676]/40 rounded-3xl max-w-md w-full p-6 text-center shadow-2xl relative">
          <div className="w-14 h-14 rounded-2xl bg-[#1D8676]/20 border border-[#1D8676]/40 flex items-center justify-center text-[#1D8676] dark:text-[#2dd4bf] mx-auto mb-4">
            <CheckCircle2 className="w-8 h-8" />
          </div>

          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1D8676]/15 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/30">
            TOUR COMPLETED
          </span>
          <h3 className="text-xl font-extrabold text-slate-900 dark:text-white mt-2">
            You're All Set to Study!
          </h3>
          <p className="text-xs text-slate-600 dark:text-slate-300 mt-2 leading-relaxed">
            You now know where every section is located. You can now use GradeUp to practice questions, take mock tests, and achieve your study goals.
          </p>

          <button
            onClick={() => {
              setIsCompleted(false);
              stopTour();
            }}
            className="w-full mt-6 py-2.5 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold transition-all shadow-md shadow-[#1D8676]/30 flex items-center justify-center gap-2"
          >
            <span>Start Using GradeUp</span>
            <Check className="w-4 h-4" />
          </button>
        </div>
      </div>
    );
  }

  if (!tooltipPos || !currentStep) return null;

  return (
    <div
      id="tour-tooltip-box"
      style={{ top: `${tooltipPos.top}px`, left: `${tooltipPos.left}px` }}
      className="absolute z-50 w-72 sm:w-80 p-4 rounded-2xl bg-white dark:bg-[#162026] border border-[#1D8676] shadow-2xl shadow-[#1D8676]/25 animate-in fade-in zoom-in-95 duration-200 select-none"
    >
      {/* Header */}
      <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
        <div className="flex items-center gap-1.5">
          <Sparkles className="w-3.5 h-3.5 text-[#1D8676]" />
          <span className="text-[10px] font-bold uppercase tracking-wider text-[#1D8676] dark:text-[#2dd4bf]">
            Section Guide ({tourStep + 1} of {TOUR_STEPS.length})
          </span>
        </div>
        <button
          onClick={stopTour}
          className="text-slate-400 hover:text-slate-600 dark:hover:text-white p-0.5"
          title="Stop Tour"
        >
          <X className="w-4 h-4" />
        </button>
      </div>

      {/* Content */}
      <h4 className="text-xs font-bold text-slate-900 dark:text-white">
        {currentStep.title}
      </h4>
      <p className="text-[11px] text-slate-600 dark:text-slate-300 mt-1 leading-snug">
        {currentStep.description}
      </p>

      {/* Footer controls */}
      <div className="flex items-center justify-between mt-4 pt-2 border-t border-slate-100 dark:border-slate-800">
        <button
          onClick={stopTour}
          className="text-[11px] text-slate-400 hover:text-slate-600 dark:hover:text-slate-200"
        >
          Skip tour
        </button>

        <button
          onClick={nextTourStep}
          className="px-3 py-1.5 rounded-lg bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-1"
        >
          <span>Next</span>
          <ChevronRight className="w-3 h-3" />
        </button>
      </div>
    </div>
  );
};
