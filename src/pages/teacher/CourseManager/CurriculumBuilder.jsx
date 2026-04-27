import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/Button";
import {
  ChevronDown, ChevronRight, GripVertical, Plus, Trash2,
  Video, FileText, CheckSquare, FileQuestion,
  ArrowUp, ArrowDown, ExternalLink,
} from "lucide-react";
import {
  useCreateModuleMutation, useUpdateModuleMutation,
  useDeleteModuleMutation, useDeleteMaterialMutation,
} from "@/hooks/useTeacher";
import { useToast } from "@/contexts/ToastContext";
import { ViewItemModal } from "@/components/teacher/course-manager/ViewItemModal";

const ITEM_ICON = {
  video:      <Video       className="w-4 h-4 text-blue-500" />,
  resource:   <FileText    className="w-4 h-4 text-emerald-500" />,
  document:   <FileText    className="w-4 h-4 text-emerald-500" />,
  assignment: <CheckSquare className="w-4 h-4 text-purple-500" />,
  quiz:       <FileQuestion className="w-4 h-4 text-rose-500" />,
};

const ITEM_BADGE = {
  video:      "bg-blue-50 text-blue-600",
  resource:   "bg-emerald-50 text-emerald-600",
  document:   "bg-emerald-50 text-emerald-600",
  assignment: "bg-purple-50 text-purple-600",
  quiz:       "bg-rose-50 text-rose-600",
};

export function CurriculumBuilder({ modules, setModules, openModal, courseId }) {
  const navigate  = useNavigate();
  const { toast } = useToast();
  const [expandedModules, setExpandedModules] = useState({});
  const [viewItem, setViewItem]               = useState(null);

  const createModuleMutation   = useCreateModuleMutation();
  const updateModuleMutation   = useUpdateModuleMutation();
  const deleteModuleMutation   = useDeleteModuleMutation();
  const deleteMaterialMutation = useDeleteMaterialMutation();

  const toggleModule = (id) =>
    setExpandedModules((prev) => ({ ...prev, [id]: !prev[id] }));

  const addModule = () => {
    const newModule = { id: `mod-${Date.now()}`, title: "New Module", description: "", items: [] };
    setModules([...modules, newModule]);
    setExpandedModules((prev) => ({ ...prev, [newModule.id]: true }));
    createModuleMutation.mutate({ courseId, data: { title: "New Module" } }, {
      onSuccess: (res) => {
        const realId = res?.id || res?.moduleId || newModule.id;
        setModules((prev) => prev.map((m) => m.id === newModule.id ? { ...m, id: realId } : m));
      },
      onError: (error) => {
        toast({ title: "Error", description: "Failed to create module. " + (error?.response?.data?.message || ""), variant: "error" });
        // Revert optimistic update
        setModules((prev) => prev.filter((m) => m.id !== newModule.id));
      },
    });
  };

  const updateModuleTitle     = (id, title) =>
    setModules(modules.map((mod) => mod.id === id ? { ...mod, title } : mod));

  const handleModuleTitleBlur = (id, title, index) => {
    if (String(id).startsWith("mod-")) return;
    updateModuleMutation.mutate({ moduleId: id, data: { title, orderIndex: index + 1 }, courseId }, {
      onError: () => toast({ title: "Error", description: "Failed to save title.", variant: "error" }),
    });
  };

  const deleteModule = (id) => {
    if (!String(id).startsWith("mod-")) {
      deleteModuleMutation.mutate({ moduleId: id, courseId }, {
        onError: () => toast({ title: "Error", description: "Failed to delete module.", variant: "error" }),
      });
    }
    setModules(modules.filter((mod) => mod.id !== id));
  };

  const moveModule = (index, dir) => {
    const mods = [...modules];
    if (dir === "up"   && index > 0)               [mods[index - 1], mods[index]] = [mods[index], mods[index - 1]];
    if (dir === "down" && index < mods.length - 1)  [mods[index + 1], mods[index]] = [mods[index], mods[index + 1]];
    setModules(mods);
  };

  const moveItem = (modIdx, itemIdx, dir) => {
    const mods  = [...modules];
    const items = [...mods[modIdx].items];
    if (dir === "up"   && itemIdx > 0)                [items[itemIdx - 1], items[itemIdx]] = [items[itemIdx], items[itemIdx - 1]];
    if (dir === "down" && itemIdx < items.length - 1)  [items[itemIdx + 1], items[itemIdx]] = [items[itemIdx], items[itemIdx + 1]];
    mods[modIdx].items = items;
    setModules(mods);
  };

  const deleteItem = (moduleId, itemId) => {
    if (!String(itemId).startsWith("item-") && !String(itemId).startsWith("ps-")) {
      deleteMaterialMutation.mutate({ moduleId, materialId: itemId, courseId }, {
        onError: () => toast({ title: "Error", description: "Failed to delete item.", variant: "error" }),
      });
    }
    setModules(modules.map((mod) =>
      mod.id === moduleId ? { ...mod, items: mod.items.filter((i) => i.id !== itemId) } : mod
    ));
  };

  const handleItemClick = (item, moduleId) => {
    if (item.type === "quiz") {
      const quizId = item.problemSetId || item.id;
      navigate(`/teacher/quiz-detail?courseId=${courseId}&moduleId=${moduleId}&quizId=${quizId}`);
      return;
    }
    if (["video", "resource", "document"].includes(item.type)) {
      setViewItem(item);
      return;
    }
    const url = item.contentUrl || item.fileUrl;
    if (url) window.open(url, "_blank", "noopener,noreferrer");
    else toast({ title: "No content", description: "This item has no URL.", variant: "error" });
  };

  return (
    <>
      {viewItem && <ViewItemModal item={viewItem} onClose={() => setViewItem(null)} />}

      <div className="space-y-6 w-full">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <div>
            <h2 className="text-xl font-semibold mb-0.5">Curriculum Layout</h2>
            <p className="text-sm text-slate-500">Organize your course into modules and lessons.</p>
          </div>
          <Button
            onClick={addModule}
            className="bg-primary text-white hover:bg-primary/90 rounded-xl flex items-center gap-2 self-start sm:self-auto"
          >
            <Plus className="w-4 h-4" /> Add Module
          </Button>
        </div>

        {modules.length === 0 ? (
          <div className="border-2 border-dashed border-slate-200 rounded-2xl p-8 sm:p-12 text-center bg-slate-50">
            <h3 className="text-lg font-medium text-slate-700 mb-2">No modules yet</h3>
            <p className="text-slate-500 mb-6 max-w-md mx-auto text-sm">
              Start building your course structure by adding your first module.
            </p>
            <Button onClick={addModule} variant="outline" className="rounded-xl border-slate-300">
              Create First Module
            </Button>
          </div>
        ) : (
          <div className="space-y-4">
            {modules.map((mod, modIndex) => {
              const isExpanded = expandedModules[mod.id] !== false;
              return (
                <ModuleCard
                  key={mod.id}
                  mod={mod}
                  modIndex={modIndex}
                  totalModules={modules.length}
                  isExpanded={isExpanded}
                  onToggle={() => toggleModule(mod.id)}
                  onTitleChange={(title) => updateModuleTitle(mod.id, title)}
                  onTitleBlur={() => handleModuleTitleBlur(mod.id, mod.title, modIndex)}
                  onMoveUp={() => moveModule(modIndex, "up")}
                  onMoveDown={() => moveModule(modIndex, "down")}
                  onDelete={() => deleteModule(mod.id)}
                  onItemClick={(item) => handleItemClick(item, mod.id)}
                  onMoveItem={(itemIdx, dir) => moveItem(modIndex, itemIdx, dir)}
                  onDeleteItem={(itemId) => deleteItem(mod.id, itemId)}
                  onAddContent={(type) => openModal(type, mod.id)}
                />
              );
            })}
          </div>
        )}
      </div>
    </>
  );
}

function ModuleCard({
  mod, modIndex, totalModules, isExpanded,
  onToggle, onTitleChange, onTitleBlur,
  onMoveUp, onMoveDown, onDelete,
  onItemClick, onMoveItem, onDeleteItem, onAddContent,
}) {
  return (
    <div className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm">
      <div className="flex items-center bg-slate-50/80 p-3 pr-3 border-b border-slate-200 gap-2">
        <button
          onClick={onToggle}
          className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors flex-shrink-0"
        >
          {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
        </button>

        <div className="hidden sm:block font-semibold text-slate-700 text-sm flex-shrink-0">
          Module {modIndex + 1}:
        </div>

        <input
          type="text"
          value={mod.title}
          onChange={(e) => onTitleChange(e.target.value)}
          onBlur={onTitleBlur}
          className="flex-1 min-w-0 bg-transparent border-none outline-none font-medium text-slate-900 focus:ring-0 p-0 text-sm"
          placeholder="Module Title"
        />

        <div className="flex items-center gap-0.5 flex-shrink-0">
          <button onClick={onMoveUp} disabled={modIndex === 0} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded disabled:opacity-30" title="Move up">
            <ArrowUp className="w-3.5 h-3.5" />
          </button>
          <button onClick={onMoveDown} disabled={modIndex === totalModules - 1} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded disabled:opacity-30" title="Move down">
            <ArrowDown className="w-3.5 h-3.5" />
          </button>
          <div className="w-px h-4 bg-slate-300 mx-0.5" />
          <button onClick={onDelete} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded" title="Delete module">
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {isExpanded && (
        <div className="p-3 sm:p-4 bg-white space-y-3">
          {mod.items.length === 0 ? (
            <div className="text-center py-6 text-sm text-slate-400 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
              This module is empty. Add a lesson below.
            </div>
          ) : (
            <div className="space-y-2">
              {mod.items.map((item, itemIndex) => (
                <ModuleItem
                  key={item.id}
                  item={item}
                  itemIndex={itemIndex}
                  totalItems={mod.items.length}
                  onClick={() => onItemClick(item)}
                  onMoveUp={() => onMoveItem(itemIndex, "up")}
                  onMoveDown={() => onMoveItem(itemIndex, "down")}
                  onDelete={() => onDeleteItem(item.id)}
                />
              ))}
            </div>
          )}

          <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100">
            {[
              { type: "video",      label: "Video",      hoverCls: "hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200" },
              { type: "resource",   label: "Resource",   hoverCls: "hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200" },
              { type: "assignment", label: "Assignment", hoverCls: "hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200" },
              { type: "quiz",       label: "Quiz",       hoverCls: "hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200" },
            ].map(({ type, label, hoverCls }) => (
              <Button
                key={type}
                variant="outline"
                size="sm"
                onClick={() => onAddContent(type)}
                className={`h-8 text-xs border-slate-200 text-slate-600 flex-shrink-0 ${hoverCls}`}
              >
                {ITEM_ICON[type] && React.cloneElement(ITEM_ICON[type], { className: "w-3 h-3 mr-1" })}
                {label}
              </Button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

function ModuleItem({ item, itemIndex, totalItems, onClick, onMoveUp, onMoveDown, onDelete }) {
  const icon  = ITEM_ICON[item.type]  || ITEM_ICON.resource;
  const badge = ITEM_BADGE[item.type] || "bg-slate-100 text-slate-600";

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-2 sm:gap-3 p-3 border border-slate-100 rounded-lg group hover:border-primary/30 hover:bg-primary/5 hover:shadow-sm transition-all bg-white cursor-pointer"
    >
      <div className="cursor-grab text-slate-300 hover:text-slate-500 flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <GripVertical className="w-4 h-4" />
      </div>

      <div className="flex items-center justify-center w-8 h-8 rounded-lg bg-slate-100 border border-slate-200/60 flex-shrink-0">
        {icon}
      </div>

      <div className="flex-1 min-w-0">
        <div className="font-medium text-sm text-slate-800 group-hover:text-primary transition-colors truncate flex items-center gap-1.5">
          {item.title}
          <ExternalLink className="w-3 h-3 opacity-0 group-hover:opacity-50 transition-opacity flex-shrink-0" />
        </div>
        <div className="flex items-center gap-1.5 mt-0.5">
          <span className={`text-xs px-1.5 py-0.5 rounded-full font-medium ${badge}`}>{item.type}</span>
          {item.duration && <span className="text-xs text-slate-400">• {item.duration}</span>}
        </div>
      </div>

      <div className="flex items-center gap-0.5 opacity-0 group-hover:opacity-100 transition-opacity flex-shrink-0" onClick={(e) => e.stopPropagation()}>
        <button onClick={onMoveUp}   disabled={itemIndex === 0}           className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30"><ArrowUp   className="w-3 h-3" /></button>
        <button onClick={onMoveDown} disabled={itemIndex === totalItems - 1} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30"><ArrowDown className="w-3 h-3" /></button>
        <button onClick={onDelete}   className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded ml-0.5"><Trash2 className="w-3.5 h-3.5" /></button>
      </div>
    </div>
  );
}
