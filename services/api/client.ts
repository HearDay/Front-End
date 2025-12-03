import axios, { AxiosError, AxiosInstance, AxiosRequestConfig, AxiosResponse } from 'axios'
import { storage } from '../../utils/storage'

// .env 파일에서 환경변수 가져오기 (필수)
const BASE_URL = process.env.EXPO_PUBLIC_API_BASE_URL
if (!BASE_URL) {
  throw new Error('EXPO_PUBLIC_API_BASE_URL이 .env 파일에 정의되지 않았습니다!')
}
const TIMEOUT = 10000

// API 클라이언트 인스턴스 생성
const apiClient: AxiosInstance = axios.create({
  baseURL: BASE_URL,
  timeout: TIMEOUT,
  headers: {
    'Content-Type': 'application/json',
  },
})

// 요청 인터셉터
apiClient.interceptors.request.use(
  async (config) => {
    try {
      const token = await storage.getAccessToken()
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`
      }
    } catch (error) {
      console.error('토큰 가져오기 실패:', error)
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  }
)

// 응답 인터셉터
apiClient.interceptors.response.use(
  (response: AxiosResponse) => {
    return response
  },
  async (error: AxiosError) => {
    const originalRequest = error.config as AxiosRequestConfig & { _retry?: boolean }

    if (error.response?.status === 401 && !originalRequest._retry && originalRequest) {
      originalRequest._retry = true

      try {
        const refreshToken = await storage.getRefreshToken()
        if (!refreshToken) {
          throw new Error('No refresh token')
        }

        const response = await axios.post(
          `${BASE_URL}/api/auth/refresh`,
          { refreshToken }
        )

        const { accessToken } = response.data
        await storage.setAccessToken(accessToken)

        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${accessToken}`
        }
        return apiClient(originalRequest)
      } catch (refreshError) {
        await storage.clearTokens()
        console.error('토큰 갱신 실패:', refreshError)
        return Promise.reject(refreshError)
      }
    }

    return Promise.reject(error)
  }
)

export default apiClient