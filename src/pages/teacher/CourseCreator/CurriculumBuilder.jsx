import React, { useState } from "react";
import { Button } from "@/components/ui/Button";
import { ChevronDown, ChevronRight, GripVertical, Plus, Trash2, Video, FileText, CheckSquare, FileQuestion, ArrowUp, ArrowDown } from "lucide-react";

export function CurriculumBuilder({ modules, setModules, openModal }) {
  const [expandedModules, setExpandedModules] = useState({});

  const toggleModule = (id) => {
    setExpandedModules(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const addModule = () => {
    const newModule = {
      id: `mod-${Date.now()}`,
      title: "New Module",
      description: "",
      items: []
    };
    setModules([...modules, newModule]);
    setExpandedModules(prev => ({ ...prev, [newModule.id]: true }));
  };

  const updateModuleTitle = (id, title) => {
    setModules(modules.map(mod => mod.id === id ? { ...mod, title } : mod));
  };

  const deleteModule = (id) => {
    setModules(modules.filter(mod => mod.id !== id));
  };

  const moveModule = (index, direction) => {
    const newModules = [...modules];
    if (direction === 'up' && index > 0) {
      [newModules[index - 1], newModules[index]] = [newModules[index], newModules[index - 1]];
    } else if (direction === 'down' && index < newModules.length - 1) {
      [newModules[index + 1], newModules[index]] = [newModules[index], newModules[index + 1]];
    }
    setModules(newModules);
  };

  const moveItem = (moduleIndex, itemIndex, direction) => {
    const newModules = [...modules];
    const items = [...newModules[moduleIndex].items];
    if (direction === 'up' && itemIndex > 0) {
      [items[itemIndex - 1], items[itemIndex]] = [items[itemIndex], items[itemIndex - 1]];
    } else if (direction === 'down' && itemIndex < items.length - 1) {
      [items[itemIndex + 1], items[itemIndex]] = [items[itemIndex], items[itemIndex + 1]];
    }
    newModules[moduleIndex].items = items;
    setModules(newModules);
  };

  const deleteItem = (moduleId, itemId) => {
    setModules(modules.map(mod => {
      if (mod.id === moduleId) {
        return { ...mod, items: mod.items.filter(item => item.id !== itemId) };
      }
      return mod;
    }));
  };

  const getItemIcon = (type) => {
    switch (type) {
      case 'video': return <Video className="w-4 h-4 text-blue-500" />;
      case 'resource': return <FileText className="w-4 h-4 text-emerald-500" />;
      case 'assignment': return <CheckSquare className="w-4 h-4 text-purple-500" />;
      case 'quiz': return <FileQuestion className="w-4 h-4 text-rose-500" />;
      default: return <FileText className="w-4 h-4 text-slate-500" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-300 max-w-4xl">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-xl font-semibold mb-1">Curriculum Layout</h2>
          <p className="text-sm text-slate-500">Organize your course into modules and lessons.</p>
        </div>
        <Button onClick={addModule} className="bg-primary text-white hover:bg-primary/90 rounded-xl flex items-center gap-2">
          <Plus className="w-4 h-4" /> Add Module
        </Button>
      </div>

      {modules.length === 0 ? (
        <div className="border-2 border-dashed border-slate-200 rounded-2xl p-12 text-center bg-slate-50">
          <h3 className="text-lg font-medium text-slate-700 mb-2">No modules yet</h3>
          <p className="text-slate-500 mb-6 max-w-md mx-auto">Start building your course structure by adding your first module.</p>
          <Button onClick={addModule} variant="outline" className="rounded-xl border-slate-300">
            Create First Module
          </Button>
        </div>
      ) : (
        <div className="space-y-4">
          {modules.map((mod, modIndex) => {
            const isExpanded = expandedModules[mod.id] !== false; 
            return (
              <div key={mod.id} className="border border-slate-200 rounded-xl overflow-hidden bg-white shadow-sm transition-all">
                <div className="flex items-center bg-slate-50/80 p-3 pr-4 border-b border-slate-200 group">
                  <div className="flex items-center gap-2 flex-1">
                    <button onClick={() => toggleModule(mod.id)} className="p-1 hover:bg-slate-200 rounded text-slate-500 transition-colors">
                      {isExpanded ? <ChevronDown className="w-5 h-5" /> : <ChevronRight className="w-5 h-5" />}
                    </button>
                    <div className="font-semibold text-slate-700 text-sm w-16">Module {modIndex + 1}:</div>
                    <input 
                      type="text" 
                      value={mod.title}
                      onChange={(e) => updateModuleTitle(mod.id, e.target.value)}
                      className="flex-1 bg-transparent border-none outline-none font-medium text-slate-900 focus:ring-0 p-0 text-sm"
                      placeholder="Module Title"
                    />
                  </div>
                  
                  <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <button onClick={() => moveModule(modIndex, 'up')} disabled={modIndex === 0} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded disabled:opacity-30">
                      <ArrowUp className="w-4 h-4" />
                    </button>
                    <button onClick={() => moveModule(modIndex, 'down')} disabled={modIndex === modules.length - 1} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-200 rounded disabled:opacity-30">
                      <ArrowDown className="w-4 h-4" />
                    </button>
                    <div className="w-px h-4 bg-slate-300 mx-1"></div>
                    <button onClick={() => deleteModule(mod.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {isExpanded && (
                  <div className="p-4 bg-white space-y-3">
                    {mod.items.length === 0 ? (
                      <div className="text-center py-6 text-sm text-slate-500 border border-dashed border-slate-200 rounded-lg bg-slate-50/50">
                        This module is empty. Add a lesson below.
                      </div>
                    ) : (
                      <div className="space-y-2">
                        {mod.items.map((item, itemIndex) => (
                          <div key={item.id} className="flex items-center gap-3 p-3 border border-slate-100 rounded-lg group hover:border-slate-200 hover:shadow-sm transition-all bg-white">
                            <div className="cursor-grab text-slate-300 hover:text-slate-500">
                              <GripVertical className="w-4 h-4" />
                            </div>
                            <div className="flex items-center justify-center w-8 h-8 rounded bg-slate-100 border border-slate-200/60">
                              {getItemIcon(item.type)}
                            </div>
                            <div className="flex-1">
                              <div className="font-medium text-sm text-slate-800">{item.title}</div>
                              <div className="text-xs text-slate-500 capitalize flex items-center gap-2">
                                {item.type} {item.duration && <span>• {item.duration}</span>}
                              </div>
                            </div>
                            <div className="flex items-center opacity-0 group-hover:opacity-100 transition-opacity">
                              <button onClick={() => moveItem(modIndex, itemIndex, 'up')} disabled={itemIndex === 0} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30">
                                <ArrowUp className="w-3 h-3" />
                              </button>
                              <button onClick={() => moveItem(modIndex, itemIndex, 'down')} disabled={itemIndex === mod.items.length - 1} className="p-1.5 text-slate-400 hover:text-slate-700 hover:bg-slate-100 rounded disabled:opacity-30">
                                <ArrowDown className="w-3 h-3" />
                              </button>
                              <button onClick={() => deleteItem(mod.id, item.id)} className="p-1.5 text-slate-400 hover:text-red-500 hover:bg-red-50 rounded ml-1">
                                <Trash2 className="w-4 h-4" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    )}
                    
                    <div className="flex items-center gap-2 pt-2">
                      <Button variant="outline" size="sm" onClick={() => openModal('video', mod.id)} className="h-8 text-xs border-slate-200 text-slate-600 hover:bg-blue-50 hover:text-blue-600 hover:border-blue-200">
                        <Video className="w-3 h-3 mr-1.5" /> Video
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openModal('resource', mod.id)} className="h-8 text-xs border-slate-200 text-slate-600 hover:bg-emerald-50 hover:text-emerald-600 hover:border-emerald-200">
                        <FileText className="w-3 h-3 mr-1.5" /> Resource
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openModal('assignment', mod.id)} className="h-8 text-xs border-slate-200 text-slate-600 hover:bg-purple-50 hover:text-purple-600 hover:border-purple-200">
                        <CheckSquare className="w-3 h-3 mr-1.5" /> Assignment
                      </Button>
                      <Button variant="outline" size="sm" onClick={() => openModal('quiz', mod.id)} className="h-8 text-xs border-slate-200 text-slate-600 hover:bg-rose-50 hover:text-rose-600 hover:border-rose-200">
                        <FileQuestion className="w-3 h-3 mr-1.5" /> Quiz
                      </Button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
