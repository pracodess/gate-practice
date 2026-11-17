import React, { useState } from 'react';
import { 
  Flame, 
  Target, 
  Award, 
  Trophy, 
  Clock, 
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

  const streakDaysData = [
    { day: 'M', active: userProfile.streakDays >= 7, qCount: userProfile.streakDays >= 7 ? 20 : 0 },
    { day: 'T', active: userProfile.streakDays >= 6, qCount: userProfile.streakDays >= 6 ? 25 : 0 },
    { day: 'W', active: userProfile.streakDays >= 5, qCount: userProfile.streakDays >= 5 ? 18 : 0 },
    { day: 'T', active: userProfile.streakDays >= 4, qCount: userProfile.streakDays >= 4 ? 30 : 0 },
    { day: 'F', active: userProfile.streakDays >= 3, qCount: userProfile.streakDays >= 3 ? 15 : 0 },
    { day: 'S', active: userProfile.streakDays >= 2, qCount: userProfile.streakDays >= 2 ? 10 : 0 },
    { day: 'Today', active: userProfile.streakDays >= 1, qCount: dailyGoal.questionsCompleted }
  ];

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="pb-4 border-b border-slate-200 dark:border-[#1D8676]/20">
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/30">
            DISCIPLINE & GAMIFICATION
          </span>
        </div>
        <h2 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white">
          Study Goals, Daily Streaks & Achievements
        </h2>
        <p className="text-xs text-slate-500 dark:text-slate-400">
          Build consistency day by day. Every question solved and focus session logged earns XP, badges, and gems.
        </p>
      </div>

      {/* Streak Showcase Banner */}
      <div className="p-6 rounded-2xl bg-white dark:bg-gradient-to-r dark:from-[#172e29] dark:via-[#10221e] dark:to-[#0c1816] border border-slate-200 dark:border-[#1D8676]/40 shadow-sm flex flex-col md:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-48 h-48 bg-[#1D8676]/5 dark:bg-transparent rounded-full blur-2xl pointer-events-none" />

        <div className="flex items-center gap-4 text-center md:text-left relative z-10">
          <div className="w-16 h-16 rounded-2xl bg-orange-50 dark:bg-orange-500/20 border border-orange-200 dark:border-orange-500/40 flex items-center justify-center text-orange-500 shadow-sm shrink-0">
            <Flame className="w-9 h-9 fill-current" />
          </div>
          <div>
            <div className="flex items-center gap-2 justify-center md:justify-start">
              <span className="text-2xl sm:text-3xl font-extrabold text-slate-900 dark:text-white">
                {userProfile.streakDays} Day Study Streak!
              </span>
            </div>
            <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">
              {userProfile.streakDays === 0 
                ? 'Solve your first question today to ignite your study streak!' 
                : 'Keep your momentum going! Complete today\'s goal to extend your streak.'}
            </p>
          </div>
        </div>

        {/* Heatmap Row */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 max-w-full relative z-10">
          {streakDaysData.map((d, idx) => (
            <div key={idx} className="flex flex-col items-center gap-1">
              <div 
                className={`w-8 h-11 rounded-lg flex items-center justify-center text-[10px] font-bold transition-transform ${
                  d.active
                    ? 'bg-[#1D8676] text-white shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500 border border-slate-200 dark:border-slate-700'
                }`}
                title={`${d.day}: ${d.qCount} questions completed`}
              >
                {d.qCount}
              </div>
              <span className="text-[9px] text-slate-500 dark:text-slate-400 font-medium">{d.day}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Goals Breakdown */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Question Goal Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-[#1D8676]/30 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Target className="w-4 h-4 text-[#1D8676] dark:text-[#2dd4bf]" />
              <span>Daily Practice Questions</span>
            </span>
            <span className="text-xs font-bold text-[#1D8676] dark:text-[#2dd4bf] font-mono">
              {dailyGoal.questionsCompleted} / {dailyGoal.questionsTarget} Qs
            </span>
          </div>

          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#1D8676] rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (dailyGoal.questionsCompleted / dailyGoal.questionsTarget) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            {dailyGoal.questionsTarget - dailyGoal.questionsCompleted > 0
              ? `${dailyGoal.questionsTarget - dailyGoal.questionsCompleted} more questions to hit today's target`
              : '🎉 You have conquered today\'s question target!'}
          </p>
        </div>

        {/* Study Time Goal Card */}
        <div className="p-5 rounded-2xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-[#1D8676]/30 shadow-sm space-y-3">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Clock className="w-4 h-4 text-purple-600 dark:text-purple-400" />
              <span>Daily Deep Focus Hours</span>
            </span>
            <span className="text-xs font-bold text-purple-600 dark:text-purple-400 font-mono">
              {dailyGoal.studyTimeMinutesCompleted} / {dailyGoal.studyTimeMinutesTarget} Mins
            </span>
          </div>

          <div className="h-2.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
            <div 
              className="h-full bg-purple-600 rounded-full transition-all duration-500"
              style={{ width: `${Math.min(100, (dailyGoal.studyTimeMinutesCompleted / dailyGoal.studyTimeMinutesTarget) * 100)}%` }}
            />
          </div>

          <p className="text-[11px] text-slate-500 dark:text-slate-400">
            Logged through Focus Mode & Mock Tests.
          </p>
        </div>
      </div>

      {/* Achievements Gallery */}
      <div className="space-y-3 pt-2">
        <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <Trophy className="w-4 h-4 text-amber-500" />
          <span>Badges & Achievements</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
          {achievements.map((ach) => (
            <div 
              key={ach.id}
              className={`p-4 rounded-xl border transition-all flex items-start gap-3.5 ${
                ach.isUnlocked
                  ? 'bg-teal-50/50 dark:bg-gradient-to-br dark:from-[#12221f] dark:to-[#0d1618] border-[#1D8676] dark:border-[#1D8676] shadow-sm'
                  : 'bg-white dark:bg-[#101519] border-slate-200 dark:border-slate-800 opacity-75'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                ach.isUnlocked
                  ? 'bg-[#1D8676] text-white shadow-sm'
                  : 'bg-slate-100 dark:bg-slate-800 text-slate-400 dark:text-slate-500'
              }`}>
                {ach.isUnlocked ? <Award className="w-5 h-5" /> : <Lock className="w-5 h-5" />}
              </div>

              <div className="flex-1">
                <div className="flex items-center justify-between gap-1">
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{ach.title}</h4>
                  <span className="text-[10px] font-mono text-[#1D8676] dark:text-[#2dd4bf] font-bold">
                    +{ach.xpReward} XP
                  </span>
                </div>
                <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-0.5 leading-snug">
                  {ach.description}
                </p>

                {/* Progress bar */}
                <div className="mt-2 flex items-center gap-2">
                  <div className="flex-1 h-1.5 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                    <div 
                      className={`h-full rounded-full ${ach.isUnlocked ? 'bg-[#1D8676]' : 'bg-slate-400'}`}
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
          <h3 className="text-base font-bold text-slate-900 dark:text-white flex items-center gap-2">
            <Gift className="w-4 h-4 text-[#1D8676] dark:text-[#2dd4bf]" />
            <span>Aspirant Rewards & Study Perks</span>
          </h3>
          <span className="text-xs font-bold text-amber-500 dark:text-amber-400">
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
                className="p-4 rounded-xl bg-white dark:bg-[#10161b] border border-slate-200 dark:border-[#1D8676]/30 flex flex-col justify-between shadow-sm"
              >
                <div>
                  <div className="text-2xl mb-2">{rw.icon}</div>
                  <h4 className="text-xs font-bold text-slate-900 dark:text-white">{rw.title}</h4>
                  <p className="text-[11px] text-slate-500 dark:text-slate-400 mt-1">{rw.description}</p>
                </div>

                <div className="mt-4 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center justify-between">
                  <span className="text-xs font-bold text-amber-500 dark:text-amber-400">💎 {rw.costGems} Gems</span>
                  <button
                    onClick={() => handleClaimReward(rw.id, rw.costGems)}
                    disabled={isClaimed || !canAfford}
                    className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                      isClaimed
                        ? 'bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30'
                        : canAfford
                        ? 'bg-[#1D8676] hover:bg-[#176f62] text-white shadow-sm'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-400 opacity-60'
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
