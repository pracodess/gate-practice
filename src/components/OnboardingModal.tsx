import React, { useState } from 'react';
import { Compass, GraduationCap, ArrowRight, Sparkles, Check } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXAMS_LIST } from '../data/mockData';
import { ExamId } from '../types';

export const OnboardingModal: React.FC = () => {
  const { userProfile, completeOnboarding } = useApp();
  const [name, setName] = useState('');
  const [selectedExam, setSelectedExam] = useState<ExamId>('gate');
  const [targetYear, setTargetYear] = useState<number>(2026);
  const [errorMsg, setErrorMsg] = useState('');

  if (userProfile.hasCompletedOnboarding) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setErrorMsg('Please enter your name to personalize your study space.');
      return;
    }
    completeOnboarding(name.trim(), selectedExam, targetYear);
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4 overflow-y-auto select-none animate-in fade-in duration-300">
      <div className="bg-white dark:bg-[#12181d] border border-slate-200 dark:border-[#1D8676]/40 rounded-3xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative">
        {/* Top Icon */}
        <div className="w-14 h-14 rounded-2xl bg-gradient-to-tr from-[#1D8676] to-[#25a895] flex items-center justify-center text-white mx-auto shadow-md shadow-[#1D8676]/30 mb-4">
          <GraduationCap className="w-7 h-7" />
        </div>

        {/* Heading */}
        <div className="text-center mb-6">
          <span className="text-[10px] font-extrabold uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-[#1D8676]/15 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/30">
            Welcome to GradeUp
          </span>
          <h2 className="text-2xl font-extrabold text-slate-900 dark:text-white mt-2 tracking-tight">
            Personalize Your Study Space
          </h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-sm mx-auto">
            Tell us your name and target exam so we can calibrate your study syllabus, formula sheets, and practice tests.
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          {/* Name input */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Your Name / Aspirant Alias:
            </label>
            <input
              type="text"
              autoFocus
              value={name}
              onChange={(e) => {
                setName(e.target.value);
                if (errorMsg) setErrorMsg('');
              }}
              placeholder="e.g. Pratham"
              className="w-full px-4 py-2.5 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-300 dark:border-slate-700 focus:border-[#1D8676] dark:focus:border-[#1D8676] text-slate-900 dark:text-white text-sm outline-none transition-colors"
            />
            {errorMsg && (
              <p className="text-[11px] text-rose-500 font-medium mt-1">{errorMsg}</p>
            )}
          </div>

          {/* Exam selector */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Select Your Target Exam:
            </label>
            <div className="grid grid-cols-3 gap-2">
              {EXAMS_LIST.map((exam) => {
                const isSelected = selectedExam === exam.id;
                return (
                  <button
                    type="button"
                    key={exam.id}
                    onClick={() => setSelectedExam(exam.id)}
                    className={`p-3 rounded-xl border text-center transition-all ${
                      isSelected
                        ? 'border-[#1D8676] bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] font-bold shadow-sm'
                        : 'border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-900/50 text-slate-600 dark:text-slate-400 hover:border-slate-300'
                    }`}
                  >
                    <div className="text-xs font-bold">{exam.name}</div>
                    <div className="text-[10px] text-slate-400 line-clamp-1">{exam.category.split(' ')[0]}</div>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Target year */}
          <div>
            <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 uppercase mb-1.5">
              Target Examination Year:
            </label>
            <div className="flex gap-2">
              {[2025, 2026, 2027].map((yr) => (
                <button
                  type="button"
                  key={yr}
                  onClick={() => setTargetYear(yr)}
                  className={`flex-1 py-2 rounded-xl text-xs font-semibold border transition-all ${
                    targetYear === yr
                      ? 'border-[#1D8676] bg-[#1D8676] text-white'
                      : 'border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  {yr}
                </button>
              ))}
            </div>
          </div>

          {/* Submit */}
          <button
            type="submit"
            className="w-full mt-4 py-3 rounded-xl bg-[#1D8676] hover:bg-[#176f62] text-white text-xs font-bold transition-all shadow-md shadow-[#1D8676]/30 flex items-center justify-center gap-2"
          >
            <span>Ready My Study Space</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
