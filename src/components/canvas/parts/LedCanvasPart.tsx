import React from 'react';
import { CircuitComponent } from '../../../types/simulator';

interface LedPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
}

export const LedCanvasPart: React.FC<LedPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin
}) => {
  const color = component.properties?.color || 'red';
  const brightness = component.properties?.brightness ?? 0; // 0 to 1

  const colorHexMap: Record<string, string> = {
    red: '#EF4444',
    green: '#10B981',
    blue: '#3B82F6',
    yellow: '#F59E0B',
    orange: '#F97316'
  };

  const hexColor = colorHexMap[color] || '#EF4444';
  const isGlowing = brightness > 0.05;

  return (
    <div
      className={`relative w-20 h-24 flex flex-col items-center justify-between p-2 rounded-xl transition-all select-none ${
        isSelected ? 'bg-blueprint-teal/10 ring-2 ring-blueprint-teal/50' : ''
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* 5mm Dome LED Lens */}
      <div className="relative flex items-center justify-center">
        {/* Glow halo when on */}
        {isGlowing && (
          <div
            className="absolute rounded-full pointer-events-none transition-all duration-150 animate-pulse"
            style={{
              width: `${40 + brightness * 30}px`,
              height: `${40 + brightness * 30}px`,
              backgroundColor: hexColor,
              opacity: brightness * 0.7,
              filter: 'blur(10px)'
            }}
          />
        )}

        {/* LED Plastic Dome */}
        <div
          className="w-10 h-10 rounded-full border-2 border-white/60 shadow-lg relative flex items-center justify-center transition-all duration-150"
          style={{
            backgroundColor: isGlowing ? hexColor : '#374151',
            boxShadow: isGlowing ? `0 0 15px ${hexColor}` : 'none'
          }}
        >
          {/* Internal filament reflex */}
          <div className="w-3 h-3 rounded-full bg-white/40" />
        </div>
      </div>

      {/* Anode & Cathode Metal Legs with Clickable Pins */}
      <div className="w-full flex items-center justify-around mt-2">
        {/* Anode (+) Pin */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('anode');
          }}
          className={`flex flex-col items-center group ${
            activeWiringPin === 'anode' ? 'scale-125' : ''
          }`}
          title="Anode (+) Longer Lead"
        >
          <div
            className={`w-3.5 h-3.5 rounded-full border-2 transition ${
              activeWiringPin === 'anode'
                ? 'bg-blueprint-teal border-white animate-ping'
                : 'bg-gray-300 dark:bg-gray-600 border-gray-400 group-hover:bg-blueprint-teal'
            }`}
          />
          <span className="text-[9px] font-mono font-bold text-red-500 mt-0.5">A (+)</span>
        </button>

        {/* Cathode (-) Pin */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('cathode');
          }}
          className={`flex flex-col items-center group ${
            activeWiringPin === 'cathode' ? 'scale-125' : ''
          }`}
          title="Cathode (-) Flat Lead / GND"
        >
          <div
            className={`w-3.5 h-3.5 rounded-full border-2 transition ${
              activeWiringPin === 'cathode'
                ? 'bg-blueprint-teal border-white animate-ping'
                : 'bg-gray-300 dark:bg-gray-600 border-gray-400 group-hover:bg-blueprint-teal'
            }`}
          />
          <span className="text-[9px] font-mono font-bold text-gray-500 dark:text-gray-400 mt-0.5">
            K (-)
          </span>
        </button>
      </div>
    </div>
  );
};
