import React, { useState } from 'react';
import {
  Cpu,
  Layers,
  Sun,
  Sparkles,
  Sliders,
  Square,
  Volume2,
  RotateCw,
  Eye,
  Radio,
  Tv,
  Hash,
  Search,
  Plus,
  X
} from 'lucide-react';
import { ComponentType } from '../../types/simulator';
import { useSimulatorStore } from '../../store/useSimulatorStore';

interface PaletteItem {
  type: ComponentType;
  label: string;
  category: string;
  icon: React.ElementType;
}

interface ComponentPaletteProps {
  isOpen?: boolean;
  onClose?: () => void;
  className?: string;
}

export const ComponentPalette: React.FC<ComponentPaletteProps> = ({
  isOpen = true,
  onClose,
  className = ''
}) => {
  const { addComponent } = useSimulatorStore();
  const [search, setSearch] = useState('');

  if (!isOpen) return null;

  const items: PaletteItem[] = [
    { type: 'arduino_uno', label: 'Arduino Uno R3', category: 'Boards', icon: Cpu },
    { type: 'breadboard', label: 'Half Breadboard', category: 'Prototyping', icon: Layers },
    { type: 'led', label: '5mm LED', category: 'Outputs', icon: Sun },
    { type: 'rgb_led', label: 'RGB LED', category: 'Outputs', icon: Sparkles },
    { type: 'resistor', label: 'Resistor', category: 'Passives', icon: Sliders },
    { type: 'button', label: 'Push Button', category: 'Inputs', icon: Square },
    { type: 'potentiometer', label: 'Potentiometer', category: 'Inputs', icon: Sliders },
    { type: 'buzzer', label: 'Piezo Buzzer', category: 'Audio', icon: Volume2 },
    { type: 'servo', label: 'Micro Servo', category: 'Actuators', icon: RotateCw },
    { type: 'ldr', label: 'Photoresistor (LDR)', category: 'Sensors', icon: Eye },
    { type: 'ultrasonic', label: 'HC-SR04 Ultrasonic', category: 'Sensors', icon: Radio },
    { type: 'lcd1602', label: '16x2 LCD (I2C)', category: 'Displays', icon: Tv },
    { type: 'seven_segment', label: '7-Segment LED', category: 'Displays', icon: Hash },
  ];

  const filtered = items.filter(
    (item) =>
      item.label.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase())
  );

  const handleAdd = (type: ComponentType) => {
    // Add to reasonable default spot on canvas
    addComponent(type, 300 + Math.random() * 100, 200 + Math.random() * 100);
  };

  return (
    <div
      className={`w-60 flex flex-col bg-white/95 dark:bg-blueprint-nightCard/95 backdrop-blur-md border-r border-blueprint-creamBorder dark:border-blueprint-nightBorder p-3 select-none z-30 shadow-md ${className}`}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-1.5">
          <span className="text-xs font-mono font-bold text-blueprint-teal uppercase tracking-wider">
            COMPONENTS
          </span>
          <span className="text-[10px] font-mono text-gray-400">
            ({filtered.length})
          </span>
        </div>

        {onClose && (
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-gray-400 hover:text-blueprint-navy dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/5 transition"
            title="Collapse Component Palette"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>

      {/* Search Input */}
      <div className="relative mb-3">
        <Search className="w-3.5 h-3.5 absolute left-2.5 top-2.5 text-gray-400" />
        <input
          type="text"
          placeholder="Filter parts..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-8 pr-2 py-1.5 text-xs rounded-xl bg-white dark:bg-blueprint-nightBg border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-gray-200 placeholder:text-gray-400 focus:outline-none focus:border-blueprint-teal font-mono"
        />
      </div>

      {/* Component Cards List */}
      <div className="flex-1 overflow-y-auto space-y-1.5 pr-1">
        {filtered.length === 0 ? (
          <div className="p-4 text-center text-gray-400">
            <p className="text-xs font-mono">No parts found</p>
            <button
              onClick={() => setSearch('')}
              className="mt-2 text-[10px] font-mono text-blueprint-teal hover:underline"
            >
              Clear search
            </button>
          </div>
        ) : (
          filtered.map((item) => {
            const Icon = item.icon;
            return (
              <button
                key={item.type}
                onClick={() => handleAdd(item.type)}
                className="w-full flex items-center justify-between p-2 rounded-xl bg-white/70 dark:bg-blueprint-nightBg/70 border border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:border-blueprint-teal hover:bg-white dark:hover:bg-blueprint-nightBg transition group text-left"
                title={`Click to place ${item.label} on canvas`}
              >
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-blueprint-tealLight dark:bg-blueprint-teal/15 flex items-center justify-center text-blueprint-teal flex-shrink-0 group-hover:scale-110 transition">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex flex-col truncate">
                    <span className="text-xs font-bold text-blueprint-navy dark:text-gray-200 truncate">
                      {item.label}
                    </span>
                    <span className="text-[9px] font-mono text-gray-400">
                      {item.category}
                    </span>
                  </div>
                </div>

                <Plus className="w-3.5 h-3.5 text-gray-400 group-hover:text-blueprint-teal flex-shrink-0" />
              </button>
            );
          })
        )}
      </div>
    </div>
  );
};
