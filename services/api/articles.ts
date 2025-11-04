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
    console.error("기사 조회 중 알 수 없는 오류:", error?.message);
    return [];
  }
};
