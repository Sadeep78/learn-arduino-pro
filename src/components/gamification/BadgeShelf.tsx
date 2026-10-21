import React from 'react';
import {
  Zap,
  Square,
  Sliders,
  Volume2,
  Eye,
  RotateCw,
  Radio,
  Award,
  Lock,
  CheckCircle2
} from 'lucide-react';
import { ALL_BADGES, useProgressStore } from '../../store/useProgressStore';

export const BadgeShelf: React.FC = () => {
  const { unlockedBadges } = useProgressStore();

  const iconMap: Record<string, React.ElementType> = {
    Zap,
    Square,
    Sliders,
    Volume2,
    Eye,
    RotateCw,
    Radio,
    Award
  };

  return (
    <div className="p-5 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint select-none">
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <Award className="w-5 h-5 text-blueprint-teal" />
          <h3 className="text-sm font-extrabold font-mono text-blueprint-navy dark:text-white uppercase tracking-wider">
            ACHIEVEMENT BADGES ({unlockedBadges.length}/{ALL_BADGES.length})
          </h3>
        </div>
        <span className="text-xs font-mono text-gray-500">
          Earn XP & Badges by completing lessons
        </span>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
        {ALL_BADGES.map((badge) => {
          const isUnlocked = unlockedBadges.includes(badge.id);
          const Icon = iconMap[badge.icon] || Award;

          return (
            <div
              key={badge.id}
              className={`p-3.5 rounded-xl border transition-all duration-300 flex flex-col items-center text-center ${
                isUnlocked
                  ? 'bg-gradient-to-b from-blueprint-tealLight/60 to-white dark:from-blueprint-teal/15 dark:to-blueprint-nightBg border-blueprint-teal/40 shadow-sm'
                  : 'bg-gray-50/60 dark:bg-gray-900/40 border-gray-200 dark:border-gray-800 opacity-60'
              }`}
            >
              <div
                className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-2.5 shadow-sm transition-transform ${
                  isUnlocked
                    ? 'bg-blueprint-teal text-white shadow-teal-glow scale-105'
                    : 'bg-gray-200 dark:bg-gray-800 text-gray-400'
                }`}
              >
                {isUnlocked ? <Icon className="w-6 h-6" /> : <Lock className="w-5 h-5" />}
              </div>

              <h4 className="text-xs font-bold font-mono text-blueprint-navy dark:text-white line-clamp-1">
                {badge.title}
              </h4>
              <p className="text-[10px] text-gray-500 dark:text-gray-400 mt-1 line-clamp-2 leading-tight font-sans">
                {badge.description}
              </p>

              {isUnlocked && (
                <div className="mt-2 flex items-center gap-1 text-[9px] font-mono text-emerald-600 dark:text-emerald-400 font-bold">
                  <CheckCircle2 className="w-3 h-3" />
                  <span>UNLOCKED</span>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
