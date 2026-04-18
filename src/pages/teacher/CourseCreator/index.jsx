import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BasicInfoTab } from "./BasicInfoTab";
import { SettingsTab } from "./SettingsTab";
import { Save, ArrowRight, CheckCircle2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import { useCreateCourseMutation, useUpdateCourseMutation, useCourseDetailQuery } from "@/hooks/useTeacher";

export function CourseCreator() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { user } = useAuth();
  
  const [activeTab, setActiveTab] = useState("basic");
  const [isSaving, setIsSaving] = useState(false);
  const [courseId, setCourseId] = useState(null);

  const createCourseMutation = useCreateCourseMutation();
  const updateCourseMutation = useUpdateCourseMutation();

  const [courseData, setCourseData] = useState({
    title: "",
    shortDescription: "",
    overview: "",
    subject: "",
    difficulty: "Beginner",
    language: "English",
    duration: "",
    visibility: "Private",
    startDate: "",
    dripRelease: false,
    status: "Draft",
    feedback: "",
  });

  const params = new URLSearchParams(location.search);
  const idFromUrl = params.get("id");
  const { data: courseDataApi } = useCourseDetailQuery(idFromUrl);

  useEffect(() => {
    if (idFromUrl && courseDataApi) {
      const existingCourse = courseDataApi.data || courseDataApi;
      
      // Authorization Check
      if (existingCourse.teacherId && user && existingCourse.teacherId !== user.id) {
         toast({ title: "Access Denied", description: "You don't have permission to edit this course.", variant: "error" });
         navigate('/teacher/courses');
         return;
      }
      
      setCourseId(idFromUrl);
      setCourseData(prev => ({ ...prev, ...existingCourse, title: existingCourse.courseName || existingCourse.title }));
    }
  }, [idFromUrl, courseDataApi, user, navigate, toast]);

  const updateCourseData = (newData) => {
    setCourseData(prev => ({ ...prev, ...newData }));
  };

  const handleSaveAndContinue = async () => {
    if (!courseData.title) {
      toast({ title: "Validation Error", description: "Course Title is required.", variant: "error" });
      return;
    }

    setIsSaving(true);
    try {
      let currentCourseId = courseId;
      if (!courseId) {
         const createPayload = {
           courseName: courseData.title,
           description: courseData.shortDescription || courseData.overview || "description",
           semesterId: courseData.semesterId ? parseInt(courseData.semesterId) : 1, 
           courseID: courseData.courseID ? parseInt(courseData.courseID) : 1
         };
         const crs = await createCourseMutation.mutateAsync(createPayload);
         currentCourseId = crs?.id || crs?.courseID || 1; 
      } else {
         const updatePayload = {
           courseName: courseData.title,
           description: courseData.shortDescription || courseData.overview || "description",
           semesterId: courseData.semesterId ? parseInt(courseData.semesterId) : 1, 
           joinCode: courseData.joinCode || ""
         };
         await updateCourseMutation.mutateAsync({ id: courseId, data: updatePayload });
      }

      setIsSaving(false);
      toast({ title: "Course Info Saved", description: "Proceed to manage curriculum.", variant: "success" });
      navigate(`/manage-course?id=${currentCourseId}`);
    } catch (e) {
      setIsSaving(false);
      toast({ title: "Save Failed", description: "An error occurred.", variant: "error" });
    }
  };

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] -mx-6 -my-6 md:-mx-8 md:-my-8 bg-slate-50 relative">
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 shadow-sm">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <h1 className="text-2xl font-bold text-slate-800">{courseId ? "Edit Course Info" : "Create New Course"}</h1>
             <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${courseData.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-slate-100 text-slate-800 border-slate-200'}`}>
               {courseData.status || 'Draft'}
             </span>
           </div>
           <p className="text-sm text-slate-500">Provide basic information to get started.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handleSaveAndContinue}
            disabled={isSaving} 
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isSaving ? (
               <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
            ) : (
               <ArrowRight className="w-4 h-4" /> 
            )}
            Save & Continue to Curriculum
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar">
           <div className="max-w-4xl mx-auto space-y-8">
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button 
                  onClick={() => setActiveTab('basic')}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'basic' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  1. Basic Information
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  2. Settings & Access
                </button>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
                {activeTab === 'basic' && <BasicInfoTab courseData={courseData} updateCourseData={updateCourseData} />}
                {activeTab === 'settings' && <SettingsTab courseData={courseData} updateCourseData={updateCourseData} />}
              </div>
           </div>
        </div>

        <aside className="w-80 bg-white border-l border-slate-200 flex-none hidden lg:flex flex-col z-0">
          <div className="p-6 overflow-y-auto">
            <h3 className="font-semibold text-slate-800 mb-4 px-1">Setup Checklist</h3>
            <ul className="space-y-3 px-1">
              <li className="flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${courseData.title ? 'text-emerald-500' : 'text-slate-300'}`} />
                <div>
                  <span className={`text-sm font-medium ${courseData.title ? 'text-slate-700' : 'text-slate-500'}`}>Basic Info Complete</span>
                  <p className="text-xs text-slate-400 mt-0.5">Title, description, category</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 text-slate-300 flex-shrink-0 mt-0.5`} />
                <div>
                  <span className={`text-sm font-medium text-slate-500`}>Curriculum Added</span>
                  <p className="text-xs text-slate-400 mt-0.5">Next step after saving</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>
    </div>
  );
}
