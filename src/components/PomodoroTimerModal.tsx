import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Timer, Play, Pause, RotateCcw, X, Sparkles, CheckCircle2 } from 'lucide-react';
import confetti from 'canvas-confetti';

interface PomodoroTimerModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const PomodoroTimerModal: React.FC<PomodoroTimerModalProps> = ({ isOpen, onClose }) => {
  const [secondsLeft, setSecondsLeft] = useState(25 * 60);
  const [isActive, setIsActive] = useState(false);
  const [mode, setMode] = useState<'work' | 'break'>('work');

  useEffect(() => {
    let interval: number | null = null;
    if (isActive && secondsLeft > 0) {
      interval = window.setInterval(() => {
        setSecondsLeft(prev => prev - 1);
      }, 1000);
    } else if (secondsLeft === 0 && isActive) {
      setIsActive(false);
      confetti({ particleCount: 70, spread: 80 });
      if (mode === 'work') {
        alert('أحسنت! انتهت جلسة التركيز 25 دقيقة. يمكنك أخذ استراحة 5 دقائق الآن ☕');
        setMode('break');
        setSecondsLeft(5 * 60);
      } else {
        alert('انتهت الاستراحة! حان وقت العودة لمذاكرة المحاضرات 💪');
        setMode('work');
        setSecondsLeft(25 * 60);
      }
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, secondsLeft, mode]);

  if (!isOpen) return null;

  const toggleTimer = () => setIsActive(!isActive);

  const resetTimer = () => {
    setIsActive(false);
    setSecondsLeft(mode === 'work' ? 25 * 60 : 5 * 60);
  };

  const minutes = Math.floor(secondsLeft / 60);
  const seconds = secondsLeft % 60;
  const formattedTime = `${String(minutes).padStart(2, '0')}:${String(seconds).padStart(2, '0')}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-md glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl text-center"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-2">
            <Timer className="w-6 h-6 text-amber-500" />
            <h3 className="text-xl font-bold font-tajawal text-slate-900 dark:text-white">مؤقت التركيز والدراسة (Pomodoro)</h3>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Mode Selector */}
        <div className="flex items-center justify-center gap-2 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl mb-8">
          <button
            onClick={() => { setMode('work'); setSecondsLeft(25 * 60); setIsActive(false); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'work' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            جلسة مذاكرة (25د)
          </button>
          <button
            onClick={() => { setMode('break'); setSecondsLeft(5 * 60); setIsActive(false); }}
            className={`flex-1 py-2 rounded-xl text-xs font-bold transition-all ${
              mode === 'break' ? 'bg-indigo-600 text-white shadow-sm' : 'text-slate-500'
            }`}
          >
            استراحة (5د)
          </button>
        </div>

        {/* Timer Circle */}
        <div className="relative w-56 h-56 mx-auto mb-8 rounded-full bg-slate-100 dark:bg-slate-900 border-4 border-indigo-500/30 flex items-center justify-center shadow-inner">
          <div>
            <span className="text-5xl font-black font-mono text-slate-900 dark:text-white block tracking-widest">{formattedTime}</span>
            <span className="text-xs font-bold text-slate-500 mt-2 block">
              {mode === 'work' ? '⏱️ وقت المذاكرة والتركيز' : '☕ وقت الاستراحة والراحة'}
            </span>
          </div>
        </div>

        {/* Timer Controls */}
        <div className="flex items-center justify-center gap-4">
          <button
            onClick={toggleTimer}
            className={`px-8 py-3.5 rounded-2xl font-bold text-sm text-white shadow-lg transition-all flex items-center gap-2 ${
              isActive ? 'bg-amber-600 hover:bg-amber-700' : 'bg-indigo-600 hover:bg-indigo-700'
            }`}
          >
            {isActive ? <Pause className="w-5 h-5" /> : <Play className="w-5 h-5" />}
            <span>{isActive ? 'إيقاف مؤقت' : 'بدء التركيز'}</span>
          </button>

          <button
            onClick={resetTimer}
            className="p-3.5 rounded-2xl bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200 transition-all"
            title="إعادة ضبط"
          >
            <RotateCcw className="w-5 h-5" />
          </button>
        </div>

      </motion.div>
    </div>
  );
};
