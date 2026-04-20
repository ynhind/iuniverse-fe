import React from "react";
import { Video, FileText, X, Play, ExternalLink } from "lucide-react";

function getYoutubeEmbedUrl(url) {
  if (!url) return null;
  try {
    const u = new URL(url);
    const v =
      u.searchParams.get("v") ||
      (u.hostname === "youtu.be" ? u.pathname.slice(1) : null);
    return v ? `https://www.youtube.com/embed/${v}` : null;
  } catch {
    return null;
  }
}

export function ViewItemModal({ item, onClose }) {
  if (!item) return null;

  const embedUrl = item.type === "video" ? getYoutubeEmbedUrl(item.contentUrl) : null;

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex items-center justify-center p-4">
      <div className="bg-white w-full max-w-3xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-5 py-4 border-b border-slate-200">
          <div className="flex items-center gap-3">
            {item.type === "video"
              ? <Video    className="w-5 h-5 text-blue-500" />
              : <FileText className="w-5 h-5 text-emerald-500" />}
            <span className="font-semibold text-slate-800 truncate max-w-xs">{item.title}</span>
          </div>
          <button onClick={onClose} className="p-2 rounded-full hover:bg-slate-100 text-slate-500">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex-1 overflow-auto p-5">
          {item.type === "video" && embedUrl ? (
            <div className="relative w-full" style={{ paddingBottom: "56.25%" }}>
              <iframe
                className="absolute inset-0 w-full h-full rounded-xl"
                src={embedUrl}
                title={item.title}
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          ) : item.type === "video" && item.contentUrl ? (
            <div className="text-center py-10 space-y-4">
              <Play className="w-12 h-12 text-blue-400 mx-auto" />
              <p className="text-slate-600">Cannot embed this video directly.</p>
              <a
                href={item.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-blue-600 text-white hover:bg-blue-700 text-sm"
              >
                <ExternalLink className="w-4 h-4" /> Open Video
              </a>
            </div>
          ) : item.contentUrl ? (
            <div className="text-center py-10 space-y-4">
              <FileText className="w-12 h-12 text-emerald-400 mx-auto" />
              <p className="text-slate-600 text-sm">{item.description || "Document resource"}</p>
              <a
                href={item.contentUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-5 py-2 rounded-xl bg-emerald-600 text-white hover:bg-emerald-700 text-sm"
              >
                <ExternalLink className="w-4 h-4" /> Open Document
              </a>
            </div>
          ) : (
            <div className="text-center py-10 text-slate-500">No content URL available.</div>
          )}
        </div>
      </div>
    </div>
  );
}
