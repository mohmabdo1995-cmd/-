export type ActivePage = 'landing' | 'main' | 'college' | 'subjects' | 'subject-detail' | 'schedule' | 'resources' | 'gpa' | 'pomodoro';

export type SubjectId = 'anatomy' | 'physiology' | 'biochemistry' | 'microbiology' | 'pathology' | 'pharmacology';

export interface Subject {
  id: SubjectId;
  nameAr: string;
  nameEn: string;
  code: string;
  icon: string;
  color: string;
  image: string;
  description: string;
  credits: number;
  overview: string;
  keyTopics: string[];
  studyTips: string[];
  recommendedBooks: string[];
  lectureTopics: { id: string; titleAr: string; titleEn: string; duration: string; summary: string }[];
}

export interface Lecture {
  id: string;
  title: string;
  subject: string;
  professor?: string;
  hall?: string;
  date: string; // YYYY-MM-DD
  time: string; // HH:MM
  dayOfWeek: string;
  notes?: string;
  priority: 'high' | 'medium' | 'low';
  completed: boolean;
  notificationEnabled: boolean;
  createdAt: number;
}

export interface StudyResource {
  id: string;
  title: string;
  subjectId: SubjectId | 'general';
  category: 'telegram' | 'book' | 'video' | 'notes' | 'summary';
  description: string;
  link: string;
  isExternal?: boolean;
  icon?: string;
}

export interface GpaCourse {
  id: string;
  name: string;
  credits: number;
  gradePoint: number; // 4.0 scale or standard scale
  gradeLetter: string;
}

export interface UserSettings {
  theme: 'light' | 'dark' | 'system';
  notificationsEnabled: boolean;
  soundEnabled: boolean;
  activeView: ActivePage;
  selectedSubjectId?: SubjectId;
}
