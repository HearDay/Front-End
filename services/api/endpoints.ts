export const ENDPOINTS = {
  // 뉴스
  NEWS_DETAIL: (newsId: number) => `/news/${newsId}`,
  SAVED_NEWS: '/news/saved',
  SAVE_NEWS: (newsId: number) => `/news/${newsId}/save`,

  // 단어장
  SAVED_WORDS_BY_DATE: '/word/saved', 
  SAVED_WORDS_MONTHLY: '/word/saved/monthly',
  WORD_DEFINITION: (word: string) => `/word/${word}`,

  // 토론
  DISCUSSION_LIST: '/discussion',
  DISCUSSION_DETAIL: (discussionId: number) => `/discussion/${discussionId}`,
};