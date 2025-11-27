import { ApiResponse, ArticleData, NewsPlayerData } from '../../types/screens'
import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

export const newsService = {
  // 뉴스 기사 상세 정보 조회
  async getArticleDetail(articleId: string): Promise<ArticleData> {
    const response = await apiClient.get<ApiResponse<ArticleData>>(ENDPOINTS.ARTICLE.DETAIL(articleId))
    return response.data.data
  },

  // 뉴스 플레이어용 데이터 조회
  async getNewsDetail(articleId: string): Promise<NewsPlayerData> {
    const article = await this.getArticleDetail(articleId)

    return {
      title: article.title,
      imageUrl: article.imageUrl,
      fullText: article.detail.content,
      audioUrl: article.detail.ttsUrl,
      ttsAlignment: article.detail.ttsAlignment,
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

  // 뉴스 북마크 추가
  async saveNews(articleId: string): Promise<void> {
    await apiClient.post(ENDPOINTS.SAVED_NEWS.SAVE(articleId))
  },

  // 뉴스 북마크 삭제
  async deleteSavedNews(articleId: string): Promise<void> {
    await apiClient.delete(ENDPOINTS.SAVED_NEWS.DELETE(articleId))
  },

  // 내 북마크 목록 조회
  async getSavedNews(page: number = 0, size: number = 20): Promise<ArticleData[]> {
    const response = await apiClient.get<ApiResponse<ArticleData[]>>(
      ENDPOINTS.SAVED_NEWS.LIST,
      {
        params: {
          page,
          size,
          sort: ['string']
        }
      }
    )

    return response.data.data
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