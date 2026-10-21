import React from 'react';
import { CircuitComponent } from '../../../types/simulator';

interface ServoPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
}

export const ServoCanvasPart: React.FC<ServoPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin
}) => {
  const angle = component.properties?.angle ?? 90; // 0 to 180 degrees
  const unconnectedPins = component.properties?.unconnectedPins || [];

  return (
    <div
      className={`relative w-28 h-28 rounded-xl bg-blue-600 dark:bg-blue-800 border-2 border-blue-400 p-2 flex flex-col items-center justify-between select-none shadow-xl ${
        isSelected ? 'border-blueprint-teal shadow-teal-glow' : ''
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* Servo Gear Horn / Arm (Rotating dynamically) */}
      <div className="relative w-14 h-14 flex items-center justify-center">
        <div
          className="absolute w-2.5 h-12 bg-white rounded-full shadow-md origin-center transition-transform duration-200 border border-gray-300"
          style={{ transform: `rotate(${angle - 90}deg)` }}
        >
          <div className="w-1.5 h-1.5 rounded-full bg-gray-400 mx-auto mt-1" />
        </div>
        <div className="w-6 h-6 rounded-full bg-gray-200 border-2 border-gray-400 z-10 flex items-center justify-center">
          <span className="text-[7px] font-mono font-bold text-gray-700">{angle}°</span>
        </div>
      </div>

      <span className="text-[8px] font-mono font-bold text-white tracking-wider">
        SG90 SERVO
      </span>

      {/* 3 Wires Header: Signal (Orange), VCC (Red), GND (Brown) */}
      <div className="w-full flex items-center justify-around bg-gray-900/60 rounded px-1 py-0.5">
        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('signal');
          }}
          className="relative flex flex-col items-center"
          title="PWM Signal (Orange)"
        >
          {unconnectedPins.includes('signal') && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              activeWiringPin === 'signal' ? 'bg-blueprint-teal animate-ping' : 'bg-orange-500'
            }`}
          />
          <span className="text-[6px] font-mono text-orange-400">SIG</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('vcc');
          }}
          className="relative flex flex-col items-center"
          title="Power 5V (Red)"
        >
          {unconnectedPins.includes('vcc') && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              activeWiringPin === 'vcc' ? 'bg-blueprint-teal animate-ping' : 'bg-red-500'
            }`}
          />
          <span className="text-[6px] font-mono text-red-400">5V</span>
        </button>

        <button
          onClick={(e) => {
            e.stopPropagation();
            onPinClick('gnd');
          }}
          className="relative flex flex-col items-center"
          title="Ground (Brown/Black)"
        >
          {unconnectedPins.includes('gnd') && (
            <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
            </span>
          )}
          <div
            className={`w-2.5 h-2.5 rounded-full ${
              activeWiringPin === 'gnd' ? 'bg-blueprint-teal animate-ping' : 'bg-amber-900'
            }`}
          />
          <span className="text-[6px] font-mono text-gray-400">GND</span>
        </button>
      </div>
    </div>
  );
};
