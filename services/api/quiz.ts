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
      console.log('퀴즈 API 호출:', `/api/quizzes/article/${articleId}`);
      const response = await axiosInstance.get<QuizResponse>(
        `/api/quizzes/article/${articleId}`
      );
      console.log('퀴즈 API 응답:', response.data);
      return response.data.data;
    } catch (error: any) {
      console.error('퀴즈 조회 실패 - Article ID:', articleId);
      console.error('에러 상태 코드:', error?.response?.status);
      console.error('에러 메시지:', error?.response?.data);
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
      console.error('퀴즈 풀이 제출 실패:', error);
      throw error;
    }
  },
};
