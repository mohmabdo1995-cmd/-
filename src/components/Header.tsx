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
    <header className="sticky top-0 z-40 w-full glass-panel border-b border-[#BCEBFF]/60 dark:border-[#16958E]/30 backdrop-blur-md transition-colors duration-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16 sm:h-20">
          
          {/* Logo & Brand */}
          <div className="flex items-center gap-2 sm:gap-3 cursor-pointer group flex-shrink-0" onClick={() => setActivePage('landing')}>
            <div className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl bg-[#071A3D] flex items-center justify-center text-white shadow-md sm:shadow-lg shadow-[#071A3D]/25 group-hover:scale-105 transition-all duration-300 flex-shrink-0">
              <GraduationCap className="w-5 h-5 sm:w-6 sm:h-6 stroke-[2.2] text-[#BCEBFF]" />
            </div>
            <div className="flex flex-col justify-center">
              <h1 className="text-xs sm:text-xl font-bold font-tajawal text-[#071A3D] dark:text-white tracking-tight leading-tight">
                دليلك الجامعي
              </h1>
              <span className="text-[9px] sm:text-xs font-medium text-[#16958E] dark:text-[#BCEBFF] flex items-center gap-0.5 leading-tight mt-0.5">
                <Sparkles className="w-2.5 h-2.5 sm:w-3 sm:h-3 text-[#16958E] inline" />
                <span>جامعتك في جيبك</span>
              </span>
            </div>
          </div>

          {/* Action Buttons: Focus, GPA, Download ZIP, Telegram Bot, Install App */}
          <div className="flex flex-col sm:flex-row items-end sm:items-center gap-1 sm:gap-2">
            {/* Top row / Right cluster on mobile & desktop */}
            <div className="order-1 sm:order-3 flex items-center gap-1.5 w-full sm:w-auto justify-end">
              {/* Direct PWA Install Button */}
              <button
                onClick={() => window.dispatchEvent(new CustomEvent('trigger-pwa-install'))}
                title="تثبيت تطبيق دليلك الجامعي على هاتفك بشعار قبعة التخرج"
                className="flex items-center justify-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-[#16958E] hover:bg-[#127d77] text-white font-bold text-[11px] sm:text-xs shadow-sm hover:shadow-md transition-all duration-200 active:scale-95 whitespace-nowrap cursor-pointer"
              >
                <Download className="w-3.5 h-3.5 text-[#BCEBFF]" />
                <span>تثبيت التطبيق</span>
              </button>

              {/* Telegram Bot Button */}
              <a
                href="http://t.me/Daleelak_AlJamaei_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center justify-center gap-1.5 px-2.5 py-1 sm:px-3.5 sm:py-2 rounded-lg sm:rounded-xl bg-[#071A3D] hover:bg-[#16958E] text-white font-bold text-[11px] sm:text-xs shadow-sm shadow-[#071A3D]/20 hover:shadow-md transition-all duration-200 active:scale-95 whitespace-nowrap text-center"
              >
                <Send className="w-3.5 h-3.5 sm:w-4 sm:h-4 rotate-180 text-[#BCEBFF]" />
                <span>بوت التلجرام</span>
              </a>
            </div>

            {/* Bottom Row on Mobile: Focus & GPA buttons */}
            <div className="order-2 sm:order-1 flex items-center gap-1 sm:gap-2.5 w-full sm:w-auto">
              {/* Focus / Pomodoro Button */}
              <button
                onClick={onOpenPomodoro}
                title="مؤقت الدراسة والتركيز"
                className="flex-1 sm:flex-none justify-center flex px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-[#BCEBFF]/30 hover:bg-[#BCEBFF]/60 text-[#071A3D] border border-[#BCEBFF]/60 text-[10px] sm:text-xs font-semibold items-center gap-1 transition-all active:scale-95 whitespace-nowrap"
              >
                <Timer className="w-3 h-3 sm:w-4 sm:h-4 text-[#16958E]" />
                <span>التركيز</span>
              </button>

              {/* GPA Calculator Button */}
              <button
                onClick={onOpenGpa}
                title="حساب المعدل التراكمي GPA"
                className="flex-1 sm:flex-none justify-center flex px-2 py-1 sm:px-3 sm:py-2 rounded-lg sm:rounded-xl bg-[#BCEBFF]/30 hover:bg-[#BCEBFF]/60 text-[#071A3D] border border-[#BCEBFF]/60 text-[10px] sm:text-xs font-semibold items-center gap-1 transition-all active:scale-95 whitespace-nowrap"
              >
                <Calculator className="w-3 h-3 sm:w-4 sm:h-4 text-[#16958E]" />
                <span>حساب GPA</span>
              </button>
            </div>

            {/* Download Zip Dropdown (Desktop Only) */}
            <div className="relative hidden sm:block order-2">
              <button
                onClick={() => setShowDownloadMenu(!showDownloadMenu)}
                title="تحميل المشروع ZIP"
                className="p-2 sm:px-3 sm:py-2 rounded-xl bg-[#BCEBFF]/30 hover:bg-[#BCEBFF]/60 text-[#071A3D] dark:text-white text-xs font-bold flex items-center gap-1.5 transition-all border border-[#16958E]/30"
              >
                <Download className="w-4 h-4 text-[#16958E]" />
                <span>تحميل ZIP</span>
              </button>

              {showDownloadMenu && (
                <div className="absolute left-0 sm:right-0 sm:left-auto top-full mt-2 w-64 glass-panel rounded-2xl p-3 shadow-xl border border-[#BCEBFF] dark:border-[#16958E]/30 bg-white dark:bg-[#071A3D] z-50 animate-scale-in text-right">
                  <div className="text-[11px] font-bold text-slate-400 mb-2 px-2">اختر صيغة التحميل المطلوبة:</div>
                  <a
                    href="/dist_web_app.zip"
                    download="dist_web_app.zip"
                    onClick={() => setShowDownloadMenu(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#BCEBFF]/20 transition-colors text-xs font-bold text-[#071A3D] dark:text-white mb-1 group"
                  >
                    <div>
                      <span className="block font-tajawal text-[#16958E]">نسخة الاستضافة والعمل بدون إنترنت (HTML/JS)</span>
                      <span className="text-[10px] text-slate-400 font-normal">جاهز للرفع على أي استضافة أونلاين أو أوفلاين</span>
                    </div>
                    <PackageCheck className="w-4 h-4 text-[#16958E] flex-shrink-0 mr-2" />
                  </a>

                  <a
                    href="/project_source.zip"
                    download="project_source.zip"
                    onClick={() => setShowDownloadMenu(false)}
                    className="flex items-center justify-between p-2.5 rounded-xl hover:bg-[#BCEBFF]/20 transition-colors text-xs font-bold text-[#071A3D] dark:text-white group"
                  >
                    <div>
                      <span className="block font-tajawal text-[#071A3D] dark:text-[#BCEBFF]">الكود المصدري الكامل (Source Code)</span>
                      <span className="text-[10px] text-slate-400 font-normal">يتضمن ملفات React و TypeScript والمكونات</span>
                    </div>
                    <Download className="w-4 h-4 text-[#071A3D] dark:text-[#BCEBFF] flex-shrink-0 mr-2" />
                  </a>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </header>
  );
};
