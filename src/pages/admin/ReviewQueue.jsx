import React, { useState } from "react";
import { useCourses } from "@/contexts/CourseContext";
import { Card, CardContent, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { CheckCircle, XCircle, Search, FileText } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { Input } from "@/components/ui/Input";

export function ReviewQueue() {
  const { courses, updateCourseStatus } = useCourses();
  const { toast } = useToast();
  const [searchTerm, setSearchTerm] = useState("");
  const [rejectModalOpen, setRejectModalOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState(null);
  const [feedback, setFeedback] = useState("");

  const pendingCourses = courses.filter(
    (c) => c.status === "Pending Review" && c.title.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleApprove = (courseId) => {
    updateCourseStatus(courseId, "Approved");
    toast({
      title: "Course Approved",
      description: "The course has been approved and published.",
      variant: "success",
    });
  };

  const openRejectModal = (course) => {
    setSelectedCourse(course);
    setFeedback("");
    setRejectModalOpen(true);
  };

  const handleReject = () => {
    if (!feedback.trim()) {
      toast({ title: "Error", description: "Feedback is required for rejection.", variant: "error" });
      return;
    }
    updateCourseStatus(selectedCourse.id, "Rejected", feedback);
    setRejectModalOpen(false);
    setSelectedCourse(null);
    toast({
      title: "Course Rejected",
      description: "Feedback sent to the teacher.",
      variant: "success",
    });
  };

  return (
    <div className="space-y-6 animate-in fade-in zoom-in-95 duration-500 relative">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Review Queue</h1>
          <p className="text-slate-500 mt-1">Review and approve pending courses.</p>
        </div>
      </div>

      <div className="relative w-full max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search pending courses..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          className="pl-9 bg-white/70"
        />
      </div>

      <div className="grid gap-6">
        {pendingCourses.length === 0 ? (
          <div className="py-12 text-center text-slate-500 glass rounded-2xl">
            <CheckCircle className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-lg font-medium">All caught up!</p>
            <p className="text-sm">There are no courses pending review.</p>
          </div>
        ) : (
          pendingCourses.map((course) => (
            <Card key={course.id} className="flex flex-col md:flex-row overflow-hidden glass hover:shadow-lg transition-all">
               <div className="md:w-1/4 h-48 md:h-auto">
                 <img src={course.thumbnail} alt={course.title} className="w-full h-full object-cover" />
               </div>
               <div className="flex-1 flex flex-col p-6">
                 <div className="flex justify-between items-start gap-4">
                   <div>
                     <span className="px-2.5 py-1 bg-yellow-100 text-yellow-800 text-xs font-semibold rounded-full border border-yellow-200 mb-3 inline-block">
                       Pending Review
                     </span>
                     <h3 className="text-xl font-bold text-slate-900 cursor-pointer hover:text-primary">{course.title}</h3>
                     <p className="text-sm text-slate-500 mt-1">{course.category} • {course.difficulty}</p>
                     <p className="text-sm text-slate-600 mt-3 line-clamp-2">{course.description}</p>
                   </div>
                 </div>
                 
                 <div className="mt-6 flex items-center gap-3">
                   <Button variant="outline" size="sm" className="bg-slate-50">
                     <FileText className="w-4 h-4 mr-2" />
                     {course.modules?.length || 0} Modules
                   </Button>
                 </div>

                 <div className="mt-auto pt-6 flex justify-end gap-3 border-t border-slate-100 mt-6">
                   <Button variant="outline" className="border-red-200 text-red-600 hover:bg-red-50" onClick={() => openRejectModal(course)}>
                     <XCircle className="w-4 h-4 mr-2" /> Reject
                   </Button>
                   <Button className="bg-green-600 hover:bg-green-700 text-white" onClick={() => handleApprove(course.id)}>
                     <CheckCircle className="w-4 h-4 mr-2" /> Approve
                   </Button>
                 </div>
               </div>
            </Card>
          ))
        )}
      </div>

      {rejectModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/50 backdrop-blur-sm animate-in fade-in duration-200">
          <Card className="w-full max-w-lg shadow-2xl scale-in-center">
            <CardHeader className="border-b border-slate-100 pb-4">
              <CardTitle>Reject Course</CardTitle>
            </CardHeader>
            <CardContent className="pt-6">
              <label className="block text-sm font-medium text-slate-700 mb-2">
                Provide feedback for the teacher
              </label>
              <textarea
                className="w-full flex min-h-[120px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                placeholder="Explain what needs to be changed..."
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
              />
            </CardContent>
            <CardFooter className="bg-slate-50 border-t border-slate-100 gap-3 justify-end rounded-b-xl py-4">
              <Button variant="ghost" onClick={() => setRejectModalOpen(false)}>Cancel</Button>
              <Button variant="destructive" onClick={handleReject}>Reject Course</Button>
            </CardFooter>
          </Card>
        </div>
      )}
    </div>
  );
}
