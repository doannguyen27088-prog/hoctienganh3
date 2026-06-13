import React, { useState, useEffect } from 'react';
import { User } from './types';
import { Auth } from './components/Auth';
import { Dashboard } from './components/Dashboard';
import { VocabularySection } from './components/VocabularySection';
import { SentenceSection } from './components/SentenceSection';
import { VideoSection } from './components/VideoSection';
import { PronunciationSection } from './components/PronunciationSection';
import { ResultsSection } from './components/ResultsSection';
import { motion, AnimatePresence } from 'motion/react';
import { BookOpen, Award, Play, LogOut, Home, Volume2, UserCheck, Sparkles } from 'lucide-react';
import { speakVietnamese } from './utils/speechSynthesis';

export default function App() {
  const [activeUser, setActiveUser] = useState<User | null>(null);
  const [activeTab, setActiveTab] = useState<string>('home'); // home, vocab, sentence, video, speak, results
  const [activeChapterId, setActiveChapterId] = useState<number>(1);

  // Auto-login from local session on widget initialization
  useEffect(() => {
    const rawUser = localStorage.getItem('english_l3_current_user');
    if (rawUser) {
      try {
        setActiveUser(JSON.parse(rawUser));
      } catch (e) {
        console.error("Failed to restore session user", e);
      }
    }
  }, []);

  const handleLoginSuccess = (loggedUser: User) => {
    setActiveUser(loggedUser);
    localStorage.setItem('english_l3_current_user', JSON.stringify(loggedUser));
    setActiveTab('home');
  };

  const handleLogout = () => {
    speakVietnamese("Tạm biệt con yêu nhé! Hẹn gặp lại con!");
    setActiveUser(null);
    localStorage.removeItem('english_l3_current_user');
    setActiveTab('home');
  };

  const handleUpdateUser = (updatedUser: User) => {
    setActiveUser(updatedUser);
    localStorage.setItem('english_l3_current_user', JSON.stringify(updatedUser));

    // Also sync back to master users directory
    const rawAll = localStorage.getItem('english_l3_users');
    if (rawAll) {
      try {
        const allUsers: User[] = JSON.parse(rawAll);
        const nextAll = allUsers.map(u => u.username.toLowerCase() === updatedUser.username.toLowerCase() ? updatedUser : u);
        localStorage.setItem('english_l3_users', JSON.stringify(nextAll));
      } catch (err) {
        console.error(err);
      }
    }
  };

  const handleSelectChapterSection = (chapterId: number, section: 'vocab' | 'sentence' | 'video' | 'speak') => {
    setActiveChapterId(chapterId);
    setActiveTab(section);
    speakVietnamese(`Bắt đầu học mục mới nào con yêu!`);
  };

  const handleClearHistory = () => {
    if (!activeUser) return;
    const confirmClear = window.confirm("Bé có chắc muốn xóa lịch sử luyện phát âm để luyện lại tốt hơn không nào?");
    if (confirmClear) {
      const updatedUser = { ...activeUser, practiceHistory: [] };
      handleUpdateUser(updatedUser);
      speakVietnamese("Đã xóa Nhật ký luyện giọng thành công!");
    }
  };

  // Render proper view safely
  const renderTabContent = () => {
    if (!activeUser) return null;

    switch (activeTab) {
      case 'home':
        return (
          <Dashboard
            user={activeUser}
            onSelectChapterSection={handleSelectChapterSection}
            onNavigate={(tab) => {
              setActiveTab(tab);
              speakVietnamese("Mở trang mới nhé!");
            }}
          />
        );
      case 'vocab':
        return (
          <VocabularySection
            user={activeUser}
            activeChapterId={activeChapterId}
            onUpdateUser={handleUpdateUser}
            onSelectChapter={(id) => setActiveChapterId(id)}
          />
        );
      case 'sentence':
        return (
          <SentenceSection
            user={activeUser}
            activeChapterId={activeChapterId}
            onUpdateUser={handleUpdateUser}
            onSelectChapter={(id) => setActiveChapterId(id)}
          />
        );
      case 'video':
        return (
          <VideoSection
            user={activeUser}
            activeChapterId={activeChapterId}
            onSelectChapter={(id) => setActiveChapterId(id)}
            onUpdateUser={handleUpdateUser}
          />
        );
      case 'speak':
        return (
          <PronunciationSection
            user={activeUser}
            activeChapterId={activeChapterId}
            onUpdateUser={handleUpdateUser}
            onSelectChapter={(id) => setActiveChapterId(id)}
          />
        );
      case 'results':
        return (
          <ResultsSection
            user={activeUser}
            onNavigate={(tab) => {
              setActiveTab(tab);
            }}
            onClearHistory={handleClearHistory}
          />
        );
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-slate-50 text-slate-800 font-sans flex flex-col relative overflow-x-hidden">
      {/* Background cute pattern decorates */}
      <div className="fixed top-24 left-10 text-9xl text-sky-150 font-sans select-none pointer-events-none z-0 opacity-40">☁️</div>
      <div className="fixed bottom-24 right-10 text-9xl text-sky-150 font-sans select-none pointer-events-none z-0 opacity-40">☁️</div>
      <div className="fixed top-1/2 right-12 text-8xl text-sky-150/50 font-sans select-none pointer-events-none z-0 opacity-40">🌈</div>

      {activeUser ? (
        /* APP LOGGED IN SHELL */
        <>
          {/* Top Sticky Cute Navbar Header */}
          <header className="bg-white py-3 px-4 md:px-8 z-20 sticky top-0 shadow-sm border-b border-slate-100">
            <div className="max-w-7xl mx-auto flex flex-col lg:flex-row items-center justify-between gap-4">
              
              {/* App identity with dynamic status */}
              <div 
                id="header-brand-logo"
                onClick={() => { setActiveTab('home'); speakVietnamese("Mở trang chủ nhé!"); }}
                className="flex items-center gap-3 cursor-pointer group"
              >
                <div className="w-12 h-12 bg-yellow-400 rounded-full flex items-center justify-center text-2xl group-hover:rotate-12 transition-all shadow-sm">
                  🌈
                </div>
                <div>
                  <h1 className="text-xl md:text-2xl font-black text-slate-800 tracking-tight uppercase leading-none">
                    Bé Vui Học Tiếng Anh Lớp 3
                  </h1>
                  <span className="text-[11px] font-bold text-slate-400 uppercase tracking-widest block mt-0.5">
                    Học liệu chuẩn Lớp 3 ✏️
                  </span>
                </div>
              </div>

              {/* Navigation Menu Buttons */}
              <nav id="header-nav-menu" className="flex flex-wrap items-center justify-center gap-2">
                <button
                  id="tab-btn-home"
                  onClick={() => { setActiveTab('home'); speakVietnamese("Trang chủ của con đây!"); }}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'home' 
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-305 hover:bg-slate-50'
                  }`}
                >
                  <span>🏠</span> Trang chủ
                </button>

                <button
                  id="tab-btn-vocab"
                  onClick={() => { setActiveTab('vocab'); speakVietnamese("Bắt đầu học từ vựng thôi con!"); }}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'vocab' 
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-305 hover:bg-slate-50'
                  }`}
                >
                  <span>📚</span> Từ vựng
                </button>

                <button
                  id="tab-btn-sentence"
                  onClick={() => { setActiveTab('sentence'); speakVietnamese("Học mẫu câu giao tiếp nhé!"); }}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'sentence' 
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-305 hover:bg-slate-50'
                  }`}
                >
                  <span>💬</span> Mẫu câu
                </button>

                <button
                  id="tab-btn-video"
                  onClick={() => { setActiveTab('video'); speakVietnamese("Hãy cùng xem video bài giảng nhé học sinh giỏi!"); }}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'video' 
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-305 hover:bg-slate-50'
                  }`}
                >
                  <span>📺</span> Video
                </button>

                <button
                  id="tab-btn-speak"
                  onClick={() => { setActiveTab('speak'); speakVietnamese("Hãy phát âm cùng cô Lucy nhé con yêu!"); }}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'speak' 
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-305 hover:bg-slate-50'
                  }`}
                >
                  <span>🎤</span> Luyện nói
                </button>

                <button
                  id="tab-btn-results"
                  onClick={() => { setActiveTab('results'); speakVietnamese("Cùng cô kiểm tra bảng thành tích học tập nhé!"); }}
                  className={`px-4 py-2.5 rounded-2xl font-bold text-xs md:text-sm flex items-center gap-1.5 transition-all cursor-pointer ${
                    activeTab === 'results' 
                      ? 'bg-sky-500 text-white shadow-lg shadow-sky-100' 
                      : 'bg-white text-slate-600 border border-slate-200 hover:border-sky-305 hover:bg-slate-50'
                  }`}
                >
                  <span>🏆</span> Kết quả
                </button>

                <button
                  id="tab-btn-logout"
                  onClick={handleLogout}
                  className="px-4 py-2 bg-rose-50 hover:bg-rose-100 text-rose-500 border border-rose-100 font-bold rounded-2xl transition-all cursor-pointer text-xs md:text-sm flex items-center gap-1"
                  title="Đăng xuất khỏi tài khoản của bé"
                >
                  Thoát
                </button>
              </nav>

            </div>
          </header>

          {/* Core Layout Main Page Container */}
          <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative z-10">
            <AnimatePresence mode="wait">
              <motion.div
                key={activeTab + '-' + activeChapterId}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2 }}
                className="w-full"
              >
                {renderTabContent()}
              </motion.div>
            </AnimatePresence>
          </main>
        </>
      ) : (
        /* APP ANONYMOUS AUTHENTICATION SHELL */
        <main className="flex-1 w-full max-w-7xl mx-auto px-4 py-8 relative z-10 flex items-center justify-center">
          <Auth onLoginSuccess={handleLoginSuccess} />
        </main>
      )}

      {/* Decorative interactive star icon floating element exactly as in Design HTML */}
      <div className="absolute bottom-8 right-8 w-20 h-20 bg-yellow-400 rounded-full border-4 border-white shadow-xl flex items-center justify-center text-3xl z-20 select-none animate-bounce">✨</div>
      <div className="absolute top-24 left-1/2 -translate-x-1/2 w-96 h-12 bg-white/30 blur-2xl rounded-full"></div>

      {/* Sweet Footer credits */}
      <footer className="bg-white text-slate-600 py-6 px-4 text-center border-t border-sky-100 relative z-10 text-xs font-semibold">
        <p className="opacity-95 flex items-center justify-center gap-1">
          <span>🌟 Thiết kế đáng yêu dành riêng cho học sinh tiểu học Việt Nam vươn xa thế giới! 🇻🇳</span>
        </p>
        <p className="opacity-50 mt-1 font-mono">
          Hỗ trợ công nghệ trình duyệt Google Chrome, Web Speech Recognition & SpeechSynthesis.
        </p>
      </footer>
    </div>
  );
}
