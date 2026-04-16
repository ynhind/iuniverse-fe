import React, { useState } from "react";
import { useAnnouncements } from "@/contexts/AnnouncementContext";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/Card";
import { Button } from "@/components/ui/Button";
import { Input } from "@/components/ui/Input";
import { useToast } from "@/contexts/ToastContext";
import { Send, Megaphone, Clock } from "lucide-react";

export function Announcements() {
  const { announcements, addAnnouncement } = useAnnouncements();
  const { toast } = useToast();

  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [audience, setAudience] = useState("All");

  const handlePublish = (e) => {
    e.preventDefault();
    if (!title.trim() || !content.trim()) {
      toast({ title: "Error", description: "Title and content are required.", variant: "error" });
      return;
    }

    addAnnouncement({ title, content, audience, status: "Published" });
    
    setTitle("");
    setContent("");
    setAudience("All");
    
    toast({
      title: "Announcement Published",
      description: `Sent to ${audience.toLowerCase()}.`,
      variant: "success",
    });
  };

  return (
    <div className="space-y-8 animate-in fade-in zoom-in-95 duration-500">
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-slate-900">Announcements</h1>
        <p className="text-slate-500 mt-1">Create and broadcast announcements to users.</p>
      </div>

      <div className="grid md:grid-cols-3 gap-8">
        
        <div className="md:col-span-1">
          <Card className="glass shadow-xl relative top-0 sticky top-24">
            <CardHeader className="bg-gradient-to-r from-primary/10 to-transparent border-b border-primary/10 pb-4">
              <div className="flex items-center gap-2">
                <Megaphone className="h-5 w-5 text-primary" />
                <CardTitle>New Message</CardTitle>
              </div>
            </CardHeader>
            <CardContent className="pt-6">
              <form onSubmit={handlePublish} className="space-y-4">
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Subject</label>
                  <Input 
                    placeholder="E.g., System Maintenance" 
                    value={title} 
                    onChange={(e) => setTitle(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Message Content</label>
                  <textarea
                    className="w-full flex min-h-[140px] rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:border-transparent transition-all"
                    placeholder="Type your announcement here..."
                    value={content}
                    onChange={(e) => setContent(e.target.value)}
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-sm font-medium text-slate-700">Target Audience</label>
                  <select
                    className="w-full flex h-12 rounded-xl border border-slate-200 bg-white px-4 py-3 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary transition-all"
                    value={audience}
                    onChange={(e) => setAudience(e.target.value)}
                  >
                    <option value="All">All Users</option>
                    <option value="Teacher">Teachers Only</option>
                    <option value="Student">Students Only</option>
                  </select>
                </div>
                <Button type="submit" className="w-full h-12 bg-primary text-white gap-2 mt-4">
                  <Send className="w-4 h-4" />
                  Publish Now
                </Button>
              </form>
            </CardContent>
          </Card>
        </div>

        <div className="md:col-span-2 space-y-4">
          <h3 className="font-semibold text-lg text-slate-800 flex items-center gap-2 mb-4">
            <Clock className="w-5 h-5 text-slate-400" />
            Announcement History
          </h3>
          
          {announcements.length === 0 ? (
            <div className="py-12 text-center text-slate-500 glass rounded-2xl">
              <p className="text-sm">No announcements published yet.</p>
            </div>
          ) : (
            announcements.map((a) => (
              <Card key={a.id} className="p-5 glass border-white/50 hover:shadow-md transition-shadow">
                <div className="flex justify-between items-start gap-4 mb-2">
                  <h4 className="font-bold text-slate-900">{a.title}</h4>
                  <span className="px-2.5 py-1 text-xs font-semibold rounded-full bg-slate-100 text-slate-600 border border-slate-200 shrink-0">
                    Target: {a.audience}
                  </span>
                </div>
                <p className="text-sm text-slate-600 whitespace-pre-wrap">{a.content}</p>
                <div className="mt-4 text-xs text-slate-400 flex items-center gap-1">
                  Published {new Date(a.date).toLocaleString()}
                </div>
              </Card>
            ))
          )}
        </div>

      </div>
    </div>
  );
}
