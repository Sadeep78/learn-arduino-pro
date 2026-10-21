import React, { useState, useRef } from 'react';
import {
  FolderGit2,
  Plus,
  Upload,
  Download,
  Copy,
  Trash2,
  Play,
  FileCode,
  Tag
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useUIStore } from '../store/useUIStore';

export const ProjectsView: React.FC = () => {
  const { projects, deleteProject, duplicateProject, exportProjectJSON, importProjectJSON } =
    useProjectStore();
  const { loadCircuit } = useSimulatorStore();
  const { setActiveNav } = useUIStore();

  const fileInputRef = useRef<HTMLInputElement>(null);
  const [importStatus, setImportStatus] = useState<string | null>(null);

  const handleOpenProject = (proj: any) => {
    loadCircuit(proj.circuit, proj.code);
    setActiveNav('simulator');
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (event) => {
      const content = event.target?.result as string;
      const ok = importProjectJSON(content);
      if (ok) {
        setImportStatus('Project imported successfully!');
      } else {
        setImportStatus('Failed to import JSON project.');
      }
      setTimeout(() => setImportStatus(null), 3500);
    };
    reader.readAsText(file);
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <FolderGit2 className="w-5 h-5 text-blueprint-teal" />
            <h2 className="text-xl font-black text-blueprint-navy dark:text-white">
              MY PROJECTS
            </h2>
          </div>
          <p className="text-xs text-blueprint-navyMuted dark:text-gray-300 mt-1">
            Manage your saved circuits, sketches, and import/export projects as JSON.
          </p>
        </div>

        {/* Action Buttons: Import & New */}
        <div className="flex items-center gap-2">
          <input
            type="file"
            ref={fileInputRef}
            onChange={handleFileUpload}
            accept=".json"
            className="hidden"
          />
          <button
            onClick={() => fileInputRef.current?.click()}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-blueprint-creamDark dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono font-bold text-blueprint-navy dark:text-gray-200 hover:border-blueprint-teal transition"
          >
            <Upload className="w-4 h-4 text-blueprint-teal" />
            <span>Import JSON</span>
          </button>

          <button
            onClick={() => setActiveNav('simulator')}
            className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold shadow-md shadow-blueprint-teal/20 transition"
          >
            <Plus className="w-4 h-4" />
            <span>New Canvas</span>
          </button>
        </div>
      </div>

      {importStatus && (
        <div className="p-3 rounded-xl bg-blueprint-tealLight dark:bg-blueprint-teal/20 text-blueprint-teal text-xs font-mono font-bold border border-blueprint-teal/40">
          {importStatus}
        </div>
      )}

      {/* Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {projects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm flex flex-col justify-between hover:border-blueprint-teal transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-gray-400">
                  Updated: {proj.updatedAt}
                </span>
                <div className="flex items-center gap-1">
                  {proj.tags.map((t, idx) => (
                    <span
                      key={idx}
                      className="text-[9px] font-mono px-2 py-0.5 rounded bg-blueprint-creamDark dark:bg-blueprint-nightBg text-blueprint-navyMuted dark:text-gray-300"
                    >
                      {t}
                    </span>
                  ))}
                </div>
              </div>

              <h3 className="text-base font-bold text-blueprint-navy dark:text-white group-hover:text-blueprint-teal transition-colors">
                {proj.title}
              </h3>
              <p className="text-xs text-blueprint-navyMuted dark:text-gray-400 mt-1 line-clamp-2 leading-relaxed">
                {proj.description}
              </p>
            </div>

            {/* Bottom Actions */}
            <div className="mt-5 pt-3 border-t border-blueprint-creamBorder/70 dark:border-blueprint-nightBorder/70 flex items-center justify-between">
              <div className="flex items-center gap-1">
                <button
                  onClick={() => exportProjectJSON(proj.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blueprint-teal hover:bg-black/5 dark:hover:bg-white/5 transition"
                  title="Export JSON"
                >
                  <Download className="w-4 h-4" />
                </button>

                <button
                  onClick={() => duplicateProject(proj.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blueprint-teal hover:bg-black/5 dark:hover:bg-white/5 transition"
                  title="Duplicate Project"
                >
                  <Copy className="w-4 h-4" />
                </button>

                <button
                  onClick={() => deleteProject(proj.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-red-500 hover:bg-black/5 dark:hover:bg-white/5 transition"
                  title="Delete Project"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleOpenProject(proj)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold shadow-sm transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Open Sim</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
