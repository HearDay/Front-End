import { LoginRequest, LoginResponse } from "@/types/auth/login";
import axiosInstance from "./axiosInstance";

export const login = async (body: LoginRequest): Promise<LoginResponse> => {
  const res = await axiosInstance.post("/api/users/login", body);
  return res.data;
};
