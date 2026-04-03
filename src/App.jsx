import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { Toaster } from "@/components/ui/Toast";
import { AuthLayout } from "@/components/AuthLayout";
import { MainLayout } from "@/components/MainLayout";
import {
  StudentDashboard,
  StudentCourses,
  StudentCourseDetail,
  StudentSchedule,
  StudentGradebook,
} from "@/pages/student";
import { CourseCreator } from "@/pages/teacher";
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
              <Route path="/" element={<StudentDashboard />} />
              <Route path="/courses" element={<StudentCourses />} />
              <Route path="/courses/:id" element={<StudentCourseDetail />} />
              <Route path="/schedule" element={<StudentSchedule />} />
              <Route path="/gradebook" element={<StudentGradebook />} />
              <Route path="/create-course" element={<CourseCreator />} />
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
