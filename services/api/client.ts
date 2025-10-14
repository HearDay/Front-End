import { config } from '@/constants/config';
import { storage } from '@/utils/storage';
import axios from 'axios';

const client = axios.create({
  baseURL: config.apiBaseUrl,
  timeout: 10000,
});

// 요청 인터셉터: 모든 요청이 보내지기 전에 실행됩니다.
client.interceptors.request.use(
  async (config) => {
    // AsyncStorage에서 토큰을 가져옵니다.
    const token = await storage.getItem<string>('accessToken');
    if (token) {
      // 토큰이 있으면 헤더에 추가합니다.
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default client;