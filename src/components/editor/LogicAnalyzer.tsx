import React, { useEffect, useState } from 'react';
import { Waves, Play, Square } from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';

export const LogicAnalyzer: React.FC = () => {
  const { pinStates, isRunning } = useSimulatorStore();

  // Track recent history of selected digital channels
  const channels = [
    { pin: 13, name: 'D13 (LED)' },
    { pin: 11, name: 'D11 (MOSI/~)' },
    { pin: 9, name: 'D9 (~PWM)' },
    { pin: 8, name: 'D8 (IO)' },
    { pin: 2, name: 'D2 (INT0)' }
  ];

  const [history, setHistory] = useState<Record<number, number[]>>({
    13: Array(30).fill(0),
    11: Array(30).fill(0),
    9: Array(30).fill(0),
    8: Array(30).fill(0),
    2: Array(30).fill(1)
  });

  useEffect(() => {
    if (!isRunning) return;

    const interval = setInterval(() => {
      setHistory((prev) => {
        const next: Record<number, number[]> = {};
        channels.forEach((ch) => {
          const currentVal = pinStates[ch.pin]?.digitalValue ?? 0;
          next[ch.pin] = [...prev[ch.pin].slice(-35), currentVal];
        });
        return next;
      });
    }, 150);

    return () => clearInterval(interval);
  }, [isRunning, pinStates]);

  return (
    <div className="flex flex-col h-full bg-[#1E1E1E] rounded-2xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-xl overflow-hidden select-none font-mono text-xs">
      <div className="h-11 px-3 bg-[#252526] border-b border-[#333333] flex items-center justify-between text-gray-200">
        <div className="flex items-center gap-2">
          <Waves className="w-4 h-4 text-cyan-400" />
          <span className="font-bold">Logic Analyzer (Waveform Oscilloscope)</span>
        </div>
        <span className="text-[10px] px-2 py-0.5 rounded bg-cyan-950 text-cyan-400 border border-cyan-800">
          5-Channel Logic
        </span>
      </div>

      <div className="flex-1 p-3 space-y-3 overflow-y-auto">
        {channels.map((ch) => {
          const waveform = history[ch.pin] || [];
          const currentVal = pinStates[ch.pin]?.digitalValue ?? 0;
          const voltage = (pinStates[ch.pin]?.voltage ?? 0).toFixed(1);

          return (
            <div key={ch.pin} className="space-y-1">
              <div className="flex items-center justify-between text-[11px] text-gray-300">
                <span className="font-bold">{ch.name}</span>
                <span className={`px-1.5 py-0.2 rounded font-bold ${currentVal ? 'bg-emerald-950 text-emerald-400' : 'bg-gray-800 text-gray-400'}`}>
                  {currentVal ? 'HIGH (5V)' : 'LOW (0V)'}
                </span>
              </div>

              {/* Digital Waveform Square Track */}
              <div className="h-9 w-full bg-[#141414] rounded-lg border border-gray-800 flex items-center px-1 overflow-hidden relative">
                <svg className="w-full h-7 overflow-visible">
                  <polyline
                    fill="none"
                    stroke="#00F5D4"
                    strokeWidth="2.5"
                    strokeLinejoin="miter"
                    points={waveform
                      .map((val, idx) => {
                        const x = (idx / Math.max(waveform.length - 1, 1)) * 360;
                        const y = val === 1 ? 4 : 22;
                        return `${x},${y}`;
                      })
                      .join(' ')}
                  />
                </svg>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
