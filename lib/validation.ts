/**
 * Validation functions for quiz-related operations
 */

export const validateQuizId = (
  quizId: string,
): { valid: boolean; error?: string } => {
  if (!quizId.trim()) {
    return { valid: false, error: "Please enter a Quiz ID" };
  }
  if (isNaN(Number(quizId))) {
    return { valid: false, error: "Quiz ID must be a number" };
  }
  return { valid: true };
};
