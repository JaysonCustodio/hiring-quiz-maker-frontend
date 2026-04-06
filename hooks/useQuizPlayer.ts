import { useCallback, useEffect, useMemo, useRef } from "react";
import { setupPasteDetection, setupWindowFocusTracking } from "@/lib/antiCheat";
import { useLogEvent, useSaveAnswer } from "@/lib/queries";
import { useQuizStore } from "@/lib/store";
import type { AntiCheatEvent, Question } from "@/lib/types";

export interface UseQuizPlayerOptions {
  onSubmit: () => void;
}

export function useQuizPlayer({ onSubmit }: UseQuizPlayerOptions) {
  const {
    currentAttempt,
    currentQuestionIndex,
    answers,
    setAnswer,
    nextQuestion,
    prevQuestion,
    addAntiCheatEvent,
  } = useQuizStore();

  // Used for paste detection on textarea questions (short).
  const inputRef = useRef<HTMLTextAreaElement | null>(null);
  const saveAnswerMutation = useSaveAnswer();
  const logEventMutation = useLogEvent();

  const question: Question | null = useMemo(() => {
    if (!currentAttempt) return null;
    return currentAttempt.quiz.questions[currentQuestionIndex] || null;
  }, [currentAttempt, currentQuestionIndex]);

  const answerValue = useMemo(() => {
    if (!question) return "";
    return answers.find((a) => a.questionId === question.id)?.value || "";
  }, [answers, question]);

  const progress = useMemo(() => {
    if (!currentAttempt) return 0;
    return ((currentQuestionIndex + 1) / currentAttempt.quiz.questions.length) * 100;
  }, [currentAttempt, currentQuestionIndex]);

  const handleAnswerChange = useCallback(
    async (value: string) => {
      if (!question) return;
      setAnswer({ questionId: question.id, value });

      if (!currentAttempt) return;
      try {
        await saveAnswerMutation.mutateAsync({
          attemptId: currentAttempt.id,
          questionId: question.id,
          value,
        });
      } catch (error) {
        console.error("Failed to save answer:", error);
      }
    },
    [question, setAnswer, currentAttempt, saveAnswerMutation],
  );

  const submit = useCallback(() => {
    onSubmit();
  }, [onSubmit]);

  useEffect(() => {
    if (!currentAttempt) return;

    const pushEvent = (event: AntiCheatEvent) => {
      addAntiCheatEvent(event);
      logEventMutation.mutate({
        attemptId: currentAttempt.id,
        event: JSON.stringify(event),
      });
    };

    const cleanupWindowFocus = setupWindowFocusTracking(
      () => pushEvent({ type: "focus-lost", timestamp: Date.now() }),
      () => pushEvent({ type: "focus-regained", timestamp: Date.now() }),
    );

    const cleanupPaste = inputRef.current
      ? setupPasteDetection(inputRef.current, () => {
          pushEvent({ type: "paste", timestamp: Date.now() });
        })
      : undefined;

    return () => {
      cleanupWindowFocus?.();
      cleanupPaste?.();
    };
  }, [currentAttempt, addAntiCheatEvent, logEventMutation]);

  return {
    currentAttempt,
    currentQuestionIndex,
    question,
    answerValue,
    progress,
    inputRef,
    nextQuestion,
    prevQuestion,
    handleAnswerChange,
    submit,
  };
}

