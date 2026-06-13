import React from 'react';
import { User, Chapter } from '../types';
import { CHAPTERS } from '../data';
import { motion } from 'motion/react';
import { Trophy, Star, BookOpen, MessageCircle, Play, ChevronRight, Award, Compass } from 'lucide-react';
import { speakVietnamese } from '../utils/speechSynthesis';

interface DashboardProps {
  user: User;
  onSelectChapterSection: (chapterId: number, section: 'vocab' | 'sentence' | 'video' | 'speak') => void;
  onNavigate: (tab: string) => void;
}

export function Dashboard({ user, onSelectChapterSection, onNavigate }: DashboardProps) {
  
  const handleChapterClick = (chapterId: number) => {
    // Default to vocab section of the clicked chapter
    onSelectChapterSection(chapterId, 'vocab');
  };

  const getChapterStatus = (id: number) => {
    return user.lessonsCompleted.includes(id);
  };

  return (
    <div id="dashboard-tab" className="space-y-8 pb-10">
      {/* Welcome Banner */}
      <motion.div 
        initial={{ y: -20, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="relative bg-gradient-to-r from-sky-400 to-indigo-500 text-white rounded-[32px] p-6 md:p-8 shadow-xl border-b-[8px] border-indigo-600/20 overflow-hidden"
      >
        <div className="absolute top-0 right-0 transform translate-x-12 -translate-y-12 text-[120px] opacity-10 select-none pointer-events-none">⭐</div>
        <div className="absolute -bottom-8 left-10 transform text-[100px] opacity-15 select-none pointer-events-none animate-bounce duration-3000">☁️</div>

        <div className="flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
          <div className="space-y-3 text-center md:text-left">
            <h2 className="text-3xl md:text-4xl font-extrabold tracking-tight uppercase">
              Chào mừng học sinh mới: <span className="text-yellow-300 italic font-black text-4xl">{user.fullName}</span>! 👋
            </h2>
            <p className="text-sky-50 font-bold text-lg md:max-w-xl leading-relaxed">
              Hôm nay bé muốn học bài bài học thú vị nào nhỉ? Hãy chọn một chương ở dưới để học ngay nhé!
            </p>
            <div className="flex flex-wrap justify-center md:justify-start gap-3 pt-2">
              <span className="bg-white/20 backdrop-blur-md text-white font-extrabold px-3.5 py-1.5 rounded-full text-sm flex items-center gap-1.5 border border-white/30">
                ⭐ Tổng điểm: {user.totalScore}
              </span>
              <span className="bg-yellow-400 text-yellow-950 font-extrabold px-3.5 py-1.5 rounded-full text-sm flex items-center gap-1.5 shadow-md">
                🏆 Bài đã hoàn thành: {user.lessonsCompleted.length}/5
              </span>
            </div>
          </div>

          <div className="flex-shrink-0 animate-pulse">
            <div className="w-28 h-28 bg-white/25 backdrop-blur-md rounded-[24px] border-4 border-white/50 flex flex-col items-center justify-center p-3 text-center shadow-lg">
              <span className="text-5xl">🐱</span>
              <span className="text-xs font-black text-yellow-105 uppercase tracking-widest mt-1">Lucy Lucy</span>
            </div>
          </div>
        </div>
      </motion.div>

      {/* Mini Achievements Widget - styled using clean Geometric Bevel Borders */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <motion.div 
          onClick={() => onNavigate('results')}
          whileHover={{ scale: 1.03 }}
          className="bg-white hover:bg-amber-50/50 hover:scale-[1.02] cursor-pointer border border-slate-100 border-b-[6px] border-b-amber-300 rounded-[24px] p-4 text-center transition-all shadow-sm relative group"
        >
          <div className="bg-amber-150 text-amber-900 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2 font-black group-hover:rotate-12 transition-all">✨</div>
          <p className="text-xs text-amber-600 font-bold uppercase tracking-wide">Từ vựng</p>
          <p id="stats-vocab-score" className="text-3xl font-black text-amber-800">{user.scoreVocabulary}đ</p>
        </motion.div>

        <motion.div 
          onClick={() => onNavigate('results')}
          whileHover={{ scale: 1.03 }}
          className="bg-white hover:bg-rose-50/50 hover:scale-[1.02] cursor-pointer border border-slate-100 border-b-[6px] border-b-rose-300 rounded-[24px] p-4 text-center transition-all shadow-sm relative group"
        >
          <div className="bg-rose-150 text-rose-900 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2 font-black group-hover:rotate-12 transition-all">❤️</div>
          <p className="text-xs text-rose-600 font-bold uppercase tracking-wide">Mẫu câu</p>
          <p id="stats-sentence-score" className="text-3xl font-black text-rose-800">{user.scoreSentence}đ</p>
        </motion.div>

        <motion.div 
          onClick={() => onNavigate('results')}
          whileHover={{ scale: 1.03 }}
          className="bg-white hover:bg-indigo-50/50 hover:scale-[1.02] cursor-pointer border border-slate-100 border-b-[6px] border-b-indigo-300 rounded-[24px] p-4 text-center transition-all shadow-sm relative group"
        >
          <div className="bg-indigo-150 text-indigo-905 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2 font-black group-hover:rotate-12 transition-all">🎙️</div>
          <p className="text-xs text-indigo-600 font-bold uppercase tracking-wide">Phát âm</p>
          <p id="stats-pron-score" className="text-3xl font-black text-indigo-800">{user.scorePronunciation}đ</p>
        </motion.div>

        <motion.div 
          onClick={() => onNavigate('results')}
          whileHover={{ scale: 1.03 }}
          className="bg-white hover:bg-emerald-50/50 hover:scale-[1.02] cursor-pointer border border-slate-100 border-b-[6px] border-b-emerald-300 rounded-[24px] p-4 text-center transition-all shadow-sm relative group"
        >
          <div className="bg-emerald-150 text-emerald-905 rounded-full w-10 h-10 flex items-center justify-center mx-auto mb-2 font-black group-hover:rotate-12 transition-all">🏅</div>
          <p className="text-xs text-emerald-600 font-bold uppercase tracking-wide">Tổng cộng</p>
          <p id="stats-total-score" className="text-3xl font-black text-emerald-800">{user.totalScore}đ</p>
        </motion.div>
      </div>

      {/* Chapters Section */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <span className="text-3xl">📚</span>
          <h3 className="text-2xl font-black text-sky-900 tracking-tight uppercase">
            Danh Sách Chương Học Tiếng Anh:
          </h3>
        </div>

        <div className="grid gap-6 md:grid-cols-1">
          {CHAPTERS.map((chapter, index) => {
            const isCompleted = getChapterStatus(chapter.id);
            return (
              <motion.div
                key={chapter.id}
                id={`chapter-card-${chapter.id}`}
                initial={{ opacity: 0, x: -10 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="bg-white rounded-[32px] border-b-[8px] border-slate-200 hover:border-slate-300 shadow-xl p-6 flex flex-col md:flex-row items-stretch justify-between gap-6 transition-all relative overflow-hidden group hover:scale-[1.01] duration-200"
              >
                {/* Rainbow background highlight when completed */}
                {isCompleted && (
                  <div className="absolute top-0 right-0 bg-gradient-to-l from-emerald-100 to-transparent w-24 h-full pointer-events-none" />
                )}

                <div className="flex flex-col md:flex-row items-center gap-5 text-center md:text-left flex-1">
                  <div className="w-20 h-20 bg-[#E0F2FE] rounded-full border-4 border-white flex items-center justify-center text-4xl shadow-inner select-none group-hover:scale-105 transition-all flex-shrink-0">
                    {chapter.emoji}
                  </div>
                  <div className="space-y-1.5 flex-grow">
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-2.5">
                      <h4 className="text-xl font-black text-slate-800 uppercase tracking-tight">
                        {chapter.title}
                      </h4>
                      {isCompleted ? (
                        <span className="bg-emerald-50 text-emerald-600 font-extrabold text-xs px-2.5 py-1 rounded-full border border-emerald-200 flex items-center gap-0.5 shadow-sm">
                          Đã Học Xong ⭐
                        </span>
                      ) : (
                        <span className="bg-yellow-50 text-yellow-600 font-extrabold text-xs px-2.5 py-1 rounded-full border border-yellow-200 flex items-center gap-0.5 shadow-sm">
                          Chưa Học 📖
                        </span>
                      )}
                    </div>
                    <p className="text-slate-500 font-semibold text-sm md:max-w-2xl leading-relaxed">
                      {chapter.description}
                    </p>
                    <div className="flex flex-wrap items-center justify-center md:justify-start gap-4 text-xs font-bold text-sky-400">
                      <span>• {chapter.vocabulary.length} từ vựng</span>
                      <span>• {chapter.sentences.length} cấu trúc mẫu câu</span>
                      <span>• 1 video bài giảng sinh động</span>
                    </div>
                  </div>
                </div>

                {/* Interactive Sub-Sections Navigation Buttons */}
                <div className="flex flex-wrap items-center justify-center gap-2 border-t md:border-t-0 md:border-l border-slate-100 pt-4 md:pt-0 md:pl-6 min-w-[240px]">
                  <button
                    id={`btn-chapter-vocab-${chapter.id}`}
                    onClick={() => onSelectChapterSection(chapter.id, 'vocab')}
                    className="flex-1 min-w-[110px] p-2.5 bg-white text-slate-600 rounded-2xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 hover:text-sky-600 hover:scale-102 flex flex-col items-center justify-center gap-1 font-bold transition-all cursor-pointer text-xs shadow-sm"
                  >
                    <span>🎨 Từ Vựng</span>
                  </button>
                  <button
                    id={`btn-chapter-sentence-${chapter.id}`}
                    onClick={() => onSelectChapterSection(chapter.id, 'sentence')}
                    className="flex-1 min-w-[110px] p-2.5 bg-white text-slate-600 rounded-2xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 hover:text-sky-600 hover:scale-102 flex flex-col items-center justify-center gap-1 font-bold transition-all cursor-pointer text-xs shadow-sm"
                  >
                    <span>💬 Mẫu Câu</span>
                  </button>
                  <button
                    id={`btn-chapter-video-${chapter.id}`}
                    onClick={() => onSelectChapterSection(chapter.id, 'video')}
                    className="flex-1 min-w-[110px] p-2.5 bg-white text-slate-600 rounded-2xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 hover:text-sky-600 hover:scale-102 flex flex-col items-center justify-center gap-1 font-bold transition-all cursor-pointer text-xs shadow-sm"
                  >
                    <span>📺 Video</span>
                  </button>
                  <button
                    id={`btn-chapter-speak-${chapter.id}`}
                    onClick={() => onSelectChapterSection(chapter.id, 'speak')}
                    className="flex-1 min-w-[110px] p-2.5 bg-white text-slate-600 rounded-2xl border border-slate-200 hover:border-sky-500 hover:bg-sky-50/50 hover:text-sky-600 hover:scale-102 flex flex-col items-center justify-center gap-1 font-bold transition-all cursor-pointer text-xs shadow-sm"
                  >
                    <span>🎙️ Luyện Phát Âm</span>
                  </button>
                </div>
              </motion.div>
            );
          })}
        </div>
      </div>

      {/* Teacher Lucy advice Card */}
      <motion.div 
        whileHover={{ y: -2 }}
        className="bg-amber-50/55 rounded-[32px] p-6 border border-amber-100 shadow-sm flex items-center gap-4 relative overflow-hidden"
      >
        <div className="absolute top-0 right-0 transform -translate-y-4 translate-x-4 text-7xl select-none opacity-20">🐱</div>
        <div className="flex items-start gap-4">
          <div className="text-4xl bg-amber-100 p-2.5 rounded-2xl border border-amber-200 flex-shrink-0">😸</div>
          <div className="space-y-1">
            <h4 className="font-bold text-lg text-amber-900 uppercase tracking-tight">Lời khuyên nhỏ từ Cô Lucy:</h4>
            <p className="text-amber-800 text-sm font-semibold leading-relaxed">
              "Các con yêu quý ơi! Để nhớ tốt từ vựng và câu, mỗi khi học xong một bài, con nhớ qua phần <strong className="text-sky-600">🎙️ Luyện Phát Âm</strong> để thử giọng nói ngọt ngào với cô nhé. Chỉ cần đạt <strong>80 điểm trở lên</strong> là con được cô tặng huy hiệu siêu giỏi rồi đấy!"
            </p>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
