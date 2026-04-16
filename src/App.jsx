import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { ToastProvider } from "@/contexts/ToastContext";
import { CourseProvider } from "@/contexts/CourseContext";
import { AnnouncementProvider } from "@/contexts/AnnouncementContext";
import { Toaster } from "@/components/ui/Toast";
import { AuthLayout } from "@/components/AuthLayout";
import { MainLayout } from "@/components/MainLayout";
import { RoleRoute } from "@/components/RoleRoute";

import {
  StudentDashboard,
  StudentCourses,
  StudentCourseDetail,
  StudentSchedule,
  StudentGradebook,
} from "@/pages/student";
import { 
  CourseCreator, 
  TeacherCourseList, 
  StudentSubmissions 
} from "@/pages/teacher";
import { 
  ReviewQueue, 
  Announcements 
} from "@/pages/admin";

import { Settings } from "@/pages/Settings";
import { UserManagement } from "@/pages/UserManagement";
import { Login } from "@/pages/Login";
import { Register } from "@/pages/Register";
import { ForgotPassword } from "@/pages/ForgotPassword";

function App() {
  return (
    <BrowserRouter>
      <ToastProvider>
        <CourseProvider>
          <AnnouncementProvider>
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
                  <Route path="/settings" element={<Settings />} />

                  {/* Teacher Routes */}
                  <Route path="/teacher/courses" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><TeacherCourseList /></RoleRoute>} />
                  <Route path="/create-course" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><CourseCreator /></RoleRoute>} />
                  <Route path="/teacher/submissions" element={<RoleRoute allowedRoles={["Teacher", "Admin"]}><StudentSubmissions /></RoleRoute>} />

                  {/* Admin Routes */}
                  <Route path="/admin/review" element={<RoleRoute allowedRoles={["Admin"]}><ReviewQueue /></RoleRoute>} />
                  <Route path="/admin/announcements" element={<RoleRoute allowedRoles={["Admin"]}><Announcements /></RoleRoute>} />
                  <Route path="/users" element={<RoleRoute allowedRoles={["Admin"]}><UserManagement /></RoleRoute>} />
                </Route>
              </Routes>
            </AuthProvider>
            <Toaster />
          </AnnouncementProvider>
        </CourseProvider>
      </ToastProvider>
    </BrowserRouter>
  );
}

export default App;
