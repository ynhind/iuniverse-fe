import React, { useState, useEffect } from "react";
import ReactDOM from "react-dom";
import { useParams, useNavigate } from "react-router-dom";
import { useAuth } from "@/contexts/AuthContext";
import { useCourses } from "@/contexts/CourseContext";
import { studentApi } from "@/api/student.api";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/Tabs";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/Card";
import {
  Accordion,
  AccordionItem,
  AccordionTrigger,
  AccordionContent,
} from "@/components/ui/Accordion";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import {
  FileText,
  PlayCircle,
  BookOpen,
  Clock,
  GraduationCap,
  Star,
  Send,
  ChevronRight,
  AlertCircle,
  CheckCircle2,
  Link as LinkIcon,
  X,
} from "lucide-react";

// ─── Quiz View (inline, responsive) ──────────────────────────────────────────
function QuizModal({ problemSet, onClose, onComplete }) {
  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState(null);

  useEffect(() => {
    fetchQuestions();
  }, [problemSet.id]);

  const fetchQuestions = async () => {
    try {
      setIsLoading(true);
      const res = await studentApi.getProblemSetQuestions(problemSet.id);
      setQuestions(res?.data || res || []);
    } catch (err) {
      console.error(err);
      alert("Failed to load questions. Please try again.");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAnswer = (questionId, value) => {
    setAnswers((prev) => ({ ...prev, [questionId]: value }));
  };

  const handleSubmit = async () => {
    const answerList = questions.map((q) => ({
      questionId: q.id,
      studentResponse: answers[q.id] || "",
    }));
    try {
      setIsSubmitting(true);
      const res = await studentApi.submitProblemSet(problemSet.id, { answers: answerList });
      const resData = res?.data || res;
      setResult(resData);
      setSubmitted(true);
      // Notify parent with score so problem set card updates
      const score = resData?.score ?? resData?.totalScore ?? null;
      if (onComplete) onComplete(problemSet.id, score);
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      if (status === 409) {
        // Already submitted — mark as done silently
        setSubmitted(true);
        setResult({ alreadySubmitted: true });
        if (onComplete) onComplete(problemSet.id, null);
      } else {
        alert("Submission failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  const answeredCount = Object.keys(answers).length;
  const progress = questions.length > 0 ? Math.round((answeredCount / questions.length) * 100) : 0;

  const modalContent = (
    <>
      {/* Backdrop */}
      <div
        className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div className="fixed inset-0 z-[1000] flex items-center justify-center p-4 pointer-events-none">
      <div className="w-full max-w-2xl flex flex-col bg-white rounded-3xl shadow-2xl max-h-[90vh] pointer-events-auto animate-in fade-in zoom-in-95 duration-200">
        {/* ── Fixed Header ── */}
        <div className="flex-none border-b border-slate-100 bg-white px-6 py-4 rounded-t-3xl">
          <div className="flex items-start justify-between gap-4">
            <div className="flex-1 min-w-0">
              <h3 className="font-display text-lg font-bold text-slate-900 leading-tight truncate">
                {problemSet.title}
              </h3>
              <div className="flex items-center gap-2 mt-1 flex-wrap">
                {problemSet.timeLimitMins && (
                  <span className="flex items-center gap-1 text-xs text-amber-600 bg-amber-50 px-2 py-0.5 rounded-full">
                    <Clock className="h-3 w-3" />
                    {problemSet.timeLimitMins} min
                  </span>
                )}
                {!submitted && !isLoading && questions.length > 0 && (
                  <span className="text-xs text-slate-400">
                    {answeredCount}/{questions.length} answered
                  </span>
                )}
              </div>
            </div>
            <button
              onClick={onClose}
              className="flex-none flex h-8 w-8 items-center justify-center rounded-full hover:bg-slate-100 transition-colors"
            >
              <X className="h-4 w-4 text-slate-500" />
            </button>
          </div>

          {/* Progress bar */}
          {!submitted && !isLoading && questions.length > 0 && (
            <div className="mt-3">
              <div className="h-1.5 bg-slate-100 rounded-full overflow-hidden">
                <div
                  className="h-full bg-gradient-to-r from-primary to-accent rounded-full transition-all duration-500"
                  style={{ width: `${progress}%` }}
                />
              </div>
              <div className="flex justify-between text-xs text-slate-400 mt-1">
                <span>Progress</span>
                <span>{progress}%</span>
              </div>
            </div>
          )}
        </div>

        {/* ── Scrollable Body ── */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4 bg-slate-50/50">
          {submitted ? (
            <div className="flex flex-col items-center justify-center h-full py-16 gap-5">
              <div className="flex h-20 w-20 items-center justify-center rounded-full bg-emerald-50 ring-8 ring-emerald-50">
                <CheckCircle2 className="h-10 w-10 text-emerald-500" />
              </div>
              <div className="text-center space-y-2">
                <h4 className="font-display text-2xl font-bold text-slate-900">Submitted!</h4>
                {result?.alreadySubmitted ? (
                  <p className="text-slate-500 text-sm">You have already submitted this quiz.</p>
                ) : result?.score !== undefined ? (
                  <p className="text-slate-600">
                    Your score:{" "}
                    <span className="font-bold text-primary text-xl">{result.score}</span>
                  </p>
                ) : (
                  <p className="text-slate-400 text-sm">Your answers have been recorded. Awaiting grading.</p>
                )}
              </div>
              <Button onClick={onClose} className="rounded-2xl px-8 mt-2">
                Close
              </Button>
            </div>
          ) : isLoading ? (
            <div className="flex items-center justify-center py-20 gap-3 text-slate-400">
              <div className="animate-spin h-5 w-5 border-2 border-primary border-t-transparent rounded-full" />
              Loading questions...
            </div>
          ) : questions.length === 0 ? (
            <div className="text-center py-20 text-slate-400">No questions available.</div>
          ) : (
            questions.map((q, idx) => (
              <div
                key={q.id}
                className="bg-white rounded-2xl border border-slate-100 shadow-sm overflow-hidden"
              >
                {/* Question header */}
                <div className="flex items-start gap-3 px-5 py-4 border-b border-slate-50">
                  <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary text-sm font-bold border border-primary/10">
                    {idx + 1}
                  </span>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-slate-800 text-sm leading-relaxed">{q.content}</p>
                    <div className="flex items-center gap-2 mt-1.5 flex-wrap">
                      <span className="text-xs text-slate-400 bg-slate-50 px-2 py-0.5 rounded-full border border-slate-100">
                        {q.type?.replace(/_/g, " ")}
                      </span>
                      <span className="text-xs font-semibold text-accent">{q.points} pts</span>
                    </div>
                  </div>
                </div>

                {/* Answer area */}
                <div className="px-5 py-4">
                  {q.type === "MULTIPLE_CHOICE" || q.type === "TRUE_FALSE" ? (
                    <div className="space-y-2">
                      {(q.options || []).map((opt, oi) => (
                        <label
                          key={oi}
                          className={`flex items-center gap-3 p-3.5 rounded-xl border-2 cursor-pointer transition-all select-none ${
                            answers[q.id] === opt
                              ? "border-primary bg-primary/5"
                              : "border-slate-100 bg-slate-50/50 hover:border-slate-200 hover:bg-white"
                          }`}
                        >
                          <div className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border-2 transition-colors ${
                            answers[q.id] === opt ? "border-primary" : "border-slate-300"
                          }`}>
                            {answers[q.id] === opt && (
                              <div className="h-2 w-2 rounded-full bg-primary" />
                            )}
                          </div>
                          <input
                            type="radio"
                            name={`q-${q.id}`}
                            value={opt}
                            checked={answers[q.id] === opt}
                            onChange={() => handleAnswer(q.id, opt)}
                            className="sr-only"
                          />
                          <span className={`text-sm ${answers[q.id] === opt ? "font-medium text-primary" : "text-slate-700"}`}>
                            {opt}
                          </span>
                        </label>
                      ))}
                    </div>
                  ) : (
                    <textarea
                      className="w-full border border-slate-200 rounded-xl p-3 text-sm text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none bg-slate-50 focus:bg-white transition-colors"
                      rows={4}
                      placeholder="Type your answer here..."
                      value={answers[q.id] || ""}
                      onChange={(e) => handleAnswer(q.id, e.target.value)}
                    />
                  )}
                </div>
              </div>
            ))
          )}
        </div>

        {/* ── Fixed Footer ── */}
        {!submitted && !isLoading && questions.length > 0 && (
          <div className="flex-none border-t border-slate-100 bg-white px-6 py-4 flex items-center justify-between gap-3 rounded-b-3xl">
            <Button variant="outline" onClick={onClose} className="rounded-xl">
              Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              className="rounded-xl shadow-md shadow-primary/20 px-8"
            >
              <Send className="h-4 w-4 mr-2" />
              {isSubmitting ? "Submitting..." : "Submit Quiz"}
            </Button>
          </div>
        )}
      </div> {/* end modal card */}
      </div> {/* end centered container */}
    </>
  );

  return ReactDOM.createPortal(modalContent, document.body);
}

// ─── Rating Modal ─────────────────────────────────────────────────────────────
function RatingModal({ courseId, onClose }) {
  const [starCount, setStarCount] = useState(5);
  const [hovered, setHovered] = useState(0);
  const [comment, setComment] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async () => {
    try {
      setIsSubmitting(true);
      await studentApi.submitRating(courseId, { starCount, comment });
      alert("Rating submitted successfully! Thank you for your feedback.");
      onClose();
    } catch (err) {
      console.error(err);
      const status = err?.response?.status;
      const msg = err?.response?.data?.message;

      if (status === 409) {
        alert("You have already rated this course!");
      } else if (msg) {
        alert(`Error: ${msg}`);
      } else {
        alert("Rating failed. Please try again.");
      }
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 backdrop-blur-sm p-4">
      <div className="bg-white rounded-3xl shadow-2xl w-full max-w-md p-8 space-y-6">
        <div className="flex items-center justify-between">
          <h3 className="font-display text-xl font-bold text-slate-900">Rate this Course</h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100">
            <X className="h-5 w-5 text-slate-500" />
          </button>
        </div>
        <div className="flex justify-center gap-2">
          {[1, 2, 3, 4, 5].map((s) => (
            <button
              key={s}
              onMouseEnter={() => setHovered(s)}
              onMouseLeave={() => setHovered(0)}
              onClick={() => setStarCount(s)}
              className="transition-transform hover:scale-110"
            >
              <Star
                className={`h-10 w-10 ${(hovered || starCount) >= s ? "fill-amber-400 text-amber-400" : "text-slate-300"}`}
              />
            </button>
          ))}
        </div>
        <p className="text-center text-sm text-slate-500">{starCount} star{starCount > 1 ? 's' : ''}</p>
        <textarea
          className="w-full border border-slate-200 rounded-2xl p-4 text-slate-700 focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          rows={4}
          placeholder="Share your thoughts about this course..."
          value={comment}
          onChange={(e) => setComment(e.target.value)}
        />
        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={onClose} className="rounded-2xl">Cancel</Button>
          <Button onClick={handleSubmit} disabled={isSubmitting} className="rounded-2xl shadow-md shadow-primary/20">
            {isSubmitting ? "Submitting..." : "Submit Rating"}
          </Button>
        </div>
      </div>
    </div>
  );
}

// ─── Module Content Renderer ──────────────────────────────────────────────────
function ModuleContentRenderer({ moduleId }) {
  const [contents, setContents] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [activeQuiz, setActiveQuiz] = useState(null);
  // psId → score (null = submitted but no score yet)
  const [completedQuizzes, setCompletedQuizzes] = useState({});

  const handleQuizComplete = (psId, score) => {
    setCompletedQuizzes((prev) => ({ ...prev, [psId]: score }));
  };

  useEffect(() => {
    if (moduleId) fetchContents();
  }, [moduleId]);

  const fetchContents = async () => {
    try {
      setIsLoading(true);
      // Backend: { status, message, data: { materials: [...], problemSets: [...] } }
      const res = await studentApi.getModuleContents(moduleId);
      console.log("[ModuleContent] raw response:", res);

      // axios trả về response.data → res = { status, message, data: {...} }
      const inner = res?.data ?? res;
      const safeArr = (v) => (Array.isArray(v) ? v : []);

      setContents({
        materials: safeArr(inner?.materials),
        problemSets: safeArr(inner?.problemSets),
      });
    } catch (err) {
      console.error("[ModuleContent] error:", err);
      if (err?.response?.status === 403) {
        setContents({ materials: [], problemSets: [], forbidden: true });
      }
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="pl-[5.5rem] py-4 flex items-center gap-2 text-slate-400">
        <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
        Loading content...
      </div>
    );
  }

  const materials = contents?.materials || [];
  const problemSets = contents?.problemSets || [];


  if (!materials.length && !problemSets.length) {
    return (
      <div className="pl-[5.5rem] py-4 text-slate-400 italic">No content available in this module yet.</div>
    );
  }

  return (
    <div className="space-y-2 pl-[5.5rem]">
      {/* Materials */}
      {materials.map((mat, idx) => {
        const isVideo = mat.type === "VIDEO";
        return (
          <div
            key={`mat-${mat.id || idx}`}
            className="group flex items-center justify-between p-3 hover:bg-white rounded-xl transition-all border border-transparent hover:border-slate-100 hover:shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full transition-colors ${isVideo ? "bg-blue-50 text-blue-500 group-hover:bg-blue-100" : "bg-purple-50 text-purple-500 group-hover:bg-purple-100"}`}>
                {isVideo ? <PlayCircle className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>
              <div>
                <span className="text-base font-medium text-slate-700 group-hover:text-slate-900 block">
                  {mat.title || mat.name}
                </span>
                <span className="text-xs text-slate-400">{mat.type}</span>
              </div>
            </div>
            {(mat.fileUrl || mat.contentUrl) && (
              <a
                href={mat.fileUrl || mat.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
              >
                <LinkIcon className="h-3.5 w-3.5" />
                {isVideo ? "Watch Video" : "View Document"}
              </a>
            )}
          </div>
        );
      })}

      {/* Problem Sets */}
      {problemSets.map((ps, idx) => {
        const isOverdue = ps.dueDate && new Date(ps.dueDate) < new Date();
        const isDone = ps.id in completedQuizzes;
        const score = completedQuizzes[ps.id];
        return (
          <div
            key={`ps-${ps.id || idx}`}
            className={`flex items-center justify-between p-4 rounded-xl mt-3 border ${
              isDone
                ? "border-emerald-200 bg-emerald-50"
                : "border-accent/20 bg-accent/5"
            }`}
          >
            <div className="flex items-center gap-4">
              <div className={`flex h-10 w-10 items-center justify-center rounded-full ${
                isDone ? "bg-emerald-100 text-emerald-600" : "bg-accent/10 text-accent"
              }`}>
                {isDone ? <CheckCircle2 className="h-5 w-5" /> : <FileText className="h-5 w-5" />}
              </div>
              <div>
                <span className={`text-base font-semibold block ${
                  isDone ? "text-emerald-700" : "text-accent"
                }`}>{ps.title}</span>
                <div className="flex items-center gap-2 mt-0.5">
                  {isDone ? (
                    <span className="text-xs text-emerald-600 font-medium">
                      {score !== null && score !== undefined
                        ? `Score: ${score}`
                        : "Submitted"}
                    </span>
                  ) : (
                    <>
                      {ps.dueDate && (
                        <span className={`text-xs flex items-center gap-1 ${isOverdue ? "text-red-500" : "text-slate-500"}`}>
                          <Clock className="h-3 w-3" />
                          {isOverdue ? "Overdue: " : "Due: "}
                          {new Date(ps.dueDate).toLocaleDateString("en-US")}
                        </span>
                      )}
                      {ps.timeLimitMins && (
                        <span className="text-xs text-slate-400">&bull; {ps.timeLimitMins} min</span>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
            {isDone ? (
              <span className="text-xs font-semibold text-emerald-600 bg-emerald-100 px-3 py-1.5 rounded-full">
                ✓ Completed
              </span>
            ) : (
              <Button
                size="sm"
                className="rounded-xl shadow-sm shadow-primary/20"
                onClick={() => setActiveQuiz(ps)}
              >
                <ChevronRight className="h-4 w-4 mr-1" />
                Start Quiz
              </Button>
            )}
          </div>
        );
      })}

      {/* Quiz Modal */}
      {activeQuiz && (
        <QuizModal
          problemSet={activeQuiz}
          onClose={() => setActiveQuiz(null)}
          onComplete={handleQuizComplete}
        />
      )}
    </div>
  );
}

// ─── Main Component ───────────────────────────────────────────────────────────
export function StudentCourseDetail() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { setPageTitle } = useCourses();

  const [course, setCourse] = useState(null);
  const [modules, setModules] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  const [showRating, setShowRating] = useState(false);
  const [myRating, setMyRating] = useState(null); // số sao đã rate, null = chưa rate

  useEffect(() => {
    fetchCourseAndModules();
    // Clear breadcrumb on unmount
    return () => setPageTitle(null);
  }, [id]);

  const fetchCourseAndModules = async () => {
    try {
      setIsLoading(true);
      const [coursesRes, modulesRes, ratingsRes] = await Promise.allSettled([
        studentApi.getMyCourses(),
        studentApi.getModulesByCourse(id),
        studentApi.getRating(id),
      ]);

      // Course
      if (coursesRes.status === "fulfilled") {
        const myCourses = coursesRes.value?.data || coursesRes.value || [];
        const found = myCourses.find(
          (c) => String(c.id || c.courseID) === String(id)
        );
        setCourse(found || null);
        // Update breadcrumb with real course name
        const name = found?.courseName || found?.title || null;
        if (name) setPageTitle(name);
      }

      // Modules
      if (modulesRes.status === "fulfilled") {
        const raw = modulesRes.value?.data ?? modulesRes.value;
        setModules(Array.isArray(raw) ? raw : []);
      }

      // My Rating — tìm rating của user hiện tại
      if (ratingsRes.status === "fulfilled") {
        const ratings = ratingsRes.value?.data || ratingsRes.value || [];
        if (Array.isArray(ratings) && user?.id) {
          const mine = ratings.find(
            (r) => String(r.studentId || r.userId || r.student?.id) === String(user.id)
          );
          if (mine) setMyRating(mine.starCount ?? mine.star ?? mine.rating ?? null);
        }
      }
    } catch (err) {
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64 gap-3 text-slate-400">
        <div className="animate-spin h-6 w-6 border-2 border-primary border-t-transparent rounded-full" />
        Loading course details...
      </div>
    );
  }

  const courseName = course?.courseName || course?.title || "Course";
  const joinCode = course?.joinCode || course?.code || "";
  const description = course?.description || "";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Hero banner */}
      <div className="glass-panel p-8 rounded-[2rem] relative overflow-hidden">
        <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3" />
        <div className="absolute bottom-0 left-0 w-48 h-48 bg-purple-500/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4" />

        <div className="relative z-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-start">
          <div className="space-y-4">
            <div className="flex items-center gap-3 flex-wrap">
              {joinCode && (
                <Badge variant="outline" className="border-slate-300 text-slate-700 font-bold tracking-wider rounded-full px-4 py-1.5">
                  {joinCode}
                </Badge>
              )}
              <Badge className="!bg-emerald-500 rounded-full px-4 py-1.5 text-white font-normal">
                Enrolled
              </Badge>
            </div>
            <div>
              <h2 className="font-display text-4xl sm:text-5xl font-bold tracking-tight text-slate-900 leading-tight">
                {courseName}
              </h2>
              {course?.instructor && (
                <div className="flex items-center gap-1.5 mt-3 text-slate-600 font-medium">
                  <GraduationCap className="h-5 w-5 text-slate-400" />
                  <span>{course.instructor}</span>
                </div>
              )}
            </div>
          </div>
          {myRating ? (
            // Đã rating — hiện số sao, click để mở lại modal
            <button
              onClick={() => setShowRating(true)}
              className="flex items-center gap-1.5 rounded-xl bg-amber-50 border border-amber-200 px-4 py-2 hover:bg-amber-100 transition-colors shrink-0"
              title="You've rated this course. Click to update."
            >
              {[1, 2, 3, 4, 5].map((s) => (
                <Star
                  key={s}
                  className={`h-4 w-4 ${
                    s <= myRating
                      ? "fill-amber-400 text-amber-400"
                      : "text-amber-200"
                  }`}
                />
              ))}
              <span className="ml-1 text-sm font-semibold text-amber-600">{myRating}/5</span>
            </button>
          ) : (
            <Button
              variant="outline"
              className="rounded-xl bg-white/60 hover:bg-white shadow-sm border-slate-200/60 shrink-0 gap-2"
              onClick={() => setShowRating(true)}
            >
              <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
              Rate Course
            </Button>
          )}
        </div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="content" className="w-full">
        <TabsList>
          <TabsTrigger value="overview" className="rounded-xl">Overview</TabsTrigger>
          <TabsTrigger value="content" className="rounded-xl">Content</TabsTrigger>
        </TabsList>

        {/* Overview */}
        <TabsContent value="overview" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <Card className="glass border-none shadow-xl shadow-slate-200/40">
            <CardHeader className="pb-4">
              <CardTitle className="font-display text-2xl">Course Description</CardTitle>
            </CardHeader>
            <CardContent className="text-slate-700 leading-relaxed text-lg">
              {description ? (
                <p>{description}</p>
              ) : (
                <p className="text-slate-400 italic">No description available for this course.</p>
              )}
            </CardContent>
          </Card>
        </TabsContent>

        {/* Content: Modules */}
        <TabsContent value="content" className="mt-0 animate-in fade-in slide-in-from-bottom-2 duration-500">
          <div className="mb-6">
            <h3 className="font-display text-2xl font-semibold text-slate-900">
              Modules ({modules.length})
            </h3>
            <p className="text-slate-500 mt-1">Click on each module to view materials and assignments.</p>
          </div>

          {modules.length === 0 ? (
            <Card className="glass border-none shadow-xl shadow-slate-200/40">
              <CardContent className="flex flex-col items-center justify-center py-20 gap-4">
                <BookOpen className="h-16 w-16 text-slate-200" />
                <p className="text-slate-400 font-medium text-lg">No modules available for this course yet.</p>
              </CardContent>
            </Card>
          ) : (
            <Accordion type="multiple" className="w-full space-y-3">
              {modules.map((module, index) => (
                <AccordionItem
                  key={module.id || module.moduleID || index}
                  value={`module-${module.id || index}`}
                  className="glass border-none shadow-lg shadow-slate-200/40 rounded-2xl overflow-hidden"
                >
                  <AccordionTrigger className="hover:no-underline py-5 px-6 hover:bg-slate-50/50 rounded-2xl">
                    <div className="flex items-center gap-5 text-left w-full pr-4">
                      <div className="flex h-14 w-14 shrink-0 items-center justify-center rounded-2xl bg-gradient-to-br from-primary/10 to-accent/10 text-primary font-display text-xl font-bold border border-primary/10">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <div className="font-display text-lg font-semibold text-slate-900 truncate">
                          {module.title || module.name || `Module ${index + 1}`}
                        </div>
                        {module.description && (
                          <div className="text-sm text-slate-500 mt-0.5 truncate">{module.description}</div>
                        )}
                      </div>
                    </div>
                  </AccordionTrigger>
                  <AccordionContent className="pt-0 pb-5 px-6">
                    <ModuleContentRenderer moduleId={module.id || module.moduleID} />
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          )}
        </TabsContent>
      </Tabs>

      {/* Rating Modal */}
      {showRating && (
        <RatingModal courseId={id} onClose={() => setShowRating(false)} />
      )}
    </div>
  );
}
