import axiosInstance from "@/services/api/axiosInstance";
import { getAccessToken } from "@/services/utils/tokenStorage";
import { RegisterInfoRequest, RegisterInfoResponse } from "@/types/auth/registerInfo";

export const registerUserInfo = async (
  body: RegisterInfoRequest
): Promise<RegisterInfoResponse> => {
  
  const token = await getAccessToken();

  const res = await axiosInstance.post("/api/users/category", body, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return res.data;
};
