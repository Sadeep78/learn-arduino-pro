import React from 'react';
import { CircuitComponent } from '../../../types/simulator';

interface BreadboardPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
}

export const BreadboardCanvasPart: React.FC<BreadboardPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin
}) => {
  // 30 columns
  const cols = Array.from({ length: 30 }, (_, i) => i + 1);

  return (
    <div
      className={`relative w-[480px] h-[220px] rounded-xl bg-[#F8F9FA] dark:bg-[#1E293B] border-2 shadow-xl p-3 select-none ${
        isSelected ? 'border-blueprint-teal shadow-teal-glow' : 'border-gray-300 dark:border-gray-700'
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* Top Power Rails (+ Red, - Blue) */}
      <div className="flex items-center justify-between px-2 mb-2 pb-1 border-b border-gray-200 dark:border-gray-700">
        <span className="text-[9px] font-mono font-bold text-red-500">+</span>
        <div className="flex items-center gap-2">
          {cols.filter((c) => c % 3 === 1).map((c) => (
            <button
              key={`top-vcc-${c}`}
              onClick={(e) => {
                e.stopPropagation();
                onPinClick(`top-vcc-${c}`);
              }}
              className="w-2.5 h-2.5 rounded-full bg-red-100 dark:bg-red-950 border border-red-500 hover:scale-125 transition"
              title={`Power Rail + (${c})`}
            />
          ))}
        </div>
        <span className="text-[9px] font-mono font-bold text-blue-500">-</span>
        <div className="flex items-center gap-2">
          {cols.filter((c) => c % 3 === 1).map((c) => (
            <button
              key={`top-gnd-${c}`}
              onClick={(e) => {
                e.stopPropagation();
                onPinClick(`top-gnd-${c}`);
              }}
              className="w-2.5 h-2.5 rounded-full bg-blue-100 dark:bg-blue-950 border border-blue-500 hover:scale-125 transition"
              title={`Ground Rail - (${c})`}
            />
          ))}
        </div>
      </div>

      {/* Rows a to e (Top half) */}
      <div className="flex flex-col gap-1 my-1">
        {['a', 'b', 'c', 'd', 'e'].map((row) => (
          <div key={row} className="flex items-center justify-between px-2">
            <span className="text-[8px] font-mono text-gray-400 w-2">{row}</span>
            <div className="flex items-center gap-2 flex-1 justify-around">
              {cols.map((col) => {
                const pinId = `${row}${col}`;
                const isWiring = activeWiringPin === pinId;
                return (
                  <button
                    key={pinId}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPinClick(pinId);
                    }}
                    className={`w-2 h-2 rounded-full transition ${
                      isWiring
                        ? 'bg-blueprint-teal scale-150 animate-ping'
                        : 'bg-gray-300 dark:bg-gray-700 hover:bg-blueprint-teal hover:scale-125'
                    }`}
                    title={`Tie Point: ${row.toUpperCase()}${col}`}
                  />
                );
              })}
            </div>
            <span className="text-[8px] font-mono text-gray-400 w-2 text-right">{row}</span>
          </div>
        ))}
      </div>

      {/* Center Divider Trench */}
      <div className="h-2 my-1 bg-gray-200 dark:bg-gray-800 rounded flex items-center justify-center">
        <span className="text-[7px] font-mono text-gray-400 tracking-widest uppercase">
          TIE POINTS 1 — 30
        </span>
      </div>

      {/* Rows f to j (Bottom half) */}
      <div className="flex flex-col gap-1 my-1">
        {['f', 'g', 'h', 'i', 'j'].map((row) => (
          <div key={row} className="flex items-center justify-between px-2">
            <span className="text-[8px] font-mono text-gray-400 w-2">{row}</span>
            <div className="flex items-center gap-2 flex-1 justify-around">
              {cols.map((col) => {
                const pinId = `${row}${col}`;
                const isWiring = activeWiringPin === pinId;
                return (
                  <button
                    key={pinId}
                    onClick={(e) => {
                      e.stopPropagation();
                      onPinClick(pinId);
                    }}
                    className={`w-2 h-2 rounded-full transition ${
                      isWiring
                        ? 'bg-blueprint-teal scale-150 animate-ping'
                        : 'bg-gray-300 dark:bg-gray-700 hover:bg-blueprint-teal hover:scale-125'
                    }`}
                    title={`Tie Point: ${row.toUpperCase()}${col}`}
                  />
                );
              })}
            </div>
            <span className="text-[8px] font-mono text-gray-400 w-2 text-right">{row}</span>
          </div>
        ))}
      </div>
    </div>
  );
};
