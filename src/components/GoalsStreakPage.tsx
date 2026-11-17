import React, { useState } from 'react';
import { 
  Flame, 
  Target, 
  Award, 
  Trophy, 
  CheckCircle2, 
  Sparkles, 
  Clock, 
  Calendar, 
  Zap, 
  Lock,
  Gift
} from 'lucide-react';
import { useApp } from '../context/AppContext';

export const GoalsStreakPage: React.FC = () => {
  const { 
    dailyGoal, 
    userProfile, 
    achievements, 
    triggerCelebration 
  } = useApp();

  const [claimedRewardIds, setClaimedRewardIds] = useState<string[]>(['rw-1']);

  // Rewards catalog that students can unlock with Gems/XP
  const rewardsList = [
    {
      id: 'rw-1',
      title: 'Dark Emerald Obsidian Theme',
      costGems: 20,
      description: 'Exclusive high-contrast AMOLED study theme for late-night revisions.',
      icon: '🎨',
      unlocked: true
    },
    {
      id: 'rw-2',
      title: 'Official Formula Handbook PDF Export',
      costGems: 50,
      description: 'Instant compiled high-yield formula PDF for your target exam.',
      icon: '📄',
      unlocked: userProfile.gems >= 50
    },
    {
      id: 'rw-3',
      title: 'AIR Predictor & Rank Engine Pro',
      costGems: 100,
      description: 'AI model comparing your test performance against past year toppers.',
      icon: '🚀',
      unlocked: userProfile.gems >= 100
    }
  ];

  const handleClaimReward = (id: string, cost: number) => {
    if (claimedRewardIds.includes(id)) return;
    if (userProfile.gems >= cost) {
      setClaimedRewardIds(prev => [...prev, id]);
      triggerCelebration();
    }
  };

  // 14-Day Streak Activity Simulation
  const streakDaysData = [
    { day: 'M', active: true, qCount: 32 },
    { day: 'T', active: true, qCount: 40 },
    { day: 'W', active: true, qCount: 28 },
    { day: 'T', active: true, qCount: 35 },
    { day: 'F', active: true, qCount: 45 },
    { day: 'S', active: true, qCount: 30 },
    { day: 'S', active: true, qCount: 26 },
    { day: 'M', active: true, qCount: 38 },
    { day: 'T', active: true, qCount: 42 },
    { day: 'W', active: true, qCount: 34 },
    { day: 'T', active: true, qCount: 29 },
    { day: 'F', active: true, qCount: 31 },
    { day: 'S', active: true, qCount: 36 },
    { day: 'Today', active: true, qCount: dailyGoal.questionsCompleted }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-[#1D8676]/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1D8676]/20 text-[#2dd4bf] border border-[#1D8676]/30">
            DISCIPLINE & GAMIFICATION
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-white">
          Study Goals, Daily Streaks & Achievements
        </h2>
        <p className="text-xs text-slate-400">
          Build consistency day by day. Every question solved and focus session logged earns XP, badges, and gems.
        </p>
      </div>

      {/* Streak Showcase Banner */}
      <div className="p-6 rounded-2xl bg-gradient-to-r from-[#172e29] via-[#10221e] to-[#0c1816] border border-[#1D8676]/40 shadow-xl flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="flex items-center gap-4 text-center md:text-left">
          <div className="w-16 h-16 rounded-2xl bg-orange-500/20 border border-orange-500/40 flex items-center justify-center text-orange-500 shadow-lg shadow-orange-500/20 shrink-0">
            <Flame className="w-9 h-9 fill-orange-500 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-2xl sm:text-3xl font-extrabold text-white">
                {userProfile.streakDays} Day Continuous Streak!
              </span>
            </div>
            <p className="text-xs text-slate-300 mt-1">
              You are among the top 5% most consistent aspirants this week. Complete today's target to reach Day {userProfile.streakDays + 1}.
            </p>
          </div>
        </div>

        {/* 14-Day Heatmap Row */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 max-w-full">
          {streakDaysData.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div 
                className={`w-7 h-10 rounded-lg flex items-center justify-center text-[10px] font-bold transition-transform hover:scale-110 ${
                  d.active
                    ? 'bg-gradient-to-t from-[#1D8676] to-[#2dd4bf] text-white shadow-sm'
                    : 'bg-slate-800 text-slate-500'
                }`}
                title={`${d.day}: ${d.qCount} questions completed`}
              >
                {d.qCount}
              </div>
              <span className="text-[9px] text-slate-400 font-medium">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Goals Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Question Goal Card */}
        <div className="p-5 rounded-2xl bg-[#10161b] border border-[#1D8676]/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-[#2dd4bf]" />
              <span>Daily Practice Questions</span>
            </span>
            <span className="text-xs font-bold text-[#2dd4bf] font-mono">
              {dailyGoal.questionsCompleted} / {dailyGoal.questionsTarget} Qs
            </span>
          </div>

          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-[#1D8676] to-[#2dd4bf] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (dailyGoal.questionsCompleted / dailyGoal.questionsTarget) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400">
            {dailyGoal.questionsTarget - dailyGoal.questionsCompleted > 0
              ? `${dailyGoal.questionsTarget - dailyGoal.questionsCompleted} more questions to hit today's target`
              : '🎉 You have conquered today\'s question target!'}
          </p>
        </div>

        {/* Study Time Goal Card */}
        <div className="p-5 rounded-2xl bg-[#10161b] border border-[#1D8676]/30 space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-400" />
              <span>Daily Deep Focus Hours</span>
            </span>
            <span className="text-xs font-bold text-purple-400 font-mono">
              {dailyGoal.studyTimeMinutesCompleted} / {dailyGoal.studyTimeMinutesTarget} Mins
            </span>
          </div>

          <div className="h-2.5 bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-gradient-to-r from-purple-600 to-indigo-400 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (dailyGoal.studyTimeMinutesCompleted / dailyGoal.studyTimeMinutesTarget) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-400">
            Logged through Focus Mode & Mock Tests. Keep your momentum going!
          </p>
        </div>
      </div>

      {/* Achievements Gallery */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-400" />
          <span>Badges & Achievements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div 
              key={ach.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                ach.isUnlocked
                  ? 'bg-gradient-to-br from-[#12221f] to-[#0d1618] border-[#1D8676] shadow-sm'
                  : 'bg-[#101519] border-slate-800 opacity-70'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                ach.isUnlocked
                  ? 'bg-[#1D8676] text-white shadow-md shadow-[#1D8676]/30'
                  : 'bg-slate-800 text-slate-500'
              }`}>
                {ach.isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-white">{ach.title}</h4>
                  <span className="text-[10px] font-mono text-[#2dd4bf] font-bold">
                    +{ach.xpReward} XP
                  </span>
                </div>
                <p className="text-[11px] text-slate-400 mt-0.5 leading-snug">
                  {ach.description}
                </p>

                {/* Progress bar */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${ach.isUnlocked ? 'bg-[#1D8676]' : 'bg-slate-600'}`}
                      style={{ width: `${Math.min(100, (ach.progress / ach.maxProgress) * 100)}%` }}
                    />
                  </div>
                  <span className="text-[10px] font-mono text-slate-400">
                    {ach.progress}/{ach.maxProgress}
                  </span>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Rewards Catalog */}
      <div className="space-y-3 pt-4">
        <div className="flex items-center justify-between">
          <h3 className="text-base font-bold text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#2dd4bf]" />
            <span>Aspirant Rewards Vault</span>
          </h3>
          <span className="text-xs font-bold text-amber-400">
            Available: 💎 {userProfile.gems} Gems
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
          {rewardsList.map((rw) => {
            const isClaimed = claimedRewardIds.includes(rw.id);
            const canAfford = userProfile.gems >= rw.costGems;

            return (
              <div 
                key={rw.id}
                className="p-4 rounded-xl bg-[#10161b] border border-[#1D8676]/30 flex flex-col justify-between"
              >
                <div>
                  <div className="text-2xl mb-2">{rw.icon}</div>
                  <h4 className="text-xs font-bold text-white">{rw.title}</h4>
                  <p className="text-[11px] text-slate-400 mt-1">{rw.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-400">💎 {rw.costGems} Gems</span>
                  <button
                    onClick={() => handleClaimReward(rw.id, rw.costGems)}
                    disabled={isClaimed || !canAfford}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isClaimed
                        ? 'bg-emerald-500/20 text-emerald-400 border border-emerald-500/40'
                        : canAfford
                        ? 'bg-[#1D8676] hover:bg-[#176f62] text-white shadow-md'
                        : 'bg-slate-800 text-slate-500 opacity-60'
                    }`}
                  >
                    {isClaimed ? 'Unlocked' : 'Claim'}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
