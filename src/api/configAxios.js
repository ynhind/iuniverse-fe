import axios from 'axios';

const baseURL = import.meta.env.VITE_API_URL || '/api';

const axiosInstance = axios.create({
  baseURL,
  timeout: 10000,
});

// ── Request interceptor: attach access token ──────────────────────────────────
axiosInstance.interceptors.request.use(
  (config) => {
    const accessToken = localStorage.getItem('accessToken');
    if (accessToken && config.headers) {
      config.headers.Authorization = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// ── Refresh-token queue (prevents multiple simultaneous refresh calls) ─────────
let isRefreshing = false;
let pendingQueue = []; // [{ resolve, reject }]

const processQueue = (error, token = null) => {
  pendingQueue.forEach(({ resolve, reject }) => {
    if (error) reject(error);
    else resolve(token);
  });
  pendingQueue = [];
};

// ── Response interceptor: auto-refresh on 401 ────────────────────────────────
axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    // Only intercept 401 that haven't been retried yet
    if (error.response?.status !== 401 || originalRequest._retry) {
      return Promise.reject(error);
    }

    const refreshToken = localStorage.getItem('refreshToken');

    // No refresh token → log out immediately
    if (!refreshToken) {
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
      return Promise.reject(error);
    }

    // If a refresh is already in-flight, queue this request
    if (isRefreshing) {
      return new Promise((resolve, reject) => {
        pendingQueue.push({ resolve, reject });
      })
        .then((newToken) => {
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return axiosInstance(originalRequest);
        })
        .catch((err) => Promise.reject(err));
    }

    // Mark as retried and start refresh
    originalRequest._retry = true;
    isRefreshing = true;

    try {
      // Use a plain axios instance to avoid triggering this interceptor again
      const { data } = await axios.post(`${baseURL}/auth/refresh-token`, {
        refreshToken,
      });

      // Support multiple response shapes: { accessToken } | { token } | { data: { accessToken } }
      const newAccessToken =
        data?.accessToken ||
        data?.token ||
        data?.data?.accessToken ||
        data?.data?.token;

      const newRefreshToken =
        data?.refreshToken ||
        data?.data?.refreshToken;

      if (!newAccessToken) {
        throw new Error('Refresh response did not include a new access token');
      }

      // Persist new tokens
      localStorage.setItem('accessToken', newAccessToken);
      if (newRefreshToken) {
        localStorage.setItem('refreshToken', newRefreshToken);
      }

      // Notify AuthContext (or any listener) that tokens changed
      window.dispatchEvent(
        new CustomEvent('tokenRefreshed', {
          detail: { accessToken: newAccessToken, refreshToken: newRefreshToken },
        })
      );

      // Unblock the queue
      processQueue(null, newAccessToken);

      // Retry the original request with the new token
      originalRequest.headers.Authorization = `Bearer ${newAccessToken}`;
      return axiosInstance(originalRequest);
    } catch (err) {
      processQueue(err, null);

      // Refresh failed → clear session and redirect
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
      localStorage.removeItem('user');

      window.dispatchEvent(new CustomEvent('authExpired'));
      window.location.href = '/login';

      return Promise.reject(err);
    } finally {
      isRefreshing = false;
    }
  }
);

export default axiosInstance;
