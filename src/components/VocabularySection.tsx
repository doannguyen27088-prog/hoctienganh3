import React, { useState } from 'react';
import { User, Chapter, Word, QuizQuestion } from '../types';
import { CHAPTERS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Check, AlertCircle, ShoppingBag, ArrowRight, ArrowLeft, Trophy, Sparkles, BookOpen } from 'lucide-react';
import { speakEnglish, speakVietnamese } from '../utils/speechSynthesis';

interface VocabularySectionProps {
  user: User;
  activeChapterId: number;
  onUpdateUser: (updatedUser: User) => void;
  onSelectChapter: (id: number) => void;
}

export function VocabularySection({ user, activeChapterId, onUpdateUser, onSelectChapter }: VocabularySectionProps) {
  const currentChapter = CHAPTERS.find(c => c.id === activeChapterId) || CHAPTERS[0];
  const words = currentChapter.vocabulary;

  // Study states
  const [currentWordIndex, setCurrentWordIndex] = useState<number>(0);
  const [quizMode, setQuizMode] = useState<boolean>(false);

  // Quiz states
  const vocabQuizzes = currentChapter.quizzes.filter(q => 
    q.type === 'vocab_select_meaning' || 
    q.type === 'vocab_match' || 
    q.type === 'vocab_select_image'
  );

  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [totalQuizScore, setTotalQuizScore] = useState<number>(0);

  const handleNextWord = () => {
    if (currentWordIndex < words.length - 1) {
      setCurrentWordIndex(prev => prev + 1);
    } else {
      // Prompt quiz mode
      setQuizMode(true);
      setCurrentQuizIndex(0);
      setIsAnswered(false);
      setSelectedAnswer('');
    }
  };

  const handlePrevWord = () => {
    if (currentWordIndex > 0) {
      setCurrentWordIndex(prev => prev - 1);
    }
  };

  const playWordAudio = (wordText: string) => {
    speakEnglish(wordText);
  };

  const handleAnswerSubmit = (option: string, question: QuizQuestion) => {
    if (isAnswered) return;
    
    setSelectedAnswer(option);
    setIsAnswered(true);

    const checkCorrect = option === question.correctAnswer;
    setIsCorrect(checkCorrect);

    if (checkCorrect) {
      // Play congrats voice
      const reward = 10; // 10 points per correct answer
      setEarnedPoints(prev => prev + reward);
      setTotalQuizScore(prev => prev + reward);
      
      // Update User state
      const updatedUser = { ...user };
      updatedUser.scoreVocabulary += reward;
      updatedUser.totalScore = updatedUser.scoreVocabulary + updatedUser.scoreSentence + updatedUser.scorePronunciation;
      
      // Save completed chapter marker if they completed everything
      if (!updatedUser.lessonsCompleted.includes(activeChapterId) && currentQuizIndex === vocabQuizzes.length - 1) {
        // Can conditionally add when overall quizzes of chapter are done, or add immediately
      }

      onUpdateUser(updatedUser);
      speakVietnamese("Tuyệt vời! Con trả lời đúng rồi!");
    } else {
      speakVietnamese(`Chưa chính xác rồi con học lại thêm nhé! Đáp án đúng là: ${question.correctAnswer}`);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < vocabQuizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer('');
      setIsAnswered(false);
    } else {
      // Completed Vocab Quizzes of this chapter!
      speakVietnamese(`Con đã hoàn thành câu hỏi từ vựng của chương ${activeChapterId}. Nhận được thêm điểm rồi học sinh giỏi ơi!`);
      
      // Complete lesson status check
      const updatedUser = { ...user };
      if (!updatedUser.lessonsCompleted.includes(activeChapterId)) {
        updatedUser.lessonsCompleted.push(activeChapterId);
        updatedUser.lessonsCompleted.sort((a,b) => a - b);
        onUpdateUser(updatedUser);
      }
    }
  };

  const restartChapterVocab = () => {
    setCurrentWordIndex(0);
    setQuizMode(false);
    setCurrentQuizIndex(0);
    setSelectedAnswer('');
    setIsAnswered(false);
    setTotalQuizScore(0);
  };

  return (
    <div id="vocab-tab" className="space-y-6">
      {/* Chapter Selection Pill bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
        <span className="font-sans font-extrabold text-slate-400 text-xs uppercase tracking-wider pl-2 whitespace-nowrap">Chọn Bài:</span>
        {CHAPTERS.map(ch => (
          <button
            key={ch.id}
            id={`vocab-chapter-btn-${ch.id}`}
            onClick={() => {
              onSelectChapter(ch.id);
              setCurrentWordIndex(0);
              setQuizMode(false);
              setCurrentQuizIndex(0);
              setSelectedAnswer('');
              setIsAnswered(false);
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

      <AnimatePresence mode="wait">
        {!quizMode ? (
          /* SECTION 1: STUDY FLASHCARDS */
          <motion.div
            key="flashcard-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[32px] border-b-8 border-slate-200 shadow-xl border border-slate-100 p-6 md:p-8 relative overflow-hidden"
          >
            {/* Visual Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-3xl">🎨</span>
                <span className="font-extrabold text-slate-700 uppercase tracking-wider text-xs">
                  Bé Học Từ Vựng: {currentChapter.title}
                </span>
              </div>
              <span className="bg-sky-50 text-sky-600 border border-sky-100 px-3 py-1 font-bold rounded-full text-xs">
                Từ số {currentWordIndex + 1}/{words.length}
              </span>
            </div>

            {/* Flashcard container */}
            {words[currentWordIndex] && (
              <div className="flex flex-col items-center justify-center p-6 space-y-6">
                {/* Bigger Emoji with interactive pulse */}
                <motion.div
                  key={words[currentWordIndex].id}
                  initial={{ scale: 0.7, rotate: -5 }}
                  animate={{ scale: 1, rotate: 0 }}
                  whileHover={{ scale: 1.1, rotate: 5 }}
                  className="w-36 h-36 md:w-44 md:h-44 bg-slate-50 rounded-full border border-slate-100 shadow-inner flex items-center justify-center text-7xl select-none"
                >
                  {words[currentWordIndex].emoji}
                </motion.div>

                {/* English Word & Audio play button */}
                <div className="text-center space-y-2">
                  <h3 id="vocab-word-en" className="text-4xl md:text-5xl font-black text-slate-800 capitalize tracking-tight flex items-center justify-center gap-2">
                    {words[currentWordIndex].english}
                  </h3>
                  
                  <div className="flex justify-center items-center gap-3">
                    <button
                      id="btn-vocab-listen"
                      onClick={() => playWordAudio(words[currentWordIndex].english)}
                      className="bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm py-2.5 px-5 rounded-2xl cursor-pointer shadow-md shadow-sky-100 flex items-center justify-center gap-2"
                    >
                      <Volume2 size={18} className="animate-bounce" /> Nghe và Đọc Theo
                    </button>
                  </div>

                  <p id="vocab-word-vi" className="text-xl md:text-2xl font-bold text-emerald-600 bg-emerald-50 px-6 py-2.5 rounded-2xl border border-emerald-100 inline-block mt-3">
                    Nghĩa: {words[currentWordIndex].vietnamese}
                  </p>
                </div>
              </div>
            )}

            {/* Slide Navigation */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-4">
              <button
                id="btn-vocab-prev"
                disabled={currentWordIndex === 0}
                onClick={handlePrevWord}
                className="bg-white hover:bg-slate-50 disabled:opacity-45 disabled:pointer-events-none text-slate-600 font-bold rounded-2xl py-3 px-5 border-2 border-slate-150 flex items-center gap-2 transition-all cursor-pointer text-sm shadow-sm"
              >
                <ArrowLeft size={16} /> Từ Trước
              </button>

              <button
                id="btn-vocab-next"
                onClick={handleNextWord}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl py-3 px-6 shadow-lg shadow-sky-100 flex items-center gap-2 transition-all cursor-pointer text-sm"
              >
                {currentWordIndex === words.length - 1 ? "Bắt Đầu Luyện Tập! 🎯" : "Từ Tiếp Theo "} 
                {currentWordIndex !== words.length - 1 && <ArrowRight size={16} />}
              </button>
            </div>
          </motion.div>
        ) : (
          /* SECTION 2: STUDY INTERACTIVE QUIZZES */
          <motion.div
            key="quiz-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[32px] border-b-8 border-slate-200 shadow-xl border border-slate-100 p-6 md:p-8 relative overflow-hidden"
          >
            {/* Confetti or simple visual helper */}
            <div className="absolute top-2 left-2 text-3xl opacity-20 select-none">🎈</div>
            <div className="absolute top-2 right-2 text-3xl opacity-20 select-none">🔔</div>

            {/* Quiz Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📝</span>
                <span className="font-extrabold text-slate-700 uppercase tracking-wider text-xs">
                  Bé Vui Ôn Tập: Kiểm Tra Từ Vựng!
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1 font-bold rounded-full text-xs">
                  Câu hỏi {currentQuizIndex + 1}/{vocabQuizzes.length}
                </span>
                <span className="bg-yellow-400 text-yellow-950 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm">
                  ⭐ <span id="quiz-earned-pts">{totalQuizScore}đ</span>
                </span>
              </div>
            </div>

            {vocabQuizzes.length > 0 && vocabQuizzes[currentQuizIndex] ? (
              <div className="space-y-6">
                {/* The actual question display */}
                <div className="bg-sky-50/50 rounded-2xl border border-sky-100 p-5 text-center">
                  <h4 id="vocab-quiz-question" className="text-xl md:text-2xl font-black text-slate-800 font-sans">
                    {vocabQuizzes[currentQuizIndex].question}
                  </h4>
                  {vocabQuizzes[currentQuizIndex].targetText && (
                    <div className="mt-3 flex justify-center">
                      <button
                        onClick={() => speakEnglish(vocabQuizzes[currentQuizIndex].targetText || "")}
                        className="p-3 bg-sky-500 hover:bg-sky-600 text-white rounded-full shadow-md hover:scale-105 flex items-center gap-1.5 font-bold text-xs"
                      >
                        <Volume2 size={16} /> Bấm để nghe
                      </button>
                    </div>
                  )}
                </div>

                {/* Option selections */}
                <div id="vocab-quiz-options" className="grid gap-3 sm:grid-cols-2">
                  {vocabQuizzes[currentQuizIndex].options.map((opt, oIdx) => {
                    const isSelected = selectedAnswer === opt;
                    const isCorrAnswer = opt === vocabQuizzes[currentQuizIndex].correctAnswer;
                    
                    let btnStyle = "bg-white hover:bg-sky-50 text-slate-700 border-slate-150 hover:border-sky-300 shadow-sm";
                    if (isAnswered) {
                      if (isCorrAnswer) {
                        btnStyle = "bg-emerald-50 text-emerald-700 border-emerald-300";
                      } else if (isSelected) {
                        btnStyle = "bg-rose-50 text-rose-700 border-rose-300";
                      } else {
                        btnStyle = "bg-slate-50 text-slate-450 border-slate-150 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        id={`quiz-option-${oIdx}`}
                        disabled={isAnswered}
                        onClick={() => handleAnswerSubmit(opt, vocabQuizzes[currentQuizIndex])}
                        className={`p-4 rounded-2xl border-2 text-base md:text-lg font-bold transition-all cursor-pointer text-left flex items-center justify-between ${btnStyle}`}
                      >
                        <span>{opt}</span>
                        {isAnswered && isCorrAnswer && <Check size={20} className="text-emerald-600" />}
                        {isAnswered && isSelected && !isCorrAnswer && <AlertCircle size={20} className="text-rose-500" />}
                      </button>
                    );
                  })}
                </div>

                {/* Result Message & Feedback */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border text-center text-sm md:text-base font-bold ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}
                  >
                    {isCorrect ? (
                      <span id="quiz-correct-msg" className="flex items-center justify-center gap-1.5">
                        🎉 Tuyệt vời! Chúc mừng con đã trả lời đúng! Cô Lucy khen nhé! 😽 (+10 điểm)
                      </span>
                    ) : (
                      <span id="quiz-incorrect-msg" className="flex items-center justify-center gap-1.5">
                        💥 Bé gần tìm được câu trả lời rồi! Câu đúng là "{vocabQuizzes[currentQuizIndex].correctAnswer}". Học bài chăm chút lần sau con sẽ nhớ ngay nhé!
                      </span>
                    )}

                    <div className="flex justify-center mt-3">
                      <button
                        id="btn-vocab-quiz-next"
                        onClick={handleNextQuiz}
                        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-6 rounded-2xl shadow-lg shadow-sky-100 flex items-center gap-1 cursor-pointer text-sm"
                      >
                        {currentQuizIndex === vocabQuizzes.length - 1 ? "Hoàn Thành Chương Học! 🏆" : "Tiếp Theo "} 
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 space-y-4">
                <span className="text-5xl">🏆</span>
                <h4 className="text-xl font-bold text-slate-800">Không tìm thấy bài tập nào cụ thể của chương này!</h4>
              </div>
            )}

            {/* Secondary navigation to restart study cards */}
            <div className="border-t border-slate-100 pt-5 mt-6 flex justify-between items-center text-xs font-bold text-slate-400">
              <button
                id="btn-vocab-mode-reset"
                onClick={restartChapterVocab}
                className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-center cursor-pointer font-bold border border-slate-150"
              >
                🔄 Học lại từ vựng
              </button>
              <span>⭐ Con hãy tích cực kiếm thật nhiều điểm nhé!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
