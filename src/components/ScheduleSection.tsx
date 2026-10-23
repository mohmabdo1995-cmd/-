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
  onLecturesUpdated?: () => void;
}

const DAYS_OF_WEEK = ['الأحد', 'الإثنين', 'الثلاثاء', 'الأربعاء', 'الخميس', 'الجمعة', 'السبت'];
const SUBJECT_OPTIONS = ['Anatomy', 'Physiology', 'Biochemistry', 'Microbiology', 'Pathology', 'Pharmacology', 'عام / مقرر آخر'];

export const ScheduleSection: React.FC<ScheduleSectionProps> = ({ onBack, openAddModalInitially = false, onLecturesUpdated }) => {
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
    onLecturesUpdated?.();
    setIsModalOpen(false);
    resetForm();
    confetti({ particleCount: 40, spread: 50 });
  };

  const handleDeleteLecture = (id: string) => {
    if (confirm('هل أنت تأكد من رغبتك في حذف هذه المحاضرة؟')) {
      StorageService.deleteLecture(id);
      loadLectures();
      onLecturesUpdated?.();
    }
  };

  const handleToggleCompleted = (id: string) => {
    StorageService.toggleLectureCompleted(id);
    loadLectures();
    onLecturesUpdated?.();
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
            className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-[#BCEBFF]/30 hover:bg-[#BCEBFF]/60 text-[#071A3D] font-bold text-sm transition-all mb-4"
          >
            <ArrowRight className="w-4 h-4" />
            <span>الرجوع للرئيسية</span>
          </button>

          <div className="flex items-center gap-2 text-[#16958E] dark:text-[#BCEBFF] font-bold text-sm">
            <Sparkles className="w-4 h-4 text-[#16958E]" />
            <span>القسم الثالث - التنظيم والتذكير</span>
          </div>

          <h1 className="text-3xl sm:text-4xl font-extrabold font-tajawal text-[#071A3D] dark:text-white mt-1">
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
              className="flex-1 md:flex-none px-4 py-3 rounded-2xl bg-[#BCEBFF]/30 border border-[#16958E]/40 text-[#071A3D] font-bold text-xs flex items-center justify-center gap-2 hover:bg-[#BCEBFF]/60 transition-all shadow-sm"
            >
              <Bell className="w-4 h-4 text-[#16958E] animate-bounce" />
              <span>تفعيل التنبيهات</span>
            </button>
          )}

          <button
            onClick={handleOpenAddModal}
            className="flex-1 md:flex-none px-6 py-3.5 rounded-2xl bg-gradient-to-r from-[#071A3D] to-[#16958E] hover:from-[#0a2558] hover:to-[#1ba8a0] text-white font-bold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#071A3D]/25 hover:scale-105 active:scale-95 transition-all"
          >
            <Plus className="w-5 h-5 stroke-[2.5]" />
            <span>إضافة محاضرة جديدة</span>
          </button>
        </div>
      </div>

      {/* Filter Tabs & Search Bar */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-4 mb-8">
        
        {/* Tabs */}
        <div className="md:col-span-7 flex items-center gap-1 bg-[#BCEBFF]/20 dark:bg-[#071A3D]/60 p-1.5 rounded-2xl border border-[#BCEBFF]/50 dark:border-[#16958E]/30 overflow-x-auto scrollbar-none">
          <button
            onClick={() => setFilterTab('all')}
            className={`flex-1 min-w-[90px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterTab === 'all'
                ? 'bg-[#071A3D] text-white shadow-sm'
                : 'text-[#071A3D] dark:text-slate-300 hover:text-[#16958E]'
            }`}
          >
            الكل ({lectures.length})
          </button>

          <button
            onClick={() => setFilterTab('today')}
            className={`flex-1 min-w-[90px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterTab === 'today'
                ? 'bg-[#071A3D] text-white shadow-sm'
                : 'text-[#071A3D] dark:text-slate-300 hover:text-[#16958E]'
            }`}
          >
            محاضرات اليوم
          </button>

          <button
            onClick={() => setFilterTab('upcoming')}
            className={`flex-1 min-w-[90px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterTab === 'upcoming'
                ? 'bg-[#071A3D] text-white shadow-sm'
                : 'text-[#071A3D] dark:text-slate-300 hover:text-[#16958E]'
            }`}
          >
            القادمة
          </button>

          <button
            onClick={() => setFilterTab('past')}
            className={`flex-1 min-w-[90px] px-4 py-2 rounded-xl text-xs sm:text-sm font-bold transition-all ${
              filterTab === 'past'
                ? 'bg-[#071A3D] text-white shadow-sm'
                : 'text-[#071A3D] dark:text-slate-300 hover:text-[#16958E]'
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
            className="w-full pr-11 pl-4 py-3 rounded-2xl bg-white dark:bg-[#071A3D] border border-[#BCEBFF]/80 dark:border-[#16958E]/30 text-[#071A3D] dark:text-white placeholder-slate-400 text-sm focus:outline-none focus:ring-2 focus:ring-[#16958E] transition-all shadow-sm"
          />
        </div>

      </div>

      {/* Lectures List */}
      {filteredLectures.length === 0 ? (
        <div className="p-12 text-center rounded-3xl bg-white dark:bg-[#071A3D] border border-[#BCEBFF]/80 dark:border-[#16958E]/30 my-8 shadow-sm">
          <Calendar className="w-16 h-16 text-[#16958E]/40 mx-auto mb-4" />
          <h3 className="text-xl font-bold font-tajawal text-[#071A3D] dark:text-white mb-2">لا توجد محاضرات في هذا العرض</h3>
          <p className="text-slate-500 text-sm mb-6">قم بإضافة محاضرة جديدة أو تغيير خيارات البحث والتصفية.</p>
          <button
            onClick={handleOpenAddModal}
            className="px-6 py-3 rounded-xl bg-[#071A3D] hover:bg-[#16958E] text-white font-bold text-sm shadow-md transition-all inline-flex items-center gap-2"
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
                className={`p-6 rounded-3xl bg-white dark:bg-[#071A3D] border ${
                  lec.completed
                    ? 'opacity-65 border-[#BCEBFF]/40 dark:border-[#16958E]/20 bg-[#BCEBFF]/10 dark:bg-[#071A3D]/40'
                    : lec.date === todayStr
                    ? 'border-[#16958E] shadow-lg shadow-[#16958E]/10 ring-1 ring-[#16958E]'
                    : 'border-[#BCEBFF]/80 dark:border-[#16958E]/30'
                } transition-all duration-300 flex flex-col justify-between shadow-sm`}
              >
                <div>
                  {/* Top Subject Tag & Options */}
                  <div className="flex items-center justify-between gap-2 mb-3">
                    <div className="flex items-center gap-2">
                      <span className="px-3 py-1 rounded-full bg-[#BCEBFF]/40 text-[#071A3D] font-bold text-xs border border-[#16958E]/30">
                        {lec.subject}
                      </span>

                      {lec.priority === 'high' && (
                        <span className="px-2.5 py-0.5 rounded-full bg-rose-50 dark:bg-rose-950/80 text-rose-600 dark:text-rose-400 font-bold text-[10px]">
                          مهمة جداً 🔥
                        </span>
                      )}

                      {lec.date === todayStr && (
                        <span className="px-2.5 py-0.5 rounded-full bg-[#16958E] text-white font-bold text-[10px] animate-pulse">
                          اليوم 📍
                        </span>
                      )}
                    </div>

                    <div className="flex items-center gap-1">
                      <button
                        onClick={() => handleTestNotification(lec)}
                        title="تجربة إشعار التذكير"
                        className="p-2 rounded-xl text-slate-400 hover:text-[#16958E] hover:bg-[#BCEBFF]/20 transition-all"
                      >
                        <Volume2 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleOpenEditModal(lec)}
                        title="تعديل المحاضرة"
                        className="p-2 rounded-xl text-slate-400 hover:text-[#16958E] hover:bg-[#BCEBFF]/20 transition-all"
                      >
                        <Edit3 className="w-4 h-4" />
                      </button>

                      <button
                        onClick={() => handleDeleteLecture(lec.id)}
                        title="حذف المحاضرة"
                        className="p-2 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-[#BCEBFF]/20 transition-all"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  </div>

                  {/* Lecture Title */}
                  <h3 className={`text-xl font-bold font-tajawal mb-4 ${lec.completed ? 'line-through text-slate-400' : 'text-[#071A3D] dark:text-white'}`}>
                    {lec.title}
                  </h3>

                  {/* Details Grid */}
                  <div className="grid grid-cols-2 gap-3 mb-4 text-xs font-medium text-slate-600 dark:text-slate-300">
                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#BCEBFF]/20 dark:bg-[#071A3D]/60 border border-[#BCEBFF]/50 dark:border-[#16958E]/30">
                      <Clock className="w-4 h-4 text-[#16958E]" />
                      <span className="font-mono font-bold text-[#071A3D] dark:text-slate-200">{lec.time}</span>
                      <span>({lec.dayOfWeek})</span>
                    </div>

                    <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#BCEBFF]/20 dark:bg-[#071A3D]/60 border border-[#BCEBFF]/50 dark:border-[#16958E]/30">
                      <Calendar className="w-4 h-4 text-[#071A3D] dark:text-[#BCEBFF]" />
                      <span className="font-mono text-[#071A3D] dark:text-slate-200">{lec.date}</span>
                    </div>

                    {lec.professor && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#BCEBFF]/20 dark:bg-[#071A3D]/60 border border-[#BCEBFF]/50 dark:border-[#16958E]/30 col-span-2 sm:col-span-1">
                        <User className="w-4 h-4 text-[#16958E]" />
                        <span className="truncate">{lec.professor}</span>
                      </div>
                    )}

                    {lec.hall && (
                      <div className="flex items-center gap-2 p-2.5 rounded-xl bg-[#BCEBFF]/20 dark:bg-[#071A3D]/60 border border-[#BCEBFF]/50 dark:border-[#16958E]/30 col-span-2 sm:col-span-1">
                        <MapPin className="w-4 h-4 text-[#16958E]" />
                        <span className="truncate">{lec.hall}</span>
                      </div>
                    )}
                  </div>

                  {/* Notes */}
                  {lec.notes && (
                    <div className="p-3 rounded-xl bg-[#BCEBFF]/15 dark:bg-[#071A3D]/40 text-xs text-slate-600 dark:text-slate-300 mb-4 leading-relaxed border border-[#BCEBFF]/30">
                      <strong className="text-[#071A3D] dark:text-slate-200 block mb-1">ملاحظات:</strong>
                      {lec.notes}
                    </div>
                  )}
                </div>

                {/* Footer Complete Button */}
                <div className="pt-3 border-t border-[#BCEBFF]/40 dark:border-[#16958E]/20 flex items-center justify-between">
                  <button
                    onClick={() => handleToggleCompleted(lec.id)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      lec.completed
                        ? 'bg-[#16958E]/20 text-[#16958E] border border-[#16958E]/30'
                        : 'bg-[#BCEBFF]/30 hover:bg-[#BCEBFF]/60 text-[#071A3D]'
                    }`}
                  >
                    <CheckCircle2 className={`w-4 h-4 ${lec.completed ? 'text-[#16958E]' : 'text-slate-400'}`} />
                    <span>{lec.completed ? 'تمت الحضور والمذاكرة' : 'تحديد كـ منتهية'}</span>
                  </button>

                  <span className="text-[11px] text-slate-400 flex items-center gap-1">
                    {lec.notificationEnabled ? <Bell className="w-3.5 h-3.5 text-[#16958E]" /> : <BellOff className="w-3.5 h-3.5" />}
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
            className="w-full max-w-lg bg-white dark:bg-[#071A3D] rounded-3xl p-6 sm:p-8 border border-[#BCEBFF]/80 dark:border-[#16958E]/30 shadow-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between pb-4 border-b border-[#BCEBFF]/40 dark:border-[#16958E]/30 mb-6">
              <h3 className="text-xl font-bold font-tajawal text-[#071A3D] dark:text-white">
                {editingLecture ? 'تعديل بيانات المحاضرة' : 'إضافة محاضرة جديدة إلى الجدول'}
              </h3>
              <button
                onClick={() => setIsModalOpen(false)}
                className="w-8 h-8 rounded-full bg-[#BCEBFF]/30 text-[#071A3D] hover:bg-[#BCEBFF]/60 flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSaveLecture} className="space-y-4 text-right">
              {/* Lecture Name */}
              <div>
                <label className="block text-xs font-bold text-[#071A3D] dark:text-slate-300 mb-1">
                  اسم المحاضرة / العنوان الأكاديمي <span className="text-rose-500">*</span>
                </label>
                <input
                  type="text"
                  required
                  value={formTitle}
                  onChange={(e) => setFormTitle(e.target.value)}
                  placeholder="مثال: Anatomy - Upper Limb Brachial Plexus"
                  className="w-full px-4 py-3 rounded-xl bg-[#BCEBFF]/10 dark:bg-[#071A3D]/70 border border-[#BCEBFF]/60 dark:border-[#16958E]/30 text-[#071A3D] dark:text-white text-sm focus:ring-2 focus:ring-[#16958E] outline-none"
                />
              </div>

              {/* Subject Select */}
              <div>
                <label className="block text-xs font-bold text-[#071A3D] dark:text-slate-300 mb-1">
                  المادة الأكاديمية
                </label>
                <select
                  value={formSubject}
                  onChange={(e) => setFormSubject(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-[#BCEBFF]/10 dark:bg-[#071A3D]/70 border border-[#BCEBFF]/60 dark:border-[#16958E]/30 text-[#071A3D] dark:text-white text-sm focus:ring-2 focus:ring-[#16958E] outline-none"
                >
                  {SUBJECT_OPTIONS.map((sub) => (
                    <option key={sub} value={sub}>{sub}</option>
                  ))}
                </select>
              </div>

              {/* Date & Time Picker */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#071A3D] dark:text-slate-300 mb-1">
                    تاريخ المحاضرة
                  </label>
                  <input
                    type="date"
                    required
                    value={formDate}
                    onChange={(e) => setFormDate(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#BCEBFF]/10 dark:bg-[#071A3D]/70 border border-[#BCEBFF]/60 dark:border-[#16958E]/30 text-[#071A3D] dark:text-white text-sm font-mono focus:ring-2 focus:ring-[#16958E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A3D] dark:text-slate-300 mb-1">
                    وقت المحاضرة
                  </label>
                  <input
                    type="time"
                    required
                    value={formTime}
                    onChange={(e) => setFormTime(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#BCEBFF]/10 dark:bg-[#071A3D]/70 border border-[#BCEBFF]/60 dark:border-[#16958E]/30 text-[#071A3D] dark:text-white text-sm font-mono focus:ring-2 focus:ring-[#16958E] outline-none"
                  />
                </div>
              </div>

              {/* Day & Priority */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-[#071A3D] dark:text-slate-300 mb-1">
                    يوم الأسبوع
                  </label>
                  <select
                    value={formDayOfWeek}
                    onChange={(e) => setFormDayOfWeek(e.target.value)}
                    className="w-full px-4 py-3 rounded-xl bg-[#BCEBFF]/10 dark:bg-[#071A3D]/70 border border-[#BCEBFF]/60 dark:border-[#16958E]/30 text-[#071A3D] dark:text-white text-sm focus:ring-2 focus:ring-[#16958E] outline-none"
                  >
                    {DAYS_OF_WEEK.map((day) => (
                      <option key={day} value={day}>{day}</option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A3D] dark:text-slate-300 mb-1">
                    درجة الأهمية
                  </label>
                  <select
                    value={formPriority}
                    onChange={(e) => setFormPriority(e.target.value as 'high' | 'medium' | 'low')}
                    className="w-full px-4 py-3 rounded-xl bg-[#BCEBFF]/10 dark:bg-[#071A3D]/70 border border-[#BCEBFF]/60 dark:border-[#16958E]/30 text-[#071A3D] dark:text-white text-sm focus:ring-2 focus:ring-[#16958E] outline-none"
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
                  <label className="block text-xs font-bold text-[#071A3D] dark:text-slate-300 mb-1">
                    اسم الأستاذ / الدكتور
                  </label>
                  <input
                    type="text"
                    value={formProfessor}
                    onChange={(e) => setFormProfessor(e.target.value)}
                    placeholder="أ.د. محمد أحمد"
                    className="w-full px-4 py-3 rounded-xl bg-[#BCEBFF]/10 dark:bg-[#071A3D]/70 border border-[#BCEBFF]/60 dark:border-[#16958E]/30 text-[#071A3D] dark:text-white text-sm focus:ring-2 focus:ring-[#16958E] outline-none"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-[#071A3D] dark:text-slate-300 mb-1">
                    القاعة / المدرج
                  </label>
                  <input
                    type="text"
                    value={formHall}
                    onChange={(e) => setFormHall(e.target.value)}
                    placeholder="مدرج A3"
                    className="w-full px-4 py-3 rounded-xl bg-[#BCEBFF]/10 dark:bg-[#071A3D]/70 border border-[#BCEBFF]/60 dark:border-[#16958E]/30 text-[#071A3D] dark:text-white text-sm focus:ring-2 focus:ring-[#16958E] outline-none"
                  />
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="block text-xs font-bold text-[#071A3D] dark:text-slate-300 mb-1">
                  ملاحظات أو مهام خاصة بالمحاضرة
                </label>
                <textarea
                  rows={2}
                  value={formNotes}
                  onChange={(e) => setFormNotes(e.target.value)}
                  placeholder="ملاحظات المذاكرة، تحضير الأدوات..."
                  className="w-full px-4 py-3 rounded-xl bg-[#BCEBFF]/10 dark:bg-[#071A3D]/70 border border-[#BCEBFF]/60 dark:border-[#16958E]/30 text-[#071A3D] dark:text-white text-sm focus:ring-2 focus:ring-[#16958E] outline-none resize-none"
                />
              </div>

              {/* Notification Checkbox */}
              <div className="flex items-center gap-2 pt-2">
                <input
                  type="checkbox"
                  id="notifCheck"
                  checked={formNotifEnabled}
                  onChange={(e) => setFormNotifEnabled(e.target.checked)}
                  className="w-4 h-4 text-[#16958E] rounded border-slate-300 focus:ring-[#16958E]"
                />
                <label htmlFor="notifCheck" className="text-xs font-bold text-[#071A3D] dark:text-slate-300 cursor-pointer">
                  تفعيل التنبيه التلقائي للمتصفح عند حلول موعد المحاضرة
                </label>
              </div>

              {/* Submit Button */}
              <div className="pt-4 flex items-center justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-5 py-2.5 rounded-xl bg-[#BCEBFF]/30 hover:bg-[#BCEBFF]/60 text-[#071A3D] font-bold text-xs"
                >
                  إلغاء
                </button>

                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#071A3D] hover:bg-[#16958E] text-white font-bold text-xs shadow-md transition-all"
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
