import React from 'react';
import { CircuitComponent } from '../../../types/simulator';

interface UnoCanvasPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
}

export const UnoCanvasPart: React.FC<UnoCanvasPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin
}) => {
  // Pin definitions with exact relative pixel offsets on the board
  // Digital pins across the top (left to right: AREF, GND, 13 ... 0)
  const topPins = [
    { id: 'aref', label: 'AREF' },
    { id: 'gnd3', label: 'GND' },
    { id: 'd13', label: '13' },
    { id: 'd12', label: '12' },
    { id: 'd11', label: '~11' },
    { id: 'd10', label: '~10' },
    { id: 'd9', label: '~9' },
    { id: 'd8', label: '8' },
    { id: 'd7', label: '7' },
    { id: 'd6', label: '~6' },
    { id: 'd5', label: '~5' },
    { id: 'd4', label: '4' },
    { id: 'd3', label: '~3' },
    { id: 'd2', label: '2' },
    { id: 'd1', label: 'TX·1' },
    { id: 'd0', label: 'RX·0' }
  ];

  // Bottom power & analog pins
  const bottomPowerPins = [
    { id: 'ioref', label: 'IOREF' },
    { id: 'reset', label: 'RESET' },
    { id: '3v3', label: '3.3V' },
    { id: '5v', label: '5V' },
    { id: 'gnd1', label: 'GND' },
    { id: 'gnd2', label: 'GND' },
    { id: 'vin', label: 'VIN' }
  ];

  const bottomAnalogPins = [
    { id: 'a0', label: 'A0' },
    { id: 'a1', label: 'A1' },
    { id: 'a2', label: 'A2' },
    { id: 'a3', label: 'A3' },
    { id: 'a4', label: 'A4' },
    { id: 'a5', label: 'A5' }
  ];

  return (
    <div
      className={`relative w-[340px] h-[220px] rounded-2xl bg-[#00838F] dark:bg-[#006978] border-2 shadow-2xl transition-all select-none p-3 ${
        isSelected ? 'border-blueprint-teal shadow-teal-glow ring-2 ring-blueprint-teal/40' : 'border-[#004D40]'
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* Silkscreen board lines and text */}
      <div className="absolute inset-2 border border-white/20 rounded-xl pointer-events-none" />
      
      {/* USB Port (Metal box on left) */}
      <div className="absolute -left-3 top-5 w-12 h-14 bg-gradient-to-r from-gray-400 to-gray-300 rounded-sm border border-gray-600 shadow-md flex items-center justify-center">
        <span className="text-[9px] font-mono font-bold text-gray-700 -rotate-90">USB</span>
      </div>

      {/* DC Barrel Jack */}
      <div className="absolute -left-3 bottom-5 w-14 h-12 bg-gray-900 rounded-sm border border-black shadow-md flex items-center justify-center">
        <span className="text-[9px] font-mono font-bold text-gray-400 -rotate-90">PWR</span>
      </div>

      {/* Center Branding & ATmega328P Chip */}
      <div className="absolute left-24 top-16 right-20 flex flex-col items-center pointer-events-none">
        <div className="flex items-center gap-1 text-white font-extrabold tracking-wider text-xs">
          <span>ARDUINO</span>
          <span className="text-[10px] px-1 bg-white text-[#00838F] rounded">UNO</span>
        </div>
        
        {/* ATmega328P DIP-28 socket and IC */}
        <div className="mt-4 w-32 h-9 bg-gray-950 rounded-sm border border-gray-700 shadow-inner flex items-center justify-between px-2">
          <div className="w-1.5 h-3 bg-gray-600 rounded-r-full" />
          <span className="text-[9px] font-mono text-gray-300 tracking-widest font-semibold">
            ATMEGA328P-PU
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
        </div>
      </div>

      {/* TOP DIGITAL PIN HEADER ROW */}
      <div className="absolute top-1 right-3 flex items-center gap-1 bg-gray-950 px-2 py-1 rounded-b shadow-md">
        {topPins.map((pin) => {
          const isWiring = activeWiringPin === pin.id;
          return (
            <button
              key={pin.id}
              onClick={(e) => {
                e.stopPropagation();
                onPinClick(pin.id);
              }}
              className={`group flex flex-col items-center justify-center w-4 h-6 transition ${
                isWiring ? 'scale-125' : ''
              }`}
              title={`Digital Pin: ${pin.label}`}
            >
              <div
                className={`w-3 h-3 rounded-full border transition ${
                  isWiring
                    ? 'bg-blueprint-teal border-white animate-ping'
                    : 'bg-amber-400 border-amber-600 group-hover:bg-amber-200'
                }`}
              />
              <span className="text-[8px] font-mono text-white/80 group-hover:text-amber-300 mt-0.5">
                {pin.label.replace('~', '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* BOTTOM POWER HEADER ROW */}
      <div className="absolute bottom-1 left-16 flex items-center gap-1 bg-gray-950 px-2 py-1 rounded-t shadow-md">
        {bottomPowerPins.map((pin) => {
          const isWiring = activeWiringPin === pin.id;
          return (
            <button
              key={pin.id}
              onClick={(e) => {
                e.stopPropagation();
                onPinClick(pin.id);
              }}
              className={`group flex flex-col-reverse items-center justify-center w-4 h-6 transition ${
                isWiring ? 'scale-125' : ''
              }`}
              title={`Power Pin: ${pin.label}`}
            >
              <div
                className={`w-3 h-3 rounded-full border transition ${
                  isWiring
                    ? 'bg-blueprint-teal border-white animate-ping'
                    : 'bg-amber-400 border-amber-600 group-hover:bg-amber-200'
                }`}
              />
              <span className="text-[7px] font-mono text-white/80 group-hover:text-amber-300 mb-0.5">
                {pin.label}
              </span>
            </button>
          );
        })}
      </div>

      {/* BOTTOM ANALOG HEADER ROW */}
      <div className="absolute bottom-1 right-3 flex items-center gap-1.5 bg-gray-950 px-2 py-1 rounded-t shadow-md">
        {bottomAnalogPins.map((pin) => {
          const isWiring = activeWiringPin === pin.id;
          return (
            <button
              key={pin.id}
              onClick={(e) => {
                e.stopPropagation();
                onPinClick(pin.id);
              }}
              className={`group flex flex-col-reverse items-center justify-center w-4 h-6 transition ${
                isWiring ? 'scale-125' : ''
              }`}
              title={`Analog Pin: ${pin.label}`}
            >
              <div
                className={`w-3 h-3 rounded-full border transition ${
                  isWiring
                    ? 'bg-blueprint-teal border-white animate-ping'
                    : 'bg-cyan-400 border-cyan-600 group-hover:bg-cyan-200'
                }`}
              />
              <span className="text-[8px] font-mono text-white/80 group-hover:text-cyan-300 mb-0.5">
                {pin.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
