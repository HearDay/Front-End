import axiosInstance from "@/services/api/axiosInstance";
import { RegisterInfoRequest, RegisterInfoResponse } from "@/types/auth/registerInfo";
import AsyncStorage from "@react-native-async-storage/async-storage";

export const registerUserInfo = async (
  body: RegisterInfoRequest
): Promise<RegisterInfoResponse> => {
  
  const token = await AsyncStorage.getItem("accessToken");

  const res = await axiosInstance.post("/api/users/category", body, {
    headers: token ? { Authorization: `Bearer ${token}` } : {},
  });

  return res.data;
};
