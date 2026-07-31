import { Lecture, GpaCourse, UserSettings } from '../types';

const STORAGE_KEYS = {
  LECTURES: 'daleelak_lectures_v2',
  GPA_COURSES: 'daleelak_gpa_v1',
  SETTINGS: 'daleelak_settings_v1',
  TASKS: 'daleelak_tasks_v1'
};

// Initial default demo lectures if empty
const INITIAL_LECTURES: Lecture[] = [
  {
    id: 'demo-1',
    title: 'Anatomy Lecture: Upper Limb Nerve Supply',
    subject: 'Anatomy',
    professor: 'أ.د. محمد أحمد',
    hall: 'المدرج المركزي A',
    date: new Date().toISOString().split('T')[0],
    time: '09:00',
    dayOfWeek: 'الأحد',
    notes: 'مراجعة الأعصاب الرئيسية وشلل الضفيرة العضدية (Brachial Plexus).',
    priority: 'high',
    completed: false,
    notificationEnabled: true,
    createdAt: Date.now()
  },
  {
    id: 'demo-2',
    title: 'Physiology: Cardiac Cycle & ECG Waves',
    subject: 'Physiology',
    professor: 'د. سارة الكردي',
    hall: 'قاعة 204',
    date: new Date(Date.now() + 86400000).toISOString().split('T')[0],
    time: '11:00',
    dayOfWeek: 'الإثنين',
    notes: 'إحضار آلة حاسبة لحساب معدل ضربات القلب وحجوم الدم.',
    priority: 'medium',
    completed: false,
    notificationEnabled: true,
    createdAt: Date.now() - 10000
  },
  {
    id: 'demo-3',
    title: 'Biochemistry: Glycolysis & Krebs Cycle',
    subject: 'Biochemistry',
    professor: 'أ.د. علي الشريف',
    hall: 'مختبر الكيمياء الحيوية',
    date: new Date(Date.now() + 172800000).toISOString().split('T')[0],
    time: '13:30',
    dayOfWeek: 'الثلاثاء',
    notes: 'تحديد الإنزيمات المحددة لسرعة التفاعل.',
    priority: 'high',
    completed: false,
    notificationEnabled: true,
    createdAt: Date.now() - 20000
  }
];

export class StorageService {
  // --- Lectures ---
  static getLectures(): Lecture[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.LECTURES);
      if (!data) {
        this.saveLectures(INITIAL_LECTURES);
        return INITIAL_LECTURES;
      }
      return JSON.parse(data);
    } catch (e) {
      console.error('Error reading lectures from storage:', e);
      return INITIAL_LECTURES;
    }
  }

  static saveLectures(lectures: Lecture[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.LECTURES, JSON.stringify(lectures));
    } catch (e) {
      console.error('Error saving lectures to storage:', e);
    }
  }

  static addLecture(lecture: Omit<Lecture, 'id' | 'createdAt'>): Lecture {
    const lectures = this.getLectures();
    const newLecture: Lecture = {
      ...lecture,
      id: 'lec-' + Date.now() + '-' + Math.random().toString(36).substring(2, 7),
      createdAt: Date.now()
    };
    const updated = [newLecture, ...lectures];
    this.saveLectures(updated);
    return newLecture;
  }

  static updateLecture(updatedLecture: Lecture): void {
    const lectures = this.getLectures();
    const index = lectures.findIndex(l => l.id === updatedLecture.id);
    if (index !== -1) {
      lectures[index] = updatedLecture;
      this.saveLectures(lectures);
    }
  }

  static deleteLecture(id: string): void {
    const lectures = this.getLectures();
    const filtered = lectures.filter(l => l.id !== id);
    this.saveLectures(filtered);
  }

  static toggleLectureCompleted(id: string): void {
    const lectures = this.getLectures();
    const updated = lectures.map(l => l.id === id ? { ...l, completed: !l.completed } : l);
    this.saveLectures(updated);
  }

  // --- GPA Courses ---
  static getGpaCourses(): GpaCourse[] {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.GPA_COURSES);
      return data ? JSON.parse(data) : [
        { id: '1', name: 'Anatomy', credits: 4, gradePoint: 4.0, gradeLetter: 'A+' },
        { id: '2', name: 'Physiology', credits: 4, gradePoint: 3.7, gradeLetter: 'A' },
        { id: '3', name: 'Biochemistry', credits: 3, gradePoint: 3.3, gradeLetter: 'B+' }
      ];
    } catch (e) {
      return [];
    }
  }

  static saveGpaCourses(courses: GpaCourse[]): void {
    try {
      localStorage.setItem(STORAGE_KEYS.GPA_COURSES, JSON.stringify(courses));
    } catch (e) {
      console.error('Error saving GPA courses:', e);
    }
  }

  // --- User Settings ---
  static getSettings(): UserSettings {
    try {
      const data = localStorage.getItem(STORAGE_KEYS.SETTINGS);
      if (data) return JSON.parse(data);
    } catch (e) {}
    return {
      theme: 'dark',
      notificationsEnabled: true,
      soundEnabled: true,
      activeView: 'landing'
    };
  }

  static saveSettings(settings: Partial<UserSettings>): UserSettings {
    const current = this.getSettings();
    const updated = { ...current, ...settings };
    try {
      localStorage.setItem(STORAGE_KEYS.SETTINGS, JSON.stringify(updated));
    } catch (e) {}
    return updated;
  }
}
