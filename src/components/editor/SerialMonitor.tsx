import React, { useState, useRef, useEffect } from 'react';
import { Terminal, Send, Trash2, ArrowDown, Settings } from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';

export const SerialMonitor: React.FC = () => {
  const {
    serialLogs,
    sendSerialInput,
    clearSerialLogs,
    serialBaudRate,
    setSerialBaudRate
  } = useSimulatorStore();

  const [inputVal, setInputVal] = useState('');
  const [autoscroll, setAutoscroll] = useState(true);
  const [showTimestamps, setShowTimestamps] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  const baudRates = [300, 1200, 2400, 4800, 9600, 19200, 38400, 57600, 115200];

  useEffect(() => {
    if (autoscroll && scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  }, [serialLogs, autoscroll]);

  const handleSend = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    if (!inputVal) return;
    sendSerialInput(inputVal);
    setInputVal('');
  };

  return (
    <div className="flex flex-col h-full bg-[#1E1E1E] rounded-2xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-xl overflow-hidden select-none font-mono text-xs text-gray-200">
      {/* Top Header */}
      <div className="h-11 px-3 bg-[#252526] border-b border-[#333333] flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Terminal className="w-4 h-4 text-blueprint-teal" />
          <span className="font-bold text-gray-200">Serial Monitor</span>
        </div>

        {/* Baud Rate & Controls */}
        <div className="flex items-center gap-2">
          <select
            value={serialBaudRate}
            onChange={(e) => setSerialBaudRate(parseInt(e.target.value))}
            className="px-2 py-1 bg-[#1E1E1E] text-gray-300 border border-gray-700 rounded-lg text-[11px] focus:outline-none focus:border-blueprint-teal"
          >
            {baudRates.map((b) => (
              <option key={b} value={b}>
                {b} baud
              </option>
            ))}
          </select>

          <button
            onClick={() => setAutoscroll(!autoscroll)}
            className={`p-1.5 rounded-lg border transition ${
              autoscroll
                ? 'bg-blueprint-teal/20 text-blueprint-teal border-blueprint-teal/40'
                : 'text-gray-400 border-transparent hover:text-white'
            }`}
            title="Toggle Autoscroll"
          >
            <ArrowDown className="w-3.5 h-3.5" />
          </button>

          <button
            onClick={clearSerialLogs}
            className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition"
            title="Clear Console Output"
          >
            <Trash2 className="w-3.5 h-3.5" />
          </button>
        </div>
      </div>

      {/* Terminal Output Log Area */}
      <div
        ref={scrollRef}
        className="flex-1 p-3 overflow-y-auto space-y-0.5 text-emerald-400 text-xs font-mono leading-relaxed"
      >
        {serialLogs.length === 0 ? (
          <div className="text-gray-500 italic py-4 text-center">
            No serial output yet. Start simulation with Serial.print() statements.
          </div>
        ) : (
          serialLogs.map((log, idx) => (
            <div key={idx} className="whitespace-pre-wrap break-all">
              {showTimestamps && (
                <span className="text-gray-500 text-[10px] mr-2">[{idx * 100}ms]</span>
              )}
              <span>{log}</span>
            </div>
          ))
        )}
      </div>

      {/* Bottom Send Input Form */}
      <form
        onSubmit={handleSend}
        className="p-2 bg-[#252526] border-t border-[#333333] flex items-center gap-2"
      >
        <input
          type="text"
          value={inputVal}
          onChange={(e) => setInputVal(e.target.value)}
          placeholder="Send command to Uno (e.g. '1', 'HELLO')..."
          className="flex-1 px-3 py-1.5 bg-[#1E1E1E] text-white border border-gray-700 rounded-xl text-xs focus:outline-none focus:border-blueprint-teal"
        />
        <button
          type="submit"
          className="flex items-center gap-1 px-3 py-1.5 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white font-bold transition shadow-xs"
        >
          <Send className="w-3.5 h-3.5" />
          <span>Send</span>
        </button>
      </form>
    </div>
  );
};
