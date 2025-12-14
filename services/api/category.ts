import { getAccessToken } from "@/services/utils/tokenStorage";
import axiosInstance from "./axiosInstance";

export const registerUserCategories = async (categories: string[]) => {
  try {
    const token = await getAccessToken();
   

    if (!token) {
      throw new Error("로그인 토큰이 없습니다. 다시 로그인해주세요.");
    }

    const res = await axiosInstance.post("/api/users/category", categories, {
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
    });

    return res.data;
  } catch (error: any) {
    console.error("카테고리 등록 오류:", error.response?.data || error.message);
    throw error;
  }
};
