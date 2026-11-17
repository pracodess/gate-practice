import React, { useState } from 'react';
import { Sun, Moon, Check, HelpCircle } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const SettingsPage: React.FC = () => {
  const { theme, setTheme, dailyGoal, startTour } = useApp();
  const [qTarget, setQTarget] = useState(dailyGoal.questionsTarget);
  const [timeTarget, setTimeTarget] = useState(dailyGoal.studyTimeMinutesTarget);
  const [savedSuccess, setSavedSuccess] = useState(false);

  const handleSavePreferences = () => {
    dailyGoal.questionsTarget = qTarget;
    dailyGoal.studyTimeMinutesTarget = timeTarget;
    localStorage.setItem('gradeup_daily_goal', JSON.stringify(dailyGoal));
    setSavedSuccess(true);
    setTimeout(() => setSavedSuccess(false), 2500);
  };

  return (
    <div className="space-y-6 max-w-2xl">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-[#1D8676]/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/30">
            PREFERENCES
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Application & Study Settings
        </h2>
      </div>

      {/* Theme Setting */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Visual Appearance</h3>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          The app uses #1D8676 brand accents across both themes with soft ambient fading.
        </p>

        <div className="flex items-center gap-3 pt-2">
          <button
            onClick={() => setTheme('dark')}
            className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              theme === 'dark'
                ? 'bg-[#1D8676] text-white border-[#1D8676] shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-white'
            }`}
          >
            <Moon className="w-4 h-4" />
            <span>Dark Obsidian</span>
          </button>

          <button
            onClick={() => setTheme('light')}
            className={`flex-1 p-3 rounded-xl border flex items-center justify-center gap-2 text-xs font-bold transition-all ${
              theme === 'light'
                ? 'bg-[#1D8676] text-white border-[#1D8676] shadow-sm'
                : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            <Sun className="w-4 h-4" />
            <span>Light Crisp Emerald</span>
          </button>
        </div>
      </div>

      {/* Daily Study Goals Targets */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-slate-800 shadow-sm space-y-4">
        <h3 className="text-sm font-bold text-slate-900 dark:text-white">Daily Targets</h3>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-700 dark:text-slate-300">Target Questions per Day:</span>
            <span className="font-bold text-[#1D8676] dark:text-[#2dd4bf] font-mono">{qTarget} Questions</span>
          </div>
          <input
            type="range"
            min="10"
            max="100"
            step="5"
            value={qTarget}
            onChange={(e) => setQTarget(parseInt(e.target.value))}
            className="w-full accent-[#1D8676]"
          />
        </div>

        <div>
          <div className="flex justify-between text-xs mb-1.5">
            <span className="text-slate-700 dark:text-slate-300">Target Study Time per Day:</span>
            <span className="font-bold text-[#1D8676] dark:text-[#2dd4bf] font-mono">{timeTarget} Minutes ({Math.round(timeTarget / 60)} hrs)</span>
          </div>
          <input
            type="range"
            min="30"
            max="480"
            step="30"
            value={timeTarget}
            onChange={(e) => setTimeTarget(parseInt(e.target.value))}
            className="w-full accent-[#1D8676]"
          />
        </div>

        <button
          onClick={handleSavePreferences}
          className="px-4 py-2 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold transition-all shadow-sm flex items-center gap-2"
        >
          {savedSuccess ? (
            <>
              <Check className="w-4 h-4" />
              <span>Saved!</span>
            </>
          ) : (
            <span>Save Targets</span>
          )}
        </button>
      </div>

      {/* Replay Feature Tour */}
      <div className="p-5 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-slate-800 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-xs font-bold text-slate-900 dark:text-white">Interactive App Tour</h4>
          <p className="text-[11px] text-slate-500 dark:text-slate-400">Replay the guided feature tour and popups explaining every section.</p>
        </div>
        <button
          onClick={startTour}
          className="px-3.5 py-2 rounded-xl border border-[#1D8676]/30 text-[#1D8676] dark:text-[#2dd4bf] text-xs font-semibold hover:bg-[#1D8676]/10 flex items-center gap-1.5 transition-all"
        >
          <HelpCircle className="w-4 h-4" />
          <span>Launch Tour</span>
        </button>
      </div>
    </div>
  );
};
