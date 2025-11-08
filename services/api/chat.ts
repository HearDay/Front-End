// services/api/chat.ts
import axiosInstance from "@/services/api/axiosInstance";
import { DiscussionDetailResponse } from "@/types/auth/chat";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchDiscussionDetail = async (
  discussionId: number,
  page = 0,
  size = 10,
  sort = "desc"
): Promise<DiscussionDetailResponse> => {
  try {
    const token = await AsyncStorage.getItem("accessToken");
    if (!token) {
      throw new Error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
    }

    const response = await axiosInstance.get<DiscussionDetailResponse>(
      `/api/discussion/${discussionId}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        params: {
          page,
          size,
          sort,
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("🧠 토론 기록 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};
