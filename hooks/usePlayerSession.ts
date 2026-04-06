import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { useGetQuiz, useStartAttempt, useSubmitAttempt } from "@/lib/queries";
import { useQuizStore } from "@/lib/store";
import type { SubmitAttemptResponse } from "@/lib/types";
import { useModal } from "@/components/ModalProvider";

export function usePlayerSession() {
  const router = useRouter();
  const searchParams = useSearchParams();
  const { showModal } = useModal();

  const quizId = useMemo(() => {
    const id = searchParams.get("id");
    return id ? parseInt(id) : null;
  }, [searchParams]);

  const { currentAttempt, setCurrentAttempt, antiCheatEvents, resetStore } =
    useQuizStore();

  const [submittedResponse, setSubmittedResponse] =
    useState<SubmitAttemptResponse | null>(null);

  const quizQuery = useGetQuiz(quizId);
  const startAttemptMutation = useStartAttempt();
  const submitAttemptMutation = useSubmitAttempt();

  useEffect(() => {
    if (quizQuery.data && !currentAttempt) {
      startAttemptMutation.mutate(quizQuery.data.id);
    }
  }, [quizQuery.data, currentAttempt, startAttemptMutation]);

  useEffect(() => {
    if (startAttemptMutation.data && !currentAttempt) {
      setCurrentAttempt(startAttemptMutation.data);
    }
  }, [startAttemptMutation.data, currentAttempt, setCurrentAttempt]);

  const submit = useCallback(async () => {
    if (!currentAttempt) return;

    try {
      const result = await submitAttemptMutation.mutateAsync(currentAttempt.id);
      setSubmittedResponse(result);
    } catch (err) {
      showModal({
        title: "Submission Error",
        message: `Failed to submit quiz: ${err instanceof Error ? err.message : "Unknown error"}`,
        type: "error",
      });
    }
  }, [currentAttempt, submitAttemptMutation, showModal]);

  const reset = useCallback(() => {
    resetStore();
    router.push("/");
  }, [resetStore, router]);

  return {
    quizId,
    quizQuery,
    startAttemptMutation,
    submitAttemptMutation,
    currentAttempt,
    antiCheatEvents,
    submittedResponse,
    submit,
    reset,
  };
}
