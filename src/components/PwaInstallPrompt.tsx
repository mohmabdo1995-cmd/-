import React, { useState, useEffect, useCallback } from 'react';
import { Download, X, Smartphone, CheckCircle2, Zap, WifiOff, Bell, Share2, PlusSquare, Sparkles, ExternalLink, GraduationCap, ArrowLeft } from 'lucide-react';

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed'; platform: string }>;
}

declare global {
  interface Window {
    __deferredPWAInstallPrompt?: BeforeInstallPromptEvent | null;
  }
}

export const PwaInstallPrompt: React.FC = () => {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [isOpen, setIsOpen] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);
  const [isIOS, setIsIOS] = useState(false);
  const [isInIframe, setIsInIframe] = useState(false);
  const [showIOSGuide, setShowIOSGuide] = useState(false);
  const [showManualGuide, setShowManualGuide] = useState(false);
  const [installedSuccess, setInstalledSuccess] = useState(false);
  const [isInstalling, setIsInstalling] = useState(false);

  useEffect(() => {
    // 1. Detect if app is already running as installed standalone PWA
    const isStandalone =
      window.matchMedia('(display-mode: standalone)').matches ||
      (window.navigator as unknown as { standalone?: boolean }).standalone === true ||
      document.referrer.includes('android-app://');

    if (isStandalone) {
      setIsInstalled(true);
      return;
    }

    // 2. Detect if inside an iframe (like AI Studio preview)
    const inIframe = window.self !== window.top;
    setIsInIframe(inIframe);

    // 3. Detect iOS Safari
    const userAgent = window.navigator.userAgent.toLowerCase();
    const isIOSDevice = /iphone|ipad|ipod/.test(userAgent) && !(window as any).MSStream;
    setIsIOS(isIOSDevice);

    // 4. Check if beforeinstallprompt was already captured in index.html
    if (window.__deferredPWAInstallPrompt) {
      setDeferredPrompt(window.__deferredPWAInstallPrompt);
    }

    // 5. Listen to native beforeinstallprompt event
    const handleBeforeInstall = (e: Event) => {
      e.preventDefault();
      const promptEvent = e as BeforeInstallPromptEvent;
      window.__deferredPWAInstallPrompt = promptEvent;
      setDeferredPrompt(promptEvent);
      console.log('[PWA] beforeinstallprompt captured successfully.');
    };

    // Custom event dispatched from index.html if captured early
    const handleEarlyPromptAvailable = (e: Event) => {
      const customEvent = e as CustomEvent<BeforeInstallPromptEvent>;
      if (customEvent.detail) {
        setDeferredPrompt(customEvent.detail);
      } else if (window.__deferredPWAInstallPrompt) {
        setDeferredPrompt(window.__deferredPWAInstallPrompt);
      }
    };

    const handleAppInstalled = () => {
      setIsInstalled(true);
      setIsOpen(false);
      setIsInstalling(false);
      setInstalledSuccess(true);
      setDeferredPrompt(null);
      window.__deferredPWAInstallPrompt = null;
      setTimeout(() => setInstalledSuccess(false), 6000);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstall);
    window.addEventListener('pwa-prompt-available', handleEarlyPromptAvailable);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Listen to manual triggers from any button in the app (Header, Hero, etc.)
    const handleTriggerInstall = () => {
      triggerInstall();
    };
    window.addEventListener('trigger-pwa-install', handleTriggerInstall);

    // 6. Auto-show modal upon opening the site (similar to موقع الديوان) after a short delay
    const hasDismissed = sessionStorage.getItem('pwa_prompt_dismissed_session');
    if (!hasDismissed && !isStandalone) {
      const timer = setTimeout(() => {
        setIsOpen(true);
      }, 1200);
      return () => {
        clearTimeout(timer);
        window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
        window.removeEventListener('pwa-prompt-available', handleEarlyPromptAvailable);
        window.removeEventListener('appinstalled', handleAppInstalled);
        window.removeEventListener('trigger-pwa-install', handleTriggerInstall);
      };
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstall);
      window.removeEventListener('pwa-prompt-available', handleEarlyPromptAvailable);
      window.removeEventListener('appinstalled', handleAppInstalled);
      window.removeEventListener('trigger-pwa-install', handleTriggerInstall);
    };
  }, []);

  const handleDismiss = () => {
    setIsOpen(false);
    sessionStorage.setItem('pwa_prompt_dismissed_session', 'true');
  };

  // Primary install action triggered by clicking any install button
  const triggerInstall = useCallback(async () => {
    const promptEvent = deferredPrompt || window.__deferredPWAInstallPrompt;

    // Case 1: Native PWA prompt available (Chrome / Android / Edge) -> Automatic 1-touch install
    if (promptEvent) {
      try {
        setIsInstalling(true);
        await promptEvent.prompt();
        const choice = await promptEvent.userChoice;
        if (choice.outcome === 'accepted') {
          setIsInstalled(true);
          setIsOpen(false);
          setInstalledSuccess(true);
          setTimeout(() => setInstalledSuccess(false), 6000);
        }
        setDeferredPrompt(null);
        window.__deferredPWAInstallPrompt = null;
      } catch (err) {
        console.warn('Install prompt error:', err);
        setShowManualGuide(true);
        setIsOpen(true);
      } finally {
        setIsInstalling(false);
      }
      return;
    }

    // Case 2: iOS Safari -> Display iOS 1-step Guide
    if (isIOS) {
      setShowIOSGuide(true);
      setIsOpen(true);
      return;
    }

    // Case 3: Inside an iframe (AI Studio preview) where iframe security suppresses prompt
    if (isInIframe) {
      setIsOpen(true);
      setShowManualGuide(true);
      return;
    }

    // Case 4: Default fallback instructions
    setShowManualGuide(true);
    setIsOpen(true);
  }, [deferredPrompt, isIOS, isInIframe]);

  // If already running as an installed standalone app, hide the prompt
  if (isInstalled) {
    return null;
  }

  return (
    <>
      {/* Toast Notification when successfully installed */}
      {installedSuccess && (
        <div className="fixed top-6 left-1/2 -translate-x-1/2 z-50 bg-[#071A3D] text-white px-6 py-4 rounded-2xl shadow-2xl border-2 border-[#16958E] flex items-center gap-3 text-sm font-bold font-tajawal animate-bounce max-w-sm text-center">
          <div className="w-9 h-9 rounded-xl bg-[#16958E] flex items-center justify-center flex-shrink-0">
            <GraduationCap className="w-5 h-5 text-white" />
          </div>
          <div>
            <div className="text-[#BCEBFF] text-xs font-bold">تم التثبيت بنجاح! 🎓</div>
            <div className="text-white text-xs">ستجد التطبيق الآن في قائمة تطبيقات هاتفك بشعار قبعة التخرج.</div>
          </div>
        </div>
      )}

      {/* Floating Quick Install Pill (visible when modal is closed) */}
      {!isOpen && (
        <button
          onClick={triggerInstall}
          className="fixed bottom-20 sm:bottom-6 left-4 z-40 flex items-center gap-2.5 px-4 py-2.5 rounded-full bg-[#071A3D] text-white hover:bg-[#16958E] border-2 border-[#16958E]/60 shadow-2xl shadow-[#071A3D]/40 transition-all hover:scale-105 active:scale-95 text-xs font-bold font-tajawal group"
          title="تثبيت التطبيق على هاتفك بشعار قبعة التخرج"
        >
          <span className="relative flex h-3 w-3">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[#16958E] opacity-75"></span>
            <span className="relative inline-flex rounded-full h-3 w-3 bg-[#BCEBFF]"></span>
          </span>
          <div className="w-5 h-5 rounded-md bg-[#16958E] flex items-center justify-center group-hover:rotate-12 transition-transform">
            <GraduationCap className="w-3.5 h-3.5 text-white" />
          </div>
          <span>تثبيت التطبيق 📲</span>
        </button>
      )}

      {/* Modal Dialog (Educational Platform Style - موقع الديوان) */}
      {isOpen && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-[#071A3D]/75 backdrop-blur-md animate-fade-in" 
          dir="rtl"
          onClick={handleDismiss}
        >
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
              title="إغلاق"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header Content with Graduation Cap Logo */}
            <div className="text-center mt-2 mb-5">
              <div className="relative inline-block mb-3">
                <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-[#071A3D] to-[#16958E] text-white flex items-center justify-center mx-auto shadow-xl shadow-[#16958E]/30 border-2 border-[#BCEBFF]/50 p-2">
                  <img
                    src="/pwa-192x192.png"
                    alt="شعار قبعة التخرج"
                    className="w-full h-full object-contain rounded-xl"
                    onError={(e) => {
                      // Fallback icon if image fails to render
                      (e.target as HTMLElement).style.display = 'none';
                    }}
                  />
                  <GraduationCap className="w-10 h-10 text-[#BCEBFF] hidden only:block" />
                </div>
                <div className="absolute -bottom-1 -right-1 bg-[#16958E] text-white p-1 rounded-full border-2 border-white dark:border-[#071A3D]">
                  <Sparkles className="w-3.5 h-3.5 text-[#BCEBFF]" />
                </div>
              </div>

              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#16958E]/15 text-[#16958E] dark:text-[#BCEBFF] text-xs font-bold mb-2 border border-[#16958E]/30">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>تطبيق جامعي رسمي خفيف وسريع</span>
              </div>

              <h3 className="text-xl sm:text-2xl font-extrabold font-tajawal text-[#071A3D] dark:text-white leading-snug">
                تثبيت تطبيق "دليلك الجامعي"
              </h3>
              <p className="text-xs text-slate-500 dark:text-[#BCEBFF]/90 mt-1.5 leading-relaxed max-w-sm mx-auto">
                يتحول الموقع مباشرة إلى تطبيق مثبت في هاتفك مع شعار قبعة التخرج في قائمة تطبيقاتك العادية!
              </p>
            </div>

            {/* Special alert if testing inside an iframe */}
            {isInIframe && (
              <div className="bg-[#BCEBFF]/25 dark:bg-[#0a2558]/70 rounded-2xl p-3.5 border border-[#16958E]/40 mb-4 text-xs text-right">
                <div className="flex items-center gap-2 font-bold text-[#16958E] dark:text-[#BCEBFF] mb-1">
                  <ExternalLink className="w-4 h-4 flex-shrink-0" />
                  <span>لتثبيت التطبيق على هاتفك مباشرة:</span>
                </div>
                <p className="text-slate-600 dark:text-slate-200 text-[11px] leading-relaxed mb-2">
                  نظراً لتصفحك من داخل نافذة العرض، اضغط على الزر بالأسفل لفتح الرابط مباشرة في متصفح هاتفك (Chrome / Safari) وسيظهر أمر التثبيت التلقائي فوراً!
                </p>
                <a
                  href={window.location.href}
                  target="_top"
                  className="w-full inline-flex items-center justify-center gap-2 py-2 px-3 rounded-xl bg-[#071A3D] text-white font-bold text-xs hover:bg-[#16958E] transition-colors"
                >
                  <ExternalLink className="w-3.5 h-3.5 text-[#BCEBFF]" />
                  <span>فتح الرابط المباشر للتثبيت الفوري</span>
                </a>
              </div>
            )}

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
                      اضغط على زر <strong>المشاركة (Share)</strong> <Share2 className="w-3.5 h-3.5 inline mx-1 text-[#16958E]" /> أسفل شاشة متصفح Safari.
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
                      اضغط على كلمة <strong>"إضافة (Add)"</strong> وسيظهر التطبيق فوراً بشعار قبعة التخرج بين تطبيقاتك!
                    </p>
                  </div>
                </div>
              </div>
            ) : showManualGuide && !isInIframe ? (
              <div className="bg-[#BCEBFF]/15 dark:bg-[#0a2558]/50 rounded-2xl p-4 border border-[#16958E]/30 mb-5 space-y-3 text-right animate-fade-in">
                <div className="flex items-center justify-between text-xs font-bold text-[#16958E] dark:text-[#BCEBFF]">
                  <span>طريقة التثبيت التلقائي عبر المتصفح:</span>
                  <button
                    onClick={() => setShowManualGuide(false)}
                    className="text-xs underline text-slate-400 hover:text-white"
                  >
                    رجوع
                  </button>
                </div>
                <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300">
                  <p>1. اضغط على زر القائمة <strong>(⋮)</strong> أعلى يسار المتصفح.</p>
                  <p>2. اختر <strong>"تثبيت التطبيق"</strong> (Install app) أو "إضافة إلى الشاشة الرئيسية".</p>
                  <p>3. اضغط تثبيت، وسيظهر التطبيق تلقائياً في قائمة تطبيقات هاتفك مع قبعة التخرج.</p>
                </div>
              </div>
            ) : (
              /* Features List */
              <div className="space-y-2.5 mb-6 text-right">
                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#BCEBFF]/20 dark:bg-[#0a2558]/40 border border-[#BCEBFF]/50 dark:border-[#16958E]/20">
                  <div className="w-8 h-8 rounded-xl bg-[#16958E]/15 text-[#16958E] flex items-center justify-center flex-shrink-0">
                    <GraduationCap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#071A3D] dark:text-white">يظهر مع شعار قبعة التخرج</h4>
                    <p className="text-[11px] text-slate-500 dark:text-[#BCEBFF]/80">يظهر في قائمة تطبيقات هاتفك وشاشتك الرئيسية مثل أي تطبيق أصلي.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#BCEBFF]/20 dark:bg-[#0a2558]/40 border border-[#BCEBFF]/50 dark:border-[#16958E]/20">
                  <div className="w-8 h-8 rounded-xl bg-[#16958E]/15 text-[#16958E] flex items-center justify-center flex-shrink-0">
                    <WifiOff className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#071A3D] dark:text-white">يعمل بدون إنترنت</h4>
                    <p className="text-[11px] text-slate-500 dark:text-[#BCEBFF]/80">تصفح المقررات والجداول والمواد التعليمية في أي وقت ومن أي مكان.</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 p-2.5 rounded-2xl bg-[#BCEBFF]/20 dark:bg-[#0a2558]/40 border border-[#BCEBFF]/50 dark:border-[#16958E]/20">
                  <div className="w-8 h-8 rounded-xl bg-[#16958E]/15 text-[#16958E] flex items-center justify-center flex-shrink-0">
                    <Zap className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-[#071A3D] dark:text-white">سرعة فائقة وخفة تامة</h4>
                    <p className="text-[11px] text-slate-500 dark:text-[#BCEBFF]/80">يفتح بملء الشاشة وبدون شريط عنوان المتصفح، بدون استهلاك للذاكرة.</p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="space-y-2">
              <button
                onClick={triggerInstall}
                disabled={isInstalling}
                className="w-full py-3.5 px-4 rounded-2xl bg-gradient-to-r from-[#16958E] via-[#127d77] to-[#071A3D] hover:from-[#127d77] hover:to-[#071A3D] text-white font-extrabold text-sm flex items-center justify-center gap-2 shadow-lg shadow-[#16958E]/30 transition-all hover:scale-[1.02] active:scale-[0.98] disabled:opacity-60 cursor-pointer"
              >
                {isInstalling ? (
                  <>
                    <span className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></span>
                    <span>جاري التثبيت التلقائي...</span>
                  </>
                ) : (
                  <>
                    <Download className="w-4 h-4 stroke-[2.5]" />
                    <span>تثبيت التطبيق الآن (Install) 🎓</span>
                  </>
                )}
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
