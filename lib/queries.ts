import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { quizAPI } from "./api";
import type { CreateQuizRequest, CreateQuestionRequest } from "./types";

// Query keys
export const quizKeys = {
  all: ["quizzes"] as const,
  detail: (id: number) => [...quizKeys.all, "detail", id] as const,
  attempts: () => ["attempts"] as const,
  attempt: (id: number) => [...quizKeys.attempts(), "detail", id] as const,
};

// Fetch quiz by ID (includes questions)
export const useGetQuiz = (quizId: number | null) => {
  return useQuery({
    queryKey: quizKeys.detail(quizId || 0),
    queryFn: () => quizAPI.getQuiz(quizId!),
    enabled: !!quizId,
    staleTime: Infinity,
  });
};

// Create quiz mutation (creates empty quiz)
export const useCreateQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quiz: CreateQuizRequest) => quizAPI.createQuiz(quiz),
    onSuccess: (data) => {
      queryClient.setQueryData(quizKeys.detail(data.id), data);
    },
  });
};

// Add question to quiz mutation
export const useAddQuestion = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: async ({
      quizId,
      question,
    }: {
      quizId: number;
      question: CreateQuestionRequest;
    }) => quizAPI.addQuestion(quizId, question),
    onSuccess: (_, { quizId }) => {
      queryClient.invalidateQueries({
        queryKey: quizKeys.detail(quizId),
      });
    },
  });
};

// Publish quiz mutation
export const usePublishQuiz = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: number) => quizAPI.publishQuiz(quizId),
    onSuccess: (data) => {
      queryClient.setQueryData(quizKeys.detail(data.id), data);
    },
  });
};

// Start quiz attempt
export const useStartAttempt = () => {
  const queryClient = useQueryClient();

  return useMutation({
    mutationFn: (quizId: number) => quizAPI.startAttempt(quizId),
    onSuccess: (data) => {
      queryClient.setQueryData(quizKeys.attempt(data.id), data);
    },
  });
};

// Save answer mutation
export const useSaveAnswer = () => {
  return useMutation({
    mutationFn: async ({
      attemptId,
      questionId,
      value,
    }: {
      attemptId: number;
      questionId: number;
      value: string;
    }) => quizAPI.saveAnswer(attemptId, questionId, value),
  });
};

// Submit attempt mutation
export const useSubmitAttempt = () => {
  return useMutation({
    mutationFn: (attemptId: number) => quizAPI.submitAttempt(attemptId),
  });
};

// Log anti-cheat event (non-blocking)
export const useLogEvent = () => {
  return useMutation({
    mutationFn: async ({
      attemptId,
      event,
    }: {
      attemptId: number;
      event: string;
    }) => quizAPI.logEvent(attemptId, event),
    retry: 0, // Don't retry if event logging fails
  });
};
