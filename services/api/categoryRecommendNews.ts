import axiosInstance from "@/services/api/axiosInstance";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { CategoryRecommendNewsResponse } from "../../types/auth/categoryRecommendNews";

// 카테고리별 추천 뉴스 가져오기
export const fetchCategoryRecommendNews = async (
  category: string
): Promise<CategoryRecommendNewsResponse> => {
  try {
    // accessToken (로그인한 유저일 경우만)
    const token = await AsyncStorage.getItem("accessToken");

    const res = await axiosInstance.get("/api/articles/category", {
      params: { category },
      headers: token ? { Authorization: `Bearer ${token}` } : {},
    });

    return res.data;
  } catch (err: any) {
    console.error(
      "카테고리별 추천 뉴스 조회 실패:",
      err.response?.data || err.message
    );
    throw err;
  }
};
