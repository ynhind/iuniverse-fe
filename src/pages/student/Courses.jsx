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
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/Tabs";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/Dialog";
import {
  Search,
  BookOpen,
  Clock,
  Users,
  GraduationCap,
  LogIn,
} from "lucide-react";
import { Link } from "react-router-dom";
import { Badge } from "@/components/ui/Badge";

const ALL_COURSES = [
  {
    id: "cs101",
    title: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Smith",
    students: 120,
    duration: "12 weeks",
    status: "Active",
    color: "bg-blue-500",
    enrollCode: "CS101",
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
    enrollCode: "MATH201",
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
    enrollCode: "ENG102",
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
    enrollCode: "PHY101",
  },
  {
    id: "py301",
    title: "Python Advanced",
    code: "PY301",
    instructor: "Prof. Chen",
    students: 95,
    duration: "10 weeks",
    status: "Active",
    color: "bg-rose-500",
    enrollCode: "PY301",
  },
];

export function StudentCourses() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [enrolledCourseIds, setEnrolledCourseIds] = useState({
    cs101: true,
    math201: true,
    eng102: true,
    phy101: true,
  });
  const [enrollCode, setEnrollCode] = useState("");
  const [enrollError, setEnrollError] = useState("");
  const [enrollSuccess, setEnrollSuccess] = useState("");

  const enrolledCourses = ALL_COURSES.filter((c) => enrolledCourseIds[c.id]);
  const catalogCourses = ALL_COURSES.filter((c) => !enrolledCourseIds[c.id]);

  const filteredEnrolled = enrolledCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const filteredCatalog = catalogCourses.filter(
    (course) =>
      course.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      course.code.toLowerCase().includes(searchTerm.toLowerCase()),
  );

  const handleEnroll = () => {
    setEnrollError("");
    setEnrollSuccess("");

    const courseToEnroll = ALL_COURSES.find(
      (c) => c.enrollCode.toUpperCase() === enrollCode.toUpperCase(),
    );

    if (!courseToEnroll) {
      setEnrollError("Invalid enrollment code. Please check and try again.");
      return;
    }

    if (enrolledCourseIds[courseToEnroll.id]) {
      setEnrollError("You are already enrolled in this course.");
      return;
    }

    setEnrolledCourseIds((prev) => ({
      ...prev,
      [courseToEnroll.id]: true,
    }));

    setEnrollSuccess(`Successfully enrolled in ${courseToEnroll.title}!`);
    setEnrollCode("");
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col justify-between gap-6 sm:flex-row sm:items-center bg-white/50 p-6 rounded-3xl border border-slate-100 shadow-sm">
        <div>
          <h2 className="font-display text-4xl font-extrabold tracking-tight text-slate-900 drop-shadow-sm">
            My Courses
          </h2>
          <p className="text-lg text-slate-500 mt-2 font-medium">
            Browse your catalog and manage enrolled classes.
          </p>
        </div>

        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4">
          <div className="relative w-full sm:w-80">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-slate-400" />
            <Input
              type="search"
              placeholder="Search courses by name or code..."
              className="pl-11 pr-4 py-6 bg-white border-slate-200/80 shadow-sm rounded-2xl focus-visible:ring-primary/20 text-base"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>

          <Dialog>
            <DialogTrigger asChild>
              <Button
                onClick={() => setEnrollCode("")}
                className="rounded-2xl py-6 px-8 shadow-lg shadow-primary/20 bg-primary hover:bg-primary/95 text-white font-semibold text-base whitespace-nowrap transition-all hover:scale-[1.02]"
              >
                <LogIn className="w-5 h-5 mr-3" />
                Join with Code
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[480px] p-0 overflow-hidden bg-white border-0 shadow-2xl rounded-3xl">
              <div className="bg-gradient-to-b from-primary/10 to-transparent p-6 pb-2 text-center">
                <div className="w-16 h-16 bg-white rounded-2xl shadow-sm flex items-center justify-center mx-auto mb-4 border border-primary/20 text-primary">
                  <LogIn className="w-8 h-8" />
                </div>
                <DialogTitle className="text-2xl font-bold text-slate-900">
                  Join a Class
                </DialogTitle>
                <DialogDescription className="text-base text-slate-500 mt-2 hidden sm:block">
                  Enter the course code provided by your instructor.
                </DialogDescription>
              </div>

              <div className="p-6 space-y-5">
                <div>
                  <label className="text-sm font-bold text-slate-700 uppercase tracking-wide mb-2 block">
                    Class Code
                  </label>
                  <Input
                    placeholder="e.g., CS101, MATH201"
                    value={enrollCode}
                    onChange={(e) => {
                      setEnrollCode(e.target.value.toUpperCase());
                      setEnrollError("");
                      setEnrollSuccess("");
                    }}
                    className="rounded-xl py-6 text-center text-lg font-mono font-bold tracking-widest uppercase border-slate-200 focus-visible:ring-primary/20 bg-slate-50"
                  />
                  <p className="text-xs text-slate-500 mt-3 text-center">
                    Sample codes:{" "}
                    <span className="font-mono bg-slate-100 px-1.5 rounded text-slate-700">
                      CS101
                    </span>
                    ,{" "}
                    <span className="font-mono bg-slate-100 px-1.5 rounded text-slate-700">
                      MATH201
                    </span>
                  </p>
                </div>

                {enrollError && (
                  <div className="bg-red-50/80 border border-red-100 text-red-600 p-4 rounded-xl text-sm font-medium text-center flex flex-col items-center justify-center gap-1 animate-in zoom-in-95 duration-200">
                    {enrollError}
                  </div>
                )}
                {enrollSuccess && (
                  <div className="bg-emerald-50/80 border border-emerald-100 text-emerald-600 p-4 rounded-xl text-sm font-medium text-center flex flex-col items-center justify-center gap-1 animate-in zoom-in-95 duration-200">
                    {enrollSuccess}
                  </div>
                )}
              </div>

              <div className="p-4 pt-0">
                <Button
                  onClick={handleEnroll}
                  className="w-full rounded-xl py-6 font-bold text-base shadow-md shadow-primary/20 bg-primary hover:bg-primary/95 text-white transition-all active:scale-[0.98]"
                >
                  Confirm Registration
                </Button>
              </div>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      <Tabs defaultValue="enrolled" className="w-full">
        <div className="flex justify-center sm:justify-start mb-6">
          <TabsList className="inline-flex h-auto items-center justify-center rounded-2xl bg-white p-1.5 text-slate-500 shadow-[0_2px_10px_-3px_rgba(6,81,237,0.1)] border border-slate-100">
            <TabsTrigger
              value="enrolled"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-8 py-3 text-sm font-bold ring-offset-white transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              My Enrolled ({enrolledCourses.length})
            </TabsTrigger>
            <TabsTrigger
              value="catalog"
              className="inline-flex items-center justify-center whitespace-nowrap rounded-xl px-8 py-3 text-sm font-bold ring-offset-white transition-all duration-300 focus-visible:outline-none disabled:pointer-events-none disabled:opacity-50 data-[state=active]:bg-primary data-[state=active]:text-white data-[state=active]:shadow-md"
            >
              Course Catalog ({catalogCourses.length})
            </TabsTrigger>
          </TabsList>
        </div>

        <TabsContent
          value="enrolled"
          className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          {filteredEnrolled.length === 0 ? (
            <Card className="glass border-none shadow-lg shadow-slate-200/50">
              <CardContent className="py-12">
                <div className="text-center">
                  <BookOpen className="h-12 w-12 mx-auto text-slate-300 mb-4" />
                  <p className="text-slate-500">No enrolled courses yet.</p>
                  <p className="text-sm text-slate-400 mt-1">
                    Browse the catalog to enroll in your first course.
                  </p>
                </div>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
              {filteredEnrolled.map((course) => (
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
          )}
        </TabsContent>

        <TabsContent
          value="catalog"
          className="mt-8 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
            {filteredCatalog.map((course) => (
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
                <CardFooter className="pt-0 pb-6 px-6 flex gap-2">
                  <Dialog>
                    <DialogTrigger asChild>
                      <Button
                        variant="outline"
                        className="flex-1 rounded-xl"
                        onClick={() => setEnrollCode("")}
                      >
                        <LogIn className="mr-2 h-4 w-4" />
                        Enroll
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-[425px]">
                      <DialogHeader>
                        <DialogTitle>Enroll in {course.title}</DialogTitle>
                        <DialogDescription>
                          Enter your enrollment code to join this course.
                        </DialogDescription>
                      </DialogHeader>
                      <div className="grid gap-4 py-4">
                        <div className="grid gap-2">
                          <label className="text-sm font-medium text-slate-900">
                            Enrollment Code
                          </label>
                          <Input
                            placeholder="e.g., CS101"
                            value={enrollCode}
                            onChange={(e) => {
                              setEnrollCode(e.target.value.toUpperCase());
                              setEnrollError("");
                              setEnrollSuccess("");
                            }}
                            className="rounded-lg"
                          />
                          <p className="text-xs text-slate-500 mt-1">
                            Code:{" "}
                            <span className="font-mono font-semibold">
                              {course.enrollCode}
                            </span>
                          </p>
                        </div>
                        {enrollError && (
                          <div className="text-sm text-red-600 bg-red-50 p-3 rounded-lg">
                            {enrollError}
                          </div>
                        )}
                        {enrollSuccess && (
                          <div className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg">
                            {enrollSuccess}
                          </div>
                        )}
                      </div>
                      <div className="flex gap-3">
                        <DialogTrigger asChild>
                          <Button
                            variant="outline"
                            className="flex-1 rounded-lg"
                          >
                            Cancel
                          </Button>
                        </DialogTrigger>
                        <Button
                          onClick={handleEnroll}
                          className="flex-1 rounded-lg"
                        >
                          Enroll Now
                        </Button>
                      </div>
                    </DialogContent>
                  </Dialog>
                </CardFooter>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}
