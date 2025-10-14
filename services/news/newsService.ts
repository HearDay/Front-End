import { DiscussionNewsItem, NewsPlayerData, SavedNewsItem } from '../../types/screens'
import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

// 개발용 더미 데이터
const DUMMY_NEWS_PLAYER: NewsPlayerData = {
  id: '1',
  title: '테스트 뉴스 제목',
  imageUrl: 'https://picsum.photos/400/300',
  fullText: '첫 번째 줄입니다.\n두 번째 줄입니다.\n세 번째 줄입니다.\n네 번째 줄입니다.\n다섯 번째 줄입니다.\n여섯 번째 줄입니다.',
  audioUrl: 'https://example.com/audio.mp3',
}

const DUMMY_SAVED_NEWS: SavedNewsItem[] = [
  {
    id: '1',
    title: '저장된 뉴스 1',
    summary: '뉴스 요약 내용입니다.',
    imageUrl: 'https://picsum.photos/400/300',
    category: '경제',
    savedAt: '2025-01-10',
  },
  {
    id: '2',
    title: '저장된 뉴스 2',
    summary: '또 다른 뉴스 요약입니다.',
    imageUrl: 'https://picsum.photos/400/301',
    category: '기술',
    savedAt: '2025-01-09',
  },
]

const DUMMY_VIEWED_NEWS: DiscussionNewsItem[] = [
  {
    id: '1',
    title: '본 뉴스 1',
    imageUrl: 'https://picsum.photos/400/300',
    summary: '뉴스 요약',
    viewedAt: '2025-01-10T12:00:00',
    popularity: 100,
    viewCount: 500,
  },
]

// 개발 모드 플래그
const USE_DUMMY_DATA = true // API가 준비되면 false로 변경

export const newsService = {
  async getNewsDetail(newsId: string): Promise<NewsPlayerData> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_NEWS_PLAYER), 500)
      })
    }
    
    const response = await apiClient.get(ENDPOINTS.NEWS.DETAIL(newsId))
    return response.data
  },

  async getNewsAudio(newsId: string): Promise<string> {
    if (USE_DUMMY_DATA) {
      return DUMMY_NEWS_PLAYER.audioUrl
    }
    
    const response = await apiClient.get(ENDPOINTS.NEWS.AUDIO(newsId))
    return response.data.audioUrl
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