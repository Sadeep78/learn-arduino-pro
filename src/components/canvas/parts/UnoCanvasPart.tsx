import React from 'react';
import { CircuitComponent } from '../../../types/simulator';
import { useSimulatorStore } from '../../../store/useSimulatorStore';

export const UNO_WIDTH = 380;
export const UNO_HEIGHT = 230;

export const getUnoPinAnchor = (pinId: string): { x: number; y: number } => {
  const norm = pinId.toLowerCase().trim();
  const cleanNorm = norm.startsWith('d')
    ? norm
    : ['13', '12', '11', '10', '9', '8', '7', '6', '5', '4', '3', '2', '1', '0'].includes(norm)
    ? `d${norm}`
    : norm;

  // Top digital pins: AREF, GND3, D13 ... D0
  const topPins = ['aref', 'gnd3', 'd13', 'd12', 'd11', 'd10', 'd9', 'd8', 'd7', 'd6', 'd5', 'd4', 'd3', 'd2', 'd1', 'd0'];
  const topIdx = topPins.indexOf(cleanNorm);
  if (topIdx !== -1) {
    const rightMostCenter = UNO_WIDTH - 16 - 10; // 354
    return { x: rightMostCenter - (15 - topIdx) * 19, y: 12 };
  }

  // Bottom power pins: IOREF, RESET, 3V3, 5V, GND1, GND2, VIN
  const pwrPins = ['ioref', 'reset', '3v3', '5v', 'gnd1', 'gnd2', 'vin'];
  const pIdx = pwrPins.indexOf(norm === 'gnd' ? 'gnd1' : norm);
  if (pIdx !== -1) {
    return { x: 76 + 10 + pIdx * 21, y: UNO_HEIGHT - 12 };
  }

  // Bottom analog pins: A0 ... A5
  const aPins = ['a0', 'a1', 'a2', 'a3', 'a4', 'a5'];
  const aIdx = aPins.indexOf(norm);
  if (aIdx !== -1) {
    const rightMostCenter = UNO_WIDTH - 16 - 11;
    return { x: rightMostCenter - (5 - aIdx) * 21, y: UNO_HEIGHT - 12 };
  }

  return { x: UNO_WIDTH / 2, y: UNO_HEIGHT / 2 };
};

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
  const { pinStates, isRunning } = useSimulatorStore();
  const isPin13High =
    isRunning &&
    (pinStates[13]?.digitalValue === 1 ||
      pinStates[13]?.analogValue > 0 ||
      pinStates[13]?.voltage >= 2.5);

  const topPins = [
    { id: 'aref', label: 'AREF', name: 'AREF (Analog Reference)' },
    { id: 'gnd3', label: 'GND', name: 'Ground (Digital)' },
    { id: 'd13', label: '13', name: 'Digital Pin 13 (Built-in LED L)' },
    { id: 'd12', label: '12', name: 'Digital Pin 12' },
    { id: 'd11', label: '~11', name: 'Digital Pin 11 (PWM)' },
    { id: 'd10', label: '~10', name: 'Digital Pin 10 (PWM)' },
    { id: 'd9', label: '~9', name: 'Digital Pin 9 (PWM)' },
    { id: 'd8', label: '8', name: 'Digital Pin 8' },
    { id: 'd7', label: '7', name: 'Digital Pin 7' },
    { id: 'd6', label: '~6', name: 'Digital Pin 6 (PWM)' },
    { id: 'd5', label: '~5', name: 'Digital Pin 5 (PWM)' },
    { id: 'd4', label: '4', name: 'Digital Pin 4' },
    { id: 'd3', label: '~3', name: 'Digital Pin 3 (PWM / INT1)' },
    { id: 'd2', label: '2', name: 'Digital Pin 2 (INT0)' },
    { id: 'd1', label: 'TX·1', name: 'Digital Pin 1 (UART TX)' },
    { id: 'd0', label: 'RX·0', name: 'Digital Pin 0 (UART RX)' }
  ];

  const bottomPowerPins = [
    { id: 'ioref', label: 'IOREF', name: 'IOREF (5V/3.3V Reference)' },
    { id: 'reset', label: 'RESET', name: 'RESET (Active LOW)' },
    { id: '3v3', label: '3.3V', name: '3.3V Power Out (50mA)' },
    { id: '5v', label: '5V', name: '5V Power Supply / USB 5V' },
    { id: 'gnd1', label: 'GND', name: 'Ground (Power GND 1)' },
    { id: 'gnd2', label: 'GND', name: 'Ground (Power GND 2)' },
    { id: 'vin', label: 'VIN', name: 'VIN (Raw 7-12V Power Input)' }
  ];

  const bottomAnalogPins = [
    { id: 'a0', label: 'A0', name: 'Analog Input A0 (0-5V ADC)' },
    { id: 'a1', label: 'A1', name: 'Analog Input A1 (0-5V ADC)' },
    { id: 'a2', label: 'A2', name: 'Analog Input A2 (0-5V ADC)' },
    { id: 'a3', label: 'A3', name: 'Analog Input A3 (0-5V ADC)' },
    { id: 'a4', label: 'A4', name: 'Analog Input A4 (SDA for I2C)' },
    { id: 'a5', label: 'A5', name: 'Analog Input A5 (SCL for I2C)' }
  ];

  return (
    <div
      className={`relative rounded-2xl bg-[#005C8A] dark:bg-[#004A70] border-2 shadow-2xl transition-all select-none p-3 ${
        isSelected
          ? 'border-blueprint-teal shadow-teal-glow ring-2 ring-blueprint-teal/40'
          : 'border-[#003B59]'
      }`}
      style={{
        width: `${UNO_WIDTH}px`,
        height: `${UNO_HEIGHT}px`,
        transform: `rotate(${component.rotation}deg)`
      }}
    >
      {/* Silkscreen board lines and border */}
      <div className="absolute inset-2 border border-white/25 rounded-xl pointer-events-none" />

      {/* USB Port (Metal Type-B box on left) */}
      <div className="absolute -left-3 top-5 w-12 h-14 bg-gradient-to-r from-gray-400 via-gray-300 to-gray-400 rounded-sm border border-gray-600 shadow-md flex items-center justify-center pointer-events-none">
        <span className="text-[9px] font-mono font-bold text-gray-700 -rotate-90 tracking-widest">
          USB
        </span>
      </div>

      {/* DC Barrel Jack (Moved to middle-left so it NEVER covers bottom headers) */}
      <div className="absolute -left-3 top-[120px] w-12 h-11 bg-gray-950 rounded-sm border border-black shadow-md flex items-center justify-center pointer-events-none z-10">
        <div className="w-4 h-4 rounded-full bg-gray-800 border border-gray-700 flex items-center justify-center">
          <div className="w-1.5 h-1.5 rounded-full bg-black" />
        </div>
        <span className="absolute -right-7 text-[8px] font-mono font-bold text-white/50">PWR</span>
      </div>

      {/* Center Branding & ATmega328P Chip */}
      <div className="absolute left-20 top-16 right-20 flex flex-col items-center pointer-events-none">
        <div className="flex items-center gap-1.5">
          <div className="w-5 h-5 rounded-full bg-[#00979D] flex items-center justify-center text-white text-[10px] font-black shadow-xs">
            ∞
          </div>
          <span className="text-white font-black tracking-widest text-xs font-sans">
            ARDUINO
          </span>
          <span className="text-[10px] font-black px-1.5 py-0.5 bg-white text-[#005C8A] rounded shadow-xs">
            UNO
          </span>
        </div>

        {/* ATmega328P DIP-28 socket and IC */}
        <div className="mt-3.5 w-36 h-9 bg-gray-950 rounded border border-gray-800 shadow-inner flex items-center justify-between px-2.5">
          <div className="w-1.5 h-3 bg-gray-700 rounded-r-full" />
          <span className="text-[9px] font-mono text-gray-300 tracking-widest font-bold">
            ATMEGA328P-PU
          </span>
          <div className="w-1.5 h-1.5 rounded-full bg-gray-700" />
        </div>
      </div>

      {/* Onboard LEDs: L (Pin 13) and ON (Power 5V) */}
      <div className="absolute top-12 left-16 flex flex-col gap-2 pointer-events-none">
        <div className="flex items-center gap-1.5">
          <div
            className={`w-2.5 h-2.5 rounded-xs border transition-all ${
              isPin13High
                ? 'bg-amber-300 border-amber-100 shadow-[0_0_10px_#f59e0b]'
                : 'bg-amber-950/80 border-amber-900/60'
            }`}
          />
          <span className="text-[9px] font-mono font-bold text-amber-200">L</span>
        </div>

        <div className="flex items-center gap-1.5">
          <div
            className={`w-2.5 h-2.5 rounded-xs border transition-all ${
              isRunning
                ? 'bg-emerald-400 border-emerald-200 shadow-[0_0_10px_#10b981]'
                : 'bg-emerald-950/80 border-emerald-900/60'
            }`}
          />
          <span className="text-[9px] font-mono font-bold text-emerald-200">ON</span>
        </div>
      </div>

      {/* TOP DIGITAL PIN HEADER ROW (16 pins) */}
      <div className="absolute top-1 right-4 flex items-start bg-gray-950 px-1 py-1 rounded-b-md shadow-lg border-b border-x border-gray-800">
        {topPins.map((pin) => {
          const isWiring = activeWiringPin === pin.id;
          return (
            <button
              key={pin.id}
              onClick={(e) => {
                e.stopPropagation();
                onPinClick(pin.id);
              }}
              className={`group flex flex-col items-center justify-between w-[19px] h-9 p-0.5 hover:bg-white/10 rounded transition ${
                isWiring ? 'scale-115' : ''
              }`}
              title={pin.name}
              aria-label={pin.name}
            >
              {/* Clickable Pad with Center Hole */}
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                  isWiring
                    ? 'bg-blueprint-teal border-white ring-2 ring-cyan-300 animate-ping'
                    : 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-amber-700 group-hover:scale-125 shadow-xs'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-950" />
              </div>
              {/* Crisp bold silkscreen label */}
              <span className="text-[9px] font-mono font-bold text-white/95 group-hover:text-amber-300 leading-tight">
                {pin.label.replace('~', '')}
              </span>
            </button>
          );
        })}
      </div>

      {/* BOTTOM POWER HEADER ROW (7 pins: IOREF, RESET, 3.3V, 5V, GND, GND, VIN) */}
      <div className="absolute bottom-1 left-[76px] flex items-end bg-gray-950 px-1.5 py-1 rounded-t-md shadow-lg border-t border-x border-gray-800">
        {bottomPowerPins.map((pin) => {
          const isWiring = activeWiringPin === pin.id;
          return (
            <button
              key={pin.id}
              onClick={(e) => {
                e.stopPropagation();
                onPinClick(pin.id);
              }}
              className={`group flex flex-col-reverse items-center justify-between w-[21px] h-10 p-0.5 hover:bg-white/10 rounded transition relative ${
                isWiring ? 'scale-115' : ''
              }`}
              title={pin.name}
              aria-label={pin.name}
            >
              {/* Clickable Pad with Center Hole */}
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                  isWiring
                    ? 'bg-blueprint-teal border-white ring-2 ring-cyan-300 animate-ping'
                    : 'bg-gradient-to-br from-amber-300 via-amber-400 to-amber-600 border-amber-700 group-hover:scale-125 shadow-xs'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-950" />
              </div>
              {/* Tilted bold non-overlapping label */}
              <div className="h-5 flex items-center justify-center">
                <span className="text-[8.5px] font-mono font-bold text-amber-200/95 group-hover:text-white -rotate-45 origin-bottom-left whitespace-nowrap block leading-none">
                  {pin.label}
                </span>
              </div>
            </button>
          );
        })}
      </div>

      {/* BOTTOM ANALOG HEADER ROW (6 pins: A0 - A5) */}
      <div className="absolute bottom-1 right-4 flex items-end bg-gray-950 px-1.5 py-1 rounded-t-md shadow-lg border-t border-x border-gray-800">
        {bottomAnalogPins.map((pin) => {
          const isWiring = activeWiringPin === pin.id;
          return (
            <button
              key={pin.id}
              onClick={(e) => {
                e.stopPropagation();
                onPinClick(pin.id);
              }}
              className={`group flex flex-col-reverse items-center justify-between w-[21px] h-9 p-0.5 hover:bg-white/10 rounded transition ${
                isWiring ? 'scale-115' : ''
              }`}
              title={pin.name}
              aria-label={pin.name}
            >
              {/* Clickable Pad with Center Hole */}
              <div
                className={`w-3.5 h-3.5 rounded-full border flex items-center justify-center transition-all ${
                  isWiring
                    ? 'bg-blueprint-teal border-white ring-2 ring-cyan-300 animate-ping'
                    : 'bg-gradient-to-br from-cyan-300 via-cyan-400 to-cyan-600 border-cyan-700 group-hover:scale-125 shadow-xs'
                }`}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-gray-950" />
              </div>
              {/* Crisp bold analog label */}
              <span className="text-[10px] font-mono font-bold text-cyan-200 group-hover:text-white mb-0.5 leading-tight">
                {pin.label}
              </span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
