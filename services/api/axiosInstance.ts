import axios from "axios";

const baseURL = process.env.EXPO_PUBLIC_API_BASE_URL; 

const axiosInstance = axios.create({
  baseURL: `${baseURL}`,
  headers: {
    "Content-Type": "application/json",
  },
  timeout: 10000,
});

axiosInstance.interceptors.response.use(
  (res) => res,
  (err) => {
    console.error("API Error:", err.response?.data || err.message);
    return Promise.reject(err);
  }
);

export default axiosInstance;
