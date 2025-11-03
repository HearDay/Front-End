import { SignUpRequest, SignUpResponse } from "@/types/auth/signup";
import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "./endpoints";

export const signup = async (body: SignUpRequest): Promise<SignUpResponse> => {
  const res = await axiosInstance.post(ENDPOINTS.AUTH.SIGNUP, body);
  return res.data;
};
