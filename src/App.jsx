import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { Toaster } from "@/components/ui/Toast";
import { MainLayout } from "@/components/MainLayout";
import { AuthLayout } from "@/components/AuthLayout";
import { Dashboard } from "@/pages/Dashboard";
import { Settings } from "@/pages/Settings";
import { UserManagement } from "@/pages/UserManagement";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { ForgotPassword } from "@/pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <AuthProvider>
          <Routes>
            <Route element={<AuthLayout />}>
              <Route path="/login" element={<Login />} />
              <Route path="/register" element={<Register />} />
              <Route path="/forgot-password" element={<ForgotPassword />} />
            </Route>
            <Route element={<MainLayout />}>
              <Route path="/" element={<Dashboard />} />
              <Route path="/settings" element={<Settings />} />
              <Route path="/users" element={<UserManagement />} />
            </Route>
          </Routes>
        </AuthProvider>
        <Toaster />
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
