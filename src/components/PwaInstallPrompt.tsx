import React, { useState, useEffect } from 'react';
import { Download, X, Smartphone, CheckCircle2, Zap, WifiOff, Bell, Share2, PlusSquare, ArrowLeft, Sparkles } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);

  useEffect(() => {
    // 1. Detect if already installed or running in standalone mode
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Detect iOS device
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // 3. Capture native PWA install prompt
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      setDeferredPrompt(e as BeforeInstallPromptEvent);
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsOpen(false);
      setInstalledSuccess(true);
      setDeferredPrompt(null);
      setTimeout(() => setInstalledSuccess(false), 5000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen to manual triggers from any button in the app
    const handleManualOpen = () => {
      setIsOpen(true);
    };
    window.addEventListener('open-pwa-install', handleManualOpen);

    // 4. Auto-show modal upon opening the site (like موقع الديوان) after a short smooth delay
    const hasDismissed = sessionStorage.getItem('pwa_prompt_dismissed_session');
    if (!hasDismissed) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1500);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('open-pwa-install', handleManualOpen);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('open-pwa-install', handleManualOpen);
    };
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('pwa_prompt_dismissed_session', 'true');
  };

  const handleInstallClick = async () => {
    // A. If native deferred prompt is available (Android, Edge, Chrome)
    if (deferredPrompt) {
      try {
        await deferredPrompt.prompt();
        const choice = await deferredPrompt.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setIsOpen(false);
          setInstalledSuccess(true);
          setTimeout(() => setInstalledSuccess(false), 5000);
        }
        setDeferredPrompt(null);
      } catch (err) {
        console.warn('Install prompt error:', err);
        setShowManualGuide(true);
      }
      return;
    }

    // B. If iOS device (Safari)
    if (isIOS) {
      setShowIOSGuide(true);
      return;
    }

    // C. If browser doesn't support or already fired beforeinstallprompt
    setShowManualGuide(true);
  };

  // If already running as installed application, do not show anything
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Toast Notification when successfully installed */}
      {installedSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#071A3D] text-white px-6 py-3.5 rounded-2xl shadow-2xl border border-[#16958E] flex items-center gap-3 text-sm font-bold font-tajawal animate-bounce">
          <CheckCircle2 className="w-5 h-5 text-[#16958E]" />
          <span>تم تثبيت التطبيق بنجاح! ستجده الآن مع قائمة تطبيقاتك 🎓</span>
        </div>
      )}

      {/* Floating Quick Install Pill (visible when modal is closed) */}
      {!isOpen && (
        <button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-20 sm:bottom-6 left-4 z-40 flex items-center gap-2 px-3.5 py-2 rounded-full bg-[#071A3D] text-white hover:bg-[#16958E] border border-[#16958E]/40 shadow-xl shadow-[#071A3D]/30 transition-all hover:scale-105 active:scale-95 text-xs font-bold font-tajawal group"
          title="تثبيت التطبيق على جهازك"
        >
          <span className="relative flex h-2.5 w-2.5">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16958E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-[#BCEBFF]"></span>
          </span>
          <Download className="w-4 h-4 text-[#BCEBFF] group-hover:rotate-12 transition-transform" />
          <span>تثبيت التطبيق 📲</span>
        </button>
      )}

      {/* Modal Backdrop & Dialog (Educational Platform Style - موقع الديوان) */}
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center sm:items-center justify-center p-4 bg-[#071A3D]/70 backdrop-blur-md animate-fade-in" dir="rtl">
          <div
            className="w-full max-w-md bg-white dark:bg-[#071A3D] rounded-3xl p-6 sm:p-7 border border-[#BCEBFF]/80 dark:border-[#16958E]/40 shadow-2xl relative overflow-hidden text-slate-800 dark:text-white transition-all transform animate-scale-in"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top decorative gradient bar */}
            <div className="absolute top-0 right-0 left-0 h-2 bg-gradient-to-r from-[#071A3D] via-[#16958E] to-[#BCEBFF]" />

            {/* Close button */}
            <button
              onClick={handleDismiss}
              className="absolute top-4 left-4 p-2 rounded-full text-slate-400 hover:text-slate-700 dark:hover:text-white hover:bg-[#BCEBFF]/20 transition-colors"
              title="إغلاق النافذة"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Content */}
            <div className="text-center mt-2 mb-5">
              <div className="relative inline-block mb-3">
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-tr from-[#071A3D] to-[#16958E] text-white flex items-center justify-center mx-auto shadow-lg shadow-[#16958E]/30 border-2 border-[#BCEBFF]/50">
                  <Smartphone className="w-8 h-8 text-[#BCEBFF]" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#16958E] text-white p-1 rounded-full border-2 border-white dark:border-[#071A3D]">
                  <Sparkles className="w-3.5 h-3.5 text-[#BCEBFF]" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16958E]/15 text-[#16958E] dark:text-[#BCEBFF] text-xs font-bold mb-2 border border-[#16958E]/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تطبيق ويب رسمي ومعتمد مجاناً 100%</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold font-tajawal text-[#071A3D] dark:text-white leading-snug">
                تثبيت تطبيق "دليلك الجامعي"
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#BCEBFF]/90 mt-1.5 leading-relaxed max-w-sm mx-auto">
                قم بتثبيت الموقع كتطبيق على جوالك ليظهر في قائمة تطبيقاتك وتفتحه مباشرة بدون متصفح!
              </p>
            </div>

            {/* Interactive iOS / Manual Guide View if requested */}
            {showIOSGuide ? (
              <div className="bg-[#BCEBFF]/15 dark:bg-[#0a2558]/50 rounded-2xl p-4 border border-[#16958E]/30 mb-5 space-y-3 text-right animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-[#16958E] dark:text-[#BCEBFF]">
                  <span className="flex items-center gap-1.5">
                    <Share2 className="w-4 h-4" />
                    <span>خطوات التثبيت على أجهزة iPhone / iPad (Safari):</span>
                  </span>
                  <button
                    onClick={() => setShowIOSGuide(false)}
                    className="text-xs underline text-slate-400 hover:text-white"
                  >
                    رجوع
                  </button>
                </div>

                <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300">
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#16958E] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">1</span>
                    <p>
                      اضغط على زر <strong>المشاركة (Share)</strong> <Share2 className="w-3.5 h-3.5 inline mx-1 text-[#16958E]" /> أسفل شاشة المتصفح.
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#16958E] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">2</span>
                    <p>
                      مرر القائمة لأسفل ثم اختر <strong>"إضافة إلى الصفحة الرئيسية"</strong> <PlusSquare className="w-3.5 h-3.5 inline mx-1 text-[#16958E]" /> (Add to Home Screen).
                    </p>
                  </div>
                  <div className="flex items-start gap-2">
                    <span className="w-5 h-5 rounded-full bg-[#16958E] text-white flex items-center justify-center text-[11px] font-bold flex-shrink-0 mt-0.5">3</span>
                    <p>
                      اضغط على كلمة <strong>"إضافة (Add)"</strong> أعلى يمين الشاشة، وسيظهر التطبيق فوراً بين تطبيقاتك!
                    </p>
                  </div>
                </div>
              </div>
            ) : showManualGuide ? (
              <div className="bg-[#BCEBFF]/15 dark:bg-[#0a2558]/50 rounded-2xl p-4 border border-[#16958E]/30 mb-5 space-y-3 text-right animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-[#16958E] dark:text-[#BCEBFF]">
                  <span>طريقة التثبيت السريع عبر المتصفح:</span>
                  <button
                    onClick={() => setShowManualGuide(false)}
                    className="text-xs underline text-slate-400 hover:text-white"
                  >
                    رجوع
                  </button>
                </div>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p>1. اضغط على زر القائمة <strong>(⋮) أو (⋯)</strong> في أعلى أو أسفل المتصفح.</p>
                  <p>2. اختر <strong>"تثبيت التطبيق"</strong> أو <strong>"إضافة إلى الشاشة الرئيسية"</strong>.</p>
                  <p>3. أكّد التثبيت وسيصبح التطبيق متاحاً في قائمة تطبيقات هاتفك العادية.</p>
                </div>
              </div>
            ) : (
              /* Features List */
              <div className="space-y-2.5 mb-6 text-right">
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#BCEBFF]/20 dark:bg-[#0a2558]/40 border border-[#BCEBFF]/50 dark:border-[#16958E]/20">
                  <div className="w-8 h-8 rounded-xl bg-[#16958E]/15 text-[#16958E] flex items-center justify-center flex-shrink-0">
                    <Smartphone className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#071A3D] dark:text-white">يظهر في قائمة تطبيقاتك</h4>
                    <p className="text-[11px] text-slate-500 dark:text-[#BCEBFF]/80">يفتح بملء الشاشة وبدون شريط عنوان المتصفح كأي تطبيق رسمي.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#BCEBFF]/20 dark:bg-[#0a2558]/40 border border-[#BCEBFF]/50 dark:border-[#16958E]/20">
                  <div className="w-8 h-8 rounded-xl bg-[#16958E]/15 text-[#16958E] flex items-center justify-center flex-shrink-0">
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#071A3D] dark:text-white">يعمل بدون إنترنت</h4>
                    <p className="text-[11px] text-slate-500 dark:text-[#BCEBFF]/80">تصفح المقررات والجداول والمعلومات المحفوظة في أي وقت.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#BCEBFF]/20 dark:bg-[#0a2558]/40 border border-[#BCEBFF]/50 dark:border-[#16958E]/20">
                  <div className="w-8 h-8 rounded-xl bg-[#16958E]/15 text-[#16958E] flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#071A3D] dark:text-white">سرعة فائقة وخفة تامة</h4>
                    <p className="text-[11px] text-slate-500 dark:text-[#BCEBFF]/80">أسرع 3 مرات من تصفح الويب ويوفر استهلاك بطارية الهاتف والباقة.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={handleInstallClick}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#16958E] to-[#127d77] hover:from-[#127d77] hover:to-[#0f6762] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#16958E]/30 transition-all hover:scale-[1.02] active:scale-[0.98]"
              >
                <Download className="w-4 h-4 stroke-[2.5]" />
                <span>تثبيت التطبيق الآن (Install)</span>
              </button>

              <button
                onClick={handleDismiss}
                className="w-full py-2.5 px-4 rounded-2xl bg-[#BCEBFF]/30 hover:bg-[#BCEBFF]/60 dark:bg-white/5 dark:hover:bg-white/10 text-slate-600 dark:text-slate-300 font-bold text-xs transition-colors"
              >
                المتابعة عبر المتصفح (لاحقاً)
              </button>
            </div>

            {/* Footer Note */}
            <p className="text-center text-[10px] text-slate-400 mt-4">
              لا يشغل أي مساحة من الذاكرة • آمن وموثوق بنسبة 100%
            </p>
          </div>
        </div>
      )}
    </>
  );
};

