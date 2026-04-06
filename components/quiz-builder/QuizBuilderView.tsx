"use client";

import React from "react";
import type { QuestionType } from "@/lib/types";
import type { FormQuestion, QuizBuilderStep } from "@/hooks/useQuizBuilder";
import Cancel from "../Cancel";

export interface QuizBuilderViewProps {
  step: QuizBuilderStep;
  title: string;
  description: string;
  quizId: number | null;
  questions: (FormQuestion & { id?: string })[];
  currentQuestion: FormQuestion | null;
  optionsError: string | null;
  canAddCurrentQuestion: boolean;

  isCreating: boolean;
  isCreateError: boolean;
  createErrorMessage: string | null;

  isSaving: boolean;

  onTitleChange: (title: string) => void;
  onDescriptionChange: (description: string) => void;
  onCreateQuizSubmit: (e: React.FormEvent) => void;

  onQuestionTypeChange: (type: QuestionType | "") => void;
  onQuestionPromptChange: (prompt: string) => void;
  onQuestionOptionsArrayChange: (options: string[]) => void;
  onQuestionCorrectAnswerChange: (correctAnswer: string) => void;
  onQuestionCodeSnippetChange: (codeSnippet: string) => void;
  onAddQuestion: () => void;
  onRemoveQuestion: (index: number) => void;
  onBack: () => void;
  onSubmit: () => void;
}

export function QuizBuilderView({
  step,
  title,
  description,
  questions,
  currentQuestion,
  optionsError,
  canAddCurrentQuestion,
  isCreating,
  isCreateError,
  createErrorMessage,
  isSaving,
  onTitleChange,
  onDescriptionChange,
  onCreateQuizSubmit,
  onQuestionTypeChange,
  onQuestionPromptChange,
  onQuestionOptionsArrayChange,
  onQuestionCorrectAnswerChange,
  onQuestionCodeSnippetChange,
  onAddQuestion,
  onRemoveQuestion,
  onBack,
  onSubmit,
}: QuizBuilderViewProps) {
  return (
    <div className="min-h-screen bg-linear-to-br from-slate-50 to-slate-100 py-12 px-4">
      <div className="max-w-4xl mx-auto">
        <div className="flex mb-5 flex-row justify-between items-center w-full">
          <h1 className="text-4xl font-bold text-slate-900">Quiz Builder</h1>
          <Cancel />
        </div>

        {step === "info" ? (
          <form onSubmit={onCreateQuizSubmit} className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6 space-y-4">
              <h2 className="text-2xl font-semibold text-slate-800">
                Step 1: Quiz Information
              </h2>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Title *
                </label>
                <input
                  type="text"
                  value={title}
                  onChange={(e) => onTitleChange(e.target.value)}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-transparent text-slate-900"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">
                  Description *
                </label>
                <textarea
                  value={description}
                  onChange={(e) => onDescriptionChange(e.target.value)}
                  placeholder="Describe what this quiz covers..."
                  rows={3}
                  className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-transparent text-slate-900"
                />
              </div>

              <button
                type="submit"
                disabled={isCreating}
                className="w-full bg-gray-700 hover:bg-gray-800 disabled:bg-slate-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isCreating ? "Creating..." : "Next: Add Questions"}
              </button>

              {isCreateError && (
                <div className="p-4 bg-red-50 border border-red-200 rounded-lg text-red-700">
                  Error: {createErrorMessage || "Failed to create quiz"}
                </div>
              )}
            </div>
          </form>
        ) : (
          <div className="space-y-8">
            <div className="bg-white rounded-lg shadow-md p-6">
              <h2 className="text-2xl font-semibold text-slate-800 mb-4">
                Step 2: Add Questions ({questions.length})
              </h2>

              {questions.length > 0 && (
                <div className="space-y-3 mb-6">
                  {questions.map((q, idx) => (
                    <div
                      key={q.id}
                      className="flex items-start justify-between p-4 bg-slate-50 rounded-lg border border-slate-200"
                    >
                      <div className="flex-1">
                        <p className="font-medium text-slate-900">
                          {idx + 1}. {q.prompt}
                        </p>
                        <p className="text-sm text-slate-600 mt-1">
                          Type:{" "}
                          {q.type === "mcq"
                            ? "Multiple Choice"
                            : "Short Answer"}
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => onRemoveQuestion(idx)}
                        className="ml-4 px-3 py-1 bg-red-50 text-red-600 rounded hover:bg-red-100 text-sm font-medium"
                      >
                        Remove
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="border-t border-slate-200 pt-6">
                <h3 className="text-lg font-semibold text-slate-800 mb-4">
                  {currentQuestion ? "Edit Question" : "Add Question"}
                </h3>

                <div className="space-y-4">
                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Question Type *
                    </label>
                    <select
                      value={currentQuestion?.type || ""}
                      onChange={(e) =>
                        onQuestionTypeChange(
                          (e.target.value as QuestionType) || "",
                        )
                      }
                      className="w-full px-4 py-2 text-black border border-slate-300 rounded-lg focus:border-transparent"
                    >
                      <option value="">Select Type</option>
                      <option value="mcq">Multiple Choice</option>
                      <option value="short">Short Answer</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Question Text *
                    </label>
                    <textarea
                      value={currentQuestion?.prompt || ""}
                      onChange={(e) => onQuestionPromptChange(e.target.value)}
                      placeholder="Enter the question..."
                      rows={2}
                      className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-transparent text-slate-900"
                    />
                  </div>

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Code Snippet{" "}
                      <span className="text-xs text-slate-600">(optional)</span>
                    </label>
                    <textarea
                      value={currentQuestion?.codeSnippet || ""}
                      onChange={(e) =>
                        onQuestionCodeSnippetChange(e.target.value)
                      }
                      placeholder={
                        "// Optional code to display with the question\n"
                      }
                      rows={4}
                      className="w-full px-4 py-2 font-mono text-sm border border-slate-300 rounded-lg focus:border-transparent text-slate-900"
                    />
                  </div>

                  {currentQuestion?.type === "mcq" && (
                    <div>
                      <label className="block text-sm font-medium text-slate-700 mb-2">
                        Options *
                      </label>
                      <div className="space-y-2">
                        {(currentQuestion?.options?.length
                          ? currentQuestion.options
                          : ["", ""]
                        ).map((opt, idx) => (
                          <div key={idx} className="flex gap-2">
                            <input
                              type="text"
                              value={opt}
                              onChange={(e) => {
                                const base = currentQuestion?.options?.length
                                  ? [...currentQuestion.options]
                                  : ["", ""];
                                base[idx] = e.target.value;
                                onQuestionOptionsArrayChange(base);
                              }}
                              placeholder={`Option ${idx + 1}`}
                              className="flex-1 px-4 py-2 border border-slate-300 rounded-lg focus:border-transparent text-slate-900"
                            />
                            <button
                              type="button"
                              onClick={() => {
                                const base = currentQuestion?.options?.length
                                  ? [...currentQuestion.options]
                                  : ["", ""];
                                base.splice(idx, 1);
                                onQuestionOptionsArrayChange(
                                  base.length ? base : [""],
                                );
                              }}
                              className="px-3 py-2 bg-slate-100 hover:bg-slate-200 text-slate-700 rounded-lg text-sm font-medium"
                            >
                              Remove
                            </button>
                          </div>
                        ))}

                        <div className="flex items-center justify-between">
                          <button
                            type="button"
                            onClick={() => {
                              const base = currentQuestion?.options?.length
                                ? [...currentQuestion.options]
                                : ["", ""];
                              onQuestionOptionsArrayChange([...base, ""]);
                            }}
                            className="px-4 py-2 bg-blue-50 hover:bg-blue-100 text-gray-800 rounded-lg text-sm font-semibold"
                          >
                            + Add option
                          </button>
                        </div>
                      </div>

                      {optionsError && (
                        <div className="p-2 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
                          {optionsError}
                        </div>
                      )}
                    </div>
                  )}

                  <div>
                    <label className="block text-sm font-medium text-slate-700 mb-2">
                      Correct Answer *
                    </label>
                    {currentQuestion?.type === "mcq" ? (
                      <select
                        value={(currentQuestion.correctAnswer ?? "") as string}
                        onChange={(e) =>
                          onQuestionCorrectAnswerChange(e.target.value)
                        }
                        className="w-full px-4 py-2 text-black border border-slate-300 rounded-lg focus:border-transparent"
                      >
                        <option value="">Select the correct option</option>
                        {(currentQuestion.options ?? [])
                          .map((o) => o.trim())
                          .filter(Boolean)
                          .map((option) => (
                            <option key={option} value={option}>
                              {option}
                            </option>
                          ))}
                      </select>
                    ) : (
                      <input
                        type="text"
                        value={currentQuestion?.correctAnswer ?? ""}
                        onChange={(e) =>
                          onQuestionCorrectAnswerChange(e.target.value)
                        }
                        placeholder={
                          currentQuestion?.type === "short"
                            ? "Enter the expected answer"
                            : "Enter the expected answer"
                        }
                        className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:border-transparent text-slate-900"
                      />
                    )}
                  </div>

                  <button
                    type="button"
                    onClick={onAddQuestion}
                    disabled={!canAddCurrentQuestion}
                    className="w-full bg-gray-700 hover:bg-gray-800 disabled:bg-slate-400 text-white font-semibold py-2 px-4 rounded-lg transition-colors"
                  >
                    Add Question
                  </button>
                </div>
              </div>
            </div>

            <div className="flex gap-4">
              <button
                onClick={onBack}
                className="flex-1 bg-slate-600 hover:bg-slate-700 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                Back
              </button>
              <button
                onClick={onSubmit}
                disabled={isSaving}
                className="flex-1 bg-green-600 hover:bg-green-700 disabled:bg-slate-400 text-white font-semibold py-3 px-4 rounded-lg transition-colors"
              >
                {isSaving ? "Saving..." : "Create & Publish Quiz"}
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
