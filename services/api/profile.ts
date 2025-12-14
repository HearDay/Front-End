import { getAccessToken } from "@/services/utils/tokenStorage";
import { ProfileResponse } from "@/types/auth/profile";
import axiosInstance from "./axiosInstance";

export const fetchProfile = async (year: number, month: number): Promise<ProfileResponse> => {
  const token = await getAccessToken();

  const res = await axiosInstance.get(`/api/users/profile`, {
    params: { year, month },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return res.data;
};
