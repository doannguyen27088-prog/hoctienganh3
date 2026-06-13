export interface User {
  username: string;
  fullName: string;
  password?: string; // stored locally
  lessonsCompleted: number[]; // Array of chapter IDs (1 to 5)
  scoreVocabulary: number;
  scoreSentence: number;
  scorePronunciation: number;
  practiceHistory: PracticeHistoryItem[];
  totalScore: number;
  lastActive: string;
}

export interface PracticeHistoryItem {
  id: string;
  chapterId: number;
  chapterTitle: string;
  timestamp: string;
  sampleText: string;
  userText: string;
  score: number;
  feedback: string;
  missingWords: string[];
  incorrectWords: string[];
}

export interface Word {
  id: string;
  english: string;
  vietnamese: string;
  emoji: string;
}

export interface Sentence {
  id: string;
  english: string;
  vietnamese: string;
}

export interface QuizQuestion {
  id: string;
  type: 'vocab_select_meaning' | 'sentence_fill' | 'listen_select' | 'vocab_match' | 'vocab_select_image' | 'sentence_arrange';
  question: string;
  options: string[];
  correctAnswer: string|string[]; // dynamic handling
  targetText?: string; // used for sentence arrange pieces or matching
}

export interface Chapter {
  id: number;
  title: string;
  description: string;
  emoji: string;
  videoUrl: string; // YouTube embed link
  vocabulary: Word[];
  sentences: Sentence[];
  quizzes: QuizQuestion[];
  speakingPrompt: string; // Speaking practice sentence/question
}
