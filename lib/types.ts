// Question types (matching backend: mcq, short)
export type QuestionType = "mcq" | "short";

// Question structure (backend style)
export interface Question {
  id: number;
  quizId: number;
  prompt: string;
  type: QuestionType;
  options?: string[]; // for mcq questions
  correctAnswer?: string | number; // for mcq: index or text; for short: canonical answer
  position: number;
}

// Quiz structure
export interface Quiz {
  id: number;
  title: string;
  description: string;
  timeLimitSeconds?: number;
  isPublished: boolean;
  createdAt: string;
  questions?: Question[];
}

// Quiz with questions included
export interface QuizWithQuestions extends Quiz {
  questions: Question[];
}

// Create Quiz request (backend expects just metadata)
export interface CreateQuizRequest {
  title: string;
  description: string;
  timeLimitSeconds?: number;
  isPublished?: boolean;
}

// Create Question request
export interface CreateQuestionRequest {
  type: QuestionType;
  prompt: string;
  options?: string[]; // for mcq
  correctAnswer: string | number | null;
  position?: number;
}

// Attempt (quiz attempt/session)
export interface Attempt {
  id: number;
  quizId: number;
  startedAt: string;
  submittedAt: string | null;
  answers: AttemptAnswer[];
  quiz: QuizWithQuestions;
}

// Answer in an attempt
export interface AttemptAnswer {
  questionId: number;
  value: string;
}

// Submit attempt response
export interface SubmitAttemptResponse {
  score: number;
  details: SubmitDetail[];
}

// Per-question submission detail
export interface SubmitDetail {
  questionId: number;
  correct: boolean;
  expected?: string; // for short-answer or mcq
}

// Anti-cheat tracking
export interface AntiCheatEvent {
  type: "focus-lost" | "focus-regained" | "paste";
  timestamp: number;
}

export interface AntiCheatSummary {
  focusSwitches: number;
  pasteDetections: number;
  totalEvents: number;
}
