import React, { useState } from 'react';
import {
  Code2,
  Terminal,
  Activity,
  Waves,
  Cpu,
  Layers,
  Sparkles
} from 'lucide-react';
import { CircuitCanvas } from '../components/canvas/CircuitCanvas';
import { ComponentPalette } from '../components/canvas/ComponentPalette';
import { CodeEditor } from '../components/editor/CodeEditor';
import { SerialMonitor } from '../components/editor/SerialMonitor';
import { SerialPlotter } from '../components/editor/SerialPlotter';
import { LogicAnalyzer } from '../components/editor/LogicAnalyzer';
import { RegisterInspector } from '../components/editor/RegisterInspector';

type ToolTab = 'code' | 'serial' | 'plotter' | 'logic' | 'registers';

export const SimulatorView: React.FC = () => {
  const [activeTab, setActiveTab] = useState<ToolTab>('code');

  const toolTabs: { id: ToolTab; label: string; icon: React.ElementType }[] = [
    { id: 'code', label: 'Code Editor', icon: Code2 },
    { id: 'serial', label: 'Serial Monitor', icon: Terminal },
    { id: 'plotter', label: 'Serial Plotter', icon: Activity },
    { id: 'logic', label: 'Logic Analyzer', icon: Waves },
    { id: 'registers', label: 'Registers', icon: Cpu },
  ];

  return (
    <div className="space-y-4">
      {/* Top Split View: Palette + Canvas */}
      <div className="flex flex-col lg:flex-row rounded-2xl overflow-hidden border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint bg-white/70 dark:bg-blueprint-nightCard/70 backdrop-blur-md">
        {/* Component Palette Sidebar */}
        <ComponentPalette />

        {/* Drag & Drop Circuit Canvas */}
        <div className="flex-1 min-w-0">
          <CircuitCanvas />
        </div>
      </div>

      {/* Bottom Tools & Editor Dock */}
      <div className="rounded-2xl overflow-hidden border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint bg-white/80 dark:bg-blueprint-nightCard/80 backdrop-blur-md">
        {/* Dock Tab Selector */}
        <div className="flex items-center justify-between px-3 pt-2 border-b border-blueprint-creamBorder dark:border-blueprint-nightBorder bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60">
          <div className="flex items-center gap-1 overflow-x-auto">
            {toolTabs.map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex items-center gap-1.5 px-3 py-2 text-xs font-mono font-bold rounded-t-xl border-b-2 transition ${
                    isActive
                      ? 'border-blueprint-teal text-blueprint-teal bg-[#1E1E1E] text-white shadow-xs'
                      : 'border-transparent text-gray-500 hover:text-blueprint-navy dark:hover:text-gray-200'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>

          <span className="text-[10px] font-mono text-gray-400 hidden sm:inline">
            AVR8js ATmega328P Engine
          </span>
        </div>

        {/* Tab View Container */}
        <div className="h-[360px] sm:h-[420px] bg-[#1E1E1E]">
          {activeTab === 'code' && <CodeEditor />}
          {activeTab === 'serial' && <SerialMonitor />}
          {activeTab === 'plotter' && <SerialPlotter />}
          {activeTab === 'logic' && <LogicAnalyzer />}
          {activeTab === 'registers' && <RegisterInspector />}
        </div>
      </div>
    </div>
  );
};
