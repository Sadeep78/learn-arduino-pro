import React from 'react';
import { CircuitComponent } from '../../../types/simulator';

interface LcdPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
}

export const Lcd1602CanvasPart: React.FC<LcdPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin
}) => {
  const line1 = component.properties?.line1 || 'Arduino Pro v1.0';
  const line2 = component.properties?.line2 || '16x2 Character LCD';

  return (
    <div
      className={`relative w-64 h-32 rounded-xl bg-emerald-800 dark:bg-emerald-950 border-2 border-emerald-600 p-2 flex flex-col justify-between select-none shadow-xl ${
        isSelected ? 'border-blueprint-teal shadow-teal-glow ring-2 ring-blueprint-teal/40' : ''
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* 16x2 Blue Backlit Display Screen */}
      <div className="w-full h-20 bg-[#0047AB] rounded-md border border-cyan-300 p-2 font-mono text-cyan-200 text-xs shadow-inner flex flex-col justify-around leading-tight tracking-widest font-bold">
        <div className="truncate">{line1.padEnd(16, ' ')}</div>
        <div className="truncate">{line2.padEnd(16, ' ')}</div>
      </div>

      {/* 4 I2C Pins: GND, VCC, SDA, SCL */}
      <div className="flex items-center justify-around bg-gray-900 px-2 py-1 rounded">
        {[
          { id: 'gnd', label: 'GND', color: 'bg-gray-400' },
          { id: 'vcc', label: 'VCC', color: 'bg-red-500' },
          { id: 'sda', label: 'SDA', color: 'bg-purple-400' },
          { id: 'scl', label: 'SCL', color: 'bg-yellow-400' },
        ].map((pin) => (
          <button
            key={pin.id}
            onClick={(e) => {
              e.stopPropagation();
              onPinClick(pin.id);
            }}
            className="flex items-center gap-1"
            title={`I2C Pin: ${pin.label}`}
          >
            <div
              className={`w-2 h-2 rounded-full ${
                activeWiringPin === pin.id ? 'bg-blueprint-teal animate-ping' : pin.color
              }`}
            />
            <span className="text-[7px] font-mono text-gray-300">{pin.label}</span>
          </button>
        ))}
      </div>
    </div>
  );
};
