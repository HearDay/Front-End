import axiosInstance from "@/services/api/axiosInstance";
import { RecommendNewsResponse } from "@/types/auth/recommendNews";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchRecommendNews = async (): Promise<RecommendNewsResponse> => {
  try {
    const token = await AsyncStorage.getItem("accessToken");

    const res = await axiosInstance.get("/api/users/home", {
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return res.data;
  } catch (err: any) {
    console.error("추천 뉴스 조회 실패:", err.response?.data || err.message);
    throw err;
  }
};
