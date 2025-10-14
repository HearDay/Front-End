export const ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    SIGNUP: '/api/auth/signup',
  },

  // 뉴스
  NEWS: {
    LIST: '/api/news',
    DETAIL: (id: string) => `/api/news/${id}`,
    AUDIO: (id: string) => `/api/news/${id}/audio`,
    SAVE: (id: string) => `/api/news/${id}/save`,
    UNSAVE: (id: string) => `/api/news/${id}/unsave`,
    VIEWED: '/api/news/viewed',
  },

  // 저장된 뉴스
  SAVED_NEWS: {
    LIST: '/api/saved-news',
    DELETE: (id: string) => `/api/saved-news/${id}`,
  },

  // 단어장
  WORDBOOK: {
    CALENDAR: '/api/wordbook/calendar',
    WORDS_BY_DATE: '/api/wordbook/words',
    SAVE_WORD: '/api/wordbook/save',
    DELETE_WORD: (id: string) => `/api/wordbook/${id}`,
  },

  // 사전
  DICTIONARY: {
    SEARCH: '/api/dictionary/search',
    DEFINITION: (word: string) => `/api/dictionary/${word}`,
  },

  // 토론
  DISCUSSION: {
    LIST: '/api/discussion',
    RECORDS: '/api/discussion/records', // 기록 API 엔드포인트 추가
    CREATE: '/api/discussion',
    DETAIL: (id: string) => `/api/discussion/${id}`,
    MESSAGES: (id: string) => `/api/discussion/${id}/messages`,
    SEND_MESSAGE: (id: string) => `/api/discussion/${id}/messages`,
  },

  // 기사 본문
  ARTICLE: {
    DETAIL: (id: string) => `/api/articles/${id}`,
    HIGHLIGHT: (id: string) => `/api/articles/${id}/highlight`,
  },
}