import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";

export function AuthLayout() {
  const { user, accessToken } = useAuth();

  if (user && accessToken) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-background p-4 sm:p-8">
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob bg-indigo-200 w-96 h-96 top-[-10%] left-[-10%]"></div>
        <div className="blob bg-purple-200 w-[30rem] h-[30rem] bottom-[-20%] right-[-10%] animation-delay-2000"></div>
        <div className="blob bg-blue-200 w-80 h-80 top-[40%] left-[30%] opacity-20 animation-delay-4000"></div>
      </div>

      <div className="relative z-10 w-full max-w-md">
        <Outlet />
      </div>
    </div>
  );
}