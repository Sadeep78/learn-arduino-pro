import React from 'react';
import { Cpu, Play, FastForward, Square, Gauge } from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';

export const RegisterInspector: React.FC = () => {
  const {
    pinStates,
    isRunning,
    isSlowMo,
    stepSimulation,
    toggleSlowMo
  } = useSimulatorStore();

  // Compute Port B (pins 8-13), Port C (A0-A5), Port D (0-7) bit registers
  let portB = 0;
  for (let i = 0; i < 6; i++) {
    if (pinStates[8 + i]?.digitalValue === 1) portB |= 1 << i;
  }

  let portD = 0;
  for (let i = 0; i < 8; i++) {
    if (pinStates[i]?.digitalValue === 1) portD |= 1 << i;
  }

  const registers = [
    { name: 'PORTB (Pins 8-13)', val: portB, binary: portB.toString(2).padStart(8, '0') },
    { name: 'PORTD (Pins 0-7)', val: portD, binary: portD.toString(2).padStart(8, '0') },
    { name: 'TCCR0A (Timer 0)', val: 0x03, binary: '00000011' },
    { name: 'TCCR1B (Timer 1)', val: 0x01, binary: '00000001' },
    { name: 'ADCSRA (ADC Control)', val: 0x87, binary: '10000111' },
    { name: 'ADMUX (Multiplexer)', val: 0x40, binary: '01000000' },
  ];

  return (
    <div className="flex flex-col h-full bg-[#1E1E1E] rounded-2xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-xl overflow-hidden select-none font-mono text-xs">
      <div className="h-11 px-3 bg-[#252526] border-b border-[#333333] flex items-center justify-between text-gray-200">
        <div className="flex items-center gap-2">
          <Cpu className="w-4 h-4 text-blueprint-teal" />
          <span className="font-bold">AVR Register & Pin Inspector</span>
        </div>

        {/* Step-by-Step Single Step Button */}
        <div className="flex items-center gap-1.5">
          <button
            onClick={stepSimulation}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-blueprint-creamDark dark:bg-blueprint-nightBg text-gray-200 border border-gray-700 hover:border-blueprint-teal transition text-[11px]"
            title="Single instruction clock step"
          >
            <FastForward className="w-3.5 h-3.5 text-blueprint-teal" />
            <span>Step</span>
          </button>

          <button
            onClick={toggleSlowMo}
            className={`px-2 py-1 rounded-lg border text-[11px] ${
              isSlowMo
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold'
                : 'text-gray-400 border-gray-700 hover:text-white'
            }`}
          >
            Slow-Mo
          </button>
        </div>
      </div>

      <div className="flex-1 p-3 overflow-y-auto space-y-3">
        {/* Register Table */}
        <div className="divide-y divide-gray-800 rounded-xl border border-gray-800 bg-[#141414] overflow-hidden">
          {registers.map((reg) => (
            <div key={reg.name} className="flex items-center justify-between p-2">
              <span className="text-gray-400 font-bold">{reg.name}</span>
              <div className="flex items-center gap-3">
                <span className="font-mono text-cyan-400">{reg.binary}</span>
                <span className="text-gray-300 font-mono">0x{reg.val.toString(16).toUpperCase().padStart(2, '0')}</span>
              </div>
            </div>
          ))}
        </div>

        {/* Live Pin Voltages Quick Matrix */}
        <div>
          <span className="text-[10px] text-gray-400 uppercase font-bold block mb-1.5">
            GPIO VOLTAGE MATRIX (0 - 5.0V)
          </span>
          <div className="grid grid-cols-4 sm:grid-cols-7 gap-1.5">
            {Array.from({ length: 14 }).map((_, pin) => {
              const p = pinStates[pin];
              const high = p?.digitalValue === 1;
              return (
                <div
                  key={pin}
                  className={`p-1.5 rounded-lg border flex flex-col items-center justify-center ${
                    high
                      ? 'bg-emerald-950/60 border-emerald-500/60 text-emerald-300'
                      : 'bg-gray-900 border-gray-800 text-gray-500'
                  }`}
                >
                  <span className="text-[8px] font-bold">D{pin}</span>
                  <span className="text-[10px] font-mono font-black mt-0.5">
                    {high ? '5.0V' : '0.0V'}
                  </span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
};
