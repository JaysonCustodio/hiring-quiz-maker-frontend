"use client";

import { useRouter } from "next/navigation";
import { QuizBuilder } from "@/components/QuizBuilder";
import { useModal } from "@/components/ModalProvider";

export default function BuilderPage() {
  const router = useRouter();
  const { hideModal } = useModal();

  const handleQuizCreated = (quizId: number) => {
    void quizId;
    hideModal();
    router.push("/");
  };

  return <QuizBuilder onQuizCreated={handleQuizCreated} />;
}
