import React, { useState } from 'react';
import { 
  ChevronRight, 
  Flag, 
  Plus, 
  CheckCircle2, 
  Target
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const DailyGoalBar: React.FC = () => {
  const { dailyGoal, markQuestionAnswered } = useApp();

  const percentage = Math.min(100, Math.round((dailyGoal.questionsCompleted / dailyGoal.questionsTarget) * 100));

  const milestones = [
    { label: 'Warmup', count: Math.round(dailyGoal.questionsTarget * 0.25) },
    { label: 'Midway', count: Math.round(dailyGoal.questionsTarget * 0.5) },
    { label: 'Final Sprint', count: Math.round(dailyGoal.questionsTarget * 0.75) },
    { label: 'Target', count: dailyGoal.questionsTarget }
  ];

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.stopPropagation();
    markQuestionAnswered(`quick-log-${Date.now()}`, true, 'A');
  };

  return (
    <div 
      id="tour-daily-goal"
      className="relative overflow-hidden bg-white dark:bg-[#10161b]/90 border border-slate-200 dark:border-[#1D8676]/25 rounded-2xl p-4 shadow-sm hover:border-[#1D8676]/40 transition-all cursor-pointer"
    >
      {/* Soft gaussian fade in bright mode */}
      <div className="absolute -top-10 -left-10 w-40 h-40 bg-[#1D8676]/5 dark:bg-[#1D8676]/10 rounded-full blur-2xl pointer-events-none" />

      <div className="relative flex flex-col md:flex-row md:items-center justify-between gap-4">
        {/* Title and stats */}
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-[#1D8676]/10 dark:bg-[#1D8676]/15 border border-[#1D8676]/20 dark:border-[#1D8676]/30 flex items-center justify-center text-[#1D8676] dark:text-[#2dd4bf]">
            <Target className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <span className="text-sm font-bold text-slate-900 dark:text-white tracking-wide">
                Your Daily Goal ({dailyGoal.questionsCompleted}/{dailyGoal.questionsTarget} Qs)
              </span>
              <ChevronRight className="w-4 h-4 text-slate-400" />
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400">
              {dailyGoal.studyTimeMinutesCompleted} min focused study logged today • {percentage}% completed
            </p>
          </div>
        </div>

        {/* Milestone Progress Track */}
        <div className="flex-1 max-w-xl px-2">
          <div className="relative flex items-center justify-between">
            {/* Background Track Line */}
            <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1.5 bg-slate-200 dark:bg-slate-800 rounded-full" />
            
            {/* Active Filled Progress Line */}
            <div 
              className="absolute left-0 top-1/2 -translate-y-1/2 h-1.5 bg-[#1D8676] rounded-full transition-all duration-500 shadow-sm"
              style={{ width: `${percentage}%` }}
            />

            {/* Checkpoints */}
            {milestones.map((m, idx) => {
              const reached = dailyGoal.questionsCompleted >= m.count;
              const isLast = idx === milestones.length - 1;

              return (
                <div key={idx} className="relative z-10 flex flex-col items-center">
                  <div 
                    className={`w-7 h-7 rounded-full flex items-center justify-center transition-all ${
                      reached 
                        ? 'bg-[#1D8676] text-white shadow-sm' 
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 border border-slate-300 dark:border-slate-700'
                    }`}
                    title={`${m.label}: ${m.count} Qs`}
                  >
                    {isLast ? (
                      <Flag className={`w-3.5 h-3.5 ${reached ? 'text-amber-300' : 'text-slate-400'}`} />
                    ) : reached ? (
                      <CheckCircle2 className="w-3.5 h-3.5" />
                    ) : (
                      <span className="text-[10px] font-mono font-semibold">{m.count}</span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Quick action button to log question */}
        <div className="flex items-center gap-2">
          <button
            onClick={handleQuickAdd}
            className="px-3 py-1.5 rounded-xl bg-[#1D8676]/10 dark:bg-[#1D8676]/15 hover:bg-[#1D8676]/20 border border-[#1D8676]/30 text-[#1D8676] dark:text-[#2dd4bf] text-xs font-semibold flex items-center gap-1.5 transition-all group"
          >
            <Plus className="w-3.5 h-3.5 group-hover:rotate-90 transition-transform" />
            <span>+1 Solved</span>
          </button>
        </div>
      </div>
    </div>
  );
};
