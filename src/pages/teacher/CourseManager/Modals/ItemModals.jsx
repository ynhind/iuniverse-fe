import React, { useState, useEffect } from "react";
import { ModalWrapper } from "./ModalWrapper";
import { Label } from "@/components/ui/Label";
import { Input } from "@/components/ui/Input";
import { UploadCloud, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/Button";
import { useAddMaterialMutation, useCreateProblemSetMutation, useAddQuestionMutation, useUploadFileMutation } from "@/hooks/useTeacher";
import { useToast } from "@/contexts/ToastContext";

// --- VIDEO MODAL ---
export function VideoModal({ isOpen, onClose, onAdd, moduleId, courseId }) {
  const [data, setData] = useState({ title: "", description: "", url: "", duration: "" });
  const addMaterialMutation = useAddMaterialMutation();
  const { toast } = useToast();

  useEffect(() => { if (isOpen) setData({ title: "", description: "", url: "", duration: "" }) }, [isOpen]);

  const handleSubmit = () => {
    if (!data.title) return;
    const materialPayload = { title: data.title, type: "VIDEO", contentUrl: data.url || "https://example.com" };
    
    // API Call
    addMaterialMutation.mutate({ moduleId, data: materialPayload, courseId }, {
       onSuccess: (res) => {
         const realId = res?.id || res?.materialId || `item-${Date.now()}`;
         onAdd({ type: "video", id: realId, ...data });
         toast({ title: "Success", description: "Video material added.", variant: "success" });
         onClose();
       },
       onError: () => toast({ title: "Error", description: "Failed to add video.", variant: "error" })
    });
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
export function ResourceModal({ isOpen, onClose, onAdd, moduleId, courseId }) {
  const [data, setData] = useState({ title: "", url: "" });
  const [isUploading, setIsUploading] = useState(false);
  const [fileName, setFileName] = useState("");
  const fileInputRef = React.useRef(null);
  const addMaterialMutation = useAddMaterialMutation();
  const uploadFileMutation = useUploadFileMutation();
  const { toast } = useToast();

  useEffect(() => { if (isOpen) { setData({ title: "", url: "" }); setFileName(""); setIsUploading(false); } }, [isOpen]);

  const handleFileUpload = async (file) => {
    if (!file) return;
    setIsUploading(true);
    setFileName(file.name);
    try {
      const res = await uploadFileMutation.mutateAsync(file);
      const fileUrl = res?.url || res?.data?.url || URL.createObjectURL(file);
      setData(prev => ({ ...prev, url: fileUrl }));
      toast({ title: "File Uploaded", description: "Resource file ready to be saved.", variant: "success" });
    } catch (e) {
      console.warn("Upload failed, falling back to local object URL", e);
      setData(prev => ({ ...prev, url: URL.createObjectURL(file) }));
      toast({ title: "Local Preview", description: "Using local file URL since API failed.", variant: "success" });
    } finally {
      setIsUploading(false);
    }
  };

  const handleSubmit = () => {
    if (!data.title) return;
    
    const materialPayload = { title: data.title, type: "DOCUMENT", contentUrl: data.url || "https://example.com/doc.pdf" };
    
    addMaterialMutation.mutate({ moduleId, data: materialPayload, courseId }, {
       onSuccess: (res) => {
         const realId = res?.id || res?.materialId || `item-${Date.now()}`;
         onAdd({ type: "resource", id: realId, ...data });
         toast({ title: "Success", description: "Resource material added.", variant: "success" });
         onClose();
       },
       onError: () => toast({ title: "Error", description: "Failed to add resource.", variant: "error" })
    });
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
           <input 
             type="file" 
             className="hidden" 
             ref={fileInputRef} 
             onChange={(e) => handleFileUpload(e.target.files[0])} 
           />
           <div 
             onClick={() => fileInputRef.current?.click()}
             className="border-2 border-dashed border-slate-200 bg-slate-50 rounded-xl flex flex-col items-center justify-center p-6 cursor-pointer hover:border-primary/50 relative"
           >
              {isUploading ? (
                <div className="flex flex-col items-center">
                  <span className="w-6 h-6 border-2 border-primary/30 border-t-primary rounded-full animate-spin mb-2" />
                  <p className="text-sm text-slate-600">Uploading...</p>
                </div>
              ) : fileName ? (
                <div className="flex flex-col items-center text-center">
                  <div className="w-10 h-10 bg-emerald-100 text-emerald-600 rounded-full flex items-center justify-center mb-2">
                     <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 6L9 17l-5-5"/></svg>
                  </div>
                  <p className="text-sm font-medium text-slate-800 line-clamp-1 break-all px-2">{fileName}</p>
                  <p className="text-xs text-slate-500 mt-1">Click to replace</p>
                </div>
              ) : (
                <>
                  <UploadCloud className="w-6 h-6 text-slate-400 mb-2" />
                  <p className="text-sm text-slate-600">Select a file from your computer</p>
                </>
              )}
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
export function AssignmentModal({ isOpen, onClose, onAdd, moduleId, courseId }) {
  const [data, setData] = useState({ title: "", maxScore: "100", dueDate: "" });
  const addMaterialMutation = useAddMaterialMutation();
  const { toast } = useToast();

  useEffect(() => { if (isOpen) setData({ title: "", maxScore: "100", dueDate: "" }) }, [isOpen]);

  const handleSubmit = () => {
    if (!data.title) return;
    
    const materialPayload = { title: data.title, type: "ASSIGNMENT", contentUrl: "https://example.com/assignment" };
    
    addMaterialMutation.mutate({ moduleId, data: materialPayload, courseId }, {
       onSuccess: (res) => {
         const realId = res?.id || res?.materialId || `item-${Date.now()}`;
         onAdd({ type: "assignment", id: realId, ...data });
         toast({ title: "Success", description: "Assignment added.", variant: "success" });
         onClose();
       },
       onError: () => toast({ title: "Error", description: "Failed to add assignment.", variant: "error" })
    });
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
export function QuizModal({ isOpen, onClose, onAdd, moduleId, courseId }) {
  const [data, setData] = useState({ title: "", timeLimitMins: 30, questions: [] });
  const createProblemSetMutation = useCreateProblemSetMutation();
  const { toast } = useToast();

  useEffect(() => { if (isOpen) setData({ title: "", timeLimitMins: 30, questions: [] }) }, [isOpen]);

  const handleAddQuestion = () => {
    setData(prev => ({
      ...prev,
      questions: [...prev.questions, { content: "", type: "MULTIPLE_CHOICE", correctAns: "", points: 10, options: ["", ""] }]
    }));
  };

  const updateQuestion = (idx, field, value) => {
    const newQs = [...data.questions];
    newQs[idx][field] = value;
    
    if (field === 'type') {
       if (value === 'TRUE_FALSE') {
          newQs[idx].options = ["True", "False"];
          newQs[idx].correctAns = "True";
       } else if (value === 'SHORT_ANSWER') {
          newQs[idx].options = [];
          newQs[idx].correctAns = "";
       } else {
          newQs[idx].options = ["", ""];
          newQs[idx].correctAns = "";
       }
    }
    
    setData({ ...data, questions: newQs });
  };

  const updateOption = (qIdx, optIdx, value) => {
    const newQs = [...data.questions];
    newQs[qIdx].options[optIdx] = value;
    setData({ ...data, questions: newQs });
  };

  const addOption = (qIdx) => {
    const newQs = [...data.questions];
    newQs[qIdx].options.push("");
    setData({ ...data, questions: newQs });
  };

  const handleSubmit = async () => {
    if (!data.title) return;
    
    try {
      const formattedQs = data.questions.map(q => ({
        content: q.content,
        type: q.type,
        correctAns: q.correctAns,
        points: Number(q.points) || 10,
        options: q.options
      }));

      const dt = new Date();
      dt.setDate(dt.getDate() + 7);

      const setPayload = { 
        title: data.title, 
        dueDate: dt.toISOString(), 
        timeLimitMins: Number(data.timeLimitMins) || 30, 
        questions: formattedQs 
      };
      
      const psRes = await createProblemSetMutation.mutateAsync({ moduleId, data: setPayload, courseId });
      const realPsId = psRes?.id || psRes?.problemSetId || `ps-${Date.now()}`;
      
      onAdd({ type: "quiz", id: realPsId, ...data });
      toast({ title: "Success", description: "Problem set created successfully.", variant: "success" });
      onClose();
    } catch (e) {
      toast({ title: "Error", description: "Failed to create problem set.", variant: "error" });
    }
  };

  return (
    <ModalWrapper title="Create Problem Set" isOpen={isOpen} onClose={onClose} onSubmit={handleSubmit} submitText="Create Problem Set">
      <div className="space-y-6 max-h-[70vh] overflow-y-auto pr-2">
        <div className="space-y-2">
          <Label>Problem Set Title <span className="text-red-500">*</span></Label>
          <Input value={data.title} onChange={e => setData({...data, title: e.target.value})} placeholder="e.g. Midterm Assessment" />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Time Limit (minutes)</Label>
            <Input type="number" value={data.timeLimitMins} onChange={e => setData({...data, timeLimitMins: e.target.value})} placeholder="Optional" />
          </div>
          <div className="space-y-2">
            <Label>Passing Score (%)</Label>
            <Input type="number" placeholder="80" disabled />
          </div>
        </div>

        <div className="border border-slate-200 rounded-xl p-4 bg-slate-50 space-y-4">
           <h4 className="font-semibold text-sm text-slate-700">Questions ({data.questions.length})</h4>
           {data.questions.length === 0 && (
             <p className="text-sm text-slate-500 text-center py-4">No questions added yet.</p>
           )}
           {data.questions.map((q, idx) => (
             <div key={idx} className="mb-4 p-4 border border-slate-200 bg-white rounded-lg">
                <div className="flex gap-2 mb-3">
                   <select className="p-2 text-sm border border-slate-300 rounded" value={q.type} onChange={e => updateQuestion(idx, 'type', e.target.value)}>
                      <option value="MULTIPLE_CHOICE">Multiple Choice</option>
                      <option value="TRUE_FALSE">True / False</option>
                      <option value="SHORT_ANSWER">Short Answer</option>
                   </select>
                   <Input type="number" value={q.points} onChange={e => updateQuestion(idx, 'points', e.target.value)} placeholder="Points" className="w-24 text-sm" />
                </div>
                <Input value={q.content} onChange={e => updateQuestion(idx, 'content', e.target.value)} placeholder={`Question text...`} className="mb-3" />
                
                {q.type === 'MULTIPLE_CHOICE' && (
                   <div className="space-y-2 pl-4">
                     {q.options.map((opt, oIdx) => (
                        <div key={oIdx} className="flex items-center gap-2">
                          <input type="radio" name={`q-${idx}-correct`} checked={q.correctAns === opt && opt !== ""} onChange={() => updateQuestion(idx, 'correctAns', opt)} className="mt-1" />
                          <Input value={opt} onChange={e => updateOption(idx, oIdx, e.target.value)} className="h-8 text-sm" placeholder={`Option ${oIdx + 1}`} />
                        </div>
                     ))}
                     <Button type="button" variant="ghost" size="sm" onClick={() => addOption(idx)} className="h-6 text-xs text-blue-600 mt-2">
                       + Add Option
                     </Button>
                   </div>
                )}

                {q.type === 'TRUE_FALSE' && (
                   <div className="space-y-2 pl-4 flex gap-4">
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`q-${idx}-tf`} checked={q.correctAns === 'True'} onChange={() => updateQuestion(idx, 'correctAns', 'True')} /> True
                      </label>
                      <label className="flex items-center gap-2 cursor-pointer">
                        <input type="radio" name={`q-${idx}-tf`} checked={q.correctAns === 'False'} onChange={() => updateQuestion(idx, 'correctAns', 'False')} /> False
                      </label>
                   </div>
                )}

                {q.type === 'SHORT_ANSWER' && (
                   <div className="pl-4">
                      <Label className="text-xs text-slate-500 mb-1 block">Expected correct answer</Label>
                      <Input value={q.correctAns} onChange={e => updateQuestion(idx, 'correctAns', e.target.value)} className="h-8 text-sm" placeholder="Exact string to match" />
                   </div>
                )}
             </div>
           ))}
           <Button type="button" variant="outline" className="w-full text-sm h-9 bg-white border-dashed border-slate-300" onClick={handleAddQuestion}>
             <Plus className="w-4 h-4 mr-2" /> Add Question
           </Button>
        </div>
      </div>
    </ModalWrapper>
  );
}

