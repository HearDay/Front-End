export interface RecommendArticle {
  id: number;
  title: string;
  originLink: string;
  imageUrl: string;
}

export interface RecommendNewsData {
  level: number;
  nickname: string;
  updateTime: string;
  recommendedArticles: RecommendArticle[];
}

export interface RecommendNewsResponse {
  success: boolean;
  message: string;
  data: RecommendNewsData;
  errorCode?: string;
}
