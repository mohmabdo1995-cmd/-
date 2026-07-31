import React from 'react';
import { motion } from 'motion/react';
import { COLLEGE_INFO } from '../data/academicContent';
import { GraduationCap, BookOpen, CheckCircle2, Award, Clock, ArrowRight, Lightbulb } from 'lucide-react';

interface CollegeInfoSectionProps {
  onBack: () => void;
  onNavigateToSubjects: () => void;
}

export const CollegeInfoSection: React.FC<CollegeInfoSectionProps> = ({
  onBack,
  onNavigateToSubjects
}) => {
  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Back Button & Top Navigation */}
      <div className="flex items-center justify-between mb-8">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع للرئيسية</span>
        </button>

        <span className="text-xs font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/70 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          القسم الأول
        </span>
      </div>

      {/* College Hero Image & Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-3xl mb-10 shadow-2xl border border-slate-200/80 dark:border-slate-800/80"
      >
        <img
          src={COLLEGE_INFO.image}
          alt={COLLEGE_INFO.title}
          className="w-full h-64 sm:h-96 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-lg bg-indigo-600/80 text-white text-xs font-bold w-fit mb-3 backdrop-blur-md">
            <GraduationCap className="w-4 h-4" />
            <span>جامعتك في جيبك</span>
          </div>
          <h1 className="text-3xl sm:text-5xl font-extrabold font-tajawal mb-2">{COLLEGE_INFO.title}</h1>
          <p className="text-slate-200 text-sm sm:text-base max-w-2xl font-medium">{COLLEGE_INFO.tagline}</p>
        </div>
      </motion.div>

      {/* Main Content Sections - natural scrollable content */}
      <div className="space-y-8">
        
        {/* Overview Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800/80"
        >
          <h2 className="text-xl sm:text-2xl font-bold font-tajawal text-slate-900 dark:text-white mb-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400">
              <BookOpen className="w-6 h-6" />
            </div>
            نظرة عامة عن الدراسة والكلية
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
            {COLLEGE_INFO.overview}
          </p>
        </motion.div>

        {/* Credit System Box */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800/80"
        >
          <h2 className="text-xl sm:text-2xl font-bold font-tajawal text-slate-900 dark:text-white mb-4 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-purple-500/10 text-purple-600 dark:text-purple-400">
              <Clock className="w-6 h-6" />
            </div>
            نظام الدراسة والتقييم الأكاديمي
          </h2>
          <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base sm:text-lg">
            {COLLEGE_INFO.creditSystem}
          </p>
        </motion.div>

        {/* Freshman Survival Tips */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800/80"
        >
          <h2 className="text-xl sm:text-2xl font-bold font-tajawal text-slate-900 dark:text-white mb-6 flex items-center gap-3">
            <div className="p-2.5 rounded-xl bg-amber-500/10 text-amber-600 dark:text-amber-400">
              <Lightbulb className="w-6 h-6" />
            </div>
            نصائح توجيهية للطلاب المستجدين
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {COLLEGE_INFO.survivalTips.map((tip, idx) => (
              <div key={idx} className="p-5 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60">
                <div className="flex items-center gap-2 font-bold text-slate-900 dark:text-white mb-2">
                  <CheckCircle2 className="w-5 h-5 text-indigo-500 flex-shrink-0" />
                  <h4>{tip.title}</h4>
                </div>
                <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed">
                  {tip.description}
                </p>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Call to action to Section 2 (المواد) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="p-6 rounded-3xl bg-gradient-to-r from-indigo-600 to-purple-600 text-white flex flex-col sm:flex-row items-center justify-between gap-4"
        >
          <div className="flex items-center gap-4">
            <Award className="w-10 h-10 text-amber-300" />
            <div>
              <h3 className="font-bold font-tajawal text-lg">هل أنت جاهز لاستكشاف المقررات الدراسية؟</h3>
              <p className="text-xs text-indigo-100">استعرض مواد Anatomy, Physiology, Biochemistry وغيرها بالتفصيل.</p>
            </div>
          </div>

          <button
            onClick={onNavigateToSubjects}
            className="px-6 py-3 rounded-2xl bg-white text-indigo-700 font-bold text-sm hover:bg-indigo-50 transition-all shadow-md active:scale-95 whitespace-nowrap"
          >
            الانتقال إلى مصادر والمواد
          </button>
        </motion.div>

      </div>
    </div>
  );
};
