import React from 'react';
import { useTranslation } from 'react-i18next';
import {
  Home,
  BookOpen,
  Cpu,
  PlaySquare,
  FolderGit2,
  Users,
  Settings,
  ChevronLeft,
  ChevronRight,
  Trophy,
  Video
} from 'lucide-react';
import { useUIStore, NavItem } from '../../store/useUIStore';

export const Sidebar: React.FC = () => {
  const { t } = useTranslation();
  const { activeNav, setActiveNav, sidebarCollapsed, toggleSidebar } = useUIStore();

  const navItems: { id: NavItem; labelKey: string; defaultLabel: string; icon: React.ElementType }[] = [
    { id: 'home', labelKey: 'nav.home', defaultLabel: 'Home', icon: Home },
    { id: 'lessons', labelKey: 'nav.lessons', defaultLabel: 'Lessons', icon: BookOpen },
    { id: 'simulator', labelKey: 'nav.simulator', defaultLabel: 'Simulator', icon: PlaySquare },
    { id: 'components', labelKey: 'nav.components', defaultLabel: 'Components', icon: Cpu },
    { id: 'challenges', labelKey: 'nav.challenges', defaultLabel: 'Challenges', icon: Trophy },
    { id: 'projects', labelKey: 'nav.projects', defaultLabel: 'Projects', icon: FolderGit2 },
    { id: 'community', labelKey: 'nav.community', defaultLabel: 'Community', icon: Users },
    { id: 'videos', labelKey: 'nav.videos', defaultLabel: 'Videos', icon: Video },
    { id: 'settings', labelKey: 'nav.settings', defaultLabel: 'Settings', icon: Settings },
  ];

  return (
    <aside
      className={`hidden md:flex flex-col justify-between transition-all duration-300 border-r border-blueprint-creamBorder dark:border-blueprint-nightBorder bg-blueprint-cream/70 dark:bg-blueprint-nightCard/80 backdrop-blur-md select-none z-20 ${
        sidebarCollapsed ? 'w-16' : 'w-56'
      }`}
    >
      {/* Navigation Links */}
      <div className="p-2 space-y-1 mt-2">
        {navItems.map((item) => {
          const Icon = item.icon;
          const isActive = activeNav === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveNav(item.id)}
              className={`w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-medium transition-all group relative ${
                isActive
                  ? 'bg-blueprint-teal text-white shadow-md shadow-blueprint-teal/20 font-semibold'
                  : 'text-blueprint-navy dark:text-gray-300 hover:bg-blueprint-creamDark dark:hover:bg-blueprint-nightBg'
              }`}
              title={sidebarCollapsed ? t(item.labelKey, item.defaultLabel) : undefined}
            >
              <Icon
                className={`w-5 h-5 flex-shrink-0 transition-transform group-hover:scale-110 ${
                  isActive ? 'text-white' : 'text-blueprint-teal'
                }`}
              />
              {!sidebarCollapsed && (
                <span className="truncate tracking-wide">{t(item.labelKey, item.defaultLabel)}</span>
              )}

              {/* Tooltip on collapsed mode */}
              {sidebarCollapsed && (
                <div className="absolute left-full ml-2 px-2 py-1 bg-blueprint-navy text-white text-xs rounded-md shadow-lg opacity-0 pointer-events-none group-hover:opacity-100 transition whitespace-nowrap z-50">
                  {t(item.labelKey, item.defaultLabel)}
                </div>
              )}
            </button>
          );
        })}
      </div>

      {/* Collapse / Expand toggle button at the bottom */}
      <div className="p-2 border-t border-blueprint-creamBorder dark:border-blueprint-nightBorder">
        <button
          onClick={toggleSidebar}
          className="w-full flex items-center justify-center p-2 rounded-xl text-blueprint-navy dark:text-gray-400 hover:bg-blueprint-creamDark dark:hover:bg-blueprint-nightBg transition text-xs font-mono"
          aria-label={sidebarCollapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {sidebarCollapsed ? (
            <ChevronRight className="w-5 h-5" />
          ) : (
            <div className="flex items-center gap-2">
              <ChevronLeft className="w-4 h-4" />
              <span>Collapse</span>
            </div>
          )}
        </button>
      </div>
    </aside>
  );
};
