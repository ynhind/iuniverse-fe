import React from "react";
import { Outlet, Navigate } from "react-router-dom";
import { Sidebar } from "./Sidebar";
import { Header } from "./Header";
import { useAuth } from "@/contexts/AuthContext";

export function MainLayout() {
  const { user } = useAuth();

  if (!user) {
    return <Navigate to="/" replace />;
  }

  return (
    <div className="relative flex h-screen overflow-hidden bg-background">
      {/* Atmospheric Background */}
      <div className="pointer-events-none absolute inset-0 overflow-hidden">
        <div className="blob bg-indigo-200 w-96 h-96 top-[-10%] left-[-10%]"></div>
        <div className="blob bg-purple-200 w-[30rem] h-[30rem] bottom-[-20%] right-[-10%] animation-delay-2000"></div>
        <div className="blob bg-blue-200 w-80 h-80 top-[40%] left-[30%] opacity-20 animation-delay-4000"></div>
      </div>

      <Sidebar />
      <div className="relative z-10 flex flex-1 flex-col overflow-hidden">
        <Header />
        <main className="flex-1 overflow-y-auto p-6 md:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
