import React from 'react';
import { Volume2 } from 'lucide-react';
import { CircuitComponent } from '../../../types/simulator';

interface BuzzerPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
}

export const BuzzerCanvasPart: React.FC<BuzzerPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin
}) => {
  const isActive = Boolean(component.properties?.active);
  const unconnectedPins = component.properties?.unconnectedPins || [];

  return (
    <div
      className={`relative w-24 h-24 rounded-full bg-gray-900 border-4 border-gray-700 shadow-xl flex flex-col items-center justify-between p-2 select-none ${
        isSelected ? 'border-blueprint-teal shadow-teal-glow' : ''
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* Sound waves icon */}
      <div className="flex items-center justify-center mt-2">
        <Volume2
          className={`w-6 h-6 transition-transform ${
            isActive ? 'text-amber-400 animate-bounce' : 'text-gray-500'
          }`}
        />
      </div>

      <span className="text-[8px] font-mono font-bold text-gray-400 uppercase tracking-widest">
        PIEZO
      </span>

      {/* Pins: Positive (+) and Negative (-) */}
      <div className="w-full flex items-center justify-around pb-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('pos');
          }}
          className="relative flex flex-col items-center"
          title="Positive (+) Pin"
        >
          {unconnectedPins.includes('pos') && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <div
            className={`w-3 h-3 rounded-full border ${
              activeWiringPin === 'pos' ? 'bg-blueprint-teal animate-ping' : 'bg-red-500'
            }`}
          />
          <span className="text-[7px] font-mono text-red-400">+</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('neg');
          }}
          className="relative flex flex-col items-center"
          title="Negative (-) Pin"
        >
          {unconnectedPins.includes('neg') && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <div
            className={`w-3 h-3 rounded-full border ${
              activeWiringPin === 'neg' ? 'bg-blueprint-teal animate-ping' : 'bg-gray-400'
            }`}
          />
          <span className="text-[7px] font-mono text-gray-400">-</span>
        </button>
      </div>
    </div>
  );
};
