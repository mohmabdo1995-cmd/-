import React from 'react';
import { motion } from 'motion/react';
import { ActivePage } from '../types';
import { GraduationCap, BookOpen, CalendarCheck, ArrowLeft, Send, Sparkles, Clock, CheckCircle2, Bookmark, BellRing, ChevronLeft, Zap, Layers } from 'lucide-react';

interface MainDashboardProps {
  onNavigate: (page: ActivePage) => void;
  lectureCount: number;
  upcomingCount: number;
}

export const MainDashboard: React.FC<MainDashboardProps> = ({
  onNavigate,
  lectureCount,
  upcomingCount
}) => {
  const currentDateFormatted = new Date().toLocaleDateString('ar-EG', {
    weekday: 'long',
    day: 'numeric',
    month: 'long'
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 sm:py-10 space-y-8">
      
      {/* Top Welcome Title */}
      <motion.div
        initial={{ opacity: 0, y: -15 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 text-right"
      >
        <div>
          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs mb-1">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>تصميم شبكي تفاعلي • Bento Grid</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-extrabold font-tajawal text-slate-800 dark:text-white tracking-tight">
            لوحة تحكم دليلك الجامعي 🎓
          </h2>
          <p className="text-slate-500 dark:text-slate-400 text-sm mt-1">
            تصفح الخدمات والأقسام الأكاديمية والمحاضرات بأسلوب منظم وسريع
          </p>
        </div>

        <div className="flex items-center gap-2">
          <a
            href="http://t.me/Daleelak_AlJamaei_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="px-5 py-2.5 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-bold text-xs shadow-md shadow-blue-500/20 transition-all flex items-center gap-2"
          >
            <Send className="w-4 h-4 rotate-180" />
            <span>بوت التلجرام الرسمى</span>
          </a>
        </div>
      </motion.div>

      {/* Bento Grid Layout Main Matrix */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
        
        {/* Bento Box 1: Hero & Stats Banner (Col 8) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          className="lg:col-span-8 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-6 sm:p-8 shadow-sm relative overflow-hidden flex flex-col justify-between"
        >
          <div className="absolute top-0 left-0 w-64 h-64 bg-blue-50 dark:bg-blue-950/20 rounded-full -translate-x-20 -translate-y-20 pointer-events-none opacity-60"></div>
          
          <div className="relative z-10">
            <span className="px-4 py-1.5 bg-blue-50 dark:bg-blue-950/60 text-blue-700 dark:text-blue-400 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block border border-blue-200/50 dark:border-blue-800/50">
              مرحباً بك، طالب الكلية
            </span>
            <h3 className="text-2xl sm:text-4xl font-extrabold text-slate-800 dark:text-white leading-tight mb-3 font-tajawal">
              ابدأ رحلتك الأكاديمية <br />
              <span className="text-blue-600 dark:text-blue-400">بذكاء وتنظيم فاخر</span>
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-xl leading-relaxed mb-6">
              منصة شاملة لمتابعة الجداول والكتب والملخصات وتنبيهات المحاضرات الفورية مع ربط التلجرام الحقيقي.
            </p>
          </div>

          {/* Sub-Stats Cards */}
          <div className="grid grid-cols-3 gap-3 sm:gap-4 relative z-10 pt-4 border-t border-slate-100 dark:border-slate-800/80">
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold mb-1">المحاضرات الكلية</p>
              <p className="text-xl sm:text-2xl font-extrabold text-slate-800 dark:text-white font-mono">{lectureCount}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold mb-1">المحاضرات القادمة</p>
              <p className="text-xl sm:text-2xl font-extrabold text-blue-600 dark:text-blue-400 font-mono">{upcomingCount}</p>
            </div>
            <div className="bg-slate-50 dark:bg-slate-800/50 p-3.5 sm:p-4 rounded-2xl border border-slate-100 dark:border-slate-800">
              <p className="text-slate-500 dark:text-slate-400 text-[11px] font-bold mb-1">المواد المقررة</p>
              <p className="text-xl sm:text-2xl font-extrabold text-emerald-600 dark:text-emerald-400 font-mono">6 مواد</p>
            </div>
          </div>
        </motion.div>

        {/* Bento Box 2: Schedule Dark Card (Col 4) */}
        <motion.div
          initial={{ opacity: 0, scale: 0.98 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="lg:col-span-4 bg-slate-900 border border-slate-800 text-white rounded-[2rem] p-6 shadow-xl flex flex-col justify-between"
        >
          <div>
            <div className="flex justify-between items-center mb-5 pb-3 border-b border-slate-800">
              <h3 className="text-white font-bold text-base font-tajawal flex items-center gap-2">
                <Clock className="w-5 h-5 text-blue-400" />
                <span>الجدول الدراسي</span>
              </h3>
              <span className="text-slate-400 text-xs font-mono">{currentDateFormatted}</span>
            </div>

            <div className="space-y-3 mb-6">
              <div className="flex gap-3 items-center p-2.5 rounded-xl bg-slate-800/60 border-r-4 border-blue-500">
                <div className="text-slate-400 text-[11px] font-mono w-14">08:30 ص</div>
                <div>
                  <p className="text-white text-xs font-bold">Anatomy (علم التشريح)</p>
                  <p className="text-blue-300 text-[10px]">المدرج الرئيسي - د. المحاضر</p>
                </div>
              </div>

              <div className="flex gap-3 items-center p-2.5 rounded-xl bg-slate-800/60 border-r-4 border-emerald-500">
                <div className="text-slate-400 text-[11px] font-mono w-14">10:45 ص</div>
                <div>
                  <p className="text-white text-xs font-bold">Physiology (وظائف الأعضاء)</p>
                  <p className="text-emerald-300 text-[10px]">قاعة المحاضرات A3</p>
                </div>
              </div>

              <div className="flex gap-3 items-center p-2.5 rounded-xl bg-slate-800/60 border-r-4 border-amber-500">
                <div className="text-slate-400 text-[11px] font-mono w-14">01:00 م</div>
                <div>
                  <p className="text-white text-xs font-bold">Biochemistry (الكيمياء)</p>
                  <p className="text-amber-300 text-[10px]">المختبر الأكاديمي</p>
                </div>
              </div>
            </div>
          </div>

          <button
            onClick={() => onNavigate('schedule')}
            className="w-full py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-bold transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>عرض وإدارة الجدول الكامل</span>
            <ArrowLeft className="w-4 h-4" />
          </button>
        </motion.div>

      </div>

      {/* Core 3 Main Section Bento Cards Grid - STRICT REQUIREMENT */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        
        {/* Card 1: معلومات عن الكلية والمواد */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.2 }}
          whileHover={{ y: -6, scale: 1.01 }}
          onClick={() => onNavigate('college')}
          className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[2rem] p-7 shadow-sm hover:border-blue-500 dark:hover:border-blue-500 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30 group-hover:scale-110 transition-transform mb-6">
              <GraduationCap className="w-7 h-7 stroke-[2.2]" />
            </div>

            <span className="text-[11px] font-bold text-blue-600 dark:text-blue-400 font-mono uppercase tracking-wider block mb-1">
              القسم الأول
            </span>

            <h3 className="text-xl font-bold font-tajawal text-slate-800 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
              ١. معلومات عن الكلية والمواد
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
              شرح كامل لنظام الكلية، الساعات المعتمدة، التقييم والأكاديميا، ونصائح الطلاب المستجدين لحساب المعدل.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-blue-600 dark:text-blue-400 font-bold text-xs">
            <span>تصفح دليل الكلية</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
          </div>
        </motion.div>

        {/* Card 2: مصادر الدراسة والمقررات */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.3 }}
          whileHover={{ y: -6, scale: 1.01 }}
          onClick={() => onNavigate('resources')}
          className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[2rem] p-7 shadow-sm hover:border-purple-500 dark:hover:border-purple-500 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-purple-600 text-white flex items-center justify-center shadow-lg shadow-purple-500/30 group-hover:scale-110 transition-transform mb-6">
              <BookOpen className="w-7 h-7 stroke-[2.2]" />
            </div>

            <span className="text-[11px] font-bold text-purple-600 dark:text-purple-400 font-mono uppercase tracking-wider block mb-1">
              القسم الثاني
            </span>

            <h3 className="text-xl font-bold font-tajawal text-slate-800 dark:text-white mb-2 group-hover:text-purple-600 dark:group-hover:text-purple-400 transition-colors">
              ٢. مصادر الدراسة والمقررات
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
              مكتبة المقررات (Anatomy, Physiology, Biochemistry, Microbiology, Pathology, Pharmacology) والمراجع الطبية.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-purple-600 dark:text-purple-400 font-bold text-xs">
            <span>فتح المقررات الأكاديمية</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
          </div>
        </motion.div>

        {/* Card 3: التنظيم والتذكير */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.4, delay: 0.4 }}
          whileHover={{ y: -6, scale: 1.01 }}
          onClick={() => onNavigate('schedule')}
          className="group cursor-pointer bg-white dark:bg-slate-900 border border-slate-200/80 dark:border-slate-800 rounded-[2rem] p-7 shadow-sm hover:border-emerald-500 dark:hover:border-emerald-500 transition-all flex flex-col justify-between"
        >
          <div>
            <div className="w-14 h-14 rounded-2xl bg-emerald-600 text-white flex items-center justify-center shadow-lg shadow-emerald-500/30 group-hover:scale-110 transition-transform mb-6">
              <CalendarCheck className="w-7 h-7 stroke-[2.2]" />
            </div>

            <span className="text-[11px] font-bold text-emerald-600 dark:text-emerald-400 font-mono uppercase tracking-wider block mb-1">
              القسم الثالث
            </span>

            <h3 className="text-xl font-bold font-tajawal text-slate-800 dark:text-white mb-2 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors">
              ٣. التنظيم والتذكير
            </h3>

            <p className="text-slate-500 dark:text-slate-400 text-xs leading-relaxed mb-6">
              إدارة جدول المحاضرات التفاعلي، التخزين الدائم، والتنبيهات التلقائية المباشرة بالفيسبوك والمتصفح.
            </p>
          </div>

          <div className="flex items-center justify-between pt-4 border-t border-slate-100 dark:border-slate-800/80 text-emerald-600 dark:text-emerald-400 font-bold text-xs">
            <span>جدول المحاضرات والتنبيهات</span>
            <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
          </div>
        </motion.div>

      </div>

      {/* Secondary Bento Grid Row: Subjects Quick Access & Telegram & Smart Notifications */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-6">
        
        {/* Subjects Bento Grid Card (Col 5) */}
        <div className="md:col-span-5 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center justify-between mb-4">
            <h3 className="font-bold text-slate-800 dark:text-white text-base font-tajawal">المواد الدراسية السريعة</h3>
            <button
              onClick={() => onNavigate('subjects')}
              className="text-blue-600 dark:text-blue-400 text-xs font-bold hover:underline"
            >
              عرض الكل
            </button>
          </div>

          <div className="grid grid-cols-3 gap-3">
            <div onClick={() => onNavigate('subjects')} className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:scale-105 cursor-pointer transition-transform">
              <div className="w-10 h-10 bg-indigo-100 dark:bg-indigo-950/60 rounded-xl flex items-center justify-center text-indigo-600 dark:text-indigo-400 mb-1.5 font-bold font-mono text-xs">An</div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Anatomy</span>
            </div>

            <div onClick={() => onNavigate('subjects')} className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:scale-105 cursor-pointer transition-transform">
              <div className="w-10 h-10 bg-rose-100 dark:bg-rose-950/60 rounded-xl flex items-center justify-center text-rose-600 dark:text-rose-400 mb-1.5 font-bold font-mono text-xs">Ph</div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Physiology</span>
            </div>

            <div onClick={() => onNavigate('subjects')} className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:scale-105 cursor-pointer transition-transform">
              <div className="w-10 h-10 bg-amber-100 dark:bg-amber-950/60 rounded-xl flex items-center justify-center text-amber-600 dark:text-amber-400 mb-1.5 font-bold font-mono text-xs">Bc</div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Biochem</span>
            </div>

            <div onClick={() => onNavigate('subjects')} className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:scale-105 cursor-pointer transition-transform">
              <div className="w-10 h-10 bg-teal-100 dark:bg-teal-950/60 rounded-xl flex items-center justify-center text-teal-600 dark:text-teal-400 mb-1.5 font-bold font-mono text-xs">Mi</div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Microbio</span>
            </div>

            <div onClick={() => onNavigate('subjects')} className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:scale-105 cursor-pointer transition-transform">
              <div className="w-10 h-10 bg-purple-100 dark:bg-purple-950/60 rounded-xl flex items-center justify-center text-purple-600 dark:text-purple-400 mb-1.5 font-bold font-mono text-xs">Pa</div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Pathology</span>
            </div>

            <div onClick={() => onNavigate('subjects')} className="flex flex-col items-center p-3 rounded-2xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800 hover:scale-105 cursor-pointer transition-transform">
              <div className="w-10 h-10 bg-sky-100 dark:bg-sky-950/60 rounded-xl flex items-center justify-center text-sky-600 dark:text-sky-400 mb-1.5 font-bold font-mono text-xs">Pm</div>
              <span className="text-[10px] font-bold text-slate-700 dark:text-slate-300">Pharmaco</span>
            </div>
          </div>
        </div>

        {/* Telegram Bento Card (Col 4) */}
        <a
          href="http://t.me/Daleelak_AlJamaei_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="md:col-span-4 bg-gradient-to-br from-sky-400 to-sky-600 rounded-[2rem] p-6 shadow-lg shadow-sky-100 dark:shadow-none flex flex-col items-center justify-center text-center text-white group cursor-pointer hover:scale-[1.02] transition-transform"
        >
          <div className="w-16 h-16 bg-white/20 rounded-full flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
            <Send className="w-8 h-8 text-white rotate-180" />
          </div>
          <h4 className="text-xl font-bold font-tajawal mb-1">بوت التلجرام الرسمى</h4>
          <p className="text-sky-100 text-xs leading-relaxed max-w-xs">
            تواصل معنا واحصل على الملخصات والتحديثات الأكاديمية مباشرة على التلجرام
          </p>
        </a>

        {/* Smart Notifications Toggle Bento Card (Col 3) */}
        <div className="md:col-span-3 bg-white dark:bg-slate-900 border border-slate-200/90 dark:border-slate-800 rounded-[2rem] p-6 shadow-sm flex flex-col justify-between">
          <div className="flex items-center gap-3 mb-4">
            <div className="w-12 h-12 bg-orange-100 dark:bg-orange-950/60 text-orange-600 dark:text-orange-400 rounded-2xl flex items-center justify-center flex-shrink-0">
              <Zap className="h-6 w-6" />
            </div>
            <div>
              <h4 className="font-bold text-slate-800 dark:text-white text-sm font-tajawal">التنبيهات الذكية</h4>
              <p className="text-[11px] text-slate-500 dark:text-slate-400">مفعلة تلقائياً للمحاضرات</p>
            </div>
          </div>

          <div className="p-3 rounded-2xl bg-emerald-50 dark:bg-emerald-950/50 border border-emerald-200/60 dark:border-emerald-800/60 flex items-center justify-between text-xs font-bold text-emerald-700 dark:text-emerald-300">
            <span>حالة المتصفح</span>
            <span className="flex items-center gap-1">
              <CheckCircle2 className="w-4 h-4" /> نشط
            </span>
          </div>
        </div>

      </div>

    </div>
  );
};
