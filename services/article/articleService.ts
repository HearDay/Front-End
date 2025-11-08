import { NewsArticleData, ApiResponse, ArticleData } from '../../types/screens'
import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

export const articleService = {
  async getArticleDetail(articleId: string): Promise<NewsArticleData> {
    const response = await apiClient.get<ApiResponse<ArticleData>>(ENDPOINTS.ARTICLE.DETAIL(articleId))
    const article = response.data.data

    return {
      id: String(article.id),
      title: article.title,
      imageUrl: article.imageUrl,
      content: article.detail.content,
    }
  },
}
