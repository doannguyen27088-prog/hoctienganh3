import React, { useState, useEffect } from 'react';
import { User } from '../types';
import { CHAPTERS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Play, Sparkles, AlertCircle, RefreshCw, Settings, Save, Check } from 'lucide-react';
import { speakVietnamese } from '../utils/speechSynthesis';

interface VideoSectionProps {
  user: User;
  activeChapterId: number;
  onSelectChapter: (id: number) => void;
  onUpdateUser: (updatedUser: User) => void;
}

// Support parsing any regular youtube link into an embeddable link format
function formatYoutubeEmbed(url: string): string {
  if (!url) return '';
  url = url.trim();
  
  // If it's already an embed link, return as is
  if (url.includes('/embed/')) return url;
  
  // Parse watch, short, live or youtu.be links
  const watchRegex = /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/|youtube\.com\/live\/|youtube\.com\/v\/)([a-zA-Z0-9_-]+)/;
  const match = url.match(watchRegex);
  if (match && match[1]) {
    return `https://www.youtube.com/embed/${match[1].substring(0, 11)}`;
  }
  
  // Just in case they paste only the video ID (e.g. "gVIFEVLzRyI")
  if (/^[a-zA-Z0-9_-]{11}$/.test(url)) {
    return `https://www.youtube.com/embed/${url}`;
  }
  
  return url;
}

export function VideoSection({ user, activeChapterId, onSelectChapter, onUpdateUser }: VideoSectionProps) {
  const currentChapter = CHAPTERS.find(c => c.id === activeChapterId) || CHAPTERS[0];

  // Load custom video URLs map directly from global localStorage
  // so they are shared and persistent for all accounts on logout or switch
  const [customVideoUrls, setCustomVideoUrls] = useState<Record<number, string>>(() => {
    try {
      const saved = localStorage.getItem('english_l3_video_urls');
      return saved ? JSON.parse(saved) : {};
    } catch (e) {
      console.error("Failed to load custom video urls", e);
      return {};
    }
  });

  const [isEditing, setIsEditing] = useState(false);
  const [editUrlInput, setEditUrlInput] = useState('');

  // Resolve active URL
  const currentVideoUrl = customVideoUrls[activeChapterId] || currentChapter.videoUrl;

  // Track activeChapterId to sync inputs
  useEffect(() => {
    setEditUrlInput(currentVideoUrl);
    setIsEditing(false); // Reset editing box on chapter change
  }, [activeChapterId, currentVideoUrl]);

  const saveVideoUrl = (newUrl: string) => {
    if (!newUrl.trim()) {
      speakVietnamese("Bé ơi, link video không được để trống đâu nhé!");
      return;
    }
    const parsedUrl = formatYoutubeEmbed(newUrl);
    const updated = { ...customVideoUrls, [activeChapterId]: parsedUrl };
    setCustomVideoUrls(updated);
    
    // Save to localStorage
    localStorage.setItem('english_l3_video_urls', JSON.stringify(updated));
    
    // Save to user profile
    onUpdateUser({
      ...user,
      customVideoUrls: updated
    });

    setIsEditing(false);
    speakVietnamese("Đã thay đổi video bài giảng của cô thành công rồi nè!");
  };

  const resetToDefault = () => {
    const updated = { ...customVideoUrls };
    delete updated[activeChapterId];
    setCustomVideoUrls(updated);
    
    // Save to localStorage
    localStorage.setItem('english_l3_video_urls', JSON.stringify(updated));
    
    // Save to user profile
    onUpdateUser({
      ...user,
      customVideoUrls: updated
    });

    setEditUrlInput(currentChapter.videoUrl);
    setIsEditing(false);
    speakVietnamese("Đã khôi phục video bài giảng gốc của cô thành công!");
  };

  return (
    <div id="video-tab" className="space-y-6">
      {/* Chapter Selection Pills */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
        <span className="font-sans font-extrabold text-slate-400 text-xs uppercase tracking-wider pl-2 whitespace-nowrap">Chọn Bài Học:</span>
        {CHAPTERS.map(ch => (
          <button
            key={ch.id}
            id={`video-chapter-btn-${ch.id}`}
            onClick={() => {
              onSelectChapter(ch.id);
              speakVietnamese(`Mở video hướng dẫn chương ${ch.id} nhé!`);
            }}
            className={`px-4 py-2 font-bold rounded-xl text-xs whitespace-nowrap transition-all cursor-pointer ${
              activeChapterId === ch.id 
                ? 'bg-sky-500 text-white shadow-md shadow-sky-100' 
                : 'bg-slate-50 text-slate-600 border border-slate-100 hover:bg-slate-100'
            }`}
          >
            {ch.emoji} {ch.title.split(":")[1] || ch.title}
          </button>
        ))}
      </div>

      {/* Main Video presentation Card */}
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-[32px] border-b-8 border-slate-200 shadow-xl border border-slate-105 p-6 md:p-8 relative overflow-hidden"
      >
        <div className="absolute top-2 left-2 text-4xl opacity-15 select-none pointer-events-none">✨</div>
        <div className="absolute bottom-2 right-2 text-4xl opacity-15 select-none pointer-events-none">🎬</div>

        <div className="border-b border-dashed border-slate-200 pb-4 mb-6 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h3 id="video-lesson-title" className="text-2xl font-black text-slate-800 font-sans flex items-center gap-2">
              <span>📺 Video Bài Giảng:</span> <span className="text-sky-500 font-bold">{currentChapter.title}</span>
            </h3>
            <p className="text-slate-500 font-bold text-sm">
              Xem cùng cô giáo Lucy để biết cách đọc và dùng mẫu câu chuẩn nhất lớp nhé!
            </p>
          </div>
          
          <div className="flex flex-wrap items-center gap-2">
            <button
              id="btn-edit-video"
              onClick={() => {
                setIsEditing(!isEditing);
                if (!isEditing) {
                  speakVietnamese("Bé có muốn chỉnh sửa liên kết video bài giảng không nào?");
                }
              }}
              className="bg-slate-50 hover:bg-slate-100 text-slate-600 font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1.5 border border-slate-200 cursor-pointer transition-all shadow-sm"
              title="Nhấp vào để thay liên kết video bài giảng YouTube khác"
            >
              <Settings size={14} className="text-slate-455" />
              <span>Chỉnh Sửa Video</span>
            </button>

            <span className="bg-sky-50 text-sky-600 font-bold px-3 py-1.5 rounded-full text-xs flex items-center gap-1 border border-sky-100 shadow-sm">
              🎬 Youtube Guide
            </span>
          </div>
        </div>

        {/* Dynamic Video Editor Form */}
        <AnimatePresence>
          {isEditing && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: 'auto' }}
              exit={{ opacity: 0, height: 0 }}
              className="mb-6 p-5 bg-sky-50 border border-sky-100 rounded-2xl space-y-3.5 overflow-hidden shadow-inner"
              id="video-editor-panel"
            >
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-sky-850 uppercase tracking-widest flex items-center gap-1.5">
                  🔧 Chỉnh sửa liên kết video bài học này:
                </h4>
                <button
                  onClick={() => setIsEditing(false)}
                  className="text-slate-400 hover:text-slate-600 text-xs font-extrabold cursor-pointer transition-all"
                  aria-label="Đóng bảng chỉnh sửa"
                >
                  Đóng ✕
                </button>
              </div>

              <div className="flex flex-col md:flex-row gap-2">
                <input
                  type="text"
                  value={editUrlInput}
                  onChange={(e) => setEditUrlInput(e.target.value)}
                  placeholder="Ví dụ: https://www.youtube.com/watch?v=gVIFEVLzRyI"
                  className="flex-1 px-4 py-2.5 text-xs font-bold bg-white border border-slate-200 focus:border-sky-500 rounded-xl outline-none shadow-sm placeholder:text-slate-400 font-mono"
                  id="input-video-url"
                />
                
                <div className="flex gap-2">
                  <button
                    onClick={() => saveVideoUrl(editUrlInput)}
                    className="flex-1 md:flex-initial bg-sky-500 hover:bg-sky-600 text-white font-bold text-xs px-4 py-2.5 rounded-xl shadow-md cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-1"
                    id="btn-save-video"
                  >
                    <Save size={13} />
                    Lưu Lại
                  </button>
                  <button
                    onClick={resetToDefault}
                    className="flex-1 md:flex-initial bg-slate-200 hover:bg-slate-300 text-slate-700 font-bold text-xs px-3.5 py-2.5 rounded-xl cursor-pointer transition-all whitespace-nowrap flex items-center justify-center gap-1"
                    id="btn-reset-video"
                    title="Khôi phục lại video bài học mặc định ban đầu"
                  >
                    <RefreshCw size={13} />
                    Mặc Định
                  </button>
                </div>
              </div>

              <div className="p-3 bg-white/70 rounded-xl border border-sky-50 text-[11px] text-slate-500 leading-relaxed font-bold space-y-1">
                <p>💡 <span className="text-sky-600">Mẹo nhỏ:</span> Bé và thầy cô có thể dán liên kết xem YouTube thông thường (ví dụ: <code className="bg-slate-100 px-1 py-0.5 rounded text-rose-500 font-mono font-medium">youtube.com/watch?v=...</code>) hoặc link rút gọn (<code className="bg-slate-100 px-1 py-0.5 rounded text-rose-500 font-mono font-medium">youtu.be/...</code>). Hệ thống sẽ tự lọc ID và chuẩn hóa video cực kỳ thông minh luôn!</p>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* Video container with aspect ratio */}
        <div className="relative w-full aspect-video rounded-2xl overflow-hidden border border-slate-205 shadow-md bg-black">
          <iframe
            id="video-iframe"
            className="absolute top-0 left-0 w-full h-full"
            src={`${currentVideoUrl}?autoplay=0&rel=0`}
            title={`Video hướng dẫn ${currentChapter.title}`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          ></iframe>
        </div>

        {/* Teacher Lucy voice support notes */}
        <div className="mt-6 p-4 bg-amber-50/55 rounded-2xl border border-amber-100 flex items-start gap-3">
          <div className="text-3xl bg-amber-100 p-2 rounded-xl flex-shrink-0">🐱</div>
          <div>
            <h4 className="font-bold text-sm text-amber-900">Bé ơi có biết:</h4>
            <p className="text-xs text-amber-800 font-bold leading-relaxed">
              Video này hướng dẫn bé luyện đọc chuẩn xác nhất. Giờ đây bé và thầy cô có thể nhấp trực tiếp vào nút <strong className="text-sky-650">`Chỉnh Sửa Video`</strong> bên trên để thay thế bất kỳ bài học bổ ích nào bé yêu mến từ YouTube nữa nhé! Thật là tiện lợi và đồng bộ đúng không nè!
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
