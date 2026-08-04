import React, { useState } from 'react';
import { ActivePage } from '../types';
import { BookOpen, Calendar, Send, Bell, GraduationCap, Home, Sparkles, Plus, Calculator, Timer, Download, PackageCheck } from 'lucide-react';

interface HeaderProps {
  activePage: ActivePage;
  setActivePage: (page: ActivePage) => void;
  onOpenGpa: () => void;
  onOpenPomodoro: () => void;
  onOpenAddLecture: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  activePage,
  setActivePage,
  onOpenGpa,
  onOpenPomodoro,
  onOpenAddLecture
}) => {
  const [showDownloadMenu, setShowDownloadMenu] = useState(false);

  return (
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-slate-200/80 dark:border-slate-800/80 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-3 cursor-pointer group" onClick={() => setActivePage('landing')}>
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-blue-600 flex items-center justify-center text-white shadow-lg shadow-blue-500/25 group-hover:scale-105 transition-all duration-300 flex-shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2]" />
            </div>
            <div>
              <h1 className="text-base sm:text-xl font-bold font-tajawal text-slate-800 dark:text-white tracking-tight">
                دليلك الجامعي
              </h1>
              <span className="text-[10px] sm:text-xs font-medium text-slate-500 dark:text-slate-400 flex items-center gap-1">
                <Sparkles className="w-3 h-3 text-blue-500 inline" />
                جامعتك في جيبك
              </span>
            </div>
          </div>

          {/* Action Buttons: Focus, Download ZIP, Telegram Bot, Theme Toggle */}
          <div className="flex items-center gap-1.5 sm:gap-3">
            {/* Focus / Pomodoro Button */}
            <button
              onClick={onOpenPomodoro}
              title="مؤقت الدراسة والتركيز"
              className="hidden sm:flex p-2 sm:px-3 sm:py-2 rounded-xl bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-xs font-semibold items-center gap-1.5 transition-all"
            >
              <Timer className="w-4 h-4 text-amber-500" />
              <span>التركيز</span>
            </button>

            {/* Download Zip Dropdown */}
            <div className="relative hidden sm:block">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                title="تحميل المشروع ZIP"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-blue-50 hover:bg-blue-100 dark:bg-blue-950/60 dark:hover:bg-blue-900/60 text-blue-600 dark:text-blue-400 text-xs font-bold flex items-center gap-1.5 transition-all border border-blue-200/60 dark:border-blue-800/60"
              >
                <Download className="w-4 h-4" />
                <span>تحميل ZIP</span>
              </button>

              {showDownloadMenu && (
                <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-64 glass-panel rounded-2xl p-3 shadow-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 z-50 animate-scale-in text-right">
                  <div className="text-[11px] font-bold text-slate-400 mb-2 px-2">اختر صيغة التحميل المطلوبة:</div>
                  <a
                    href="/dist_web_app.zip"
                    download="dist_web_app.zip"
                    onClick={() => setShowDownloadMenu(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-slate-800 dark:text-white mb-1 group"
                  >
                    <div>
                      <span className="block font-tajawal text-blue-600 dark:text-blue-400">نسخة الاستضافة والعمل بدون إنترنت (HTML/JS)</span>
                      <span className="text-[10px] text-slate-400 font-normal">جاهز للرفع على أي استضافة أونلاين أو أوفلاين</span>
                    </div>
                    <PackageCheck className="w-4 h-4 text-blue-500 flex-shrink-0 mr-2" />
                  </a>

                  <a
                    href="/project_source.zip"
                    download="project_source.zip"
                    onClick={() => setShowDownloadMenu(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 transition-colors text-xs font-bold text-slate-800 dark:text-white group"
                  >
                    <div>
                      <span className="block font-tajawal text-purple-600 dark:text-purple-400">الكود المصدري الكامل (Source Code)</span>
                      <span className="text-[10px] text-slate-400 font-normal">يتضمن ملفات React و TypeScript والمكونات</span>
                    </div>
                    <Download className="w-4 h-4 text-purple-500 flex-shrink-0 mr-2" />
                  </a>
                </div>
              )}
            </div>

            {/* Telegram Bot Button - STRICT REQUIREMENT */}
            <a
              href="http://t.me/Daleelak_AlJamaei_bot"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-1.5 px-2.5 sm:px-4 py-2 rounded-xl bg-gradient-to-r from-sky-500 to-blue-600 hover:from-sky-600 hover:to-blue-700 text-white font-bold text-xs sm:text-sm shadow-md shadow-sky-500/20 hover:shadow-lg hover:shadow-sky-500/30 transition-all duration-200 active:scale-95"
            >
              <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180" />
              <span>بوت التلجرام</span>
            </a>
          </div>

        </div>
      </div>
    </header>
  );
};
