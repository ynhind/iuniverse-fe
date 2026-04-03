import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import { Calendar } from "lucide-react";

export function StudentSchedule() {
  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div>
        <h2 className="font-display text-4xl font-semibold tracking-tight text-slate-900">
          Schedule
        </h2>
        <p className="text-lg text-slate-500 mt-1">
          Manage your classes and assignments.
        </p>
      </div>

      <Card className="glass border-none shadow-xl shadow-slate-200/40">
        <CardHeader>
          <CardTitle className="font-display text-2xl">
            Schedule Coming Soon
          </CardTitle>
          <CardDescription className="text-base">
            Your weekly schedule and calendar will be displayed here.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center justify-center h-64 rounded-2xl bg-slate-50/50 border border-slate-100">
            <div className="text-center">
              <Calendar className="h-16 w-16 text-slate-300 mx-auto mb-4" />
              <p className="text-slate-500 font-medium">
                Schedule view coming soon
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
