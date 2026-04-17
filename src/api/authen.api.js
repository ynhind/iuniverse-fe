import axiosInstance from './configAxios';

export const authenApi = {
  login: async (data) => {
    const response = await axiosInstance.post('/auth/access-token', data);
    return response.data;
  },

  register: async (data) => {
    const response = await axiosInstance.post('/user/add', data);
    return response.data;
  },

  refreshToken: async (data) => {
    const response = await axiosInstance.post('/auth/refresh-token', data);
    return response.data;
  },

  logout: async () => {
    const response = await axiosInstance.post('/auth/logout');
    return response.data;
  },

  forgotPassword: async (email) => {
    const response = await axiosInstance.post('/auth/forgot-password', email, { 
      headers: { 'Content-Type': 'text/plain' } 
    });
    return response.data;
  },

  changePassword: async (data) => {
    const response = await axiosInstance.post('/auth/change-password', data);
    return response.data;
  },

  verifyAccount: async (data) => {
    const response = await axiosInstance.post('/auth/verify-account', data);
    return response.data;
  },

  resendOtp: async (email) => {
    const response = await axiosInstance.post(`/auth/resend-otp?email=${encodeURIComponent(email)}`);
    return response.data;
  },
};
