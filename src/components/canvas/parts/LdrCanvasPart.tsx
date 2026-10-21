import React from 'react';
import { Sun, Moon } from 'lucide-react';
import { CircuitComponent } from '../../../types/simulator';

interface LdrPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
  onValueChange: (val: number) => void;
}

export const LdrCanvasPart: React.FC<LdrPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin,
  onValueChange
}) => {
  const value = component.properties?.value ?? 600; // 0 (dark) to 1023 (bright)
  const unconnectedPins = component.properties?.unconnectedPins || [];

  return (
    <div
      className={`relative w-28 h-28 rounded-xl bg-amber-900/10 dark:bg-blueprint-nightCard border-2 border-amber-600/40 p-2 flex flex-col items-center justify-between select-none shadow-md ${
        isSelected ? 'border-blueprint-teal shadow-teal-glow' : ''
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* Photo-resistor disc face with serpentine cadmium sulfide track */}
      <div className="w-10 h-10 rounded-full bg-red-100 border-2 border-red-800 shadow-inner flex items-center justify-center p-1 relative">
        <svg viewBox="0 0 24 24" className="w-full h-full stroke-red-800 stroke-[2.5] fill-none">
          <path d="M4 6h16M4 12h16M4 18h16" strokeLinecap="round" />
        </svg>
      </div>

      {/* Interactive Light Slider */}
      <div className="w-full flex items-center gap-1 px-1">
        <Moon className="w-3 h-3 text-gray-500" />
        <input
          type="range"
          min="0"
          max="1023"
          value={value}
          onChange={(e) => onValueChange(parseInt(e.target.value))}
          className="w-full h-1 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-amber-500"
        />
        <Sun className="w-3 h-3 text-amber-500" />
      </div>

      {/* 2 Terminals */}
      <div className="w-full flex items-center justify-around">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('pin1');
          }}
          className="relative flex flex-col items-center"
          title="Terminal 1"
        >
          {unconnectedPins.includes('pin1') && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <div
            className={`w-3 h-3 rounded-full border ${
              activeWiringPin === 'pin1' ? 'bg-blueprint-teal animate-ping' : 'bg-gray-400'
            }`}
          />
          <span className="text-[7px] font-mono text-gray-400">1</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('pin2');
          }}
          className="relative flex flex-col items-center"
          title="Terminal 2"
        >
          {unconnectedPins.includes('pin2') && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <div
            className={`w-3 h-3 rounded-full border ${
              activeWiringPin === 'pin2' ? 'bg-blueprint-teal animate-ping' : 'bg-gray-400'
            }`}
          />
          <span className="text-[7px] font-mono text-gray-400">2</span>
        </button>
      </div>
    </div>
  );
};
