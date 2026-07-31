import React from 'react';
import { GraduationCap, Send, Heart, Sparkles, BookOpen, Calendar } from 'lucide-react';

interface FooterProps {
  onNavigate: (page: any) => void;
}

export const Footer: React.FC<FooterProps> = ({ onNavigate }) => {
  return (
    <footer className="mt-20 border-t border-slate-200/80 dark:border-slate-800/80 bg-slate-100/60 dark:bg-slate-950/60 backdrop-blur-md text-slate-600 dark:text-slate-400 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12 text-right">
          
          {/* Col 1: Brand */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 text-white flex items-center justify-center font-bold shadow-md">
                <GraduationCap className="w-6 h-6 stroke-[2.2]" />
              </div>
              <h3 className="text-xl font-bold font-tajawal text-slate-900 dark:text-white">دليلك الجامعي</h3>
            </div>

            <p className="text-sm text-slate-500 dark:text-slate-400 leading-relaxed max-w-md">
              منصة أكاديمية شاملة ومصممة خصيصاً لمساعدة الطلاب الجامعيين في تنقيح المواد والأكاديميا وإدارة المحاضرات بمرونة عالية.
            </p>

            <div className="pt-2">
              <a
                href="http://t.me/Daleelak_AlJamaei_bot"
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-sky-50 dark:bg-sky-950/60 text-sky-600 dark:text-sky-400 font-bold text-xs border border-sky-200 dark:border-sky-800 hover:bg-sky-100 transition-all"
              >
                <Send className="w-4 h-4 rotate-180 text-sky-500" />
                <span>بوت التلجرام: @Daleelak_AlJamaei_bot</span>
              </a>
            </div>
          </div>

          {/* Col 2: Navigation Links */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">أقسام الدليل الأكاديمي</h4>
            <ul className="space-y-2.5 text-xs font-semibold">
              <li>
                <button onClick={() => onNavigate('main')} className="hover:text-indigo-600 transition-colors">
                  الصفحة الرئيسية
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('college')} className="hover:text-indigo-600 transition-colors">
                  معلومات الكلية والأكاديميا
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('subjects')} className="hover:text-indigo-600 transition-colors">
                  المواد الدراسية ومصادر التعلم
                </button>
              </li>
              <li>
                <button onClick={() => onNavigate('schedule')} className="hover:text-indigo-600 transition-colors">
                  جدول المحاضرات والتذكيرات
                </button>
              </li>
            </ul>
          </div>

          {/* Col 3: Subjects Links */}
          <div>
            <h4 className="font-bold text-slate-900 dark:text-white text-sm mb-4">المقررات الأساسية</h4>
            <ul className="space-y-2 text-xs font-mono">
              <li className="text-slate-500 dark:text-slate-400">Anatomy (علم التشريح)</li>
              <li className="text-slate-500 dark:text-slate-400">Physiology (وظائف الأعضاء)</li>
              <li className="text-slate-500 dark:text-slate-400">Biochemistry (الكيمياء الحيوية)</li>
              <li className="text-slate-500 dark:text-slate-400">Microbiology (الأحياء الدقيقة)</li>
              <li className="text-slate-500 dark:text-slate-400">Pathology (علم الأمراض)</li>
              <li className="text-slate-500 dark:text-slate-400">Pharmacology (علم الأدوية)</li>
            </ul>
          </div>

        </div>

        {/* Bottom Rights */}
        <div className="pt-8 border-t border-slate-200/60 dark:border-slate-800/60 flex flex-col sm:flex-row items-center justify-between text-xs text-slate-500 gap-4">
          <div className="flex items-center gap-1 font-medium">
            <span>جميع الحقوق محفوظة © {new Date().getFullYear()} - دليلك الجامعي</span>
          </div>

          <div className="flex items-center gap-2">
            <Sparkles className="w-3.5 h-3.5 text-amber-500" />
            <span>جامعتك في جيبك • تطبيق ويب تقدمي PWA</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
