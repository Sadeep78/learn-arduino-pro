import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Home,
  BookOpen,
  PlaySquare,
  Cpu,
  Trophy,
  X
} from 'lucide-react';
import { useUIStore, NavItem } from '../../store/useUIStore';

export const BottomNav: React.FC = () => {
  const { t } = useTranslation();
  const { activeNav, setActiveNav } = useUIStore();

  const mobileNavItems: { id: NavItem; label: string; icon: React.ElementType }[] = [
    { id: 'home', label: t('nav.home', 'Home'), icon: Home },
    { id: 'lessons', label: t('nav.lessons', 'Lessons'), icon: BookOpen },
    { id: 'simulator', label: t('nav.simulator', 'Simulator'), icon: PlaySquare },
    { id: 'components', label: t('nav.components', 'Components'), icon: Cpu },
    { id: 'challenges', label: t('nav.challenges', 'Challenges'), icon: Trophy }
  ];

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 h-16 bg-blueprint-cream/95 dark:bg-blueprint-nightCard/95 backdrop-blur-md border-t border-blueprint-creamBorder dark:border-blueprint-nightBorder flex items-center justify-around px-2 z-40 select-none">
      {mobileNavItems.map((item) => {
        const Icon = item.icon;
        const isActive = activeNav === item.id;
        return (
          <button
            key={item.id}
            onClick={() => setActiveNav(item.id)}
            className={`flex flex-col items-center justify-center flex-1 py-1 transition-all ${
              isActive ? 'text-blueprint-teal font-bold' : 'text-blueprint-navy/70 dark:text-gray-400'
            }`}
          >
            <Icon className={`w-5 h-5 transition-transform ${isActive ? 'scale-115' : ''}`} />
            <span className="text-[10px] mt-0.5 tracking-tight">{item.label}</span>
          </button>
        );
      })}
    </nav>
  );
};

export const MobileDrawer: React.FC = () => {
  const { t } = useTranslation();
  const { mobileDrawerOpen, setMobileDrawerOpen, activeNav, setActiveNav } = useUIStore();

  if (!mobileDrawerOpen) return null;

  const items: { id: NavItem; label: string }[] = [
    { id: 'home', label: t('nav.home', 'Home') },
    { id: 'lessons', label: t('nav.lessons', 'Lessons') },
    { id: 'simulator', label: t('nav.simulator', 'Simulator') },
    { id: 'components', label: t('nav.components', 'Components') },
    { id: 'challenges', label: t('nav.challenges', 'Challenges') },
    { id: 'projects', label: t('nav.projects', 'Projects') },
    { id: 'community', label: t('nav.community', 'Community') },
    { id: 'videos', label: t('nav.videos', 'Videos') },
    { id: 'settings', label: t('nav.settings', 'Settings') },
  ];

  return (
    <div className="fixed inset-0 z-50 md:hidden bg-black/50 backdrop-blur-sm animate-in fade-in duration-200">
      <div className="w-64 h-full bg-blueprint-cream dark:bg-blueprint-nightCard p-4 border-r border-blueprint-creamBorder dark:border-blueprint-nightBorder flex flex-col justify-between shadow-2xl">
        <div>
          <div className="flex items-center justify-between pb-4 border-b border-blueprint-creamBorder dark:border-blueprint-nightBorder">
            <span className="font-extrabold text-sm text-blueprint-teal font-mono">Menu</span>
            <button
              onClick={() => setMobileDrawerOpen(false)}
              className="p-1.5 rounded-lg text-gray-500 hover:bg-black/5 dark:hover:bg-white/5"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          <div className="mt-4 space-y-1">
            {items.map((it) => (
              <button
                key={it.id}
                onClick={() => {
                  setActiveNav(it.id);
                  setMobileDrawerOpen(false);
                }}
                className={`w-full text-left px-3 py-2.5 rounded-xl text-sm font-medium transition ${
                  activeNav === it.id
                    ? 'bg-blueprint-teal text-white font-bold'
                    : 'text-blueprint-navy dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5'
                }`}
              >
                {it.label}
              </button>
            ))}
          </div>
        </div>

        <div className="text-[11px] font-mono text-gray-400 text-center py-2">
          Learn Arduino Pro v1.0
        </div>
      </div>
    </div>
  );
};
