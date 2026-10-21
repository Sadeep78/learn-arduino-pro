import React, { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Flame,
  Zap,
  Clock,
  Globe,
  Sun,
  Moon,
  Bot,
  User,
  CheckCircle2,
  Menu,
  ChevronDown
} from 'lucide-react';
import { BrandLogo } from '../common/BrandLogo';
import { useProgressStore } from '../../store/useProgressStore';
import { useUIStore } from '../../store/useUIStore';

export const TopBar: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { xp, level, streakDays, completedLessons, displayName } = useProgressStore();
  const {
    theme,
    toggleTheme,
    isTutorOpen,
    setIsTutorOpen,
    setMobileDrawerOpen,
    setActiveNav
  } = useUIStore();

  const [currentTime, setCurrentTime] = useState<string>('');
  const [currentDate, setCurrentDate] = useState<string>('');
  const [langDropdownOpen, setLangDropdownOpen] = useState<boolean>(false);

  // Live real-time clock
  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      setCurrentTime(
        now.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', second: '2-digit', hour12: false })
      );
      setCurrentDate(
        now.toLocaleDateString([], { weekday: 'short', month: 'short', day: 'numeric' })
      );
    };

    updateTime();
    const timer = setInterval(updateTime, 1000);
    return () => clearInterval(timer);
  }, []);

  const changeLanguage = (lang: string) => {
    i18n.changeLanguage(lang);
    localStorage.setItem('arduino_pro_lang', lang);
    setLangDropdownOpen(false);
  };

  const completedCount = completedLessons.length;
  const progressPercent = Math.round((completedCount / 11) * 100);

  const languages = [
    { code: 'en', label: 'English', native: 'English' },
    { code: 'si', label: 'Sinhala', native: 'සිංහල' },
    { code: 'ta', label: 'Tamil', native: 'தமிழ்' }
  ];

  const currentLangLabel = languages.find((l) => l.code === i18n.language)?.native || 'English';

  return (
    <header className="h-16 px-4 bg-blueprint-cream/90 dark:bg-blueprint-nightCard/95 backdrop-blur-md border-b border-blueprint-creamBorder dark:border-blueprint-nightBorder flex items-center justify-between z-30 transition-colors select-none">
      {/* Left: Mobile hamburger + Brand */}
      <div className="flex items-center gap-3">
        <button
          onClick={() => setMobileDrawerOpen(true)}
          className="md:hidden p-2 rounded-lg text-blueprint-navy dark:text-gray-200 hover:bg-black/5 dark:hover:bg-white/5 transition"
          aria-label="Open Navigation Menu"
        >
          <Menu className="w-5 h-5" />
        </button>

        <BrandLogo size="md" />
      </div>

      {/* Center: Curriculum Progress Card + Live Blueprint Clock (Hidden on very small screens) */}
      <div className="hidden lg:flex items-center gap-6">
        {/* Category Progress Card */}
        <div className="flex items-center gap-3 px-3.5 py-1.5 rounded-xl bg-blueprint-creamDark dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm">
          <div className="flex flex-col">
            <div className="flex items-center justify-between gap-4">
              <span className="text-[10px] font-mono font-bold tracking-wider text-blueprint-teal uppercase">
                {t('topbar.categoryProgress', 'BASICS')}
              </span>
              <span className="text-[11px] font-mono font-semibold text-blueprint-navy dark:text-gray-200">
                {completedCount}/11
              </span>
            </div>
            {/* Progress track */}
            <div className="w-28 h-1.5 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden mt-1">
              <div
                className="h-full bg-gradient-to-r from-blueprint-teal to-emerald-400 transition-all duration-500 rounded-full"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
          {completedCount === 11 && (
            <CheckCircle2 className="w-4 h-4 text-emerald-500 flex-shrink-0 animate-bounce" />
          )}
        </div>

        {/* Live Clock / Frequency Sync */}
        <div className="hidden xl:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60 border border-blueprint-creamBorder/70 dark:border-blueprint-nightBorder/70 text-xs font-mono text-blueprint-navyMuted dark:text-gray-400">
          <div className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" title="Microcontroller Clock 16 MHz Active" />
          <Clock className="w-3.5 h-3.5 text-blueprint-teal" />
          <span className="font-semibold text-blueprint-navy dark:text-gray-200">{currentTime}</span>
          <span className="text-[10px] opacity-75">· {currentDate}</span>
        </div>
      </div>

      {/* Right: Gamification Badges, Streak, Language, Theme, AI Tutor, User */}
      <div className="flex items-center gap-2 sm:gap-3">
        {/* Streak Counter */}
        <div
          className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl bg-amber-50 dark:bg-amber-950/40 border border-amber-200 dark:border-amber-800 text-amber-700 dark:text-amber-400 text-xs font-mono font-bold shadow-sm"
          title={`${streakDays} Day Active Coding Streak!`}
        >
          <Flame className="w-4 h-4 text-amber-500 fill-amber-500 animate-pulse" />
          <span>{streakDays}d</span>
        </div>

        {/* XP & Level Badge */}
        <div
          className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-blueprint-tealLight dark:bg-blueprint-teal/15 border border-blueprint-teal/30 text-blueprint-teal dark:text-teal-300 text-xs font-mono font-bold shadow-sm"
          title={`Level ${level} Explorer · Total XP: ${xp}`}
        >
          <Zap className="w-4 h-4 fill-blueprint-teal text-blueprint-teal" />
          <span>LVL {level}</span>
          <span className="opacity-70 text-[10px]">({xp} XP)</span>
        </div>

        {/* Language Switcher Dropdown */}
        <div className="relative">
          <button
            onClick={() => setLangDropdownOpen(!langDropdownOpen)}
            className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:bg-blueprint-creamDark dark:hover:bg-blueprint-nightBg text-xs font-medium text-blueprint-navy dark:text-gray-200 transition"
            aria-label="Change Language"
          >
            <Globe className="w-3.5 h-3.5 text-blueprint-teal" />
            <span className="hidden sm:inline font-mono">{currentLangLabel}</span>
            <ChevronDown className="w-3 h-3 opacity-60" />
          </button>

          {langDropdownOpen && (
            <div className="absolute right-0 mt-2 w-36 py-1 bg-white dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder rounded-xl shadow-xl z-50 animate-in fade-in slide-in-from-top-1 duration-150">
              {languages.map((l) => (
                <button
                  key={l.code}
                  onClick={() => changeLanguage(l.code)}
                  className={`w-full text-left px-3 py-1.5 text-xs flex items-center justify-between hover:bg-blueprint-tealLight dark:hover:bg-blueprint-teal/20 transition ${
                    i18n.language === l.code ? 'font-bold text-blueprint-teal' : 'text-blueprint-navy dark:text-gray-300'
                  }`}
                >
                  <span>{l.native}</span>
                  <span className="text-[10px] font-mono text-gray-400 uppercase">{l.code}</span>
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Theme Toggle Button */}
        <button
          onClick={toggleTheme}
          className="p-2 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-gray-200 hover:bg-blueprint-creamDark dark:hover:bg-blueprint-nightBg transition"
          title={theme === 'light' ? t('topbar.themeNight', 'Switch to Night Blueprint') : t('topbar.themeLight', 'Switch to Light Blueprint')}
          aria-label="Toggle theme"
        >
          {theme === 'light' ? (
            <Moon className="w-4 h-4 text-blueprint-navy" />
          ) : (
            <Sun className="w-4 h-4 text-amber-400" />
          )}
        </button>

        {/* AI Tutor Assistant Button */}
        <button
          onClick={() => setIsTutorOpen(!isTutorOpen)}
          className={`relative flex items-center gap-1.5 px-3 py-1.5 rounded-xl border transition shadow-sm text-xs font-medium ${
            isTutorOpen
              ? 'bg-blueprint-teal text-white border-blueprint-teal ring-2 ring-blueprint-teal/30'
              : 'border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-gray-200 hover:border-blueprint-teal/60'
          }`}
          title="Open AI Arduino Tutor"
        >
          <Bot className="w-4 h-4 text-inherit" />
          <span className="hidden sm:inline font-mono">Tutor</span>
          <span className="flex h-2 w-2 relative">
            <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-teal-400 opacity-75"></span>
            <span className="relative inline-flex rounded-full h-2 w-2 bg-blueprint-teal"></span>
          </span>
        </button>

        {/* User Profile / Guest Badge */}
        <button
          onClick={() => setActiveNav('settings')}
          className="flex items-center gap-2 pl-1 hover:opacity-80 transition cursor-pointer text-left"
          title="Account & Settings"
          aria-label="Account Settings"
        >
          <div className="w-8 h-8 rounded-xl bg-blueprint-navy text-white flex items-center justify-center font-bold text-xs shadow border border-blueprint-teal/40">
            <User className="w-4 h-4 text-blueprint-teal" />
          </div>
          <span className="hidden xl:inline text-xs font-mono font-medium text-blueprint-navy dark:text-gray-300">
            {displayName}
          </span>
        </button>
      </div>
    </header>
  );
};
