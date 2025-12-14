import axiosInstance from "@/services/api/axiosInstance";
import { GetProfileInfoResponse } from "@/types/auth/profileInfo";

export const getProfileInfo = async (): Promise<GetProfileInfoResponse> => {
  const res = await axiosInstance.get<GetProfileInfoResponse>(
    "/api/users/profile/info"
  );
  return res.data;
};
