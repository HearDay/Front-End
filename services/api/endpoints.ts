export const ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/api/users/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    SIGNUP: '/api/users',
    RESET_PASSWORD: '/api/users/password/reset',
  },

  // 기사 (뉴스)
  ARTICLE: {
    LIST: '/api/articles', 
    DETAIL: (id: string) => `/api/articles/${id}`,
    HIGHLIGHT: (id: string) => `/api/articles/${id}/highlight`,
    RECENT: '/api/recent-articles',
  },

  // 오디오
  AUDIO: {
    PLAY: (articleId: string) => `/api/audio/play/${articleId}`,
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
    RECORDS: '/api/discussion/records', 
    CREATE: '/api/discussion',
    DETAIL: (id: string) => `/api/discussion/${id}`,
    MESSAGES: (id: string) => `/api/discussion/${id}/messages`,
    SEND_MESSAGE: (id: string) => `/api/discussion/${id}/messages`,
  },
}