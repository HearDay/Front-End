import axiosInstance from "@/services/api/axiosInstance";
import { getAccessToken } from "@/services/utils/tokenStorage";
import { DiscussionDetailResponse } from "@/types/auth/chat";

export const fetchDiscussionDetail = async (
  discussionId: number,
  page = 0,
  size = 10,
  sort = "asc"
): Promise<DiscussionDetailResponse> => {
  try {
    const rawToken = await getAccessToken();
    const token = rawToken ? rawToken.replace(/"/g, "") : ""; // 토큰문자열 따옴표 제거

    const response = await axiosInstance.get(
      `/api/discussion/${discussionId}`, 
      {
        headers: {
          Authorization: token ? `Bearer ${token}` : "",
        },
        params: {
          discussionId, 
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
