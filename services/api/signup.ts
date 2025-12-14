import { saveAccessToken } from "@/services/utils/tokenStorage";
import { SignUpRequest, SignUpResponse } from "@/types/auth/signup";
import axiosInstance from "./axiosInstance";

export const signup = async (
  body: SignUpRequest
): Promise<SignUpResponse> => {
  try {
    // 회원가입 요청
    const res = await axiosInstance.post<SignUpResponse>(
      "/api/users",
      body
    );

    // 서버가 accessToken을 반환하면 SecureStore에 저장
    const token = res.data?.data?.accessToken;
    if (res.data?.success && token) {
      await saveAccessToken(token);
    }

    return res.data;
  } catch (error: any) {
    console.error("signup API error:", error.response?.data || error.message);
    throw error;
  }
};
