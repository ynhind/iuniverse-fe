import React from "react";
import { useNavigate } from "react-router-dom";
import { FileQuestion, Plus, Trash2 } from "lucide-react";

export function QuizSection({ quizzes, isLoading, courseId, firstModuleId, onAddQuiz, onDeleteQuiz }) {
  const navigate = useNavigate();

  return (
    <div className="bg-white p-6 sm:p-8 rounded-2xl border border-slate-200 shadow-sm">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
        <div>
          <h2 className="text-xl font-semibold text-slate-800">Module Quizzes</h2>
          <p className="text-sm text-slate-500 mt-0.5">Quizzes for the first module of this course.</p>
        </div>
        <button
          type="button"
          onClick={onAddQuiz}
          disabled={!firstModuleId}
          className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-rose-600 text-white hover:bg-rose-700 transition-colors disabled:opacity-50 text-sm flex-shrink-0 self-start sm:self-auto"
        >
          <Plus className="w-4 h-4" /> Add Quiz
        </button>
      </div>

      {isLoading ? (
        <div className="border border-dashed border-slate-200 rounded-xl p-8 text-center text-slate-500 bg-slate-50">
          Loading quizzes...
        </div>
      ) : quizzes.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-xl p-8 text-center bg-slate-50">
          <FileQuestion className="w-8 h-8 text-slate-300 mx-auto mb-2" />
          <p className="text-slate-500 text-sm">No quizzes yet for this module.</p>
          <button
            onClick={onAddQuiz}
            disabled={!firstModuleId}
            className="mt-3 text-sm text-primary hover:underline disabled:opacity-50"
          >
            + Create first quiz
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 xl:grid-cols-3 gap-4">
          {quizzes.map((quiz) => (
            <QuizCard
              key={quiz.id}
              quiz={quiz}
              courseId={courseId}
              firstModuleId={firstModuleId}
              onDelete={onDeleteQuiz}
              onNavigate={(path) => navigate(path)}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function QuizCard({ quiz, courseId, firstModuleId, onDelete, onNavigate }) {
  const totalPoints = quiz.questions.reduce((s, q) => s + (Number(q.points) || 0), 0);
  const detailPath = `/teacher/quiz-detail?courseId=${courseId}&moduleId=${firstModuleId}&quizId=${quiz.id}`;

  return (
    <div
      className="relative group border border-slate-200 rounded-xl p-4 bg-white hover:border-rose-300 hover:shadow-md transition-all cursor-pointer"
      onClick={() => onNavigate(detailPath)}
    >
      <div className="flex items-start gap-3 mb-3">
        <div className="w-10 h-10 rounded-xl bg-rose-50 text-rose-600 flex items-center justify-center flex-shrink-0">
          <FileQuestion className="w-5 h-5" />
        </div>
        <div className="min-w-0">
          <div className="font-semibold text-slate-800 truncate group-hover:text-rose-700 transition-colors">
            {quiz.title}
          </div>
          <div className="text-xs text-slate-400 mt-0.5">
            {quiz.dueDate ? `Due ${new Date(quiz.dueDate).toLocaleDateString()}` : "No due date"}
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-1.5">
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
          {quiz.timeLimitMins ?? 45} mins
        </span>
        <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
          {quiz.questions.length} questions
        </span>
        {totalPoints > 0 && (
          <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700">
            {totalPoints} pts
          </span>
        )}
      </div>

      <button
        type="button"
        onClick={(e) => { e.stopPropagation(); onDelete(quiz.id); }}
        className="absolute top-3 right-3 p-1.5 rounded-lg text-slate-300 hover:text-red-600 hover:bg-red-50 opacity-0 group-hover:opacity-100 transition-all"
        title="Delete quiz"
      >
        <Trash2 className="w-4 h-4" />
      </button>
    </div>
  );
}
