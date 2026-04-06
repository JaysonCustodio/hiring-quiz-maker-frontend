import axios, {
  AxiosInstance,
  InternalAxiosRequestConfig,
  AxiosResponse,
} from "axios";
import type {
  Quiz,
  Question,
  CreateQuizRequest,
  CreateQuestionRequest,
  Attempt,
  SubmitAttemptResponse,
} from "./types";

const API_URL = process.env.NEXT_PUBLIC_API_URL || "http://localhost:4000";
const API_TOKEN = process.env.NEXT_PUBLIC_API_TOKEN || "dev-token";

// Create axios instance with auth header
const apiClient: AxiosInstance = axios.create({
  baseURL: API_URL,
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${API_TOKEN}`,
  },
});

// Request interceptor to ensure auth header is always present
apiClient.interceptors.request.use(
  (config: InternalAxiosRequestConfig) => {
    config.headers.Authorization = `Bearer ${API_TOKEN}`;
    return config;
  },
  (error) => Promise.reject(error),
);

// API functions
export const quizAPI = {
  // Create a new quiz (returns quiz without questions)
  createQuiz: async (quiz: CreateQuizRequest): Promise<Quiz> => {
    const response: AxiosResponse<Quiz> = await apiClient.post(
      "/quizzes",
      quiz,
    );
    return response.data;
  },

  // Get quiz by ID (includes questions)
  getQuiz: async (quizId: number): Promise<Quiz> => {
    const response: AxiosResponse<Quiz> = await apiClient.get(
      `/quizzes/${quizId}`,
    );
    return response.data;
  },

  // Add a question to a quiz
  addQuestion: async (
    quizId: number,
    question: CreateQuestionRequest,
  ): Promise<Question> => {
    const response: AxiosResponse<Question> = await apiClient.post(
      `/quizzes/${quizId}/questions`,
      question,
    );
    return response.data;
  },

  // Publish a quiz
  publishQuiz: async (quizId: number): Promise<Quiz> => {
    const response: AxiosResponse<Quiz> = await apiClient.patch(
      `/quizzes/${quizId}`,
      { isPublished: true },
    );
    return response.data;
  },

  // Start a quiz attempt
  startAttempt: async (quizId: number): Promise<Attempt> => {
    const response: AxiosResponse<Attempt> = await apiClient.post("/attempts", {
      quizId,
    });
    return response.data;
  },

  // Save an answer in an attempt
  saveAnswer: async (
    attemptId: number,
    questionId: number,
    value: string,
  ): Promise<void> => {
    await apiClient.post(`/attempts/${attemptId}/answer`, {
      questionId,
      value,
    });
  },

  // Submit an attempt
  submitAttempt: async (attemptId: number): Promise<SubmitAttemptResponse> => {
    const response: AxiosResponse<SubmitAttemptResponse> = await apiClient.post(
      `/attempts/${attemptId}/submit`,
    );
    return response.data;
  },

  // Log an anti-cheat event
  logEvent: async (attemptId: number, event: string): Promise<void> => {
    await apiClient.post(`/attempts/${attemptId}/events`, { event });
  },
};

export default apiClient;
