import { SavedWord, WordDefinition } from '@/types/screens'; // 타입 정의는 types/screens.ts에 있다고 가정
import client from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

export const wordbookService = {
  // 날짜별 저장 단어 조회
  getSavedWordsByDate: async (date: string): Promise<SavedWord[] | null> => {
    try {
      const response = await client.get<SavedWord[]>(ENDPOINTS.SAVED_WORDS_BY_DATE, {
        params: { date }, // 쿼리 파라미터로 날짜 전달
      });
      return response.data;
    } catch (error) {
      console.error('날짜별 단어 조회 API 오류:', error);
      return null;
    }
  },
  // 단어 뜻 조회
  getWordDefinition: async (word: string): Promise<WordDefinition | null> => {
    try {
      const response = await client.get<WordDefinition>(ENDPOINTS.WORD_DEFINITION(word));
      return response.data;
    } catch (error) {
      console.error('단어 뜻 조회 API 오류:', error);
      return null;
    }
  },
};