import { ResetPasswordRequest, ResetPasswordResponse } from "@/types/auth/resetpassword";
import axiosInstance from "./axiosInstance";
import { ENDPOINTS } from "./endpoints";

export const resetPassword = async (
  payload: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const { data } = await axiosInstance.post<ResetPasswordResponse>(
    ENDPOINTS.AUTH.RESET_PASSWORD,
    payload
  );
  return data;
};
