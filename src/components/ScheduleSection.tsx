import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Lecture } from '../types';
import { StorageService } from '../services/storage';
import { NotificationService } from '../services/notifications';
import { 
  Calendar, Plus, Trash2, Edit3, CheckCircle2, Clock, MapPin, User, Search, 
  Filter, Bell, BellOff, Sparkles, AlertCircle, ArrowRight, Check, Play, Volume2 
} from 'lucide-react';
import confetti from 'canvas-confetti';

interface ScheduleSectionProps {
  onBack: () => void;
  openAddModalInitially?: boolean;
}

const DAYS_OF_WEEK = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const SUBJECT_OPTIONS = ['Anatomy', 'Physiology', 'Biochemistry', 'Microbiology', 'Pathology', 'Pharmacology', 'عام / مقرر آخر'];

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ onBack, openAddModalInitially = false }) => {
  const [lectures, setLectures] = useState<Lecture[]>([]);
  const [filterTab, setFilterTab] = useState<'all' | 'today' | 'upcoming' | 'past'>('all');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSubjectFilter, setSelectedSubjectFilter] = useState<string>('all');
  
  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(openAddModalInitially);
  const [editingLecture, setEditingLecture] = useState<Lecture | null>(null);

  // Notification Permission State
  const [notifPermission, setNotifPermission] = useState<NotificationPermission>(
    NotificationService.getPermissionState()
  );

  // Form Fields
  const [formTitle, setFormTitle] = useState('');
  const [formSubject, setFormSubject] = useState(SUBJECT_OPTIONS[0]);
  const [formProfessor, setFormProfessor] = useState('');
  const [formHall, setFormHall] = useState('');
  const [formDate, setFormDate] = useState(new Date().toISOString().split('T')[0]);
  const [formTime, setFormTime] = useState('09:00');
  const [formDayOfWeek, setFormDayOfWeek] = useState(DAYS_OF_WEEK[0]);
  const [formNotes, setFormNotes] = useState('');
  const [formPriority, setFormPriority] = useState<'high' | 'medium' | 'low'>('medium');
  const [formNotifEnabled, setFormNotifEnabled] = useState(true);

  // Load lectures from persistent storage on mount
  useEffect(() => {
    loadLectures();
  }, []);

  const loadLectures = () => {
    const data = StorageService.getLectures();
    setLectures(data);
  };

  const handleRequestNotifPermission = async () => {
    const granted = await NotificationService.requestPermission();
    setNotifPermission(NotificationService.getPermissionState());
    if (granted) {
      NotificationService.sendNotification('تم تفعيل التنبيهات بنجاح 🔔', {
        body: 'ستتلقى إشعارات فورية بمواعيد المحاضرات الأكاديمية.'
      });
      confetti({ particleCount: 50, spread: 60 });
    }
  };

  const resetForm = () => {
    setFormTitle('');
    setFormSubject(SUBJECT_OPTIONS[0]);
    setFormProfessor('');
    setFormHall('');
    setFormDate(new Date().toISOString().split('T')[0]);
    setFormTime('09:00');
    setFormDayOfWeek(DAYS_OF_WEEK[0]);
    setFormNotes('');
    setFormPriority('medium');
    setFormNotifEnabled(true);
    setEditingLecture(null);
  };

  const handleOpenAddModal = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleOpenEditModal = (lec: Lecture) => {
    setEditingLecture(lec);
    setFormTitle(lec.title);
    setFormSubject(lec.subject);
    setFormProfessor(lec.professor || '');
    setFormHall(lec.hall || '');
    setFormDate(lec.date);
    setFormTime(lec.time);
    setFormDayOfWeek(lec.dayOfWeek);
    setFormNotes(lec.notes || '');
    setFormPriority(lec.priority);
    setFormNotifEnabled(lec.notificationEnabled);
    setIsModalOpen(true);
  };

  const handleSaveLecture = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formTitle.trim()) return;

    if (editingLecture) {
      const updated: Lecture = {
        ...editingLecture,
        title: formTitle.trim(),
        subject: formSubject,
        professor: formProfessor.trim(),
        hall: formHall.trim(),
        date: formDate,
        time: formTime,
        dayOfWeek: formDayOfWeek,
        notes: formNotes.trim(),
        priority: formPriority,
        notificationEnabled: formNotifEnabled
      };
      StorageService.updateLecture(updated);
    } else {
      StorageService.addLecture({
        title: formTitle.trim(),
        subject: formSubject,
        professor: formProfessor.trim(),
        hall: formHall.trim(),
        date: formDate,
        time: formTime,
        dayOfWeek: formDayOfWeek,
        notes: formNotes.trim(),
        priority: formPriority,
        completed: false,
        notificationEnabled: formNotifEnabled
      });
    }

    loadLectures();
    setIsModalOpen(false);
    resetForm();
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleDeleteLecture = (id: string) => {
    if (confirm('هل أنت تأكد من رغبتك في حذف هذه المحاضرة؟')) {
      StorageService.deleteLecture(id);
      loadLectures();
    }
  };

  const handleToggleCompleted = (id: string) => {
    StorageService.toggleLectureCompleted(id);
    loadLectures();
  };

  const handleTestNotification = (lec: Lecture) => {
    NotificationService.notifyLectureDue(lec);
  };

  // Filter Logic
  const todayStr = new Date().toISOString().split('T')[0];

  const filteredLectures = lectures.filter(lec => {
    // Search
    const matchesSearch = 
      lec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      lec.subject.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (lec.professor && lec.professor.toLowerCase().includes(searchQuery.toLowerCase())) ||
      (lec.hall && lec.hall.toLowerCase().includes(searchQuery.toLowerCase()));

    if (!matchesSearch) return false;

    // Subject Filter
    if (selectedSubjectFilter !== 'all' && lec.subject !== selectedSubjectFilter) {
      return false;
    }

    // Tab Filter
    if (filterTab === 'today') {
      return lec.date === todayStr;
    }
    if (filterTab === 'upcoming') {
      return lec.date >= todayStr && !lec.completed;
    }
    if (filterTab === 'past') {
      return lec.date < todayStr || lec.completed;
    }

    return true;
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
      
      {/* Top Header & Navigation */}
      <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 mb-8">
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
            <span>القسم الثالث - التنظيم والتذكير</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-tajawal text-slate-900 dark:text-white mt-1">
            جدول المحاضرات والتذكيرات 🗓️
          </h1>
          <p className="text-slate-600 dark:text-slate-400 text-sm sm:text-base mt-1">
            إدارة كاملة لمواعيد محاضراتك الأكاديمية مع التنبيهات الفورية والتخزين الدائم.
          </p>
        </div>

        {/* Action Controls */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          {notifPermission !== 'granted' && (
            <button
              onClick={handleRequestNotifPermission}
              className="flex-1 md:flex-none px-4 py-3 rounded-2xl bg-amber-50 dark:bg-amber-950/60 border border-amber-200 dark:border-amber-800 text-amber-800 dark:text-amber-300 font-bold text-xs flex items-center justify-center gap-2 hover:bg-amber-100 transition-all shadow-sm"
            >
              <Bell className="w-4 h-4 text-amber-600 animate-bounce" />
              <span>تفعيل التنبيهات</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-indigo-600 via-indigo-500 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-indigo-600/30 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>إضافة محاضرة جديدة</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        
        {/* Tabs */}
        <div className="md:col-span-7 flex items-center gap-1 bg-slate-100 dark:bg-slate-900 p-1.5 rounded-2xl border border-slate-200/60 dark:border-slate-800/60 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 min-w-[90px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterTab === 'all'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            الكل ({lectures.length})
          </button>

          <button
            onClick={() => setFilterTab('today')}
            className={`flex-1 min-w-[90px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterTab === 'today'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            محاضرات اليوم
          </button>

          <button
            onClick={() => setFilterTab('upcoming')}
            className={`flex-1 min-w-[90px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterTab === 'upcoming'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            القادمة
          </button>

          <button
            onClick={() => setFilterTab('past')}
            className={`flex-1 min-w-[90px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterTab === 'past'
                ? 'bg-white dark:bg-slate-800 text-indigo-600 dark:text-indigo-400 shadow-sm'
                : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
            }`}
          >
            السابقة / المنتهية
          </button>
        </div>

        {/* Search Input */}
        <div className="md:col-span-5 relative">
          <Search className="w-5 h-5 absolute right-3.5 top-1/2 -translate-y-1/2 text-slate-400" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="بحث بالاسم، المادة، الدكتور، أو المدرج..."
            className="w-full pr-11 pl-4 py-3 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all shadow-sm"
          />
        </div>

      </div>

      {/* Lectures List */}
      {filteredLectures.length === 0 ? (
        <div className="p-12 text-center rounded-3xl glass-panel border border-slate-200/80 dark:border-slate-800/80 my-8">
          <Calendar className="w-16 h-16 text-slate-300 dark:text-slate-700 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-tajawal text-slate-800 dark:text-slate-200 mb-2">لا توجد محاضرات في هذا العرض</h3>
          <p className="text-slate-500 text-sm mb-6">قم بإضافة محاضرة جديدة أو تغيير خيارات البحث والتصفية.</p>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-3 rounded-xl bg-indigo-600 text-white font-bold text-sm shadow-md hover:bg-indigo-700 transition-all inline-flex items-center gap-2"
          >
            <Plus className="w-4 h-4" />
            <span>إضافة محاضرة جديدة</span>
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <AnimatePresence>
            {filteredLectures.map((lec) => (
              <motion.div
                key={lec.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.9 }}
                className={`p-6 rounded-3xl glass-panel border ${
                  lec.completed
                    ? 'opacity-65 border-slate-200/40 dark:border-slate-800/40 bg-slate-50/50 dark:bg-slate-900/30'
                    : lec.date === todayStr
                    ? 'border-indigo-500/60 dark:border-indigo-500/60 shadow-lg shadow-indigo-500/10'
                    : 'border-slate-200/80 dark:border-slate-800/80'
                } transition-all duration-300 flex flex-col justify-between`}
              >
                <div>
                  {/* Top Subject Tag & Options */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-indigo-50 dark:bg-indigo-950/80 text-indigo-600 dark:text-indigo-400 font-bold text-xs border border-indigo-200/50 dark:border-indigo-800/50">
                        {lec.subject}
                      </span>

                      {lec.priority === 'high' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 font-bold text-[10px]">
                          مهمة جداً 🔥
                        </span>
                      )}

                      {lec.date === todayStr && (
                        <span className="px-2.5 py-0.5 rounded-full bg-amber-500 text-white font-bold text-[10px] animate-pulse">
                          اليوم 📍
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTestNotification(lec)}
                        title="تجربة إشعار التذكير"
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(lec)}
                        title="تعديل المحاضرة"
                        className="p-2 rounded-xl text-slate-400 hover:text-indigo-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteLecture(lec.id)}
                        title="حذف المحاضرة"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lecture Title */}
                  <h3 className={`text-xl font-bold font-tajawal mb-4 ${lec.completed ? 'line-through text-slate-400' : 'text-slate-900 dark:text-white'}`}>
                    {lec.title}
                  </h3>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-medium text-slate-600 dark:text-slate-400">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40">
                      <Clock className="w-4 h-4 text-indigo-500" />
                      <span className="font-mono font-bold text-slate-800 dark:text-slate-200">{lec.time}</span>
                      <span>({lec.dayOfWeek})</span>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40">
                      <Calendar className="w-4 h-4 text-purple-500" />
                      <span className="font-mono">{lec.date}</span>
                    </div>

                    {lec.professor && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 col-span-2 sm:col-span-1">
                        <User className="w-4 h-4 text-amber-500" />
                        <span className="truncate">{lec.professor}</span>
                      </div>
                    )}

                    {lec.hall && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-slate-50 dark:bg-slate-900/60 border border-slate-200/40 dark:border-slate-800/40 col-span-2 sm:col-span-1">
                        <MapPin className="w-4 h-4 text-rose-500" />
                        <span className="truncate">{lec.hall}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {lec.notes && (
                    <div className="p-3 rounded-xl bg-slate-100/70 dark:bg-slate-900/40 text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed">
                      <strong className="text-slate-800 dark:text-slate-200 block mb-1">ملاحظات:</strong>
                      {lec.notes}
                    </div>
                  )}
                </div>

                {/* Footer Complete Button */}
                <div className="pt-3 border-t border-slate-200/60 dark:border-slate-800/60 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleCompleted(lec.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      lec.completed
                        ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-600 dark:text-emerald-400 border border-emerald-200 dark:border-emerald-800'
                        : 'bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 hover:bg-slate-200'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${lec.completed ? 'text-emerald-500' : 'text-slate-400'}`} />
                    <span>{lec.completed ? 'تمت الحضور والمذاكرة' : 'تحديد كـ منتهية'}</span>
                  </button>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    {lec.notificationEnabled ? <Bell className="w-3.5 h-3.5 text-indigo-500" /> : <BellOff className="w-3.5 h-3.5" />}
                    {lec.notificationEnabled ? 'تذكير مُمكّن' : 'بدون تذكير'}
                  </span>
                </div>

              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Add / Edit Lecture Modal */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in">
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="w-full max-w-lg glass-panel rounded-3xl p-6 sm:p-8 border border-slate-200 dark:border-slate-800 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-slate-200 dark:border-slate-800 mb-6">
              <h3 className="text-xl font-bold font-tajawal text-slate-900 dark:text-white">
                {editingLecture ? 'تعديل بيانات المحاضرة' : 'إضافة محاضرة جديدة إلى الجدول'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-slate-100 dark:bg-slate-800 text-slate-500 hover:text-slate-900 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLecture} className="space-y-4 text-right">
              {/* Lecture Name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  اسم المحاضرة / العنوان الأكاديمي <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="مثال: Anatomy - Upper Limb Brachial Plexus"
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                />
              </div>

              {/* Subject Select */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  المادة الأكاديمية
                </label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    تاريخ المحاضرة
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    وقت المحاضرة
                  </label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm font-mono focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Day & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    يوم الأسبوع
                  </label>
                  <select
                    value={formDayOfWeek}
                    onChange={(e) => setFormDayOfWeek(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    درجة الأهمية
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  >
                    <option value="high">عالية جداً (امتحان/مهم)</option>
                    <option value="medium">متوسطة (محاضرة أساسية)</option>
                    <option value="low">منخفضة (حضور اختيارية)</option>
                  </select>
                </div>
              </div>

              {/* Professor & Hall */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    اسم الأستاذ / الدكتور
                  </label>
                  <input
                    type="text"
                    value={formProfessor}
                    onChange={(e) => setFormProfessor(e.target.value)}
                    placeholder="أ.د. محمد أحمد"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                    القاعة / المدرج
                  </label>
                  <input
                    type="text"
                    value={formHall}
                    onChange={(e) => setFormHall(e.target.value)}
                    placeholder="مدرج A3"
                    className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-slate-700 dark:text-slate-300 mb-1">
                  ملاحظات أو مهام خاصة بالمحاضرة
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="ملاحظات المذاكرة، تحضير الأدوات..."
                  className="w-full px-4 py-3 rounded-xl bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 text-slate-900 dark:text-white text-sm focus:ring-2 focus:ring-indigo-500 outline-none resize-none"
                />
              </div>

              {/* Notification Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="notifCheck"
                  checked={formNotifEnabled}
                  onChange={(e) => setFormNotifEnabled(e.target.checked)}
                  className="w-4 h-4 text-indigo-600 rounded border-slate-300 focus:ring-indigo-500"
                />
                <label htmlFor="notifCheck" className="text-xs font-bold text-slate-700 dark:text-slate-300 cursor-pointer">
                  تفعيل التنبيه التلقائي للمتصفح عند حلول موعد المحاضرة
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 font-bold text-xs"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  {editingLecture ? 'حفظ التعديلات' : 'إضافة المحاضرة'}
                </button>
              </div>

            </form>
          </motion.div>
        </div>
      )}

    </div>
  );
};
