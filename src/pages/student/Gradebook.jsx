import React from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { FileText } from "lucide-react";

export function StudentGradebook() {
  const { user } = useAuth();

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-900">
          My Grades
        </h2>
        <p className="text-lg text-slate-500 mt-1">
          Track your academic performance across all courses.
        </p>
      </div>

      <Card className="glass border-none shadow-xl shadow-slate-200/40">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Gradebook Coming Soon
          </CardTitle>
          <CardDescription className="text-base">
            Your grades and academic records will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 rounded-2xl bg-slate-50/50 border border-slate-100">
            <div className="text-center">
              <FileText className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">
                Gradebook coming soon
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
