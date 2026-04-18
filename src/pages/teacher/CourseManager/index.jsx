import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { CurriculumBuilder } from "./CurriculumBuilder";
import { VideoModal, ResourceModal, AssignmentModal, QuizModal } from "./Modals/ItemModals";
import { ArrowLeft, Save, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  useCourseDetailQuery,
  useUpdateCourseMutation,
  useCreateModuleMutation,
  useUpdateModuleMutation,
  useAddMaterialMutation,
  useCreateProblemSetMutation
} from "@/hooks/useTeacher";

export function CourseManager() {
  const { toast } = useToast();
  const { user } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const params = new URLSearchParams(location.search);
  const courseId = params.get("id");

  const { data: courseDataApi, isLoading, refetch } = useCourseDetailQuery(courseId);
  
  const updateCourseMutation = useUpdateCourseMutation();
  const createModuleMutation = useCreateModuleMutation();
  const addMaterialMutation = useAddMaterialMutation();
  const createProblemSetMutation = useCreateProblemSetMutation();

  const [isPublishing, setIsPublishing] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState(null);
  const [activeModal, setActiveModal] = useState(null); 
  const [modules, setModules] = useState([]);

  useEffect(() => {
    if (courseDataApi) {
      const existingCourse = courseDataApi.data || courseDataApi;
      
      // Authorization Check
      if (existingCourse.teacherId && user && existingCourse.teacherId !== user.id) {
         toast({ title: "Access Denied", description: "You don't have permission to manage this course.", variant: "error" });
         navigate('/teacher/courses');
         return;
      }

      let rawModules = existingCourse.modules || [];
      const normalizedModules = rawModules.map(mod => ({
        ...mod,
        id: mod.id || mod.moduleId,
        items: [
           ...(mod.materials || []).map(m => ({ ...m, type: m.type?.toLowerCase() || 'resource' })),
           ...(mod.problemSets || []).map(p => ({ ...p, type: 'quiz' })),
           ...(mod.items || []) // fallback for local items
        ]
      }));
      setModules(normalizedModules);
    }
  }, [courseDataApi, user, navigate, toast]);

  const handlePublish = async () => {
    if (modules.length === 0 || modules.reduce((a, m) => a + (m.items || m.materials || m.problemSets || []).length, 0) === 0) {
      toast({ title: "Validation Error", description: "At least one module and one item are required to submit.", variant: "error" });
      return;
    }

    setIsPublishing(true);
    try {
      await updateCourseMutation.mutateAsync({ id: courseId, data: { status: "Pending Review" } });
      setIsPublishing(false);
      toast({ title: "Course Submitted!", description: "Your course is pending admin review.", variant: "success" });
      navigate("/teacher/courses");
    } catch (e) {
      setIsPublishing(false);
      toast({ title: "Submission Failed", description: "An error occurred.", variant: "error" });
    }
  };

  const openModal = (type, moduleId) => {
    setTargetModuleId(moduleId);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setTargetModuleId(null);
  };

  // When adding an item from the modal, we update local state optimistically, 
  // but ideally the Modals themselves would call the API. For now, we simulate or call API if Modals don't.
  const addItemToModule = async (item) => {
    try {
      if (item.type === 'quiz') {
         await createProblemSetMutation.mutateAsync({
           moduleId: targetModuleId,
           data: { title: item.title, dueDate: "2026-12-31", timeLimitMins: 45, questions: [] },
           courseId
         });
      } else {
         await addMaterialMutation.mutateAsync({
           moduleId: targetModuleId,
           data: { title: item.title, type: item.type.toUpperCase(), contentUrl: "https://example.com" },
           courseId
         });
      }
      refetch(); // Reload data from backend to ensure consistency
      toast({ title: "Added", description: "Content added successfully", variant: "success" });
    } catch (err) {
       console.error(err);
       toast({ title: "Error", description: "Failed to add content to backend, but updated UI.", variant: "error" });
       // Optimistic UI update
       setModules(modules.map(mod => {
          if (mod.id === targetModuleId) {
            return { ...mod, items: [...(mod.items || []), item] };
          }
          return mod;
       }));
    }
    closeModal();
  };

  if (!courseId) {
    return <div className="p-10 text-center">No Course ID provided.</div>;
  }

  const totalModules = modules.length;
  const totalItems = modules.reduce((acc, mod) => acc + ((mod.items || mod.materials || mod.problemSets || []).length), 0);

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] -mx-6 -my-6 md:-mx-8 md:-my-8 bg-slate-50 relative">
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 shadow-sm">
        <div className="flex items-center gap-4">
           <button onClick={() => navigate('/teacher/courses')} className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500">
             <ArrowLeft className="w-5 h-5" />
           </button>
           <div>
             <div className="flex items-center gap-3 mb-1">
               <h1 className="text-2xl font-bold text-slate-800">Manage Course Content</h1>
               <span className="px-2.5 py-1 text-xs font-semibold rounded-full border bg-slate-100 text-slate-800 border-slate-200">
                 {courseDataApi?.status || courseDataApi?.data?.status || 'Draft'}
               </span>
             </div>
             <p className="text-sm text-slate-500">{courseDataApi?.title || courseDataApi?.courseName || courseDataApi?.data?.courseName || 'Loading...'} - Build your curriculum.</p>
           </div>
        </div>
        
        <div className="flex items-center gap-3">
          <button 
            onClick={handlePublish}
            disabled={isPublishing} 
            className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
          >
            {isPublishing ? (
               <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
            ) : (
              <Send className="w-4 h-4" /> 
            )}
            Submit for Review
          </button>
        </div>
      </header>

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar">
           <div className="max-w-4xl mx-auto space-y-8">
              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
                {isLoading ? (
                  <div className="flex items-center justify-center h-64 text-slate-500">Loading course...</div>
                ) : (
                  <CurriculumBuilder modules={modules} setModules={setModules} openModal={openModal} courseId={courseId} />
                )}
              </div>
           </div>
        </div>

        <aside className="w-80 bg-white border-l border-slate-200 flex-none hidden lg:flex flex-col z-0">
          <div className="p-6 overflow-y-auto">
            <h3 className="font-semibold text-slate-800 mb-4 px-1">Course Summary</h3>
            
            <div className="grid grid-cols-2 gap-3 mb-8">
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                <span className="block text-2xl font-bold text-primary">{totalModules}</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Modules</span>
              </div>
              <div className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
                <span className="block text-2xl font-bold text-secondary">{totalItems}</span>
                <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">Lessons</span>
              </div>
            </div>

            <h3 className="font-semibold text-slate-800 mb-4 px-1">Readiness Checklist</h3>
            <ul className="space-y-3 px-1">
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 flex-shrink-0 mt-0.5 text-emerald-500" />
                <div>
                  <span className="text-sm font-medium text-slate-700">Basic Info Complete</span>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${totalItems > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                <div>
                  <span className={`text-sm font-medium ${totalItems > 0 ? 'text-slate-700' : 'text-slate-500'}`}>Curriculum Added</span>
                  <p className="text-xs text-slate-400 mt-0.5">At least 1 lesson created</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>
      </div>

      <VideoModal isOpen={activeModal === 'video'} onClose={closeModal} onAdd={addItemToModule} moduleId={targetModuleId} courseId={courseId} />
      <ResourceModal isOpen={activeModal === 'resource'} onClose={closeModal} onAdd={addItemToModule} moduleId={targetModuleId} courseId={courseId} />
      <AssignmentModal isOpen={activeModal === 'assignment'} onClose={closeModal} onAdd={addItemToModule} moduleId={targetModuleId} courseId={courseId} />
      <QuizModal isOpen={activeModal === 'quiz'} onClose={closeModal} onAdd={addItemToModule} moduleId={targetModuleId} courseId={courseId} />
    </div>
  );
}
