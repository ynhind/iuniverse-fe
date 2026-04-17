import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useLoginMutation } from '@/hooks/useAuth';
import { useToast } from '@/contexts/ToastContext';
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import { Label } from '@/components/ui/Label';
import { LogIn, User, Lock, AlertCircle, Eye, EyeOff } from 'lucide-react';

const normalizeRole = (roleValue) => {
  if (!roleValue) return 'STUDENT';

  if (typeof roleValue === 'string') {
    const raw = roleValue.trim().toUpperCase();
    if (raw === 'ADMIN') return 'ADMIN';
    if (raw === 'TEACHER') return 'TEACHER';
    if (raw === 'STUDENT') return 'STUDENT';
    return 'STUDENT';
  }

  if (typeof roleValue === 'object' && !Array.isArray(roleValue)) {
    const authority = String(roleValue.authority || roleValue.role || '')
      .trim()
      .toUpperCase();

    if (authority === 'ADMIN') return 'ADMIN';
    if (authority === 'TEACHER') return 'TEACHER';
    if (authority === 'STUDENT') return 'STUDENT';
    return 'STUDENT';
  }

  if (Array.isArray(roleValue)) {
    for (const item of roleValue) {
      const parsed = normalizeRole(item);
      if (parsed !== 'STUDENT') return parsed;
    }
    return 'STUDENT';
  }

  return 'STUDENT';
};

const decodeJwtPayload = (token) => {
  try {
    if (!token) return null;

    const parts = token.split('.');
    if (parts.length < 2) return null;

    const base64Url = parts[1];
    const base64 = base64Url.replace(/-/g, '+').replace(/_/g, '/');
    const padded = base64.padEnd(
      base64.length + ((4 - (base64.length % 4)) % 4),
      '=',
    );

    const jsonPayload = atob(padded);
    return JSON.parse(jsonPayload);
  } catch (error) {
    console.error('Decode JWT failed:', error);
    return null;
  }
};

const getRoleFromResponse = (data) => {
  // ưu tiên từ response
  const directRole =
    normalizeRole(data?.role) ||
    normalizeRole(data?.user?.role) ||
    normalizeRole(data?.authorities);

  if (directRole && directRole !== 'STUDENT') return directRole;

  // fallback từ accessToken
  const decoded = decodeJwtPayload(data?.accessToken);

  const tokenRole =
    normalizeRole(decoded?.role) ||
    normalizeRole(decoded?.authorities) ||
    normalizeRole(decoded?.authority) ||
    normalizeRole(decoded?.scope);

  return tokenRole || 'STUDENT';
};

const getUserIdFromResponse = (data) => {
  const decoded = decodeJwtPayload(data?.accessToken);

  return (
    data?.userId ||
    data?.id ||
    data?.user?.id ||
    decoded?.userId ||
    decoded?.id ||
    null
  );
};

const getDisplayNameFromResponse = (data, username) => {
  const decoded = decodeJwtPayload(data?.accessToken);
  return (
    data?.name || data?.fullName || data?.user?.name || decoded?.sub || username
  );
};

const getUsernameFromResponse = (data, fallbackUsername) => {
  const decoded = decodeJwtPayload(data?.accessToken);
  return (
    data?.username || data?.user?.username || decoded?.sub || fallbackUsername
  );
};

const getRedirectPathByRole = (role) => {
  switch (String(role || '').toUpperCase()) {
    case 'ADMIN':
      return '/admin/review';
    case 'TEACHER':
      return '/teacher/courses';
    default:
      return '/';
  }
};

export function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [errors, setErrors] = useState({});
  const { login } = useAuth();
  const loginMutation = useLoginMutation();
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();

  const validate = () => {
    const newErrors = {};

    if (!username.trim()) {
      newErrors.username = 'Username is required';
    }

    if (!password) {
      newErrors.password = 'Password is required';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!validate()) return;

    loginMutation.mutate(
      {
        username: username.trim(),
        password,
        platform: 'WEB',
        version: 'v1.2.9',
        deviceToken: 'x-token',
      },
      {
        onSuccess: (data) => {
          const role = getRoleFromResponse(data);
          const userId = getUserIdFromResponse(data);
          const resolvedUsername = getUsernameFromResponse(
            data,
            username.trim(),
          );
          const displayName = getDisplayNameFromResponse(
            data,
            resolvedUsername,
          );

          const userData = {
            id: userId,
            name: displayName,
            username: resolvedUsername,
            role,
            avatar: `https://api.dicebear.com/7.x/avataaars/svg?seed=${resolvedUsername}`,
          };

          login(userData, data?.accessToken, data?.refreshToken);

          toast({
            title: 'Welcome back!',
            description: `Logged in successfully as ${role}.`,
            variant: 'success',
          });

          const fromPath = location.state?.from?.pathname;
          const safeRedirect =
            fromPath && fromPath !== '/login'
              ? fromPath
              : getRedirectPathByRole(role);

          navigate(safeRedirect, { replace: true });
        },
        onError: (err) => {
          toast({
            title: 'Login Failed',
            description:
              err?.response?.data?.message || 'Invalid username or password.',
            variant: 'error',
          });
        },
      },
    );
  };

  return (
    <div className="animate-in fade-in zoom-in-95 duration-500">
      <Card className="glass border-white/40 shadow-2xl shadow-indigo-500/10 backdrop-blur-2xl">
        <CardHeader className="space-y-3 pb-6 text-center">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-tr from-primary to-secondary shadow-lg shadow-primary/30">
            <LogIn className="h-6 w-6 text-white" />
          </div>

          <div className="space-y-1">
            <CardTitle className="text-3xl font-bold tracking-tight text-slate-900">
              Welcome back
            </CardTitle>
            <CardDescription className="text-base text-slate-500">
              Enter your credentials to access your account
            </CardDescription>
          </div>
        </CardHeader>

        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-5">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label
                  htmlFor="username"
                  className="text-slate-700 font-medium"
                >
                  Username
                </Label>

                <div className="relative">
                  <User className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="username"
                    type="text"
                    placeholder="Enter your username"
                    className={`h-12 bg-white/50 pl-10 border-slate-200/60 focus:bg-white/80 transition-all ${
                      errors.username
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : ''
                    }`}
                    value={username}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      if (errors.username) {
                        setErrors({ ...errors, username: null });
                      }
                    }}
                  />
                </div>

                {errors.username && (
                  <p className="flex items-center gap-1.5 text-sm text-red-500 animate-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.username}
                  </p>
                )}
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label
                    htmlFor="password"
                    className="text-slate-700 font-medium"
                  >
                    Password
                  </Label>
                  <Link
                    to="/forgot-password"
                    className="text-sm font-medium text-primary hover:text-secondary transition-colors"
                  >
                    Forgot password?
                  </Link>
                </div>

                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400" />
                  <Input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    placeholder="••••••••"
                    className={`h-12 bg-white/50 pl-10 pr-10 border-slate-200/60 focus:bg-white/80 transition-all ${
                      errors.password
                        ? 'border-red-300 focus:border-red-500 focus:ring-red-200'
                        : ''
                    }`}
                    value={password}
                    onChange={(e) => {
                      setPassword(e.target.value);
                      if (errors.password) {
                        setErrors({ ...errors, password: null });
                      }
                    }}
                  />

                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 flex h-5 w-5 -translate-y-1/2 items-center justify-center border-none bg-transparent p-0 text-slate-400 transition-colors hover:text-slate-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>

                {errors.password && (
                  <p className="flex items-center gap-1.5 text-sm text-red-500 animate-in slide-in-from-top-1">
                    <AlertCircle className="h-4 w-4" />
                    {errors.password}
                  </p>
                )}
              </div>
            </div>

            <Button
              type="submit"
              className="w-full h-12 rounded-xl bg-gradient-to-r from-primary to-secondary text-base font-semibold shadow-lg shadow-primary/25 transition-all active:scale-[0.98] hover:opacity-90"
              disabled={loginMutation.isPending}
            >
              {loginMutation.isPending ? (
                <span className="flex items-center gap-2">
                  <svg
                    className="h-5 w-5 animate-spin text-white"
                    fill="none"
                    viewBox="0 0 24 24"
                  >
                    <circle
                      className="opacity-25"
                      cx="12"
                      cy="12"
                      r="10"
                      stroke="currentColor"
                      strokeWidth="4"
                    />
                    <path
                      className="opacity-75"
                      fill="currentColor"
                      d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                    />
                  </svg>
                  Signing in...
                </span>
              ) : (
                'Sign In'
              )}
            </Button>
          </form>
        </CardContent>

        <CardFooter className="flex flex-col space-y-4 pb-8">
          <div className="relative w-full">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-200/60"></div>
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="glass-panel rounded-full bg-transparent px-2 text-slate-500">
                Or continue with
              </span>
            </div>
          </div>

          <div className="grid w-full grid-cols-2 gap-4">
            <Button
              variant="outline"
              className="h-11 bg-white/50 border-slate-200 hover:bg-white/80"
              type="button"
            >
              Google
            </Button>

            <Button
              variant="outline"
              className="h-11 bg-white/50 border-slate-200 hover:bg-white/80"
              type="button"
            >
              GitHub
            </Button>
          </div>

          <div className="mt-4 text-center text-sm text-slate-500">
            Don't have an account?{' '}
            <Link
              to="/register"
              className="font-semibold text-primary hover:text-secondary transition-colors"
            >
              Sign up
            </Link>
          </div>
        </CardFooter>
      </Card>
    </div>
  );
}
