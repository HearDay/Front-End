import { LoginRequest, LoginResponse } from "@/types/auth/login";
import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "./endpoints";

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const res = await axiosInstance.post(ENDPOINTS.AUTH.LOGIN, body);
  return res.data;
};
