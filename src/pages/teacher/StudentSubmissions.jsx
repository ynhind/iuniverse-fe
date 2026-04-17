import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, CheckCircle, XCircle, Clock, ChevronRight, Filter, BookOpen } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useMyCoursesQuery, useCourseStudentsQuery } from "@/hooks/useTeacher";

export function StudentSubmissions() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const { data: coursesData } = useMyCoursesQuery();
  const courses = coursesData?.content || coursesData || [];
  
  const [selectedCourseId, setSelectedCourseId] = useState("");

  // Set first course as default when loaded
  React.useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
       setSelectedCourseId(courses[0].id || courses[0].courseID);
    }
  }, [courses, selectedCourseId]);

  const { data: studentsData, isLoading } = useCourseStudentsQuery(selectedCourseId);
  const students = studentsData?.content || studentsData || [];

  const filteredStudents = students.filter((student) => {
    return student.name?.toLowerCase().includes(searchTerm.toLowerCase()) || 
           student.email?.toLowerCase().includes(searchTerm.toLowerCase());
  });

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Enrolled Students & Activity</h1>
          <p className="text-slate-500 mt-1">Review the students participating in your courses.</p>
        </div>
      </div>

      <Card className="glass border-white/40 shadow-xl overflow-hidden">
        <CardHeader className="bg-white/50 border-b border-slate-200/50 pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex w-full md:w-auto items-center gap-2">
              <BookOpen className="text-slate-400 h-5 w-5" />
              <select 
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl h-10 px-3 text-sm focus:ring-primary/20"
              >
                <option value="" disabled>Select Course to view students</option>
                {courses.map(c => (
                  <option key={c.id || c.courseID} value={c.id || c.courseID}>{c.title || c.courseName}</option>
                ))}
              </select>
            </div>
            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search students or sets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/70 border-slate-200"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
            </div>
          </div>
        </CardHeader>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200/50">
              <tr>
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">Email Address</th>
                <th className="px-6 py-4 font-medium text-right">View Progress</th>
              </tr>
            </thead>
            <tbody>
              {isLoading ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                     Loading students...
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="3" className="px-6 py-12 text-center text-slate-500">
                    No students currently enrolled in this course.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((sub) => (
                  <tr key={sub.id || sub.userId} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {(sub.name || "U").charAt(0)}
                        </div>
                        {sub.name || "Unnamed Student"}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="text-slate-500">{sub.email || "No email"}</div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                        View Progress
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
