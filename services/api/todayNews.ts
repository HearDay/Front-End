import axiosInstance from "./axiosInstance";

// 오늘의 뉴스 기사 타입
export interface TodayNewsArticle {
  id: number;
  title: string;
  description: string;
  detail: {
    content: string;
    ttsUrl: string;
    ttsAlignment: string;
  };
  imageUrl: string;
  category: string;
  updatedAt: string;
}

// 오늘의 뉴스 응답 타입
export interface TopByDemographicResponse {
  success: boolean;
  message: string;
  data: TodayNewsArticle[];
  errorCode: string;
}

// 사용자 성별/나이 타입
export interface UserDemographic {
  userId: number;
  nickname: string;
  gender: string; // "M" 또는 "F"
  age: number;
}

// 사용자 성별/나이 응답 타입
export interface UserDemographicResponse {
  success: boolean;
  message: string;
  data: UserDemographic;
  errorCode: string;
}

// 오늘의 뉴스 API
export const todayNewsService = {
  // 맞춤 기사 가져오기
  getTopByDemographic: async (): Promise<TodayNewsArticle[]> => {
    const response = await axiosInstance.get<TopByDemographicResponse>(
      "/api/articles/top-by-demographic"
    );
    return response.data.data;
  },

  // 사용자 성별/나이 가져오기
  getUserDemographic: async (): Promise<UserDemographic> => {
    const response = await axiosInstance.get<UserDemographicResponse>(
      "/api/users/profile/gender-age"
    );
    return response.data.data;
  },
};
