import React, { useState, useEffect } from "react";
import { Plus, X, Save, Pencil } from "lucide-react";
import { useUpdateProblemSetMutation } from "@/hooks/useTeacher";
import { useToast } from "@/contexts/ToastContext";
import { emptyQuestion } from "./quizHelpers";

export function EditQuizModal({ quiz, moduleId, courseId, onClose, onSaved }) {
  const { toast }        = useToast();
  const updateMutation   = useUpdateProblemSetMutation();

  const [title,          setTitle]          = useState(quiz.title);
  const [dueDate,        setDueDate]        = useState(quiz.dueDate ? quiz.dueDate.slice(0, 16) : "");
  const [timeLimitMins,  setTimeLimitMins]  = useState(quiz.timeLimitMins ?? 45);
  const [questions,      setQuestions]      = useState(
    quiz.questions.length > 0
      ? quiz.questions.map((q) => ({ ...q, _tempId: q.id || `q-${Math.random()}` }))
      : [emptyQuestion()]
  );

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => { document.body.style.overflow = ""; };
  }, []);

  const updateQ    = (idx, field, value) =>
    setQuestions((prev) => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));

  const updateOpt  = (qIdx, oIdx, value) =>
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const opts = [...q.options];
        opts[oIdx] = value;
        return { ...q, options: opts };
      })
    );

  const addQuestion   = () => setQuestions((p) => [...p, emptyQuestion()]);
  const removeQ       = (idx) => setQuestions((p) => p.filter((_, i) => i !== idx));
  const addOption     = (idx) =>
    setQuestions((p) => p.map((q, i) => i === idx ? { ...q, options: [...q.options, ""] } : q));
  const removeOption  = (qIdx, oIdx) =>
    setQuestions((p) =>
      p.map((q, i) =>
        i === qIdx ? { ...q, options: q.options.filter((_, oi) => oi !== oIdx) } : q
      )
    );

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) {
      toast({ title: "Missing fields", description: "Fill in title and due date.", variant: "error" });
      return;
    }
    const payload = {
      title: title.trim(),
      dueDate,
      timeLimitMins: Number(timeLimitMins),
      questions: questions.map((q) => ({
        ...(q.id ? { id: q.id } : {}),
        content:    q.content.trim(),
        type:       q.type,
        correctAns: q.correctAns.trim(),
        points:     Number(q.points),
        options:
          q.type === "MULTIPLE_CHOICE" || q.type === "TRUE_FALSE"
            ? q.options.filter((o) => o.trim() !== "")
            : [],
      })),
    };
    try {
      await updateMutation.mutateAsync({ problemSetId: quiz.id, moduleId, courseId, data: payload });
      toast({ title: "Saved", description: "Quiz updated successfully.", variant: "success" });
      onSaved();
      onClose();
    } catch (err) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to save quiz.", variant: "error" });
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/50 flex items-start justify-center p-4 overflow-y-auto">
      <div className="bg-white w-full max-w-2xl rounded-2xl shadow-2xl border border-slate-200 my-6">
        <div className="flex items-center justify-between px-6 py-4 border-b border-slate-200 sticky top-0 bg-white rounded-t-2xl z-10">
          <h3 className="text-lg font-semibold text-slate-800 flex items-center gap-2">
            <Pencil className="w-5 h-5 text-primary" /> Edit Quiz
          </h3>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-6">
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-700 mb-1">Quiz Title</label>
              <input
                required
                className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Enter quiz title"
              />
            </div>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Due Date</label>
                <input
                  type="datetime-local" required
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Time Limit (mins)</label>
                <input
                  type="number" min="1"
                  className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
                  value={timeLimitMins}
                  onChange={(e) => setTimeLimitMins(e.target.value)}
                />
              </div>
            </div>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-slate-800">Questions ({questions.length})</h4>
              <button type="button" onClick={addQuestion} className="text-sm text-primary hover:underline flex items-center gap-1">
                <Plus className="w-4 h-4" /> Add Question
              </button>
            </div>

            {questions.map((q, qIdx) => (
              <QuestionEditor
                key={q._tempId || qIdx}
                question={q}
                index={qIdx}
                isOnly={questions.length === 1}
                onUpdate={(field, value) => updateQ(qIdx, field, value)}
                onUpdateOption={(oIdx, val) => updateOpt(qIdx, oIdx, val)}
                onRemove={() => removeQ(qIdx)}
                onAddOption={() => addOption(qIdx)}
                onRemoveOption={(oIdx) => removeOption(qIdx, oIdx)}
              />
            ))}
          </div>

          <div className="flex justify-end gap-3 pt-2 border-t border-slate-100">
            <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm">
              Cancel
            </button>
            <button
              type="submit"
              disabled={updateMutation.isPending}
              className="px-5 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-sm flex items-center gap-2 disabled:opacity-60"
            >
              <Save className="w-4 h-4" />
              {updateMutation.isPending ? "Saving…" : "Save Changes"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

function QuestionEditor({ question: q, index, isOnly, onUpdate, onUpdateOption, onRemove, onAddOption, onRemoveOption }) {
  return (
    <div className="border border-slate-200 rounded-xl p-4 space-y-3">
      <div className="flex items-center justify-between">
        <span className="text-sm font-medium text-slate-600">Question {index + 1}</span>
        {!isOnly && (
          <button type="button" onClick={onRemove} className="p-1 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded">
            <X className="w-4 h-4" />
          </button>
        )}
      </div>

      <div>
        <label className="block text-xs text-slate-500 mb-1">Content</label>
        <textarea
          className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm min-h-[80px] focus:outline-none focus:ring-2 focus:ring-primary/30 resize-none"
          value={q.content}
          onChange={(e) => onUpdate("content", e.target.value)}
          placeholder="Question text…"
        />
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
        <div>
          <label className="block text-xs text-slate-500 mb-1">Type</label>
          <select
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={q.type}
            onChange={(e) => {
              const t = e.target.value;
              onUpdate("type", t);
              if (t === "TRUE_FALSE")   onUpdate("options", ["True", "False"]);
              if (t === "SHORT_ANSWER") onUpdate("options", []);
            }}
          >
            <option value="MULTIPLE_CHOICE">Multiple Choice</option>
            <option value="TRUE_FALSE">True / False</option>
            <option value="SHORT_ANSWER">Short Answer</option>
          </select>
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Correct Answer</label>
          <input
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={q.correctAns}
            onChange={(e) => onUpdate("correctAns", e.target.value)}
            placeholder="Correct answer"
          />
        </div>
        <div>
          <label className="block text-xs text-slate-500 mb-1">Points</label>
          <input
            type="number" min="0" step="0.5"
            className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30"
            value={q.points}
            onChange={(e) => onUpdate("points", e.target.value)}
          />
        </div>
      </div>

      {(q.type === "MULTIPLE_CHOICE" || q.type === "TRUE_FALSE") && (
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <label className="text-xs text-slate-500">Options</label>
            {q.type === "MULTIPLE_CHOICE" && (
              <button type="button" onClick={onAddOption} className="text-xs text-primary hover:underline">
                + Add option
              </button>
            )}
          </div>
          {q.options.map((opt, oIdx) => (
            <div key={oIdx} className="flex gap-2">
              <input
                className="flex-1 border border-slate-300 rounded-xl px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 disabled:bg-slate-50"
                value={opt}
                onChange={(e) => onUpdateOption(oIdx, e.target.value)}
                disabled={q.type === "TRUE_FALSE"}
                placeholder={`Option ${oIdx + 1}`}
              />
              {q.type === "MULTIPLE_CHOICE" && q.options.length > 2 && (
                <button type="button" onClick={() => onRemoveOption(oIdx)} className="p-1.5 text-red-400 hover:text-red-600 hover:bg-red-50 rounded">
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
