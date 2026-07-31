import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Subject } from '../types';
import { ArrowRight, BookOpen, Clock, Lightbulb, BookMarked, CheckCircle2, Download, FileText, Send, Sparkles, ChevronDown, ChevronUp } from 'lucide-react';

interface SubjectDetailViewProps {
  subject: Subject;
  onBack: () => void;
}

export const SubjectDetailView: React.FC<SubjectDetailViewProps> = ({ subject, onBack }) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'lectures' | 'tips' | 'books'>('overview');
  const [expandedLecture, setExpandedLecture] = useState<string | null>(null);

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Navigation */}
      <div className="flex items-center justify-between mb-6">
        <button
          onClick={onBack}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-sm transition-all"
        >
          <ArrowRight className="w-4 h-4" />
          <span>الرجوع لقائمة المواد</span>
        </button>

        <span className="text-xs font-mono font-bold px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 border border-indigo-200 dark:border-indigo-800">
          {subject.code}
        </span>
      </div>

      {/* Hero Image & Header Banner */}
      <motion.div
        initial={{ opacity: 0, scale: 0.98 }}
        animate={{ opacity: 1, scale: 1 }}
        className="relative overflow-hidden rounded-3xl mb-8 shadow-2xl border border-slate-200/80 dark:border-slate-800/80"
      >
        <img
          src={subject.image}
          alt={subject.nameAr}
          className="w-full h-64 sm:h-80 object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/60 to-transparent flex flex-col justify-end p-6 sm:p-10 text-white">
          <div className="flex items-center gap-2 text-indigo-400 font-mono text-xs sm:text-sm font-bold mb-2">
            <span>{subject.nameEn}</span>
            <span>•</span>
            <span>{subject.credits} ساعات معتمدة</span>
          </div>

          <h1 className="text-3xl sm:text-5xl font-extrabold font-tajawal mb-2">{subject.nameAr}</h1>
          <p className="text-slate-300 text-sm sm:text-base max-w-2xl leading-relaxed">{subject.description}</p>
        </div>
      </motion.div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-slate-200 dark:border-slate-800 mb-8 overflow-x-auto pb-2 scrollbar-none">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'overview'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          نظرة عامة والمحاور
        </button>

        <button
          onClick={() => setActiveTab('lectures')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'lectures'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          المحاضرات والمواضيع ({subject.lectureTopics.length})
        </button>

        <button
          onClick={() => setActiveTab('tips')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'tips'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          نصائح الدراسة والتميز
        </button>

        <button
          onClick={() => setActiveTab('books')}
          className={`px-5 py-2.5 rounded-xl font-bold text-sm transition-all whitespace-nowrap ${
            activeTab === 'books'
              ? 'bg-indigo-600 text-white shadow-md'
              : 'bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
          }`}
        >
          المراجع والكتب الموصى بها
        </button>
      </div>

      {/* Tab Content Panels */}
      <motion.div
        key={activeTab}
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
        className="space-y-6"
      >
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Overview Box */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800/80">
              <h3 className="text-xl font-bold font-tajawal text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-indigo-500" />
                نبذة عن مقرر {subject.nameAr} ({subject.nameEn})
              </h3>
              <p className="text-slate-700 dark:text-slate-300 leading-relaxed text-base">
                {subject.overview}
              </p>
            </div>

            {/* Key Topics List */}
            <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800/80">
              <h3 className="text-xl font-bold font-tajawal text-slate-900 dark:text-white mb-4 flex items-center gap-2">
                <Sparkles className="w-5 h-5 text-amber-500" />
                المحاور الرئيسية (Key Topics)
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {subject.keyTopics.map((topic, i) => (
                  <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center gap-3">
                    <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0" />
                    <span className="text-slate-800 dark:text-slate-200 font-semibold text-sm">{topic}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {activeTab === 'lectures' && (
          <div className="space-y-4">
            {subject.lectureTopics.map((lec) => {
              const isExpanded = expandedLecture === lec.id;
              return (
                <div
                  key={lec.id}
                  className="rounded-2xl glass-panel border border-slate-200/80 dark:border-slate-800/80 overflow-hidden transition-all"
                >
                  <button
                    onClick={() => setExpandedLecture(isExpanded ? null : lec.id)}
                    className="w-full p-5 text-right flex items-center justify-between gap-4 hover:bg-slate-50/50 dark:hover:bg-slate-900/50 transition-colors"
                  >
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 flex items-center justify-center font-bold text-sm">
                        <FileText className="w-5 h-5" />
                      </div>
                      <div>
                        <h4 className="font-bold text-slate-900 dark:text-white text-base">{lec.titleAr}</h4>
                        <span className="text-xs text-slate-500 font-mono">{lec.titleEn}</span>
                      </div>
                    </div>

                    <div className="flex items-center gap-3">
                      <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-600 dark:text-slate-400 flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5" />
                        {lec.duration}
                      </span>
                      {isExpanded ? <ChevronUp className="w-5 h-5 text-slate-400" /> : <ChevronDown className="w-5 h-5 text-slate-400" />}
                    </div>
                  </button>

                  {isExpanded && (
                    <div className="p-5 bg-slate-50/80 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800/60 text-sm text-slate-700 dark:text-slate-300 leading-relaxed">
                      <p className="font-medium">{lec.summary}</p>
                      
                      <div className="mt-4 pt-4 border-t border-slate-200/40 dark:border-slate-800/40 flex items-center gap-3">
                        <a
                          href="http://t.me/Daleelak_AlJamaei_bot"
                          target="_blank"
                          rel="noopener noreferrer"
                          className="px-4 py-2 rounded-xl bg-indigo-600 text-white font-bold text-xs flex items-center gap-2 hover:bg-indigo-700 transition-all"
                        >
                          <Send className="w-3.5 h-3.5 rotate-180" />
                          طلب مذكرات المحاضرة من التلجرام
                        </a>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}

        {activeTab === 'tips' && (
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-xl font-bold font-tajawal text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <Lightbulb className="w-5 h-5 text-amber-500" />
              أفضل الاستراتيجيات لتحصيل الدرجات العالية في {subject.nameEn}
            </h3>

            <div className="space-y-3">
              {subject.studyTips.map((tip, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-start gap-3">
                  <div className="w-6 h-6 rounded-full bg-indigo-500 text-white flex items-center justify-center font-bold text-xs flex-shrink-0 mt-0.5">
                    {i + 1}
                  </div>
                  <p className="text-slate-700 dark:text-slate-300 font-medium text-sm leading-relaxed">{tip}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {activeTab === 'books' && (
          <div className="p-6 sm:p-8 rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800/80 space-y-4">
            <h3 className="text-xl font-bold font-tajawal text-slate-900 dark:text-white mb-4 flex items-center gap-2">
              <BookMarked className="w-5 h-5 text-indigo-500" />
              المراجع والكتب الموصى بها لمادة {subject.nameEn}
            </h3>

            <div className="space-y-3">
              {subject.recommendedBooks.map((book, i) => (
                <div key={i} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between gap-4">
                  <div className="flex items-center gap-3">
                    <BookOpen className="w-5 h-5 text-indigo-500" />
                    <span className="font-bold font-mono text-slate-900 dark:text-white text-sm">{book}</span>
                  </div>
                  
                  <a
                    href="http://t.me/Daleelak_AlJamaei_bot"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3.5 py-1.5 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-300 text-xs font-bold border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-all flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 rotate-180" />
                    تحميل الكتروني
                  </a>
                </div>
              ))}
            </div>
          </div>
        )}
      </motion.div>

    </div>
  );
};
