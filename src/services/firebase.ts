import { initializeApp, getApps, getApp } from 'firebase/app';
import {
  getFirestore,
  doc,
  getDoc,
  setDoc,
  onSnapshot,
  collection,
  getDocs,
  addDoc,
  updateDoc,
  deleteDoc,
  query,
  orderBy,
  limit
} from 'firebase/firestore';
import firebaseConfig from '../../firebase-applet-config.json';
import { Subject, Lecture, StudyResource, ArticleItem, VideoItem, CollegeInfoData } from '../types';
import { COLLEGE_INFO, SUBJECTS_DATA } from '../data/academicContent';

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();
export const db = getFirestore(app, firebaseConfig.firestoreDatabaseId || undefined);

// Types for Admin & Dynamic Site Config
export interface SectionVisibility {
  heroSection: boolean;
  heroStats: boolean;
  heroButtons: boolean;
  telegramCard: boolean;
  collegeInfoSection: boolean;
  subjectsSection: boolean;
  scheduleSection: boolean;
  resourcesSection: boolean;
  articlesSection: boolean;
  videosSection: boolean;
  gpaCalculator: boolean;
  pomodoroTimer: boolean;
  announcementsBanner: boolean;
  contactFooter: boolean;
  pwaInstallPrompt: boolean;
}

export interface ButtonConfig {
  id: string;
  label: string;
  link: string;
  type: 'primary' | 'secondary' | 'outline' | 'telegram';
  visible: boolean;
}

export interface AnnouncementItem {
  id: string;
  title: string;
  content: string;
  badge: string;
  link?: string;
  visible: boolean;
  createdAt: string;
}

export interface MediaItem {
  id: string;
  name: string;
  url: string;
  type: 'image' | 'pdf' | 'video' | 'logo';
  size?: string;
  category?: string;
  visible: boolean;
  createdAt: string;
}

export interface AdminLogItem {
  id: string;
  action: string;
  details: string;
  timestamp: string;
}

export interface SiteConfig {
  siteTitle: string;
  siteSubtitle: string;
  heroTitle: string;
  heroSubtitle: string;
  heroBadgeText: string;
  heroPrimaryBtnText: string;
  heroPrimaryBtnLink: string;
  telegramBotName: string;
  telegramBotLink: string;
  contactEmail: string;
  contactPhone: string;
  contactAddress: string;
  footerCopyright: string;
  footerAboutText: string;
  siteLogoUrl: string;
  heroBgUrl: string;
  primaryColor: string; // hex or tailwind class
  seoTitle: string;
  seoDescription: string;
  seoKeywords: string;
  sectionVisibility: SectionVisibility;
  buttons: ButtonConfig[];
}

export const DEFAULT_SITE_CONFIG: SiteConfig = {
  siteTitle: 'دليلك الجامعي',
  siteSubtitle: 'جامعتك في جيبك',
  heroTitle: 'ابدأ رحلتك الأكاديمية بذكاء وتنظيم',
  heroSubtitle: 'منصة أكاديمية كاملة لمتابعة الجداول والكتب والملخصات وتنبيهات المحاضرات الفورية مع ربط التلجرام.',
  heroBadgeText: 'مرحباً بك، طالب الكلية',
  heroPrimaryBtnText: 'دخول للوحة الرئيسية',
  heroPrimaryBtnLink: 'main',
  telegramBotName: '@Daleelak_AlJamaei_bot',
  telegramBotLink: 'http://t.me/Daleelak_AlJamaei_bot',
  contactEmail: 'contact@daleelak-jamei.edu',
  contactPhone: '+966 50 000 0000',
  contactAddress: 'مبنى المجمع الأكاديمي الرئيسي - قاعة 101',
  footerCopyright: 'جميع الحقوق محفوظة © ' + new Date().getFullYear() + ' - دليلك الجامعي',
  footerAboutText: 'منصة أكاديمية شاملة ومصممة خصيصاً لمساعدة الطلاب الجامعيين في تنقيح المواد والأكاديميا وإدارة المحاضرات بمرونة عالية.',
  siteLogoUrl: '',
  heroBgUrl: '',
  primaryColor: '#2563eb', // blue-600
  seoTitle: 'دليلك الجامعي - جامعتك في جيبك',
  seoDescription: 'دليل رقمي شامل للطلاب الجامعيين لتنظيم المحاضرات وتصفح المواد والمصادر.',
  seoKeywords: 'جامعة, محاضرات, طب, تشريح, وظائف أعضاء, كيمياء حيوية, جدول دراسي, GPA',
  sectionVisibility: {
    heroSection: true,
    heroStats: true,
    heroButtons: true,
    telegramCard: true,
    collegeInfoSection: true,
    subjectsSection: true,
    scheduleSection: true,
    resourcesSection: true,
    articlesSection: true,
    videosSection: true,
    gpaCalculator: true,
    pomodoroTimer: true,
    announcementsBanner: true,
    contactFooter: true,
    pwaInstallPrompt: true,
  },
  buttons: [
    { id: 'btn-enter', label: 'دخول اللوحة', link: 'main', type: 'primary', visible: true },
    { id: 'btn-telegram', label: 'بوت التلجرام', link: 'http://t.me/Daleelak_AlJamaei_bot', type: 'telegram', visible: true },
    { id: 'btn-gpa', label: 'حاسبة المعدل GPA', link: 'gpa', type: 'secondary', visible: true },
    { id: 'btn-pomodoro', label: 'مؤقت التركيز', link: 'pomodoro', type: 'secondary', visible: true },
  ]
};

const SITE_CONFIG_DOC_ID = 'general';
const COLLEGE_INFO_DOC_ID = 'about_college';

export class FirebaseService {
  // 1. Subscribe to Site Config Real-time Updates
  static subscribeSiteConfig(callback: (config: SiteConfig) => void): () => void {
    const docRef = doc(db, 'site_config', SITE_CONFIG_DOC_ID);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as Partial<SiteConfig>;
        callback({
          ...DEFAULT_SITE_CONFIG,
          ...data,
          sectionVisibility: {
            ...DEFAULT_SITE_CONFIG.sectionVisibility,
            ...(data.sectionVisibility || {})
          }
        });
      } else {
        // Initialize default config in firestore
        setDoc(docRef, DEFAULT_SITE_CONFIG);
        callback(DEFAULT_SITE_CONFIG);
      }
    }, (error) => {
      console.warn('Firestore site_config snapshot error, fallback to default:', error);
      callback(DEFAULT_SITE_CONFIG);
    });
  }

  // 2. Save / Update Site Config
  static async updateSiteConfig(partialConfig: Partial<SiteConfig>): Promise<void> {
    try {
      const docRef = doc(db, 'site_config', SITE_CONFIG_DOC_ID);
      await setDoc(docRef, partialConfig, { merge: true });
      await this.addAdminLog('تحديث بيانات الموقع', 'تم تعديل الإعدادات العامة ونصوص الموقع');
    } catch (err) {
      console.error('Error updating site config:', err);
      throw err;
    }
  }

  // 3. Toggle Individual Section Visibility Switch
  static async toggleSectionVisibility(sectionKey: keyof SectionVisibility, value: boolean): Promise<void> {
    try {
      const docRef = doc(db, 'site_config', SITE_CONFIG_DOC_ID);
      const docSnap = await getDoc(docRef);
      const currentConfig = docSnap.exists() ? (docSnap.data() as SiteConfig) : DEFAULT_SITE_CONFIG;

      const updatedVisibility = {
        ...(currentConfig.sectionVisibility || DEFAULT_SITE_CONFIG.sectionVisibility),
        [sectionKey]: value
      };

      await setDoc(docRef, { sectionVisibility: updatedVisibility }, { merge: true });
      await this.addAdminLog('تغيير حالة ظهور قسم', `تم تغيير قسم ${sectionKey} إلى ${value ? 'تفعيل ON' : 'إخفاء OFF'}`);
    } catch (err) {
      console.error('Error toggling section visibility:', err);
      throw err;
    }
  }

  // 4. Articles Management
  static subscribeArticles(callback: (articles: ArticleItem[]) => void): () => void {
    const colRef = collection(db, 'articles');
    return onSnapshot(colRef, (snapshot) => {
      const articles: ArticleItem[] = [];
      snapshot.forEach(docSnap => {
        articles.push({ id: docSnap.id, ...docSnap.data() } as ArticleItem);
      });
      articles.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
      callback(articles);
    }, (err) => {
      console.warn('Articles snapshot error:', err);
      callback([]);
    });
  }

  static async addArticle(item: Omit<ArticleItem, 'id' | 'createdAt' | 'updatedAt'>): Promise<string> {
    const colRef = collection(db, 'articles');
    const now = new Date().toISOString();
    const docRef = await addDoc(colRef, {
      ...item,
      createdAt: now,
      updatedAt: now
    });
    await this.addAdminLog('إضافة مقال جديد', `عنوان المقال: ${item.title} (${item.status})`);
    return docRef.id;
  }

  static async updateArticle(id: string, partial: Partial<ArticleItem>): Promise<void> {
    const docRef = doc(db, 'articles', id);
    await updateDoc(docRef, {
      ...partial,
      updatedAt: new Date().toISOString()
    });
    await this.addAdminLog('تحديث مقال', `معرف المقال: ${id}`);
  }

  static async deleteArticle(id: string): Promise<void> {
    const docRef = doc(db, 'articles', id);
    await deleteDoc(docRef);
    await this.addAdminLog('حذف مقال', `معرف المقال: ${id}`);
  }

  // 5. Video Management
  static subscribeVideos(callback: (videos: VideoItem[]) => void): () => void {
    const colRef = collection(db, 'videos');
    return onSnapshot(colRef, (snapshot) => {
      const videos: VideoItem[] = [];
      snapshot.forEach(docSnap => {
        videos.push({ id: docSnap.id, ...docSnap.data() } as VideoItem);
      });
      videos.sort((a, b) => (a.order ?? 0) - (b.order ?? 0));
      callback(videos);
    }, (err) => {
      console.warn('Videos snapshot error:', err);
      callback([]);
    });
  }

  static async addVideo(item: Omit<VideoItem, 'id' | 'createdAt'>): Promise<string> {
    const colRef = collection(db, 'videos');
    const docRef = await addDoc(colRef, {
      ...item,
      createdAt: new Date().toISOString()
    });
    await this.addAdminLog('إضافة فيديو جديد', `عنوان الفيديو: ${item.title}`);
    return docRef.id;
  }

  static async updateVideo(id: string, partial: Partial<VideoItem>): Promise<void> {
    const docRef = doc(db, 'videos', id);
    await updateDoc(docRef, partial);
    await this.addAdminLog('تحديث فيديو', `معرف الفيديو: ${id}`);
  }

  static async deleteVideo(id: string): Promise<void> {
    const docRef = doc(db, 'videos', id);
    await deleteDoc(docRef);
    await this.addAdminLog('حذف فيديو', `معرف الفيديو: ${id}`);
  }

  // 6. About College Section Info
  static subscribeCollegeInfo(callback: (data: CollegeInfoData) => void): () => void {
    const docRef = doc(db, 'college_info', COLLEGE_INFO_DOC_ID);
    return onSnapshot(docRef, (snapshot) => {
      if (snapshot.exists()) {
        const data = snapshot.data() as CollegeInfoData;
        callback({
          title: data.title || COLLEGE_INFO.title,
          tagline: data.tagline || COLLEGE_INFO.tagline,
          image: data.image || COLLEGE_INFO.image,
          overview: data.overview || COLLEGE_INFO.overview,
          creditSystem: data.creditSystem || COLLEGE_INFO.creditSystem,
          survivalTips: data.survivalTips && data.survivalTips.length > 0
            ? data.survivalTips
            : COLLEGE_INFO.survivalTips.map((t, idx) => ({ id: 'tip-' + idx, ...t })),
          customSections: data.customSections || []
        });
      } else {
        const initialDefault: CollegeInfoData = {
          title: COLLEGE_INFO.title,
          tagline: COLLEGE_INFO.tagline,
          image: COLLEGE_INFO.image,
          overview: COLLEGE_INFO.overview,
          creditSystem: COLLEGE_INFO.creditSystem,
          survivalTips: COLLEGE_INFO.survivalTips.map((t, idx) => ({ id: 'tip-' + idx, ...t })),
          customSections: []
        };
        setDoc(docRef, initialDefault);
        callback(initialDefault);
      }
    }, (err) => {
      console.warn('College info snapshot error:', err);
      callback({
        title: COLLEGE_INFO.title,
        tagline: COLLEGE_INFO.tagline,
        image: COLLEGE_INFO.image,
        overview: COLLEGE_INFO.overview,
        creditSystem: COLLEGE_INFO.creditSystem,
        survivalTips: COLLEGE_INFO.survivalTips.map((t, idx) => ({ id: 'tip-' + idx, ...t })),
        customSections: []
      });
    });
  }

  static async updateCollegeInfo(data: Partial<CollegeInfoData>): Promise<void> {
    const docRef = doc(db, 'college_info', COLLEGE_INFO_DOC_ID);
    await setDoc(docRef, data, { merge: true });
    await this.addAdminLog('تحديث قسم الكلية', 'تم تعديل ومعالجة معلومات عن الكلية');
  }

  // 7. Academic Subjects Data
  static subscribeSubjects(callback: (subjects: Subject[]) => void): () => void {
    const colRef = collection(db, 'subjects_data');
    return onSnapshot(colRef, (snapshot) => {
      if (!snapshot.empty) {
        const subjects: Subject[] = [];
        snapshot.forEach(docSnap => {
          subjects.push({ id: docSnap.id, ...docSnap.data() } as Subject);
        });
        callback(subjects);
      } else {
        // Populate default subjects if empty
        SUBJECTS_DATA.forEach(async (sub) => {
          const docRef = doc(db, 'subjects_data', sub.id);
          await setDoc(docRef, sub);
        });
        callback(SUBJECTS_DATA);
      }
    }, (err) => {
      console.warn('Subjects snapshot error:', err);
      callback(SUBJECTS_DATA);
    });
  }

  static async addSubject(sub: Subject): Promise<void> {
    const docRef = doc(db, 'subjects_data', sub.id);
    await setDoc(docRef, sub);
    await this.addAdminLog('إضافة مادة أكاديمية', `اسم المادة: ${sub.nameAr}`);
  }

  static async updateSubject(id: string, partial: Partial<Subject>): Promise<void> {
    const docRef = doc(db, 'subjects_data', id);
    await updateDoc(docRef, partial);
    await this.addAdminLog('تحديث مادة أكاديمية', `معرف المادة: ${id}`);
  }

  static async deleteSubject(id: string): Promise<void> {
    const docRef = doc(db, 'subjects_data', id);
    await deleteDoc(docRef);
    await this.addAdminLog('حذف مادة أكاديمية', `معرف المادة: ${id}`);
  }

  // 8. Announcements & Ads Manager
  static subscribeAnnouncements(callback: (items: AnnouncementItem[]) => void): () => void {
    const colRef = collection(db, 'announcements');
    return onSnapshot(colRef, (snapshot) => {
      const items: AnnouncementItem[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as AnnouncementItem);
      });
      callback(items);
    }, (err) => {
      console.warn('Announcements snapshot error:', err);
      callback([]);
    });
  }

  static async addAnnouncement(item: Omit<AnnouncementItem, 'id' | 'createdAt'>): Promise<void> {
    const colRef = collection(db, 'announcements');
    await addDoc(colRef, {
      ...item,
      createdAt: new Date().toISOString()
    });
    await this.addAdminLog('إضافة إعلان/تنبيه جديد', `عنوان: ${item.title}`);
  }

  static async updateAnnouncement(id: string, partial: Partial<AnnouncementItem>): Promise<void> {
    const docRef = doc(db, 'announcements', id);
    await updateDoc(docRef, partial);
    await this.addAdminLog('تحديث إعلان', `معرف الإعلان: ${id}`);
  }

  static async deleteAnnouncement(id: string): Promise<void> {
    const docRef = doc(db, 'announcements', id);
    await deleteDoc(docRef);
    await this.addAdminLog('حذف إعلان', `معرف الإعلان: ${id}`);
  }

  // 9. Media & Assets Manager
  static subscribeMedia(callback: (items: MediaItem[]) => void): () => void {
    const colRef = collection(db, 'media');
    return onSnapshot(colRef, (snapshot) => {
      const items: MediaItem[] = [];
      snapshot.forEach(docSnap => {
        items.push({ id: docSnap.id, ...docSnap.data() } as MediaItem);
      });
      callback(items);
    }, (err) => {
      console.warn('Media snapshot error:', err);
      callback([]);
    });
  }

  static async addMedia(item: Omit<MediaItem, 'id' | 'createdAt'>): Promise<void> {
    const colRef = collection(db, 'media');
    await addDoc(colRef, {
      ...item,
      createdAt: new Date().toISOString()
    });
    await this.addAdminLog('إضافة ملف ميديا', `اسم: ${item.name} (${item.type})`);
  }

  static async updateMedia(id: string, partial: Partial<MediaItem>): Promise<void> {
    const docRef = doc(db, 'media', id);
    await updateDoc(docRef, partial);
    await this.addAdminLog('تحديث ملف ميديا', `معرف الملف: ${id}`);
  }

  static async deleteMedia(id: string): Promise<void> {
    const docRef = doc(db, 'media', id);
    await deleteDoc(docRef);
    await this.addAdminLog('حذف ملف ميديا', `معرف الملف: ${id}`);
  }

  // 10. Admin Action Audit Logs
  static subscribeAdminLogs(callback: (logs: AdminLogItem[]) => void): () => void {
    const colRef = collection(db, 'admin_logs');
    return onSnapshot(colRef, (snapshot) => {
      const logs: AdminLogItem[] = [];
      snapshot.forEach(docSnap => {
        logs.push({ id: docSnap.id, ...docSnap.data() } as AdminLogItem);
      });
      // Sort newest first
      logs.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      callback(logs.slice(0, 50));
    }, (err) => {
      console.warn('Admin logs snapshot error:', err);
      callback([]);
    });
  }

  static async addAdminLog(action: string, details: string): Promise<void> {
    try {
      const colRef = collection(db, 'admin_logs');
      await addDoc(colRef, {
        action,
        details,
        timestamp: new Date().toISOString()
      });
    } catch (err) {
      console.error('Error writing admin log:', err);
    }
  }

  // 11. Full Backup JSON Export & Import
  static async exportFullData(): Promise<string> {
    const docRef = doc(db, 'site_config', SITE_CONFIG_DOC_ID);
    const snap = await getDoc(docRef);
    const siteConfigData = snap.exists() ? snap.data() : DEFAULT_SITE_CONFIG;

    const annSnap = await getDocs(collection(db, 'announcements'));
    const annData = annSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const mediaSnap = await getDocs(collection(db, 'media'));
    const mediaData = mediaSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const artSnap = await getDocs(collection(db, 'articles'));
    const artData = artSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const vidSnap = await getDocs(collection(db, 'videos'));
    const vidData = vidSnap.docs.map(d => ({ id: d.id, ...d.data() }));

    const backupPayload = {
      exportedAt: new Date().toISOString(),
      siteConfig: siteConfigData,
      announcements: annData,
      media: mediaData,
      articles: artData,
      videos: vidData
    };

    return JSON.stringify(backupPayload, null, 2);
  }

  static async importFullData(jsonString: string): Promise<void> {
    const parsed = JSON.parse(jsonString);
    if (parsed.siteConfig) {
      await this.updateSiteConfig(parsed.siteConfig);
    }
    await this.addAdminLog('استعادة نسخة احتياطية', 'تم استيراد نسخة البيانات بنجاح');
  }
}

