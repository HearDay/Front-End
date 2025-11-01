import { ArticleData, AudioData, DiscussionNewsItem, SavedNewsItem } from '../../types/screens'
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
    
    const response = await apiClient.get(ENDPOINTS.ARTICLE.DETAIL(articleId))
    return response.data
  },

  // 뉴스 기사 음성 정보 조회
  async getArticleAudio(articleId: string): Promise<AudioData> {
    if (USE_DUMMY_DATA) {
      // 필요시 더미 데이터 로직 구현
      return { audioUrl: 'https://example.com/audio.mp3' }
    }
    
    const response = await apiClient.get(ENDPOINTS.AUDIO.PLAY(articleId))
    return response.data
  },

  async saveNews(newsId: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500)
      })
    }
    
    await apiClient.post(ENDPOINTS.NEWS.SAVE(newsId))
  },

  async unsaveNews(newsId: string): Promise<void> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(), 500)
      })
    }
    
    await apiClient.delete(ENDPOINTS.NEWS.UNSAVE(newsId))
  },

  async getSavedNews(): Promise<SavedNewsItem[]> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
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

  async getViewedNews(sortBy: 'latest' | 'popular' | 'views'): Promise<DiscussionNewsItem[]> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_VIEWED_NEWS), 500)
      })
    }
    
    const response = await apiClient.get(ENDPOINTS.NEWS.VIEWED, {
      params: { sort: sortBy }
    })
    return response.data
  },
}