import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { useToast } from "@/contexts/ToastContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { Search, BookOpen, Clock, Users, GraduationCap } from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";

import { studentApi } from "@/api/student.api";

export function StudentCourses() {
  const { user } = useAuth();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [courses, setCourses] = useState([]);
  const [joinCode, setJoinCode] = useState("");
  const [isLoading, setIsLoading] = useState(true);

  React.useEffect(() => {
    fetchCourses();
  }, []);

  const fetchCourses = async () => {
    try {
      setIsLoading(true);
      const res = await studentApi.getMyCourses();
      // Assuming response contains data array
      setCourses(res?.data || res || []);
    } catch (error) {
      toast({ title: "Error", description: "Failed to fetch courses", variant: "error" });
      console.error(error);
    } finally {
      setIsLoading(false);
    }
  };

  const handleEnroll = async () => {
    if (!joinCode) {
      toast({ title: "Validation Error", description: "Please enter a join code", variant: "error" });
      return;
    }
    try {
      await studentApi.enrollCourse(joinCode);
      toast({ title: "Success", description: "Enrolled successfully!", variant: "success" });
      setJoinCode("");
      fetchCourses();
    } catch (error) {
      const msg = error?.response?.data?.message || "Failed to enroll course";
      toast({ title: "Enrollment Failed", description: msg, variant: "error" });
      console.error(error);
    }
  };

  const filteredCourses = courses.filter(
    (course) =>
      course.courseName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.title?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.joinCode?.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
        <div>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-900">
            My Courses
          </h2>
          <p className="text-lg text-slate-500 mt-1">
            Browse and manage your enrolled courses.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-4 w-full sm:w-auto">
          <div className="relative w-full sm:w-64">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              type="search"
              placeholder="Search courses..."
              className="pl-9 bg-white/50 border-slate-200/60 shadow-sm rounded-2xl focus-visible:ring-primary/20"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
          <div className="flex gap-2 w-full sm:w-auto">
            <Input
              placeholder="Join Code"
              className="w-full sm:w-32 bg-white/50 border-slate-200/60 shadow-sm rounded-2xl focus-visible:ring-primary/20"
              value={joinCode}
              onChange={(e) => setJoinCode(e.target.value)}
            />
            <Button onClick={handleEnroll} className="rounded-2xl shadow-md shadow-primary/20 shrink-0">
              Enroll
            </Button>
          </div>
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {isLoading ? (
          <div className="col-span-full text-center text-slate-500 py-10">Loading courses...</div>
        ) : filteredCourses.length === 0 ? (
          <div className="col-span-full text-center text-slate-500 py-10">No courses found.</div>
        ) : filteredCourses.map((course) => (
          <Card
            key={course.id || course.courseID}
            className="group glass border-none shadow-lg shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className={`h-2 w-full bg-blue-500`} />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  className={`rounded-full px-2 py-1 text-xs font-medium border-none bg-primary text-white`}
                >
                  Active
                </Badge>
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  {course.joinCode || course.code}
                </span>
              </div>
              <CardTitle className="font-display text-xl leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                {course.courseName || course.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
                <GraduationCap className="h-4 w-4" />
                {course.instructor || "Instructor"}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
              <div className="flex items-center gap-4 text-sm text-slate-500 bg-slate-50/50 rounded-xl p-3">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700">
                    {course.students || 0}
                  </span>
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700">
                    {course.duration || "12 weeks"}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-6 px-6">
              <Link
                to={`/courses/${course.id || course.courseID}`}
                className="w-full inline-flex items-center justify-center rounded-xl shadow-md shadow-primary/20 bg-primary text-white font-medium h-10 px-4 py-2 text-sm hover:bg-primary/90 transition-colors"
              >
                Go to Course
              </Link>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
