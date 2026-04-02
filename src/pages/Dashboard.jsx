import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { BookOpen, Clock, CheckCircle2, Award } from "lucide-react";

export function Dashboard() {
  const { user } = useAuth();

  const stats = [
    {
      icon: BookOpen,
      label: "Active Courses",
      value: "4",
      color: "text-blue-600",
      bg: "bg-blue-100",
    },
    {
      icon: Clock,
      label: "Hours This Week",
      value: "12.5h",
      color: "text-purple-600",
      bg: "bg-purple-100",
    },
    {
      icon: CheckCircle2,
      label: "Completed Tasks",
      value: "28",
      color: "text-green-600",
      bg: "bg-green-100",
    },
    {
      icon: Award,
      label: "Certificates",
      value: "2",
      color: "text-amber-600",
      bg: "bg-amber-100",
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-900">
          Dashboard
        </h2>
        <p className="text-lg text-slate-500 mt-1">
          Welcome back, {user?.name}! 👋
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {stats.map((stat) => (
          <Card
            key={stat.label}
            className="glass border-none shadow-xl shadow-slate-200/40 hover:-translate-y-1 transition-all duration-300"
          >
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm font-medium text-slate-600">
                  {stat.label}
                </CardTitle>
                <div className={`${stat.bg} p-2 rounded-lg`}>
                  <stat.icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
            </CardHeader>
            <CardContent>
              <div className="font-display text-3xl font-bold text-slate-900">
                {stat.value}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      <Card className="glass border-none shadow-xl shadow-slate-200/40">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Continue Learning
          </CardTitle>
          <CardDescription>Pick up where you left off</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="p-4 rounded-xl border border-slate-100 bg-white/40 hover:bg-white/60 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-900">
                React Advanced Patterns
              </h4>
              <span className="text-sm font-medium text-slate-600">65%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary"
                style={{ width: "65%" }}
              ></div>
            </div>
          </div>
          <div className="p-4 rounded-xl border border-slate-100 bg-white/40 hover:bg-white/60 transition-colors">
            <div className="flex items-center justify-between mb-2">
              <h4 className="font-semibold text-slate-900">
                Node.js Microservices
              </h4>
              <span className="text-sm font-medium text-slate-600">30%</span>
            </div>
            <div className="h-2 bg-slate-200 rounded-full overflow-hidden">
              <div
                className="h-full gradient-primary"
                style={{ width: "30%" }}
              ></div>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
