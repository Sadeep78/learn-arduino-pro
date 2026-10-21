import React from 'react';
import { useTranslation } from 'react-i18next';

interface BrandLogoProps {
  collapsed?: boolean;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

export const BrandLogo: React.FC<BrandLogoProps> = ({ collapsed = false, className = '', size = 'md' }) => {
  const { t } = useTranslation();

  const iconSizes = {
    sm: 'w-7 h-7',
    md: 'w-9 h-9',
    lg: 'w-11 h-11'
  };

  return (
    <div className={`flex items-center gap-3 select-none ${className}`}>
      {/* Original Infinity Circuit Loop Logo */}
      <div className={`relative flex-shrink-0 ${iconSizes[size]} rounded-xl bg-blueprint-navy p-1.5 shadow-md flex items-center justify-center border border-blueprint-teal/40 group`}>
        <svg viewBox="0 0 100 100" fill="none" className="w-full h-full transition-transform duration-300 group-hover:scale-110">
          <circle cx="50" cy="50" r="42" stroke="#16B8B0" strokeOpacity="0.25" strokeWidth="2" strokeDasharray="3 3" />
          
          {/* Infinity loop with circuit path */}
          <path
            d="M28 50 C28 38 42 38 50 50 C58 62 72 62 72 50 C72 38 58 38 50 50 C42 62 28 62 28 50 Z"
            stroke="#16B8B0"
            strokeWidth="7"
            strokeLinecap="round"
            strokeLinejoin="round"
          />
          {/* Signal Trace */}
          <path
            d="M36 50 C40 44 46 44 50 50 C54 56 60 56 64 50"
            stroke="#FAF8F5"
            strokeWidth="2.5"
            strokeLinecap="round"
          />
          {/* Circuit nodes / solder pads */}
          <circle cx="28" cy="50" r="5" fill="#FAF8F5" stroke="#16B8B0" strokeWidth="3" />
          <circle cx="72" cy="50" r="5" fill="#FAF8F5" stroke="#16B8B0" strokeWidth="3" />
          <circle cx="50" cy="50" r="3.5" fill="#00F5D4" />
          
          {/* Small radial vias */}
          <circle cx="28" cy="32" r="2.5" fill="#16B8B0" />
          <circle cx="72" cy="68" r="2.5" fill="#16B8B0" />
        </svg>
      </div>

      {!collapsed && (
        <div className="flex flex-col">
          <div className="flex items-center gap-1.5 font-extrabold tracking-tight text-blueprint-navy dark:text-white leading-none">
            <span className="text-base tracking-wider">{t('brand.title', 'LEARN ARDUINO')}</span>
            <span className="text-xs px-1.5 py-0.5 rounded bg-blueprint-teal text-white font-mono font-bold tracking-widest shadow-sm">
              {t('brand.pro', 'PRO')}
            </span>
          </div>
          <span className="text-[9px] font-mono tracking-widest text-blueprint-navyMuted dark:text-gray-400 font-semibold mt-1">
            {t('brand.tagline', 'EXPLORE · UNDERSTAND · BUILD')}
          </span>
        </div>
      )}
    </div>
  );
};
