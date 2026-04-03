import React from "react";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  FileText,
  PlayCircle,
  CheckCircle2,
  Download,
  Settings,
  BookOpen,
  Clock,
  Users,
  GraduationCap,
  ArrowLeft,
} from "lucide-react";

const COURSE_INFO = {
  cs101: {
    title: "Introduction to Computer Science",
    code: "CS101",
    instructor: "Dr. Smith",
    students: 120,
    duration: "12 weeks",
    credits: "3 Credits",
    description:
      "This course provides an introduction to computer science and programming. Topics include problem-solving, algorithm design, data structures, and software engineering principles.",
  },
  math201: {
    title: "Linear Algebra",
    code: "MATH201",
    instructor: "Prof. Johnson",
    students: 85,
    duration: "10 weeks",
    credits: "4 Credits",
    description:
      "Master linear algebra concepts including vectors, matrices, eigenvalues, and linear transformations.",
  },
};

export function StudentCourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const course = COURSE_INFO[id] || COURSE_INFO.cs101;

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <Badge
                variant="outline"
                className="border-slate-300 text-slate-700 font-bold tracking-wider rounded-full px-4 py-1.5"
              >
                {course.code}
              </Badge>
              <Badge className="!bg-emerald-500 rounded-full px-4 py-1.5 text-white font-normal">
                Active
              </Badge>
            </div>
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                {course.title}
              </h2>
              <div className="flex flex-wrap items-center gap-4 mt-4 text-slate-600 font-medium">
                <div className="flex items-center gap-1.5">
                  <GraduationCap className="h-5 w-5 text-slate-400" />
                  <span>{course.instructor}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="flex items-center gap-1.5">
                  <Clock className="h-5 w-5 text-slate-400" />
                  <span>{course.duration}</span>
                </div>
                <div className="w-1.5 h-1.5 rounded-full bg-slate-300"></div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-5 w-5 text-slate-400" />
                  <span>{course.credits}</span>
                </div>
              </div>
            </div>
          </div>
          {user?.role === "Lecturer" && (
            <Button
              variant="outline"
              className="rounded-xl bg-white/50 hover:bg-white shadow-sm border-slate-200/60 shrink-0"
            >
              <Settings className="mr-2 h-4 w-4" />
              Course Settings
            </Button>
          )}
        </div>
      </div>

      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="overview" className="rounded-xl">
            Overview
          </TabsTrigger>
          <TabsTrigger value="content" className="rounded-xl">
            Content
          </TabsTrigger>
          <TabsTrigger value="participants" className="rounded-xl">
            Participants
          </TabsTrigger>
          <TabsTrigger value="grades" className="rounded-xl">
            Grades
          </TabsTrigger>
        </TabsList>

        <TabsContent
          value="overview"
          className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <Card className="glass border-none shadow-xl shadow-slate-200/40">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-2xl">
                Course Syllabus
              </CardTitle>
              <CardDescription className="text-base">
                What you will learn in this course
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-6 text-slate-700 leading-relaxed text-lg">
              <p>{course.description}</p>
              <div className="bg-slate-50/50 rounded-2xl p-6 border border-slate-100">
                <h4 className="font-display font-semibold text-xl text-slate-900 mb-4">
                  Learning Objectives:
                </h4>
                <ul className="space-y-3">
                  {[
                    "Understand fundamental programming concepts.",
                    "Design and implement basic algorithms.",
                    "Analyze the efficiency of algorithms.",
                    "Write clean, maintainable code.",
                  ].map((objective, i) => (
                    <li key={i} className="flex items-start gap-3">
                      <div className="mt-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <CheckCircle2 className="h-4 w-4" />
                      </div>
                      <span>{objective}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="content"
          className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-display text-2xl font-semibold text-slate-900">
              Course Modules
            </h3>
            {user?.role === "Lecturer" && (
              <Button
                size="sm"
                className="rounded-xl shadow-md shadow-primary/20"
              >
                Add Module
              </Button>
            )}
          </div>
          <Accordion
            type="multiple"
            defaultValue={["module-1"]}
            className="w-full"
          >
            {[1, 2, 3, 4].map((module) => (
              <AccordionItem key={module} value={`module-${module}`}>
                <AccordionTrigger className="hover:no-underline py-6 px-4">
                  <div className="flex items-center gap-6 text-left w-full pr-4">
                    <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary font-display text-xl font-bold border border-primary/10">
                      {module}
                    </div>
                    <div className="flex-1">
                      <div className="font-display text-xl font-semibold text-slate-900 group-hover:text-primary transition-colors">
                        {module === 1
                          ? "Introduction to Python"
                          : module === 2
                            ? "Control Flow"
                            : module === 3
                              ? "Data Structures"
                              : "Functions & Modules"}
                      </div>
                      <div className="flex items-center gap-3 text-sm text-slate-500 font-medium mt-1.5">
                        <span className="flex items-center gap-1">
                          <PlayCircle className="h-4 w-4" /> 3 Lessons
                        </span>
                        <div className="w-1 h-1 rounded-full bg-slate-300"></div>
                        <span className="flex items-center gap-1">
                          <FileText className="h-4 w-4" /> 1 Assignment
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-2 pb-6 px-4">
                  <div className="space-y-3 pl-[5.5rem]">
                    <div className="group flex items-center justify-between p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-blue-50 text-blue-500 group-hover:bg-blue-100 transition-colors">
                          <PlayCircle className="h-5 w-5" />
                        </div>
                        <span className="text-base font-medium text-slate-700 group-hover:text-slate-900">
                          Video Lecture {module}.1
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-400">
                          15:00
                        </span>
                        {user?.role === "Student" && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        )}
                      </div>
                    </div>
                    <div className="group flex items-center justify-between p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm cursor-pointer">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-purple-50 text-purple-500 group-hover:bg-purple-100 transition-colors">
                          <FileText className="h-5 w-5" />
                        </div>
                        <span className="text-base font-medium text-slate-700 group-hover:text-slate-900">
                          Reading Material {module}.2
                        </span>
                      </div>
                      <div className="flex items-center gap-4">
                        <span className="text-sm font-medium text-slate-400">
                          10 min read
                        </span>
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-8 w-8 rounded-full hover:bg-slate-100 text-slate-400 hover:text-slate-600"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                    <div className="flex items-center justify-between p-4 border border-accent/20 bg-accent/5 rounded-xl mt-4">
                      <div className="flex items-center gap-4">
                        <div className="flex h-10 w-10 items-center justify-center rounded-full bg-accent/10 text-accent">
                          <FileText className="h-5 w-5" />
                        </div>
                        <span className="text-base font-semibold text-accent">
                          Assignment {module}
                        </span>
                      </div>
                      <Badge
                        variant="outline"
                        className="bg-white border-accent/20 text-accent font-medium px-4 py-1.5 rounded-full"
                      >
                        Due in 3 days
                      </Badge>
                    </div>
                  </div>
                </AccordionContent>
              </AccordionItem>
            ))}
          </Accordion>
        </TabsContent>

        <TabsContent
          value="participants"
          className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <Card className="glass border-none shadow-xl shadow-slate-200/40">
            <CardHeader className="pb-6">
              <CardTitle className="font-display text-2xl">
                Enrolled Students
              </CardTitle>
              <CardDescription className="text-base">
                120 students currently enrolled
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-slate-100 bg-white/50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-600">
                        Name
                      </TableHead>
                      <TableHead className="font-semibold text-slate-600">
                        Student ID
                      </TableHead>
                      <TableHead className="font-semibold text-slate-600">
                        Email
                      </TableHead>
                      <TableHead className="font-semibold text-slate-600">
                        Status
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {[1, 2, 3, 4, 5].map((i) => (
                      <TableRow
                        key={i}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="font-medium text-slate-900 py-4">
                          <div className="flex items-center gap-3">
                            <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-medium text-xs">
                              S{i}
                            </div>
                            Student Name {i}
                          </div>
                        </TableCell>
                        <TableCell className="text-slate-600">
                          IU{2023000 + i}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          student{i}@iu.edu
                        </TableCell>
                        <TableCell>
                          <Badge
                            variant="secondary"
                            className="bg-emerald-50 text-emerald-600 hover:bg-emerald-100 border-none rounded-full px-4 py-1.5 font-normal"
                          >
                            Active
                          </Badge>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent
          value="grades"
          className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          {user?.role === "Student" ? (
            <Card className="glass border-none shadow-xl shadow-slate-200/40">
              <CardHeader className="pb-6">
                <div className="flex items-center justify-between">
                  <div>
                    <CardTitle className="font-display text-2xl">
                      My Grades
                    </CardTitle>
                    <CardDescription className="text-base mt-1">
                      Your performance in this course
                    </CardDescription>
                  </div>
                  <div className="text-right">
                    <div className="text-sm font-medium text-slate-500 uppercase tracking-wider">
                      Overall Grade
                    </div>
                    <div className="font-display text-3xl font-bold text-primary">
                      85%{" "}
                      <span className="text-xl text-slate-400 font-medium">
                        (A-)
                      </span>
                    </div>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-slate-100 bg-white/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-600">
                          Item
                        </TableHead>
                        <TableHead className="font-semibold text-slate-600">
                          Weight
                        </TableHead>
                        <TableHead className="font-semibold text-slate-600">
                          Score
                        </TableHead>
                        <TableHead className="font-semibold text-slate-600">
                          Feedback
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      <TableRow className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-medium text-slate-900 py-4">
                          Assignment 1
                        </TableCell>
                        <TableCell className="text-slate-600">10%</TableCell>
                        <TableCell className="font-semibold text-slate-900">
                          90/100
                        </TableCell>
                        <TableCell className="text-slate-500 italic">
                          "Good work on algorithms."
                        </TableCell>
                      </TableRow>
                      <TableRow className="hover:bg-slate-50/50 transition-colors">
                        <TableCell className="font-medium text-slate-900 py-4">
                          Midterm Exam
                        </TableCell>
                        <TableCell className="text-slate-600">30%</TableCell>
                        <TableCell className="font-semibold text-slate-900">
                          82/100
                        </TableCell>
                        <TableCell className="text-slate-500 italic">
                          "Review data structures."
                        </TableCell>
                      </TableRow>
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          ) : (
            <Card className="glass border-none shadow-xl shadow-slate-200/40">
              <CardHeader className="pb-6">
                <CardTitle className="font-display text-2xl">
                  Gradebook
                </CardTitle>
                <CardDescription className="text-base">
                  Manage grades for all students
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="rounded-2xl border border-slate-100 bg-white/50 overflow-hidden">
                  <Table>
                    <TableHeader className="bg-slate-50/50">
                      <TableRow className="hover:bg-transparent">
                        <TableHead className="font-semibold text-slate-600">
                          Student
                        </TableHead>
                        <TableHead className="font-semibold text-slate-600">
                          A1 (10%)
                        </TableHead>
                        <TableHead className="font-semibold text-slate-600">
                          A2 (10%)
                        </TableHead>
                        <TableHead className="font-semibold text-slate-600">
                          Midterm (30%)
                        </TableHead>
                        <TableHead className="font-semibold text-slate-600">
                          Total
                        </TableHead>
                      </TableRow>
                    </TableHeader>
                    <TableBody>
                      {[1, 2, 3].map((i) => (
                        <TableRow
                          key={i}
                          className="hover:bg-slate-50/50 transition-colors"
                        >
                          <TableCell className="font-medium text-slate-900 py-4">
                            <div className="flex items-center gap-3">
                              <div className="h-8 w-8 rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 flex items-center justify-center text-indigo-600 font-medium text-xs">
                                S{i}
                              </div>
                              Student {i}
                            </div>
                          </TableCell>
                          <TableCell className="text-slate-600">90</TableCell>
                          <TableCell className="text-slate-600">85</TableCell>
                          <TableCell className="text-slate-600">88</TableCell>
                          <TableCell className="font-bold text-primary">
                            87.5%
                          </TableCell>
                        </TableRow>
                      ))}
                    </TableBody>
                  </Table>
                </div>
              </CardContent>
            </Card>
          )}
        </TabsContent>
      </Tabs>
    </div>
  );
}
