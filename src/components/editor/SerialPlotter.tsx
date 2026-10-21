import React, { useEffect, useRef } from 'react';
import { Activity, Trash2 } from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';

export const SerialPlotter: React.FC = () => {
  const { plotterValues, clearSerialLogs } = useSimulatorStore();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const width = canvas.width;
    const height = canvas.height;

    // Clear background
    ctx.fillStyle = '#1E1E1E';
    ctx.fillRect(0, 0, width, height);

    // Draw grid lines
    ctx.strokeStyle = '#2D3748';
    ctx.lineWidth = 1;

    for (let y = 20; y < height; y += 30) {
      ctx.beginPath();
      ctx.moveTo(0, y);
      ctx.lineTo(width, y);
      ctx.stroke();
    }

    if (plotterValues.length < 2) {
      ctx.fillStyle = '#718096';
      ctx.font = '12px "JetBrains Mono", monospace';
      ctx.fillText('Waiting for numeric data from Serial.println()...', 20, height / 2);
      return;
    }

    // Min and Max for auto-scaling
    let min = Math.min(...plotterValues);
    let max = Math.max(...plotterValues);
    if (min === max) {
      min -= 10;
      max += 10;
    }
    const range = max - min;

    // Draw Waveform Line
    ctx.strokeStyle = '#16B8B0';
    ctx.lineWidth = 2.5;
    ctx.lineJoin = 'round';
    ctx.beginPath();

    const step = width / Math.max(plotterValues.length - 1, 1);

    plotterValues.forEach((val, i) => {
      const x = i * step;
      const normalized = (val - min) / range;
      const y = height - (normalized * (height - 30) + 15);

      if (i === 0) {
        ctx.moveTo(x, y);
      } else {
        ctx.lineTo(x, y);
      }
    });

    ctx.stroke();

    // Draw min / max label indicators
    ctx.fillStyle = '#A0AEC0';
    ctx.font = '10px "JetBrains Mono", monospace';
    ctx.fillText(`Max: ${max.toFixed(1)}`, 8, 14);
    ctx.fillText(`Min: ${min.toFixed(1)}`, 8, height - 6);
  }, [plotterValues]);

  return (
    <div className="flex flex-col h-full bg-[#1E1E1E] rounded-2xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-xl overflow-hidden select-none font-mono text-xs">
      <div className="h-11 px-3 bg-[#252526] border-b border-[#333333] flex items-center justify-between text-gray-200">
        <div className="flex items-center gap-2">
          <Activity className="w-4 h-4 text-blueprint-teal" />
          <span className="font-bold">Serial Plotter</span>
          <span className="text-[10px] text-gray-400">({plotterValues.length} samples)</span>
        </div>

        <button
          onClick={clearSerialLogs}
          className="p-1.5 rounded-lg text-gray-400 hover:text-red-400 hover:bg-white/10 transition"
          title="Clear Plotter Waveform"
        >
          <Trash2 className="w-3.5 h-3.5" />
        </button>
      </div>

      <div className="flex-1 p-2">
        <canvas
          ref={canvasRef}
          width={600}
          height={260}
          className="w-full h-full rounded-xl bg-[#1E1E1E]"
        />
      </div>
    </div>
  );
};
