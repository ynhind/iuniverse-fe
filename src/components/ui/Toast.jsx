import React from "react";
import { useToast } from "@/contexts/ToastContext";
import { X, CheckCircle, AlertCircle, Info } from "lucide-react";

export function Toaster() {
  const { toasts, removeToast } = useToast();

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-3 w-full max-w-sm pointer-events-none">
      {toasts.map((toast) => (
        <ToastItem key={toast.id} toast={toast} onRemove={() => removeToast(toast.id)} />
      ))}
    </div>
  );
}

function ToastItem({ toast, onRemove }) {
  const { title, description, variant } = toast;

  const variants = {
    default: "bg-white border-slate-200 text-slate-800",
    success: "bg-emerald-50 border-emerald-200 text-emerald-800",
    error: "bg-red-50 border-red-200 text-red-800",
  };

  const icons = {
    default: <Info className="h-5 w-5 text-blue-500" />,
    success: <CheckCircle className="h-5 w-5 text-emerald-500" />,
    error: <AlertCircle className="h-5 w-5 text-red-500" />,
  };

  return (
    <div
      className={`pointer-events-auto flex items-start gap-4 p-4 rounded-2xl border shadow-lg shadow-slate-200/50 animate-in slide-in-from-right-full fade-in duration-300 ${
        variants[variant] || variants.default
      }`}
    >
      <div className="flex-shrink-0 mt-0.5">{icons[variant] || icons.default}</div>
      <div className="flex-1 space-y-1">
        {title && <h3 className="font-semibold text-sm">{title}</h3>}
        {description && <p className="text-sm opacity-90">{description}</p>}
      </div>
      <button
        onClick={onRemove}
        className="flex-shrink-0 rounded-lg p-1 opacity-50 hover:opacity-100 hover:bg-black/5 transition-all"
      >
        <X className="h-4 w-4" />
        <span className="sr-only">Close</span>
      </button>
    </div>
  );
}
