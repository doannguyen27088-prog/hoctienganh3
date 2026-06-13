import React, { useState } from 'react';
import { User, Chapter, Sentence, QuizQuestion } from '../types';
import { CHAPTERS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Volume2, Check, AlertCircle, ArrowRight, ArrowLeft, Trophy, Sparkles, HelpCircle } from 'lucide-react';
import { speakEnglish, speakVietnamese } from '../utils/speechSynthesis';

interface SentenceSectionProps {
  user: User;
  activeChapterId: number;
  onUpdateUser: (updatedUser: User) => void;
  onSelectChapter: (id: number) => void;
}

export function SentenceSection({ user, activeChapterId, onUpdateUser, onSelectChapter }: SentenceSectionProps) {
  const currentChapter = CHAPTERS.find(c => c.id === activeChapterId) || CHAPTERS[0];
  const sentences = currentChapter.sentences;

  // Navigation states
  const [currentSentenceIndex, setCurrentSentenceIndex] = useState<number>(0);
  const [quizMode, setQuizMode] = useState<boolean>(false);

  // Quiz states (filter sentence_fill and sentence_arrange type)
  const sentenceQuizzes = currentChapter.quizzes.filter(q => 
    q.type === 'sentence_fill' || 
    q.type === 'sentence_arrange' ||
    q.type === 'listen_select'
  );

  const [currentQuizIndex, setCurrentQuizIndex] = useState<number>(0);
  const [selectedAnswer, setSelectedAnswer] = useState<string>('');
  const [isAnswered, setIsAnswered] = useState<boolean>(false);
  const [isCorrect, setIsCorrect] = useState<boolean>(false);
  const [earnedPoints, setEarnedPoints] = useState<number>(0);
  const [totalQuizScore, setTotalQuizScore] = useState<number>(0);

  // Interactive sentence pieces for arrange (extra fun visual if needed, but selecting from pre-defined is extremely robust!)
  const handleNextSentence = () => {
    if (currentSentenceIndex < sentences.length - 1) {
      setCurrentSentenceIndex(prev => prev + 1);
    } else {
      setQuizMode(true);
      setCurrentQuizIndex(0);
      setIsAnswered(false);
      setSelectedAnswer('');
    }
  };

  const handlePrevSentence = () => {
    if (currentSentenceIndex > 0) {
      setCurrentSentenceIndex(prev => prev - 1);
    }
  };

  const playSentenceAudio = (sentenceText: string) => {
    speakEnglish(sentenceText);
  };

  const handleAnswerSubmit = (option: string, question: QuizQuestion) => {
    if (isAnswered) return;

    setSelectedAnswer(option);
    setIsAnswered(true);

    const checkCorrect = option === question.correctAnswer;
    setIsCorrect(checkCorrect);

    if (checkCorrect) {
      const reward = 15; // 15 points per structure quiz
      setEarnedPoints(prev => prev + reward);
      setTotalQuizScore(prev => prev + reward);

      const updatedUser = { ...user };
      updatedUser.scoreSentence += reward;
      updatedUser.totalScore = updatedUser.scoreVocabulary + updatedUser.scoreSentence + updatedUser.scorePronunciation;

      onUpdateUser(updatedUser);
      speakVietnamese("Tuyệt vời! Con giỏi mẫu câu này quá!");
    } else {
      speakVietnamese(`Bé cần cố gắng thêm nhé! Đáp án là: ${question.correctAnswer}`);
    }
  };

  const handleNextQuiz = () => {
    if (currentQuizIndex < sentenceQuizzes.length - 1) {
      setCurrentQuizIndex(prev => prev + 1);
      setSelectedAnswer('');
      setIsAnswered(false);
    } else {
      speakVietnamese(`Con đã hoàn thành câu hỏi về mẫu câu của chương ${activeChapterId}. Tiếp tục nỗ lực nhé!`);
      const updatedUser = { ...user };
      if (!updatedUser.lessonsCompleted.includes(activeChapterId)) {
        updatedUser.lessonsCompleted.push(activeChapterId);
        updatedUser.lessonsCompleted.sort((a,b) => a - b);
        onUpdateUser(updatedUser);
      }
    }
  };

  const restartChapterSentences = () => {
    setCurrentSentenceIndex(0);
    setQuizMode(false);
    setCurrentQuizIndex(0);
    setSelectedAnswer('');
    setIsAnswered(false);
    setTotalQuizScore(0);
  };

  return (
    <div id="sentences-tab" className="space-y-6">
      {/* Chapter Selection Pill bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
        <span className="font-sans font-extrabold text-slate-400 text-xs uppercase tracking-wider pl-2 whitespace-nowrap">Chọn Bài:</span>
        {CHAPTERS.map(ch => (
          <button
            key={ch.id}
            id={`sentences-chapter-btn-${ch.id}`}
            onClick={() => {
              onSelectChapter(ch.id);
              setCurrentSentenceIndex(0);
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
          /* SECTION 1: STUDY PATTERNS */
          <motion.div
            key="sentence-study-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[32px] border-b-8 border-slate-200 shadow-xl border border-slate-100 p-6 md:p-8 relative overflow-hidden"
          >
            {/* Visual background elements */}
            <div className="absolute top-4 left-6 text-2xl opacity-15 select-none font-sans">☁️</div>
            <div className="absolute bottom-10 right-10 text-4xl opacity-15 select-none">✏️</div>

            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-3xl">💬</span>
                <span className="font-extrabold text-slate-700 uppercase tracking-wider text-xs">
                  Mẫu Câu Bé Vui Học: {currentChapter.title}
                </span>
              </div>
              <span className="bg-sky-50 text-sky-600 border border-sky-100 px-3 py-1 font-bold rounded-full text-xs">
                Mẫu số {currentSentenceIndex + 1}/{sentences.length}
              </span>
            </div>

            {/* Main Sentence display */}
            {sentences[currentSentenceIndex] && (
              <div className="flex flex-col items-center justify-center p-6 space-y-6 text-center">
                <div className="p-4 bg-rose-50 rounded-full border border-rose-100 select-none text-4xl animate-pulse">
                  🌟
                </div>

                <div className="space-y-4">
                  <h3 id="sentence-text-en" className="text-3xl md:text-4xl font-black text-slate-800 font-sans tracking-tight">
                    {sentences[currentSentenceIndex].english}
                  </h3>

                  <button
                    id="btn-sentence-listen"
                    onClick={() => playSentenceAudio(sentences[currentSentenceIndex].english)}
                    className="mx-auto bg-sky-500 hover:bg-sky-600 text-white font-bold text-sm py-2.5 px-5 rounded-2xl shadow-lg shadow-sky-100 flex items-center gap-2 cursor-pointer"
                  >
                    <Volume2 size={18} className="animate-wiggle" /> Nghe cô đọc mẫu
                  </button>

                  <div className="pt-3">
                    <p id="sentence-text-vi" className="text-lg md:text-xl font-bold text-slate-600 bg-slate-50 border border-slate-100 px-6 py-3 rounded-2xl inline-block">
                      Dịch tiếng Việt: <strong className="text-sky-600 font-black">{sentences[currentSentenceIndex].vietnamese}</strong>
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation buttons */}
            <div className="flex items-center justify-between border-t border-slate-100 pt-6 mt-4">
              <button
                id="btn-sentence-prev"
                disabled={currentSentenceIndex === 0}
                onClick={handlePrevSentence}
                className="bg-white hover:bg-slate-50 disabled:opacity-45 disabled:pointer-events-none text-slate-600 font-bold rounded-2xl py-3 px-5 border-2 border-slate-150 flex items-center gap-2 transition-all cursor-pointer text-sm shadow-sm"
              >
                <ArrowLeft size={16} /> Câu Trước
              </button>

              <button
                id="btn-sentence-next"
                onClick={handleNextSentence}
                className="bg-sky-500 hover:bg-sky-600 text-white font-bold rounded-2xl py-3 px-6 shadow-lg shadow-sky-100 flex items-center gap-2 transition-all cursor-pointer text-sm"
              >
                {currentSentenceIndex === sentences.length - 1 ? "Bắt Đầu Thực Hành! 🎯" : "Câu Tiếp Theo"} 
                {currentSentenceIndex !== sentences.length - 1 && <ArrowRight size={16} />}
              </button>
            </div>
          </motion.div>
        ) : (
          /* SECTION 2: INTERACTIVE SENTENCE PRACTICE QUIZZES */
          <motion.div
            key="sentence-quiz-panel"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="bg-white rounded-[32px] border-b-8 border-slate-200 shadow-xl border border-slate-100 p-6 md:p-8 relative overflow-hidden"
          >
            {/* Header */}
            <div className="flex items-center justify-between border-b border-slate-100 pb-4 mb-6">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🧩</span>
                <span className="font-extrabold text-slate-700 uppercase tracking-wider text-xs">
                  Thử Thách Ghép Từ & Mẫu Câu!
                </span>
              </div>
              <div className="flex items-center gap-3">
                <span className="bg-slate-50 border border-slate-100 text-slate-600 px-3 py-1 font-bold rounded-full text-xs">
                  Câu {currentQuizIndex + 1}/{sentenceQuizzes.length}
                </span>
                <span className="bg-yellow-400 text-yellow-950 font-bold px-3 py-1 rounded-full text-xs flex items-center gap-1 shadow-sm">
                  ⭐ <span id="sentence-earned-pts">{totalQuizScore}đ</span>
                </span>
              </div>
            </div>

            {sentenceQuizzes.length > 0 && sentenceQuizzes[currentQuizIndex] ? (
              <div className="space-y-6">
                <div className="bg-sky-50/50 rounded-2xl border border-sky-100 p-5 text-center">
                  <span className="text-xs bg-sky-100 text-sky-800 px-3 py-1 rounded-full font-bold uppercase tracking-wider mb-2.5 inline-block">
                    {sentenceQuizzes[currentQuizIndex].type === 'sentence_arrange' ? 'Sắp xếp câu' : 'Điền từ thích hợp'}
                  </span>
                  <h4 id="sentence-quiz-question" className="text-lg md:text-xl font-bold text-slate-800 font-sans">
                    {sentenceQuizzes[currentQuizIndex].question}
                  </h4>
                </div>

                {/* Grid Options Selection */}
                <div id="sentence-quiz-options" className="grid gap-3">
                  {sentenceQuizzes[currentQuizIndex].options.map((opt, oIdx) => {
                    const isSelected = selectedAnswer === opt;
                    const isCorrAnswer = opt === sentenceQuizzes[currentQuizIndex].correctAnswer;
                    
                    let choiceBg = "bg-white hover:bg-sky-50 text-slate-700 border-slate-150 hover:border-sky-300 shadow-sm";
                    if (isAnswered) {
                      if (isCorrAnswer) {
                        choiceBg = "bg-emerald-50 text-emerald-700 border-emerald-300";
                      } else if (isSelected) {
                        choiceBg = "bg-rose-50 text-rose-700 border-rose-300";
                      } else {
                        choiceBg = "bg-slate-50 text-slate-400 border-slate-150 opacity-60";
                      }
                    }

                    return (
                      <button
                        key={oIdx}
                        id={`sentence-quiz-option-${oIdx}`}
                        disabled={isAnswered}
                        onClick={() => handleAnswerSubmit(opt, sentenceQuizzes[currentQuizIndex])}
                        className={`p-3.5 rounded-2xl border-2 text-base font-bold transition-all cursor-pointer text-left flex items-center justify-between ${choiceBg}`}
                      >
                        <span className="flex items-center gap-2">
                          <span className="w-8 h-8 rounded-full bg-slate-100 text-slate-600 flex items-center justify-center font-bold text-xs border border-slate-200">
                            {String.fromCharCode(65 + oIdx)}
                          </span>
                          {opt}
                        </span>
                        {isAnswered && isCorrAnswer && <Check size={20} className="text-emerald-600" />}
                        {isAnswered && isSelected && !isCorrAnswer && <AlertCircle size={20} className="text-rose-500" />}
                      </button>
                    );
                  })}
                </div>

                {/* Score Alert */}
                {isAnswered && (
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className={`p-4 rounded-2xl border text-center text-sm md:text-base font-bold ${isCorrect ? 'bg-emerald-50 border-emerald-200 text-emerald-800' : 'bg-rose-50 border-rose-200 text-rose-800'}`}
                  >
                    {isCorrect ? (
                      <span id="sentence-correct-msg" className="flex items-center justify-center gap-1.5">
                        🌟 Tuyệt vời! Ghép từ thành câu chuẩn rồi con ơi! Cô Lucy vô cùng tự hào! (+15 điểm)
                      </span>
                    ) : (
                      <span id="sentence-incorrect-msg" className="flex items-center justify-center gap-1.5">
                        ❌ Ôi, câu này chưa chuẩn rồi bé yêu. Hãy xem câu mẫu nhé: "{sentenceQuizzes[currentQuizIndex].correctAnswer}"
                      </span>
                    )}

                    <div className="flex justify-center mt-3">
                      <button
                        id="btn-sentences-quiz-next"
                        onClick={handleNextQuiz}
                        className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-2.5 px-6 rounded-2xl shadow-lg shadow-sky-100 flex items-center gap-1 cursor-pointer text-sm"
                      >
                        {currentQuizIndex === sentenceQuizzes.length - 1 ? "Hoàn Thành Ôn Luyện! 🏆" : "Tiếp Theo "} 
                        <ArrowRight size={16} />
                      </button>
                    </div>
                  </motion.div>
                )}
              </div>
            ) : (
              <div className="text-center p-8 space-y-4">
                <span className="text-5xl">🏆</span>
                <h4 className="text-xl font-bold text-slate-800">Mẫu câu thi đua của chương này đang đợi bé nhé!</h4>
              </div>
            )}

            {/* Clear footer navigation */}
            <div className="border-t border-slate-100 pt-5 mt-6 flex justify-between items-center text-xs font-bold text-slate-400">
              <button
                id="btn-sentence-mode-reset"
                onClick={restartChapterSentences}
                className="bg-slate-50 hover:bg-slate-100 text-slate-600 px-4 py-2 rounded-xl text-center cursor-pointer font-bold border border-slate-150"
              >
                🔄 Học lại mẫu câu
              </button>
              <span>⭐ Bé rất ngoan và học giỏi mẫu câu đó!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
