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
    throw err;
  }
};
