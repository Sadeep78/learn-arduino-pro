import React from 'react';
import {
  Users,
  Heart,
  GitFork,
  Download,
  Play,
  Sparkles,
  Search
} from 'lucide-react';
import { useProjectStore } from '../store/useProjectStore';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useUIStore } from '../store/useUIStore';

export const CommunityView: React.FC = () => {
  const { communityProjects, likeCommunityProject, exportProjectJSON } = useProjectStore();
  const { loadCircuit } = useSimulatorStore();
  const { setActiveNav } = useUIStore();

  const handleRemix = (proj: any) => {
    loadCircuit(proj.circuit, proj.code);
    setActiveNav('simulator');
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint flex items-center justify-between">
        <div>
          <div className="flex items-center gap-2">
            <Users className="w-5 h-5 text-blueprint-teal" />
            <h2 className="text-xl font-black text-blueprint-navy dark:text-white">
              COMMUNITY GALLERY
            </h2>
          </div>
          <p className="text-xs text-blueprint-navyMuted dark:text-gray-300 mt-1">
            Explore curated circuits and sketches created by makers worldwide. Click "Remix" to clone any project directly into your simulator canvas.
          </p>
        </div>
      </div>

      {/* Community Projects Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {communityProjects.map((proj) => (
          <div
            key={proj.id}
            className="p-5 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm flex flex-col justify-between hover:border-blueprint-teal transition-all group"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-[10px] font-mono text-gray-400">
                  By {proj.author}
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
              <p className="text-xs text-blueprint-navyMuted dark:text-gray-400 mt-1 leading-relaxed">
                {proj.description}
              </p>
            </div>

            {/* Bottom Actions: Likes, Export, Remix */}
            <div className="mt-5 pt-3 border-t border-blueprint-creamBorder/70 dark:border-blueprint-nightBorder/70 flex items-center justify-between">
              <div className="flex items-center gap-2">
                <button
                  onClick={() => likeCommunityProject(proj.id)}
                  className="flex items-center gap-1 text-xs font-mono text-gray-500 hover:text-red-500 transition"
                  title="Like project"
                >
                  <Heart className="w-4 h-4 fill-current text-red-500" />
                  <span>{proj.likes}</span>
                </button>

                <button
                  onClick={() => exportProjectJSON(proj.id)}
                  className="p-1.5 rounded-lg text-gray-400 hover:text-blueprint-teal hover:bg-black/5 dark:hover:bg-white/5 transition"
                  title="Download JSON"
                >
                  <Download className="w-4 h-4" />
                </button>
              </div>

              <button
                onClick={() => handleRemix(proj)}
                className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold shadow-sm transition"
              >
                <GitFork className="w-3.5 h-3.5" />
                <span>Remix</span>
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
