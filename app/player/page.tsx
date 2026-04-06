"use client";

import { Suspense } from "react";
import { useRouter } from "next/navigation";
import { usePlayerSession } from "@/hooks/usePlayerSession";
import { QuizPlayer } from "@/components/QuizPlayer";
import { ResultsPage } from "@/components/ResultsPage";

function PlayerContent() {
  const router = useRouter();
  const session = usePlayerSession();

  if (session.quizQuery.error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center px-4">
        <div className="bg-white rounded-lg shadow-md p-8 max-w-md w-full border-l-4 border-red-500">
          <h1 className="text-2xl font-bold text-slate-900 mb-4">
            Quiz Not Found
          </h1>
          <p className="text-slate-600 mb-6">
            The quiz with ID &quot;{session.quizId}&quot; could not be found.
            Please check the ID and try again.
          </p>
          <button
            onClick={() => router.push("/")}
            className="w-full px-4 py-3 bg-gray-700 hover:bg-gray-800 text-white font-semibold rounded-md"
          >
            Back to Home
          </button>
        </div>
      </div>
    );
  }

  if (session.quizQuery.isLoading || session.startAttemptMutation.isPending) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
          <p className="text-slate-600 text-lg">Loading quiz...</p>
        </div>
      </div>
    );
  }

  if (session.submittedResponse && session.currentAttempt) {
    return (
      <ResultsPage
        attemptResponse={session.submittedResponse}
        quiz={session.currentAttempt.quiz}
        antiCheatEvents={session.antiCheatEvents}
        onReset={session.reset}
      />
    );
  }

  return (
    <QuizPlayer
      onSubmit={session.submit}
      isLoading={session.submitAttemptMutation.isPending}
    />
  );
}

export default function PlayerPage() {
  return (
    <Suspense
      fallback={
        <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 flex items-center justify-center">
          <div className="text-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
            <p className="text-slate-600 text-lg">Loading...</p>
          </div>
        </div>
      }
    >
      <PlayerContent />
    </Suspense>
  );
}
