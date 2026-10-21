import React from 'react';
import { CircuitComponent } from '../../../types/simulator';

interface ResistorPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
}

export const ResistorCanvasPart: React.FC<ResistorPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin
}) => {
  const resistance = component.properties?.resistance || 220;

  // Map resistance into 4 EIA color bands
  const bandColors = ['#000000', '#8B4513', '#EF4444', '#F97316', '#F59E0B', '#10B981', '#3B82F6', '#8B5CF6', '#6B7280', '#FFFFFF'];
  
  const resStr = resistance.toString();
  const digit1 = parseInt(resStr[0]) || 2;
  const digit2 = parseInt(resStr[1]) || 2;
  const multiplier = Math.max(0, resStr.length - 2);

  const c1 = bandColors[digit1] || '#EF4444';
  const c2 = bandColors[digit2] || '#EF4444';
  const c3 = bandColors[multiplier] || '#8B4513';
  const c4 = '#D4AF37'; // Gold 5%

  return (
    <div
      className={`relative w-28 h-14 flex items-center justify-between px-1 rounded-xl transition-all select-none ${
        isSelected ? 'bg-blueprint-teal/10 ring-2 ring-blueprint-teal/50' : ''
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* Pin 1 Terminal */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPinClick('pin1');
        }}
        className={`flex flex-col items-center group ${
          activeWiringPin === 'pin1' ? 'scale-125' : ''
        }`}
        title="Resistor Lead 1"
      >
        <div
          className={`w-3.5 h-3.5 rounded-full border-2 transition ${
            activeWiringPin === 'pin1'
              ? 'bg-blueprint-teal border-white animate-ping'
              : 'bg-gray-300 dark:bg-gray-600 border-gray-400 group-hover:bg-blueprint-teal'
          }`}
        />
        <span className="text-[8px] font-mono text-gray-400 mt-0.5">1</span>
      </button>

      {/* Wire leads extending to body */}
      <div className="flex-1 h-0.5 bg-gray-400" />

      {/* Resistor Ceramic Body with 4 Color Bands */}
      <div className="w-16 h-6 rounded-md bg-[#D2B48C] border border-[#B8860B] shadow-md flex items-center justify-around px-1 relative">
        <div className="w-1.5 h-full rounded-sm" style={{ backgroundColor: c1 }} title={`Band 1: ${digit1}`} />
        <div className="w-1.5 h-full rounded-sm" style={{ backgroundColor: c2 }} title={`Band 2: ${digit2}`} />
        <div className="w-1.5 h-full rounded-sm" style={{ backgroundColor: c3 }} title={`Band 3: Multiplier`} />
        <div className="w-1.5 h-full rounded-sm" style={{ backgroundColor: c4 }} title="Band 4: Gold 5%" />

        {/* Small label */}
        <span className="absolute -bottom-4 text-[9px] font-mono font-bold text-blueprint-navy dark:text-gray-200 whitespace-nowrap">
          {resistance >= 1000 ? `${resistance / 1000}kΩ` : `${resistance}Ω`}
        </span>
      </div>

      <div className="flex-1 h-0.5 bg-gray-400" />

      {/* Pin 2 Terminal */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPinClick('pin2');
        }}
        className={`flex flex-col items-center group ${
          activeWiringPin === 'pin2' ? 'scale-125' : ''
        }`}
        title="Resistor Lead 2"
      >
        <div
          className={`w-3.5 h-3.5 rounded-full border-2 transition ${
            activeWiringPin === 'pin2'
              ? 'bg-blueprint-teal border-white animate-ping'
              : 'bg-gray-300 dark:bg-gray-600 border-gray-400 group-hover:bg-blueprint-teal'
          }`}
        />
        <span className="text-[8px] font-mono text-gray-400 mt-0.5">2</span>
      </button>
    </div>
  );
};
