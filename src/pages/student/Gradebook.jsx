import React, { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/Table";
import { Badge } from "@/components/ui/Badge";
import { FileText, Award, Calendar, BookOpen } from "lucide-react";

export function StudentGradebook() {
  const { user } = useAuth();
  const [grades, setGrades] = useState([]);

  useEffect(() => {
    if (user) {
      const storedGradesStr = localStorage.getItem("lms_student_grades");
      if (storedGradesStr) {
        const allGrades = JSON.parse(storedGradesStr);
        // Filter grades for the logged in user based on email or ID
        const userGrades = allGrades.filter(
          (g) => g.studentId === String(user.id) || g.studentEmail === user.email
        );
        setGrades(userGrades.sort((a, b) => new Date(b.dateGraded) - new Date(a.dateGraded)));
      }
    }
  }, [user]);

  const getScoreColor = (scoreStr) => {
    const score = Number(scoreStr);
    if (isNaN(score)) return "bg-slate-100 text-slate-700";
    if (score >= 90) return "bg-emerald-100 text-emerald-700 border-emerald-200";
    if (score >= 70) return "bg-blue-100 text-blue-700 border-blue-200";
    if (score >= 50) return "bg-amber-100 text-amber-700 border-amber-200";
    return "bg-red-100 text-red-700 border-red-200";
  };

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

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="glass border-white/40 shadow-xl col-span-1 md:col-span-3">
          <CardHeader className="bg-white/40 border-b border-slate-100/50 pb-4">
            <div className="flex items-center gap-3">
              <div className="p-2.5 bg-primary/10 rounded-xl text-primary">
                <Award className="w-5 h-5" />
              </div>
              <div>
                <CardTitle className="font-display text-xl">Recent Course Grades</CardTitle>
                <CardDescription>
                  Your performance in completed courses and assignments.
                </CardDescription>
              </div>
            </div>
          </CardHeader>
          <CardContent className="p-0">
            {grades.length === 0 ? (
              <div className="flex flex-col items-center justify-center p-12 text-center">
                <FileText className="h-16 w-16 text-slate-200 mb-4" />
                <h3 className="text-lg font-semibold text-slate-800 mb-1">No grades yet</h3>
                <p className="text-slate-500 max-w-sm">
                  You haven't received any grades for your courses yet. Complete assignments and wait for teacher feedback.
                </p>
              </div>
            ) : (
              <Table>
                <TableHeader className="bg-slate-50/50">
                  <TableRow className="border-slate-100/50">
                    <TableHead className="font-semibold text-slate-600 pl-6">Course</TableHead>
                    <TableHead className="font-semibold text-slate-600">Date Graded</TableHead>
                    <TableHead className="font-semibold text-slate-600">Score</TableHead>
                    <TableHead className="font-semibold text-slate-600 pr-6">Feedback</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {grades.map((grade) => (
                    <TableRow key={grade.id} className="hover:bg-slate-50/50 border-slate-100/50">
                      <TableCell className="pl-6 py-4">
                        <div className="flex items-center gap-3">
                          <div className="p-2 bg-slate-100 rounded-lg text-slate-500 hidden sm:block">
                            <BookOpen className="w-4 h-4" />
                          </div>
                          <span className="font-medium text-slate-900">{grade.courseName}</span>
                        </div>
                      </TableCell>
                      <TableCell className="text-slate-500 whitespace-nowrap">
                        <div className="flex items-center gap-1.5">
                          <Calendar className="w-3.5 h-3.5" />
                          {new Date(grade.dateGraded).toLocaleDateString()}
                        </div>
                      </TableCell>
                      <TableCell>
                        <Badge
                          variant="outline"
                          className={`text-sm font-semibold px-2.5 py-0.5 border ${getScoreColor(grade.score)}`}
                        >
                          {grade.score} / 100
                        </Badge>
                      </TableCell>
                      <TableCell className="pr-6 text-slate-600">
                        {grade.feedback ? (
                          <span className="text-sm line-clamp-2" title={grade.feedback}>
                            {grade.feedback}
                          </span>
                        ) : (
                          <span className="text-sm italic text-slate-400">No feedback provided</span>
                        )}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
