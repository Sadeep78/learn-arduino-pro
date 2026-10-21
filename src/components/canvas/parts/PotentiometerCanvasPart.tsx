import React from 'react';
import { CircuitComponent } from '../../../types/simulator';

interface PotPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
  onValueChange: (val: number) => void;
}

export const PotentiometerCanvasPart: React.FC<PotPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin,
  onValueChange
}) => {
  const value = component.properties?.value ?? 512; // 0 to 1023
  const voltage = ((value / 1023) * 5.0).toFixed(2);
  const angle = ((value / 1023) * 270) - 135; // -135deg to +135deg
  const unconnectedPins = component.properties?.unconnectedPins || [];

  return (
    <div
      className={`relative w-28 h-32 rounded-xl bg-blue-900/10 dark:bg-blueprint-nightCard border-2 border-blue-400/40 p-2.5 flex flex-col items-center justify-between select-none shadow-md ${
        isSelected ? 'border-blueprint-teal shadow-teal-glow' : ''
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* Knob Dial */}
      <div className="relative w-14 h-14 rounded-full bg-gradient-to-b from-gray-700 to-gray-900 border-2 border-gray-500 shadow-md flex items-center justify-center">
        {/* Pointer notch */}
        <div
          className="absolute w-1 h-5 bg-blueprint-teal rounded-full top-1 origin-bottom transition-transform"
          style={{ transform: `rotate(${angle}deg)` }}
        />
        <div className="w-4 h-4 rounded-full bg-gray-800 border border-gray-600" />
      </div>

      {/* Slider & Voltage Readout */}
      <div className="w-full flex flex-col items-center mt-1">
        <input
          type="range"
          min="0"
          max="1023"
          value={value}
          onChange={(e) => onValueChange(parseInt(e.target.value))}
          className="w-20 h-1.5 bg-gray-300 dark:bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blueprint-teal"
        />
        <span className="text-[10px] font-mono font-bold text-blueprint-navy dark:text-gray-200 mt-0.5">
          {voltage}V ({value})
        </span>
      </div>

      {/* 3 Bottom Terminals: VCC (Pin 1), Wiper (Pin 2), GND (Pin 3) */}
      <div className="w-full flex items-center justify-between px-1 mt-1">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('vcc');
          }}
          className="relative flex flex-col items-center"
          title="Terminal 1 (VCC)"
        >
          {unconnectedPins.includes('vcc') && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <div
            className={`w-3 h-3 rounded-full border ${
              activeWiringPin === 'vcc' ? 'bg-blueprint-teal animate-ping' : 'bg-red-500'
            }`}
          />
          <span className="text-[7px] font-mono text-gray-400">5V</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('wiper');
          }}
          className="relative flex flex-col items-center"
          title="Terminal 2 (Wiper A0)"
        >
          {unconnectedPins.includes('wiper') && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <div
            className={`w-3.5 h-3.5 rounded-full border-2 ${
              activeWiringPin === 'wiper' ? 'bg-blueprint-teal animate-ping' : 'bg-amber-400'
            }`}
          />
          <span className="text-[8px] font-mono font-bold text-blueprint-teal">SIG</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('gnd');
          }}
          className="relative flex flex-col items-center"
          title="Terminal 3 (GND)"
        >
          {unconnectedPins.includes('gnd') && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <div
            className={`w-3 h-3 rounded-full border ${
              activeWiringPin === 'gnd' ? 'bg-blueprint-teal animate-ping' : 'bg-gray-900'
            }`}
          />
          <span className="text-[7px] font-mono text-gray-400">GND</span>
        </button>
      </div>
    </div>
  );
};
