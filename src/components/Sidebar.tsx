import React from 'react';
import { 
  Home, 
  FileText, 
  BookOpen, 
  Timer, 
  Flame, 
  Info, 
  User, 
  Settings, 
  Sun, 
  Moon, 
  Sparkles,
  ShieldCheck
} from 'lucide-react';
import { useApp, NavTab } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, theme, setTheme, setIsFocusModeActive } = useApp();

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tests', label: 'Tests', icon: FileText },
    { id: 'short-notes', label: 'Short Notes', icon: BookOpen },
    { id: 'focus', label: 'Focus Mode', icon: Timer, badge: 'Zen' },
    { id: 'goals', label: 'Goals & Streak', icon: Flame },
    { id: 'exam-info', label: 'Exam Info', icon: Info },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 border-r border-[#1D8676]/20 bg-[#0d1216]/95 dark:bg-[#0b0f12]/95 backdrop-blur-md z-30 transition-all select-none">
      {/* Top Branding Section */}
      <div className="p-5 pb-2">
        <div className="flex items-center gap-3 px-2 py-1 mb-6 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-9 h-9 rounded-xl bg-gradient-to-tr from-[#1D8676] to-[#25a895] flex items-center justify-center text-white shadow-lg shadow-[#1D8676]/30">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M19 3H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2V5c0-1.1-.9-2-2-2zm-7 14c-1.66 0-3-1.34-3-3s1.34-3 3-3 3 1.34 3 3-1.34 3-3 3zm3-7H9V7h6v3z"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-white dark:text-white">MARKS</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-[#1D8676]/20 text-[#25a895] border border-[#1D8676]/40">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-400 font-medium">Study & PYQ Engine</p>
          </div>
        </div>

        {/* Quick Focus Button in Sidebar */}
        <button
          onClick={() => setIsFocusModeActive(true)}
          className="w-full mb-4 px-3.5 py-2.5 rounded-xl bg-[#1D8676]/15 hover:bg-[#1D8676]/25 border border-[#1D8676]/40 text-[#2dd4bf] text-xs font-semibold flex items-center justify-between transition-all group shadow-sm hover:shadow-[#1D8676]/20"
        >
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#25a895] group-hover:scale-110 transition-transform" />
            <span>Enter Focus Mode</span>
          </div>
          <span className="text-[10px] bg-[#1D8676]/40 text-white px-2 py-0.5 rounded-full font-mono">
            Pomodoro
          </span>
        </button>

        {/* Navigation Links */}
        <nav className="space-y-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;

            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left relative ${
                  isActive
                    ? 'bg-[#1D8676] text-white shadow-md shadow-[#1D8676]/30 font-semibold'
                    : 'text-slate-400 hover:text-white hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-white' : 'text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#1D8676]/20 text-[#2dd4bf]'
                  }`}>
                    {item.badge}
                  </span>
                )}
              </button>
            );
          })}
        </nav>
      </div>

      {/* Bottom Footer Section: Theme Toggle & Info */}
      <div className="p-4 border-t border-[#1D8676]/15 space-y-3">
        {/* Anti-Distraction Shield Indicator */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-900/60 border border-slate-800 text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1D8676]" />
            <span className="text-[11px]">Distraction Blocker</span>
          </div>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
        </div>

        {/* Theme Toggle Pill (matching the screenshot theme switcher) */}
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="text-xs font-medium text-slate-400">Theme</span>
          <div className="flex items-center bg-slate-800/80 p-1 rounded-full border border-slate-700/60">
            <button
              onClick={() => setTheme('light')}
              title="Light Mode"
              className={`p-1.5 rounded-full transition-all ${
                theme === 'light'
                  ? 'bg-[#1D8676] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Sun className="w-3.5 h-3.5" />
            </button>
            <button
              onClick={() => setTheme('dark')}
              title="Dark Mode"
              className={`p-1.5 rounded-full transition-all ${
                theme === 'dark'
                  ? 'bg-[#1D8676] text-white shadow-sm'
                  : 'text-slate-400 hover:text-slate-200'
              }`}
            >
              <Moon className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>
    </aside>
  );
};
