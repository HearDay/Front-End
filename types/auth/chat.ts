// types/auth/chat.ts
export interface ChatContent {
  contentId: number;
  role: "AI" | "USER";
  content: string;
}

export interface DiscussionDetailData {
  contentList: ChatContent[];
}

export interface DiscussionDetailResponse {
  success: boolean;
  message: string;
  data: DiscussionDetailData;
  errorCode?: string;
}
