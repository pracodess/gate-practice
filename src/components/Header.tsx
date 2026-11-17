import React, { useState } from 'react';
import { 
  ChevronDown, 
  Flame, 
  Sparkles, 
  Bell, 
  Compass, 
  CheckCircle,
  HelpCircle
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { EXAMS_LIST } from '../data/mockData';

export const Header: React.FC = () => {
  const { 
    selectedExam, 
    setSelectedExam, 
    currentExamData, 
    userProfile, 
    setIsExamSelectorOpen,
    notificationsList,
    clearNotifications,
    blockedPopupsCount,
    startTour
  } = useApp();

  const [showNotificationsDropdown, setShowNotificationsDropdown] = useState(false);
  const [showExamDropdown, setShowExamDropdown] = useState(false);

  const unreadCount = notificationsList.filter(n => !n.read).length;

  return (
    <header className="h-16 px-6 border-b border-slate-200 dark:border-[#1D8676]/20 bg-white/95 dark:bg-[#0b0f12]/80 backdrop-blur-md flex items-center justify-between sticky top-0 z-20 transition-colors">
      {/* Left: User Greeting & Exam Selector Switcher */}
      <div className="flex items-center gap-4">
        {/* User avatar and greeting */}
        <div className="relative">
          <button
            onClick={() => setShowExamDropdown(!showExamDropdown)}
            className="flex items-center gap-2.5 px-3 py-1.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800/60 border border-transparent hover:border-slate-300 dark:hover:border-[#1D8676]/30 transition-all text-left group"
          >
            <div className="w-8 h-8 rounded-full bg-[#1D8676] flex items-center justify-center text-white shadow-sm">
              <span className="text-xs font-bold font-mono">
                {userProfile.name ? userProfile.name.charAt(0).toUpperCase() : 'A'}
              </span>
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-sm font-semibold text-slate-900 dark:text-white group-hover:text-[#1D8676] dark:group-hover:text-[#2dd4bf] transition-colors">
                  Hey, {userProfile.name || 'Aspirant'}!
                </span>
                <span className="text-xs font-medium px-2 py-0.5 rounded-md bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/25 dark:border-[#1D8676]/30 flex items-center gap-1">
                  {currentExamData.name}
                  <ChevronDown className={`w-3 h-3 text-[#1D8676] dark:text-[#2dd4bf] transition-transform ${showExamDropdown ? 'rotate-180' : ''}`} />
                </span>
              </div>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">Target Year: {userProfile.targetYear}</p>
            </div>
          </button>

          {/* Quick Exam Switcher Dropdown */}
          {showExamDropdown && (
            <div className="absolute top-full left-0 mt-2 w-72 bg-white dark:bg-[#12181d] border border-slate-200 dark:border-[#1D8676]/40 rounded-2xl shadow-xl p-2 z-50 animate-in fade-in slide-in-from-top-2 duration-150">
              <div className="px-3 py-2 text-xs font-semibold text-slate-500 dark:text-slate-400 uppercase tracking-wider flex items-center justify-between">
                <span>Select Your Exam</span>
                <button
                  onClick={() => setIsExamSelectorOpen(true)}
                  className="text-[11px] text-[#1D8676] dark:text-[#2dd4bf] hover:underline"
                >
                  View All
                </button>
              </div>

              <div className="space-y-1">
                {EXAMS_LIST.map((exam) => (
                  <button
                    key={exam.id}
                    onClick={() => {
                      setSelectedExam(exam.id);
                      setShowExamDropdown(false);
                    }}
                    className={`w-full flex items-center justify-between p-2.5 rounded-xl text-left transition-all ${
                      selectedExam === exam.id
                        ? 'bg-[#1D8676] text-white font-semibold'
                        : 'hover:bg-slate-100 dark:hover:bg-slate-800/60 text-slate-700 dark:text-slate-300'
                    }`}
                  >
                    <div>
                      <div className="text-sm font-medium">{exam.name}</div>
                      <div className={`text-[11px] line-clamp-1 ${selectedExam === exam.id ? 'text-teal-100' : 'text-slate-400'}`}>
                        {exam.fullName}
                      </div>
                    </div>
                    {selectedExam === exam.id && (
                      <CheckCircle className="w-4 h-4 text-white shrink-0 ml-2" />
                    )}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Right Stats & Action Badges */}
      <div className="flex items-center gap-3">
        {/* Streak Flame Tracker */}
        <div 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-orange-50 dark:bg-orange-500/10 border border-orange-200 dark:border-orange-500/30 text-orange-600 dark:text-orange-400 text-xs font-semibold shadow-sm"
          title={`${userProfile.streakDays} Day Continuous Study Streak`}
        >
          <Flame className="w-4 h-4 text-orange-500 fill-orange-500" />
          <span>{userProfile.streakDays} Days</span>
        </div>

        {/* Study XP / Gems */}
        <div 
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#1D8676]/10 dark:bg-[#1D8676]/15 border border-[#1D8676]/25 dark:border-[#1D8676]/40 text-[#1D8676] dark:text-[#2dd4bf] text-xs font-semibold shadow-sm"
          title={`${userProfile.xpPoints} XP Earned`}
        >
          <Sparkles className="w-3.5 h-3.5" />
          <span>{userProfile.xpPoints} XP</span>
        </div>

        {/* Tour Guide Button */}
        <button
          onClick={startTour}
          className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50 transition-all text-xs flex items-center gap-1"
          title="Restart Feature Tour"
        >
          <HelpCircle className="w-4 h-4 text-[#1D8676]" />
          <span className="hidden lg:inline text-[11px] font-medium">Tour</span>
        </button>

        {/* Notification Bell */}
        <div className="relative">
          <button
            onClick={() => setShowNotificationsDropdown(!showNotificationsDropdown)}
            className="p-2 rounded-xl bg-slate-100 dark:bg-slate-800/40 hover:bg-slate-200 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700/50 transition-all relative"
            title="Notifications"
          >
            <Bell className="w-4 h-4" />
            {unreadCount > 0 && (
              <span className="absolute -top-1 -right-1 w-4 h-4 bg-[#1D8676] text-white text-[10px] font-bold rounded-full flex items-center justify-center">
                {unreadCount}
              </span>
            )}
          </button>

          {/* Notifications Dropdown */}
          {showNotificationsDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 bg-white dark:bg-[#12181d] border border-slate-200 dark:border-[#1D8676]/30 rounded-2xl shadow-xl p-3 z-50 animate-in fade-in slide-in-from-top-2">
              <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-100 dark:border-slate-800">
                <span className="text-xs font-bold text-slate-900 dark:text-white uppercase tracking-wider">Notifications</span>
                <button
                  onClick={clearNotifications}
                  className="text-[11px] text-[#1D8676] dark:text-[#2dd4bf] hover:underline"
                >
                  Mark all read
                </button>
              </div>

              {blockedPopupsCount > 0 && (
                <div className="mb-2 p-2 rounded-lg bg-[#1D8676]/10 border border-[#1D8676]/25 text-xs text-[#1D8676] dark:text-[#2dd4bf] flex items-center justify-between">
                  <span>🛡️ {blockedPopupsCount} popups blocked during Focus Mode</span>
                </div>
              )}

              <div className="space-y-2 max-h-64 overflow-y-auto">
                {notificationsList.map(n => (
                  <div key={n.id} className="p-2.5 rounded-xl bg-slate-50 dark:bg-slate-800/40 hover:bg-slate-100 dark:hover:bg-slate-800/80 transition-colors">
                    <div className="flex justify-between items-start">
                      <span className="text-xs font-semibold text-slate-900 dark:text-white">{n.title}</span>
                      <span className="text-[10px] text-slate-400">{n.time}</span>
                    </div>
                    <p className="text-xs text-slate-600 dark:text-slate-300 mt-1">{n.message}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Change Exam Button */}
        <button
          onClick={() => setIsExamSelectorOpen(true)}
          className="hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-[#1D8676]/30 hover:bg-[#1D8676]/10 text-[#1D8676] dark:text-[#2dd4bf] text-xs font-semibold transition-all"
        >
          <Compass className="w-3.5 h-3.5" />
          <span>Switch Exam</span>
        </button>
      </div>
    </header>
  );
};
