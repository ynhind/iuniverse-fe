import React, { useMemo, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, FileQuestion, Clock, CalendarDays, Hash, CheckCircle2, Trash2, Pencil } from "lucide-react";
import { useModuleProblemSetsQuery, useDeleteProblemSetMutation } from "@/hooks/useTeacher";
import { useToast } from "@/contexts/ToastContext";
import { EditQuizModal }      from "@/components/teacher/quiz/EditQuizModal";
import { QuizQuestionList }   from "@/components/teacher/quiz/QuizQuestionList";
import { extractList }        from "@/components/teacher/quiz/quizHelpers";

export function QuizDetail() {
  const { toast }  = useToast();
  const navigate   = useNavigate();
  const location   = useLocation();
  const [showEdit, setShowEdit] = useState(false);

  const params   = new URLSearchParams(location.search);
  const courseId = params.get("courseId");
  const quizId   = params.get("quizId");
  const moduleId = params.get("moduleId");

  const { data: problemSetsData, isLoading, refetch } = useModuleProblemSetsQuery(moduleId);
  const deleteMutation = useDeleteProblemSetMutation();

  const quiz = useMemo(() => {
    const found = extractList(problemSetsData).find((q) => String(q?.id) === String(quizId));
    if (!found) return null;
    return {
      ...found,
      title:         found.title         || "Untitled Quiz",
      dueDate:       found.dueDate        || "",
      timeLimitMins: found.timeLimitMins  ?? 45,
      questions:     Array.isArray(found.questions) ? found.questions : [],
    };
  }, [problemSetsData, quizId]);

  const handleDelete = async () => {
    if (!window.confirm("Are you sure you want to delete this quiz?")) return;
    try {
      await deleteMutation.mutateAsync({ problemSetId: quizId, moduleId, courseId });
      toast({ title: "Deleted", description: "Quiz removed.", variant: "success" });
      navigate(`/manage-course?id=${courseId}`);
    } catch (err) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to delete quiz.", variant: "error" });
    }
  };

  if (!courseId || !quizId || !moduleId) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 gap-3">
        <FileQuestion className="w-10 h-10 text-slate-300" />
        <p>Missing courseId / moduleId / quizId in URL.</p>
        <button onClick={() => navigate(-1)} className="text-primary hover:underline text-sm">Go back</button>
      </div>
    );
  }

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-[60vh] text-slate-500 gap-2">
        <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" />
        Loading quiz…
      </div>
    );
  }

  if (!quiz) {
    return (
      <div className="flex flex-col items-center justify-center h-[60vh] text-slate-500 gap-3">
        <FileQuestion className="w-10 h-10 text-slate-300" />
        <p>Quiz not found.</p>
        <button onClick={() => navigate(`/manage-course?id=${courseId}`)} className="text-primary hover:underline text-sm">
          Back to course
        </button>
      </div>
    );
  }

  const totalPoints = quiz.questions.reduce((s, q) => s + (Number(q.points) || 0), 0);

  const stats = [
    { icon: <Hash className="w-4 h-4" />,          label: "Questions",   value: quiz.questions.length, large: true },
    { icon: <Clock className="w-4 h-4" />,         label: "Time Limit",  value: `${quiz.timeLimitMins} mins`, large: true },
    { icon: <CalendarDays className="w-4 h-4" />,  label: "Due Date",    value: quiz.dueDate ? new Date(quiz.dueDate).toLocaleDateString() : "—", large: false },
    { icon: <CheckCircle2 className="w-4 h-4" />,  label: "Total Points", value: totalPoints, large: true },
  ];

  return (
    <>
      {showEdit && (
        <EditQuizModal
          quiz={quiz}
          moduleId={moduleId}
          courseId={courseId}
          onClose={() => setShowEdit(false)}
          onSaved={() => refetch()}
        />
      )}

      <div className="p-4 sm:p-6 max-w-4xl mx-auto space-y-5">
        <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm">
          <div className="flex flex-col sm:flex-row sm:items-center gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <button
                onClick={() => navigate(`/manage-course?id=${courseId}`)}
                className="p-2 rounded-full hover:bg-slate-100 flex-shrink-0"
              >
                <ArrowLeft className="w-5 h-5 text-slate-600" />
              </button>
              <div className="w-10 h-10 rounded-xl bg-rose-500 text-white flex items-center justify-center flex-shrink-0">
                <FileQuestion className="w-5 h-5" />
              </div>
              <div className="min-w-0">
                <h1 className="text-lg sm:text-xl font-bold text-slate-800 truncate">{quiz.title}</h1>
                <p className="text-xs sm:text-sm text-slate-500">Quiz Detail</p>
              </div>
            </div>

            <div className="flex items-center gap-2 flex-shrink-0">
              <button
                onClick={() => setShowEdit(true)}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-primary/30 bg-primary/5 text-primary hover:bg-primary/10 text-sm"
              >
                <Pencil className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Quiz</span>
              </button>
              <button
                onClick={handleDelete}
                disabled={deleteMutation.isPending}
                className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl border border-red-200 bg-red-50 text-red-600 hover:bg-red-100 text-sm disabled:opacity-60"
              >
                <Trash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Delete</span>
              </button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {stats.map(({ icon, label, value, large }) => (
            <div key={label} className="bg-white rounded-2xl border border-slate-200 p-4">
              <div className="flex items-center gap-1.5 text-slate-400 text-xs mb-2">{icon} {label}</div>
              <div className={`font-bold text-slate-800 ${large ? "text-2xl" : "text-sm"}`}>{value}</div>
            </div>
          ))}
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm overflow-hidden">
          <div className="px-5 py-4 border-b border-slate-100 flex items-center justify-between">
            <h2 className="font-semibold text-slate-800">
              Questions
              <span className="ml-2 text-sm font-normal text-slate-400">({quiz.questions.length})</span>
            </h2>
            <button onClick={() => setShowEdit(true)} className="text-xs text-primary hover:underline flex items-center gap-1">
              <Pencil className="w-3.5 h-3.5" /> Edit
            </button>
          </div>

          <QuizQuestionList questions={quiz.questions} onEditClick={() => setShowEdit(true)} />
        </div>
      </div>
    </>
  );
}