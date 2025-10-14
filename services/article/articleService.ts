import { NewsArticleData } from '../../types/screens'
import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

const DUMMY_ARTICLE: NewsArticleData = {
  id: '1',
  title: '테스트 기사 제목',
  imageUrl: 'https://picsum.photos/400/300',
  content: '이것은 기사 본문입니다. 여러 단락으로 구성되어 있습니다.\n경제 뉴스에 대한 내용입니다. 기술 발전과 환경 문제에 대해 다룹니다.\n마지막 단락입니다.',
}

const USE_DUMMY_DATA = true

export const articleService = {
  async getArticleDetail(articleId: string): Promise<NewsArticleData> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_ARTICLE), 500)
      })
    }
    
    const response = await apiClient.get(ENDPOINTS.ARTICLE.DETAIL(articleId))
    return response.data
  },

  async getHighlightedContent(articleId: string, word: string): Promise<string> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_ARTICLE.content), 500)
      })
    }
    
    const response = await apiClient.get(ENDPOINTS.ARTICLE.HIGHLIGHT(articleId), {
      params: { word }
    })
    return response.data.content
  },
}