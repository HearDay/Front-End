export interface AttendanceDate {
  date: string; // "2025-11-25"
}

export interface ProfileData {
  nickname: string;
  email: string;
  level: number; 
  point: number; // 누적 포인트 (프론트에서 레벨/게이지 계산)
  attendance: AttendanceDate[];
}

export interface ProfileResponse {
  success: boolean;
  message: string;
  data: ProfileData;
}
