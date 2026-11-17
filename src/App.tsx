import React from 'react';
import { AppProvider, useApp } from './context/AppContext';
import { Sidebar } from './components/Sidebar';
import { Header } from './components/Header';
import { DailyGoalBar } from './components/DailyGoalBar';
import { HeroCarousel } from './components/HeroCarousel';
import { DigitalBooks } from './components/DigitalBooks';
import { PyqSection } from './components/PyqSection';
import { ShortNotesPage } from './components/ShortNotesPage';
import { TestsPage } from './components/TestsPage';
import { GoalsStreakPage } from './components/GoalsStreakPage';
import { ExamInfoPage } from './components/ExamInfoPage';
import { ProfilePage } from './components/ProfilePage';
import { SettingsPage } from './components/SettingsPage';
import { FocusModeModal } from './components/FocusModeModal';
import { ExamSelectorModal } from './components/ExamSelectorModal';
import { Timer, Sparkles, ShieldCheck, Play } from 'lucide-react';

const AppContent: React.FC = () => {
  const { activeTab, theme, setIsFocusModeActive } = useApp();

  return (
    <div className={`min-h-screen ${theme === 'dark' ? 'bg-[#0b0f12] text-slate-100' : 'bg-[#f8fafc] text-slate-800'} relative flex overflow-x-hidden font-sans`}>
      {/* Light & subtle ambient aurora background flow */}
      <div className="aurora-bg" />

      {/* Left Sidebar Navigation matching screenshot */}
      <Sidebar />

      {/* Main View Area */}
      <div className="flex-1 flex flex-col min-w-0 z-10">
        {/* Top Header */}
        <Header />

        {/* Content Body Container */}
        <main className="flex-1 p-4 sm:p-6 lg:p-8 max-w-7xl w-full mx-auto">
          {activeTab === 'home' && (
            <div className="space-y-6">
              {/* Daily Goal Progress Bar matching screenshot */}
              <DailyGoalBar />

              {/* Promo Banner Slider matching screenshot */}
              <HeroCarousel />

              {/* Most Imp Digital Books for Selected Exam */}
              <DigitalBooks />

              {/* Chapter-wise PYQ Bank */}
              <PyqSection />
            </div>
          )}

          {activeTab === 'tests' && <TestsPage />}
          {activeTab === 'short-notes' && <ShortNotesPage />}
          {activeTab === 'goals' && <GoalsStreakPage />}
          {activeTab === 'exam-info' && <ExamInfoPage />}
          {activeTab === 'profile' && <ProfilePage />}
          {activeTab === 'settings' && <SettingsPage />}
          {activeTab === 'focus' && (
            <div className="max-w-2xl mx-auto py-12 text-center space-y-6">
              <div className="w-20 h-20 rounded-3xl bg-[#1D8676]/20 border border-[#1D8676]/40 flex items-center justify-center text-[#2dd4bf] mx-auto shadow-xl shadow-[#1D8676]/20">
                <Timer className="w-10 h-10 animate-pulse" />
              </div>

              <div>
                <span className="text-[10px] font-bold uppercase tracking-wider px-2.5 py-1 rounded-full bg-[#1D8676]/20 text-[#2dd4bf] border border-[#1D8676]/40">
                  DISTRACTION-FREE DEEP WORK
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white mt-2">
                  Zen Study & Pomodoro Chamber
                </h2>
                <p className="text-xs sm:text-sm text-slate-400 max-w-md mx-auto mt-2 leading-relaxed">
                  Enter an immersive study space with 40Hz focus binaural frequencies, rain soundscapes, and an automatic distraction blocker that silences popups.
                </p>
              </div>

              <div className="flex items-center justify-center gap-4 text-xs text-slate-300">
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <ShieldCheck className="w-4 h-4 text-[#2dd4bf]" />
                  <span>Popup Blocker</span>
                </div>
                <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900 border border-slate-800">
                  <Sparkles className="w-4 h-4 text-amber-400" />
                  <span>Ambient Audio</span>
                </div>
              </div>

              <button
                onClick={() => setIsFocusModeActive(true)}
                className="px-6 py-3 rounded-2xl bg-[#1D8676] hover:bg-[#176f62] text-white text-sm font-bold shadow-xl shadow-[#1D8676]/40 flex items-center justify-center gap-2 mx-auto transition-all hover:scale-105 active:scale-95"
              >
                <Play className="w-4 h-4 fill-white" />
                <span>Launch Fullscreen Focus Room</span>
              </button>
            </div>
          )}
        </main>
      </div>

      {/* Global Modals (Single Instance) */}
      <FocusModeModal />
      <ExamSelectorModal />
    </div>
  );
};

export default function App() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}
