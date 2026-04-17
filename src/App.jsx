import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from '@/contexts/AuthContext';
import { ToastProvider } from '@/contexts/ToastContext';
import { CourseProvider } from '@/contexts/CourseContext';
import { AnnouncementProvider } from '@/contexts/AnnouncementContext';
import { Toaster } from '@/components/ui/Toast';
import { AuthLayout } from '@/components/AuthLayout';
import { MainLayout } from '@/components/MainLayout';
import { RoleRoute } from '@/components/RoleRoute';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';

const queryClient = new QueryClient();

import {
  StudentDashboard,
  StudentCourses,
  StudentCourseDetail,
  StudentSchedule,
  StudentGradebook,
} from '@/pages/student';
import {
  CourseCreator,
  TeacherCourseList,
  StudentSubmissions,
} from '@/pages/teacher';
import { ReviewQueue, Announcements } from '@/pages/admin';

import { Settings } from '@/pages/Settings';
import { UserManagement } from '@/pages/UserManagement';
import { Login } from '@/pages/Login';
import { Register } from '@/pages/Register';
import { ForgotPassword } from '@/pages/ForgotPassword';
import { ResetPassword } from '@/pages/ResetPassword';

function App() {
  return (
    <BrowserRouter>
      <QueryClientProvider client={queryClient}>
        <ToastProvider>
          <CourseProvider>
            <AnnouncementProvider>
              <AuthProvider>
                <Routes>
                  <Route element={<AuthLayout />}>
                    <Route path="/login" element={<Login />} />
                    <Route path="/register" element={<Register />} />
                    <Route
                      path="/forgot-password"
                      element={<ForgotPassword />}
                    />
                    <Route path="/reset-password" element={<ResetPassword />} />
                  </Route>

                  <Route element={<MainLayout />}>
                    {/* Student / shared */}
                    <Route
                      path="/"
                      element={
                        <RoleRoute
                          allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}
                        >
                          <StudentDashboard />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/courses"
                      element={
                        <RoleRoute
                          allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}
                        >
                          <StudentCourses />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/courses/:id"
                      element={
                        <RoleRoute
                          allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}
                        >
                          <StudentCourseDetail />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/schedule"
                      element={
                        <RoleRoute
                          allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}
                        >
                          <StudentSchedule />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/gradebook"
                      element={
                        <RoleRoute
                          allowedRoles={['STUDENT', 'TEACHER', 'ADMIN']}
                        >
                          <StudentGradebook />
                        </RoleRoute>
                      }
                    />
                    <Route path="/settings" element={<Settings />} />

                    {/* Teacher */}
                    <Route
                      path="/teacher/courses"
                      element={
                        <RoleRoute allowedRoles={['TEACHER', 'ADMIN']}>
                          <TeacherCourseList />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/create-course"
                      element={
                        <RoleRoute allowedRoles={['TEACHER', 'ADMIN']}>
                          <CourseCreator />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/teacher/submissions"
                      element={
                        <RoleRoute allowedRoles={['TEACHER', 'ADMIN']}>
                          <StudentSubmissions />
                        </RoleRoute>
                      }
                    />

                    {/* Admin */}
                    <Route
                      path="/admin/review"
                      element={
                        <RoleRoute allowedRoles={['ADMIN']}>
                          <ReviewQueue />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/admin/announcements"
                      element={
                        <RoleRoute allowedRoles={['ADMIN']}>
                          <Announcements />
                        </RoleRoute>
                      }
                    />
                    <Route
                      path="/users"
                      element={
                        <RoleRoute allowedRoles={['ADMIN']}>
                          <UserManagement />
                        </RoleRoute>
                      }
                    />
                  </Route>
                </Routes>
              </AuthProvider>
              <Toaster />
            </AnnouncementProvider>
          </CourseProvider>
        </ToastProvider>
      </QueryClientProvider>
    </BrowserRouter>
  );
}

export default App;
