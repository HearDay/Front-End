import axiosInstance from "@/services/api/axiosInstance";
import { getAccessToken } from "@/services/utils/tokenStorage";
import { AIVoiceResponse } from "@/types/auth/aiVoice";

export const sendVoiceMessage = async (
  fileUri: string,
  articleId: number,
  level: "beginner" | "intermediate" | "advanced",
  discussionId?: number
): Promise<AIVoiceResponse> => {
  try {
    const rawToken = await getAccessToken();
    const token = rawToken ? rawToken.replace(/"/g, "") : "";

    // 파일 확장자 추출
    const ext = fileUri.split(".").pop();
    const mime = ext === "m4a" ? "audio/m4a" : "audio/x-caf";

    const formData = new FormData();
    formData.append("audioFile", {
      uri: fileUri,
      name: `voice.${ext}`,
      type: mime,
    } as any);

    const response = await axiosInstance.post(
      `/api/discussion/voice/${articleId}`,
      formData,
      {
        headers: {
          Authorization: `Bearer ${token}`,
          "Content-Type": "multipart/form-data",
        },
        params: {
          level,
          ...(discussionId ? { discussionId } : {}), // null/undefined 보호 처리
        },
      }
    );

    return response.data;
  } catch (error: any) {
    console.error("🧠 음성 토론 API 실패:", error.response?.data || error.message);
    throw error;
  }
};
