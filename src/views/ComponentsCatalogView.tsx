import React, { useState } from 'react';
import {
  Cpu,
  Search,
  Filter,
  Play,
  Copy,
  Check,
  Zap,
  Info,
  BookOpen,
  ArrowRight,
  Sun,
  Sparkles,
  Sliders,
  Square,
  Volume2,
  RotateCw,
  Radio,
  Eye,
  Tv
} from 'lucide-react';
import { COMPONENTS_CATALOG } from '../data/componentsCatalog';
import { ComponentCatalogItem } from '../types/component';
import { useSimulatorStore } from '../store/useSimulatorStore';
import { useUIStore } from '../store/useUIStore';

export const ComponentsCatalogView: React.FC = () => {
  const { addComponent, loadCircuit } = useSimulatorStore();
  const { setActiveNav } = useUIStore();

  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState<string>('All');
  const [selectedComp, setSelectedComp] = useState<ComponentCatalogItem | null>(COMPONENTS_CATALOG[0]);
  const [copiedCode, setCopiedCode] = useState(false);

  const categories = ['All', 'Microcontroller', 'Output', 'Input', 'Passive', 'Actuator', 'Sensor', 'Display'];

  const filtered = COMPONENTS_CATALOG.filter((item) => {
    const matchesCat = activeCategory === 'All' || item.category === activeCategory;
    const matchesSearch =
      item.name.toLowerCase().includes(search.toLowerCase()) ||
      item.shortDesc.toLowerCase().includes(search.toLowerCase()) ||
      item.category.toLowerCase().includes(search.toLowerCase());
    return matchesCat && matchesSearch;
  });

  const handleUseInSimulator = (item: ComponentCatalogItem) => {
    if (item.simulatorType) {
      addComponent(item.simulatorType as any, 350, 180);
      setActiveNav('simulator');
    }
  };

  const iconMap: Record<string, React.ElementType> = {
    Cpu,
    Sun,
    Sparkles,
    Sliders,
    Square,
    Volume2,
    RotateCw,
    Radio,
    Eye,
    Tv
  };

  return (
    <div className="space-y-6 select-none">
      {/* Top Banner */}
      <div className="p-6 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <Cpu className="w-5 h-5 text-blueprint-teal" />
            <h2 className="text-xl font-black text-blueprint-navy dark:text-white">
              COMPONENTS CATALOG & DATASHEETS
            </h2>
          </div>
          <p className="text-xs text-blueprint-navyMuted dark:text-gray-300 mt-1">
            Browse 20+ Arduino electronic components with pinouts, datasheet summaries, working principles, and live simulator integration.
          </p>
        </div>
      </div>

      {/* Category Tabs & Search */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-3">
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-3 py-1.5 rounded-xl text-xs font-mono font-bold transition whitespace-nowrap ${
                activeCategory === cat
                  ? 'bg-blueprint-teal text-white shadow-sm'
                  : 'bg-white dark:bg-blueprint-nightCard text-blueprint-navy dark:text-gray-300 border border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:border-blueprint-teal'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        <div className="relative w-full sm:w-64">
          <Search className="w-4 h-4 absolute left-3 top-2.5 text-gray-400" />
          <input
            type="text"
            placeholder="Search component name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full pl-9 pr-3 py-2 text-xs rounded-xl bg-white dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blueprint-teal font-mono"
          />
        </div>
      </div>

      {/* Main Split Grid: Left Catalog Cards (5 cols) + Right Component Deep Inspector (7 cols) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left: Component Cards List */}
        <div className="lg:col-span-5 space-y-2.5 max-h-[700px] overflow-y-auto pr-1">
          {filtered.length === 0 ? (
            <div className="p-8 text-center rounded-xl bg-white/60 dark:bg-blueprint-nightCard/60 border border-dashed border-blueprint-creamBorder dark:border-blueprint-nightBorder">
              <Cpu className="w-8 h-8 text-gray-400 mx-auto mb-2 opacity-50" />
              <p className="text-xs font-mono font-bold text-blueprint-navy dark:text-gray-300">
                No matching components
              </p>
              <p className="text-[11px] text-gray-400 mt-1">
                Try clearing the search query or selecting a different category.
              </p>
              <button
                onClick={() => {
                  setSearch('');
                  setActiveCategory('All');
                }}
                className="mt-3 px-3 py-1 text-xs font-mono font-bold text-blueprint-teal hover:underline"
              >
                Reset filters
              </button>
            </div>
          ) : (
            filtered.map((item) => {
              const Icon = iconMap[item.iconName] || Cpu;
              const isSelected = selectedComp?.id === item.id;

              return (
                <div
                  key={item.id}
                  onClick={() => setSelectedComp(item)}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer flex items-center justify-between group ${
                    isSelected
                      ? 'bg-white dark:bg-blueprint-nightBg border-blueprint-teal ring-2 ring-blueprint-teal/30 shadow-md'
                      : 'bg-white/70 dark:bg-blueprint-nightCard/70 border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:border-blueprint-teal/50'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 transition-transform group-hover:scale-105 ${
                        isSelected
                          ? 'bg-blueprint-teal text-white shadow-teal-glow'
                          : 'bg-blueprint-tealLight dark:bg-blueprint-teal/15 text-blueprint-teal'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                    </div>

                    <div>
                      <h4 className="text-xs font-bold text-blueprint-navy dark:text-white group-hover:text-blueprint-teal transition-colors">
                        {item.name}
                      </h4>
                      <span className="text-[10px] font-mono text-gray-400">
                        {item.category} · {item.voltageRating}
                      </span>
                    </div>
                  </div>

                  <ArrowRight className="w-4 h-4 text-gray-400 group-hover:text-blueprint-teal transition" />
                </div>
              );
            })
          )}
        </div>

        {/* Right: Detailed Datasheet Inspector */}
        {selectedComp && (
          <div className="lg:col-span-7 p-6 rounded-2xl bg-white/80 dark:bg-blueprint-nightCard/80 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint space-y-5">
            {/* Component Header */}
            <div className="flex items-start justify-between">
              <div>
                <span className="text-[10px] font-mono uppercase px-2 py-0.5 rounded bg-blueprint-tealLight dark:bg-blueprint-teal/15 text-blueprint-teal font-bold border border-blueprint-teal/30">
                  {selectedComp.category}
                </span>
                <h3 className="text-xl font-black text-blueprint-navy dark:text-white mt-1">
                  {selectedComp.name}
                </h3>
              </div>

              <button
                onClick={() => handleUseInSimulator(selectedComp)}
                className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white text-xs font-mono font-bold shadow-md shadow-blueprint-teal/20 transition"
              >
                <Play className="w-3.5 h-3.5 fill-current" />
                <span>Use in Simulator</span>
              </button>
            </div>

            {/* Description */}
            <p className="text-xs text-blueprint-navy dark:text-gray-200 leading-relaxed font-sans">
              {selectedComp.fullDesc}
            </p>

            {/* Datasheet Summary Grid */}
            <div>
              <h4 className="text-xs font-mono font-bold text-blueprint-teal uppercase mb-2">
                DATASHEET ELECTRICAL RATINGS
              </h4>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {Object.entries(selectedComp.datasheetSummary).map(([key, val]) => (
                  <div
                    key={key}
                    className="p-2.5 rounded-xl bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg/60 border border-blueprint-creamBorder/70 dark:border-blueprint-nightBorder/70"
                  >
                    <span className="text-[9px] font-mono text-gray-400 uppercase block">
                      {key.replace(/([A-Z])/g, ' $1')}
                    </span>
                    <span className="text-xs font-mono font-bold text-blueprint-navy dark:text-white mt-0.5 block">
                      {val}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Pinout Table */}
            <div>
              <h4 className="text-xs font-mono font-bold text-blueprint-teal uppercase mb-2">
                PINOUT ASSIGNMENTS
              </h4>
              <div className="divide-y divide-gray-200 dark:divide-gray-800 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder overflow-hidden bg-white dark:bg-blueprint-nightBg text-xs font-mono">
                {selectedComp.pinout.map((p, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2.5">
                    <span className="font-bold text-blueprint-teal">{p.pin}</span>
                    <span className="text-gray-500 dark:text-gray-400 font-sans">{p.desc}</span>
                    <span className="px-2 py-0.5 rounded text-[10px] bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300">
                      {p.type}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Circuit Tips */}
            <div>
              <h4 className="text-xs font-mono font-bold text-amber-600 dark:text-amber-400 uppercase mb-2">
                ENGINEERING BEST PRACTICES & MISTAKES TO AVOID
              </h4>
              <div className="space-y-1.5">
                {selectedComp.circuitTips.map((tip, idx) => (
                  <div key={idx} className="flex items-start gap-2 text-xs text-blueprint-navy dark:text-gray-200">
                    <Zap className="w-3.5 h-3.5 text-amber-500 flex-shrink-0 mt-0.5" />
                    <span>{tip}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
