import React from "react";
import { CheckCircle2, Circle } from "lucide-react";

export function QuizQuestionList({ questions, onEditClick }) {
  if (questions.length === 0) {
    return (
      <div className="p-10 text-center text-slate-400 text-sm">
        No questions yet.{" "}
        <button onClick={onEditClick} className="text-primary hover:underline">
          Add some →
        </button>
      </div>
    );
  }

  return (
    <div className="divide-y divide-slate-100">
      {questions.map((question, idx) => (
        <div key={question.id || idx} className="p-4 sm:p-6">
          <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3 mb-4">
            <div className="flex gap-3 flex-1 min-w-0">
              <div className="w-8 h-8 rounded-lg bg-primary/10 text-primary flex items-center justify-center font-bold text-sm flex-shrink-0">
                {idx + 1}
              </div>
              <p className="text-slate-800 text-sm sm:text-base font-medium leading-relaxed">
                {question.content}
              </p>
            </div>
            <div className="flex items-center gap-2 flex-shrink-0">
              <span className="text-xs px-2 py-1 rounded-full bg-slate-100 text-slate-600">
                {question.type?.replace("_", " ")}
              </span>
              <span className="text-xs px-2 py-1 rounded-full bg-emerald-50 text-emerald-700 font-medium">
                {question.points} pts
              </span>
            </div>
          </div>

          {Array.isArray(question.options) && question.options.length > 0 ? (
            <div className="ml-0 sm:ml-11 space-y-2">
              {question.options.map((option, oIdx) => {
                const isCorrect = option === question.correctAns;
                return (
                  <div
                    key={oIdx}
                    className={`flex items-center gap-3 px-4 py-2.5 rounded-xl border text-sm ${
                      isCorrect
                        ? "border-emerald-300 bg-emerald-50 text-emerald-800"
                        : "border-slate-200 text-slate-700"
                    }`}
                  >
                    {isCorrect
                      ? <CheckCircle2 className="w-4 h-4 text-emerald-600 flex-shrink-0" />
                      : <Circle       className="w-4 h-4 text-slate-300 flex-shrink-0" />}
                    <span className="flex-1">{option}</span>
                    {isCorrect && <span className="text-xs font-bold text-emerald-600">✓ Correct</span>}
                  </div>
                );
              })}
            </div>
          ) : (
            <div className="ml-0 sm:ml-11 px-4 py-2.5 rounded-xl border border-emerald-300 bg-emerald-50 text-sm text-emerald-800">
              <span className="font-medium">Answer: </span>
              {question.correctAns || "—"}
            </div>
          )}
        </div>
      ))}
    </div>
  );
}
