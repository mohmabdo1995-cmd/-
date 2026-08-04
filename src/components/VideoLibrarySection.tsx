import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import {
  Video, Play, ArrowRight, Search, Clock, Film,
  Sparkles, X, Share2, Check, Eye
} from 'lucide-react';
import { VideoItem } from '../types';
import { FirebaseService } from '../services/firebase';

interface VideoLibrarySectionProps {
  onBack: () => void;
}

export const VideoLibrarySection: React.FC<VideoLibrarySectionProps> = ({ onBack }) => {
  const [videos, setVideos] = useState<VideoItem[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [activeVideo, setActiveVideo] = useState<VideoItem | null>(null);
  const [copiedLink, setCopiedLink] = useState(false);

  useEffect(() => {
    const unsubscribe = FirebaseService.subscribeVideos((data) => {
      // Filter only visible / published videos for visitors
      setVideos(data.filter(v => v.visible));
    });
    return () => unsubscribe();
  }, []);

  const filteredVideos = videos.filter(v =>
    v.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    v.description.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleShare = (vid: VideoItem) => {
    if (navigator.share) {
      navigator.share({
        title: vid.title,
        text: vid.description,
        url: window.location.href,
      }).catch(() => {});
    } else {
      navigator.clipboard.writeText(window.location.href);
      setCopiedLink(true);
      setTimeout(() => setCopiedLink(false), 2000);
    }
  };

  // Helper to render video element or iframe embed
  const renderVideoPlayer = (vid: VideoItem) => {
    const isEmbed = vid.videoUrl.includes('youtube.com') || vid.videoUrl.includes('youtu.be') || vid.videoUrl.includes('vimeo.com') || vid.videoUrl.includes('iframe');
    
    if (isEmbed) {
      let embedUrl = vid.videoUrl;
      if (embedUrl.includes('youtube.com/watch?v=')) {
        embedUrl = embedUrl.replace('watch?v=', 'embed/');
      } else if (embedUrl.includes('youtu.be/')) {
        embedUrl = embedUrl.replace('youtu.be/', 'youtube.com/embed/');
      }
      return (
        <iframe
          src={embedUrl}
          title={vid.title}
          className="w-full h-80 sm:h-96 rounded-2xl border border-slate-200"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      );
    }

    return (
      <video
        controls
        autoPlay
        src={vid.videoUrl}
        poster={vid.thumbnailUrl}
        className="w-full max-h-96 rounded-2xl bg-black border border-slate-200 shadow-lg"
      >
        <source src={vid.videoUrl} type={vid.fileType || 'video/mp4'} />
        متصفحك لا يدعم تشغيل هذا الفيديو مباشرة.
      </video>
    );
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
            <div className="w-10 h-10 rounded-2xl bg-indigo-600 text-white flex items-center justify-center shadow-lg shadow-indigo-500/30">
              <Video className="w-6 h-6" />
            </div>
            <span>المكتبة المرئية والفيديوهات الأكاديمية</span>
          </h1>
          <p className="text-xs sm:text-sm text-slate-500 mt-1">
            شروحات مرئية، محاضرات مسجلة ومقاطع تعليمية تفاعلية
          </p>
        </div>

        {/* Search */}
        <div className="relative w-full sm:w-72">
          <input
            type="text"
            placeholder="بحث في الفيديوهات..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pr-10 pl-4 py-2.5 rounded-2xl bg-white border border-slate-200 text-slate-800 text-xs focus:ring-2 focus:ring-indigo-500 outline-none shadow-sm"
          />
          <Search className="w-4 h-4 text-slate-400 absolute right-3.5 top-3" />
        </div>
      </div>

      {/* Videos Grid */}
      {filteredVideos.length === 0 ? (
        <div className="text-center py-16 bg-white rounded-3xl border border-slate-200 p-8">
          <Film className="w-12 h-12 text-slate-300 mx-auto mb-3" />
          <h3 className="text-lg font-bold text-slate-700 font-tajawal">لا توجد فيديوهات منشورة حالياً</h3>
          <p className="text-xs text-slate-400 mt-1">سيتم رفع وتحديث الفيديوهات والشروحات قريباً</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredVideos.map((vid) => (
            <motion.div
              key={vid.id}
              whileHover={{ y: -4 }}
              onClick={() => setActiveVideo(vid)}
              className="bg-white rounded-3xl border border-slate-200 shadow-md hover:shadow-xl transition-all cursor-pointer overflow-hidden flex flex-col group relative"
            >
              <div className="h-48 w-full bg-slate-900 relative overflow-hidden flex items-center justify-center">
                {vid.thumbnailUrl ? (
                  <img
                    src={vid.thumbnailUrl}
                    alt={vid.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 opacity-90"
                  />
                ) : (
                  <div className="w-full h-full bg-gradient-to-br from-indigo-900 to-slate-900 flex items-center justify-center">
                    <Film className="w-12 h-12 text-indigo-400/40" />
                  </div>
                )}

                {/* Play Button Overlay */}
                <div className="absolute inset-0 bg-slate-950/30 group-hover:bg-slate-950/40 transition-colors flex items-center justify-center">
                  <div className="w-14 h-14 rounded-full bg-white/90 text-indigo-600 flex items-center justify-center shadow-xl group-hover:scale-110 transition-transform">
                    <Play className="w-6 h-6 fill-indigo-600 mr-1" />
                  </div>
                </div>

                {vid.duration && (
                  <span className="absolute bottom-3 left-3 px-2.5 py-1 rounded-lg bg-slate-950/80 text-white text-[11px] font-mono flex items-center gap-1 backdrop-blur-md">
                    <Clock className="w-3 h-3 text-amber-400" />
                    {vid.duration}
                  </span>
                )}
              </div>

              <div className="p-5 flex-1 flex flex-col justify-between space-y-3">
                <div>
                  <h3 className="text-base font-extrabold text-slate-900 group-hover:text-indigo-600 transition-colors font-tajawal line-clamp-2">
                    {vid.title}
                  </h3>
                  {vid.description && (
                    <p className="text-xs text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                      {vid.description}
                    </p>
                  )}
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs font-bold text-indigo-600">
                  <span>مشاهدة الفيديو</span>
                  <Play className="w-4 h-4 fill-indigo-600" />
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}

      {/* Video Modal Player */}
      <AnimatePresence>
        {activeVideo && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-sm animate-fade-in" dir="rtl">
            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="w-full max-w-4xl max-h-[92vh] bg-white rounded-3xl border border-slate-200 shadow-2xl flex flex-col overflow-hidden relative"
            >
              {/* Modal Top Header */}
              <div className="px-6 py-4 border-b border-slate-100 flex items-center justify-between bg-slate-50">
                <h3 className="text-sm font-extrabold text-slate-800 font-tajawal truncate max-w-lg">
                  {activeVideo.title}
                </h3>

                <div className="flex items-center gap-2">
                  <button
                    onClick={() => handleShare(activeVideo)}
                    className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-600 transition-all text-xs font-bold flex items-center gap-1.5"
                    title="مشاركة الفيديو"
                  >
                    {copiedLink ? <Check className="w-4 h-4 text-emerald-600" /> : <Share2 className="w-4 h-4" />}
                    <span className="hidden sm:inline">{copiedLink ? 'تم النسخ!' : 'مشاركة'}</span>
                  </button>

                  <button
                    onClick={() => setActiveVideo(null)}
                    className="p-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-700 transition-all"
                  >
                    <X className="w-5 h-5" />
                  </button>
                </div>
              </div>

              {/* Player Body */}
              <div className="p-4 sm:p-6 overflow-y-auto space-y-4">
                {renderVideoPlayer(activeVideo)}

                <div>
                  <h2 className="text-xl font-extrabold font-tajawal text-slate-900">
                    {activeVideo.title}
                  </h2>
                  {activeVideo.description && (
                    <p className="text-xs sm:text-sm text-slate-600 mt-2 leading-relaxed whitespace-pre-wrap bg-slate-50 p-4 rounded-2xl border border-slate-100">
                      {activeVideo.description}
                    </p>
                  )}
                </div>
              </div>

              {/* Modal Footer */}
              <div className="p-4 bg-slate-50 border-t border-slate-100 text-center">
                <button
                  onClick={() => setActiveVideo(null)}
                  className="px-6 py-2.5 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold text-xs shadow-md transition-all"
                >
                  إغلاق الفيديو
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
};
