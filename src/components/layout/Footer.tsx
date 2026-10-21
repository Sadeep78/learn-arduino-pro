import React from 'react';
import { useTranslation } from 'react-i18next';
import { Heart, Sparkles, Terminal } from 'lucide-react';

export const Footer: React.FC = () => {
  const { t } = useTranslation();

  return (
    <footer className="mt-8 py-4 px-4 border-t border-blueprint-creamBorder dark:border-blueprint-nightBorder text-center select-none text-xs font-mono text-blueprint-navyMuted dark:text-gray-400">
      <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blueprint-teal" />
          <span className="font-bold text-blueprint-navy dark:text-white">Learn Arduino Pro</span>
          <span>— {t('brand.tagline', 'DESIGN · SIMULATE · INNOVATE')}</span>
        </div>

        <div className="flex items-center gap-1.5 font-medium">
          <span>{t('footer.designedBy', 'Designed & Engineered by')}</span>
          <span className="px-2 py-0.5 rounded-md bg-blueprint-tealLight dark:bg-blueprint-teal/15 text-blueprint-teal font-bold border border-blueprint-teal/30">
            {t('footer.author', 'Sadeep Sasanka')}
          </span>
          <Sparkles className="w-3.5 h-3.5 text-blueprint-teal" />
        </div>
      </div>
    </footer>
  );
};
