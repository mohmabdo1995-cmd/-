import React, { useState } from 'react';
import { motion } from 'motion/react';
import { STUDY_RESOURCES } from '../data/academicContent';
import { StudyResource } from '../types';
import { BookOpen, Send, Video, FileText, ExternalLink, ArrowRight, Sparkles, Download, Layers } from 'lucide-react';

interface StudyResourcesSectionProps {
  onBack: () => void;
  onNavigateToSubject: (subjectId: string) => void;
}

export const StudyResourcesSection: React.FC<StudyResourcesSectionProps> = ({ onBack, onNavigateToSubject }) => {
  const [filterCategory, setFilterCategory] = useState<string>('all');

  const filteredResources = STUDY_RESOURCES.filter(res => 
    filterCategory === 'all' || res.category === filterCategory
  );

  const getCategoryIcon = (cat: string) => {
    switch (cat) {
      case 'telegram': return <Send className="w-5 h-5 text-sky-500 rotate-180" />;
      case 'book': return <BookOpen className="w-5 h-5 text-indigo-500" />;
      case 'video': return <Video className="w-5 h-5 text-rose-500" />;
      case 'notes': return <FileText className="w-5 h-5 text-amber-500" />;
      default: return <Layers className="w-5 h-5 text-purple-500" />;
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-8">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all mb-4"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الرجوع للرئيسية</span>
          </button>

          <div className="flex items-center gap-2 text-indigo-600 dark:text-indigo-400 font-bold text-sm">
            <Sparkles className="w-4 h-4 text-amber-500" />
            <span>القسم الثاني - مصادر الدراسة والكتب</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-tajawal text-slate-900 dark:text-white mt-1">
            مصادر الدراسة والمكتبة الرقمية 📖
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1">
            مجموعة مختارة من أفضل المراجع العلمية، البوتات التعليمية، والمذكرات الملخصة.
          </p>
        </div>

        {/* Prominent Telegram Button */}
        <a
          href="http://t.me/Daleelak_AlJamaei_bot"
          target="_blank"
          rel="noopener noreferrer"
          className="px-6 py-3.5 rounded-2xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-sm shadow-lg shadow-sky-500/25 flex items-center gap-2 active:scale-95 transition-all"
        >
          <Send className="w-5 h-5 rotate-180" />
          <span>فتح بوت التلجرام</span>
        </a>
      </div>

      {/* Main Telegram Banner */}
      <motion.div
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        className="p-6 sm:p-8 rounded-3xl glass-panel border border-sky-200 dark:border-sky-800/80 mb-10 relative overflow-hidden bg-gradient-to-r from-sky-500/10 via-indigo-500/5 to-transparent"
      >
        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="flex items-center gap-4 text-right">
            <div className="w-16 h-16 rounded-2xl bg-sky-500 text-white flex items-center justify-center shadow-lg shadow-sky-500/30 flex-shrink-0">
              <Send className="w-8 h-8 rotate-180" />
            </div>
            <div>
              <span className="text-xs font-bold text-sky-600 dark:text-sky-400">البوت الأكاديمي الشامل</span>
              <h2 className="text-2xl font-bold font-tajawal text-slate-900 dark:text-white mt-0.5">
                بوت التلجرام: @Daleelak_AlJamaei_bot
              </h2>
              <p className="text-slate-600 dark:text-slate-400 text-sm mt-1 leading-relaxed max-w-2xl">
                احصل على التجميعات المعتمدة، ملخصات المواد (Anatomy, Physiology, Biochemistry, Microbiology, Pathology, Pharmacology)، وأسئلة الامتحانات السابقة فورياً.
              </p>
            </div>
          </div>

          <a
            href="http://t.me/Daleelak_AlJamaei_bot"
            target="_blank"
            rel="noopener noreferrer"
            className="w-full md:w-auto px-8 py-4 rounded-2xl bg-sky-500 hover:bg-sky-600 text-white font-bold text-base shadow-lg transition-all text-center whitespace-nowrap active:scale-95 flex items-center justify-center gap-2"
          >
            <span>انتقال للبوت الآن</span>
            <ExternalLink className="w-4 h-4" />
          </a>
        </div>
      </motion.div>

      {/* Filter Categories */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 pb-4 mb-8 overflow-x-auto scrollbar-none">
        <button
          onClick={() => setFilterCategory('all')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            filterCategory === 'all'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          جميع المصادر
        </button>

        <button
          onClick={() => setFilterCategory('telegram')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            filterCategory === 'telegram'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          بوت التلجرام
        </button>

        <button
          onClick={() => setFilterCategory('book')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            filterCategory === 'book'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          الأطلس والكتب
        </button>

        <button
          onClick={() => setFilterCategory('video')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            filterCategory === 'video'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          الشروحات والمرئيات
        </button>

        <button
          onClick={() => setFilterCategory('notes')}
          className={`px-4 py-2 rounded-xl font-bold text-xs sm:text-sm transition-all ${
            filterCategory === 'notes'
              ? 'bg-indigo-600 text-white shadow-sm'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400'
          }`}
        >
          الملخصات وبنك الأسئلة
        </button>
      </div>

      {/* Resources Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {filteredResources.map((res, index) => (
          <motion.div
            key={res.id}
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="p-6 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800/80 hover:border-indigo-500/50 transition-all flex flex-col justify-between"
          >
            <div>
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 rounded-2xl bg-slate-100 dark:bg-slate-900 border border-slate-200/50 dark:border-slate-800/50">
                    {getCategoryIcon(res.category)}
                  </div>
                  <div>
                    <h3 className="font-bold font-tajawal text-slate-900 dark:text-white text-lg">
                      {res.title}
                    </h3>
                    <span className="text-xs text-indigo-600 dark:text-indigo-400 font-mono">
                      {res.subjectId === 'general' ? 'جميع المقررات' : res.subjectId}
                    </span>
                  </div>
                </div>
              </div>

              <p className="text-slate-600 dark:text-slate-400 text-sm leading-relaxed mb-6">
                {res.description}
              </p>
            </div>

            <div className="pt-4 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
              <a
                href={res.link}
                target={res.isExternal ? '_blank' : '_self'}
                rel="noopener noreferrer"
                className="px-4 py-2 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs flex items-center gap-2 shadow-md transition-all active:scale-95"
              >
                <span>الانتقال للمصدر</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </a>

              {res.subjectId !== 'general' && (
                <button
                  onClick={() => onNavigateToSubject(res.subjectId)}
                  className="text-xs font-bold text-slate-500 hover:text-indigo-600 transition-colors"
                >
                  استعراض المادة →
                </button>
              )}
            </div>
          </motion.div>
        ))}
      </div>

    </div>
  );
};
