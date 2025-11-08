import axiosInstance from "@/services/api/axiosInstance";
import { CertificationResponse } from "../../types/auth/certification";

// 이메일 인증번호 발송
export const sendCertificationCode = async (email: string): Promise<CertificationResponse> => {
  const response = await axiosInstance.post("/api/users/send", email, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};

// 인증번호 검증
export const verifyCertificationCode = async (
  email: string,
  code: string
): Promise<CertificationResponse> => {
  const response = await axiosInstance.post(`/api/users/verify?code=${code}`, email, {
    headers: { "Content-Type": "application/json" },
  });
  return response.data;
};
