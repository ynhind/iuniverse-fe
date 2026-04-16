import React, { useState, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { BasicInfoTab } from "./BasicInfoTab";
import { CurriculumBuilder } from "./CurriculumBuilder";
import { SettingsTab } from "./SettingsTab";
import { VideoModal, ResourceModal, AssignmentModal, QuizModal } from "./Modals/ItemModals";
import { Save, Eye, Send, CheckCircle2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useCourses } from "@/contexts/CourseContext";

export function CourseCreator() {
  const { toast } = useToast();
  const navigate = useNavigate();
  const location = useLocation();
  const { courses, addCourse, updateCourse, updateCourseStatus } = useCourses();
  
  const [activeTab, setActiveTab] = useState("basic");
  const [isPublishing, setIsPublishing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [targetModuleId, setTargetModuleId] = useState(null);
  const [activeModal, setActiveModal] = useState(null); 
  const [courseId, setCourseId] = useState(null);

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

  const [modules, setModules] = useState([
    {
      id: "mod-1",
      title: "Introduction to the Course",
      description: "",
      items: [
        { id: "item-1", type: "video", title: "Welcome & Syllabus", duration: "05:30" }
      ]
    }
  ]);

  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const id = params.get("id");
    if (id) {
      const existingCourse = courses.find(c => c.id === id);
      if (existingCourse) {
        setCourseId(id);
        setCourseData(existingCourse);
        if (existingCourse.modules) {
          setModules(existingCourse.modules);
        }
      }
    }
  }, [location, courses]);

  const updateCourseData = (newData) => {
    setCourseData(prev => ({ ...prev, ...newData }));
  };

  const saveCurrentState = (finalStatus) => {
    const coursePayload = {
      ...courseData,
      status: finalStatus || courseData.status,
      modules
    };

    if (courseId) {
      updateCourse(courseId, coursePayload);
    } else {
      addCourse(coursePayload);
    }
  };

  const handlePublish = () => {
    if (!courseData.title) {
      toast({ title: "Validation Error", description: "Course Title is required.", variant: "error" });
      return;
    }
    if (modules.length === 0 || modules.reduce((a, m) => a + m.items?.length, 0) === 0) {
      toast({ title: "Validation Error", description: "At least one module and one material are required to submit.", variant: "error" });
      return;
    }

    setIsPublishing(true);
    setTimeout(() => {
      setIsPublishing(false);
      saveCurrentState("Pending Review");
      toast({ title: "Course Submitted!", description: "Your course is pending admin review.", variant: "success" });
      navigate("/teacher/courses");
    }, 1500);
  };

  const handleSaveDraft = () => {
    setIsSaving(true);
    setTimeout(() => {
      setIsSaving(false);
      saveCurrentState("Draft");
      toast({ title: "Draft Saved", description: "Progress saved successfully.", variant: "success" });
      navigate("/teacher/courses");
    }, 800);
  };

  const openModal = (type, moduleId) => {
    setTargetModuleId(moduleId);
    setActiveModal(type);
  };

  const closeModal = () => {
    setActiveModal(null);
    setTargetModuleId(null);
  };

  const addItemToModule = (item) => {
    setModules(modules.map(mod => {
      if (mod.id === targetModuleId) {
        return { ...mod, items: [...(mod.items || []), item] };
      }
      return mod;
    }));
  };

  const totalModules = modules.length;
  const totalItems = modules.reduce((acc, mod) => acc + (mod.items ? mod.items.length : 0), 0);

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] -mx-6 -my-6 md:-mx-8 md:-my-8 bg-slate-50 relative">
      
      <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 shadow-sm">
        <div>
           <div className="flex items-center gap-3 mb-1">
             <h1 className="text-2xl font-bold text-slate-800">{courseId ? "Edit Course" : "Create Course"}</h1>
             <span className={`px-2.5 py-1 text-xs font-semibold rounded-full border ${courseData.status === 'Rejected' ? 'bg-red-100 text-red-800 border-red-200' : 'bg-yellow-100 text-yellow-800 border-yellow-200'}`}>
               {courseData.status}
             </span>
           </div>
           <p className="text-sm text-slate-500">Build and structure your course content before publishing.</p>
        </div>
        
        <div className="flex items-center gap-3">
          <button onClick={handleSaveDraft} disabled={isSaving || isPublishing} className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm disabled:opacity-70 disabled:cursor-not-allowed">
             {isSaving ? <span className="w-4 h-4 border-2 border-slate-300 border-t-slate-600 rounded-full animate-spin flex-shrink-0" /> : <Save className="w-4 h-4" />}
             Save Draft
          </button>
          <button className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-slate-600 bg-white border border-slate-200 rounded-xl hover:bg-slate-50 transition-colors shadow-sm">
            <Eye className="w-4 h-4" /> Preview
          </button>
          <button 
            onClick={handlePublish}
            disabled={isPublishing || isSaving} 
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
              
              <div className="flex items-center gap-2 border-b border-slate-200 pb-2">
                <button 
                  onClick={() => setActiveTab('basic')}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'basic' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  1. Basic Information
                </button>
                <button 
                  onClick={() => setActiveTab('curriculum')}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'curriculum' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  2. Curriculum Builder
                </button>
                <button 
                  onClick={() => setActiveTab('settings')}
                  className={`px-4 py-2.5 text-sm font-medium rounded-t-lg border-b-2 transition-colors ${activeTab === 'settings' ? 'border-primary text-primary' : 'border-transparent text-slate-500 hover:text-slate-700 hover:border-slate-300'}`}
                >
                  3. Settings & Access
                </button>
              </div>

              <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm min-h-[500px]">
                {activeTab === 'basic' && <BasicInfoTab courseData={courseData} updateCourseData={updateCourseData} />}
                {activeTab === 'curriculum' && <CurriculumBuilder modules={modules} setModules={setModules} openModal={openModal} />}
                {activeTab === 'settings' && <SettingsTab courseData={courseData} updateCourseData={updateCourseData} />}
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
                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${courseData.title ? 'text-emerald-500' : 'text-slate-300'}`} />
                <div>
                  <span className={`text-sm font-medium ${courseData.title ? 'text-slate-700' : 'text-slate-500'}`}>Basic Info Complete</span>
                  <p className="text-xs text-slate-400 mt-0.5">Title, description, category</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className={`w-5 h-5 flex-shrink-0 mt-0.5 ${totalItems > 0 ? 'text-emerald-500' : 'text-slate-300'}`} />
                <div>
                  <span className={`text-sm font-medium ${totalItems > 0 ? 'text-slate-700' : 'text-slate-500'}`}>Curriculum Added</span>
                  <p className="text-xs text-slate-400 mt-0.5">At least 1 lesson created</p>
                </div>
              </li>
              <li className="flex items-start gap-3">
                <CheckCircle2 className="w-5 h-5 text-emerald-500 flex-shrink-0 mt-0.5" />
                <div>
                  <span className="text-sm font-medium text-slate-700">Settings Configured</span>
                  <p className="text-xs text-slate-400 mt-0.5">Visibility and access rules</p>
                </div>
              </li>
            </ul>
          </div>
        </aside>

      </div>

      <VideoModal isOpen={activeModal === 'video'} onClose={closeModal} onAdd={addItemToModule} />
      <ResourceModal isOpen={activeModal === 'resource'} onClose={closeModal} onAdd={addItemToModule} />
      <AssignmentModal isOpen={activeModal === 'assignment'} onClose={closeModal} onAdd={addItemToModule} />
      <QuizModal isOpen={activeModal === 'quiz'} onClose={closeModal} onAdd={addItemToModule} />

    </div>
  );
}
