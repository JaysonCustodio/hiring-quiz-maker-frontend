import { useCallback, useMemo, useState } from "react";
import { useAddQuestion, useCreateQuiz, usePublishQuiz } from "@/lib/queries";
import type { CreateQuestionRequest, QuestionType } from "@/lib/types";
import { encodePromptWithSnippet } from "@/lib/questionPrompt";
import { useModal } from "@/components/ModalProvider";
import { useRouter } from "next/navigation";

export type QuizBuilderStep = "info" | "questions";

export type FormQuestion = Omit<CreateQuestionRequest, "position"> & {
  codeSnippet?: string;
};

export interface UseQuizBuilderOptions {
  onQuizCreated: (quizId: number) => void;
}

export function useQuizBuilder({ onQuizCreated }: UseQuizBuilderOptions) {
  const router = useRouter();
  const [step, setStep] = useState<QuizBuilderStep>("info");
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [quizId, setQuizId] = useState<number | null>(null);
  const [questions, setQuestions] = useState<
    (FormQuestion & { id?: string })[]
  >([]);
  const [currentQuestion, setCurrentQuestion] = useState<FormQuestion | null>(
    null,
  );
  const [optionsError, setOptionsError] = useState<string | null>(null);

  const { showModal } = useModal();

  const createQuizMutation = useCreateQuiz();
  const addQuestionMutation = useAddQuestion();
  const publishMutation = usePublishQuiz();

  const canSubmitQuizInfo = useMemo(
    () => Boolean(title.trim() && description.trim()),
    [title, description],
  );

  const sanitizeMcqOptions = useCallback((options: string[] | undefined) => {
    return (options ?? []).map((o) => o.trim()).filter(Boolean);
  }, []);

  const canAddCurrentQuestion = useMemo(() => {
    if (!currentQuestion?.prompt?.trim() || !currentQuestion.type) return false;
    if (
      currentQuestion.correctAnswer === undefined ||
      currentQuestion.correctAnswer === null
    )
      return false;
    if (currentQuestion.type === "mcq") {
      if (!String(currentQuestion.correctAnswer ?? "").trim()) return false;
      if (sanitizeMcqOptions(currentQuestion.options).length < 2) return false;
      if (optionsError) return false;
    }
    return true;
  }, [currentQuestion, sanitizeMcqOptions, optionsError]);

  const canSubmitQuestions = useMemo(
    () =>
      Boolean(quizId) &&
      questions.length > 0 &&
      !publishMutation.isPending &&
      !addQuestionMutation.isPending &&
      (currentQuestion === null || canAddCurrentQuestion),
    [
      quizId,
      questions.length,
      publishMutation.isPending,
      addQuestionMutation,
      currentQuestion,
      canAddCurrentQuestion,
    ],
  );

  const onCreateQuizSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!canSubmitQuizInfo) {
        showModal({
          title: "Missing Information",
          message:
            "Please fill in both title and description to create your quiz.",
          type: "warning",
        });
        return;
      }

      try {
        const result = await createQuizMutation.mutateAsync({
          title,
          description,
        });
        setQuizId(result.id);
        setStep("questions");
      } catch (error) {
        showModal({
          title: "Error Creating Quiz",
          message: `Failed to create quiz: ${error instanceof Error ? error.message : "Unknown error"}`,
          type: "error",
        });
      }
    },
    [canSubmitQuizInfo, createQuizMutation, title, description, showModal],
  );

  const resetQuestionForm = useCallback(() => {
    setCurrentQuestion(null);
  }, []);

  const onQuestionTypeChange = useCallback((type: QuestionType | "") => {
    setCurrentQuestion((prev) => ({
      ...prev,
      type: (type as QuestionType) || undefined,
      prompt: prev?.prompt || "",
      options: prev?.options,
      correctAnswer: prev?.correctAnswer ?? null,
      codeSnippet: prev?.codeSnippet,
    }));
  }, []);

  const onQuestionPromptChange = useCallback((prompt: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      prompt,
      type: prev?.type || "mcq",
      options: prev?.options,
      correctAnswer: prev?.correctAnswer ?? null,
      codeSnippet: prev?.codeSnippet,
    }));
  }, []);

  const onQuestionOptionsChange = useCallback((optionsText: string) => {
    const parsedOptions = optionsText
      .split(/[\r\n,;]+/g)
      .map((c) => c.trim())
      .filter(Boolean);
    setCurrentQuestion((prev) => ({
      ...prev,
      options: parsedOptions,
      type: "mcq",
      prompt: prev?.prompt || "",
      correctAnswer: prev?.correctAnswer ?? null,
      codeSnippet: prev?.codeSnippet,
    }));
  }, []);

  const onQuestionOptionsArrayChange = useCallback((options: string[]) => {
    // Check for duplicates
    const trimmedOptions = options.map((o) => o.trim()).filter(Boolean);
    const uniqueOptions = new Set(trimmedOptions.map((o) => o.toLowerCase()));
    if (trimmedOptions.length !== uniqueOptions.size) {
      setOptionsError("Options must be unique.");
    } else {
      setOptionsError(null);
    }

    setCurrentQuestion((prev) => ({
      ...prev,
      options,
      type: "mcq",
      prompt: prev?.prompt || "",
      correctAnswer: prev?.correctAnswer ?? null,
      codeSnippet: prev?.codeSnippet,
    }));
  }, []);

  const onQuestionCorrectAnswerChange = useCallback((correctAnswer: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      correctAnswer,
      type: prev?.type || "mcq",
      prompt: prev?.prompt || "",
      options: prev?.options,
      codeSnippet: prev?.codeSnippet,
    }));
  }, []);

  const onQuestionCodeSnippetChange = useCallback((codeSnippet: string) => {
    setCurrentQuestion((prev) => ({
      ...prev,
      codeSnippet,
      type: prev?.type || "mcq",
      prompt: prev?.prompt || "",
      options: prev?.options,
      correctAnswer: prev?.correctAnswer ?? null,
    }));
  }, []);

  const addCurrentQuestion = useCallback(() => {
    if (
      !currentQuestion?.prompt ||
      !currentQuestion.type ||
      currentQuestion.correctAnswer === undefined
    ) {
      showModal({
        title: "Incomplete Question",
        message: "Please fill in all required fields for the question.",
        type: "warning",
      });
      return;
    }

    if (
      currentQuestion.type === "mcq" &&
      !String(currentQuestion.correctAnswer ?? "").trim()
    ) {
      showModal({
        title: "Missing Answer",
        message:
          "Please select the correct answer for this multiple choice question.",
        type: "warning",
      });
      return;
    }

    if (
      currentQuestion.type === "mcq" &&
      sanitizeMcqOptions(currentQuestion.options).length < 2
    ) {
      showModal({
        title: "Insufficient Options",
        message: "Multiple choice questions need at least 2 options.",
        type: "warning",
      });
      return;
    }

    const normalizedQuestion: FormQuestion =
      currentQuestion.type === "mcq"
        ? {
            ...currentQuestion,
            options: sanitizeMcqOptions(currentQuestion.options),
          }
        : currentQuestion;

    setQuestions((prev) => [
      ...prev,
      { ...normalizedQuestion, id: Date.now().toString() },
    ]);
    resetQuestionForm();
  }, [currentQuestion, resetQuestionForm, sanitizeMcqOptions, showModal]);

  const removeQuestion = useCallback((index: number) => {
    setQuestions((prev) => prev.filter((_, i) => i !== index));
  }, []);

  const onBackToInfo = useCallback(() => {
    setStep("info");
    setQuizId(null);
    setQuestions([]);
    setCurrentQuestion(null);
  }, []);

  const onSubmitQuestions = useCallback(async () => {
    if (!quizId) return;
    if (questions.length === 0) {
      showModal({
        title: "No Questions Added",
        message:
          "Please add at least one question to your quiz before publishing.",
        type: "warning",
      });
      return;
    }

    try {
      for (let i = 0; i < questions.length; i++) {
        const q = questions[i];
        await addQuestionMutation.mutateAsync({
          quizId,
          question: {
            type: q.type,
            prompt: encodePromptWithSnippet({
              prompt: q.prompt,
              codeSnippet: q.codeSnippet,
            }),
            options:
              q.type === "mcq" ? sanitizeMcqOptions(q.options) : q.options,
            correctAnswer: q.correctAnswer ?? null,
            position: i,
          },
        });
      }

      await publishMutation.mutateAsync(quizId);

      showModal({
        title: "Quiz Created Successfully!",
        message: `Your quiz has been created and published. Quiz ID: ${quizId}`,
        type: "success",
        onConfirm: () => onQuizCreated(quizId),
      });
    } catch (error) {
      showModal({
        title: "Error Publishing Quiz",
        message: `Failed to create quiz: ${error instanceof Error ? error.message : "Unknown error"}`,
        type: "error",
      });
    }
  }, [
    quizId,
    questions,
    addQuestionMutation,
    sanitizeMcqOptions,
    publishMutation,
    onQuizCreated,
    showModal,
  ]);

  return {
    step,
    title,
    description,
    quizId,
    questions,
    currentQuestion,
    optionsError,
    createQuizMutation,
    addQuestionMutation,
    publishMutation,
    canSubmitQuizInfo,
    canSubmitQuestions,
    canAddCurrentQuestion,
    setTitle,
    setDescription,
    onCreateQuizSubmit,
    onQuestionTypeChange,
    onQuestionPromptChange,
    onQuestionOptionsChange,
    onQuestionOptionsArrayChange,
    onQuestionCorrectAnswerChange,
    onQuestionCodeSnippetChange,
    addCurrentQuestion,
    removeQuestion,
    onBackToInfo,
    onSubmitQuestions,
  };
}
