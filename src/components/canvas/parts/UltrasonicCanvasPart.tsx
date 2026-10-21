import React from 'react';
import { CircuitComponent } from '../../../types/simulator';

interface UltrasonicPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
  onDistanceChange: (val: number) => void;
}

export const UltrasonicCanvasPart: React.FC<UltrasonicPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin,
  onDistanceChange
}) => {
  const distance = component.properties?.value ?? 45; // 2cm to 400cm
  const unconnectedPins = component.properties?.unconnectedPins || [];

  return (
    <div
      className={`relative w-44 h-28 rounded-xl bg-blue-700 dark:bg-blue-900 border-2 border-blue-500 p-2 flex flex-col items-center justify-between select-none shadow-xl ${
        isSelected ? 'border-blueprint-teal shadow-teal-glow ring-2 ring-blueprint-teal/40' : ''
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* 2 Cylindrical Sonar Transducers (Transmitter & Receiver) */}
      <div className="w-full flex items-center justify-around px-2 pt-1">
        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border-2 border-gray-600 shadow-md flex items-center justify-center">
          <span className="text-[7px] font-mono font-bold text-gray-800">TRIG (T)</span>
        </div>

        <div className="w-12 h-12 rounded-full bg-gradient-to-br from-gray-300 to-gray-500 border-2 border-gray-600 shadow-md flex items-center justify-center">
          <span className="text-[7px] font-mono font-bold text-gray-800">ECHO (R)</span>
        </div>
      </div>

      {/* Distance Slider & Readout */}
      <div className="w-full flex items-center justify-between px-2">
        <input
          type="range"
          min="2"
          max="400"
          value={distance}
          onChange={(e) => onDistanceChange(parseInt(e.target.value))}
          className="w-24 h-1.5 bg-blue-950 rounded appearance-none cursor-pointer accent-blueprint-teal"
        />
        <span className="text-[10px] font-mono font-bold text-white bg-blue-950 px-1.5 py-0.5 rounded">
          {distance} cm
        </span>
      </div>

      {/* 4 Bottom Pins: VCC, TRIG, ECHO, GND */}
      <div className="w-full flex items-center justify-around bg-gray-900/80 rounded py-1">
        {[
          { id: 'vcc', label: 'VCC', color: 'bg-red-500' },
          { id: 'trig', label: 'TRIG', color: 'bg-blue-400' },
          { id: 'echo', label: 'ECHO', color: 'bg-purple-400' },
          { id: 'gnd', label: 'GND', color: 'bg-gray-400' },
        ].map((pin) => (
          <button
            key={pin.id}
            onClick={(e) => {
              e.stopPropagation();
              onPinClick(pin.id);
            }}
            className="relative flex flex-col items-center"
            title={`Pin: ${pin.label}`}
          >
            {unconnectedPins.includes(pin.id) && (
              <span className="absolute -top-1 -right-1 flex h-2 w-2 pointer-events-none">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-red-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2 w-2 bg-red-500"></span>
              </span>
            )}
            <div
              className={`w-2.5 h-2.5 rounded-full ${
                activeWiringPin === pin.id ? 'bg-blueprint-teal animate-ping' : pin.color
              }`}
            />
            <span className="text-[6px] font-mono text-gray-300">{pin.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
