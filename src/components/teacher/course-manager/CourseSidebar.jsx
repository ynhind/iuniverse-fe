import React from "react";
import { CheckCircle2 } from "lucide-react";

export function CourseSidebar({ modules, totalItems, totalQuizzes }) {
  return (
    <aside className="w-80 bg-white border-l border-slate-200 flex-none hidden lg:flex flex-col z-0">
      <div className="p-6 overflow-y-auto">
        <h3 className="font-semibold text-slate-800 mb-4 px-1">Course Summary</h3>

        <div className="grid grid-cols-3 gap-3 mb-8">
          {[
            { label: "Modules", value: modules.length, color: "text-primary" },
            { label: "Lessons", value: totalItems,     color: "text-secondary" },
            { label: "Quizzes", value: totalQuizzes,   color: "text-rose-600" },
          ].map(({ label, value, color }) => (
            <div key={label} className="bg-slate-50 border border-slate-100 rounded-xl p-4 text-center">
              <span className={`block text-2xl font-bold ${color}`}>{value}</span>
              <span className="text-xs font-medium text-slate-500 uppercase tracking-wider">{label}</span>
            </div>
          ))}
        </div>

        <h3 className="font-semibold text-slate-800 mb-4 px-1">Readiness Checklist</h3>
        <ul className="space-y-3 px-1">
          <CheckItem done label="Basic Info Complete" />
          <CheckItem
            done={totalItems > 0}
            label="Curriculum Added"
            sub="At least 1 lesson created"
          />
          <CheckItem
            done={totalQuizzes > 0}
            label="Module Quiz Ready"
            sub="Loaded from the first module"
          />
        </ul>
      </div>
    </aside>
  );
}

function CheckItem({ done, label, sub }) {
  return (
    <li className="flex items-start gap-3">
      <CheckCircle2
        className={`w-5 h-5 flex-shrink-0 mt-0.5 ${done ? "text-emerald-500" : "text-slate-300"}`}
      />
      <div>
        <span className={`text-sm font-medium ${done ? "text-slate-700" : "text-slate-500"}`}>
          {label}
        </span>
        {sub && <p className="text-xs text-slate-400 mt-0.5">{sub}</p>}
      </div>
    </li>
  );
}
