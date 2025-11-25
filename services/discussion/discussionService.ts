import { ApiResponse, DiscussionRecordItem } from '../../types/screens';
import apiClient from '../api/client';
import { ENDPOINTS } from '../api/endpoints';

interface Discussion {
  id: string
  articleId: string
  type: 'voice' | 'chat'
  createdAt: string
}


export const discussionService = {
  // 토론 기록 가져오기
  async getDiscussionRecords(sortBy: 'latest' | 'oldest'): Promise<DiscussionRecordItem[]> {
    interface ApiDiscussionItem {
      discussionId: number
      articleTitle: string
      date: string
    }

    // sortBy를 API 형식으로 변환: 'latest' → 'desc', 'oldest' → 'asc'
    const apiSortBy = sortBy === 'latest' ? 'desc' : 'asc'

    const response = await apiClient.get<ApiResponse<{ discussionList: ApiDiscussionItem[] }>>(
      ENDPOINTS.DISCUSSION.LIST,
      { params: { sort: apiSortBy } }
    )

    return response.data.data.discussionList.map(item => ({
      id: String(item.discussionId),
      title: item.articleTitle,
      discussedAt: item.date,
    }))
  },

  async getDiscussions(): Promise<Discussion[]> {
    const response = await apiClient.get(ENDPOINTS.DISCUSSION.LIST)
    return response.data
  },

  async createDiscussion(articleId: string, type: 'voice' | 'chat'): Promise<Discussion> {
    const response = await apiClient.post(ENDPOINTS.DISCUSSION.CREATE, {
      articleId,
      type,
    })
    return response.data
  },

  async getDiscussionDetail(discussionId: string): Promise<Discussion> {
    const response = await apiClient.get(ENDPOINTS.DISCUSSION.DETAIL(discussionId))
    return response.data
  },
}