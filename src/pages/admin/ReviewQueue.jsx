import React, { useMemo, useState } from "react";
import { CheckCircle, XCircle, Search, FileText, BookOpen, User, Clock, AlertCircle } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { usePendingCoursesQuery, useApproveCourseMutation, useRejectCourseMutation } from "@/hooks/useAdmin";

const ADMIN_USER = "admin";
const ADMIN_PASS = "admin@123";

function useAdminAuth() {
  const [authed, setAuthed]     = useState(() => sessionStorage.getItem("adminAuthed") === "1");
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError]       = useState("");
  const login = (e) => {
    e.preventDefault();
    if (username === ADMIN_USER && password === ADMIN_PASS) {
      sessionStorage.setItem("adminAuthed", "1");
      setAuthed(true);
    } else {
      setError("Invalid credentials.");
    }
  };
  return { authed, username, setUsername, password, setPassword, error, login };
}

function LoginGate({ auth }) {
  return (
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="bg-white rounded-2xl border border-slate-200 shadow-xl p-8 w-full max-w-sm">
        <h2 className="text-xl font-bold text-slate-800 mb-1">Admin Login</h2>
        <p className="text-sm text-slate-500 mb-6">Course Review Queue access</p>
        <form onSubmit={auth.login} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Username</label>
            <input className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={auth.username} onChange={(e) => auth.setUsername(e.target.value)} placeholder="admin" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Password</label>
            <input type="password" className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={auth.password} onChange={(e) => auth.setPassword(e.target.value)} placeholder="••••••••" />
          </div>
          {auth.error && <p className="text-sm text-red-500">{auth.error}</p>}
          <button type="submit" className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90">Sign in</button>
        </form>
      </div>
    </div>
  );
}

function RejectModal({ course, onClose, onConfirm, isPending }) {
  const [feedback, setFeedback] = useState("");
  const name = course?.courseName || course?.title || "Untitled";
  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-2xl border border-slate-200 overflow-hidden">
        <div className="px-6 py-4 border-b border-slate-200">
          <h3 className="font-semibold text-slate-800">Reject Course</h3>
          <p className="text-xs text-slate-500 truncate">{name}</p>
        </div>
        <div className="p-6 space-y-3">
          <label className="block text-sm font-medium text-slate-700">Feedback for teacher <span className="text-red-500">*</span></label>
          <textarea
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30"
            placeholder="Explain what needs to be changed before resubmitting..."
            value={feedback}
            onChange={(e) => setFeedback(e.target.value)}
          />
        </div>
        <div className="px-6 py-4 bg-slate-50 border-t border-slate-100 flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-100 text-sm">Cancel</button>
          <button
            onClick={() => onConfirm(feedback)}
            disabled={!feedback.trim() || isPending}
            className="px-4 py-2 rounded-xl bg-red-600 text-white text-sm hover:bg-red-700 disabled:opacity-50 flex items-center gap-2"
          >
            {isPending && <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />}
            Reject Course
          </button>
        </div>
      </div>
    </div>
  );
}

function CourseCard({ course, onApprove, onReject, isApproving }) {
  const name    = course?.courseName || course?.title || "Untitled";
  const teacher = course?.teacherName || course?.teacher?.name || "Unknown Teacher";
  const modules = course?.modules?.length ?? 0;
  const date    = course?.updatedAt || course?.createdAt;
  return (
    <div className="bg-white rounded-2xl border border-slate-200 shadow-sm hover:shadow-md transition-shadow overflow-hidden">
      <div className="flex items-start gap-4 p-5 border-b border-slate-100">
        <div className="w-12 h-12 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center flex-shrink-0">
          <BookOpen className="w-6 h-6" />
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <h3 className="font-semibold text-slate-800 truncate">{name}</h3>
            <span className="px-2 py-0.5 text-xs font-semibold rounded-full bg-amber-100 text-amber-800 border border-amber-200 flex-shrink-0">Pending</span>
          </div>
          <div className="flex flex-wrap gap-3 mt-1.5 text-xs text-slate-500">
            <span className="flex items-center gap-1"><User className="w-3 h-3" />{teacher}</span>
            <span className="flex items-center gap-1"><FileText className="w-3 h-3" />{modules} modules</span>
            {date && <span className="flex items-center gap-1"><Clock className="w-3 h-3" />{new Date(date).toLocaleDateString()}</span>}
          </div>
        </div>
      </div>
      {course?.description && <p className="px-5 py-3 text-sm text-slate-600 line-clamp-2 bg-slate-50/50">{course.description}</p>}
      <div className="px-5 py-4 flex justify-end gap-3">
        <button onClick={() => onReject(course)} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl border border-red-200 text-red-600 bg-red-50 hover:bg-red-100 text-sm">
          <XCircle className="w-4 h-4" /> Reject
        </button>
        <button onClick={() => onApprove(course.id)} disabled={isApproving} className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm disabled:opacity-50">
          {isApproving ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <CheckCircle className="w-4 h-4" />}
          Approve
        </button>
      </div>
    </div>
  );
}

export function ReviewQueue() {
  const auth  = useAdminAuth();
  const { toast } = useToast();
  const [search, setSearch]           = useState("");
  const [rejectTarget, setRejectTarget] = useState(null);

  const { data, isLoading }   = usePendingCoursesQuery();
  const approveMutation       = useApproveCourseMutation();
  const rejectMutation        = useRejectCourseMutation();

  const courses = useMemo(() => {
    const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.content) ? data.content : [];
    return list.filter((c) => (c?.courseName || c?.title || "").toLowerCase().includes(search.toLowerCase()));
  }, [data, search]);

  if (!auth.authed) return <LoginGate auth={auth} />;

  const handleApprove = async (courseId) => {
    try {
      await approveMutation.mutateAsync(courseId);
      toast({ title: "Approved", description: "Course is now published.", variant: "success" });
    } catch (err) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to approve.", variant: "error" });
    }
  };

  const handleRejectConfirm = async (feedback) => {
    try {
      await rejectMutation.mutateAsync({ courseId: rejectTarget.id, feedback });
      toast({ title: "Rejected", description: "Feedback sent to the teacher.", variant: "success" });
      setRejectTarget(null);
    } catch (err) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to reject.", variant: "error" });
    }
  };

  return (
    <>
      {rejectTarget && <RejectModal course={rejectTarget} onClose={() => setRejectTarget(null)} onConfirm={handleRejectConfirm} isPending={rejectMutation.isPending} />}
      <div className="space-y-6 animate-in fade-in duration-300">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-3xl font-bold tracking-tight text-slate-900">Review Queue</h1>
            <p className="text-slate-500 mt-1">Approve or reject pending course submissions.</p>
          </div>
          <div className="relative w-full max-w-xs">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <input className="w-full border border-slate-200 rounded-xl pl-9 pr-4 py-2 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-primary/30" placeholder="Search courses..." value={search} onChange={(e) => setSearch(e.target.value)} />
          </div>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-20 text-slate-500 gap-2">
            <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Loading…
          </div>
        ) : courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 text-slate-400 gap-3 bg-white rounded-2xl border border-slate-200">
            <CheckCircle className="w-12 h-12 text-slate-300" />
            <p className="font-medium text-slate-600">All caught up!</p>
            <p className="text-sm">No courses pending review.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">
            {courses.map((course) => (
              <CourseCard key={course.id} course={course} onApprove={handleApprove} onReject={setRejectTarget} isApproving={approveMutation.isPending} />
            ))}
          </div>
        )}

        {!isLoading && courses.length > 0 && (
          <div className="flex items-center gap-2 text-sm text-slate-600 bg-amber-50 border border-amber-200 rounded-xl px-4 py-3">
            <AlertCircle className="w-4 h-4 text-amber-500 flex-shrink-0" />
            {courses.length} course{courses.length !== 1 ? "s" : ""} waiting for review.
          </div>
        )}
      </div>
    </>
  );
}
