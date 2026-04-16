import React, { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
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

const MOCK_COURSES = [
  {
    id: "cs101",
    title: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Smith",
    students: 120,
    duration: "12 weeks",
    status: "Active",
    color: "bg-blue-500",
  },
  {
    id: "math201",
    title: "Linear Algebra",
    code: "MATH201",
    instructor: "Prof. Johnson",
    students: 85,
    duration: "10 weeks",
    status: "Active",
    color: "bg-indigo-500",
  },
  {
    id: "eng102",
    title: "Academic Writing",
    code: "ENG102",
    instructor: "Dr. Williams",
    students: 200,
    duration: "8 weeks",
    status: "Upcoming",
    color: "bg-emerald-500",
  },
  {
    id: "phy101",
    title: "Physics I: Mechanics",
    code: "PHY101",
    instructor: "Dr. Brown",
    students: 150,
    duration: "14 weeks",
    status: "Active",
    color: "bg-amber-500",
  },
];

export function StudentCourses() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");

  const filteredCourses = MOCK_COURSES.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()),
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

        <div className="relative w-full sm:w-72">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
          <Input
            type="search"
            placeholder="Search courses..."
            className="pl-9 bg-white/50 border-slate-200/60 shadow-sm rounded-2xl focus-visible:ring-primary/20"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {filteredCourses.map((course) => (
          <Card
            key={course.id}
            className="group glass border-none shadow-lg shadow-slate-200/50 hover:-translate-y-1 transition-all duration-300 overflow-hidden flex flex-col"
          >
            <div className={`h-2 w-full ${course.color}`} />
            <CardHeader className="pb-4">
              <div className="flex items-center justify-between mb-2">
                <Badge
                  className={`rounded-full px-2 py-1 text-xs font-medium border-none ${
                    course.status === "Active"
                      ? "bg-primary text-white"
                      : "bg-gray-200 text-yellow-400"
                  }`}
                >
                  {course.status}
                </Badge>
                <span className="text-xs font-bold tracking-wider text-slate-400 uppercase">
                  {course.code}
                </span>
              </div>
              <CardTitle className="font-display text-xl leading-tight text-slate-900 group-hover:text-primary transition-colors line-clamp-2">
                {course.title}
              </CardTitle>
              <CardDescription className="flex items-center gap-1.5 mt-2 text-sm text-slate-500">
                <GraduationCap className="h-4 w-4" />
                {course.instructor}
              </CardDescription>
            </CardHeader>
            <CardContent className="flex-1 pb-4">
              <div className="flex items-center gap-4 text-sm text-slate-500 bg-slate-50/50 rounded-xl p-3">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700">
                    {course.students}
                  </span>
                </div>
                <div className="w-px h-4 bg-slate-200" />
                <div className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4 text-slate-400" />
                  <span className="font-medium text-slate-700">
                    {course.duration}
                  </span>
                </div>
              </div>
            </CardContent>
            <CardFooter className="pt-0 pb-6 px-6">
              <Button
                asChild
                variant="default"
                className="w-full rounded-xl shadow-md shadow-primary/20"
              >
                <Link to={`/courses/${course.id}`}>Go to Course</Link>
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>
    </div>
  );
}
