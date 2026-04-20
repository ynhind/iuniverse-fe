import React, { useEffect, useState } from "react";
import { Upload, Link as LinkIcon, Plus, X } from "lucide-react";
import { ModalWrapper } from "@/components/teacher/shared/ModalWrapper";
import { emptyQuestion } from "@/components/teacher/quiz/quizHelpers";

function useResetOnClose(isOpen, reset) {
  useEffect(() => { if (!isOpen) reset(); }, [isOpen]);
}

function FormField({ label, children }) {
  return (
    <div>
      <label className="block text-sm font-medium text-slate-700 mb-1">{label}</label>
      {children}
    </div>
  );
}

const INPUT_CLS  = "w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30";
const TEXTAREA_CLS = `${INPUT_CLS} min-h-[90px] resize-none`;

function ModalFooter({ onClose, submitLabel }) {
  return (
    <div className="flex justify-end gap-3 pt-2">
      <button type="button" onClick={onClose} className="px-4 py-2 rounded-xl border border-slate-300 text-slate-700 hover:bg-slate-50 text-sm">
        Cancel
      </button>
      <button type="submit" className="px-4 py-2 rounded-xl bg-primary text-white hover:bg-primary/90 text-sm">
        {submitLabel}
      </button>
    </div>
  );
}

export function VideoModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle]       = useState("");
  const [url, setUrl]           = useState("");
  const [description, setDesc]  = useState("");

  useResetOnClose(isOpen, () => { setTitle(""); setUrl(""); setDesc(""); });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onAdd({ title: title.trim(), description: description.trim(), type: "video", materialType: "VIDEO", contentUrl: url.trim() });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add YouTube Video">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Title"><input className={INPUT_CLS} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Video title" /></FormField>
        <FormField label="YouTube URL"><input className={INPUT_CLS} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://www.youtube.com/watch?v=..." /></FormField>
        <FormField label="Description"><textarea className={TEXTAREA_CLS} value={description} onChange={(e) => setDesc(e.target.value)} placeholder="Optional description" /></FormField>
        <ModalFooter onClose={onClose} submitLabel="Add Video" />
      </form>
    </ModalWrapper>
  );
}

export function ResourceModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle]     = useState("");
  const [description, setDesc] = useState("");
  const [mode, setMode]       = useState("link");
  const [url, setUrl]         = useState("");
  const [file, setFile]       = useState(null);

  useResetOnClose(isOpen, () => { setTitle(""); setDesc(""); setMode("link"); setUrl(""); setFile(null); });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim()) return;
    const base = { title: title.trim(), description: description.trim(), type: "resource", materialType: "DOCUMENT" };
    if (mode === "link") {
      if (!url.trim()) return;
      onAdd({ ...base, contentUrl: url.trim() });
    } else {
      if (!file) return;
      onAdd({ ...base, file });
    }
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add Resource">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Title"><input className={INPUT_CLS} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Resource title" /></FormField>

        <div className="flex gap-2">
          {[
            { id: "link", icon: <LinkIcon className="w-4 h-4 inline mr-1" />, label: "Link" },
            { id: "file", icon: <Upload   className="w-4 h-4 inline mr-1" />, label: "File" },
          ].map(({ id, icon, label }) => (
            <button
              key={id} type="button" onClick={() => setMode(id)}
              className={`flex-1 px-3 py-2 rounded-xl border text-sm ${mode === id ? "border-primary bg-primary/10 text-primary" : "border-slate-300 text-slate-700"}`}
            >
              {icon}{label}
            </button>
          ))}
        </div>

        {mode === "link"
          ? <FormField label="Resource URL"><input className={INPUT_CLS} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://drive.google.com/..." /></FormField>
          : <FormField label="Choose file"><input type="file" className={INPUT_CLS} onChange={(e) => setFile(e.target.files?.[0] || null)} /></FormField>
        }

        <FormField label="Description"><textarea className={TEXTAREA_CLS} value={description} onChange={(e) => setDesc(e.target.value)} placeholder="Optional description" /></FormField>
        <ModalFooter onClose={onClose} submitLabel="Add Resource" />
      </form>
    </ModalWrapper>
  );
}

export function AssignmentModal({ isOpen, onClose, onAdd }) {
  const [title, setTitle]     = useState("");
  const [url, setUrl]         = useState("");
  const [description, setDesc] = useState("");

  useResetOnClose(isOpen, () => { setTitle(""); setUrl(""); setDesc(""); });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !url.trim()) return;
    onAdd({ title: title.trim(), description: description.trim(), type: "assignment", materialType: "ASSIGNMENT", contentUrl: url.trim() });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Add Assignment">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <FormField label="Title"><input className={INPUT_CLS} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Assignment title" /></FormField>
        <FormField label="Assignment URL"><input className={INPUT_CLS} value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://..." /></FormField>
        <FormField label="Description"><textarea className={TEXTAREA_CLS} value={description} onChange={(e) => setDesc(e.target.value)} placeholder="Optional description" /></FormField>
        <ModalFooter onClose={onClose} submitLabel="Add Assignment" />
      </form>
    </ModalWrapper>
  );
}

export function QuizModal({ isOpen, onClose, onAdd }) {
  const [title,         setTitle]         = useState("");
  const [dueDate,       setDueDate]       = useState("");
  const [timeLimitMins, setTimeLimitMins] = useState(45);
  const [questions,     setQuestions]     = useState([emptyQuestion()]);

  useResetOnClose(isOpen, () => { setTitle(""); setDueDate(""); setTimeLimitMins(45); setQuestions([emptyQuestion()]); });

  const updateQ   = (idx, field, value) =>
    setQuestions((prev) => prev.map((q, i) => i === idx ? { ...q, [field]: value } : q));
  const updateOpt = (qIdx, oIdx, value) =>
    setQuestions((prev) =>
      prev.map((q, i) => {
        if (i !== qIdx) return q;
        const opts = [...q.options]; opts[oIdx] = value; return { ...q, options: opts };
      })
    );
  const addQuestion    = () => setQuestions((p) => [...p, emptyQuestion()]);
  const removeQuestion = (idx) => setQuestions((p) => p.filter((_, i) => i !== idx));
  const addOption      = (idx) => setQuestions((p) => p.map((q, i) => i === idx ? { ...q, options: [...q.options, ""] } : q));
  const removeOption   = (qIdx, oIdx) =>
    setQuestions((p) =>
      p.map((q, i) => i === qIdx ? { ...q, options: q.options.filter((_, oi) => oi !== oIdx) } : q)
    );

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!title.trim() || !dueDate) return;
    onAdd({
      title: title.trim(),
      dueDate,
      timeLimitMins: Number(timeLimitMins),
      questions: questions.map((q) => ({
        content:    q.content.trim(),
        type:       q.type,
        correctAns: q.correctAns.trim(),
        points:     Number(q.points),
        options:
          q.type === "MULTIPLE_CHOICE" || q.type === "TRUE_FALSE"
            ? q.options.filter((o) => o.trim() !== "")
            : [],
      })),
    });
  };

  return (
    <ModalWrapper isOpen={isOpen} onClose={onClose} title="Create Course Quiz">
      <form className="space-y-5 max-h-[70vh] overflow-y-auto pr-1" onSubmit={handleSubmit}>
        <FormField label="Quiz Title">
          <input className={INPUT_CLS} value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Quiz title" />
        </FormField>

        <div className="grid grid-cols-2 gap-4">
          <FormField label="Due Date">
            <input type="datetime-local" className={INPUT_CLS} value={dueDate} onChange={(e) => setDueDate(e.target.value)} />
          </FormField>
          <FormField label="Time Limit (mins)">
            <input type="number" min="1" className={INPUT_CLS} value={timeLimitMins} onChange={(e) => setTimeLimitMins(e.target.value)} />
          </FormField>
        </div>

        <div className="space-y-4">
          {questions.map((q, idx) => (
            <div key={q._tempId || idx} className="border border-slate-200 rounded-xl p-4 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-sm font-medium text-slate-600">Question {idx + 1}</span>
                {questions.length > 1 && (
                  <button type="button" onClick={() => removeQuestion(idx)} className="text-red-500 text-xs hover:underline">Remove</button>
                )}
              </div>

              <FormField label="Content">
                <textarea className={TEXTAREA_CLS} value={q.content} onChange={(e) => updateQ(idx, "content", e.target.value)} placeholder="Question text…" />
              </FormField>

              <div className="grid grid-cols-3 gap-3">
                <FormField label="Type">
                  <select className={INPUT_CLS} value={q.type} onChange={(e) => {
                    const t = e.target.value;
                    updateQ(idx, "type", t);
                    if (t === "TRUE_FALSE")   updateQ(idx, "options", ["True", "False"]);
                    if (t === "SHORT_ANSWER") updateQ(idx, "options", []);
                  }}>
                    <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                    <option value="SHORT_ANSWER">Short Answer</option>
                    <option value="TRUE_FALSE">True / False</option>
                  </select>
                </FormField>
                <FormField label="Correct Answer">
                  <input className={INPUT_CLS} value={q.correctAns} onChange={(e) => updateQ(idx, "correctAns", e.target.value)} />
                </FormField>
                <FormField label="Points">
                  <input type="number" min="0" step="0.5" className={INPUT_CLS} value={q.points} onChange={(e) => updateQ(idx, "points", e.target.value)} />
                </FormField>
              </div>

              {(q.type === "MULTIPLE_CHOICE" || q.type === "TRUE_FALSE") && (
                <div className="space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-slate-500">Options</span>
                    {q.type === "MULTIPLE_CHOICE" && (
                      <button type="button" onClick={() => addOption(idx)} className="text-xs text-primary hover:underline">+ Add option</button>
                    )}
                  </div>
                  {q.options.map((opt, oIdx) => (
                    <div key={oIdx} className="flex gap-2">
                      <input className={`${INPUT_CLS} flex-1`} value={opt} onChange={(e) => updateOpt(idx, oIdx, e.target.value)} disabled={q.type === "TRUE_FALSE"} placeholder={`Option ${oIdx + 1}`} />
                      {q.type === "MULTIPLE_CHOICE" && q.options.length > 2 && (
                        <button type="button" onClick={() => removeOption(idx, oIdx)} className="p-2 text-red-400 hover:text-red-600"><X className="w-3.5 h-3.5" /></button>
                      )}
                    </div>
                  ))}
                </div>
              )}
            </div>
          ))}

          <button type="button" onClick={addQuestion} className="flex items-center gap-1.5 text-sm text-primary hover:underline">
            <Plus className="w-4 h-4" /> Add Question
          </button>
        </div>

        <ModalFooter onClose={onClose} submitLabel="Create Quiz" />
      </form>
    </ModalWrapper>
  );
}