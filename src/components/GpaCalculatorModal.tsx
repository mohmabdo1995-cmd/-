import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { GpaCourse } from '../types';
import { StorageService } from '../services/storage';
import { Calculator, Plus, Trash2, Award, RotateCcw, X } from 'lucide-react';

interface GpaCalculatorModalProps {
  isOpen: boolean;
  onClose: () => void;
}

const GRADE_SCALE = [
  { letter: 'A+', point: 4.0 },
  { letter: 'A', point: 3.75 },
  { letter: 'B+', point: 3.5 },
  { letter: 'B', point: 3.0 },
  { letter: 'C+', point: 2.5 },
  { letter: 'C', point: 2.0 },
  { letter: 'D+', point: 1.5 },
  { letter: 'D', point: 1.0 },
  { letter: 'F', point: 0.0 }
];

export const GpaCalculatorModal: React.FC<GpaCalculatorModalProps> = ({ isOpen, onClose }) => {
  const [courses, setCourses] = useState<GpaCourse[]>([]);
  const [newCourseName, setNewCourseName] = useState('');
  const [newCourseCredits, setNewCourseCredits] = useState<number>(3);
  const [newCourseGrade, setNewCourseGrade] = useState<number>(4.0);

  useEffect(() => {
    if (isOpen) {
      setCourses(StorageService.getGpaCourses());
    }
  }, [isOpen]);

  if (!isOpen) return null;

  const handleAddCourse = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCourseName.trim()) return;

    const matchedGrade = GRADE_SCALE.find(g => g.point === newCourseGrade) || GRADE_SCALE[0];
    const newCourse: GpaCourse = {
      id: 'gpa-' + Date.now(),
      name: newCourseName.trim(),
      credits: Number(newCourseCredits),
      gradePoint: newCourseGrade,
      gradeLetter: matchedGrade.letter
    };

    const updated = [...courses, newCourse];
    setCourses(updated);
    StorageService.saveGpaCourses(updated);

    setNewCourseName('');
    setNewCourseCredits(3);
    setNewCourseGrade(4.0);
  };

  const handleDeleteCourse = (id: string) => {
    const updated = courses.filter(c => c.id !== id);
    setCourses(updated);
    StorageService.saveGpaCourses(updated);
  };

  const handleReset = () => {
    setCourses([]);
    StorageService.saveGpaCourses([]);
  };

  // Calculation
  const totalCredits = courses.reduce((acc, c) => acc + c.credits, 0);
  const totalPoints = courses.reduce((acc, c) => acc + (c.credits * c.gradePoint), 0);
  const gpa = totalCredits > 0 ? (totalPoints / totalCredits).toFixed(2) : '0.00';

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
      <motion.div
        initial={{ scale: 0.95, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        className="w-full max-w-xl glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto"
      >
        <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 flex items-center justify-center">
              <Calculator className="w-6 h-6" />
            </div>
            <div>
              <h3 className="text-xl font-bold font-tajawal text-slate-900 dark:text-white">حاسبة المعدل التراكمي (GPA)</h3>
              <span className="text-xs text-slate-500">حساب الساعات والدرجات التقديرية</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center justify-center"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* GPA Result Display Box */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-emerald-600 via-teal-600 to-indigo-600 text-white mb-6 flex items-center justify-between shadow-lg">
          <div>
            <span className="text-xs text-emerald-100 font-bold block mb-1">المعدل التراكمي المحسوب</span>
            <div className="text-4xl font-extrabold font-mono tracking-tight">{gpa} / 4.00</div>
            <span className="text-xs text-emerald-200 mt-1 block">إجمالي الساعات المعتمدة: {totalCredits} ساعة</span>
          </div>
          <Award className="w-14 h-14 text-emerald-200 opacity-80" />
        </div>

        {/* Add Course Form */}
        <form onSubmit={handleAddCourse} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/60 dark:border-slate-800/60 mb-6 space-y-3">
          <div className="font-bold text-xs text-slate-700 dark:text-slate-300">إضافة مادة جديدة للحساب:</div>
          
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <input
              type="text"
              placeholder="اسم المادة (Anatomy...)"
              value={newCourseName}
              onChange={(e) => setNewCourseName(e.target.value)}
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            <input
              type="number"
              min={1}
              max={6}
              placeholder="الساعات (3)"
              value={newCourseCredits}
              onChange={(e) => setNewCourseCredits(Number(e.target.value))}
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs font-mono focus:ring-2 focus:ring-emerald-500 outline-none"
            />

            <select
              value={newCourseGrade}
              onChange={(e) => setNewCourseGrade(Number(e.target.value))}
              className="px-3.5 py-2.5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-xs focus:ring-2 focus:ring-emerald-500 outline-none"
            >
              {GRADE_SCALE.map((g) => (
                <option key={g.letter} value={g.point}>
                  {g.letter} ({g.point})
                </option>
              ))}
            </select>
          </div>

          <button
            type="submit"
            className="w-full py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold text-xs shadow-md transition-all flex items-center justify-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة إلى قائمة المواد</span>
          </button>
        </form>

        {/* Courses Table */}
        <div className="space-y-2 mb-6">
          <div className="flex items-center justify-between text-xs font-bold text-slate-500 px-2">
            <span>المقررات المضافة ({courses.length})</span>
            {courses.length > 0 && (
              <button onClick={handleReset} className="text-rose-500 hover:underline flex items-center gap-1">
                <RotateCcw className="w-3 h-3" /> إعادة ضبط
              </button>
            )}
          </div>

          {courses.map((course) => (
            <div key={course.id} className="p-3 rounded-xl bg-slate-50 dark:bg-slate-900/40 border border-slate-200/50 dark:border-slate-800/50 flex items-center justify-between text-xs">
              <div>
                <span className="font-bold text-slate-900 dark:text-white block">{course.name}</span>
                <span className="text-slate-500">{course.credits} ساعات معتمدة</span>
              </div>
              <div className="flex items-center gap-3">
                <span className="px-2.5 py-1 rounded-lg bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 font-bold font-mono">
                  {course.gradeLetter} ({course.gradePoint})
                </span>
                <button onClick={() => handleDeleteCourse(course.id)} className="text-slate-400 hover:text-rose-600">
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>

      </motion.div>
    </div>
  );
};
