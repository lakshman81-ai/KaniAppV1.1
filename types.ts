
export interface StoryResult {
  story: string;
  imageUrl: string;
}

// Quiz types
export interface Mascot {
  id: string;
  emoji: string;
  name: string;
  color: string;
  bgGradient: string;
}

export interface Topic {
  id: string;
  name: string;
  icon: string;
  color: string;
  difficulty: string;
  solved: number;
  total: number;
  sheetUrl: string; // Google Sheets URL for this module
}

export interface Question {
  id: string;
  text: string;
  note?: string;
  answers: Answer[];
  correctAnswer: string;
  topic: string;
}

export interface Answer {
  id: string;
  text: string;
}

export interface QuizState {
  currentScreen: 'login' | 'landing' | 'question' | 'result';
  playerName: string;
  selectedMascot: string;
  interfaceStyle: 'kid' | 'minimal';
  randomize: boolean;
  selectedTopic: Topic | null;
  currentQuestionIndex: number;
  questions: Question[];
  answers: Record<string, string>;
  score: number;
  xp: number;
}
