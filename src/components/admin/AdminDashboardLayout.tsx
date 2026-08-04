import React, { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import {
  ShieldCheck, LayoutDashboard, FileText, ToggleLeft, Link, Image,
  Megaphone, Palette, Search, Save, LogOut, CheckCircle2, RefreshCw,
  Plus, Trash2, Eye, EyeOff, Download, Upload, Clock, Layers, Sparkles,
  BookOpen, Calendar, HelpCircle, ExternalLink, Globe, Phone, Mail, MapPin
} from 'lucide-react';
import {
  FirebaseService, SiteConfig, DEFAULT_SITE_CONFIG, SectionVisibility,
  AnnouncementItem, MediaItem, AdminLogItem, ButtonConfig
} from '../../services/firebase';
import { AdminAuthService } from '../../services/adminAuth';

interface AdminDashboardLayoutProps {
  onCloseAdmin: () => void;
}

type AdminTab =
  | 'overview'
  | 'content'
  | 'sections'
  | 'buttons'
  | 'media'
  | 'announcements'
  | 'design'
  | 'seo'
  | 'backup_logs';

export const AdminDashboardLayout: React.FC<AdminDashboardLayoutProps> = ({ onCloseAdmin }) => {
  const [activeTab, setActiveTab] = useState<AdminTab>('overview');
  const [config, setConfig] = useState<SiteConfig>(DEFAULT_SITE_CONFIG);
  const [announcements, setAnnouncements] = useState<AnnouncementItem[]>([]);
  const [mediaList, setMediaList] = useState<MediaItem[]>([]);
  const [adminLogs, setAdminLogs] = useState<AdminLogItem[]>([]);
  const [isSaving, setIsSaving] = useState(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  // New item form states
  const [newAnnTitle, setNewAnnTitle] = useState('');
  const [newAnnContent, setNewAnnContent] = useState('');
  const [newAnnBadge, setNewAnnBadge] = useState('إعلان');
  const [newAnnLink, setNewAnnLink] = useState('');

  const [newMediaName, setNewMediaName] = useState('');
  const [newMediaUrl, setNewMediaUrl] = useState('');
  const [newMediaType, setNewMediaType] = useState<'image' | 'pdf' | 'video' | 'logo'>('image');

  // Backup import file state
  const [importJsonText, setImportJsonText] = useState('');

  useEffect(() => {
    // Realtime Subscriptions
    const unsubscribeConfig = FirebaseService.subscribeSiteConfig((data) => {
      setConfig(data);
    });

    const unsubscribeAnn = FirebaseService.subscribeAnnouncements((data) => {
      setAnnouncements(data);
    });

    const unsubscribeMedia = FirebaseService.subscribeMedia((data) => {
      setMediaList(data);
    });

    const unsubscribeLogs = FirebaseService.subscribeAdminLogs((data) => {
      setAdminLogs(data);
    });

    return () => {
      unsubscribeConfig();
      unsubscribeAnn();
      unsubscribeMedia();
      unsubscribeLogs();
    };
  }, []);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  const handleSaveConfig = async () => {
    setIsSaving(true);
    try {
      await FirebaseService.updateSiteConfig(config);
      showToast('تم حفظ التغييرات وتحديث الموقع الحقيقي بنجاح 🚀');
    } catch (err) {
      showToast('حدث خطأ أثناء حفظ التغييرات');
    } finally {
      setIsSaving(false);
    }
  };

  const handleToggleSection = async (key: keyof SectionVisibility, val: boolean) => {
    try {
      await FirebaseService.toggleSectionVisibility(key, val);
      showToast(`تم ${val ? 'تفعيل ON' : 'إخفاء OFF'} القسم بنجاح`);
    } catch (err) {
      showToast('حدث خطأ أثناء تحديث حالة القسم');
    }
  };

  const handleAddAnnouncement = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newAnnTitle || !newAnnContent) return;
    try {
      await FirebaseService.addAnnouncement({
        title: newAnnTitle,
        content: newAnnContent,
        badge: newAnnBadge,
        link: newAnnLink,
        visible: true
      });
      setNewAnnTitle('');
      setNewAnnContent('');
      setNewAnnLink('');
      showToast('تمت إضافة الإعلان بنجاح');
    } catch (err) {
      showToast('خطأ أثناء إضافة الإعلان');
    }
  };

  const handleAddMedia = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newMediaName || !newMediaUrl) return;
    try {
      await FirebaseService.addMedia({
        name: newMediaName,
        url: newMediaUrl,
        type: newMediaType,
        visible: true
      });
      setNewMediaName('');
      setNewMediaUrl('');
      showToast('تمت إضافة الملف بنجاح');
    } catch (err) {
      showToast('خطأ أثناء إضافة الملف');
    }
  };

  const handleExportBackup = async () => {
    try {
      const jsonStr = await FirebaseService.exportFullData();
      const blob = new Blob([jsonStr], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `daleelak_backup_${new Date().toISOString().split('T')[0]}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('تم تحميل النسخة الاحتياطية بنجاح');
    } catch (err) {
      showToast('خطأ أثناء تصدير النسخة الاحتياطية');
    }
  };

  const handleImportBackup = async () => {
    if (!importJsonText) return;
    try {
      await FirebaseService.importFullData(importJsonText);
      setImportJsonText('');
      showToast('تم استيراد واستعادة النسخة الاحتياطية بنجاح');
    } catch (err) {
      showToast('خطأ في صيغة ملف النسخة الاحتياطية');
    }
  };

  const handleLogout = () => {
    AdminAuthService.logout();
    onCloseAdmin();
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-cairo flex flex-col" dir="rtl">
      
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed top-5 left-5 right-5 sm:left-auto sm:right-5 z-50 p-4 rounded-2xl bg-blue-600 text-white shadow-2xl flex items-center gap-3 animate-slide-down font-bold text-xs">
          <CheckCircle2 className="w-5 h-5 flex-shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Admin Header */}
      <header className="bg-slate-900 border-b border-slate-800 px-4 sm:px-8 py-4 flex items-center justify-between sticky top-0 z-40">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/30">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold font-tajawal text-white flex items-center gap-2">
              <span>لوحة التحكم وإدارة المحتوى</span>
              <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-400 text-[10px] border border-emerald-500/30">
                متصل مباشر Cloud Firestore
              </span>
            </h1>
            <p className="text-xs text-slate-400">إدارة نصوص وصور وأقسام ومفاتيح تفعيل الموقع</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSaveConfig}
            disabled={isSaving}
            className="px-5 py-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-lg transition-all flex items-center gap-2 disabled:opacity-50"
          >
            {isSaving ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4" />}
            <span>{isSaving ? 'جارِ الحفظ...' : 'حفظ التغييرات'}</span>
          </button>

          <button
            onClick={handleLogout}
            className="px-4 py-2.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 font-bold text-xs transition-all flex items-center gap-1.5"
          >
            <LogOut className="w-4 h-4" />
            <span className="hidden sm:inline">خروج</span>
          </button>
        </div>
      </header>

      {/* Main Admin Body */}
      <div className="flex-1 flex flex-col md:flex-row max-w-7xl w-full mx-auto p-4 sm:p-6 gap-6">
        
        {/* Navigation Sidebar / Tabs */}
        <aside className="w-full md:w-64 bg-slate-900 border border-slate-800 rounded-3xl p-3 flex flex-col gap-1 flex-shrink-0 self-start">
          <div className="px-3 py-2 text-[11px] font-bold text-slate-400 uppercase tracking-wider">
            أقسام لوحة التحكم
          </div>

          <button
            onClick={() => setActiveTab('overview')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'overview' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>الرئيسية والإحصائيات</span>
          </button>

          <button
            onClick={() => setActiveTab('content')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'content' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <FileText className="w-4 h-4" />
            <span>إدارة النصوص والمعلومات</span>
          </button>

          <button
            onClick={() => setActiveTab('sections')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'sections' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <ToggleLeft className="w-4 h-4" />
            <span>مفاتيح ظهور الأقسام (ON/OFF)</span>
          </button>

          <button
            onClick={() => setActiveTab('buttons')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'buttons' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Link className="w-4 h-4" />
            <span>إدارة الأزرار والروابط</span>
          </button>

          <button
            onClick={() => setActiveTab('media')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'media' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Image className="w-4 h-4" />
            <span>إدارة الصور والملفات (Media)</span>
          </button>

          <button
            onClick={() => setActiveTab('announcements')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'announcements' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Megaphone className="w-4 h-4" />
            <span>الإعلانات والأخبار</span>
          </button>

          <button
            onClick={() => setActiveTab('design')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'design' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Palette className="w-4 h-4" />
            <span>الألوان والتصميم</span>
          </button>

          <button
            onClick={() => setActiveTab('seo')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'seo' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Search className="w-4 h-4" />
            <span>إعدادات SEO والمحركات</span>
          </button>

          <button
            onClick={() => setActiveTab('backup_logs')}
            className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-xs font-bold transition-all ${
              activeTab === 'backup_logs' ? 'bg-blue-600 text-white shadow-md' : 'text-slate-400 hover:bg-slate-800 hover:text-white'
            }`}
          >
            <Clock className="w-4 h-4" />
            <span>النسخ الاحتياطي وسجل الإجراءات</span>
          </button>
        </aside>

        {/* Content Panel */}
        <main className="flex-1 bg-slate-900 border border-slate-800 rounded-3xl p-6 shadow-sm overflow-y-auto">
          
          {/* TAB 1: OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-tajawal text-white pb-3 border-b border-slate-800">
                ملخص النظام ونظرة عامة
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1 font-bold">حالة اتصال الداتا بيز</span>
                  <div className="flex items-center gap-2 text-emerald-400 font-extrabold text-lg">
                    <CheckCircle2 className="w-5 h-5" />
                    <span>نشط - Cloud Firestore</span>
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1 font-bold">الأقسام المفعلة (ON)</span>
                  <div className="text-2xl font-extrabold text-blue-400 font-mono">
                    {Object.values(config.sectionVisibility).filter(Boolean).length} / {Object.keys(config.sectionVisibility).length}
                  </div>
                </div>

                <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-800">
                  <span className="text-xs text-slate-400 block mb-1 font-bold">إجمالي الإعلانات والملفات</span>
                  <div className="text-2xl font-extrabold text-purple-400 font-mono">
                    {announcements.length + mediaList.length} عنصر
                  </div>
                </div>
              </div>

              {/* Quick Visibility Toggles Matrix */}
              <div className="p-6 rounded-2xl bg-slate-800/40 border border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-white">التحكم السريع في مفاتيح الظهور (Quick Switches):</h3>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {Object.entries(config.sectionVisibility).map(([key, val]) => (
                    <div key={key} className="p-3.5 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                      <span className="text-xs font-bold text-slate-300">
                        {key === 'heroSection' && 'قسم البانر الرئيسي (Hero Section)'}
                        {key === 'heroStats' && 'بطاقات الإحصائيات الأكاديمية'}
                        {key === 'heroButtons' && 'أزرار البانر الرئيسي'}
                        {key === 'telegramCard' && 'بطاقة بوت التلجرام'}
                        {key === 'collegeInfoSection' && 'قسم معلومات الكلية'}
                        {key === 'subjectsSection' && 'قسم المقررات والمواد'}
                        {key === 'scheduleSection' && 'قسم جدول المحاضرات والتذكيرات'}
                        {key === 'resourcesSection' && 'قسم مصادر الدراسة والمراجع'}
                        {key === 'gpaCalculator' && 'حاسبة المعدل التراكمي GPA'}
                        {key === 'pomodoroTimer' && 'مؤقت التركيز والدراسة'}
                        {key === 'announcementsBanner' && 'بانر التنبيهات والإعلانات'}
                        {key === 'contactFooter' && 'فوتر بيانات التواصل'}
                        {key === 'pwaInstallPrompt' && 'نافذة تثبيت التطبيق PWA'}
                      </span>
                      <button
                        onClick={() => handleToggleSection(key as keyof SectionVisibility, !val)}
                        className={`px-3 py-1 rounded-lg text-xs font-bold transition-all ${
                          val ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {val ? 'ON (ظاهر)' : 'OFF (مخفي)'}
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* TAB 2: CONTENT & TEXTS */}
          {activeTab === 'content' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-tajawal text-white pb-3 border-b border-slate-800">
                إدارة نصوص ومعلومات الموقع
              </h2>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">اسم الموقع (Site Title):</label>
                  <input
                    type="text"
                    value={config.siteTitle}
                    onChange={(e) => setConfig({ ...config, siteTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">العنوان الفرعي (Subtitle):</label>
                  <input
                    type="text"
                    value={config.siteSubtitle}
                    onChange={(e) => setConfig({ ...config, siteSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">عنوان البانر الرئيسي (Hero Title):</label>
                  <input
                    type="text"
                    value={config.heroTitle}
                    onChange={(e) => setConfig({ ...config, heroTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">وصف البانر الرئيسي (Hero Subtitle):</label>
                  <textarea
                    rows={2}
                    value={config.heroSubtitle}
                    onChange={(e) => setConfig({ ...config, heroSubtitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">معرف بوت التلجرام (Bot Username):</label>
                  <input
                    type="text"
                    value={config.telegramBotName}
                    onChange={(e) => setConfig({ ...config, telegramBotName: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رابط بوت التلجرام (Telegram Link):</label>
                  <input
                    type="text"
                    value={config.telegramBotLink}
                    onChange={(e) => setConfig({ ...config, telegramBotLink: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">البريد الإلكتروني للتواصل:</label>
                  <input
                    type="email"
                    value={config.contactEmail}
                    onChange={(e) => setConfig({ ...config, contactEmail: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">رقم الهاتف للتواصل:</label>
                  <input
                    type="text"
                    value={config.contactPhone}
                    onChange={(e) => setConfig({ ...config, contactPhone: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block text-xs font-bold text-slate-300 mb-1">نص الفوتر والنشر (Footer Copyright):</label>
                  <input
                    type="text"
                    value={config.footerCopyright}
                    onChange={(e) => setConfig({ ...config, footerCopyright: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs outline-none focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 3: SECTIONS VISIBILITY */}
          {activeTab === 'sections' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-tajawal text-white pb-3 border-b border-slate-800">
                إدارة مفاتيح ظهور الأقسام (Section ON/OFF Control)
              </h2>
              <p className="text-xs text-slate-400">عند تحويل المفتاح إلى OFF يختفي القسم تماماً من واجهة الزوار في الموقع</p>

              <div className="space-y-3">
                {Object.entries(config.sectionVisibility).map(([key, value]) => (
                  <div key={key} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 flex items-center justify-between">
                    <div>
                      <span className="font-bold text-sm text-white block">
                        {key === 'heroSection' && 'قسم البانر الرئيسي (Hero)'}
                        {key === 'heroStats' && 'إحصائيات البانر الرئيسي'}
                        {key === 'heroButtons' && 'أزرار البانر الرئيسي'}
                        {key === 'telegramCard' && 'بطاقة بوت التلجرام'}
                        {key === 'collegeInfoSection' && 'قسم معلومات الكلية والأكاديميا'}
                        {key === 'subjectsSection' && 'قسم المواد والمقررات الأكاديمية'}
                        {key === 'scheduleSection' && 'قسم جدول المحاضرات والتذكيرات'}
                        {key === 'resourcesSection' && 'قسم المصادر والمراجع الأكاديمية'}
                        {key === 'gpaCalculator' && 'نافذة حاسبة المعدل GPA'}
                        {key === 'pomodoroTimer' && 'نافذة مؤقت التركيز Pomodoro'}
                        {key === 'announcementsBanner' && 'بانر التنبيهات والإعلانات'}
                        {key === 'contactFooter' && 'قسم الفوتر وبيانات التواصل'}
                        {key === 'pwaInstallPrompt' && 'شريط تثبيت التطبيق PWA'}
                      </span>
                      <span className="text-xs text-slate-400">مفتاح التحكم: {key}</span>
                    </div>

                    <button
                      onClick={() => handleToggleSection(key as keyof SectionVisibility, !value)}
                      className={`px-5 py-2 rounded-xl font-bold text-xs transition-all ${
                        value
                          ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg'
                          : 'bg-slate-800 hover:bg-slate-700 text-slate-400 border border-slate-700'
                      }`}
                    >
                      {value ? 'مفعل ON (يظهر للناس)' : 'معطل OFF (مخفي)'}
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 4: BUTTONS & LINKS */}
          {activeTab === 'buttons' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-tajawal text-white pb-3 border-b border-slate-800">
                إدارة الأزرار والروابط التفاعلية
              </h2>

              <div className="space-y-4">
                {config.buttons.map((btn, idx) => (
                  <div key={btn.id} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 grid grid-cols-1 sm:grid-cols-3 gap-3 items-center">
                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">اسم الزر:</label>
                      <input
                        type="text"
                        value={btn.label}
                        onChange={(e) => {
                          const updated = [...config.buttons];
                          updated[idx].label = e.target.value;
                          setConfig({ ...config, buttons: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div>
                      <label className="block text-[11px] font-bold text-slate-400 mb-1">الرابط أو الوجهة:</label>
                      <input
                        type="text"
                        value={btn.link}
                        onChange={(e) => {
                          const updated = [...config.buttons];
                          updated[idx].link = e.target.value;
                          setConfig({ ...config, buttons: updated });
                        }}
                        className="w-full px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                      />
                    </div>

                    <div className="flex items-center justify-end gap-2 pt-4 sm:pt-0">
                      <button
                        onClick={() => {
                          const updated = [...config.buttons];
                          updated[idx].visible = !updated[idx].visible;
                          setConfig({ ...config, buttons: updated });
                        }}
                        className={`px-3 py-2 rounded-xl text-xs font-bold transition-all ${
                          btn.visible ? 'bg-emerald-600 text-white' : 'bg-slate-800 text-slate-400'
                        }`}
                      >
                        {btn.visible ? 'ظاهر ON' : 'مخفي OFF'}
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 5: MEDIA & GALLERY */}
          {activeTab === 'media' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-tajawal text-white pb-3 border-b border-slate-800">
                إدارة الصور والملفات والفيديوهات (Media Manager)
              </h2>

              {/* Add New Media Form */}
              <form onSubmit={handleAddMedia} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-3">
                <span className="font-bold text-xs text-blue-400 block">إضافة ملف أو صورة جديدة:</span>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                  <input
                    type="text"
                    placeholder="اسم الملف (مثال: الشعار الرسمي)"
                    value={newMediaName}
                    onChange={(e) => setNewMediaName(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                  />
                  <input
                    type="text"
                    placeholder="رابط الصورة أو الملف URL"
                    value={newMediaUrl}
                    onChange={(e) => setNewMediaUrl(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                  />
                  <select
                    value={newMediaType}
                    onChange={(e) => setNewMediaType(e.target.value as any)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs outline-none"
                  >
                    <option value="image">صورة Image</option>
                    <option value="logo">شعار Logo</option>
                    <option value="pdf">مستند PDF</option>
                    <option value="video">فيديو Video</option>
                  </select>
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>إضافة للمكتبة</span>
                </button>
              </form>

              {/* Media List Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {mediaList.map((m) => (
                  <div key={m.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3 overflow-hidden">
                      {m.type === 'image' || m.type === 'logo' ? (
                        <img src={m.url} alt={m.name} className="w-12 h-12 rounded-xl object-cover bg-slate-900 flex-shrink-0" />
                      ) : (
                        <div className="w-12 h-12 rounded-xl bg-blue-950 text-blue-400 flex items-center justify-center flex-shrink-0 font-bold text-xs">
                          {m.type.toUpperCase()}
                        </div>
                      )}
                      <div className="truncate">
                        <span className="font-bold text-xs text-white block truncate">{m.name}</span>
                        <span className="text-[10px] text-slate-400 block truncate">{m.url}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => FirebaseService.deleteMedia(m.id)}
                      className="p-2 text-rose-400 hover:bg-rose-950/50 rounded-xl transition-all"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 6: ANNOUNCEMENTS & ADS */}
          {activeTab === 'announcements' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-tajawal text-white pb-3 border-b border-slate-800">
                إدارة الأخبار والتنبيهات والإعلانات (Announcements)
              </h2>

              <form onSubmit={handleAddAnnouncement} className="p-4 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-3">
                <span className="font-bold text-xs text-purple-400 block">إضافة إعلان أو تنبيه جديد:</span>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <input
                    type="text"
                    placeholder="عنوان الإعلان (هام، جدول الإمتحانات...)"
                    value={newAnnTitle}
                    onChange={(e) => setNewAnnTitle(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="شارة التمييز (مثال: هام / جديد / تنبيه)"
                    value={newAnnBadge}
                    onChange={(e) => setNewAnnBadge(e.target.value)}
                    className="px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                  <input
                    type="text"
                    placeholder="نص الإعلان التفصيلي"
                    value={newAnnContent}
                    onChange={(e) => setNewAnnContent(e.target.value)}
                    className="sm:col-span-2 px-3.5 py-2.5 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs"
                  />
                </div>
                <button
                  type="submit"
                  className="px-5 py-2.5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center justify-center gap-2"
                >
                  <Plus className="w-4 h-4" />
                  <span>نشر الإعلان مباشرة</span>
                </button>
              </form>

              <div className="space-y-3">
                {announcements.map((ann) => (
                  <div key={ann.id} className="p-4 rounded-2xl bg-slate-800/40 border border-slate-800 flex items-center justify-between">
                    <div>
                      <div className="flex items-center gap-2 mb-1">
                        <span className="px-2 py-0.5 rounded-md bg-purple-500/20 text-purple-300 font-bold text-[10px]">
                          {ann.badge}
                        </span>
                        <span className="font-bold text-sm text-white">{ann.title}</span>
                      </div>
                      <p className="text-xs text-slate-400">{ann.content}</p>
                    </div>

                    <button
                      onClick={() => FirebaseService.deleteAnnouncement(ann.id)}
                      className="p-2 text-rose-400 hover:bg-rose-950/50 rounded-xl"
                    >
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* TAB 7: DESIGN & COLORS */}
          {activeTab === 'design' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-tajawal text-white pb-3 border-b border-slate-800">
                تخصيص الألوان والمظهر
              </h2>

              <div>
                <label className="block text-xs font-bold text-slate-300 mb-2">اللون الرئيسي المميز للموقع (Primary Accent Color):</label>
                <div className="flex items-center gap-3">
                  <input
                    type="color"
                    value={config.primaryColor}
                    onChange={(e) => setConfig({ ...config, primaryColor: e.target.value })}
                    className="w-12 h-12 rounded-xl border-none cursor-pointer bg-slate-800 p-1"
                  />
                  <span className="font-mono text-sm text-white font-bold">{config.primaryColor}</span>
                </div>
              </div>
            </div>
          )}

          {/* TAB 8: SEO */}
          {activeTab === 'seo' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-tajawal text-white pb-3 border-b border-slate-800">
                إعدادات SEO ومحركات البحث
              </h2>

              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">عنوان الصفحة SEO Title:</label>
                  <input
                    type="text"
                    value={config.seoTitle}
                    onChange={(e) => setConfig({ ...config, seoTitle: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">وصف المحركات Meta Description:</label>
                  <textarea
                    rows={3}
                    value={config.seoDescription}
                    onChange={(e) => setConfig({ ...config, seoDescription: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-300 mb-1">الكلمات المفتاحية Keywords:</label>
                  <input
                    type="text"
                    value={config.seoKeywords}
                    onChange={(e) => setConfig({ ...config, seoKeywords: e.target.value })}
                    className="w-full px-3.5 py-2.5 rounded-xl bg-slate-800 border border-slate-700 text-white text-xs"
                  />
                </div>
              </div>
            </div>
          )}

          {/* TAB 9: BACKUP & LOGS */}
          {activeTab === 'backup_logs' && (
            <div className="space-y-6">
              <h2 className="text-xl font-bold font-tajawal text-white pb-3 border-b border-slate-800">
                النسخ الاحتياطي وسجل إجراءات المسؤول
              </h2>

              {/* Backup / Export Section */}
              <div className="p-5 rounded-2xl bg-slate-800/60 border border-slate-800 space-y-4">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Download className="w-4 h-4 text-blue-400" />
                  <span>تصدير واستعادة النسخة الاحتياطية (JSON Backup)</span>
                </h3>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleExportBackup}
                    className="px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <Download className="w-4 h-4" />
                    <span>تنزيل نسخة احتياطية كاملة JSON</span>
                  </button>
                </div>

                <div className="pt-3 border-t border-slate-700 space-y-2">
                  <label className="block text-xs font-bold text-slate-300">استعادة من كود JSON:</label>
                  <textarea
                    rows={3}
                    placeholder="أصق كود JSON الخاص بالنسخة الاحتياطية هنا..."
                    value={importJsonText}
                    onChange={(e) => setImportJsonText(e.target.value)}
                    className="w-full px-3.5 py-2 rounded-xl bg-slate-900 border border-slate-700 text-white text-xs font-mono"
                  />
                  <button
                    onClick={handleImportBackup}
                    className="px-5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs flex items-center gap-2"
                  >
                    <Upload className="w-4 h-4" />
                    <span>تأفيذ استعادة النسخة</span>
                  </button>
                </div>
              </div>

              {/* Action Logs Table */}
              <div className="space-y-3">
                <h3 className="font-bold text-sm text-white flex items-center gap-2">
                  <Clock className="w-4 h-4 text-amber-400" />
                  <span>سجل إجراءات المسؤول (Admin Audit Logs):</span>
                </h3>

                <div className="space-y-2 max-h-80 overflow-y-auto">
                  {adminLogs.map((log) => (
                    <div key={log.id} className="p-3 rounded-xl bg-slate-800/40 border border-slate-800 flex items-center justify-between text-xs">
                      <div>
                        <span className="font-bold text-white block">{log.action}</span>
                        <span className="text-slate-400 text-[11px]">{log.details}</span>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono">
                        {new Date(log.timestamp).toLocaleString('ar-EG')}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

            </div>
          )}

        </main>
      </div>
    </div>
  );
};
