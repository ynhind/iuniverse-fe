import React from "react";
import { useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Trash2 } from "lucide-react";

export function CourseManagerHeader({ course, isPublishing, onPublish, onDelete, isDeleting }) {
  const navigate = useNavigate();

  return (
    <header className="flex-none bg-white border-b border-slate-200 px-6 py-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 z-10 shadow-sm">
      <div className="flex items-center gap-4">
        <button
          onClick={() => navigate("/teacher/courses")}
          className="p-2 hover:bg-slate-100 rounded-full transition-colors text-slate-500"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-slate-800">Manage Course Content</h1>
            <span className="px-2.5 py-1 text-xs font-semibold rounded-full border bg-slate-100 text-slate-800 border-slate-200">
              {course?.status || "Draft"}
            </span>
          </div>
          <p className="text-sm text-slate-500">
            {course?.courseName || "Loading..."} - Build your curriculum and quizzes.
          </p>
        </div>
      </div>

      <div className="flex items-center gap-3">
        <button
          onClick={onDelete}
          disabled={isDeleting}
          className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-red-600 bg-red-50 rounded-xl hover:bg-red-100 transition-colors border border-red-200 disabled:opacity-50"
        >
          <Trash2 className="w-4 h-4" />
          <span className="hidden sm:inline">Delete</span>
        </button>

        <button
          onClick={onPublish}
          disabled={isPublishing}
          className="flex items-center gap-2 px-5 py-2 text-sm font-medium text-white bg-primary rounded-xl hover:bg-primary/90 transition-colors shadow-sm shadow-primary/25 disabled:opacity-70 disabled:cursor-not-allowed"
        >
          {isPublishing
            ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin flex-shrink-0" />
            : <Send className="w-4 h-4" />}
          Submit for Review
        </button>
      </div>
    </header>
  );
}
