import React from 'react';
import { User, PracticeHistoryItem } from '../types';
import { CHAPTERS } from '../data';
import { motion } from 'motion/react';
import { Award, Star, BookOpen, Compass, ChevronRight, FileText, CheckCircle2, History, Gift, CheckCircle } from 'lucide-react';
import { speakVietnamese } from '../utils/speechSynthesis';

interface ResultsSectionProps {
  user: User;
  onNavigate: (tab: string) => void;
  onClearHistory: () => void;
}

export function ResultsSection({ user, onNavigate, onClearHistory }: ResultsSectionProps) {
  
  // Custom smart kid status/quote based on overall performance score
  const getLucyAssessment = () => {
    if (user.totalScore === 0) {
      return "Bé mới gia nhập lớp học cùng cô Lucy thôi! Con hãy nhấn nút học Từ vựng và Mẫu câu để bắt đầu tích điểm học sinh chăm ngoan nhé! 🥰";
    }
    if (user.totalScore >= 300) {
      return "U là trời! Bé xuất sắc vô địch hệ mặt trời luôn rồi! Con nói siêu đỉnh, từ vựng siêu siêu giỏi. Cô tặng con 100 bông hoa điểm mười học tốt nha! 🏆😻";
    }
    if (user.totalScore >= 150) {
      return "Con học bài rất chăm và tiến bộ cực kỳ nhanh luôn nhé! Điểm số tăng vù vù như diều gặp gió vậy. Con tiếp tục luyện phát âm nhiều thêm nữa nhé! 😘⭐";
    }
    return "Con đang làm rất tốt nha học trò của cô! Chỉ cần một chút chăm chỉ học bài mỗi ngày thôi, con sẽ tự tin trò chuyện tiếng Anh cùng các bạn nước ngoài liền đấy! 🐱💖";
  };

  return (
    <div id="results-tab" className="space-y-6">
      {/* Visual Header */}
      <div className="flex items-center gap-2 mb-2">
        <span className="text-3xl">🏆</span>
        <h3 className="text-2xl font-black text-sky-900 font-sans shadow-sky-100">
          Kết Quả Học Tập Cá Nhân Của Bé:
        </h3>
      </div>

      <div className="grid md:grid-cols-3 gap-6 items-stretch">
        
        {/* Left Side: Student Identity & general Scorecard */}
        <motion.div 
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          className="bg-white rounded-[32px] border-b-8 border-slate-200 shadow-xl border border-slate-100 p-6 text-center space-y-6 relative overflow-hidden"
        >
          <div className="absolute top-0 right-0 transform translate-x-4 -translate-y-4 text-7xl opacity-10 select-none">🌈</div>
          
          <div className="space-y-2">
            <span className="text-5xl select-none">🧑‍🎓</span>
            <h4 id="user-profile-name" className="text-2xl font-black text-slate-800 font-sans">
              {user.fullName}
            </h4>
            <span className="bg-emerald-500 text-white font-bold text-xs px-3 py-1 rounded-full block mx-auto max-w-max uppercase tracking-wider">
              Học Sinh Lớp 3 🎒
            </span>
          </div>

          {/* Badges system based on completion */}
          <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100 space-y-3">
            <h5 className="text-xs font-bold text-slate-400 uppercase tracking-widest">Huy Hiệu Bé Đạt Được:</h5>
            <div className="flex flex-wrap items-center justify-center gap-2">
              <span className={`px-2.5 py-1 text-xs rounded-full font-bold border flex items-center gap-1 shadow-sm ${
                user.totalScore >= 100 
                  ? 'bg-amber-100 text-amber-850 border-amber-200' 
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                🌟 Ngôi Sao Sáng
              </span>
              <span className={`px-2.5 py-1 text-xs rounded-full font-bold border flex items-center gap-1 shadow-sm ${
                user.lessonsCompleted.length >= 3 
                  ? 'bg-purple-100 text-purple-800 border-purple-205' 
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                🚀 Học Siêu Tốc
              </span>
              <span className={`px-2.5 py-1 text-xs rounded-full font-bold border flex items-center gap-1 shadow-sm ${
                user.scorePronunciation >= 85 
                  ? 'bg-rose-100 text-rose-800 border-rose-205' 
                  : 'bg-slate-100 text-slate-400 border-slate-200'
              }`}>
                🗣️ Đỉnh Phát Âm
              </span>
            </div>
          </div>

          <div className="space-y-1 py-1">
            <p className="text-xs font-bold text-slate-400">Thời gian học gần nhất:</p>
            <p id="user-last-active" className="text-sm font-bold text-slate-600 bg-slate-50 border border-slate-200 rounded-xl py-2 px-3 inline-block">
              📅 {user.lastActive}
            </p>
          </div>

          {/* Chapters checklist list */}
          <div className="space-y-2 text-left">
            <h5 className="text-xs font-bold text-slate-400 uppercase px-1 uppercase tracking-wider">Chương đã học ({user.lessonsCompleted.length}/5):</h5>
            <div className="grid grid-cols-5 gap-1.5">
              {[1, 2, 3, 4, 5].map(index => {
                const isDone = user.lessonsCompleted.includes(index);
                return (
                  <div
                    key={index}
                    id={`chapter-badge-progress-${index}`}
                    className={`h-11 rounded-xl border flex flex-col items-center justify-center font-bold text-xs transition-all ${
                      isDone 
                        ? 'bg-emerald-50 text-emerald-700 border-emerald-200 font-extrabold shadow-sm' 
                        : 'bg-slate-50 text-slate-400 border-slate-250'
                    }`}
                    title={isDone ? `Bài ${index} đã hoàn thành!` : `Bài ${index} chưa hoàn thành`}
                  >
                    <span>C{index}</span>
                    <span className="text-[9px] -mt-0.5">{isDone ? '✔️' : '📖'}</span>
                  </div>
                );
              })}
            </div>
          </div>
        </motion.div>

        {/* Right Side Part 1: Interactive Breakdown Score Statistics */}
        <div className="md:col-span-2 space-y-6 flex flex-col justify-between">
          
          <div className="bg-white rounded-[32px] border-b-8 border-slate-200 shadow-xl border border-slate-100 p-6 space-y-6">
            <h4 className="text-lg font-bold text-slate-800 font-sans border-b border-slate-100 pb-2.5">
              📊 Thống Kê Điểm Số Chi Tiết:
            </h4>

            <div className="grid sm:grid-cols-3 gap-4">
              <div className="bg-amber-50/50 rounded-2xl border border-amber-100 p-4 relative overflow-hidden group">
                <span className="absolute bottom-1 right-2 text-5xl opacity-10 font-sans">🎨</span>
                <span className="text-xs font-bold text-amber-600 uppercase block mb-1">Điểm Từ Vựng:</span>
                <p id="score-vocab-details" className="text-4xl font-extrabold text-amber-800 tracking-tight">{user.scoreVocabulary}đ</p>
                <div className="w-full bg-amber-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-amber-500 h-full rounded-full" style={{ width: `${Math.min(100, user.scoreVocabulary)}%` }} />
                </div>
              </div>

              <div className="bg-rose-50/50 rounded-2xl border border-rose-100 p-4 relative overflow-hidden group">
                <span className="absolute bottom-1 right-1 text-5xl opacity-10 font-sans">💬</span>
                <span className="text-xs font-bold text-rose-600 uppercase block mb-1">Điểm Mẫu Câu:</span>
                <p id="score-sentence-details" className="text-4xl font-extrabold text-rose-800 tracking-tight">{user.scoreSentence}đ</p>
                <div className="w-full bg-rose-100 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-rose-500 h-full rounded-full" style={{ width: `${Math.min(100, user.scoreSentence)}%` }} />
                </div>
              </div>

              <div className="bg-sky-50/50 rounded-2xl border border-sky-100 p-4 relative overflow-hidden group">
                <span className="absolute bottom-1 right-1 text-5xl opacity-10 font-sans">🎙️</span>
                <span className="text-xs font-bold text-sky-600 uppercase block mb-1">Điểm Luyện Nói:</span>
                <p id="score-pron-details" className="text-4xl font-extrabold text-sky-850 tracking-tight">{user.scorePronunciation}đ</p>
                <div className="w-full bg-sky-150 h-2 rounded-full mt-3 overflow-hidden">
                  <div className="bg-sky-500 h-full rounded-full" style={{ width: `${Math.min(100, user.scorePronunciation)}%` }} />
                </div>
              </div>
            </div>

            {/* Smart Teacher Lucy commentary Speech balloon */}
            <div className="bg-amber-50/55 border border-amber-100 p-4 rounded-2xl flex items-start gap-4">
              <button
                onClick={() => speakVietnamese(getLucyAssessment())}
                className="text-4xl bg-amber-100 p-2.5 rounded-2xl flex-shrink-0 hover:scale-105 active:scale-95 transition-all select-none"
                title="Bấm để cô Lucy đọc nhận xét nhé!"
              >
                🐱
              </button>
              <div className="space-y-1">
                <h5 className="font-sans font-bold text-amber-900 text-sm flex items-center gap-1">
                  Nhận xét gần nhất của Teacher Lucy: <span className="text-xs bg-amber-100 text-amber-800 px-2 py-0.5 rounded font-bold">Bấm nghe 🗣️</span>
                </h5>
                <p id="lucy-smart-report" className="text-xs md:text-sm font-semibold text-amber-800 leading-relaxed italic">
                  "{getLucyAssessment()}"
                </p>
              </div>
            </div>
          </div>

          {/* SPEAKING RECOGNITION PRACTICE LOGS LIST */}
          <div className="bg-white rounded-[32px] border-b-8 border-slate-200 shadow-xl border border-slate-100 p-6 space-y-4 flex-1 mt-6">
            <div className="flex items-center justify-between border-b border-dashed border-slate-100 pb-2.5">
              <h4 className="text-base font-bold text-slate-800 font-sans flex items-center gap-1.5">
                <History size={16} /> Chi Tiết Lịch Sử Luyện Luyện Nói ({user.practiceHistory.length}):
              </h4>
              {user.practiceHistory.length > 0 && (
                <button
                  id="btn-clear-history"
                  onClick={onClearHistory}
                  className="text-xs text-rose-500 hover:text-rose-700 font-bold bg-rose-50 hover:bg-rose-100 px-3 py-1 rounded-xl cursor-pointer shadow-sm border border-rose-100"
                >
                  Xóa Lịch Sử
                </button>
              )}
            </div>

            {user.practiceHistory.length > 0 ? (
              <div id="results-practice-list" className="space-y-2.5 max-h-[190px] overflow-y-auto pr-1">
                {user.practiceHistory.map((hist, hIdx) => (
                  <div key={hIdx} className="bg-slate-50 hover:bg-slate-100 border border-slate-150 p-3 rounded-2xl flex items-center justify-between gap-3 text-xs">
                    <div className="space-y-1">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="bg-slate-200 text-slate-700 font-bold px-1.5 py-0.5 rounded text-[10px] uppercase font-mono">
                          {hist.chapterTitle.split(":")[1] || "Bài tập"}
                        </span>
                        <span className="text-slate-400 text-[10px] font-medium">{hist.timestamp}</span>
                      </div>
                      <p className="text-slate-800 font-bold">Mẫu: <strong className="text-slate-900 font-black">"{hist.sampleText}"</strong></p>
                      <p className="text-slate-600 font-semibold">Bé đọc: <strong className="text-emerald-700">"{hist.userText || '[Không nhận diện cụ thể]'}"</strong></p>
                    </div>

                    <div className="flex flex-col items-center justify-center bg-white p-2 border border-slate-200 rounded-xl min-w-[70px] flex-shrink-0 shadow-sm">
                      <strong id="history-score-metric" className="text-emerald-600 font-black text-base">{hist.score}đ</strong>
                      <span className="text-[9px] text-slate-400 font-bold uppercase">Đạt chuẩn</span>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div id="results-history-empty" className="text-center py-8 text-xs font-semibold text-slate-400 space-y-2">
                <span className="text-3xl block">🎙️</span>
                <p>Chưa ghi nhận lịch sử luyện nói nào.</p>
                <p>Hãy qua mục <strong className="text-sky-600">Luyện Phát Âm</strong> để chinh phục thang điểm 100 cùng cô Lucy nha!</p>
              </div>
            )}
          </div>

        </div>
      </div>
    </div>
  );
}
