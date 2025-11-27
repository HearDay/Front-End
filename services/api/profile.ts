import { ProfileResponse } from "@/types/auth/profile";
import AsyncStorage from "@react-native-async-storage/async-storage";
import axiosInstance from "./axiosInstance";

export const fetchProfile = async (year: number, month: number): Promise<ProfileResponse> => {
  const token = await AsyncStorage.getItem("accessToken");

  const res = await axiosInstance.get(`/api/users/profile`, {
    params: { year, month },
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return res.data;
};
