import { DiscussionRecordItem } from '../../types/screens';
import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'
import { ApiResponse } from '../../types/api'

interface Discussion {
  id: string
  articleId: string
  type: 'voice' | 'chat'
  createdAt: string
}

interface DiscussionMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: string
}

export const discussionService = {
  // 토론 기록 가져오기
  async getDiscussionRecords(sortBy: 'latest' | 'oldest'): Promise<DiscussionRecordItem[]> {
    interface ApiDiscussionItem {
      discussionId: number
      articleTitle: string
      date: string
    }

    const response = await apiClient.get<ApiResponse<{ discussionList: ApiDiscussionItem[] }>>(
      ENDPOINTS.DISCUSSION.LIST,
      { params: { sort: sortBy } }
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

  async getMessages(discussionId: string): Promise<DiscussionMessage[]> {
    const response = await apiClient.get(ENDPOINTS.DISCUSSION.MESSAGES(discussionId))
    return response.data
  },

  async sendMessage(discussionId: string, content: string): Promise<DiscussionMessage> {
    const response = await apiClient.post(
      ENDPOINTS.DISCUSSION.SEND_MESSAGE(discussionId),
      { content }
    )
    return response.data
  },
}