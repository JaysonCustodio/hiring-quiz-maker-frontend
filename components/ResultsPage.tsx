"use client";

import Link from "next/link";
import { calculateAntiCheatSummary } from "@/lib/antiCheat";
import type {
  SubmitAttemptResponse,
  AntiCheatEvent,
  QuizWithQuestions,
} from "@/lib/types";

interface ResultsPageProps {
  attemptResponse: SubmitAttemptResponse;
  quiz: QuizWithQuestions;
  antiCheatEvents: AntiCheatEvent[];
  onReset: () => void;
}

export function ResultsPage({
  attemptResponse,
  quiz,
  antiCheatEvents,
  onReset,
}: ResultsPageProps) {
  const antiCheatSummary = calculateAntiCheatSummary(antiCheatEvents);
  const totalQuestions = quiz.questions.length;
  const correctAnswers = attemptResponse.score;
  const scorePercentage = Math.round((correctAnswers / totalQuestions) * 100);

  const getScoreColor = (score: number): string => {
    if (score >= 80) return "text-green-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreBgColor = (score: number): string => {
    if (score >= 80) return "bg-green-50 border-green-200";
    if (score >= 60) return "bg-yellow-50 border-yellow-200";
    return "bg-red-50 border-red-200";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <h1 className="text-4xl font-bold text-slate-900 mb-8 text-center">
          Quiz Complete!
        </h1>

        {/* Score Summary */}
        <div
          className={`rounded-lg shadow-md p-8 mb-8 border-2 ${getScoreBgColor(
            scorePercentage,
          )}`}
        >
          <div className="text-center">
            <p className="text-slate-700 text-lg mb-2">Your Score</p>
            <p
              className={`text-6xl font-bold ${getScoreColor(scorePercentage)}`}
            >
              {scorePercentage}%
            </p>
            <p className="text-slate-600 mt-4">
              {correctAnswers} out of {totalQuestions} correct
            </p>
          </div>
        </div>

        {/* Anti-Cheat Summary (if enabled) */}
        {antiCheatEvents.length > 0 && (
          <div className="bg-white rounded-lg shadow-md p-6 mb-8 border-l-4 border-orange-400">
            <h2 className="text-xl font-semibold text-slate-900 mb-4">
              Session Activity
            </h2>
            <div className="grid grid-cols-3 gap-4">
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {antiCheatSummary.focusSwitches}
                </p>
                <p className="text-sm text-slate-600 mt-1">Focus Switches</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {antiCheatSummary.pasteDetections}
                </p>
                <p className="text-sm text-slate-600 mt-1">Paste Events</p>
              </div>
              <div className="text-center p-4 bg-orange-50 rounded-lg">
                <p className="text-2xl font-bold text-orange-600">
                  {antiCheatSummary.totalEvents}
                </p>
                <p className="text-sm text-slate-600 mt-1">Total Events</p>
              </div>
            </div>
          </div>
        )}

        {/* Question Results */}
        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <h2 className="text-2xl font-semibold text-slate-900 mb-6">
            Question Breakdown
          </h2>

          <div className="space-y-4">
            {attemptResponse.details.map((detail, idx) => {
              const question = quiz.questions.find(
                (q) => q.id === detail.questionId,
              );
              if (!question) return null;

              return (
                <div
                  key={detail.questionId}
                  className={`p-4 rounded-lg border-2 ${
                    detail.correct
                      ? "bg-green-50 border-green-200"
                      : "bg-red-50 border-red-200"
                  }`}
                >
                  <div className="flex items-start gap-3">
                    <div className="flex-shrink-0 mt-1">
                      {detail.correct ? (
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-green-600 text-white text-sm font-bold">
                          ✓
                        </div>
                      ) : (
                        <div className="flex items-center justify-center h-6 w-6 rounded-full bg-red-600 text-white text-sm font-bold">
                          ✗
                        </div>
                      )}
                    </div>

                    <div className="flex-1">
                      <p className="font-semibold text-slate-900 mb-2">
                        {idx + 1}. {question.prompt}
                      </p>

                      <div className="space-y-1 text-sm"></div>

                      {!detail.correct && (
                        <p className="text-slate-700">
                          <span className="font-medium">Correct answer: </span>
                          <span className="text-green-700">
                            {detail.expected || "N/A"}
                          </span>
                        </p>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex gap-4">
          <button
            onClick={onReset}
            className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
          >
            Take Another Quiz
          </button>
          <Link
            href="/"
            className="flex-1 px-6 py-3 bg-slate-600 hover:bg-slate-700 text-white font-semibold rounded-lg transition-colors text-center"
          >
            Back to Home
          </Link>
        </div>
      </div>
    </div>
  );
}
