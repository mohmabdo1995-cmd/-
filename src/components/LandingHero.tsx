import React from 'react';
import { motion } from 'motion/react';
import { GraduationCap, ArrowLeft, Send, Sparkles, BookOpen, Calendar, ShieldCheck, Zap } from 'lucide-react';

interface LandingHeroProps {
  onEnter: () => void;
}

export const LandingHero: React.FC<LandingHeroProps> = ({ onEnter }) => {
  return (
    <div className="relative min-h-[calc(100vh-80px)] flex flex-col justify-center items-center px-4 sm:px-6 lg:px-8 py-12 overflow-hidden bg-grid-pattern">
      
      {/* Background Radial Glow */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 -translate-y-1/2 w-96 h-96 sm:w-[500px] sm:h-[500px] bg-indigo-500/10 dark:bg-indigo-500/20 rounded-full blur-3xl pointer-events-none" />
      <div className="absolute bottom-10 right-10 w-72 h-72 bg-purple-500/10 dark:bg-purple-500/15 rounded-full blur-3xl pointer-events-none" />

      <div className="max-w-4xl mx-auto text-center relative z-10 flex flex-col items-center">
        
        {/* Animated Badge */}
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-50 dark:bg-indigo-950/60 border border-indigo-200/80 dark:border-indigo-800/80 text-indigo-700 dark:text-indigo-300 text-xs sm:text-sm font-bold shadow-sm mb-6"
        >
          <Sparkles className="w-4 h-4 text-amber-500 animate-pulse" />
          <span>الدليل الرقمي الذكي للطلاب الجامعيين</span>
          <span className="bg-indigo-600 text-white text-[10px] px-2 py-0.5 rounded-full font-mono">2026</span>
        </motion.div>

        {/* Main Title - Locked Title: دليلك الجامعي */}
        <motion.h1
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7, delay: 0.1 }}
          className="text-4xl sm:text-6xl md:text-7xl font-extrabold font-tajawal tracking-tight text-slate-900 dark:text-white mb-4 leading-tight"
        >
          دليلك الجامعي
        </motion.h1>

        {/* Concept Tagline - Locked Concept: "جامعتك في جيبك" */}
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.2 }}
          className="text-xl sm:text-3xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 via-purple-600 to-pink-600 dark:from-indigo-400 dark:via-purple-400 dark:to-pink-400 mb-6 font-tajawal"
        >
          &quot;جامعتك في جيبك&quot;
        </motion.div>

        {/* Short Introduction */}
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7, delay: 0.3 }}
          className="text-base sm:text-xl text-slate-600 dark:text-slate-300 max-w-2xl mx-auto leading-relaxed mb-10 font-medium"
        >
          منصة أكاديمية شاملة تُساعد الطلاب المستجدين والجامعيين على التأقلم مع الحياة الأكاديمية، تنظيم المحاضرات، متابعة المقررات، وتلقي التذكيرات المباشرة بأسلوب عصري ومنظم.
        </motion.p>

        {/* Entrance Button - Locked Button Text: دخول */}
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="flex flex-col sm:flex-row items-center gap-4 w-full justify-center mb-14"
        >
          <button
            onClick={onEnter}
            className="group relative inline-flex items-center justify-center gap-3 px-10 py-4 text-lg font-bold text-white bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 rounded-2xl shadow-xl shadow-indigo-600/30 hover:shadow-2xl hover:shadow-indigo-600/50 hover:scale-105 active:scale-95 transition-all duration-300 w-full sm:w-auto"
          >
            <span>دخول</span>
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1.5 transition-transform duration-300" />
            <div className="absolute inset-0 rounded-2xl bg-white/20 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
          </button>

          {/* Direct Telegram Bot Link */}
          <a
            href="http://t.me/Daleelak_AlJamaei_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center justify-center gap-2.5 px-8 py-4 text-base font-bold text-sky-700 dark:text-sky-300 bg-sky-50 dark:bg-sky-950/50 border border-sky-200 dark:border-sky-800 rounded-2xl hover:bg-sky-100 dark:hover:bg-sky-900/60 transition-all duration-200 w-full sm:w-auto"
          >
            <Send className="w-5 h-5 rotate-180 text-sky-500" />
            <span>بوت التلجرام</span>
          </a>
        </motion.div>

        {/* Modern Illustration Graphic / Bento Highlights Grid */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-full grid grid-cols-1 sm:grid-cols-3 gap-5 text-right"
        >
          <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-blue-500 transition-all">
            <div className="p-3.5 rounded-2xl bg-blue-50 dark:bg-blue-950/60 text-blue-600 dark:text-blue-400">
              <BookOpen className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold font-tajawal text-slate-900 dark:text-white text-base mb-1">المعلومات الأكاديمية</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">تفاصيل الكلية والأنظمة والمواد الأساسية في مكان واحد.</p>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-blue-500 transition-all">
            <div className="p-3.5 rounded-2xl bg-purple-50 dark:bg-purple-950/60 text-purple-600 dark:text-purple-400">
              <Calendar className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold font-tajawal text-slate-900 dark:text-white text-base mb-1">جدول المحاضرات</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">إضافة وتعديل وحذف المحاضرات مع التنبيهات التلقائية.</p>
            </div>
          </div>

          <div className="p-6 rounded-[2rem] bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 shadow-sm flex items-start gap-4 hover:border-blue-500 transition-all">
            <div className="p-3.5 rounded-2xl bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400">
              <Zap className="w-6 h-6" />
            </div>
            <div>
              <h3 className="font-bold font-tajawal text-slate-900 dark:text-white text-base mb-1">تنبيهات فورية و PWA</h3>
              <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed">دعم الإشعارات وتصفح التطبيق بدون إنترنت بسهولة.</p>
            </div>
          </div>
        </motion.div>

      </div>
    </div>
  );
};
