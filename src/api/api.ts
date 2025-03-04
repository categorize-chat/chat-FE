import axios, { AxiosHeaders, AxiosInstance } from 'axios';
import { TApiResponse } from './type';
import Swal from 'sweetalert2';

const getAccessToken = () => localStorage.getItem('accessToken');

const refreshAccessToken = async () => {
  try {
    const response = await axios.post('/api/oauth/refresh');
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw error;
  }
};

const axiosApi = (extraHeader: Partial<AxiosHeaders>): AxiosInstance => {
  const instance = axios.create({
    // baseURL: `${import.meta.env.VITE_SERVER_URL}`,
    baseURL: `/api`, // proxy 사용
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Credentials': true,
      ...(extraHeader as AxiosHeaders),
    },
  });

  // 요청 인터셉터 설정
  // 매 응답 시 accessToken 추가
  instance.interceptors.request.use(
    config => {
      const token = getAccessToken();
      if (token) {
        config.headers.set('Authorization', `Bearer ${token}`);
      }
      return config;
    },
    error => Promise.reject(error),
  );

  // 응답 인터셉터 설정
  instance.interceptors.response.use(
    response => response,
    async error => {
      const originalRequest = error.config;
      // Check if error is due to token expiration and retry hasn't been done yet
      if (error.response?.status === 401 && !originalRequest._retry) {
        originalRequest._retry = true;
        try {
          const newAccessToken = await refreshAccessToken();
          originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
          return instance(originalRequest); // Retry the request with the new token
        } catch (refreshError) {
          console.error('Token refresh failed:', refreshError);
          return Promise.reject(refreshError);
        }
      }
      return Promise.reject(error);
    },
  );

  return instance;
};

export const API = {
  json: axiosApi({
    'Content-Type': 'application/json',
  }),
};

// ************ 핸들러 ************

export const defaultResponseHandler = <
  TResponse extends TApiResponse<any>,
>(res: {
  data: TResponse;
}): TResponse['result'] => {
  const response = res.data;
  if (response.code !== 200) {
    throw new Error(response.message);
  }

  return response.result;
};

export const defaultAxiosErrorHandler = async (error: any) => {
  const errorMessage = error.response?.data?.message || error.message;

  await Swal.fire({
    title: errorMessage || '예상치 못한 에러가 발생했습니다',
    text: '다시 시도해주세요.',
    icon: 'error',
    customClass: {
      popup: 'swal2-highest-zindex',
    },
  });

  return Promise.reject(error);
};
