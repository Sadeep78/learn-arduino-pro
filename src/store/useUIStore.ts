import { create } from 'zustand';

export type NavItem =
  | 'home'
  | 'lessons'
  | 'simulator'
  | 'components'
  | 'projects'
  | 'community'
  | 'settings'
  | 'challenges'
  | 'videos';

export type RightPanelTab = 'overview' | 'pinout' | 'example' | 'specs';

interface UIState {
  activeNav: NavItem;
  theme: 'light' | 'dark';
  highContrast: boolean;
  sidebarCollapsed: boolean;
  selectedHotspot: string | null;
  rightPanelTab: RightPanelTab;
  mobileDrawerOpen: boolean;
  isTutorOpen: boolean;
  isQuizOpen: boolean;
  isCertificateOpen: boolean;
  activeLessonId: string;
  setActiveNav: (nav: NavItem) => void;
  toggleTheme: () => void;
  setTheme: (theme: 'light' | 'dark') => void;
  toggleHighContrast: () => void;
  setSidebarCollapsed: (collapsed: boolean) => void;
  toggleSidebar: () => void;
  setSelectedHotspot: (hotspotId: string | null) => void;
  setRightPanelTab: (tab: RightPanelTab) => void;
  setMobileDrawerOpen: (open: boolean) => void;
  setIsTutorOpen: (open: boolean) => void;
  setIsQuizOpen: (open: boolean) => void;
  setIsCertificateOpen: (open: boolean) => void;
  setActiveLessonId: (lessonId: string) => void;
}

export const useUIStore = create<UIState>((set) => ({
  activeNav: 'home',
  theme: (localStorage.getItem('arduino_pro_theme') as 'light' | 'dark') || 'light',
  highContrast: localStorage.getItem('arduino_pro_high_contrast') === 'true',
  sidebarCollapsed: false,
  selectedHotspot: 'atmega328p',
  rightPanelTab: 'overview',
  mobileDrawerOpen: false,
  isTutorOpen: false,
  isQuizOpen: false,
  isCertificateOpen: false,
  activeLessonId: 'lesson-1',

  setActiveNav: (nav) => set({ activeNav: nav }),
  toggleTheme: () =>
    set((state) => {
      const newTheme = state.theme === 'light' ? 'dark' : 'light';
      localStorage.setItem('arduino_pro_theme', newTheme);
      if (newTheme === 'dark') {
        document.documentElement.classList.add('dark');
      } else {
        document.documentElement.classList.remove('dark');
      }
      return { theme: newTheme };
    }),
  setTheme: (theme) => {
    localStorage.setItem('arduino_pro_theme', theme);
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
    set({ theme });
  },
  toggleHighContrast: () =>
    set((state) => {
      const next = !state.highContrast;
      localStorage.setItem('arduino_pro_high_contrast', String(next));
      if (next) {
        document.documentElement.classList.add('high-contrast');
      } else {
        document.documentElement.classList.remove('high-contrast');
      }
      return { highContrast: next };
    }),
  setSidebarCollapsed: (collapsed) => set({ sidebarCollapsed: collapsed }),
  toggleSidebar: () => set((state) => ({ sidebarCollapsed: !state.sidebarCollapsed })),
  setSelectedHotspot: (hotspotId) => set({ selectedHotspot: hotspotId }),
  setRightPanelTab: (tab) => set({ rightPanelTab: tab }),
  setMobileDrawerOpen: (open) => set({ mobileDrawerOpen: open }),
  setIsTutorOpen: (open) => set({ isTutorOpen: open }),
  setIsQuizOpen: (open) => set({ isQuizOpen: open }),
  setIsCertificateOpen: (open) => set({ isCertificateOpen: open }),
  setActiveLessonId: (activeLessonId) => set({ activeLessonId })
}));
