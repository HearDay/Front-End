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
    // 토큰 자동 불러오기
    const token = await AsyncStorage.getItem("accessToken");

    // axios 요청 옵션 구성
    const config = {
      headers: {} as Record<string, string>,
      params: {
        page,
        size,
        sort,
      },
    };

    // 토큰이 있으면 자동으로 Authorization 추가
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }

    // API 요청
    const response = await axiosInstance.get<DiscussionDetailResponse>(
      `/api/discussion/${discussionId}`,
      config
    );

    return response.data;
  } catch (error: any) {
    console.error("🧠 토론 기록 조회 실패:", error.response?.data || error.message);
    throw error;
  }
};
