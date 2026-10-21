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

  // Realistic unlit epoxy colors when LED is OFF (dark, no white glow)
  const unlitColorMap: Record<string, { bg: string; border: string }> = {
    red: { bg: '#450A0A', border: '#7F1D1D' },
    green: { bg: '#052E16', border: '#14532D' },
    blue: { bg: '#0F172A', border: '#1E3A8A' },
    yellow: { bg: '#451A03', border: '#78350F' },
    orange: { bg: '#431407', border: '#7C2D12' }
  };

  const hexColor = colorHexMap[color] || '#EF4444';
  const unlitStyle = unlitColorMap[color] || unlitColorMap.red;
  const isBurnt = Boolean(component.properties?.isBurnt);
  const isBackwards = Boolean(component.properties?.isBackwards);
  const unconnectedPins: string[] = component.properties?.unconnectedPins || [];
  const isGlowing = !isBurnt && !isBackwards && brightness > 0.05;

  return (
    <div
      className={`relative w-20 h-24 flex flex-col items-center justify-between p-2 rounded-xl transition-all select-none ${
        isSelected ? 'bg-blueprint-teal/10 ring-2 ring-blueprint-teal/50' : ''
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* 5mm Dome LED Lens */}
      <div className="relative flex items-center justify-center">
        {/* Glow halo ONLY when on */}
        {isGlowing && (
          <div
            className="absolute rounded-full pointer-events-none transition-all duration-150 animate-pulse"
            style={{
              width: `${40 + brightness * 30}px`,
              height: `${40 + brightness * 30}px`,
              backgroundColor: hexColor,
              opacity: brightness * 0.75,
              filter: 'blur(10px)'
            }}
          />
        )}

        {/* LED Plastic Dome */}
        <div
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('anode');
          }}
          className={`w-10 h-10 rounded-full relative flex items-center justify-center transition-all duration-150 border-2 cursor-pointer ${
            isBurnt
              ? 'border-red-900 bg-stone-900 shadow-inner'
              : isBackwards
                ? 'border-amber-600 bg-amber-950/70 shadow-inner'
                : isGlowing
                  ? 'border-white/80 shadow-lg'
                  : 'border-black/60 shadow-inner hover:border-blueprint-teal'
          }`}
          title={
            isBurnt
              ? 'LED burned out! Add a resistor (220 ohm)'
              : isBackwards
                ? 'LED is backwards! Swap Anode (+) and Cathode (-)'
                : 'LED Bulb (Click to wire Anode +)'
          }
          style={{
            backgroundColor: isBurnt
              ? '#1c1917'
              : isBackwards
                ? '#291e0a'
                : isGlowing
                  ? hexColor
                  : unlitStyle.bg,
            borderColor: isBurnt
              ? '#7f1d1d'
              : isBackwards
                ? '#d97706'
                : isGlowing
                  ? 'rgba(255, 255, 255, 0.85)'
                  : unlitStyle.border,
            boxShadow: isBurnt
              ? 'inset 0 0 10px #000'
              : isGlowing
                ? `0 0 16px ${hexColor}, inset 0 0 6px rgba(255, 255, 255, 0.5)`
                : 'inset 0 3px 6px rgba(0, 0, 0, 0.7), 0 2px 4px rgba(0, 0, 0, 0.4)'
          }}
        >
          {/* Status overlay */}
          {isBurnt ? (
            <div className="flex flex-col items-center">
              <span className="text-[8px] font-black font-mono text-red-500 leading-none">BURNT</span>
            </div>
          ) : isBackwards ? (
            <div className="flex flex-col items-center">
              <span className="text-[7px] font-black font-mono text-amber-400 leading-none">REV</span>
            </div>
          ) : isGlowing ? (
            <div className="w-3.5 h-3.5 rounded-full bg-white/90 shadow-md animate-pulse" />
          ) : (
            <div className="relative w-3 h-2.5 flex items-center justify-center opacity-60">
              <div className="w-1.5 h-2 bg-black/80 rounded-t-sm" />
              <div className="w-2.5 h-1 bg-black/90 rounded-sm -ml-0.5" />
            </div>
          )}
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
          className={`flex flex-col items-center group relative ${
            activeWiringPin === 'anode' ? 'scale-125' : ''
          }`}
          title="Anode (+) Longer Lead"
        >
          {/* Unconnected Pin Red Dot Indicator */}
          {unconnectedPins.includes('anode') && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
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
          className={`flex flex-col items-center group relative ${
            activeWiringPin === 'cathode' ? 'scale-125' : ''
          }`}
          title="Cathode (-) Flat Lead / GND"
        >
          {/* Unconnected Pin Red Dot Indicator */}
          {unconnectedPins.includes('cathode') && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
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
