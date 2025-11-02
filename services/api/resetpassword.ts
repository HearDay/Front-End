import { ResetPasswordRequest, ResetPasswordResponse } from "@/types/auth/resetpassword";
import axiosInstance from "./axiosInstance";

export const resetPassword = async (
  payload: ResetPasswordRequest
): Promise<ResetPasswordResponse> => {
  const { data } = await axiosInstance.post<ResetPasswordResponse>(
    "/api/users/password/reset",
    payload
  );
  return data;
};
