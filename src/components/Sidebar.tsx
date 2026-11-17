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
  ShieldCheck
} from 'lucide-react';
import { useApp, NavTab } from '../context/AppContext';

export const Sidebar: React.FC = () => {
  const { activeTab, setActiveTab, theme, setTheme, setIsFocusModeActive } = useApp();

  const navItems: { id: NavTab; label: string; icon: React.FC<{ className?: string }>; badge?: string; domId?: string }[] = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'tests', label: 'Tests', icon: FileText, domId: 'tour-tests-nav' },
    { id: 'short-notes', label: 'Short Notes', icon: BookOpen },
    { id: 'focus', label: 'Focus Mode', icon: Timer, badge: 'Zen', domId: 'tour-focus-nav' },
    { id: 'goals', label: 'Goals & Streak', icon: Flame },
    { id: 'exam-info', label: 'Exam Info', icon: Info },
    { id: 'profile', label: 'Profile', icon: User },
    { id: 'settings', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="w-64 flex-shrink-0 flex flex-col justify-between h-screen sticky top-0 border-r border-slate-200 dark:border-[#1D8676]/20 bg-white/95 dark:bg-[#0b0f12]/95 backdrop-blur-md z-30 transition-colors select-none">
      {/* Top Branding Section */}
      <div className="p-5 pb-2">
        <div className="flex items-center gap-3 px-2 py-1 mb-6 cursor-pointer" onClick={() => setActiveTab('home')}>
          <div className="w-9 h-9 rounded-xl bg-[#1D8676] flex items-center justify-center text-white shadow-sm">
            <svg className="w-5 h-5 fill-current" viewBox="0 0 24 24">
              <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
            </svg>
          </div>
          <div>
            <div className="flex items-center gap-1.5">
              <span className="font-extrabold text-xl tracking-tight text-slate-900 dark:text-white">GradeUp</span>
              <span className="text-[10px] px-1.5 py-0.5 rounded font-bold uppercase tracking-wider bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf] border border-[#1D8676]/30">
                PRO
              </span>
            </div>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium">Productivity & Study Vault</p>
          </div>
        </div>

        {/* Quick Focus Button in Sidebar */}
        <button
          onClick={() => setIsFocusModeActive(true)}
          className="w-full mb-4 px-3.5 py-2.5 rounded-xl bg-[#1D8676]/10 dark:bg-[#1D8676]/15 hover:bg-[#1D8676]/20 border border-[#1D8676]/25 dark:border-[#1D8676]/40 text-[#1D8676] dark:text-[#2dd4bf] text-xs font-semibold flex items-center justify-between transition-all group shadow-sm"
        >
          <div className="flex items-center gap-2">
            <Timer className="w-4 h-4 text-[#1D8676] dark:text-[#25a895] group-hover:scale-110 transition-transform" />
            <span>Enter Focus Room</span>
          </div>
          <span className="text-[10px] bg-[#1D8676] text-white px-2 py-0.5 rounded-full font-mono">
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
                id={item.domId}
                onClick={() => setActiveTab(item.id)}
                className={`w-full flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-sm transition-all text-left relative ${
                  isActive
                    ? 'bg-[#1D8676] text-white shadow-sm font-semibold'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100 dark:hover:bg-slate-800/40'
                }`}
              >
                <div className="flex items-center gap-3">
                  <Icon className={`w-4 h-4 transition-transform ${isActive ? 'scale-110 text-white' : 'text-slate-500 dark:text-slate-400'}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold uppercase ${
                    isActive ? 'bg-white/20 text-white' : 'bg-[#1D8676]/10 dark:bg-[#1D8676]/20 text-[#1D8676] dark:text-[#2dd4bf]'
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
      <div className="p-4 border-t border-slate-200 dark:border-[#1D8676]/15 space-y-3">
        {/* Anti-Distraction Shield Indicator */}
        <div className="flex items-center justify-between px-3 py-2 rounded-lg bg-slate-100 dark:bg-slate-900/60 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 text-xs">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-3.5 h-3.5 text-[#1D8676]" />
            <span className="text-[11px]">Distraction Shield</span>
          </div>
          <span className="inline-block w-2 h-2 rounded-full bg-emerald-500" />
        </div>

        {/* Theme Toggle Pill */}
        <div className="flex items-center justify-between px-2 pt-1">
          <span className="text-xs font-medium text-slate-500 dark:text-slate-400">Theme</span>
          <div className="flex items-center bg-slate-100 dark:bg-slate-800/80 p-1 rounded-full border border-slate-200 dark:border-slate-700/60">
            <button
              onClick={() => setTheme('light')}
              title="Light Mode"
              className={`p-1.5 rounded-full transition-all ${
                theme === 'light'
                  ? 'bg-[#1D8676] text-white shadow-sm'
                  : 'text-slate-500 dark:text-slate-400 hover:text-slate-900'
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
                  : 'text-slate-500 dark:text-slate-400 hover:text-white'
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
