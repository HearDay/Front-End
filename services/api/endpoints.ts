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

  // 저장된 뉴스 (북마크)
  SAVED_NEWS: {
    LIST: '/api/article-bookmarks', // 내 북마크 목록 조회
    SAVE: (articleId: string) => `/api/article-bookmarks/${articleId}`, // 북마크 추가
    DELETE: (articleId: string) => `/api/article-bookmarks/${articleId}`, // 북마크 삭제
  },

  // 단어장
  WORDBOOK: {
    STATISTICS: '/api/words/statistics', // 월별 저장된 단어 개수 조회
    WORDS_BY_DATE: '/api/words/date', // 특정 날짜의 단어 목록 조회
    SAVE_WORD: '/api/words/', // 단어 저장
    GET_WORD: (wordId: number) => `/api/words/${wordId}`, // 단어 뜻 조회
    DELETE_WORD: (id: string) => `/api/words/${id}`, // 단어 삭제
  },

  // 사전
  DICTIONARY: {
    SEARCH: (word: string) => `/api/dictionary/search/${word}`,
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