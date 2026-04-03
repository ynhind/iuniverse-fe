import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  AlertCircle,
  TrendingUp,
  Award,
  Activity,
  Calendar,
} from "lucide-react";
import { Progress } from "@/components/ui/Progress";

export function StudentDashboard() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
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
            <div className="group relative">
              <div className="absolute -inset-2 rounded-2xl bg-slate-50 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-blue-100 text-blue-600">
                    <BookOpen className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium leading-none text-slate-900">
                      CS101: Introduction to Computer Science
                    </p>
                    <p className="text-sm text-slate-500">
                      Module 3: Data Structures
                    </p>
                  </div>
                </div>
                <div className="font-display text-lg font-semibold text-slate-900">
                  65%
                </div>
              </div>
              <Progress value={65} className="mt-4 h-2 bg-slate-100" />
            </div>

            <div className="group relative">
              <div className="absolute -inset-2 rounded-2xl bg-slate-50 opacity-0 transition-opacity group-hover:opacity-100" />
              <div className="relative flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-purple-100 text-purple-600">
                    <Activity className="h-6 w-6" />
                  </div>
                  <div className="space-y-1">
                    <p className="text-base font-medium leading-none text-slate-900">
                      MATH201: Linear Algebra
                    </p>
                    <p className="text-sm text-slate-500">Module 2: Matrices</p>
                  </div>
                </div>
                <div className="font-display text-lg font-semibold text-slate-900">
                  30%
                </div>
              </div>
              <Progress value={30} className="mt-4 h-2 bg-slate-100" />
            </div>
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
              <div className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white/50 p-4 transition-colors hover:bg-white">
                <div className="rounded-xl bg-red-50 p-2">
                  <AlertCircle className="h-5 w-5 text-red-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900">
                    CS101 Midterm Project
                  </p>
                  <p className="text-sm text-red-500 font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Tomorrow, 11:59 PM
                  </p>
                </div>
              </div>
              <div className="group flex items-start gap-4 rounded-2xl border border-slate-100 bg-white/50 p-4 transition-colors hover:bg-white">
                <div className="rounded-xl bg-amber-50 p-2">
                  <Clock className="h-5 w-5 text-amber-500" />
                </div>
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none text-slate-900">
                    MATH201 Quiz 2
                  </p>
                  <p className="text-sm text-amber-600 font-medium flex items-center gap-1">
                    <Calendar className="h-3 w-3" /> Friday, 10:00 AM
                  </p>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
