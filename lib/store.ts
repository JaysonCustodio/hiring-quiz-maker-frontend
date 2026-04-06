import { create } from "zustand";
import type { Quiz, Attempt, AttemptAnswer, AntiCheatEvent } from "./types";

interface QuizStore {
  // Quiz data
  currentQuiz: Quiz | null;
  setCurrentQuiz: (quiz: Quiz) => void;

  // Attempt data
  currentAttempt: Attempt | null;
  setCurrentAttempt: (attempt: Attempt) => void;

  // Answers in current attempt
  answers: AttemptAnswer[];
  setAnswer: (answer: AttemptAnswer) => void;
  clearAnswers: () => void;

  // Navigation
  currentQuestionIndex: number;
  setCurrentQuestionIndex: (index: number) => void;
  nextQuestion: () => void;
  prevQuestion: () => void;

  // Anti-cheat
  antiCheatEvents: AntiCheatEvent[];
  addAntiCheatEvent: (event: AntiCheatEvent) => void;
  clearAntiCheatEvents: () => void;

  // Results
  submissionScore: number | null;
  setSubmissionScore: (score: number) => void;

  // Reset store
  resetStore: () => void;
}

export const useQuizStore = create<QuizStore>((set) => ({
  currentQuiz: null,
  setCurrentQuiz: (quiz) => set({ currentQuiz: quiz }),

  currentAttempt: null,
  setCurrentAttempt: (attempt) => set({ currentAttempt: attempt }),

  answers: [],
  setAnswer: (answer) =>
    set((state) => {
      const existingIndex = state.answers.findIndex(
        (a) => a.questionId === answer.questionId,
      );
      if (existingIndex >= 0) {
        const newAnswers = [...state.answers];
        newAnswers[existingIndex] = answer;
        return { answers: newAnswers };
      }
      return { answers: [...state.answers, answer] };
    }),
  clearAnswers: () => set({ answers: [] }),

  currentQuestionIndex: 0,
  setCurrentQuestionIndex: (index) => set({ currentQuestionIndex: index }),
  nextQuestion: () =>
    set((state) => {
      const questionCount = state.currentAttempt?.quiz.questions.length || 1;
      return {
        currentQuestionIndex: Math.min(
          state.currentQuestionIndex + 1,
          questionCount - 1,
        ),
      };
    }),
  prevQuestion: () =>
    set((state) => ({
      currentQuestionIndex: Math.max(state.currentQuestionIndex - 1, 0),
    })),

  antiCheatEvents: [],
  addAntiCheatEvent: (event) =>
    set((state) => ({
      antiCheatEvents: [...state.antiCheatEvents, event],
    })),
  clearAntiCheatEvents: () => set({ antiCheatEvents: [] }),

  submissionScore: null,
  setSubmissionScore: (score) => set({ submissionScore: score }),

  resetStore: () =>
    set({
      currentQuiz: null,
      currentAttempt: null,
      answers: [],
      currentQuestionIndex: 0,
      antiCheatEvents: [],
      submissionScore: null,
    }),
}));
