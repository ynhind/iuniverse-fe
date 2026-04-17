import { useMutation, useQueryClient } from '@tanstack/react-query';
import { authenApi } from '../api/authen.api';

export const useLoginMutation = () => {
  return useMutation({
    mutationFn: authenApi.login,
  });
};

export const useRegisterMutation = () => {
  return useMutation({
    mutationFn: authenApi.register,
  });
};

export const useLogoutMutation = () => {
  const queryClient = useQueryClient();
  
  return useMutation({
    mutationFn: authenApi.logout,
    onSuccess: () => {
      // Clear queries on logout
      queryClient.clear();
      localStorage.removeItem('accessToken');
      localStorage.removeItem('refreshToken');
    },
  });
};

export const useForgotPasswordMutation = () => {
  return useMutation({
    mutationFn: authenApi.forgotPassword,
  });
};

export const useChangePasswordMutation = () => {
  return useMutation({
    mutationFn: authenApi.changePassword,
  });
};

export const useVerifyAccountMutation = () => {
  return useMutation({
    mutationFn: authenApi.verifyAccount,
  });
};

export const useResendOtpMutation = () => {
  return useMutation({
    mutationFn: authenApi.resendOtp,
  });
};
