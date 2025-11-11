export interface CategoryArticle {
  id: number;
  title: string;
  origin_link: string;
  image_url: string;
}

export interface CategoryRecommendNewsResponse {
  success: boolean;
  message: string;
  data: CategoryArticle[];
  errorCode?: string;
}
