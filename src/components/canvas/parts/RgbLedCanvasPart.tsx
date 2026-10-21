import React from 'react';
import { CircuitComponent } from '../../../types/simulator';

interface RgbLedPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
}

export const RgbLedCanvasPart: React.FC<RgbLedPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin
}) => {
  const r = component.properties?.r ?? 255;
  const g = component.properties?.g ?? 0;
  const b = component.properties?.b ?? 0;

  return (
    <div
      className={`relative w-24 h-28 rounded-xl p-2 flex flex-col items-center justify-between select-none ${
        isSelected ? 'bg-blueprint-teal/10 ring-2 ring-blueprint-teal/50' : ''
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* 5mm Diffused RGB Lens */}
      <div
        className="w-12 h-12 rounded-full border-2 border-white/80 shadow-lg flex items-center justify-center transition-all duration-150"
        style={{
          backgroundColor: `rgb(${r}, ${g}, ${b})`,
          boxShadow: `0 0 20px rgba(${r}, ${g}, ${b}, 0.7)`
        }}
      >
        <div className="w-3 h-3 rounded-full bg-white/50" />
      </div>

      {/* 4 Leads: R, Cathode (-), G, B */}
      <div className="w-full flex items-center justify-around mt-2">
        {[
          { id: 'r', label: 'R', color: 'bg-red-500' },
          { id: 'cathode', label: 'GND', color: 'bg-gray-700' },
          { id: 'g', label: 'G', color: 'bg-green-500' },
          { id: 'b', label: 'B', color: 'bg-blue-500' },
        ].map((pin) => (
          <button
            key={pin.id}
            onClick={(e) => {
              e.stopPropagation();
              onPinClick(pin.id);
            }}
            className="flex flex-col items-center"
            title={`RGB Pin: ${pin.label}`}
          >
            <div
              className={`w-3 h-3 rounded-full border ${
                activeWiringPin === pin.id ? 'bg-blueprint-teal animate-ping' : pin.color
              }`}
            />
            <span className="text-[7px] font-mono text-gray-500 dark:text-gray-400 mt-0.5">
              {pin.label}
            </span>
          </button>
        ))}
      </div>
    </div>
  );
};
