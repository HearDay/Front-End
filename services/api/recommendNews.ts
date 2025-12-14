import axiosInstance from "@/services/api/axiosInstance";
import { getAccessToken } from "@/services/utils/tokenStorage";
import { RecommendNewsResponse } from "@/types/auth/recommendNews";

export const fetchRecommendNews = async (): Promise<RecommendNewsResponse> => {
  try {
    const token = await getAccessToken();

    const res = await axiosInstance.get("/api/users/home", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return res.data;
  } catch (err: any) {
    console.error("추천 뉴스 조회 실패:", err.response?.data || err.message);
    throw err;
  }
};
