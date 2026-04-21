import React, { useState, useEffect } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/Dialog";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Activity,
  Calendar,
  PlayCircle,
  LogOut,
  Timer,
} from "lucide-react";
import { Progress } from "@/components/ui/Progress";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/Button";

// Mock course progress data
const COURSE_PROGRESS = [
  {
    id: "cs101",
    name: "CS101: Introduction to Computer Science",
    module: "Module 3: Data Structures",
    progress: 65,
    color: "bg-blue-100",
    iconColor: "text-blue-600",
  },
  {
    id: "math201",
    name: "MATH201: Linear Algebra",
    module: "Module 2: Matrices",
    progress: 30,
    color: "bg-purple-100",
    iconColor: "text-purple-600",
  },
  {
    id: "eng102",
    name: "ENG102: Academic Writing",
    module: "Module 1: Introduction",
    progress: 45,
    color: "bg-emerald-100",
    iconColor: "text-emerald-600",
  },
];

const DEADLINES = [
  {
    id: 1,
    course: "CS101 Midterm Project",
    date: "Tomorrow, 11:59 PM",
    type: "alert",
    icon: AlertCircle,
  },
  {
    id: 2,
    course: "MATH201 Quiz 2",
    date: "Friday, 10:00 AM",
    type: "warning",
    icon: Clock,
  },
  {
    id: 3,
    course: "ENG102 Essay Submission",
    date: "Saturday, 5:00 PM",
    type: "warning",
    icon: Clock,
  },
];

export function StudentDashboard() {
  const { user } = useAuth();

  // Quiz Modal State
  const [activeQuiz, setActiveQuiz] = useState(null); // { course, module, title }
  const [timeLeft, setTimeLeft] = useState(30 * 60); // 30 minutes in seconds

  useEffect(() => {
    let timer;
    if (activeQuiz && timeLeft > 0) {
      timer = setInterval(() => {
        setTimeLeft((prev) => prev - 1);
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [activeQuiz, timeLeft]);

  const handleTakeQuiz = (courseName, moduleName) => {
    setActiveQuiz({
      course: courseName,
      module: moduleName,
      title: "Midterm Quiz Evaluation",
    });
    setTimeLeft(30 * 60); // Reset timer
  };

  const formatTime = (seconds) => {
    const m = Math.floor(seconds / 60);
    const s = seconds % 60;
    return `${m}:${s.toString().padStart(2, "0")}`;
  };

  const closeQuiz = () => {
    setActiveQuiz(null);
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Quiz Modal */}
      <Dialog open={!!activeQuiz} onOpenChange={(open) => !open && closeQuiz()}>
        <DialogContent className="sm:max-w-2xl gap-0 p-0 overflow-hidden">
          {activeQuiz && (
            <>
              <div className="bg-primary/5 p-6 border-b border-primary/10">
                <div className="flex items-center justify-between">
                  <div>
                    <div className="flex items-center gap-2 mb-1">
                      <span className="text-xs font-semibold uppercase tracking-wider text-primary bg-primary/10 px-2 py-0.5 rounded-full">
                        {activeQuiz.course}
                      </span>
                    </div>
                    <DialogTitle className="text-2xl font-display text-slate-900">
                      {activeQuiz.title}
                    </DialogTitle>
                    <DialogDescription className="text-slate-500 mt-1">
                      {activeQuiz.module}
                    </DialogDescription>
                  </div>
                  <div className="flex flex-col items-end">
                    <div className="flex items-center gap-2 bg-white px-4 py-2 rounded-xl shadow-sm border border-slate-100">
                      <Timer
                        className={`w-5 h-5 ${timeLeft < 300 ? "text-red-500 animate-pulse" : "text-slate-400"}`}
                      />
                      <span
                        className={`font-mono text-xl font-bold tracking-tight ${timeLeft < 300 ? "text-red-500" : "text-slate-700"}`}
                      >
                        {formatTime(timeLeft)}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              <div className="p-6 space-y-6 bg-slate-50/50">
                <div className="space-y-4">
                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="font-medium text-slate-900 mb-4">
                      Question 1: Explain the core concepts of this module
                      inside a real-world scenario.
                    </p>
                    <div className="space-y-2">
                      {[
                        "Option A: Utilizing the framework natively",
                        "Option B: Deploying standalone instances",
                        "Option C: Implementing proxy patterns",
                        "Option D: Both A and C",
                      ].map((opt, i) => (
                        <label
                          key={i}
                          className="flex items-center gap-3 p-3 rounded-xl border border-slate-100 hover:border-primary hover:bg-primary/5 cursor-pointer transition-colors"
                        >
                          <input
                            type="radio"
                            name="q1"
                            className="text-primary focus:ring-primary w-4 h-4"
                          />
                          <span className="text-sm text-slate-700">{opt}</span>
                        </label>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white p-5 rounded-2xl border border-slate-100 shadow-sm">
                    <p className="font-medium text-slate-900 mb-4">
                      Question 2: Which of the following best describes the
                      expected behavior?
                    </p>
                    <textarea
                      className="w-full h-32 p-3 text-sm border-slate-200 rounded-xl focus:border-primary focus:ring-primary resize-none"
                      placeholder="Write your reasoning here..."
                    ></textarea>
                  </div>
                </div>
              </div>

              <div className="p-4 border-t border-slate-100 bg-white flex justify-between items-center">
                <Button
                  variant="ghost"
                  onClick={closeQuiz}
                  className="text-slate-500 hover:text-slate-700"
                >
                  <LogOut className="w-4 h-4 mr-2" /> Save & Exit
                </Button>
                <div className="space-x-3">
                  <Button variant="outline">Previous</Button>
                  <Button className="bg-primary hover:bg-primary/90 text-white">
                    Next Question
                  </Button>
                </div>
              </div>
            </>
          )}
        </DialogContent>
      </Dialog>

      <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>

        <div className="relative z-10 flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-900">
              Welcome back, {user?.name}!
            </h2>
            <p className="text-lg text-slate-500 mt-1">
              Here's an overview of your learning progress.
            </p>
          </div>
          <div className="glass border-none bg-white/70 backdrop-blur-xl px-6 py-3 rounded-2xl flex items-center gap-3 shrink-0">
            <div className="bg-accent/10 p-2 rounded-xl">
              <Award className="h-5 w-5 text-accent" />
            </div>
            <div>
              <p className="text-sm font-medium text-slate-900">
                Current Streak
              </p>
              <p className="text-xs text-slate-500">12 Days</p>
            </div>
          </div>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-3">
        <Card className="glass border-none shadow-lg shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex flex-row items-center justify-between !p-6 pb-4">
            <div className="text-sm font-medium text-slate-500">
              Courses Enrolled
            </div>
            <div className="bg-blue-50 p-2 rounded-xl shrink-0">
              <BookOpen className="h-4 w-4 text-blue-500" />
            </div>
          </div>
          <CardContent>
            <div className="text-3xl font-display font-bold text-slate-900">
              4
            </div>
            <p className="text-sm text-slate-500 mt-3 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+1</span> this
              semester
            </p>
          </CardContent>
        </Card>
        <Card className="glass border-none shadow-lg shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex flex-row items-center justify-between !p-6 pb-4">
            <div className="text-sm font-medium text-slate-500">
              Hours Learned
            </div>
            <div className="bg-purple-50 p-2 rounded-xl shrink-0">
              <Clock className="h-4 w-4 text-purple-500" />
            </div>
          </div>
          <CardContent>
            <div className="text-3xl font-display font-bold text-slate-900">
              32.5
            </div>
            <p className="text-sm text-slate-500 mt-3 flex items-center gap-1">
              <TrendingUp className="h-3 w-3 text-emerald-500" />
              <span className="text-emerald-500 font-medium">+2.5</span> from
              last week
            </p>
          </CardContent>
        </Card>
        <Card className="glass border-none shadow-lg shadow-slate-200/50 hover:-translate-y-1 transition-transform duration-300">
          <div className="flex flex-row items-center justify-between !p-6 pb-4">
            <div className="text-sm font-medium text-slate-500">
              Completed Tasks
            </div>
            <div className="bg-emerald-50 p-2 rounded-xl shrink-0">
              <CheckCircle2 className="h-4 w-4 text-emerald-500" />
            </div>
          </div>
          <CardContent>
            <div className="text-3xl font-display font-bold text-slate-900">
              12
            </div>
            <p className="text-sm text-slate-500 mt-3 flex items-center gap-1">
              <AlertCircle className="h-3 w-3 text-amber-500" />
              <span className="text-amber-500 font-medium">2</span> pending
              assignments
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid gap-6 md:grid-cols-7">
        <Card className="md:col-span-4 glass border-none shadow-xl shadow-slate-200/40">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Continue Learning
            </CardTitle>
            <CardDescription className="text-base">
              Pick up where you left off
            </CardDescription>
          </CardHeader>
          <CardContent className="space-y-8">
            {COURSE_PROGRESS.map((course, index) => (
              <div key={course.id} className="group relative block">
                <div className="absolute -inset-4 rounded-2xl bg-slate-50 opacity-0 transition-opacity group-hover:opacity-100" />
                <div className="relative flex flex-col gap-4">
                  <Link
                    to={`/courses/${course.id}`}
                    className="flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div
                        className={`flex h-12 w-12 shrink-0 items-center justify-center rounded-2xl ${course.color} ${course.iconColor}`}
                      >
                        {index % 2 === 0 ? (
                          <BookOpen className="h-6 w-6" />
                        ) : (
                          <Activity className="h-6 w-6" />
                        )}
                      </div>
                      <div className="space-y-1">
                        <p className="text-base font-medium leading-none text-slate-900 group-hover:text-primary transition-colors">
                          {course.name}
                        </p>
                        <p className="text-sm text-slate-500">
                          {course.module}
                        </p>
                      </div>
                    </div>
                    <div className="font-display text-lg font-semibold text-slate-900">
                      {course.progress}%
                    </div>
                  </Link>
                  <Progress
                    value={course.progress}
                    className="h-2 bg-slate-100 w-full"
                  />
                  <div className="flex justify-end pt-2">
                    <Button
                      size="sm"
                      onClick={() => handleTakeQuiz(course.name, course.module)}
                      className="bg-primary/10 text-primary hover:bg-primary/20 shadow-none border-none transition-colors"
                    >
                      <PlayCircle className="w-4 h-4 mr-2" />
                      Continue Learning
                    </Button>
                  </div>
                </div>
              </div>
            ))}
          </CardContent>
        </Card>

        <Card className="md:col-span-3 glass border-none shadow-xl shadow-slate-200/40">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Upcoming Deadlines
            </CardTitle>
            <CardDescription className="text-base">
              Tasks due in the next 7 days
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {DEADLINES.map((deadline) => {
                const IconComponent = deadline.icon;
                const isAlert = deadline.type === "alert";
                const bgColor = isAlert ? "bg-red-50" : "bg-amber-50";
                const textColor = isAlert ? "text-red-500" : "text-amber-500";
                const dateColor = isAlert ? "text-red-500" : "text-amber-600";

                return (
                  <div
                    key={deadline.id}
                    className={`group flex items-start gap-4 rounded-2xl border ${
                      isAlert ? "border-red-100" : "border-amber-100"
                    } ${bgColor} p-4 transition-colors hover:bg-white`}
                  >
                    <div className={`rounded-xl ${bgColor} p-2 shrink-0`}>
                      <IconComponent className={`h-5 w-5 ${textColor}`} />
                    </div>
                    <div className="space-y-1 flex-1 min-w-0">
                      <p className="text-sm font-medium leading-none text-slate-900 truncate">
                        {deadline.course}
                      </p>
                      <p
                        className={`text-sm font-medium flex items-center gap-1 ${dateColor}`}
                      >
                        <Calendar className="h-3 w-3 shrink-0" />{" "}
                        <span className="truncate">{deadline.date}</span>
                      </p>
                    </div>
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        handleTakeQuiz(
                          deadline.course.split(" ")[0],
                          deadline.course,
                        )
                      }
                      className="rounded-lg shrink-0 text-primary hover:bg-primary/10"
                    >
                      Take
                    </Button>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
