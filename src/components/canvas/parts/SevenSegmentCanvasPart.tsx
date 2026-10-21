import React from 'react';
import { CircuitComponent } from '../../../types/simulator';

interface SevenSegmentPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
}

export const SevenSegmentCanvasPart: React.FC<SevenSegmentPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin
}) => {
  const value = component.properties?.value ?? 8; // 0-9

  return (
    <div
      className={`relative w-24 h-32 rounded-xl bg-gray-900 border-2 border-gray-700 p-2 flex flex-col items-center justify-between select-none shadow-xl ${
        isSelected ? 'border-blueprint-teal shadow-teal-glow' : ''
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* 7-Segment Digit Display */}
      <div className="w-16 h-20 bg-gray-950 rounded border border-gray-800 flex items-center justify-center font-mono text-4xl font-extrabold text-red-500 shadow-inner">
        {value}
      </div>

      {/* Pin headers: A-G and Common Cathode */}
      <div className="w-full flex items-center justify-around bg-gray-800 px-1 py-0.5 rounded">
        {['a', 'b', 'c', 'gnd'].map((pin) => (
          <button
            key={pin}
            onClick={(e) => {
              e.stopPropagation();
              onPinClick(pin);
            }}
            className="flex flex-col items-center"
            title={`Pin: ${pin}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                activeWiringPin === pin ? 'bg-blueprint-teal animate-ping' : 'bg-red-400'
              }`}
            />
            <span className="text-[6px] font-mono text-gray-400 uppercase">{pin}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
