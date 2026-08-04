import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  FileText, ArrowRight, Search, Calendar, User, Tag, Eye,
  BookOpen, Sparkles, X, Share2, Check, Clock
} from 'lucide-react';
import { ArticleItem } from '../types';
import { FirebaseService } from '../services/firebase';

interface ArticlesSectionProps {
  onBack: () => void;
}

export const ArticlesSection: React.FC<ArticlesSectionProps> = ({ onBack }) => {
  const [articles, setArticles] = useState<ArticleItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [activeArticle, setActiveArticle] = useState<ArticleItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const unsubscribe = FirebaseService.subscribeArticles((data) => {
      // Filter only published articles for public view
      setArticles(data.filter(a => a.status === 'published'));
    });
    return () => unsubscribe();
  }, []);

  const categories = Array.from(
    new Set(articles.map(a => a.category).filter(Boolean) as string[])
  );

  const filteredArticles = articles.filter(art => {
    const matchesSearch =
      art.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (art.subtitle && art.subtitle.toLowerCase().includes(searchQuery.toLowerCase())) ||
      art.content.toLowerCase().includes(searchQuery.toLowerCase());

    const matchesCat =
      selectedCategory === 'all' || art.category === selectedCategory;

    return matchesSearch && matchesCat;
  });

  const handleShare = (art: ArticleItem) => {
    if (navigator.share) {
      navigator.share({
        title: art.title,
        text: art.subtitle || art.title,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Simple rich text formatting renderer (Markdown-like parser)
  const renderFormattedText = (text: string) => {
    if (!text) return null;
    const lines = text.split('\n');
    return lines.map((line, idx) => {
      const trimmed = line.trim();
      if (!trimmed) return <div key={idx} className="h-3" />;

      if (trimmed.startsWith('### ')) {
        return <h3 key={idx} className="text-lg font-bold text-slate-800 my-3 font-tajawal">{trimmed.replace('### ', '')}</h3>;
      }
      if (trimmed.startsWith('## ')) {
        return <h2 key={idx} className="text-xl font-extrabold text-blue-700 my-4 font-tajawal">{trimmed.replace('## ', '')}</h2>;
      }
      if (trimmed.startsWith('# ')) {
        return <h1 key={idx} className="text-2xl font-black text-slate-900 my-4 font-tajawal">{trimmed.replace('# ', '')}</h1>;
      }
      if (trimmed.startsWith('- ') || trimmed.startsWith('* ')) {
        return (
          <li key={idx} className="mr-6 my-1 list-disc text-slate-700 text-sm leading-relaxed">
            {trimmed.substring(2)}
          </li>
        );
      }
      if (/^\d+\.\s/.test(trimmed)) {
        return (
          <li key={idx} className="mr-6 my-1 list-decimal text-slate-700 text-sm leading-relaxed">
            {trimmed.replace(/^\d+\.\s/, '')}
          </li>
        );
      }
      if (trimmed.startsWith('> ')) {
        return (
          <blockquote key={idx} className="border-r-4 border-blue-500 pr-4 my-3 py-2 bg-blue-50/60 rounded-l-xl text-slate-700 italic text-sm">
            {trimmed.replace('> ', '')}
          </blockquote>
        );
      }
      if (trimmed.startsWith('![') && trimmed.includes('](')) {
        const altMatch = trimmed.match(/!\[(.*?)\]/);
        const urlMatch = trimmed.match(/\((.*?)\)/);
        if (urlMatch && urlMatch[1]) {
          return (
            <div key={idx} className="my-4">
              <img src={urlMatch[1]} alt={altMatch ? altMatch[1] : ''} className="w-full max-h-96 object-cover rounded-2xl shadow-md border border-slate-200" />
            </div>
          );
        }
      }

      return (
        <p key={idx} className="text-slate-700 my-2 leading-relaxed text-sm sm:text-base font-normal">
          {trimmed}
        </p>
      );
    });
  };

  return (
    <div className="py-8 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto space-y-8 animate-fade-in" dir="rtl">
      
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-slate-200">
        <div>
          <button
            onClick={onBack}
            className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 font-bold text-xs mb-3 transition-all"
          >
            <ArrowRight className="w-4 h-4" />
            <span>العودة للرئيسية</span>
          </button>
          <h1 className="text-2xl sm:text-3xl font-black font-tajawal text-slate-900 flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-blue-600 text-white flex items-center justify-center shadow-lg shadow-blue-500/30">
              <FileText className="w-6 h-6" />
            </div>
            <span>المقالات والأبحاث الأكاديمية</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            اقرأ أحدث المقالات والنصائح والإرشادات الأكاديمية المصممة لتعزيز تحصيلك العلمي
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="بحث في المقالات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs focus:ring-2 focus:ring-blue-500 outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        </div>
      </div>

      {/* Categories Bar */}
      {categories.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          <button
            onClick={() => setSelectedCategory('all')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
              selectedCategory === 'all'
                ? 'bg-blue-600 text-white shadow-md'
                : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
            }`}
          >
            الكل ({articles.length})
          </button>
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                selectedCategory === cat
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-white text-slate-600 border border-slate-200 hover:bg-slate-100'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      )}

      {/* Articles Grid */}
      {filteredArticles.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <BookOpen className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 font-tajawal">لا توجد مقالات منشورة حالياً</h3>
          <p className="text-xs text-slate-400 mt-1">سيقوم فريق الكلية بنشر مقالات وأبحاث جديدة قريباً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredArticles.map((art) => (
            <motion.div
              key={art.id}
              whileHover={{ y: -4 }}
              onClick={() => setActiveArticle(art)}
              className="bg-white rounded-3xl border border-slate-200/90 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col group relative"
            >
              {art.coverImage ? (
                <div className="h-48 w-full overflow-hidden relative">
                  <img
                    src={art.coverImage}
                    alt={art.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  {art.category && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-blue-600/90 text-white text-[11px] font-bold backdrop-blur-md shadow">
                      {art.category}
                    </span>
                  )}
                </div>
              ) : (
                <div className="h-32 w-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white relative">
                  <FileText className="w-12 h-12 opacity-40" />
                  {art.category && (
                    <span className="absolute top-3 right-3 px-3 py-1 rounded-full bg-white/20 text-white text-[11px] font-bold backdrop-blur-md">
                      {art.category}
                    </span>
                  )}
                </div>
              )}

              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div>
                  <div className="flex items-center gap-3 text-[11px] text-slate-400 mb-2">
                    <span className="flex items-center gap-1">
                      <Calendar className="w-3.5 h-3.5 text-blue-500" />
                      {new Date(art.createdAt).toLocaleDateString('ar-EG')}
                    </span>
                    {art.author && (
                      <span className="flex items-center gap-1">
                        <User className="w-3.5 h-3.5 text-blue-500" />
                        {art.author}
                      </span>
                    )}
                  </div>

                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-blue-600 transition-colors font-tajawal line-clamp-2">
                    {art.title}
                  </h3>

                  {art.subtitle && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {art.subtitle}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-blue-600">
                  <span>قراءة المقال كاملاً</span>
                  <ArrowRight className="w-4 h-4 rotate-180 group-hover:-translate-x-1 transition-transform" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Article Detail View Modal */}
      <AnimatePresence>
        {activeArticle && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/70 backdrop-blur-sm animate-fade-in" dir="rtl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-3xl max-h-[90vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden relative"
            >
              {/* Modal Top Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <div className="flex items-center gap-2">
                  <span className="px-2.5 py-1 rounded-full bg-blue-100 text-blue-700 text-xs font-bold">
                    {activeArticle.category || 'مقال أكاديمي'}
                  </span>
                  <span className="text-xs text-slate-400 font-mono">
                    {new Date(activeArticle.createdAt).toLocaleDateString('ar-EG')}
                  </span>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(activeArticle)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all text-xs font-bold flex items-center gap-1.5"
                    title="مشاركة المقال"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copiedLink ? 'تم النسخ!' : 'مشاركة'}</span>
                  </button>

                  <button
                    onClick={() => setActiveArticle(null)}
                    className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Modal Scrollable Body */}
              <div className="p-6 sm:p-8 overflow-y-auto space-y-6">
                {activeArticle.coverImage && (
                  <img
                    src={activeArticle.coverImage}
                    alt={activeArticle.title}
                    className="w-full max-h-80 object-cover rounded-2xl shadow border border-slate-200"
                  />
                )}

                <div>
                  <h1 className="text-2xl sm:text-3xl font-black font-tajawal text-slate-900 leading-snug">
                    {activeArticle.title}
                  </h1>
                  {activeArticle.subtitle && (
                    <p className="text-sm sm:text-base text-slate-500 mt-2 font-medium">
                      {activeArticle.subtitle}
                    </p>
                  )}

                  {activeArticle.author && (
                    <div className="mt-3 flex items-center gap-2 text-xs font-bold text-blue-600">
                      <User className="w-4 h-4" />
                      <span>بقلم: {activeArticle.author}</span>
                    </div>
                  )}
                </div>

                <div className="pt-4 border-t border-slate-100 font-cairo">
                  {renderFormattedText(activeArticle.content)}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => setActiveArticle(null)}
                  className="px-6 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  إغلاق المقال
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
