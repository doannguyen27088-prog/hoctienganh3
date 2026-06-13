import React, { useState, useEffect, useRef } from 'react';
import { User, Chapter, PracticeHistoryItem } from '../types';
import { CHAPTERS } from '../data';
import { motion, AnimatePresence } from 'motion/react';
import { Mic, MicOff, Volume2, Sparkles, AlertCircle, History, CheckCircle, Smile, HelpCircle } from 'lucide-react';
import { speakEnglish, speakVietnamese } from '../utils/speechSynthesis';
import { evaluatePronunciation } from '../utils/pronunciation';

interface PronunciationSectionProps {
  user: User;
  activeChapterId: number;
  onUpdateUser: (updatedUser: User) => void;
  onSelectChapter: (id: number) => void;
}

export function PronunciationSection({ user, activeChapterId, onUpdateUser, onSelectChapter }: PronunciationSectionProps) {
  const currentChapter = CHAPTERS.find(c => c.id === activeChapterId) || CHAPTERS[0];

  // Options to speak (all vocabularies and sentences in this chapter!)
  const speakOptions = [
    ...currentChapter.vocabulary.map(v => ({ text: v.english, type: 'Từ vựng', vietnamese: v.vietnamese, icon: v.emoji })),
    ...currentChapter.sentences.map(s => ({ text: s.english, type: 'Mẫu câu', vietnamese: s.vietnamese, icon: '💬' }))
  ];

  // State
  const [selectedTarget, setSelectedTarget] = useState<string>(speakOptions[0]?.text || '');
  const [isListening, setIsListening] = useState<boolean>(false);
  const [recognizedText, setRecognizedText] = useState<string>('');
  const [evaluation, setEvaluation] = useState<{
    score: number;
    feedback: string;
    missingWords: string[];
    incorrectWords: string[];
    hasEvaluated: boolean;
  }>({
    score: 0,
    feedback: '',
    missingWords: [],
    incorrectWords: [],
    hasEvaluated: false
  });

  const [recognitionError, setRecognitionError] = useState<string>('');
  const [isSupported, setIsSupported] = useState<boolean>(true);
  const [lucyState, setLucyState] = useState<'idle' | 'speaking' | 'listening' | 'happy' | 'thinking'>('idle');

  // References
  const recognitionRef = useRef<any>(null);

  // Sync selected target when chapter changes
  useEffect(() => {
    if (speakOptions.length > 0) {
      setSelectedTarget(speakOptions[0].text);
      setRecognizedText('');
      setEvaluation({
        score: 0,
        feedback: '',
        missingWords: [],
        incorrectWords: [],
        hasEvaluated: false
      });
    }
  }, [activeChapterId]);

  // Support check & SpeechRecognition Initialization
  useEffect(() => {
    const SpeechRecognition = (window as any).SpeechRecognition || (window as any).webkitSpeechRecognition;
    if (!SpeechRecognition) {
      setIsSupported(false);
      return;
    }

    try {
      const rec = new SpeechRecognition();
      rec.continuous = false;
      rec.interimResults = false;
      rec.lang = 'en-US';

      rec.onstart = () => {
        setIsListening(true);
        setLucyState('listening');
        setRecognizedText('Cô Lucy đang lắng nghe con đọc ấy...');
        setRecognitionError('');
      };

      rec.onerror = (event: any) => {
        console.error("Speech Recognition Error:", event);
        setIsListening(false);
        setLucyState('idle');
        
        let errorMsg = "Cô chưa nghe rõ lắm, bé đọc to lại lần nữa nhé! 💖";
        if (event.error === 'not-allowed') {
          errorMsg = "Bé cần cho phép trình duyệt sử dụng Micro của máy để cô Lucy nghe nhé! 🎙️";
        } else if (event.error === 'no-speech') {
          errorMsg = "Cô chưa nghe rõ, con hãy nói lại nhé. 😘";
        }
        
        setRecognitionError(errorMsg);
        speakVietnamese(errorMsg);
      };

      rec.onend = () => {
        setIsListening(false);
        setLucyState('idle');
      };

      rec.onresult = (event: any) => {
        const result = event.results[0][0].transcript;
        handleSpeechResult(result);
      };

      recognitionRef.current = rec;
    } catch (e) {
      console.error(e);
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        recognitionRef.current.abort();
      }
    };
  }, [selectedTarget]);

  const handleSpeechResult = (studentSpeech: string) => {
    setRecognizedText(studentSpeech);
    setLucyState('thinking');

    // Strict evaluation against selected target
    const result = evaluatePronunciation(selectedTarget, studentSpeech);

    setTimeout(() => {
      setEvaluation({
        score: result.score,
        feedback: result.feedback,
        missingWords: result.missingWords,
        incorrectWords: result.incorrectWords,
        hasEvaluated: true
      });

      if (result.score >= 80) {
        setLucyState('happy');
      } else {
        setLucyState('idle');
      }

      // Speack result message in Vietnamese
      speakVietnamese(result.feedback);

      // Save practice log to active logged in user dynamically!
      const updatedUser = { ...user };
      const newHistoryItem: PracticeHistoryItem = {
        id: 'speak-' + Date.now(),
        chapterId: currentChapter.id,
        chapterTitle: currentChapter.title,
        timestamp: new Date().toLocaleTimeString('vi-VN') + " " + new Date().toLocaleDateString('vi-VN'),
        sampleText: selectedTarget,
        userText: studentSpeech,
        score: result.score,
        feedback: result.feedback,
        missingWords: result.missingWords,
        incorrectWords: result.incorrectWords
      };

      updatedUser.practiceHistory = [newHistoryItem, ...updatedUser.practiceHistory];
      
      // Update best pronunciation score helper
      if (result.score > updatedUser.scorePronunciation) {
        updatedUser.scorePronunciation = result.score;
      }
      
      // Complete lesson status marker
      if (result.score >= 80 && !updatedUser.lessonsCompleted.includes(currentChapter.id)) {
        // Can complete chapter on pronunciation pass of target sentences!
      }

      updatedUser.totalScore = updatedUser.scoreVocabulary + updatedUser.scoreSentence + updatedUser.scorePronunciation;
      onUpdateUser(updatedUser);

    }, 850);
  };

  const startListening = () => {
    if (!isSupported) {
      speakVietnamese("Trình duyệt không hỗ trợ luyện nói, vui lòng sử dụng trình duyệt Google Chrome con nhé!");
      alert("Trình duyệt chưa hỗ trợ công nghệ luyện phát âm, vui lòng mở ứng dụng bằng Google Chrome trên máy tính hoặc điện thoại nhé! 💖");
      return;
    }

    if (recognitionRef.current) {
      setEvaluation(prev => ({ ...prev, hasEvaluated: false }));
      setRecognizedText('');
      setRecognitionError('');
      
      try {
        recognitionRef.current.start();
      } catch (err: any) {
        // Fallback or restart
        try {
          recognitionRef.current.stop();
          setTimeout(() => {
            recognitionRef.current.start();
          }, 300);
        } catch (e) {
          console.error("Failed restarting recognition context", e);
        }
      }
    }
  };

  const playTargetPronunciation = () => {
    setLucyState('speaking');
    speakEnglish(selectedTarget, () => {
      setLucyState('idle');
    });
  };

  // Avatar helper
  const getLucyExpressionEmoji = () => {
    switch (lucyState) {
      case 'listening': return '😽🎙️';
      case 'speaking': return '😸💬';
      case 'happy': return '😻🎉';
      case 'thinking': return '😼💭';
      default: return '🐱💝';
    }
  };

  const getLucyStateText = () => {
    switch (lucyState) {
      case 'listening': return 'Cô Lucy đang lắng nghe con... Bé đọc đi!';
      case 'speaking': return 'Cô Lucy đang đọc mẫu phát âm đấy!';
      case 'happy': return 'Tuyệt cú mèo! Con phát âm chuẩn quá!';
      case 'thinking': return 'Cô đang nghe phân tích giọng bé nhé...';
      default: return 'Chào con! Hãy luyện phát âm tiếng Anh cùng cô Lucy nhé!';
    }
  };

  return (
    <div id="pronunciation-tab" className="space-y-6">
      {/* Chapter select bar */}
      <div className="flex items-center gap-3 bg-white p-3 rounded-2xl border border-slate-100 overflow-x-auto shadow-sm">
        <span className="font-sans font-extrabold text-slate-400 text-xs uppercase tracking-wider pl-2 whitespace-nowrap">Chọn Bài:</span>
        {CHAPTERS.map(ch => (
          <button
            key={ch.id}
            id={`pron-chapter-btn-${ch.id}`}
            onClick={() => onSelectChapter(ch.id)}
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

      <div className="grid md:grid-cols-3 gap-6 items-start">
        {/* Left Side: Teacher Lucy Avatar Card */}
        <div className="bg-white rounded-[32px] border-b-8 border-slate-200 shadow-xl border border-slate-100 p-6 text-center space-y-4 relative overflow-hidden">
          <div className="absolute top-1 right-2 text-3xl opacity-20 animate-spin duration-5000">⚙️</div>
          <div className="absolute top-10 left-1 text-2xl opacity-10">☁️</div>

          <h3 className="font-bold text-slate-800 border-b border-slate-100 pb-2 flex items-center justify-center gap-2">
            <span>Giáo Viên Cô Lucy Chấm Điểm</span>
          </h3>

          <div className="flex flex-col items-center justify-center">
            {/* Visual avatar image representation */}
            <motion.div 
              animate={lucyState === 'listening' ? { scale: [1, 1.05, 1], rotate: [0, 2, -2, 0] } : (lucyState === 'happy' ? { y: [0, -10, 0, -10, 0] } : {})}
              transition={{ repeat: Infinity, duration: 1.5 }}
              className="w-28 h-28 md:w-32 md:h-32 rounded-full border border-slate-100 bg-slate-50 flex items-center justify-center text-6xl md:text-7xl shadow-inner select-none"
            >
              {getLucyExpressionEmoji()}
            </motion.div>
            <span className="bg-yellow-400 text-yellow-950 font-bold px-3 py-1 text-xs rounded-full mt-2 border border-yellow-300 shadow-sm">
              Teacher Lucy 🐱
            </span>
          </div>

          <div className="bg-sky-50/50 p-4 rounded-2xl border border-sky-100">
            <p className="text-xs font-bold text-slate-400 uppercase tracking-widest mb-1">Trạng thái cô Lucy:</p>
            <p id="lucy-advice-msg" className="text-xs md:text-sm font-bold text-slate-750 leading-relaxed">
              "{getLucyStateText()}"
            </p>
          </div>

          {!isSupported && (
            <div id="recon-unsupport-alert" className="p-3 bg-rose-50 border border-slate-100 text-rose-800 rounded-xl text-xs font-bold leading-relaxed">
              ⚠️ Trình duyệt của bé không hỗ trợ nhận diện tiếng Anh tự động. Hãy dùng <strong>Google Chrome</strong> trên máy tính để học nói dễ nhất nha con học trò cưng!
            </div>
          )}
        </div>

        {/* Right Side: Primary interactive Pronounce Interface */}
        <div className="md:col-span-2 space-y-6">
          <div className="bg-white rounded-[32px] border-b-8 border-slate-200 shadow-xl border border-slate-100 p-6 space-y-6">
            
            {/* Choose text to speak list option selectors */}
            <div>
              <label className="block text-sm font-bold text-slate-600 mb-2.5 flex items-center gap-1.5">
                <span>👇 Nhấp vào từ hoặc mẫu câu con thích học nói nhất:</span>
              </label>

              <div id="speak-targets-list" className="flex flex-wrap gap-2 max-h-[140px] overflow-y-auto p-1.5 border border-dashed border-slate-150 rounded-2xl">
                {speakOptions.map((opt, oIdx) => {
                  const isSelected = selectedTarget === opt.text;
                  return (
                    <button
                      key={oIdx}
                      id={`speak-target-btn-${oIdx}`}
                      onClick={() => {
                        setSelectedTarget(opt.text);
                        setRecognizedText('');
                        setEvaluation({ score: 0, feedback: '', missingWords: [], incorrectWords: [], hasEvaluated: false });
                        setRecognitionError('');
                      }}
                      className={`px-3 py-2 text-xs font-bold rounded-xl transition-all cursor-pointer hover:scale-102 flex items-center gap-1.5 ${
                        isSelected 
                          ? 'bg-sky-500 text-white border-sky-550 shadow-md shadow-sky-100' 
                          : 'bg-slate-50 hover:bg-slate-100 text-slate-600 border border-slate-150'
                      }`}
                    >
                      <span>{opt.icon}</span>
                      <span>{opt.text}</span>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Speaking Center stage */}
            <div className="bg-slate-50 p-5 rounded-2xl border border-slate-150 text-center space-y-5">
              <div className="space-y-1">
                <span className="text-xs bg-sky-100 text-sky-800 font-bold px-3 py-0.5 rounded-full inline-block">
                  Câu bé cần luyện phát âm:
                </span>
                <h4 id="speak-sample-text" className="text-3xl font-black text-slate-800 font-sans tracking-tight">
                  {selectedTarget}
                </h4>
                <p className="text-xs font-bold text-slate-400 italic">
                  Dịch: {speakOptions.find(o => o.text === selectedTarget)?.vietnamese || ''}
                </p>
              </div>

              {/* Action Buttons to hear or record speech */}
              <div className="flex justify-center items-center gap-4">
                <button
                  id="btn-speak-listen-model"
                  onClick={playTargetPronunciation}
                  className="bg-sky-500 hover:bg-sky-600 text-white font-bold py-3 px-5 rounded-2xl shadow-lg shadow-sky-100 cursor-pointer transition-all flex items-center gap-1.5 text-sm"
                >
                  <Volume2 size={20} className="animate-pulse" /> Cô đọc mẫu
                </button>

                <button
                  id="btn-speak-record"
                  onClick={startListening}
                  className={`py-3.5 px-6 rounded-2xl font-bold text-white cursor-pointer shadow-lg transition-all flex items-center gap-2 text-base ${
                    isListening
                      ? 'bg-rose-500 hover:bg-rose-600 shadow-lg shadow-rose-100 animate-pulse'
                      : 'bg-emerald-500 hover:bg-emerald-600 shadow-lg shadow-emerald-100'
                  }`}
                >
                  <Mic size={22} className={isListening ? 'animate-bounce' : ''} />
                  {isListening ? 'Hệ thống đang nghe con...' : 'Nhấp rồi nói (Bắt đầu nói) 🎙️'}
                </button>
              </div>
            </div>

            {/* Recognized Text Log */}
            {recognizedText && (
              <div className="bg-slate-50 border border-slate-200 rounded-2xl p-4 text-center">
                <span className="text-xs font-bold text-slate-400 block mb-1">Máy nghe được câu bé nói:</span>
                <p id="student-recognized-speech" className="text-lg font-bold text-slate-700 italic">
                  "{recognizedText}"
                </p>
              </div>
            )}

            {/* Lucy Analysis Feedback card */}
            <AnimatePresence>
              {evaluation.hasEvaluated && (
                <motion.div
                  initial={{ opacity: 0, y: 15 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-sky-50/50 border border-sky-100 rounded-2xl p-5 space-y-4"
                >
                  <div className="flex flex-col sm:flex-row items-center justify-between border-b border-sky-100 pb-3 gap-3">
                    <div className="flex items-center gap-1.5">
                      <span className="text-2xl">👩‍🏫</span>
                      <h4 className="font-sans font-bold text-slate-800">Phóng Viên Cô Lucy Đánh Giá:</h4>
                    </div>

                    <div className="flex items-center gap-2">
                      <span className="text-sm font-bold text-slate-400">Độ chuẩn:</span>
                      <span id="speech-eval-score" className="bg-yellow-400 text-yellow-950 px-4 py-1.5 rounded-full font-black text-xl shadow-md border border-yellow-500">
                        ⭐ {evaluation.score} điểm
                      </span>
                    </div>
                  </div>

                  {/* Feedback text */}
                  <div className="space-y-3">
                    <p id="speech-eval-feedback" className="text-sm md:text-base font-bold text-slate-700 bg-white px-4 py-3 rounded-xl border border-slate-100 shadow-inner">
                      🐱 "{evaluation.feedback}"
                    </p>

                    {/* Word-by-word debug diagnostics */}
                    {(evaluation.missingWords.length > 0 || evaluation.incorrectWords.length > 0) ? (
                      <div className="grid sm:grid-cols-2 gap-3 pt-2 text-xs font-bold">
                        {evaluation.missingWords.length > 0 && (
                          <div id="speech-missing-log" className="bg-amber-100/50 p-3 rounded-xl border border-amber-200 text-amber-800">
                            <span>🛑 Từ con còn thiếu hoặc chưa phát âm:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {evaluation.missingWords.map((w, idx) => (
                                <span key={idx} className="bg-white px-1.5 py-0.5 rounded border border-amber-300 text-amber-800 uppercase font-mono">{w}</span>
                              ))}
                            </div>
                          </div>
                        )}
                        {evaluation.incorrectWords.length > 0 && (
                          <div id="speech-incorrect-log" className="bg-rose-50 p-3 rounded-xl border border-rose-200 text-rose-800">
                            <span>❌ Từ con phát âm lệch / chưa rõ âm đuôi:</span>
                            <div className="flex flex-wrap gap-1 mt-1">
                              {evaluation.incorrectWords.map((w, idx) => (
                                <span key={idx} className="bg-white px-1.5 py-0.5 rounded border border-rose-300 text-rose-700 uppercase font-mono">{w}</span>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="p-3 bg-emerald-50 border border-emerald-200 rounded-xl text-emerald-800 font-bold text-xs flex items-center gap-1">
                        <CheckCircle size={14} /> Bé nói tuyệt cú mèo rồi! Phát âm từ ngữ đều vô cùng khớp chuẩn câu mẫu!
                      </div>
                    )}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>

            {recognitionError && (
              <div id="voice-error-tip" className="bg-rose-50 border-2 border-rose-200 p-3 rounded-xl text-center text-rose-700 font-black text-xs">
                ⚠️ {recognitionError}
              </div>
            )}

            {/* Quick list showing historical speech logs during this session */}
            {user.practiceHistory.length > 0 && (
              <div className="border-t-2 border-dashed border-slate-100 pt-5">
                <div className="flex items-center gap-1 text-slate-500 font-black text-xs mb-3">
                  <History size={14} /> Lịch sử luyện phát âm gần đây của con:
                </div>
                <div id="speak-session-history-logs" className="space-y-2 max-h-[140px] overflow-y-auto">
                  {user.practiceHistory.slice(0, 3).map((hist, hIdx) => (
                    <div key={hIdx} className="bg-slate-50 hover:bg-slate-100 border border-slate-200 p-2.5 rounded-xl flex items-center justify-between gap-3 text-xs">
                      <div className="space-y-0.5">
                        <div className="flex items-center gap-1.5 font-bold">
                          <span className="text-slate-400 capitalize bg-slate-200 font-mono text-[9px] px-1 py-0.2 rounded font-black">{hist.chapterTitle.split(":")[1] || "Bài tập"}</span>
                          <span className="text-slate-700">Mẫu: <em className="not-italic font-black text-slate-900">{hist.sampleText}</em></span>
                        </div>
                        <p className="text-slate-500 font-medium">Bé nói: <strong className="text-indigo-600">"{hist.userText}"</strong></p>
                      </div>
                      <span className="bg-yellow-400 text-yellow-950 font-black px-2 py-1 rounded-lg flex-shrink-0 text-[11px]">
                        ⭐ {hist.score}đ
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
