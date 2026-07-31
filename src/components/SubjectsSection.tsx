import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { SUBJECTS_DATA } from '../data/academicContent';
import { Subject, SubjectId } from '../types';
import { BookOpen, ArrowLeft, ArrowRight, Search, Sparkles, Activity, HeartPulse, Dna, Bug, Stethoscope, Pill, CheckCircle, FileText, ChevronLeft } from 'lucide-react';
import { SubjectDetailView } from './SubjectDetailView';

interface SubjectsSectionProps {
  onBack: () => void;
  initialSelectedId?: SubjectId;
}

export const SubjectsSection: React.FC<SubjectsSectionProps> = ({ onBack, initialSelectedId }) => {
  const [selectedSubject, setSelectedSubject] = useState<Subject | null>(
    initialSelectedId ? SUBJECTS_DATA.find(s => s.id === initialSelectedId) || null : null
  );
  const [searchQuery, setSearchQuery] = useState('');

  const filteredSubjects = SUBJECTS_DATA.filter(s => 
    s.nameAr.includes(searchQuery) || 
    s.nameEn.toLowerCase().includes(searchQuery.toLowerCase()) ||
    s.description.includes(searchQuery)
  );

  const getIcon = (iconName: string) => {
    switch (iconName) {
      case 'Activity': return <Activity className="w-6 h-6" />;
      case 'HeartPulse': return <HeartPulse className="w-6 h-6" />;
      case 'Dna': return <Dna className="w-6 h-6" />;
      case 'Bug': return <Bug className="w-6 h-6" />;
      case 'Stethoscope': return <Stethoscope className="w-6 h-6" />;
      case 'Pill': return <Pill className="w-6 h-6" />;
      default: return <BookOpen className="w-6 h-6" />;
    }
  };

  if (selectedSubject) {
    return (
      <SubjectDetailView
        subject={selectedSubject}
        onBack={() => setSelectedSubject(null)}
      />
    );
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Header Bar */}
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
            <span>القسم الثاني - المقررات الأكاديمية</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-tajawal text-slate-900 dark:text-white mt-1">
            المواد والدراسة الأكاديمية 📚
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1">
            اختر المادة لتصفح المحاضرات، المفاهيم الأساسية، والمراجع الطبية والعلمية المعتمدة.
          </p>
        </div>

        {/* Search Input */}
        <div className="relative w-full sm:w-80">
          <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="ابحث عن مادة (Anatomy, Physiology...)"
            className="w-full pr-11 pl-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>
      </div>

      {/* Subjects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredSubjects.map((subject, index) => (
          <motion.div
            key={subject.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.4, delay: index * 0.08 }}
            whileHover={{ y: -6, scale: 1.01 }}
            onClick={() => setSelectedSubject(subject)}
            className="group cursor-pointer rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800/80 overflow-hidden hover:border-indigo-500/50 shadow-xl shadow-slate-200/50 dark:shadow-none transition-all duration-300 flex flex-col justify-between"
          >
            <div>
              {/* Subject Image Banner */}
              <div className="relative h-44 w-full overflow-hidden">
                <img
                  src={subject.image}
                  alt={subject.nameAr}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-slate-950 via-slate-950/40 to-transparent" />
                
                {/* Code badge */}
                <div className="absolute top-4 left-4 px-3 py-1 rounded-full bg-slate-900/80 text-white text-xs font-mono font-bold backdrop-blur-md">
                  {subject.code}
                </div>

                {/* Icon Circle */}
                <div className={`absolute bottom-4 right-4 w-12 h-12 rounded-2xl bg-gradient-to-tr ${subject.color} text-white flex items-center justify-center shadow-lg group-hover:scale-110 transition-transform`}>
                  {getIcon(subject.icon)}
                </div>
              </div>

              {/* Subject Info Body */}
              <div className="p-6">
                <div className="flex items-center justify-between mb-2">
                  <h3 className="text-xl font-bold font-tajawal text-slate-900 dark:text-white group-hover:text-indigo-600 dark:group-hover:text-indigo-400 transition-colors">
                    {subject.nameAr}
                  </h3>
                  <span className="text-xs font-bold text-slate-400 font-mono">{subject.nameEn}</span>
                </div>

                <p className="text-slate-600 dark:text-slate-400 text-sm line-clamp-2 leading-relaxed mb-4">
                  {subject.description}
                </p>

                {/* Key Topics tags */}
                <div className="flex flex-wrap gap-1.5 mb-4">
                  {subject.keyTopics.slice(0, 2).map((topic, i) => (
                    <span key={i} className="px-2.5 py-1 rounded-lg bg-slate-100 dark:bg-slate-900 text-slate-600 dark:text-slate-400 text-[11px] font-medium border border-slate-200/50 dark:border-slate-800/50">
                      {topic.split('(')[0]}
                    </span>
                  ))}
                  {subject.keyTopics.length > 2 && (
                    <span className="px-2 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/60 text-indigo-600 dark:text-indigo-400 text-[11px] font-bold">
                      +{subject.keyTopics.length - 2} المزيد
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Footer button */}
            <div className="px-6 py-4 bg-slate-50/80 dark:bg-slate-900/40 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between text-indigo-600 dark:text-indigo-400 font-bold text-xs">
              <span>تصفح مادة {subject.nameEn}</span>
              <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1.5 transition-transform" />
            </div>

          </motion.div>
        ))}
      </div>

    </div>
  );
};
