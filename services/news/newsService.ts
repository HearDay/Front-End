import { ApiResponse, ArticleData, NewsPlayerData } from '../../types/screens'
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

  // 뉴스 북마크 추가
  async saveNews(newsId: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500)
      })
    }

    // POST /api/article-bookmarks/{articleId}
    await apiClient.post(ENDPOINTS.SAVED_NEWS.SAVE(newsId))
  },

  // 뉴스 북마크 삭제
  async deleteSavedNews(newsId: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500)
      })
    }

    console.log('=== 북마크 삭제 요청 ===')
    console.log('newsId:', newsId)
    console.log('URL:', ENDPOINTS.SAVED_NEWS.DELETE(newsId))

    // DELETE /api/article-bookmarks/{articleId}
    try {
      await apiClient.delete(ENDPOINTS.SAVED_NEWS.DELETE(newsId))
      console.log('삭제 성공')
    } catch (error: any) {
      console.error('삭제 실패 상세:', error.response?.data)
      throw error
    }
  },

  // 내 북마크 목록 조회
  async getSavedNews(page: number = 0, size: number = 20): Promise<ArticleData[]> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve([]), 500)
      })
    }

    console.log('=== 북마크 목록 조회 ===')

    // GET /api/article-bookmarks?page=0&size=20
    const response = await apiClient.get<ApiResponse<ArticleData[]>>(
      ENDPOINTS.SAVED_NEWS.LIST,
      {
        params: {
          page,
          size,
          sort: ['string'] // Swagger에서 필요한 경우
        }
      }
    )

    console.log('북마크 목록 응답:', JSON.stringify(response.data.data, null, 2))
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