import { useInfiniteQuery } from '@tanstack/react-query';
import { fetchArticlesWithPagination } from '@/services/api/articles';

interface Article {
  id: number;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  createdAt: string;
  updatedAt: string;
}

interface UseAutoPlayArticlesOptions {
  enabled?: boolean;
  pageSize?: number;
}

/**
 * 자동재생용 기사 무한 스크롤 데이터 훅
 * - 100개씩 페이지네이션
 * - 추천 5개 종료 후 자동으로 활성화
 */
export const useAutoPlayArticles = ({
  enabled = false,
  pageSize = 100
}: UseAutoPlayArticlesOptions = {}) => {
  return useInfiniteQuery({
    queryKey: ['autoPlayArticles', pageSize],

    queryFn: async ({ pageParam = 0 }) => {
      console.log('[useAutoPlayArticles] 페이지 로드:', pageParam, 'size:', pageSize);

      // API는 page가 0부터 시작
      const articles = await fetchArticlesWithPagination(pageParam, pageSize);

      console.log('[useAutoPlayArticles] 로드 완료:', {
        page: pageParam,
        count: articles.length,
      });

      if (!articles || articles.length === 0) {
        return {
          data: [],
          nextPage: null,
          hasMore: false,
        };
      }

      return {
        data: articles as Article[],
        nextPage: articles.length === pageSize ? pageParam + 1 : null,
        hasMore: articles.length === pageSize,
      };
    },

    initialPageParam: 0,

    getNextPageParam: (lastPage) => {
      return lastPage.nextPage;
    },

    // 추천 5개 종료 후에만 활성화
    enabled,

    // 캐싱 설정
    staleTime: 1000 * 60 * 5, // 5분
    gcTime: 1000 * 60 * 10,   // 10분
  });
};
