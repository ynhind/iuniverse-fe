import { BrowserRouter, Routes, Route } from "react-router-dom";
import { AuthProvider } from "@/contexts/AuthContext";
import { MainLayout } from "@/components/MainLayout";
import {
  StudentDashboard,
  StudentCourses,
  StudentCourseDetail,
  StudentSchedule,
  StudentGradebook,
} from "@/pages/student";
import { Settings } from "@/pages/Settings";
import { UserManagement } from "@/pages/UserManagement";

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Routes>
          <Route element={<MainLayout />}>
            <Route path="/" element={<StudentDashboard />} />
            <Route path="/courses" element={<StudentCourses />} />
            <Route path="/courses/:id" element={<StudentCourseDetail />} />
            <Route path="/schedule" element={<StudentSchedule />} />
            <Route path="/gradebook" element={<StudentGradebook />} />
            <Route path="/settings" element={<Settings />} />
            <Route path="/users" element={<UserManagement />} />
          </Route>
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
