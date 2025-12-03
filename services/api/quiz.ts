import axiosInstance from '../api/axiosInstance';

export interface QuizQuestion {
  id: number;
  question: string;
  option1: string;
  option2: string;
  option3: string;
  correctAnswer: number;
  explanation: string;
  isSolved: boolean;
}

export interface QuizResponse {
  success: boolean;
  message: string;
  data: QuizQuestion;
  errorCode: string;
}

export interface SolveQuizResponse {
  success: boolean;
  message: string;
  data: Record<string, never>;
  errorCode: string;
}

export const quizService = {
  // 특정 기사의 퀴즈 조회
  getQuizByArticle: async (articleId: number): Promise<QuizQuestion> => {
    try {
      const response = await axiosInstance.get<QuizResponse>(
        `/api/quizzes/article/${articleId}`
      );
      return response.data.data;
    } catch (error: any) {
      throw error;
    }
  },

  // 퀴즈 풀이 제출
  solveQuiz: async (quizId: number): Promise<void> => {
    try {
      await axiosInstance.post<SolveQuizResponse>(
        `/api/quizzes/${quizId}/solve`
      );
    } catch (error) {
      throw error;
    }
  },
};
