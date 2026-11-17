import React, { useState, useEffect } from 'react';
import { 
  Timer, 
  Play, 
  Pause, 
  RotateCcw, 
  Volume2, 
  VolumeX, 
  ShieldCheck, 
  X, 
  CloudRain,
  Radio,
  Waves,
  Zap
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { soundEngine } from '../utils/audio';

export const FocusModeModal: React.FC = () => {
  const { 
    isFocusModeActive, 
    setIsFocusModeActive, 
    logFocusMinutes, 
    blockedPopupsCount,
    triggerCelebration,
    setActiveTab
  } = useApp();

  // Mode: 'pomodoro' | 'stopwatch'
  const [timerMode, setTimerMode] = useState<'pomodoro' | 'stopwatch'>('pomodoro');
  const [pomoPhase, setPomoPhase] = useState<'study' | 'break'>('study');
  const [studyDurationMins, setStudyDurationMins] = useState(25);
  const [breakDurationMins, setBreakDurationMins] = useState(5);

  const [secondsRemaining, setSecondsRemaining] = useState(25 * 60);
  const [stopwatchSeconds, setStopwatchSeconds] = useState(0);
  const [isRunning, setIsRunning] = useState(false);
  const [activeSound, setActiveSound] = useState<'none' | 'rain' | 'whitenoise' | 'binaural' | 'waves'>('none');
  const [volume, setVolume] = useState(0.4);

  // Stop any audio immediately when focus mode is turned off or on unmount
  useEffect(() => {
    if (!isFocusModeActive) {
      soundEngine.stop();
      setActiveSound('none');
      setIsRunning(false);
    }
  }, [isFocusModeActive]);

  useEffect(() => {
    return () => {
      soundEngine.stop();
    };
  }, []);

  // Audio effect handler
  useEffect(() => {
    if (!isFocusModeActive || activeSound === 'none') {
      soundEngine.stop();
    } else {
      soundEngine.playSoundscape(activeSound, volume);
    }

    return () => {
      soundEngine.stop();
    };
  }, [activeSound, isFocusModeActive]);

  // Volume change handler
  const handleVolumeChange = (newVol: number) => {
    setVolume(newVol);
    soundEngine.setVolume(newVol);
  };

  // Timer loop
  useEffect(() => {
    if (!isFocusModeActive || !isRunning) return;

    const interval = setInterval(() => {
      if (timerMode === 'pomodoro') {
        setSecondsRemaining((prev) => {
          if (prev <= 1) {
            // Phase transition
            soundEngine.playChime();
            if (pomoPhase === 'study') {
              logFocusMinutes(studyDurationMins);
              triggerCelebration();
              setPomoPhase('break');
              return breakDurationMins * 60;
            } else {
              setPomoPhase('study');
              return studyDurationMins * 60;
            }
          }
          return prev - 1;
        });
      } else {
        setStopwatchSeconds((prev) => prev + 1);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isFocusModeActive, isRunning, timerMode, pomoPhase, studyDurationMins, breakDurationMins]);

  if (!isFocusModeActive) return null;

  const formatSeconds = (totalSecs: number) => {
    const mins = Math.floor(totalSecs / 60);
    const secs = totalSecs % 60;
    return `${mins.toString().padStart(2, '0')}:${secs.toString().padStart(2, '0')}`;
  };

  const handleReset = () => {
    setIsRunning(false);
    if (timerMode === 'pomodoro') {
      setSecondsRemaining((pomoPhase === 'study' ? studyDurationMins : breakDurationMins) * 60);
    } else {
      setStopwatchSeconds(0);
    }
  };

  const handleExit = () => {
    // If user has studied some stopwatch time or partial session, log it
    if (timerMode === 'stopwatch' && stopwatchSeconds > 60) {
      logFocusMinutes(Math.floor(stopwatchSeconds / 60));
    }
    // Hard stop all audio oscillators
    soundEngine.stop();
    setActiveSound('none');
    setIsRunning(false);
    setIsFocusModeActive(false);
    setActiveTab('home');
  };

  return (
    <div className="fixed inset-0 z-50 bg-[#070b0d] text-white flex flex-col justify-between p-6 sm:p-10 select-none animate-in fade-in duration-300">
      {/* Light subtle aurora glow overlay */}
      <div className="aurora-bg" />

      {/* Top Bar: Distraction Blocker Badge & Exit Button */}
      <header className="relative z-10 flex items-center justify-between">
        {/* Anti-Distraction Shield */}
        <div className="flex items-center gap-2.5 px-4 py-2 rounded-full bg-[#1D8676]/15 border border-[#1D8676]/40 text-[#2dd4bf] text-xs font-semibold backdrop-blur-md">
          <ShieldCheck className="w-4 h-4 text-[#2dd4bf]" />
          <span>Distraction Shield Active</span>
          <span className="text-[10px] bg-[#1D8676]/40 px-2 py-0.5 rounded-full font-mono text-white">
            {blockedPopupsCount} Popups Blocked
          </span>
        </div>

        {/* Exit Focus Mode Button */}
        <button
          onClick={handleExit}
          className="flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 text-xs font-semibold transition-all backdrop-blur-md group"
        >
          <span>Exit Focus Mode</span>
          <X className="w-4 h-4 group-hover:rotate-90 transition-transform" />
        </button>
      </header>

      {/* Center: Clean & Comfortable Timer Room */}
      <main className="relative z-10 max-w-lg w-full mx-auto text-center space-y-8 my-auto">
        {/* Mode Switcher Tabs */}
        <div className="inline-flex p-1 rounded-2xl bg-slate-900/80 border border-slate-800 backdrop-blur-md">
          <button
            onClick={() => {
              setTimerMode('pomodoro');
              setIsRunning(false);
              setSecondsRemaining(studyDurationMins * 60);
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              timerMode === 'pomodoro'
                ? 'bg-[#1D8676] text-white shadow-md shadow-[#1D8676]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Pomodoro Timer
          </button>
          <button
            onClick={() => {
              setTimerMode('stopwatch');
              setIsRunning(false);
            }}
            className={`px-5 py-2 rounded-xl text-xs font-bold transition-all ${
              timerMode === 'stopwatch'
                ? 'bg-[#1D8676] text-white shadow-md shadow-[#1D8676]/40'
                : 'text-slate-400 hover:text-white'
            }`}
          >
            Open Stopwatch
          </button>
        </div>

        {/* Pomodoro Preset Selector */}
        {timerMode === 'pomodoro' && (
          <div className="flex items-center justify-center gap-2">
            {[
              { label: '25m Focus / 5m Break', study: 25, brk: 5 },
              { label: '50m Deep / 10m Break', study: 50, brk: 10 }
            ].map((p, idx) => (
              <button
                key={idx}
                onClick={() => {
                  setStudyDurationMins(p.study);
                  setBreakDurationMins(p.brk);
                  setSecondsRemaining(p.study * 60);
                  setIsRunning(false);
                }}
                className={`px-3 py-1 rounded-lg text-xs font-semibold transition-all ${
                  studyDurationMins === p.study
                    ? 'bg-[#1D8676]/25 border border-[#1D8676] text-[#2dd4bf]'
                    : 'bg-slate-900/50 border border-slate-800 text-slate-400 hover:text-slate-200'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        )}

        {/* Big Aesthetic Digits Display */}
        <div className="relative py-4">
          <div className="text-7xl sm:text-9xl font-extrabold font-mono tracking-tight text-white drop-shadow-[0_0_35px_rgba(29,134,118,0.3)]">
            {timerMode === 'pomodoro' ? formatSeconds(secondsRemaining) : formatSeconds(stopwatchSeconds)}
          </div>
          <div className="text-sm font-semibold tracking-widest uppercase text-[#2dd4bf] mt-2">
            {timerMode === 'pomodoro'
              ? pomoPhase === 'study' ? 'Deep Study Flow' : 'Restorative Break'
              : 'Continuous Study Clock'}
          </div>
        </div>

        {/* Primary Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={() => setIsRunning(!isRunning)}
            className="w-16 h-16 rounded-full bg-[#1D8676] hover:bg-[#176f62] text-white flex items-center justify-center shadow-lg shadow-[#1D8676]/40 transition-all hover:scale-105 active:scale-95"
            title={isRunning ? 'Pause' : 'Start'}
          >
            {isRunning ? <Pause className="w-7 h-7 fill-white" /> : <Play className="w-7 h-7 fill-white ml-1" />}
          </button>

          <button
            onClick={handleReset}
            className="w-12 h-12 rounded-full bg-slate-900/80 hover:bg-slate-800 text-slate-300 hover:text-white border border-slate-700/60 flex items-center justify-center transition-all"
            title="Reset"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>
      </main>

      {/* Bottom Audio Soundscapes Bar */}
      <footer className="relative z-10 max-w-2xl w-full mx-auto bg-slate-900/70 border border-[#1D8676]/30 rounded-2xl p-4 backdrop-blur-md flex flex-wrap items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs font-bold text-slate-300 uppercase tracking-wider flex items-center gap-1.5 mr-2">
            <Volume2 className="w-4 h-4 text-[#2dd4bf]" />
            <span>Soundscape:</span>
          </span>

          {[
            { id: 'none', label: 'Mute', icon: VolumeX },
            { id: 'rain', label: 'Rain', icon: CloudRain },
            { id: 'whitenoise', label: 'Noise', icon: Radio },
            { id: 'binaural', label: '40Hz Gamma', icon: Zap },
            { id: 'waves', label: 'Waves', icon: Waves }
          ].map((snd) => {
            const Icon = snd.icon;
            const isSelected = activeSound === snd.id;
            return (
              <button
                key={snd.id}
                onClick={() => setActiveSound(snd.id as any)}
                className={`px-2.5 py-1.5 rounded-xl text-xs font-medium flex items-center gap-1.5 transition-all ${
                  isSelected
                    ? 'bg-[#1D8676] text-white font-bold shadow-sm'
                    : 'bg-slate-800/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{snd.label}</span>
              </button>
            );
          })}
        </div>

        {/* Volume Slider */}
        {activeSound !== 'none' && (
          <div className="flex items-center gap-2 text-xs text-slate-400">
            <span className="text-[10px]">Vol</span>
            <input
              type="range"
              min="0"
              max="1"
              step="0.05"
              value={volume}
              onChange={(e) => handleVolumeChange(parseFloat(e.target.value))}
              className="w-20 accent-[#1D8676]"
            />
          </div>
        )}
      </footer>
    </div>
  );
};
