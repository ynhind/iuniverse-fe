import React, { useState, useEffect } from "react";
import { ModalWrapper } from "./ModalWrapper";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { UploadCloud, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";

// --- VIDEO MODAL ---
export function VideoModal({ isOpen, onClose, onAdd }) {
  const [data, setData] = useState({ title: "", description: "", url: "", duration: "" });

  useEffect(() => { if (isOpen) setData({ title: "", description: "", url: "", duration: "" }) }, [isOpen]);

  const handleSubmit = () => {
    if (!data.title) return;
    onAdd({ type: "video", id: `item-${Date.now()}`, ...data });
    onClose();
  };

  return (
    <ModalWrapper title="Add Video Lesson" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} submitText="Add Video">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Lesson Title <span className="text-red-500">*</span></Label>
          <Input value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="e.g. Introduction to Variables" />
        </div>
        <div className="space-y-2">
          <Label>Description</Label>
          <textarea 
            value={data.description} onChange={e => setData({...data, description: e.target.value})}
            className="w-full p-2 border border-slate-200 rounded-lg text-sm min-h-[80px]" placeholder="Brief context about this video..."
          />
        </div>
        <div className="space-y-2">
          <Label>Video URL</Label>
          <Input value={data.url} onChange={e => setData({...data, url: e.target.value})} placeholder="https://youtube.com/... or Vimeo link" />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Duration</Label>
            <Input value={data.duration} onChange={e => setData({...data, duration: e.target.value})} placeholder="e.g. 10:45" />
          </div>
        </div>
        <div className="pt-2 border-t border-slate-100 flex items-center justify-between">
           <span className="text-sm font-medium text-slate-700">Free Preview</span>
           <input type="checkbox" className="w-4 h-4 rounded text-primary focus:ring-primary" />
        </div>
      </div>
    </ModalWrapper>
  );
}

// --- RESOURCE MODAL ---
export function ResourceModal({ isOpen, onClose, onAdd }) {
  const [data, setData] = useState({ title: "", url: "" });

  useEffect(() => { if (isOpen) setData({ title: "", url: "" }) }, [isOpen]);

  const handleSubmit = () => {
    if (!data.title) return;
    onAdd({ type: "resource", id: `item-${Date.now()}`, ...data });
    onClose();
  };

  return (
    <ModalWrapper title="Add Document / Resource" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} submitText="Add Resource">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Resource Name <span className="text-red-500">*</span></Label>
          <Input value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="e.g. Chapter 1 PDF" />
        </div>
        <div className="space-y-3">
           <Label>File Upload</Label>
           <div className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary/50">
              <UploadCloud className="w-6 h-6 text-slate-400 mb-2" />
              <p className="text-sm text-slate-600">Select a file from your computer</p>
           </div>
        </div>
        <div className="flex items-center gap-2 my-2">
           <div className="h-px bg-slate-200 flex-1"></div>
           <span className="text-xs text-slate-400 font-medium uppercase tracking-wider">OR</span>
           <div className="h-px bg-slate-200 flex-1"></div>
        </div>
        <div className="space-y-2">
          <Label>External Link</Label>
          <Input value={data.url} onChange={e => setData({...data, url: e.target.value})} placeholder="https://..." />
        </div>
      </div>
    </ModalWrapper>
  );
}

// --- ASSIGNMENT MODAL ---
export function AssignmentModal({ isOpen, onClose, onAdd }) {
  const [data, setData] = useState({ title: "", maxScore: "100", dueDate: "" });

  useEffect(() => { if (isOpen) setData({ title: "", maxScore: "100", dueDate: "" }) }, [isOpen]);

  const handleSubmit = () => {
    if (!data.title) return;
    onAdd({ type: "assignment", id: `item-${Date.now()}`, ...data });
    onClose();
  };

  return (
    <ModalWrapper title="Create Assignment" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} submitText="Create Assignment">
      <div className="space-y-4">
        <div className="space-y-2">
          <Label>Assignment Title <span className="text-red-500">*</span></Label>
          <Input value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="e.g. Final Essay Draft" />
        </div>
        <div className="space-y-2">
          <Label>Instructions</Label>
          <textarea className="w-full p-2 border border-slate-200 rounded-lg text-sm min-h-[100px]" placeholder="Detailed instructions for students..." />
        </div>
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Max Score</Label>
            <Input type="number" value={data.maxScore} onChange={e => setData({...data, maxScore: e.target.value})} />
          </div>
          <div className="space-y-2">
            <Label>Due Date</Label>
            <Input type="date" value={data.dueDate} onChange={e => setData({...data, dueDate: e.target.value})} />
          </div>
        </div>
        <div className="space-y-2">
          <Label>Submission Type</Label>
          <select className="w-full h-10 px-3 py-2 bg-white border border-slate-200 rounded-lg text-sm">
            <option>File Upload</option>
            <option>Text Response</option>
            <option>External Link</option>
            <option>Multiple Formats</option>
          </select>
        </div>
      </div>
    </ModalWrapper>
  );
}

// --- QUIZ MODAL ---
export function QuizModal({ isOpen, onClose, onAdd }) {
  const [data, setData] = useState({ title: "", questions: [] });

  useEffect(() => { if (isOpen) setData({ title: "", questions: [] }) }, [isOpen]);

  const handleSubmit = () => {
    if (!data.title) return;
    onAdd({ type: "quiz", id: `item-${Date.now()}`, ...data });
    onClose();
  };

  return (
    <ModalWrapper title="Create Quiz" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} submitText="Create Quiz">
      <div className="space-y-6">
        <div className="space-y-2">
          <Label>Quiz Title <span className="text-red-500">*</span></Label>
          <Input value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="e.g. Midterm Assessment" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Time Limit (minutes)</Label>
            <Input type="number" placeholder="Optional" />
          </div>
          <div className="space-y-2">
            <Label>Passing Score (%)</Label>
            <Input type="number" placeholder="80" />
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
           <h4 className="font-semibold text-sm text-slate-700">Questions ({data.questions.length})</h4>
           {data.questions.length === 0 && (
             <p className="text-sm text-slate-500 text-center py-4">No questions added yet.</p>
           )}
           <Button variant="outline" className="w-full text-sm h-9 bg-white" onClick={() => setData({...data, questions: [...data.questions, { q: "" }]})}>
             <Plus className="w-4 h-4 mr-2" /> Add Question
           </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}
