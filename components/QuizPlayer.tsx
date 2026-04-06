"use client";

import React from "react";
import { useQuizPlayer } from "@/hooks/useQuizPlayer";
import { QuizPlayerView } from "@/components/quiz-player/QuizPlayerView";

interface QuizPlayerProps {
  onSubmit: () => void;
  isLoading: boolean;
}

export function QuizPlayer({ onSubmit, isLoading }: QuizPlayerProps) {
  const controller = useQuizPlayer({ onSubmit });

  if (!controller.currentAttempt || !controller.question) {
    return <div>Loading quiz...</div>;
  }

  return (
    <QuizPlayerView
      attempt={controller.currentAttempt}
      question={controller.question}
      currentQuestionIndex={controller.currentQuestionIndex}
      answerValue={controller.answerValue}
      progress={controller.progress}
      isSubmitting={isLoading}
      inputRef={controller.inputRef}
      onAnswerChange={controller.handleAnswerChange}
      onPrev={controller.prevQuestion}
      onNext={controller.nextQuestion}
      onSubmit={controller.submit}
    />
  );
}
