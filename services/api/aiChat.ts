import { getAccessToken } from "@/services/utils/tokenStorage";
import { ApiResponse, SendChatRequest, SendChatResponse } from "@/types/auth/aiChat";
import axiosInstance from "./axiosInstance";

export const sendChatMessage = async (
  articleId: number,
  body: SendChatRequest,
  discussionId?: number
): Promise<ApiResponse<SendChatResponse>> => {

  // 여기서만 토큰을 읽어서 넣기
  const token = await getAccessToken();

  const params = discussionId !== undefined ? { discussionId } : {};

  const res = await axiosInstance.post(
    `/api/discussion/chat/${articleId}`,
    body,
    {
      params,
      headers: token
        ? { Authorization: `Bearer ${token}` }
        : {}, // 토큰 없으면 빈 객체 (문제 없음)
    }
  );

  return res.data;
};
