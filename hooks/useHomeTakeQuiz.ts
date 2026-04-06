import { useCallback, useState } from "react";
import { useQuizStore } from "@/lib/store";
import { validateQuizId } from "@/lib/validation";
import { useModal } from "@/components/ModalProvider";

export function useHomeTakeQuiz() {
  const [quizId, setQuizId] = useState("");
  const resetStore = useQuizStore((state) => state.resetStore);
  const { showModal } = useModal();

  const onTakeQuiz = useCallback(() => {
    const validation = validateQuizId(quizId);
    if (!validation.valid) {
      showModal({
        title: "Invalid Quiz ID",
        message: validation.error || "Please enter a valid quiz ID.",
        type: "warning",
      });
      return;
    }
    resetStore();
    window.location.href = `/player?id=${encodeURIComponent(quizId)}`;
  }, [quizId, resetStore, showModal]);

  return {
    quizId,
    setQuizId,
    onTakeQuiz,
  };
}
