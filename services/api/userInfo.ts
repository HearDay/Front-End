import axiosInstance from "@/services/api/axiosInstance";
import { getAccessToken } from "@/services/utils/tokenStorage";
import { UserInfo } from "@/types/auth/userInfo";

export const fetchUserInfo = async (): Promise<UserInfo> => {
  try {
    // SecureStore에서 토큰 꺼내오기
    const token = await getAccessToken();
    if (!token) {
      throw new Error("토큰이 없습니다. 로그인 후 다시 시도해주세요.");
    }

    // 토큰 포함해서 요청
    const response = await axiosInstance.get<UserInfo>("/api/users/home", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    return response.data;
  } catch (error) {
    console.error("유저 정보 조회 실패:", error);
    throw error;
  }
};
