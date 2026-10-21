import React, { useState } from 'react';
import { useTranslation } from 'react-i18next';
import {
  Settings,
  User,
  Moon,
  Sun,
  Globe,
  Shield,
  Volume2,
  Trash2,
  Cloud,
  CheckCircle2,
  AlertTriangle
} from 'lucide-react';
import { useUIStore } from '../store/useUIStore';
import { useProgressStore } from '../store/useProgressStore';
import { isSupabaseConfigured } from '../lib/supabase/client';

export const SettingsView: React.FC = () => {
  const { t, i18n } = useTranslation();
  const { theme, toggleTheme } = useUIStore();
  const { displayName, setDisplayName, resetProgress, xp, level } = useProgressStore();

  const [nameInput, setNameInput] = useState(displayName);
  const [analyticsEnabled, setAnalyticsEnabled] = useState(false);
  const [audioFeedback, setAudioFeedback] = useState(true);
  const [showConfirmReset, setShowConfirmReset] = useState(false);

  const handleSaveName = (e: React.FormEvent) => {
    e.preventDefault();
    setDisplayName(nameInput);
  };

  const handleLanguageChange = (lng: string) => {
    i18n.changeLanguage(lng);
    localStorage.setItem('arduino_pro_lang', lng);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6 select-none">
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <Settings className="w-5 h-5 text-blueprint-teal" />
          <div>
            <h2 className="text-xl font-black text-blueprint-navy dark:text-white">
              PLATFORM SETTINGS
            </h2>
            <p className="text-xs text-blueprint-navyMuted dark:text-gray-300 mt-0.5">
              Customize appearance, language, audio synthesis, profile, and privacy controls.
            </p>
          </div>
        </div>
      </div>

      {/* Profile Section */}
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm space-y-4">
        <h3 className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-wider flex items-center gap-2">
          <User className="w-4 h-4" />
          <span>Learner Profile & Credentials</span>
        </h3>

        <form onSubmit={handleSaveName} className="flex items-center gap-3 max-w-md">
          <input
            type="text"
            value={nameInput}
            onChange={(e) => setNameInput(e.target.value)}
            placeholder="Your Name (Used on Certificate)"
            className="flex-1 px-3.5 py-2 rounded-xl bg-blueprint-creamDark dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs text-blueprint-navy dark:text-white focus:outline-none focus:border-blueprint-teal font-mono"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold shadow-sm transition"
          >
            Update
          </button>
        </form>

        <div className="flex items-center gap-4 text-xs font-mono text-gray-500 pt-1">
          <span>Current Level: <strong>LVL {level}</strong></span>
          <span>·</span>
          <span>Total Accumulated: <strong>{xp} XP</strong></span>
        </div>
      </div>

      {/* Language & Theme Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {/* Language Selection */}
        <div className="p-6 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm space-y-3">
          <h3 className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-wider flex items-center gap-2">
            <Globe className="w-4 h-4" />
            <span>Language Localization</span>
          </h3>
          <p className="text-xs text-gray-500">
            Learn in English, Sinhala (සිංහල), or Tamil (தமிழ்).
          </p>

          <div className="flex flex-col gap-2 pt-1">
            {[
              { code: 'en', label: 'English (US)' },
              { code: 'si', label: 'සිංහල (Sinhala)' },
              { code: 'ta', label: 'தமிழ் (Tamil)' },
            ].map((l) => (
              <button
                key={l.code}
                onClick={() => handleLanguageChange(l.code)}
                className={`p-3 rounded-xl border text-left text-xs font-mono flex items-center justify-between transition ${
                  i18n.language === l.code
                    ? 'border-blueprint-teal bg-blueprint-tealLight/50 dark:bg-blueprint-teal/15 font-bold text-blueprint-teal'
                    : 'border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-gray-300 hover:border-blueprint-teal/50'
                }`}
              >
                <span>{l.label}</span>
                {i18n.language === l.code && <CheckCircle2 className="w-4 h-4 text-blueprint-teal" />}
              </button>
            ))}
          </div>
        </div>

        {/* Theme & Audio */}
        <div className="p-6 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm space-y-4">
          <h3 className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-wider flex items-center gap-2">
            <Sun className="w-4 h-4" />
            <span>Theme & Accessibility</span>
          </h3>

          <div className="flex items-center justify-between p-3 rounded-xl bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60 border border-blueprint-creamBorder/70 dark:border-blueprint-nightBorder/70">
            <div>
              <span className="text-xs font-bold text-blueprint-navy dark:text-white block font-mono">
                Blueprint Theme Mode
              </span>
              <span className="text-[11px] text-gray-500">
                {theme === 'light' ? 'Warm Cream Blueprint' : 'Night Engineering Blueprint'}
              </span>
            </div>
            <button
              onClick={toggleTheme}
              className="px-3 py-1.5 rounded-xl bg-white dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs font-mono font-bold"
            >
              Toggle
            </button>
          </div>

          <div className="flex items-center justify-between p-3 rounded-xl bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60 border border-blueprint-creamBorder/70 dark:border-blueprint-nightBorder/70">
            <div>
              <span className="text-xs font-bold text-blueprint-navy dark:text-white block font-mono">
                Privacy-Friendly Telemetry
              </span>
              <span className="text-[11px] text-gray-500">
                {analyticsEnabled ? 'Enabled (Opt-in)' : 'Disabled by Default (Private)'}
              </span>
            </div>
            <button
              onClick={() => setAnalyticsEnabled(!analyticsEnabled)}
              className={`w-11 h-6 rounded-full transition-colors p-1 ${
                analyticsEnabled ? 'bg-blueprint-teal' : 'bg-gray-300 dark:bg-gray-700'
              }`}
            >
              <div
                className={`w-4 h-4 rounded-full bg-white transition-transform ${
                  analyticsEnabled ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
          </div>
        </div>
      </div>

      {/* Reset Progress Danger Zone */}
      <div className="p-6 rounded-2xl bg-red-50/50 dark:bg-red-950/20 border border-red-200 dark:border-red-900 shadow-sm flex items-center justify-between">
        <div>
          <h4 className="text-xs font-mono font-bold text-red-600 dark:text-red-400 uppercase">
            RESET ALL LOCAL PROGRESS
          </h4>
          <p className="text-xs text-gray-500 mt-0.5">
            Clear all completed lessons, XP, quizzes, and badges from this browser.
          </p>
        </div>

        {!showConfirmReset ? (
          <button
            onClick={() => setShowConfirmReset(true)}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-mono font-bold transition shadow-sm"
          >
            <Trash2 className="w-4 h-4" />
            <span>Reset Progress</span>
          </button>
        ) : (
          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                resetProgress();
                setShowConfirmReset(false);
              }}
              className="px-3 py-1.5 rounded-lg bg-red-600 text-white text-xs font-mono font-bold"
            >
              Confirm Reset
            </button>
            <button
              onClick={() => setShowConfirmReset(false)}
              className="px-3 py-1.5 rounded-lg border border-gray-400 text-xs font-mono"
            >
              Cancel
            </button>
          </div>
        )}
      </div>
    </div>
  );
};
