import { SignUpRequest, SignUpResponse } from "@/types/auth/signup";
import axiosInstance from "./axiosInstance";

export const signup = async (body: SignUpRequest): Promise<SignUpResponse> => {
  const res = await axiosInstance.post("/api/users", body);
  return res.data;
};
