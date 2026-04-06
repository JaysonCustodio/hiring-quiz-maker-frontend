"use client";

import React from "react";
import type { Attempt, Question } from "@/lib/types";
import { decodePromptWithSnippet } from "@/lib/questionPrompt";

export interface QuizPlayerViewProps {
  attempt: Attempt;
  question: Question;
  currentQuestionIndex: number;
  answerValue: string;
  progress: number;
  isSubmitting: boolean;
  inputRef: React.RefObject<HTMLInputElement | HTMLTextAreaElement | null>;
  onAnswerChange: (value: string) => void;
  onPrev: () => void;
  onNext: () => void;
  onSubmit: () => void;
}

export function QuizPlayerView({
  attempt,
  question,
  currentQuestionIndex,
  answerValue,
  progress,
  isSubmitting,
  inputRef,
  onAnswerChange,
  onPrev,
  onNext,
  onSubmit,
}: QuizPlayerViewProps) {
  const isLastQuestion = currentQuestionIndex >= attempt.quiz.questions.length - 1;
  const promptParts = decodePromptWithSnippet(question.prompt);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-3xl mx-auto">
        <div className="mb-8">
          <h1 className="text-3xl font-bold text-slate-900 mb-2">
            {attempt.quiz.title}
          </h1>
          <p className="text-slate-600 mb-4">{attempt.quiz.description}</p>
          <div className="flex items-center justify-between">
            <span className="text-sm font-medium text-slate-700">
              Question {currentQuestionIndex + 1} of{" "}
              {attempt.quiz.questions.length}
            </span>
            <div className="w-48 h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-md p-8 mb-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-slate-900 mb-4">
              {promptParts.prompt}
            </h2>
          </div>

          {promptParts.codeSnippet && (
            <pre className="mb-6 p-4 bg-slate-900 text-slate-100 rounded-lg overflow-x-auto text-sm">
              <code>{promptParts.codeSnippet}</code>
            </pre>
          )}

          {question.type === "mcq" ? (
            <div className="space-y-3">
              {question.options?.map((option) => (
                <label
                  key={option}
                  className="flex items-center p-4 border-2 border-slate-200 rounded-lg cursor-pointer hover:border-blue-400 hover:bg-blue-50 transition-colors"
                  style={{
                    borderColor: answerValue === option ? "#2563eb" : undefined,
                    backgroundColor: answerValue === option ? "#eff6ff" : undefined,
                  }}
                >
                  <input
                    type="radio"
                    name={`question-${question.id}`}
                    value={option}
                    checked={answerValue === option}
                    onChange={(e) => onAnswerChange(e.target.value)}
                    className="mr-3"
                  />
                  <span className="text-slate-900 font-medium">{option}</span>
                </label>
              ))}
            </div>
          ) : (
            <textarea
              ref={inputRef as React.Ref<HTMLTextAreaElement>}
              value={answerValue}
              onChange={(e) => onAnswerChange(e.target.value)}
              placeholder="Type your answer here..."
              rows={4}
              className="w-full px-4 py-3 border-2 border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent text-slate-900"
            />
          )}
        </div>

        <div className="flex gap-4">
          <button
            onClick={onPrev}
            disabled={currentQuestionIndex === 0}
            className="flex-1 px-6 py-3 bg-slate-200 hover:bg-slate-300 disabled:bg-slate-100 disabled:text-slate-400 text-slate-900 font-semibold rounded-lg transition-colors"
          >
            Previous
          </button>

          {!isLastQuestion ? (
            <button
              onClick={onNext}
              className="flex-1 px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white font-semibold rounded-lg transition-colors"
            >
              Next
            </button>
          ) : (
            <button
              onClick={onSubmit}
              disabled={isSubmitting}
              className="flex-1 px-6 py-3 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-semibold rounded-lg transition-colors"
            >
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </button>
          )}
        </div>
      </div>
    </div>
  );
}

