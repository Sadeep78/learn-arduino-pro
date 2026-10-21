import React, { useEffect } from 'react';
import { TopBar } from './components/layout/TopBar';
import { Sidebar } from './components/layout/Sidebar';
import { BottomNav, MobileDrawer } from './components/layout/BottomNav';
import { Footer } from './components/layout/Footer';
import { HomeView } from './views/HomeView';
import { LessonsView } from './views/LessonsView';
import { SimulatorView } from './views/SimulatorView';
import { ComponentsCatalogView } from './views/ComponentsCatalogView';
import { ChallengesView } from './views/ChallengesView';
import { ProjectsView } from './views/ProjectsView';
import { CommunityView } from './views/CommunityView';
import { VideosView } from './views/VideosView';
import { SettingsView } from './views/SettingsView';
import { TutorChat } from './components/tutor/TutorChat';
import { QuizModal } from './components/gamification/QuizModal';
import { CertificateGenerator } from './components/gamification/CertificateGenerator';
import { useUIStore } from './store/useUIStore';

export const App: React.FC = () => {
  const { activeNav, theme, highContrast } = useUIStore();

  // Sync theme with html document class
  useEffect(() => {
    if (theme === 'dark') {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [theme]);

  // Sync high contrast mode
  useEffect(() => {
    if (highContrast) {
      document.documentElement.classList.add('high-contrast');
    } else {
      document.documentElement.classList.remove('high-contrast');
    }
  }, [highContrast]);

  return (
    <div className="min-h-screen flex flex-col bg-blueprint-cream dark:bg-blueprint-nightBg text-blueprint-navy dark:text-gray-100 transition-colors">
      {/* Top Bar with Brand, Progress, Clock, XP, Streak, Language, Theme */}
      <TopBar />

      <div className="flex-1 flex overflow-hidden">
        {/* Collapsible Left Navigation Sidebar */}
        <Sidebar />

        {/* Main Application Viewport */}
        <main className="flex-1 overflow-y-auto px-4 sm:px-6 lg:px-8 py-6 relative">
          {/* Blueprint subtle engineering grid pattern background */}
          <div className="absolute inset-0 blueprint-grid opacity-35 pointer-events-none -z-10" />

          <div className="max-w-7xl mx-auto space-y-6">
            {activeNav === 'home' && <HomeView />}
            {activeNav === 'lessons' && <LessonsView />}
            {activeNav === 'simulator' && <SimulatorView />}
            {activeNav === 'components' && <ComponentsCatalogView />}
            {activeNav === 'challenges' && <ChallengesView />}
            {activeNav === 'projects' && <ProjectsView />}
            {activeNav === 'community' && <CommunityView />}
            {activeNav === 'videos' && <VideosView />}
            {activeNav === 'settings' && <SettingsView />}
          </div>

          <Footer />
        </main>
      </div>

      {/* Global Interactive Slide-Over Modals & Panels */}
      <TutorChat />
      <QuizModal />
      <CertificateGenerator />

      {/* Responsive Tablet & Mobile Navigation Drawers */}
      <MobileDrawer />
      <BottomNav />
    </div>
  );
};

export default App;
