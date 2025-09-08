import axios from 'axios';

const axiosClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL || '',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request interceptor
axiosClient.interceptors.request.use(
  config => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('accessToken') : null;
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  error => Promise.reject(error)
);

// Response interceptor
axiosClient.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;
    if (error.response?.status === 401) {
      console.warn('Unauthorized, redirecting to login...');
      const refreshToken = typeof window !== 'undefined' ? localStorage.getItem('refreshToken') : null;
      if (!refreshToken) {
        console.warn('No refresh token available. Redirecting to login...');
        return Promise.reject(error);
      }

      try {
        const { status, data } = await axiosClient.post(`/v1/auth/refresh`, {
          refreshToken,
        });

        if (status !== 200) {
          return Promise.reject("Cannot refersh token");
        }

        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('refreshToken', data.refreshToken);

        axiosClient.defaults.headers.Authorization = `Bearer ${data.accessToken}`;
        // Retry
        return axiosClient(originalRequest);
      }
      catch (err) {
        console.error('Token refresh failed:', err);
        return Promise.reject(err);
      }
    }

    if (error.response?.status === 500) {
      console.error('Server error:', error.response.data);
    }

    return Promise.reject(error);
  }
);

export default axiosClient;
