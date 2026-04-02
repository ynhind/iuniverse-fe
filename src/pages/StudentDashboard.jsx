import React from "react";
import {
  BookOpen,
  Clock,
  CheckCircle2,
  Award,
  Users,
  Calendar,
  AlertCircle,
} from "lucide-react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Badge } from "@/components/ui/Badge";
import { Progress } from "@/components/ui/Progress";
import { Button } from "@/components/ui/Button";
import { useAuth } from "@/contexts/AuthContext";

function StatCard({ icon: Icon, label, value, color, bg }) {
  return (
    <Card className="card-hover">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {label}
        </CardTitle>
        <div className={`${bg} p-2 rounded-xl`}>
          <Icon className={`h-4 w-4 ${color}`} />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-display font-bold text-foreground">
          {value}
        </div>
      </CardContent>
    </Card>
  );
}

export function StudentDashboard() {
  const { user } = useAuth();

  const stats = [
    {
      icon: BookOpen,
      label: "Courses Enrolled",
      value: "4",
      color: "text-blue-500",
      bg: "bg-blue-50",
    },
    {
      icon: Clock,
      label: "Hours This Week",
      value: "12.5h",
      color: "text-purple-500",
      bg: "bg-purple-50",
    },
    {
      icon: CheckCircle2,
      label: "Lessons Completed",
      value: "28",
      color: "text-emerald-500",
      bg: "bg-emerald-50",
    },
    {
      icon: Award,
      label: "Certificates",
      value: "2",
      color: "text-amber-500",
      bg: "bg-amber-50",
    },
  ];

  const courses = [
    {
      id: 1,
      title: "React Advanced Patterns",
      progress: 65,
      lessons: "12/18",
      color: "from-primary",
    },
    {
      id: 2,
      title: "Node.js Microservices",
      progress: 30,
      lessons: "5/16",
      color: "from-secondary",
    },
    {
      id: 3,
      title: "TypeScript Masterclass",
      progress: 80,
      lessons: "20/24",
      color: "from-accent",
    },
    {
      id: 4,
      title: "JavaScript ES6+",
      progress: 45,
      lessons: "9/20",
      color: "from-info",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Welcome Section */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h2 className="font-display text-4xl font-semibold tracking-tight text-foreground">
            Welcome back, {user?.name}!
          </h2>
          <p className="text-lg text-muted-foreground mt-1">
            Here's an overview of your learning progress.
          </p>
        </div>
        <div className="glass-panel px-4 py-2 rounded-2xl flex items-center gap-3">
          <div className="bg-accent/10 p-2 rounded-xl">
            <Award className="h-5 w-5 text-accent" />
          </div>
          <div>
            <p className="text-sm font-medium text-foreground">
              Current Streak
            </p>
            <p className="text-xs text-muted-foreground">12 Days</p>
          </div>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-4">
        {stats.map((stat) => (
          <StatCard key={stat.label} {...stat} />
        ))}
      </div>

      {/* Continue Learning + Deadlines */}
      <div className="grid gap-6 md:grid-cols-7">
        {/* Courses Grid */}
        <div className="md:col-span-4">
          <h3 className="text-lg font-display font-semibold mb-4">
            Continue Learning
          </h3>
          <div className="grid gap-4">
            {courses.map((course) => (
              <div
                key={course.id}
                className="glass-panel p-5 rounded-2xl group hover:-translate-y-1 transition-transform"
              >
                <div className="flex items-center justify-between mb-3">
                  <div>
                    <h4 className="font-semibold text-foreground group-hover:text-primary transition-colors">
                      {course.title}
                    </h4>
                    <p className="text-xs text-muted-foreground mt-1">
                      {course.lessons} lessons
                    </p>
                  </div>
                  <Button
                    size="sm"
                    className="gradient-primary text-primary-foreground border-0"
                  >
                    Resume
                  </Button>
                </div>
                <Progress value={course.progress} className="h-2" />
                <p className="text-xs text-muted-foreground mt-2">
                  {course.progress}% complete
                </p>
              </div>
            ))}
          </div>
        </div>

        {/* Deadlines */}
        <div className="md:col-span-3">
          <h3 className="text-lg font-display font-semibold mb-4">
            Upcoming Deadlines
          </h3>
          <div className="space-y-3">
            <div className="group flex items-start gap-4 rounded-2xl border border-white/20 glass p-4 transition-colors hover:bg-white/60">
              <div className="rounded-xl bg-red-50 p-2 shrink-0">
                <AlertCircle className="h-5 w-5 text-red-500" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none text-foreground">
                  CS101: Midterm Project
                </p>
                <p className="text-xs text-red-600 font-semibold">
                  Tomorrow, 11:59 PM
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-4 rounded-2xl border border-white/20 glass p-4 transition-colors hover:bg-white/60">
              <div className="rounded-xl bg-amber-50 p-2 shrink-0">
                <Clock className="h-5 w-5 text-amber-600" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none text-foreground">
                  Quiz 2: Algorithms
                </p>
                <p className="text-xs text-amber-700 font-semibold">
                  Friday, 10:00 AM
                </p>
              </div>
            </div>

            <div className="group flex items-start gap-4 rounded-2xl border border-white/20 glass p-4 transition-colors hover:bg-white/60">
              <div className="rounded-xl bg-blue-50 p-2 shrink-0">
                <Calendar className="h-5 w-5 text-blue-600" />
              </div>
              <div className="space-y-1 flex-1">
                <p className="text-sm font-medium leading-none text-foreground">
                  Reading Assignment
                </p>
                <p className="text-xs text-blue-700 font-semibold">Next Week</p>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Announcements */}
      <div className="grid gap-6 md:grid-cols-2">
        <Card className="glass border-none shadow-xl shadow-slate-200/40">
          <CardHeader>
            <CardTitle className="font-display text-xl">
              Recent Announcements
            </CardTitle>
            <CardDescription className="text-base">
              Stay updated with course news
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  title: "New Assignment Posted",
                  course: "Introduction to Web Development",
                  time: "2 hours ago",
                },
                {
                  title: "Exam Schedule Updated",
                  course: "Check the calendar for new dates",
                  time: "1 day ago",
                },
                {
                  title: "Course Materials Available",
                  course: "Advanced JavaScript - Week 5",
                  time: "3 days ago",
                },
              ].map((item, i) => (
                <div
                  key={i}
                  className="pb-3 border-b border-white/20 last:pb-0 last:border-0"
                >
                  <p className="font-medium text-foreground text-sm">
                    {item.title}
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">
                    {item.course}
                  </p>
                  <p className="text-xs text-muted-foreground mt-0.5">
                    {item.time}
                  </p>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card className="glass border-none shadow-xl shadow-slate-200/40">
          <CardHeader>
            <CardTitle className="font-display text-xl">My Grades</CardTitle>
            <CardDescription className="text-base">
              Your recent assessment scores
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {[
                {
                  name: "CS101: Assignment 1",
                  score: "90/100",
                  status: "excellent",
                },
                { name: "MATH201: Quiz 1", score: "82/100", status: "good" },
                { name: "ENG102: Essay", score: "88/100", status: "excellent" },
              ].map((item, i) => (
                <div
                  key={i}
                  className="flex items-center justify-between pb-3 border-b border-white/20 last:pb-0 last:border-0"
                >
                  <p className="text-sm font-medium text-foreground">
                    {item.name}
                  </p>
                  <Badge
                    variant={
                      item.status === "excellent" ? "default" : "secondary"
                    }
                    className="text-xs"
                  >
                    {item.score}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
