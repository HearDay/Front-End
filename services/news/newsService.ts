import { News, SavedNews } from '@/types/screens'; // 타입 정의는 types/screens.ts에 있다고 가정
import client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const newsService = {
  // 뉴스 상세 정보 조회
  getNewsDetail: async (newsId: number): Promise<News | null> => {
    try {
      const response = await client.get<News>(ENDPOINTS.NEWS_DETAIL(newsId));
      return response.data;
    } catch (error) {
      console.error('뉴스 상세 조회 API 오류:', error);
      return null;
    }
  },
  // 저장된 뉴스 목록 조회
  getSavedNews: async (): Promise<SavedNews[] | null> => {
    try {
      const response = await client.get<SavedNews[]>(ENDPOINTS.SAVED_NEWS);
      return response.data;
    } catch (error) {
      console.error('저장된 뉴스 조회 API 오류:', error);
      return null;
    }
  },
};