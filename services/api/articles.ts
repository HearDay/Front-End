// services/api/articles.ts
import axiosInstance from "@/services/api/axiosInstance";

export const fetchArticles = async (title: string, category: string) => {
  try {
    const response = await axiosInstance.post(
      `/api/articles?page=0&size=10&sort=latest`,
      {
        categories: category === "전체" ? [] : [category],
        title: title || "",
      }
    );

    // 정상 응답인데 data가 비어있는 경우 안전하기 처리!!
    if (!response.data?.data || response.data.data.length === 0) {
      return [];
    }

    return response.data.data;
  } catch (error: any) {
    // 403, 404, empty 등 특정 에러는 조용히 처리
    const status = error?.response?.status;
    if (status === 403 || status === 404) {
      return [];
    }

    // 그 외 예기치 않은 오류만 콘솔에 표시
    return [];
  }
};

/**
 * 자동재생용 기사 페이지네이션 API
 * @param page - 페이지 번호 (0부터 시작)
 * @param size - 페이지당 기사 개수 (기본 100개)
 */
export const fetchArticlesWithPagination = async (page: number = 0, size: number = 100) => {
  try {

    const response = await axiosInstance.post(
      `/api/articles?page=${page}&size=${size}&sort=latest`,
      {
        categories: [],
        title: "",
      }
    );

      status: response.status,
      dataLength: response.data?.data?.length || 0,
    });

    // 정상 응답인데 data가 비어있는 경우 안전하기 처리
    if (!response.data?.data || response.data.data.length === 0) {
      return [];
    }

    return response.data.data;
  } catch (error: any) {
    const status = error?.response?.status;
      status,
      message: error?.message,
    });

    if (status === 403 || status === 404) {
      return [];
    }

    return [];
  }
};
