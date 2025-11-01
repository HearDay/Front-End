export const ENDPOINTS = {
  // 인증
  AUTH: {
    LOGIN: '/api/auth/login',
    LOGOUT: '/api/auth/logout',
    REFRESH: '/api/auth/refresh',
    SIGNUP: '/api/auth/signup',
  },

  // 기사 (뉴스)
  ARTICLE: {
    LIST: '/api/v1/article/list',
    DETAIL: (id: string) => `/api/v1/article/${id}`,
    // SAVE, UNSAVE 등 필요한 다른 엔드포인트들도 여기에 추가할 수 있습니다.
  },

  // 오디오
  AUDIO: {
    PLAY: (articleId: string) => `/api/v1/audio/play/${articleId}`,
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