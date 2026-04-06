"use client";

import { useQuizBuilder } from "@/hooks/useQuizBuilder";
import { QuizBuilderView } from "@/components/quiz-builder/QuizBuilderView";

interface QuizBuilderProps {
  onQuizCreated: (quizId: number) => void;
}

export function QuizBuilder({ onQuizCreated }: QuizBuilderProps) {
  const controller = useQuizBuilder({ onQuizCreated });

  return (
    <QuizBuilderView
      step={controller.step}
      title={controller.title}
      description={controller.description}
      quizId={controller.quizId}
      questions={controller.questions}
      currentQuestion={controller.currentQuestion}
      optionsError={controller.optionsError}
      canAddCurrentQuestion={controller.canAddCurrentQuestion}
      isCreating={controller.createQuizMutation.isPending}
      isCreateError={controller.createQuizMutation.isError}
      createErrorMessage={
        controller.createQuizMutation.error instanceof Error
          ? controller.createQuizMutation.error.message
          : null
      }
      isSaving={
        controller.publishMutation.isPending ||
        controller.addQuestionMutation.isPending
      }
      onTitleChange={controller.setTitle}
      onDescriptionChange={controller.setDescription}
      onCreateQuizSubmit={controller.onCreateQuizSubmit}
      onQuestionTypeChange={controller.onQuestionTypeChange}
      onQuestionPromptChange={controller.onQuestionPromptChange}
      onQuestionOptionsArrayChange={controller.onQuestionOptionsArrayChange}
      onQuestionCorrectAnswerChange={controller.onQuestionCorrectAnswerChange}
      onQuestionCodeSnippetChange={controller.onQuestionCodeSnippetChange}
      onAddQuestion={controller.addCurrentQuestion}
      onRemoveQuestion={controller.removeQuestion}
      onBack={controller.onBackToInfo}
      onSubmit={controller.onSubmitQuestions}
    />
  );
}
