
const CLIENT_ID = process.env.EXPO_PUBLIC_CLIENT_ID;
const REDIRECT_URI = process.env.EXPO_PUBLIC_REDIRECT_URI;

/**
 * 카카오 로그인 URL 생성
 * - 사용자가 클릭하면 카카오 로그인 페이지로 이동
 * - 로그인 성공 시 REDIRECT_URI로 리디렉트되며 서버가 토큰 처리함
 */
export const getKakaoAuthUrl = () => {
  return `https://kauth.kakao.com/oauth/authorize?response_type=code&client_id=${CLIENT_ID}&redirect_uri=${REDIRECT_URI}`;
};
