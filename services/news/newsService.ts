import { ApiResponse, ArticleData, SavedNewsItem, NewsPlayerData } from '../../types/screens'
import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

// 개발 모드 플래그
const USE_DUMMY_DATA = false // API가 준비되면 false로 변경

export const newsService = {
  // 뉴스 기사 상세 정보 조회
  async getArticleDetail(articleId: string): Promise<ArticleData> {
    if (USE_DUMMY_DATA) {
      // 필요시 더미 데이터 로직 구현
      return {} as ArticleData
    }

    const response = await apiClient.get<ApiResponse<ArticleData>>(ENDPOINTS.ARTICLE.DETAIL(articleId))
    return response.data.data // wrapper 구조에 맞춰 실제 데이터 반환
  },

  // 뉴스 플레이어용 데이터 조회
  async getNewsDetail(newsId: string): Promise<NewsPlayerData> {
    const article = await this.getArticleDetail(newsId)
    return {
      title: article.title,
      imageUrl: article.imageUrl,
      fullText: article.detail.content,
      audioUrl: article.detail.ttsUrl,
    }
  },

  // 뉴스 기사 목록 조회/검색
  async getArticles(
    page: number,
    size: number,
    categories?: string[],
    title?: string,
    sort?: string[]
  ): Promise<ArticleData[]> {
    const response = await apiClient.post<ApiResponse<ArticleData[]>>(
      ENDPOINTS.ARTICLE.LIST,
      {
        categories,
        title,
      },
      {
        params: { page, size, sort }
      }
    );
    return response.data.data;
  },

  async saveNews(newsId: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500)
      })
    }
    
    // @ts-ignore - ENDPOINTS.NEWS is deprecated
    await apiClient.post(ENDPOINTS.NEWS.SAVE(newsId))
  },

  async unsaveNews(newsId: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500)
      })
    }
    // @ts-ignore - ENDPOINTS.NEWS is deprecated
    await apiClient.delete(ENDPOINTS.NEWS.UNSAVE(newsId))
  },

  async getSavedNews(): Promise<SavedNewsItem[]> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        // @ts-ignore - DUMMY_SAVED_NEWS is not defined
        setTimeout(() => resolve(DUMMY_SAVED_NEWS), 500)
      })
    }
    
    const response = await apiClient.get(ENDPOINTS.SAVED_NEWS.LIST)
    return response.data
  },

  async deleteSavedNews(newsId: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500)
      })
    }
    
    await apiClient.delete(ENDPOINTS.SAVED_NEWS.DELETE(newsId))
  },

  // 최근 본 기사 목록 조회
  async getRecentArticles(sortBy: 'RECENT' | 'PUBLISH_DATE' = 'RECENT'): Promise<ArticleData[]> {
    const response = await apiClient.get<ApiResponse<ArticleData[]>>(
      ENDPOINTS.ARTICLE.RECENT,
      {
        params: { sortBy }
      }
    );
    return response.data.data;
  },
}