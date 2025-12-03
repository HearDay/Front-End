import axiosInstance from "@/services/api/axiosInstance";
import { UserInfo } from "@/types/auth/userInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const fetchUserInfo = async (): Promise<UserInfo> => {
  try {
    // AsyncStorage에서 토큰 꺼내오기
    const token = await AsyncStorage.getItem("accessToken");
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
    throw error;
  }
};
