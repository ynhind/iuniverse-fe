import React, { useEffect, useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { useToast } from "@/contexts/ToastContext";
import { useAuth } from "@/contexts/AuthContext";
import {
  useCourseDetailQuery,
  useUpdateCourseMutation,
  useAddMaterialMutation,
  useUploadMaterialMutation,
  useCreateProblemSetMutation,
  useDeleteCourseMutation,
  useDeleteProblemSetMutation,
  useModuleProblemSetsQuery,
} from "@/hooks/useTeacher";
import { CurriculumBuilder } from "./CurriculumBuilder";
import { VideoModal, ResourceModal, AssignmentModal, QuizModal } from "./Modals/ItemModals";
import { CourseManagerHeader } from "@/components/teacher/course-manager/CourseManagerHeader";
import { CourseSidebar }       from "@/components/teacher/course-manager/CourseSidebar";
import { QuizSection }         from "@/components/teacher/course-manager/QuizSection";

const extractList = (payload) => {
  if (Array.isArray(payload))          return payload;
  if (Array.isArray(payload?.data))    return payload.data;
  if (Array.isArray(payload?.content)) return payload.content;
  return [];
};

const normalizeCourse = (raw) => {
  const course      = raw?.data || raw || {};
  const rawModules  = Array.isArray(course?.modules) ? course.modules : [];
  const modules     = rawModules.map((mod) => ({
    ...mod,
    id:    mod?.id ?? mod?.moduleId,
    title: mod?.title || "Untitled Module",
    items: (Array.isArray(mod?.materials) ? mod.materials : []).map((m) => ({
      ...m,
      id:          m?.id,
      title:       m?.title || "Untitled Material",
      type:        String(m?.type || "RESOURCE").toLowerCase(),
      contentUrl:  m?.contentUrl || m?.fileUrl || "",
      description: m?.description || "",
    })),
  }));
  return { ...course, id: course?.id, courseName: course?.courseName || course?.title || "", modules };
};

export function CourseManager() {
  const { toast }    = useToast();
  const { user }     = useAuth();
  const navigate     = useNavigate();
  const location     = useLocation();
  const courseId     = new URLSearchParams(location.search).get("id");

  const { data: courseDataApi, isLoading, refetch } = useCourseDetailQuery(courseId);
  const course        = useMemo(() => normalizeCourse(courseDataApi), [courseDataApi]);
  const courseModules = useMemo(() => course?.modules ?? [], [course]);
  const firstModuleId = courseModules[0]?.id ?? null;

  const { data: problemSetsData, isLoading: isProblemSetsLoading } = useModuleProblemSetsQuery(firstModuleId);

  const updateCourseMutation    = useUpdateCourseMutation();
  const addMaterialMutation     = useAddMaterialMutation();
  const uploadMaterialMutation  = useUploadMaterialMutation();
  const createProblemSetMutation = useCreateProblemSetMutation();
  const deleteProblemSetMutation = useDeleteProblemSetMutation();
  const deleteCourseMutation    = useDeleteCourseMutation();

  const [modules,      setModules]      = useState([]);
  const [activeModal,  setActiveModal]  = useState(null);
  const [targetModuleId, setTargetModuleId] = useState(null);
  const [isPublishing, setIsPublishing] = useState(false);

  const quizzes = useMemo(() =>
    extractList(problemSetsData).map((q) => ({
      ...q,
      title:         q?.title || "Untitled Quiz",
      dueDate:       q?.dueDate || "",
      timeLimitMins: q?.timeLimitMins ?? 45,
      questions:     Array.isArray(q?.questions) ? q.questions : [],
    })),
    [problemSetsData]
  );

  useEffect(() => {
    if (!courseDataApi) return;
    if (course?.teacherId && user && course.teacherId !== user.id) {
      toast({ title: "Access Denied", description: "You don't have permission to manage this course.", variant: "error" });
      navigate("/teacher/courses");
      return;
    }
    setModules(course.modules || []);
  }, [courseDataApi, course, user, navigate, toast]);

  const openModal  = (type, moduleId = null) => { setTargetModuleId(moduleId); setActiveModal(type); };
  const closeModal = () => { setActiveModal(null); setTargetModuleId(null); };

  const handlePublish = async () => {
    const hasContent = modules.some((m) => m.items?.length > 0) || quizzes.length > 0;
    if (modules.length === 0 || !hasContent) {
      toast({ title: "Validation Error", description: "At least one module item or quiz is required.", variant: "error" });
      return;
    }
    setIsPublishing(true);
    try {
      await updateCourseMutation.mutateAsync({ id: courseId, data: { status: "Pending Review" } });
      toast({ title: "Course Submitted!", description: "Your course is pending admin review.", variant: "success" });
      navigate("/teacher/courses");
    } catch {
      toast({ title: "Submission Failed", description: "An error occurred.", variant: "error" });
    } finally {
      setIsPublishing(false);
    }
  };

  const handleDeleteCourse = async () => {
    if (!window.confirm("Delete this course? This action cannot be undone.")) return;
    try {
      await deleteCourseMutation.mutateAsync(courseId);
      toast({ title: "Course Deleted", description: "The course has been permanently removed.", variant: "success" });
      navigate("/teacher/courses");
    } catch {
      toast({ title: "Delete Failed", description: "Could not delete the course.", variant: "error" });
    }
  };

  const addItemToModule = async (item) => {
    if (!targetModuleId) {
      toast({ title: "Missing module", description: "No module selected.", variant: "error" });
      return;
    }
    try {
      if (item.file instanceof File) {
        await uploadMaterialMutation.mutateAsync({
          file: item.file, moduleId: targetModuleId, title: item.title,
          type: String(item.materialType || item.type || "PDF").toUpperCase(), courseId,
        });
      } else {
        await addMaterialMutation.mutateAsync({
          moduleId: targetModuleId, courseId,
          data: {
            title: item.title, description: item.description || null,
            type: String(item.materialType || item.type || "RESOURCE").toUpperCase(),
            contentUrl: item.contentUrl || "",
          },
        });
      }
      await refetch();
      toast({ title: "Added", description: "Content added successfully.", variant: "success" });
    } catch (error) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to add content.", variant: "error" });
    } finally {
      closeModal();
    }
  };

  const addQuizToCourse = async (quiz) => {
    try {
      await createProblemSetMutation.mutateAsync({
        moduleId: firstModuleId, courseId,
        data: { title: quiz.title, dueDate: quiz.dueDate, timeLimitMins: quiz.timeLimitMins, questions: quiz.questions },
      });
      await refetch();
      toast({ title: "Quiz created", description: "Quiz added successfully.", variant: "success" });
    } catch (error) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to create quiz.", variant: "error" });
    } finally {
      closeModal();
    }
  };

  const handleDeleteQuiz = async (quizId) => {
    try {
      await deleteProblemSetMutation.mutateAsync({ problemSetId: quizId, moduleId: firstModuleId, courseId });
      toast({ title: "Quiz deleted", description: "Quiz removed successfully.", variant: "success" });
    } catch (error) {
      toast({ title: "Error", description: error?.response?.data?.message || "Failed to delete quiz.", variant: "error" });
    }
  };

  if (!courseId) {
    return <div className="p-10 text-center">No Course ID provided.</div>;
  }

  const totalItems  = modules.reduce((acc, mod) => acc + (mod.items?.length || 0), 0);

  return (
    <div className="flex flex-col h-[calc(100vh-theme(spacing.20))] -mx-6 -my-6 md:-mx-8 md:-my-8 bg-slate-50 relative">
      <CourseManagerHeader
        course={course}
        isPublishing={isPublishing}
        isDeleting={deleteCourseMutation.isPending}
        onPublish={handlePublish}
        onDelete={handleDeleteCourse}
      />

      <div className="flex-1 flex overflow-hidden">
        <div className="flex-1 overflow-y-auto p-6 md:p-10 hide-scrollbar">
          <div className="max-w-6xl mx-auto space-y-8">
            <div className="bg-white p-8 rounded-2xl border border-slate-200 shadow-sm">
              {isLoading ? (
                <div className="flex items-center justify-center h-64 text-slate-500">Loading course...</div>
              ) : (
                <CurriculumBuilder
                  modules={modules}
                  setModules={setModules}
                  openModal={openModal}
                  courseId={courseId}
                />
              )}
            </div>

            <QuizSection
              quizzes={quizzes}
              isLoading={isProblemSetsLoading}
              courseId={courseId}
              firstModuleId={firstModuleId}
              onAddQuiz={() => openModal("quiz")}
              onDeleteQuiz={handleDeleteQuiz}
            />
          </div>
        </div>

        <CourseSidebar
          modules={modules}
          totalItems={totalItems}
          totalQuizzes={quizzes.length}
        />
      </div>

      <VideoModal      isOpen={activeModal === "video"}      onClose={closeModal} onAdd={addItemToModule} />
      <ResourceModal   isOpen={activeModal === "resource"}   onClose={closeModal} onAdd={addItemToModule} />
      <AssignmentModal isOpen={activeModal === "assignment"} onClose={closeModal} onAdd={addItemToModule} />
      <QuizModal       isOpen={activeModal === "quiz"}       onClose={closeModal} onAdd={addQuizToCourse} />
    </div>
  );
}