import React, { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, CheckCircle, XCircle, Clock, ChevronRight, Filter } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";

export function StudentSubmissions() {
  const { user } = useAuth();
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");

  const [submissions, setSubmissions] = useState([
    {
      id: "sub1",
      studentName: "Alice Smith",
      course: "Introduction to React",
      problemSet: "React Basics Quiz",
      submittedAt: "2 hours ago",
      score: 85,
      status: "Graded",
    },
    {
      id: "sub2",
      studentName: "Bob Johnson",
      course: "Introduction to React",
      problemSet: "React Components Challenge",
      submittedAt: "3 hours ago",
      score: null,
      status: "Needs Grading",
    },
    {
      id: "sub3",
      studentName: "Charlie Davis",
      course: "Advanced Data Structures",
      problemSet: "Trees Implementation",
      submittedAt: "1 day ago",
      score: 92,
      status: "Graded",
    }
  ]);

  const filteredSubmissions = submissions.filter((sub) => {
    const matchesSearch = sub.studentName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                          sub.problemSet.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === "All" || sub.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Student Submissions</h1>
          <p className="text-slate-500 mt-1">Review and grade problem sets submitted by your students.</p>
        </div>
      </div>

      <Card className="glass border-white/40 shadow-xl overflow-hidden">
        <CardHeader className="bg-white/50 border-b border-slate-200/50 pb-4">
          <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
            <div className="relative w-full sm:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search students or sets..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/70 border-slate-200"
              />
            </div>
            <div className="flex gap-2 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {["All", "Needs Grading", "Graded"].map(status => (
                <Button
                  key={status}
                  variant={statusFilter === status ? "default" : "outline"}
                  size="sm"
                  onClick={() => setStatusFilter(status)}
                  className={`whitespace-nowrap ${statusFilter === status ? 'bg-primary text-white' : 'bg-white/50 border-slate-200'}`}
                >
                  {status}
                </Button>
              ))}
            </div>
          </div>
        </CardHeader>
        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200/50">
              <tr>
                <th className="px-6 py-4 font-medium">Student</th>
                <th className="px-6 py-4 font-medium">Course / Problem Set</th>
                <th className="px-6 py-4 font-medium">Submitted</th>
                <th className="px-6 py-4 font-medium">Status / Score</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredSubmissions.length === 0 ? (
                <tr>
                  <td colSpan="5" className="px-6 py-12 text-center text-slate-500">
                    No submissions found matching your criteria.
                  </td>
                </tr>
              ) : (
                filteredSubmissions.map((sub) => (
                  <tr key={sub.id} className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors">
                    <td className="px-6 py-4 font-medium text-slate-900">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                          {sub.studentName.charAt(0)}
                        </div>
                        {sub.studentName}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="font-medium text-slate-800">{sub.problemSet}</div>
                      <div className="text-xs text-slate-500 mt-1">{sub.course}</div>
                    </td>
                    <td className="px-6 py-4 text-slate-500">
                      <div className="flex items-center gap-1.5">
                        <Clock className="h-4 w-4" />
                        {sub.submittedAt}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      {sub.status === "Graded" ? (
                        <div className="flex items-center gap-1.5 text-green-600 font-medium bg-green-50 w-fit px-2.5 py-1 rounded-full">
                          <CheckCircle className="h-4 w-4" />
                          Score: {sub.score}%
                        </div>
                      ) : (
                        <div className="flex items-center gap-1.5 text-orange-600 font-medium bg-orange-50 w-fit px-2.5 py-1 rounded-full">
                          <XCircle className="h-4 w-4" />
                          Needs Grading
                        </div>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <Button variant="ghost" size="sm" className="text-primary hover:text-primary hover:bg-primary/10">
                        {sub.status === "Graded" ? "View" : "Grade"}
                        <ChevronRight className="ml-1 h-4 w-4" />
                      </Button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </Card>
    </div>
  );
}
