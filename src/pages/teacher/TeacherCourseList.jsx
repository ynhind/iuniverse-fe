import React from "react";
import { Link, useNavigate } from "react-router-dom";
import { useMyCoursesQuery, useUpdateCourseMutation, useDeleteCourseMutation } from "@/hooks/useTeacher";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Plus, BookOpen, Edit, Send, PlayCircle, Eye, Beaker, Trash2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";

export function TeacherCourseList() {
  const { data, isLoading } = useMyCoursesQuery();
  const updateCourseMutation = useUpdateCourseMutation();
  const deleteCourseMutation = useDeleteCourseMutation();
  const { user } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();

  let extractedData = data;
  if (data && typeof data === 'object' && !Array.isArray(data)) {
    extractedData = data.content || data.data || data.courses || [];
  }
  const courses = extractedData;
  const safeCourses = Array.isArray(courses) ? courses : [];

  const handleSubmitForReview = (courseId) => {
    updateCourseMutation.mutate({ id: courseId, data: { status: "Pending Review" } }, {
      onSuccess: () => {
        toast({
          title: "Course Submitted",
          description: "Your course has been submitted for admin review.",
          variant: "success",
        });
      },
      onError: () => {
        toast({
          title: "Submission Failed",
          description: "There was an error submitting your course. Please try again.",
          variant: "error",
        });
      }
    });
  };

  const handleDeleteCourse = (courseId) => {
    if (confirm("Are you sure you want to delete this course?")) {
      deleteCourseMutation.mutate(courseId, {
        onSuccess: () => toast({ title: "Deleted", description: "Course removed.", variant: "success" }),
        onError: () => toast({ title: "Error", description: "Could not delete course.", variant: "error" })
      });
    }
  };

  const statusColors = {
    "Draft": "bg-slate-100 text-slate-800",
    "Pending Review": "bg-yellow-100 text-yellow-800",
    "Approved": "bg-green-100 text-green-800",
    "Rejected": "bg-red-100 text-red-800",
  };

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">My Created Courses</h1>
          <p className="text-slate-500 mt-1">Manage and publish your educational content.</p>
        </div>
        <Button onClick={() => navigate("/create-course")} className="shrink-0 bg-primary hover:bg-primary/90 text-white gap-2">
          <Plus className="h-4 w-4" />
          Create New Course
        </Button>
      </div>

      <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
        {isLoading ? (
          <div className="col-span-full py-12 text-center text-slate-500 glass rounded-2xl">
            <span className="w-8 h-8 border-4 border-slate-300 border-t-primary rounded-full animate-spin inline-block mb-4" />
            <p className="text-lg font-medium">Loading courses...</p>
          </div>
        ) : safeCourses.length === 0 ? (
          <div className="col-span-full py-12 text-center text-slate-500 glass rounded-2xl">
            <Beaker className="mx-auto h-12 w-12 text-slate-300 mb-4" />
            <p className="text-lg font-medium">No courses yet</p>
            <p className="text-sm">Start creating your first course right now!</p>
          </div>
        ) : (
          safeCourses.map((course) => (
            <Card key={course.id} className="overflow-hidden transition-all hover:shadow-xl hover:-translate-y-1 glass border-white/40 group flex flex-col">
              <div className="relative aspect-video overflow-hidden">
                <img
                  src={course.thumbnail || "https://images.unsplash.com/photo-1518770660439-4636190af475?q=80&w=3270&auto=format&fit=crop"}
                  alt={course.courseName || course.title}
                  className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute top-4 right-4">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-semibold shadow-sm ${statusColors[course.status]}`}>
                    {course.status}
                  </span>
                </div>
              </div>
              <CardHeader className="flex-1">
                <div className="flex items-center justify-between gap-2 text-sm text-primary mb-2 font-medium">
                  <div className="flex items-center gap-1">
                    <BookOpen className="h-4 w-4" />
                    {course.category || "Uncategorized"}
                  </div>
                  {course.joinCode && (
                    <span className="px-2 py-0.5 bg-primary/10 rounded-md text-xs font-semibold">
                      Code: {course.joinCode}
                    </span>
                  )}
                </div>
                <CardTitle className="line-clamp-2 leading-snug hover:text-primary transition-colors cursor-pointer" onClick={() => navigate(`/create-course?id=${course.id}`)}>
                  {course.courseName || course.title || "Untitled Course"}
                </CardTitle>
                <CardDescription className="line-clamp-2 mt-2">
                  {course.description || "No description provided."}
                </CardDescription>
                {course.status === "Rejected" && course.feedback && (
                  <div className="mt-3 text-sm text-red-600 bg-red-50 p-3 rounded-lg border border-red-100">
                    <span className="font-semibold block mb-1">Feedback from Admin:</span>
                    {course.feedback}
                  </div>
                )}
              </CardHeader>
              <CardFooter className="bg-slate-50/50 border-t border-slate-100/50 p-4 flex items-center justify-between gap-2 mt-auto">
                <div className="flex space-x-2 w-full">
                  <Button variant="outline" size="sm" className="flex-1 border-slate-200" onClick={() => navigate(`/manage-course?id=${course.id}`)}>
                    <BookOpen className="h-4 w-4 mr-2 text-slate-500" />
                    Manage Content
                  </Button>
                  <Button variant="outline" size="sm" className="flex-1 border-slate-200" onClick={() => navigate(`/create-course?id=${course.id}`)}>
                    <Edit className="h-4 w-4 mr-2 text-slate-500" />
                    Edit Info
                  </Button>
                  {(course.status === "Draft" || course.status === "Rejected") && (
                    <>
                      <Button 
                        variant="primary" 
                        size="sm" 
                        className="flex-1 bg-indigo-600 hover:bg-indigo-700 text-white" 
                        onClick={() => handleSubmitForReview(course.id)}
                      >
                        <Send className="h-4 w-4 mr-2" />
                        Submit
                      </Button>
                      <Button 
                        variant="outline" 
                        size="icon" 
                        className="border-red-200 text-red-500 hover:bg-red-50 hover:text-red-600"
                        onClick={() => handleDeleteCourse(course.id)}
                        disabled={deleteCourseMutation.isPending}
                      >
                        <Trash2 className="h-4 w-4" />
                      </Button>
                    </>
                  )}
                  {course.status === "Approved" && (
                     <Button variant="outline" size="sm" className="flex-1 bg-green-50 text-green-700 border-green-200 hover:bg-green-100">
                     <Eye className="h-4 w-4 mr-2 relative top-[-1px]" />
                     View
                   </Button>
                  )}
                </div>
              </CardFooter>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
