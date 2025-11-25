// AI 채팅 메시지 타입
export interface ChatContent {
  contentId: number;
  role: "USER" | "AI";
  content: string;
}

// AI 채팅 요청 타입
export interface SendChatRequest {
  message: string;
  level: "beginner" | "intermediate" | "advanced";
}

// AI 채팅 응답 타입
export interface SendChatResponse {
  reply: string;
  discussionId: number;
}

// API 공통 응답 포맷
export interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
  errorCode: string;
}
