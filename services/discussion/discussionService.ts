import { DiscussionRecordItem } from '../../types/screens';
import apiClient from '../api/client'
import { ENDPOINTS } from '../api/endpoints'

interface Discussion {
  id: string
  newsId: string
  type: 'voice' | 'chat'
  createdAt: string
}

interface DiscussionMessage {
  id: string
  role: 'user' | 'ai'
  content: string
  timestamp: string
}

const DUMMY_DISCUSSIONS: Discussion[] = [
  {
    id: '1',
    newsId: 'news1',
    type: 'chat',
    createdAt: '2025-01-10T12:00:00',
  },
]

const DUMMY_MESSAGES: DiscussionMessage[] = [
  {
    id: '1',
    role: 'user',
    content: '안녕하세요',
    timestamp: '2025-01-10T12:00:00',
  },
  {
    id: '2',
    role: 'ai',
    content: '안녕하세요! 무엇을 도와드릴까요?',
    timestamp: '2025-01-10T12:00:01',
  },
]

// 토론 기록 더미 데이터 추가
const DUMMY_RECORDS: DiscussionRecordItem[] = [
  {
    id: 'rec1',
    title: '오픈AI의 개인정보 필터 공개, 어떻게 생각하시나요?',
    discussedAt: '2025-10-13',
  },
  {
    id: 'rec2',
    title: '자율주행 기술의 발전과 미래에 대한 고찰',
    discussedAt: '2025-10-12',
  },
  {
    id: 'rec3',
    title: '기후 변화 대응을 위한 글로벌 협력의 중요성',
    discussedAt: '2025-10-11',
  },
];

const USE_DUMMY_DATA = true

export const discussionService = {
  // 토론 기록 가져오기 함수 추가
  async getDiscussionRecords(): Promise<DiscussionRecordItem[]> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_RECORDS), 500);
      });
    }
    const response = await apiClient.get(ENDPOINTS.DISCUSSION.RECORDS);
    return response.data;
  },

  async getDiscussions(): Promise<Discussion[]> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_DISCUSSIONS), 500)
      })
    }
    
    const response = await apiClient.get(ENDPOINTS.DISCUSSION.LIST)
    return response.data
  },

  async createDiscussion(newsId: string, type: 'voice' | 'chat'): Promise<Discussion> {
    if (USE_DUMMY_DATA) {
      const newDiscussion: Discussion = {
        id: Date.now().toString(),
        newsId,
        type,
        createdAt: new Date().toISOString(),
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve(newDiscussion), 500)
      })
    }
    
    const response = await apiClient.post(ENDPOINTS.DISCUSSION.CREATE, {
      newsId,
      type,
    })
    return response.data
  },

  async getDiscussionDetail(discussionId: string): Promise<Discussion> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_DISCUSSIONS[0]), 500)
      })
    }
    
    const response = await apiClient.get(ENDPOINTS.DISCUSSION.DETAIL(discussionId))
    return response.data
  },

  async getMessages(discussionId: string): Promise<DiscussionMessage[]> {
    if (USE_DUMMY_DATA) {
      return new Promise((resolve) => {
        setTimeout(() => resolve(DUMMY_MESSAGES), 500)
      })
    }
    
    const response = await apiClient.get(ENDPOINTS.DISCUSSION.MESSAGES(discussionId))
    return response.data
  },

  async sendMessage(discussionId: string, content: string): Promise<DiscussionMessage> {
    if (USE_DUMMY_DATA) {
      const newMessage: DiscussionMessage = {
        id: Date.now().toString(),
        role: 'user',
        content,
        timestamp: new Date().toISOString(),
      }
      return new Promise((resolve) => {
        setTimeout(() => resolve(newMessage), 500)
      })
    }
    
    const response = await apiClient.post(
      ENDPOINTS.DISCUSSION.SEND_MESSAGE(discussionId),
      { content }
    )
    return response.data
  },
}