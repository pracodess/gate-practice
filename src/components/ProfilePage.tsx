import React from 'react';
import { User, Award, Flame, Sparkles, Clock, Target, Compass, ShieldCheck } from 'lucide-react';
import { useApp } from '../context/AppContext';

export const ProfilePage: React.FC = () => {
  const { userProfile, currentExamData, setIsExamSelectorOpen } = useApp();

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#1D8676]/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1D8676]/20 text-[#2dd4bf] border border-[#1D8676]/30">
            ASPIRANT DOSSIER
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Student Profile & Study Analytics
        </h2>
      </div>

      {/* Main Profile Identity Card */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#122320] via-[#0e1b19] to-[#0a1412] border border-[#1D8676]/40 shadow-xl flex flex-col sm:flex-row items-center gap-6">
        <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#1D8676] to-[#2dd4bf] p-1 flex items-center justify-center text-white text-3xl font-bold font-mono shadow-lg shadow-[#1D8676]/30 shrink-0">
          {userProfile.name.charAt(0)}
        </div>

        <div className="space-y-1 text-center sm:text-left flex-1">
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
            <h3 className="text-xl font-bold text-white">{userProfile.name}</h3>
            <span className="text-xs px-2.5 py-0.5 rounded-full bg-[#1D8676]/20 border border-[#1D8676]/40 text-[#2dd4bf] font-semibold">
              {userProfile.rankTitle}
            </span>
          </div>
          <p className="text-xs text-slate-400">{userProfile.email}</p>
          <div className="flex flex-wrap items-center justify-center sm:justify-start gap-3 pt-2 text-xs text-slate-300">
            <span className="flex items-center gap-1.5">
              <Compass className="w-3.5 h-3.5 text-[#1D8676]" />
              Target: <strong className="text-white">{currentExamData.name} ({userProfile.targetYear})</strong>
            </span>
            <button
              onClick={() => setIsExamSelectorOpen(true)}
              className="text-[#2dd4bf] hover:underline font-semibold"
            >
              (Change)
            </button>
          </div>
        </div>
      </div>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
        <div className="p-4 rounded-xl bg-[#10161b] border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
            <span>Streak</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{userProfile.streakDays} Days</div>
          <span className="text-[10px] text-emerald-400">Active today</span>
        </div>

        <div className="p-4 rounded-xl bg-[#10161b] border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Sparkles className="w-4 h-4 text-[#2dd4bf]" />
            <span>Experience</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{userProfile.xpPoints} XP</div>
          <span className="text-[10px] text-slate-400">Rank: Diamond</span>
        </div>

        <div className="p-4 rounded-xl bg-[#10161b] border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Target className="w-4 h-4 text-emerald-400" />
            <span>PYQs Solved</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{userProfile.totalQuestionsSolved}</div>
          <span className="text-[10px] text-slate-400">Questions completed</span>
        </div>

        <div className="p-4 rounded-xl bg-[#10161b] border border-slate-800">
          <div className="flex items-center gap-2 text-xs text-slate-400 mb-1">
            <Clock className="w-4 h-4 text-purple-400" />
            <span>Focus Time</span>
          </div>
          <div className="text-2xl font-bold text-white font-mono">{Math.round(userProfile.totalFocusMinutes / 60)}h</div>
          <span className="text-[10px] text-slate-400">{userProfile.totalFocusMinutes} mins logged</span>
        </div>
      </div>
    </div>
  );
};
