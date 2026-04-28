import React, { useEffect, useMemo, useState } from "react";
import { Card, CardHeader } from "@/components/ui/Card";
import { Input } from "@/components/ui/Input";
import { Button } from "@/components/ui/Button";
import { Search, ChevronRight, BookOpen, Star } from "lucide-react";
import { useCourseStudentsQuery, useMyCoursesQuery } from "@/hooks/useTeacher";
import { ModalWrapper } from "@/components/teacher/shared/ModalWrapper";

export function StudentSubmissions() {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState("");
  
  // Grading Modal State
  const [isGradeModalOpen, setIsGradeModalOpen] = useState(false);
  const [selectedStudent, setSelectedStudent] = useState(null);
  const [gradeScore, setGradeScore] = useState("");
  const [gradeFeedback, setGradeFeedback] = useState("");

  // Inline Grading State
  const [gradesMap, setGradesMap] = useState({});

  const { data: coursesData, isLoading: isCoursesLoading } = useMyCoursesQuery();

  const courses = useMemo(() => {
    if (Array.isArray(coursesData)) return coursesData;
    if (Array.isArray(coursesData?.data)) return coursesData.data;
    if (Array.isArray(coursesData?.content)) return coursesData.content;
    return [];
  }, [coursesData]);

  useEffect(() => {
    if (courses.length > 0 && !selectedCourseId) {
      const firstCourseId = courses[0]?.id ?? courses[0]?.courseId ?? "";
      if (firstCourseId) {
        setSelectedCourseId(String(firstCourseId));
      }
    }
  }, [courses, selectedCourseId]);

  // Load gradesMap when course changes
  useEffect(() => {
    if (selectedCourseId) {
      const existingGradesStr = localStorage.getItem("lms_student_grades");
      if (existingGradesStr) {
        const allGrades = JSON.parse(existingGradesStr);
        const newMap = {};
        allGrades.forEach(g => {
          if (g.courseId === selectedCourseId) {
            newMap[g.studentId] = g.score;
          }
        });
        setGradesMap(newMap);
      } else {
        setGradesMap({});
      }
    }
  }, [selectedCourseId]);

  const {
    data: studentsData,
    isLoading: isStudentsLoading,
  } = useCourseStudentsQuery(selectedCourseId);

  const students = useMemo(() => {
    if (Array.isArray(studentsData)) return studentsData;
    if (Array.isArray(studentsData?.data)) return studentsData.data;
    if (Array.isArray(studentsData?.content)) return studentsData.content;
    return [];
  }, [studentsData]);

  const filteredStudents = useMemo(() => {
    return students.filter((student) => {
      const name = student?.name || student?.fullName || "";
      const email = student?.email || "";
      const keyword = searchTerm.toLowerCase();

      return (
        name.toLowerCase().includes(keyword) ||
        email.toLowerCase().includes(keyword)
      );
    });
  }, [students, searchTerm]);

  const saveInlineGrade = (student, score) => {
    if (!selectedCourseId) return;
    const studentId = student?.id ?? student?.userId ?? student?.studentId;
    
    // Find if existing grade has feedback to preserve it
    let grades = [];
    const existingGradesStr = localStorage.getItem("lms_student_grades");
    if (existingGradesStr) {
      grades = JSON.parse(existingGradesStr);
    }
    const existingGrade = grades.find(g => g.studentId === String(studentId) && g.courseId === selectedCourseId);
    
    const course = courses.find(c => String(c.id || c.courseId) === selectedCourseId);
    const courseName = course?.courseName ?? course?.title ?? "Untitled Course";
    
    const newGrade = {
      id: existingGrade ? existingGrade.id : Date.now().toString(),
      studentId: String(studentId),
      studentEmail: student?.email || "",
      courseId: selectedCourseId,
      courseName: courseName,
      score: score,
      feedback: existingGrade ? existingGrade.feedback : "",
      dateGraded: new Date().toISOString()
    };

    grades = grades.filter(g => !(g.studentId === String(studentId) && g.courseId === selectedCourseId));
    grades.push(newGrade);
    localStorage.setItem("lms_student_grades", JSON.stringify(grades));
    
    // Optional UI visual feedback could go here (e.g. Toast)
  };

  const handleInlineScoreChange = (studentId, value) => {
    setGradesMap(prev => ({ ...prev, [studentId]: value }));
  };

  const handleInlineScoreKeyDown = (e, student, value) => {
    if (e.key === "Enter") {
      e.target.blur(); // Triggers onBlur which saves it
    }
  };

  const openGradeModal = (student) => {
    setSelectedStudent(student);
    
    // Load existing grade if any
    const existingGradesStr = localStorage.getItem("lms_student_grades");
    if (existingGradesStr) {
      const grades = JSON.parse(existingGradesStr);
      const studentId = student?.id ?? student?.userId ?? student?.studentId;
      const existingGrade = grades.find(g => g.studentId === String(studentId) && g.courseId === selectedCourseId);
      
      if (existingGrade) {
        setGradeScore(existingGrade.score);
        setGradeFeedback(existingGrade.feedback);
      } else {
        setGradeScore("");
        setGradeFeedback("");
      }
    } else {
      setGradeScore("");
      setGradeFeedback("");
    }
    
    setIsGradeModalOpen(true);
  };

  const handleSaveGrade = (e) => {
    e.preventDefault();
    if (!selectedStudent || !selectedCourseId) return;

    const studentId = selectedStudent?.id ?? selectedStudent?.userId ?? selectedStudent?.studentId;
    const course = courses.find(c => String(c.id || c.courseId) === selectedCourseId);
    const courseName = course?.courseName ?? course?.title ?? "Untitled Course";
    
    const newGrade = {
      id: Date.now().toString(),
      studentId: String(studentId),
      studentEmail: selectedStudent?.email || "",
      courseId: selectedCourseId,
      courseName: courseName,
      score: gradeScore,
      feedback: gradeFeedback,
      dateGraded: new Date().toISOString()
    };

    let grades = [];
    const existingGradesStr = localStorage.getItem("lms_student_grades");
    if (existingGradesStr) {
      grades = JSON.parse(existingGradesStr);
    }

    // Remove old grade for this student & course
    grades = grades.filter(g => !(g.studentId === String(studentId) && g.courseId === selectedCourseId));
    
    // Add new grade
    grades.push(newGrade);
    localStorage.setItem("lms_student_grades", JSON.stringify(grades));

    // Update inline map
    setGradesMap(prev => ({ ...prev, [studentId]: gradeScore }));

    setIsGradeModalOpen(false);
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">
            Enrolled Students & Activity
          </h1>
          <p className="text-slate-500 mt-1">
            Review the students participating in your courses and grade them.
          </p>
        </div>
      </div>

      <Card className="glass border-white/40 shadow-xl overflow-hidden">
        <CardHeader className="bg-white/50 border-b border-slate-200/50 pb-4">
          <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
            <div className="flex w-full md:w-auto items-center gap-2">
              <BookOpen className="text-slate-400 h-5 w-5" />
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="flex-1 bg-white border border-slate-200 rounded-xl h-10 px-3 text-sm focus:ring-primary/20"
                disabled={isCoursesLoading || courses.length === 0}
              >
                <option value="" disabled>
                  {isCoursesLoading
                    ? "Loading courses..."
                    : "Select Course to view students"}
                </option>

                {courses.map((course) => {
                  const courseId = course?.id ?? course?.courseId;
                  const courseName = course?.courseName ?? course?.title ?? "Untitled Course";

                  return (
                    <option key={courseId} value={String(courseId)}>
                      {courseName}
                    </option>
                  );
                })}
              </select>
            </div>

            <div className="relative w-full md:max-w-xs">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search students..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-9 bg-white/70 border-slate-200"
              />
            </div>
          </div>
        </CardHeader>

        <div className="p-0 overflow-x-auto">
          <table className="w-full text-sm text-left">
            <thead className="text-xs text-slate-500 uppercase bg-slate-50/50 border-b border-slate-200/50">
              <tr>
                <th className="px-6 py-4 font-medium">Student Name</th>
                <th className="px-6 py-4 font-medium">Email Address</th>
                <th className="px-6 py-4 font-medium w-32">Score</th>
                <th className="px-6 py-4 font-medium text-right">Action</th>
              </tr>
            </thead>

            <tbody>
              {isStudentsLoading ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    Loading students...
                  </td>
                </tr>
              ) : !selectedCourseId ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    Please select a course.
                  </td>
                </tr>
              ) : filteredStudents.length === 0 ? (
                <tr>
                  <td colSpan="4" className="px-6 py-12 text-center text-slate-500">
                    No students currently enrolled in this course.
                  </td>
                </tr>
              ) : (
                filteredStudents.map((student) => {
                  const studentId = student?.id ?? student?.userId ?? student?.studentId;
                  const studentName = student?.name ?? student?.fullName ?? "Unnamed Student";
                  const studentEmail = student?.email ?? "No email";

                  return (
                    <tr
                      key={studentId}
                      className="border-b border-slate-100 last:border-0 hover:bg-slate-50/30 transition-colors"
                    >
                      <td className="px-6 py-4 font-medium text-slate-900">
                        <div className="flex items-center gap-3">
                          <div className="h-8 w-8 rounded-full bg-primary/10 text-primary flex items-center justify-center font-bold">
                            {studentName.charAt(0).toUpperCase()}
                          </div>
                          {studentName}
                        </div>
                      </td>

                      <td className="px-6 py-4">
                        <div className="text-slate-500">{studentEmail}</div>
                      </td>

                      <td className="px-6 py-4">
                        <Input
                          type="number"
                          min="0"
                          max="100"
                          placeholder="0-100"
                          className="w-20 text-center h-8 bg-white"
                          value={gradesMap[studentId] || ""}
                          onChange={(e) => handleInlineScoreChange(studentId, e.target.value)}
                          onKeyDown={(e) => handleInlineScoreKeyDown(e, student, gradesMap[studentId])}
                          onBlur={() => saveInlineGrade(student, gradesMap[studentId])}
                        />
                      </td>

                      <td className="px-6 py-4 text-right">
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => openGradeModal(student)}
                          className="text-primary hover:text-primary hover:bg-primary/10"
                        >
                          <Star className="mr-1 h-4 w-4" />
                          Grade / Feedback
                        </Button>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </Card>

      <ModalWrapper
        isOpen={isGradeModalOpen}
        onClose={() => setIsGradeModalOpen(false)}
        title={`Grade Student: ${selectedStudent?.name || selectedStudent?.fullName || 'Unknown'}`}
      >
        <form onSubmit={handleSaveGrade} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Score / Grade</label>
            <Input 
              required
              type="number"
              min="0"
              max="100"
              placeholder="e.g. 85"
              value={gradeScore}
              onChange={(e) => setGradeScore(e.target.value)}
              className="w-full"
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-medium text-slate-700">Feedback (Optional)</label>
            <textarea
              className="w-full bg-white border border-slate-200 rounded-xl p-3 text-sm focus:ring-primary/20 min-h-[100px] focus:outline-none focus:border-primary"
              placeholder="Provide feedback on the student's progress..."
              value={gradeFeedback}
              onChange={(e) => setGradeFeedback(e.target.value)}
            />
          </div>
          
          <div className="pt-4 flex justify-end gap-3">
            <Button type="button" variant="outline" onClick={() => setIsGradeModalOpen(false)}>
              Cancel
            </Button>
            <Button type="submit">
              Save Grade
            </Button>
          </div>
        </form>
      </ModalWrapper>
    </div>
  );
}