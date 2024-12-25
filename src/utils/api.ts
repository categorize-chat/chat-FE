import axios, { AxiosHeaders } from 'axios';

const axiosApi = (extraHeader: Partial<AxiosHeaders>) =>
  axios.create({
    baseURL: '/api',
    withCredentials: true,
    headers: {
      'Access-Control-Allow-Credentials': true,
      ...(extraHeader as AxiosHeaders),
    },
  });

export const API = {
  json: axiosApi({
    'Content-Type': 'application/json',
  }),
};

// Helper function to get tokens from localStorage
const getAccessToken = () => localStorage.getItem('accessToken');
const getRefreshToken = () => localStorage.getItem('refreshToken');

// Refresh token function
const refreshAccessToken = async () => {
  try {
    const refreshToken = getRefreshToken();
    if (!refreshToken) throw new Error('No refresh token available');

    const response = await axios.post('/api/oauth/refresh', {
      refreshToken,
    });
    const { accessToken } = response.data;
    localStorage.setItem('accessToken', accessToken);
    return accessToken;
  } catch (error) {
    console.error('Failed to refresh access token:', error);
    throw error;
  }
};

// Axios interceptor to include accessToken in headers
API.json.interceptors.request.use(
  config => {
    const token = getAccessToken();
    if (token) {
      config.headers.set('Authorization', `Bearer ${token}`);
    }
    return config;
  },
  error => Promise.reject(error),
);

// Axios interceptor to handle token expiration and retry request
API.json.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    // Check if error is due to token expiration and retry hasn't been done yet
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;
      try {
        const newAccessToken = await refreshAccessToken();
        originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
        return API.json(originalRequest); // Retry the request with the new token
      } catch (refreshError) {
        console.error('Token refresh failed:', refreshError);
        return Promise.reject(refreshError);
      }
    }
    return Promise.reject(error);
  },
);
