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
import { Input } from "@/components/ui/Input";
import { useState, useEffect } from "react";
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
  Star,
  Send,
  Timer,
  LogOut,
  BrainCircuit,
  AlertCircle,
  Menu,
  Minus,
  Plus,
  ChevronUp,
  ChevronDown,
  Copy,
  Volume2,
  Maximize,
  X,
  HelpCircle,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from "@/components/ui/Dialog";

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

  // Rating and feedback state
  const [rating, setRating] = useState(0);
  const [hoverRating, setHoverRating] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [feedbacks, setFeedbacks] = useState([
    {
      id: 1,
      student: "Alice Johnson",
      rating: 5,
      comment: "Excellent course! Very well structured.",
      date: "2024-04-15",
    },
    {
      id: 2,
      student: "Bob Smith",
      rating: 4,
      comment: "Good content but could use more practice problems.",
      date: "2024-04-10",
    },
  ]);
  const [submitted, setSubmitted] = useState(false);

  // Submissions state
  const [submissions, setSubmissions] = useState([
    {
      id: 1,
      name: "Assignment 1",
      dueDate: "2024-04-20",
      status: "Completed",
      score: 90,
      submitted: true,
    },
    {
      id: 2,
      name: "Midterm Project",
      dueDate: "2024-05-01",
      status: "Not Started",
      score: null,
      submitted: false,
    },
    {
      id: 3,
      name: "Problem Set 1",
      dueDate: "2024-04-25",
      status: "Submitted",
      score: null,
      submitted: true,
    },
  ]);

  const handleSubmitFeedback = () => {
    if (rating === 0 || !feedback.trim()) {
      return;
    }

    const newFeedback = {
      id: feedbacks.length + 1,
      student: user.name,
      rating,
      comment: feedback,
      date: new Date().toISOString().split("T")[0],
    };

    setFeedbacks([newFeedback, ...feedbacks]);
    setRating(0);
    setFeedback("");
    setSubmitted(true);

    setTimeout(() => setSubmitted(false), 3000);
  };

  const [activeQuiz, setActiveQuiz] = useState(null);
  const [timeLeft, setTimeLeft] = useState(45 * 60);

  useEffect(() => {
    let timer;
    if (activeQuiz && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, timeLeft]);

  const handleStartQuiz = (moduleName, title) => {
    setActiveQuiz({ module: moduleName, title });
    setTimeLeft(45 * 60);
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const [activeMaterial, setActiveMaterial] = useState(null);
  const [activeSubmission, setActiveSubmission] = useState(null);
  const [submissionFile, setSubmissionFile] = useState("");

  const handleOpenMaterial = (type, title) => {
    setActiveMaterial({ type, title });
  };

  const handleSubmitAssignment = () => {
    if (!submissionFile) return;

    setSubmissions((prev) =>
      prev.map((sub) =>
        sub.id === activeSubmission.id
          ? { ...sub, status: "Submitted", submitted: true }
          : sub,
      ),
    );
    setActiveSubmission(null);
    setSubmissionFile("");
  };

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

      <Tabs defaultValue="content" className="w-full mt-4">
        <TabsList className="!bg-transparent h-auto p-0 !flex space-x-6 w-full border-b border-slate-200 mb-8 rounded-none overflow-x-auto no-scrollbar justify-start">
          {[
            "overview",
            "content",
            "participants",
            "submissions",
            "grades",
            "feedback",
          ].map((tab) => (
            <TabsTrigger
              key={tab}
              value={tab}
              className="relative rounded-none border-b-2 border-transparent !bg-transparent px-4 py-4 font-semibold text-slate-500 hover:text-slate-700 data-[state=active]:border-primary data-[state=active]:text-primary data-[state=active]:shadow-none focus-visible:ring-0 focus-visible:outline-none transition-colors capitalize text-base !m-0"
            >
              {tab}
            </TabsTrigger>
          ))}
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
          <div className="flex justify-between items-center mb-6 bg-white/50 p-6 rounded-2xl border border-slate-100 shadow-sm">
            <div>
              <h3 className="font-display text-3xl font-extrabold text-slate-900 tracking-tight">
                Course Content
              </h3>
              <p className="text-slate-500 mt-1 font-medium">
                4 sections • 12 videos • 4 assignments
              </p>
            </div>
            {user?.role === "Lecturer" && (
              <Button
                size="sm"
                className="rounded-xl shadow-lg shadow-primary/20 bg-primary text-white"
              >
                <Plus className="w-4 h-4 mr-2" /> Add Module
              </Button>
            )}
          </div>
          <Accordion
            type="multiple"
            defaultValue={["module-1"]}
            className="w-full space-y-4"
          >
            {[1, 2, 3, 4].map((module) => (
              <AccordionItem
                key={module}
                value={`module-${module}`}
                className="bg-white rounded-2xl border border-slate-200/60 shadow-sm overflow-hidden data-[state=open]:ring-2 data-[state=open]:ring-primary/10 transition-all data-[state=open]:shadow-md"
              >
                <AccordionTrigger className="hover:no-underline py-5 px-6 hover:bg-slate-50/50 transition-colors">
                  <div className="flex items-center gap-5 text-left w-full pr-4">
                    <div className="flex h-16 w-16 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-blue-50 text-primary font-display text-2xl font-extrabold shadow-inner border border-primary/10">
                      {module}
                    </div>
                    <div className="flex-1">
                      <div className="text-xs font-bold uppercase tracking-widest text-primary mb-1">
                        Section {module}
                      </div>
                      <div className="font-display text-xl font-bold text-slate-900 group-hover:text-primary transition-colors">
                        {module === 1
                          ? "Introduction to Python"
                          : module === 2
                            ? "Control Flow"
                            : module === 3
                              ? "Data Structures"
                              : "Functions & Modules"}
                      </div>
                      <div className="flex items-center gap-4 text-sm text-slate-500 font-medium mt-2">
                        <span className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-md text-slate-600">
                          <PlayCircle className="h-3.5 w-3.5 text-blue-500" /> 3
                          Videos
                        </span>
                        <span className="flex items-center gap-1.5 bg-slate-100/80 px-2.5 py-1 rounded-md text-slate-600">
                          <FileText className="h-3.5 w-3.5 text-purple-500" /> 1
                          Reading
                        </span>
                      </div>
                    </div>
                  </div>
                </AccordionTrigger>
                <AccordionContent className="pt-0 pb-0">
                  <div className="border-t border-slate-100 flex flex-col bg-slate-50/50">
                    <div
                      onClick={() =>
                        handleOpenMaterial(
                          "Video Lecture",
                          `Video Lecture ${module}.1`,
                        )
                      }
                      className="group flex items-center justify-between p-4 sm:px-8 sm:py-5 hover:bg-white transition-all cursor-pointer border-b border-slate-100/50 hover:shadow-[inset_4px_0_0_0_rgba(6,81,237,1)]"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="mt-0.5 sm:mt-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-blue-100 text-blue-600 group-hover:scale-110 transition-transform shadow-sm">
                          <PlayCircle className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-semibold text-slate-800 group-hover:text-primary transition-colors">
                            1. Video Lecture {module}.1
                          </span>
                          <span className="text-sm font-medium text-slate-500 mt-0.5 flex items-center gap-2">
                            Video • 15:00
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 shrink-0">
                        {user?.role === "Student" && (
                          <CheckCircle2 className="h-5 w-5 text-emerald-500" />
                        )}
                      </div>
                    </div>

                    <div
                      onClick={() =>
                        handleOpenMaterial(
                          "Reading Material",
                          `Reading Material ${module}.2`,
                        )
                      }
                      className="group flex items-center justify-between p-4 sm:px-8 sm:py-5 hover:bg-white transition-all cursor-pointer border-b border-slate-100/50 hover:shadow-[inset_4px_0_0_0_rgba(168,85,247,1)]"
                    >
                      <div className="flex items-start sm:items-center gap-4">
                        <div className="mt-0.5 sm:mt-0 flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-purple-100 text-purple-600 group-hover:scale-110 transition-transform shadow-sm">
                          <FileText className="h-5 w-5" />
                        </div>
                        <div className="flex flex-col">
                          <span className="text-base font-semibold text-slate-800 group-hover:text-purple-600 transition-colors">
                            2. Reading Material {module}.2
                          </span>
                          <span className="text-sm font-medium text-slate-500 mt-0.5 flex items-center gap-2">
                            Reading • 10 min read
                          </span>
                        </div>
                      </div>
                      <div className="flex items-center gap-2 shrink-0">
                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-9 w-9 rounded-full bg-slate-100 hover:bg-slate-200 text-slate-500"
                        >
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>

                    <div
                      className="m-4 sm:mx-8 sm:my-6 p-5 border border-primary/20 bg-primary/5 rounded-2xl relative overflow-hidden group hover:bg-primary/10 transition-colors cursor-pointer"
                      onClick={() =>
                        handleStartQuiz(
                          `Module ${module} Review`,
                          `Assignment ${module}`,
                        )
                      }
                    >
                      <div className="absolute top-0 left-0 w-1.5 h-full bg-primary/80"></div>
                      <div className="flex items-center justify-between w-full relative z-10 gap-4 flex-wrap">
                        <div className="flex items-start gap-4 flex-1">
                          <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-white shadow-sm text-primary">
                            <BrainCircuit className="h-6 w-6" />
                          </div>
                          <div className="flex flex-col">
                            <div className="flex items-center gap-2 mb-1">
                              <span className="text-xs font-bold uppercase tracking-wider text-primary bg-white px-2 py-0.5 rounded shadow-sm">
                                Required
                              </span>
                            </div>
                            <span className="text-lg font-bold text-slate-900 group-hover:text-primary transition-colors">
                              Assignment {module}
                            </span>
                            <span className="text-sm font-medium text-slate-600 flex items-center gap-1.5 mt-1">
                              <Clock className="w-4 h-4" /> Due in 3 days
                            </span>
                          </div>
                        </div>
                        <Button
                          variant="default"
                          className="bg-primary hover:bg-primary/90 text-white rounded-xl px-6 py-5 shadow-lg shadow-primary/30 font-bold whitespace-nowrap grow sm:grow-0"
                        >
                          <PlayCircle className="w-5 h-5 mr-2" />
                          Take Quiz
                        </Button>
                      </div>
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

        <TabsContent
          value="submissions"
          className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <Card className="glass border-none shadow-xl shadow-slate-200/40">
            <CardHeader className="pb-6">
              <CardTitle className="font-display text-2xl">
                My Submissions
              </CardTitle>
              <CardDescription className="text-base">
                Track your submitted assignments and problem sets
              </CardDescription>
            </CardHeader>
            <CardContent>
              <div className="rounded-2xl border border-slate-100 bg-white/50 overflow-hidden">
                <Table>
                  <TableHeader className="bg-slate-50/50">
                    <TableRow className="hover:bg-transparent">
                      <TableHead className="font-semibold text-slate-600">
                        Assignment
                      </TableHead>
                      <TableHead className="font-semibold text-slate-600">
                        Due Date
                      </TableHead>
                      <TableHead className="font-semibold text-slate-600">
                        Status
                      </TableHead>
                      <TableHead className="font-semibold text-slate-600">
                        Score
                      </TableHead>
                      <TableHead className="font-semibold text-slate-600">
                        Action
                      </TableHead>
                    </TableRow>
                  </TableHeader>
                  <TableBody>
                    {submissions.map((submission) => (
                      <TableRow
                        key={submission.id}
                        className="hover:bg-slate-50/50 transition-colors"
                      >
                        <TableCell className="font-medium text-slate-900 py-4">
                          {submission.name}
                        </TableCell>
                        <TableCell className="text-slate-600">
                          {submission.dueDate}
                        </TableCell>
                        <TableCell>
                          <Badge
                            className={`rounded-full px-3 py-1 text-xs font-medium border-none ${
                              submission.status === "Completed"
                                ? "bg-emerald-50 text-emerald-600"
                                : submission.status === "Submitted"
                                  ? "bg-blue-50 text-blue-600"
                                  : "bg-slate-100 text-slate-600"
                            }`}
                          >
                            {submission.status}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-semibold text-slate-900">
                          {submission.score ? `${submission.score}/100` : "-"}
                        </TableCell>
                        <TableCell>
                          {!submission.submitted ? (
                            <Button
                              size="sm"
                              variant="default"
                              className="rounded-lg"
                              onClick={() => setActiveSubmission(submission)}
                            >
                              Submit
                            </Button>
                          ) : (
                            <Button
                              size="sm"
                              variant="outline"
                              className="rounded-lg"
                            >
                              View
                            </Button>
                          )}
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
          value="feedback"
          className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500"
        >
          <div className="space-y-6">
            <Card className="glass border-none shadow-xl shadow-slate-200/40">
              <CardHeader className="pb-4">
                <CardTitle className="font-display text-2xl">
                  Rate & Review
                </CardTitle>
                <CardDescription className="text-base">
                  Share your feedback about this course
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-3">
                    Your Rating
                  </label>
                  <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onMouseEnter={() => setHoverRating(star)}
                        onMouseLeave={() => setHoverRating(0)}
                        onClick={() => setRating(star)}
                        className="transition-transform hover:scale-110"
                      >
                        <Star
                          className={`h-8 w-8 ${
                            star <= (hoverRating || rating)
                              ? "fill-amber-400 text-amber-400"
                              : "text-slate-300"
                          }`}
                        />
                      </button>
                    ))}
                  </div>
                  {rating > 0 && (
                    <p className="text-sm text-slate-500 mt-2">
                      {
                        ["", "Poor", "Fair", "Good", "Very Good", "Excellent"][
                          rating
                        ]
                      }{" "}
                      ({rating}/5)
                    </p>
                  )}
                </div>

                <div>
                  <label className="text-sm font-semibold text-slate-900 block mb-2">
                    Your Feedback
                  </label>
                  <textarea
                    value={feedback}
                    onChange={(e) => setFeedback(e.target.value)}
                    placeholder="Share your thoughts about this course..."
                    className="w-full p-3 border border-slate-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-primary/20 resize-none"
                    rows={4}
                  />
                </div>

                {submitted && (
                  <div className="text-sm text-emerald-600 bg-emerald-50 p-3 rounded-lg flex items-center gap-2">
                    <CheckCircle2 className="h-4 w-4" />
                    Thank you for your feedback!
                  </div>
                )}

                <Button
                  onClick={handleSubmitFeedback}
                  disabled={rating === 0 || !feedback.trim()}
                  className="w-full rounded-lg"
                >
                  <Send className="mr-2 h-4 w-4" />
                  Submit Feedback
                </Button>
              </CardContent>
            </Card>

            <Card className="glass border-none shadow-xl shadow-slate-200/40">
              <CardHeader>
                <CardTitle className="font-display text-xl">
                  Course Reviews ({feedbacks.length})
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {feedbacks.map((fb) => (
                  <div
                    key={fb.id}
                    className="border-b border-slate-100 pb-4 last:border-b-0"
                  >
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <p className="font-semibold text-slate-900">
                          {fb.student}
                        </p>
                        <p className="text-xs text-slate-500">{fb.date}</p>
                      </div>
                      <div className="flex gap-0.5">
                        {Array.from({ length: 5 }).map((_, i) => (
                          <Star
                            key={i}
                            className={`h-4 w-4 ${
                              i < fb.rating
                                ? "fill-amber-400 text-amber-400"
                                : "text-slate-300"
                            }`}
                          />
                        ))}
                      </div>
                    </div>
                    <p className="text-slate-600 text-sm">{fb.comment}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>

      {/* Quiz Modal */}
      <Dialog
        open={!!activeQuiz}
        onOpenChange={(open) => !open && setActiveQuiz(null)}
      >
        <DialogContent className="sm:max-w-4xl w-[95vw] h-[90vh] md:h-auto max-h-[90vh] rounded-2xl gap-0 p-0 overflow-hidden flex flex-col scale-100">
          {activeQuiz && (
            <>
              <div className="bg-primary/5 p-6 border-b border-primary/10 shrink-0">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-3 py-1 rounded-full flex items-center gap-1.5">
                        {course.code} <BrainCircuit className="w-3 h-3" />
                      </span>
                    </div>
                    <DialogTitle className="text-3xl font-display text-slate-900 mt-2">
                      {activeQuiz.title}
                    </DialogTitle>
                    <DialogDescription className="text-slate-600 mt-1.5 text-base">
                      {activeQuiz.module}
                    </DialogDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-3 bg-white px-5 py-3 rounded-2xl shadow-sm border border-slate-100">
                      <Timer
                        className={`w-6 h-6 ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-slate-400"}`}
                      />
                      <span
                        className={`font-mono text-2xl font-bold tracking-tight ${timeLeft < 300 ? "text-red-500" : "text-slate-700"}`}
                      >
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                    <p className="text-xs text-slate-400 mt-2 font-medium">
                      Please do not refresh
                    </p>
                  </div>
                </div>
              </div>

              <div className="p-6 md:p-8 space-y-8 bg-slate-50/50 overflow-y-auto flex-1">
                <div className="space-y-6 max-w-3xl mx-auto">
                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex gap-4 items-start mb-6">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                        1
                      </div>
                      <p className="font-medium text-slate-900 text-lg leading-relaxed pt-0.5">
                        Explain the core concepts of this module inside a
                        real-world scenario.
                      </p>
                    </div>
                    <div className="space-y-3 pl-12">
                      {[
                        "Option A: Utilizing the framework natively",
                        "Option B: Deploying standalone instances",
                        "Option C: Implementing proxy patterns",
                        "Option D: Both A and C",
                      ].map((opt, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-4 p-4 py-3.5 rounded-xl border border-slate-100 hover:border-primary/50 hover:bg-primary/5 cursor-pointer transition-colors group"
                        >
                          <input
                            type="radio"
                            name="q1"
                            className="text-primary focus:ring-primary w-5 h-5 border-slate-300"
                          />
                          <span className="text-base text-slate-700 group-hover:text-slate-900">
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-6 md:p-8 rounded-2xl border border-slate-100 shadow-sm transition-all hover:shadow-md">
                    <div className="flex gap-4 items-start mb-6">
                      <div className="flex items-center justify-center w-8 h-8 rounded-full bg-primary/10 text-primary font-bold text-sm shrink-0">
                        2
                      </div>
                      <p className="font-medium text-slate-900 text-lg leading-relaxed pt-0.5">
                        Which of the following best describes the expected
                        behavior? Write down your reasoning.
                      </p>
                    </div>
                    <div className="pl-12">
                      <textarea
                        className="w-full h-40 p-4 text-base border-slate-200 rounded-xl focus:border-primary focus:ring-primary resize-none bg-slate-50/50 focus:bg-white"
                        placeholder="Write your reasoning here..."
                      ></textarea>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-5 border-t border-slate-100 bg-white flex justify-between items-center sm:px-8 shrink-0 shadow-[0_-4px_20px_-15px_rgba(0,0,0,0.1)] z-10 relative">
                <Button
                  variant="ghost"
                  onClick={() => setActiveQuiz(null)}
                  className="text-slate-500 hover:text-slate-700 text-base"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Save & Exit
                </Button>
                <div className="space-x-3">
                  <Button variant="outline" className="text-base h-11 px-6">
                    Previous
                  </Button>
                  <Button className="bg-primary hover:bg-primary/90 text-white text-base h-11 px-8 shadow-md">
                    Next Question
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Learning Material Modal */}
      <Dialog
        open={!!activeMaterial}
        onOpenChange={(open) => !open && setActiveMaterial(null)}
      >
        <DialogContent className="sm:max-w-5xl w-[95vw] h-[90vh] md:h-[85vh] rounded-3xl p-0 overflow-hidden flex flex-col scale-100 bg-slate-50 shadow-2xl border-0">
          {activeMaterial && (
            <>
              <div className="bg-white px-6 py-4 border-b border-slate-200/60 shrink-0 flex flex-col sm:flex-row sm:items-center justify-between shadow-sm z-10 relative gap-4">
                <div className="flex items-center gap-4">
                  <div
                    className={`w-14 h-14 rounded-2xl flex items-center justify-center shadow-inner ${activeMaterial.type === "Video Lecture" ? "bg-gradient-to-br from-blue-100 to-blue-50 text-blue-600" : "bg-gradient-to-br from-purple-100 to-purple-50 text-purple-600"}`}
                  >
                    {activeMaterial.type === "Video Lecture" ? (
                      <PlayCircle className="w-7 h-7" />
                    ) : (
                      <FileText className="w-7 h-7" />
                    )}
                  </div>
                  <div>
                    <h3 className="font-display font-bold text-xl text-slate-800 tracking-tight">
                      {activeMaterial.title}
                    </h3>
                    <p className="text-xs font-semibold text-slate-500 uppercase tracking-widest mt-1 bg-slate-100 inline-block px-2 py-0.5 rounded-sm">
                      {activeMaterial.type}
                    </p>
                  </div>
                </div>
                <div className="flex gap-3">
                  <Button
                    variant="outline"
                    className="rounded-xl font-medium border-slate-200 hover:bg-slate-50 hover:text-slate-900 transition-colors"
                  >
                    <Download className="w-4 h-4 mr-2 text-slate-500" />
                    Download
                  </Button>
                </div>
              </div>

              <div className="flex-1 flex flex-col bg-slate-100/50 relative overflow-hidden">
                {activeMaterial.type === "Video Lecture" ? (
                  <div className="flex-1 p-4 md:p-8 flex items-center justify-center">
                    <div className="w-full h-full max-w-4xl bg-slate-950 rounded-2xl shadow-2xl overflow-hidden flex flex-col items-center justify-center group cursor-pointer relative border border-slate-800 ring-4 ring-black/5">
                      <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/80 pointer-events-none z-0"></div>
                      <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-white/10 flex items-center justify-center mb-4 group-hover:scale-110 group-hover:bg-primary/90 transition-all duration-300 backdrop-blur-md border border-white/20 shadow-2xl relative z-10">
                        <PlayCircle className="w-10 h-10 sm:w-12 sm:h-12 text-white ml-1 sm:ml-2 drop-shadow-lg" />
                      </div>
                      <p className="font-semibold tracking-wider text-white mt-4 z-10 text-base sm:text-lg shadow-sm">
                        Play Video
                      </p>

                      {/* Fake Video Controls */}
                      <div className="absolute bottom-0 left-0 right-0 p-4 sm:p-6 bg-gradient-to-t from-black to-transparent flex flex-col gap-4 z-10">
                        <div className="h-1.5 w-full bg-white/20 rounded-full overflow-hidden cursor-pointer group-hover:h-2 transition-all">
                          <div className="h-full bg-primary w-1/3 relative">
                            <div className="absolute right-0 top-1/2 -translate-y-1/2 w-3 h-3 bg-white rounded-full shadow opacity-0 group-hover:opacity-100 transition-opacity"></div>
                          </div>
                        </div>
                        <div className="flex justify-between items-center text-xs sm:text-sm font-medium text-white/80">
                          <span>
                            04:{activeMaterial.length || "32"} / 15:00
                          </span>
                          <div className="flex gap-4 sm:gap-6">
                            <span className="hover:text-white cursor-pointer transition-colors">
                              Settings
                            </span>
                            <span className="hover:text-white cursor-pointer transition-colors">
                              Fullscreen
                            </span>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="flex-1 p-0 md:p-8 flex justify-center h-full">
                    <div className="w-full max-w-4xl h-full bg-white md:rounded-2xl shadow-xl border border-slate-200/60 overflow-hidden flex flex-col text-slate-800">
                      {/* Fake PDF Toolbar */}
                      <div className="h-12 bg-slate-100 border-b border-slate-200 flex items-center justify-between px-4 sticky top-0 z-10">
                        <div className="flex items-center gap-4 text-slate-500">
                          <span className="text-xs font-semibold px-2 py-1 rounded bg-slate-200">
                            Page 1 / 12
                          </span>
                        </div>
                        <div className="flex items-center gap-2">
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 rounded-full text-slate-500 hover:text-slate-800"
                          >
                            <Search className="w-4 h-4" />
                          </Button>
                        </div>
                      </div>

                      {/* PDF Document Content */}
                      <div className="p-6 md:p-14 overflow-y-auto w-full h-full custom-scrollbar">
                        <div className="max-w-2xl mx-auto space-y-8 w-full">
                          <div className="border-l-4 border-primary pl-6 py-2 mb-10 bg-primary/5 rounded-r-xl">
                            <h1 className="text-2xl sm:text-3xl font-display font-extrabold text-slate-900 tracking-tight leading-tight">
                              Module 1: {activeMaterial.title}
                            </h1>
                            <p className="text-sm text-slate-500 mt-2 font-medium flex items-center gap-2">
                              <Clock className="w-4 h-4" /> Estimated reading
                              time: ~10 minutes
                            </p>
                          </div>

                          <p className="leading-relaxed text-base sm:text-lg text-slate-700 text-justify">
                            Welcome to the first module. In this material, we
                            will explore the core concepts required to
                            understand the underlying framework. Please ensure
                            you read carefully before attempting the quiz.
                            Nullam id dolor id nibh ultricies vehicula ut id
                            elit.
                          </p>

                          <h2 className="text-xl font-bold text-slate-800 border-b pb-2 mt-8">
                            1. Introduction to Algorithms
                          </h2>
                          <p className="leading-relaxed text-base sm:text-lg text-slate-700 text-justify">
                            Cras mattis consectetur purus sit amet fermentum.
                            Cum sociis natoque penatibus et magnis dis
                            parturient montes, nascetur ridiculus mus. Aenean
                            lacinia bibendum nulla sed consectetur.
                          </p>

                          <div className="bg-[#1e1e1e] p-6 sm:p-8 rounded-2xl border border-slate-800 shadow-xl my-10 relative overflow-hidden group">
                            <div className="absolute top-0 right-0 bg-slate-700/50 text-slate-300 text-xs px-3 py-1 font-mono rounded-bl-lg font-medium backdrop-blur-sm">
                              python
                            </div>
                            <pre className="font-mono text-sm sm:text-base text-[#d4d4d4] overflow-x-auto custom-scrollbar-dark">
                              <span className="text-[#569cd6]">def</span>{" "}
                              <span className="text-[#dcdcaa]">
                                calculate_fibonacci
                              </span>
                              (n):
                              <span className="text-[#c586c0]">if</span> n{" "}
                              {`<=`} <span className="text-[#b5cea8]">0</span>:
                              <span className="text-[#c586c0]">return</span> []
                              <span className="text-[#c586c0]">elif</span> n =={" "}
                              <span className="text-[#b5cea8]">1</span>:
                              <span className="text-[#c586c0]">return</span> [
                              <span className="text-[#b5cea8]">0</span>]
                              sequence = [
                              <span className="text-[#b5cea8]">0</span>,{" "}
                              <span className="text-[#b5cea8]">1</span>]
                              <span className="text-[#c586c0]">while</span>{" "}
                              <span className="text-[#dcdcaa]">len</span>
                              (sequence) {`<`} n: sequence.
                              <span className="text-[#dcdcaa]">append</span>
                              (sequence[-
                              <span className="text-[#b5cea8]">1</span>] +
                              sequence[-
                              <span className="text-[#b5cea8]">2</span>])
                              <span className="text-[#c586c0]">
                                return
                              </span>{" "}
                              sequence
                            </pre>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="absolute bottom-2 right-2 text-slate-400 hover:text-white opacity-0 group-hover:opacity-100 transition-opacity bg-white/5 hover:bg-white/10 rounded-lg"
                            >
                              <CheckCircle2 className="w-4 h-4 hidden" />{" "}
                              {/* To be toggled for copy success */}
                              <svg
                                xmlns="http://www.w3.org/2000/svg"
                                width="16"
                                height="16"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinelinejoin="round"
                              >
                                <rect
                                  width="14"
                                  height="14"
                                  x="8"
                                  y="8"
                                  rx="2"
                                  ry="2"
                                />
                                <path d="M4 16c-1.1 0-2-.9-2-2V4c0-1.1.9-2 2-2h10c1.1 0 2 .9 2 2" />
                              </svg>
                            </Button>
                          </div>

                          <p className="leading-relaxed text-base sm:text-lg text-slate-700 text-justify">
                            Aenean lacinia bibendum nulla sed consectetur.
                            Vivamus sagittis lacus vel augue laoreet rutrum
                            faucibus dolor auctor. Maecenas sed diam eget risus
                            varius blandit sit amet non magna. Integer posuere
                            erat a ante venenatis dapibus posuere velit aliquet.
                            Vestibulum id ligula porta felis euismod semper.
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Submission Modal */}
      <Dialog
        open={!!activeSubmission}
        onOpenChange={(open) => {
          if (!open) {
            setActiveSubmission(null);
            setSubmissionFile("");
          }
        }}
      >
        <DialogContent className="sm:max-w-xl p-0 overflow-hidden bg-white">
          {activeSubmission && (
            <>
              <div className="p-6 border-b border-slate-100 bg-slate-50/50">
                <div className="flex justify-between items-start">
                  <div>
                    <h3 className="font-display font-semibold text-xl text-slate-900 mb-1">
                      {activeSubmission.name}
                    </h3>
                    <p className="text-sm text-slate-500 font-medium flex items-center gap-1.5">
                      <Calendar className="w-4 h-4" /> Due:{" "}
                      {activeSubmission.dueDate}
                    </p>
                  </div>
                  <Badge className="bg-amber-50 text-amber-600 hover:bg-amber-50 border-none rounded-full px-3 py-1 font-medium text-xs">
                    Pending
                  </Badge>
                </div>
              </div>
              <div className="p-6 space-y-6">
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Upload your solution
                  </h4>
                  <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 hover:border-primary/50 hover:bg-primary/5 transition-all text-center group cursor-pointer">
                    <div className="w-16 h-16 bg-slate-50 rounded-full flex items-center justify-center mx-auto mb-4 group-hover:bg-primary/10 transition-colors">
                      <FileText className="w-8 h-8 text-slate-400 group-hover:text-primary transition-colors" />
                    </div>
                    <p className="font-medium text-slate-700 mb-1">
                      Click to upload or drag & drop
                    </p>
                    <p className="text-sm text-slate-400">
                      PDF, DOCX, ZIP up to 50MB
                    </p>

                    <Input
                      type="file"
                      className="hidden"
                      id="file-upload"
                      onChange={(e) => setSubmissionFile(e.target.value)}
                    />
                    <Button
                      variant="outline"
                      className="mt-6 rounded-full font-medium"
                      onClick={() =>
                        document.getElementById("file-upload").click()
                      }
                    >
                      Select File
                    </Button>

                    {submissionFile && (
                      <div className="mt-4 p-3 bg-emerald-50 border border-emerald-100 rounded-xl text-emerald-700 text-sm font-medium flex items-center justify-between">
                        <span className="flex items-center gap-2">
                          <CheckCircle2 className="w-4 h-4" /> File attached
                          successfully
                        </span>
                      </div>
                    )}
                  </div>
                </div>
                <div>
                  <h4 className="text-sm font-semibold text-slate-900 mb-3">
                    Or paste a link to your work
                  </h4>
                  <Input
                    placeholder="https://github.com/..."
                    className="rounded-xl border-slate-200"
                  />
                </div>
              </div>
              <div className="p-4 border-t border-slate-100 bg-slate-50 flex justify-end gap-3 px-6">
                <Button
                  variant="ghost"
                  onClick={() => setActiveSubmission(null)}
                  className="rounded-xl font-medium"
                >
                  Cancel
                </Button>
                <Button
                  className={`rounded-xl px-8 shadow-md font-medium text-white ${submissionFile ? "bg-primary hover:bg-primary/90" : "bg-slate-300 opacity-50 cursor-not-allowed"}`}
                  disabled={!submissionFile}
                  onClick={handleSubmitAssignment}
                >
                  <Send className="w-4 h-4 mr-2" />
                  Turn In
                </Button>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
