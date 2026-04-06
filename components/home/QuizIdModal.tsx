import { useHomeTakeQuiz } from "@/hooks/useHomeTakeQuiz";
import React from "react";

type QuizIdModalProps = {
  open?: boolean;
  onClose?: () => void;
  onSubmit?: (quizId: string) => void;
};

function QuizIdModal({ open = true, onClose = () => {} }: QuizIdModalProps) {
  const { quizId, setQuizId, onTakeQuiz } = useHomeTakeQuiz();
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    onTakeQuiz();
  };

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 px-4">
      <div className="w-full max-w-md rounded-2xl bg-white p-6 shadow-2xl">
        <div className="mb-4">
          <h2 className="text-xl font-semibold text-gray-900">Enter Quiz ID</h2>
          <p className="mt-1 text-sm text-gray-600">
            Please enter the quiz ID.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label
              htmlFor="quizId"
              className="mb-2 block text-sm font-medium text-gray-700"
            >
              Quiz ID
            </label>
            <input
              id="quizId"
              name="quizId"
              type="text"
              value={quizId}
              onChange={(e) => setQuizId(e.target.value)}
              placeholder="e.g. QUIZ-12345"
              className="w-full rounded-xl border text-black border-gray-300 px-4 py-3 text-sm outline-none transition focus:border-gray-900"
              required
            />
          </div>

          <div className="flex justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="rounded-xl border border-gray-300 px-4 py-2 text-sm font-medium text-gray-700 transition hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="rounded-xl bg-gray-900 px-4 py-2 text-sm font-medium text-white transition hover:opacity-90 disabled:cursor-not-allowed disabled:opacity-50"
              disabled={!quizId.trim()}
            >
              Continue
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default React.memo(QuizIdModal);
