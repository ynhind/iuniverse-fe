import React, { useMemo, useState } from "react";
import { Send, Megaphone, Clock, Trash2, Globe, GraduationCap, BookOpen, User, Plus, CheckCircle2 } from "lucide-react";
import { useToast } from "@/contexts/ToastContext";
import { useAnnouncementsQuery, useCreateAnnouncementMutation, usePublishAnnouncementMutation, useDeleteAnnouncementMutation } from "@/hooks/useAdmin";


const AUDIENCE_OPTIONS = [
  { value: "ALL",     label: "All Users",      icon: <Globe          className="w-4 h-4" /> },
  { value: "TEACHER", label: "Teachers Only",  icon: <BookOpen       className="w-4 h-4" /> },
  { value: "STUDENT", label: "Students Only",  icon: <GraduationCap  className="w-4 h-4" /> },
];

function AudienceBadge({ audience }) {
  const map = { ALL: "bg-primary/10 text-primary", TEACHER: "bg-emerald-50 text-emerald-700", STUDENT: "bg-blue-50 text-blue-700" };
  const labels = { ALL: "All Users", TEACHER: "Teachers", STUDENT: "Students" };
  return (
    <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${map[audience] || "bg-slate-100 text-slate-600"}`}>
      {labels[audience] || audience}
    </span>
  );
}

function AnnouncementCard({ announcement, onPublish, onDelete, isPublishing, isDeleting }) {
  const isDraft     = announcement.status !== "PUBLISHED" && announcement.status !== "Published";
  const date        = announcement.publishedAt || announcement.createdAt || announcement.date;
  return (
    <div className={`bg-white rounded-2xl border shadow-sm p-5 transition-shadow hover:shadow-md ${isDraft ? "border-slate-200" : "border-emerald-200"}`}>
      <div className="flex items-start justify-between gap-3 mb-2">
        <div className="flex items-center gap-2 min-w-0">
          <div className={`w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0 ${isDraft ? "bg-slate-100 text-slate-500" : "bg-emerald-50 text-emerald-600"}`}>
            <Megaphone className="w-4 h-4" />
          </div>
          <h4 className="font-semibold text-slate-800 truncate">{announcement.title}</h4>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <AudienceBadge audience={announcement.audience || announcement.targetAudience} />
          <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${isDraft ? "bg-slate-100 text-slate-500" : "bg-emerald-100 text-emerald-700"}`}>
            {isDraft ? "Draft" : "Published"}
          </span>
        </div>
      </div>

      <p className="text-sm text-slate-600 line-clamp-3 mb-4">{announcement.content}</p>

      {date && (
        <div className="flex items-center gap-1 text-xs text-slate-400 mb-4">
          <Clock className="w-3.5 h-3.5" />
          {isDraft ? "Created" : "Published"} {new Date(date).toLocaleString()}
        </div>
      )}

      <div className="flex items-center justify-end gap-2 pt-3 border-t border-slate-100">
        {isDraft && (
          <button
            onClick={() => onPublish(announcement.id)}
            disabled={isPublishing}
            className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-primary text-white text-xs hover:bg-primary/90 disabled:opacity-50"
          >
            {isPublishing ? <span className="w-3.5 h-3.5 border-2 border-white/30 border-t-white rounded-full animate-spin" /> : <Send className="w-3.5 h-3.5" />}
            Publish
          </button>
        )}
        <button
          onClick={() => onDelete(announcement.id)}
          disabled={isDeleting}
          className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-red-200 text-red-600 bg-red-50 text-xs hover:bg-red-100 disabled:opacity-50"
        >
          <Trash2 className="w-3.5 h-3.5" /> Delete
        </button>
      </div>
    </div>
  );
}

export function Announcements() {
  const { toast } = useToast();

  const [title,    setTitle]    = useState("");
  const [content,  setContent]  = useState("");
  const [audience, setAudience] = useState("ALL");

  const { data, isLoading }    = useAnnouncementsQuery();
  const createMutation         = useCreateAnnouncementMutation();
  const publishMutation        = usePublishAnnouncementMutation();
  const deleteMutation         = useDeleteAnnouncementMutation();

  const announcements = useMemo(() => {
    const list = Array.isArray(data) ? data : Array.isArray(data?.data) ? data.data : Array.isArray(data?.content) ? data.content : [];
    return [...list].sort((a, b) => new Date(b.createdAt || b.date || 0) - new Date(a.createdAt || a.date || 0));
  }, [data]);

  const handleCreate = async (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: "Missing fields", description: "Title and content are required.", variant: "error" });
      return;
    }
    try {
      await createMutation.mutateAsync({ title: title.trim(), content: content.trim(), audience, status: "DRAFT" });
      toast({ title: "Created", description: "Announcement saved as draft.", variant: "success" });
      setTitle(""); setContent(""); setAudience("ALL");
    } catch (err) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to create.", variant: "error" });
    }
  };

  const handlePublish = async (id) => {
    try {
      await publishMutation.mutateAsync(id);
      toast({ title: "Published", description: "Announcement is now live.", variant: "success" });
    } catch (err) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to publish.", variant: "error" });
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this announcement?")) return;
    try {
      await deleteMutation.mutateAsync(id);
      toast({ title: "Deleted", description: "Announcement removed.", variant: "success" });
    } catch (err) {
      toast({ title: "Error", description: err?.response?.data?.message || "Failed to delete.", variant: "error" });
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Announcements</h1>
        <p className="text-slate-500 mt-1">Create and broadcast announcements to target users.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        {/* Compose form */}
        <div className="md:col-span-1">
          <div className="bg-white rounded-2xl border border-slate-200 shadow-sm sticky top-24">
            <div className="px-5 py-4 border-b border-slate-100 flex items-center gap-2">
              <Megaphone className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-slate-800">New Announcement</h3>
            </div>
            <form onSubmit={handleCreate} className="p-5 space-y-4">
              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Subject</label>
                <input className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary/30" value={title} onChange={(e) => setTitle(e.target.value)} placeholder="E.g., System Maintenance" />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-1">Message</label>
                <textarea className="w-full border border-slate-300 rounded-xl px-3 py-2 text-sm min-h-[120px] resize-none focus:outline-none focus:ring-2 focus:ring-primary/30" value={content} onChange={(e) => setContent(e.target.value)} placeholder="Type your announcement here..." />
              </div>

              <div>
                <label className="block text-sm font-medium text-slate-700 mb-2">Target Audience</label>
                <div className="space-y-2">
                  {AUDIENCE_OPTIONS.map(({ value, label, icon }) => (
                    <label key={value} className={`flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors ${audience === value ? "border-primary bg-primary/5" : "border-slate-200 hover:bg-slate-50"}`}>
                      <input type="radio" name="audience" value={value} checked={audience === value} onChange={() => setAudience(value)} className="sr-only" />
                      <span className={`${audience === value ? "text-primary" : "text-slate-400"}`}>{icon}</span>
                      <span className={`text-sm font-medium ${audience === value ? "text-primary" : "text-slate-700"}`}>{label}</span>
                      {audience === value && <CheckCircle2 className="w-4 h-4 text-primary ml-auto" />}
                    </label>
                  ))}
                </div>
              </div>

              <button
                type="submit"
                disabled={createMutation.isPending}
                className="w-full py-2.5 rounded-xl bg-primary text-white text-sm font-medium hover:bg-primary/90 flex items-center justify-center gap-2 disabled:opacity-60"
              >
                {createMutation.isPending
                  ? <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  : <Plus className="w-4 h-4" />}
                Create Announcement
              </button>
            </form>
          </div>
        </div>

        {/* Announcement list */}
        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2">
            <Clock className="w-5 h-5 text-slate-400" />
            Announcement History
            {announcements.length > 0 && <span className="text-sm font-normal text-slate-400">({announcements.length})</span>}
          </h3>

          {isLoading ? (
            <div className="flex items-center justify-center py-16 text-slate-500 gap-2">
              <div className="w-5 h-5 border-2 border-primary border-t-transparent rounded-full animate-spin" /> Loading…
            </div>
          ) : announcements.length === 0 ? (
            <div className="py-16 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
              <Megaphone className="w-10 h-10 text-slate-300 mx-auto mb-3" />
              <p className="text-sm">No announcements yet. Create your first one.</p>
            </div>
          ) : (
            announcements.map((a) => (
              <AnnouncementCard
                key={a.id}
                announcement={a}
                onPublish={handlePublish}
                onDelete={handleDelete}
                isPublishing={publishMutation.isPending}
                isDeleting={deleteMutation.isPending}
              />
            ))
          )}
        </div>
      </div>
    </div>
  );
}
