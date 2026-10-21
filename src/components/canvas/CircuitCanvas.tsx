import React, { useState, useRef } from 'react';
import {
  RotateCw,
  Trash2,
  Undo2,
  Redo2,
  AlertTriangle,
  Info,
  Maximize2,
  Play,
  Square,
  Sparkles,
  Zap,
  Palette
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { ComponentType } from '../../types/simulator';

// Component Canvas Parts
import { UnoCanvasPart } from './parts/UnoCanvasPart';
import { BreadboardCanvasPart } from './parts/BreadboardCanvasPart';
import { LedCanvasPart } from './parts/LedCanvasPart';
import { RgbLedCanvasPart } from './parts/RgbLedCanvasPart';
import { ResistorCanvasPart } from './parts/ResistorCanvasPart';
import { ButtonCanvasPart } from './parts/ButtonCanvasPart';
import { PotentiometerCanvasPart } from './parts/PotentiometerCanvasPart';
import { BuzzerCanvasPart } from './parts/BuzzerCanvasPart';
import { ServoCanvasPart } from './parts/ServoCanvasPart';
import { LdrCanvasPart } from './parts/LdrCanvasPart';
import { UltrasonicCanvasPart } from './parts/UltrasonicCanvasPart';
import { Lcd1602CanvasPart } from './parts/Lcd1602CanvasPart';
import { SevenSegmentCanvasPart } from './parts/SevenSegmentCanvasPart';

export const CircuitCanvas: React.FC = () => {
  const {
    circuit,
    selectedComponentId,
    selectedWireId,
    wiringSource,
    wireColor,
    warnings,
    past,
    future,
    isRunning,
    startSimulation,
    stopSimulation,
    selectComponent,
    selectWire,
    startWiring,
    completeWiring,
    cancelWiring,
    setWireColor,
    rotateComponent,
    removeComponent,
    removeWire,
    moveComponent,
    updateComponentProperty,
    undo,
    redo,
    autoWireLed,
    resetCanvas
  } = useSimulatorStore();

  const hasUno = circuit.components.some((c) => c.type === 'arduino_uno');
  const hasLed = circuit.components.some((c) => c.type === 'led');
  const isLedOn = circuit.components.some((c) => c.type === 'led' && (c.properties?.brightness ?? 0) > 0.05);
  const canAutoWire = hasUno && hasLed && !isLedOn;

  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });

  const wireColors = [
    { label: 'Green', hex: '#10B981' },
    { label: 'Red', hex: '#EF4444' },
    { label: 'Black', hex: '#1F2937' },
    { label: 'Blue', hex: '#3B82F6' },
    { label: 'Yellow', hex: '#F59E0B' },
    { label: 'Purple', hex: '#8B5CF6' }
  ];

  // Dragging logic
  const handleMouseDown = (e: React.MouseEvent, compId: string, currentX: number, currentY: number) => {
    e.stopPropagation();
    selectComponent(compId);
    setDraggingCompId(compId);
    setDragOffset({
      x: e.clientX - currentX,
      y: e.clientY - currentY
    });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (draggingCompId && canvasRef.current) {
      const bounds = canvasRef.current.getBoundingClientRect();
      const rawX = e.clientX - dragOffset.x;
      const rawY = e.clientY - dragOffset.y;
      moveComponent(draggingCompId, Math.max(10, rawX), Math.max(10, rawY));
    }
  };

  const handleMouseUp = () => {
    setDraggingCompId(null);
  };

  const handlePinClick = (componentId: string, pinId: string) => {
    if (!wiringSource) {
      startWiring(componentId, pinId);
    } else {
      completeWiring(componentId, pinId);
    }
  };

  return (
    <div
      ref={canvasRef}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onClick={() => {
        selectComponent(null);
        selectWire(null);
        cancelWiring();
      }}
      className="relative w-full h-[620px] bg-blueprint-cream dark:bg-blueprint-nightBg rounded-2xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint overflow-hidden select-none"
    >
      {/* Blueprint Grid Lines Background */}
      <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

      {/* Top Canvas Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none">
        {/* Left Action Buttons: Undo, Redo, Rotate, Delete */}
        <div className="flex items-center gap-1.5 pointer-events-auto bg-white/90 dark:bg-blueprint-nightCard/90 backdrop-blur-md p-1.5 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm">
          <button
            onClick={undo}
            disabled={past.length === 0}
            className="p-1.5 rounded-lg text-blueprint-navy dark:text-gray-200 hover:bg-blueprint-teal hover:text-white disabled:opacity-40 transition"
            title="Undo"
          >
            <Undo2 className="w-4 h-4" />
          </button>

          <button
            onClick={redo}
            disabled={future.length === 0}
            className="p-1.5 rounded-lg text-blueprint-navy dark:text-gray-200 hover:bg-blueprint-teal hover:text-white disabled:opacity-40 transition"
            title="Redo"
          >
            <Redo2 className="w-4 h-4" />
          </button>

          <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-1" />

          {selectedComponentId && (
            <>
              <button
                onClick={() => rotateComponent(selectedComponentId)}
                className="p-1.5 rounded-lg text-blueprint-navy dark:text-gray-200 hover:bg-blueprint-teal hover:text-white transition"
                title="Rotate 90°"
              >
                <RotateCw className="w-4 h-4" />
              </button>

              <button
                onClick={() => removeComponent(selectedComponentId)}
                className="p-1.5 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition"
                title="Delete Component"
              >
                <Trash2 className="w-4 h-4" />
              </button>
            </>
          )}

          {selectedWireId && (
            <button
              onClick={() => removeWire(selectedWireId)}
              className="p-1.5 rounded-lg text-red-500 hover:bg-red-500 hover:text-white transition"
              title="Delete Selected Wire"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          )}
        </div>

        {/* Center: Wire Color Selector */}
        <div className="hidden sm:flex items-center gap-1 pointer-events-auto bg-white/90 dark:bg-blueprint-nightCard/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm">
          <Palette className="w-3.5 h-3.5 text-gray-400 mr-1" />
          {wireColors.map((wc) => (
            <button
              key={wc.hex}
              onClick={() => setWireColor(wc.hex)}
              className={`w-4 h-4 rounded-full border transition-all ${
                wireColor === wc.hex ? 'scale-125 ring-2 ring-blueprint-teal' : 'hover:scale-110'
              }`}
              style={{ backgroundColor: wc.hex }}
              title={`${wc.label} Wire`}
            />
          ))}
        </div>

        {/* Right: Simulation Run/Stop Toggle & Auto-Wire */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {canAutoWire && (
            <button
              onClick={autoWireLed}
              className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-500 hover:bg-amber-600 text-white font-mono font-bold text-xs shadow-lg shadow-amber-500/20 transition animate-pulse"
              title="Automatically connect Pin 13 to LED Anode and GND to Cathode"
            >
              <Zap className="w-4 h-4 fill-current" />
              <span>⚡ Auto-Wire LED</span>
            </button>
          )}

          {isRunning ? (
            <button
              onClick={stopSimulation}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-red-500 hover:bg-red-600 text-white font-mono font-bold text-xs shadow-lg transition"
            >
              <Square className="w-4 h-4 fill-current" />
              <span>STOP</span>
            </button>
          ) : (
            <button
              onClick={() => startSimulation()}
              className="flex items-center gap-1.5 px-4 py-2 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover text-white font-mono font-bold text-xs shadow-lg shadow-blueprint-teal/30 transition"
            >
              <Play className="w-4 h-4 fill-current" />
              <span>RUN SIMULATION</span>
            </button>
          )}
        </div>
      </div>

      {/* Warnings & Mistakes Alert Banner (Floating Bottom Left) */}
      {warnings.length > 0 && (
        <div className="absolute bottom-3 left-3 z-30 max-w-md space-y-1.5 pointer-events-auto animate-in slide-in-from-bottom-2 duration-200">
          {warnings.slice(0, 2).map((w) => (
            <div
              key={w.id}
              className={`p-2.5 rounded-xl border backdrop-blur-md shadow-lg flex items-start gap-2.5 text-xs ${
                w.level === 'error'
                  ? 'bg-red-50/95 dark:bg-red-950/90 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
                  : 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              }`}
            >
              <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">{w.message}</p>
                {w.helpText && <p className="text-[11px] opacity-85 mt-0.5">{w.helpText}</p>}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Wiring In-Progress Hint */}
      {wiringSource && (
        <div className="absolute top-16 left-1/2 -translate-x-1/2 z-30 px-3 py-1.5 rounded-xl bg-blueprint-teal text-white text-xs font-mono font-bold shadow-lg flex items-center gap-2 animate-pulse pointer-events-auto">
          <span>Click any destination pin to complete wire (or click canvas to cancel)</span>
        </div>
      )}

      {/* SVG Wires Layer */}
      <svg className="absolute inset-0 w-full h-full pointer-events-none z-10">
        {circuit.wires.map((wire) => {
          const fromComp = circuit.components.find((c) => c.id === wire.fromComponentId);
          const toComp = circuit.components.find((c) => c.id === wire.toComponentId);
          if (!fromComp || !toComp) return null;

          const getAnchor = (comp: typeof fromComp, pinId: string) => {
            const norm = pinId.toLowerCase().trim();
            if (comp.type === 'arduino_uno') {
              const topPins = ['aref', 'gnd3', 'd13', 'd12', 'd11', 'd10', 'd9', 'd8', 'd7', 'd6', 'd5', 'd4', 'd3', 'd2', 'd1', 'd0'];
              const topIdx = topPins.indexOf(norm);
              if (topIdx !== -1) {
                const rightStart = comp.x + 340 - 18;
                return { x: rightStart - (15 - topIdx) * 17.5, y: comp.y + 12 };
              }
              const pwrPins = ['ioref', 'reset', '3v3', '5v', 'gnd1', 'gnd2', 'vin'];
              const pIdx = pwrPins.indexOf(norm);
              if (pIdx !== -1) {
                return { x: comp.x + 72 + pIdx * 17.5, y: comp.y + 208 };
              }
            }
            if (comp.type === 'led') {
              if (norm === 'anode') return { x: comp.x + 24, y: comp.y + 78 };
              if (norm === 'cathode') return { x: comp.x + 56, y: comp.y + 78 };
              return { x: comp.x + 40, y: comp.y + 40 };
            }
            if (comp.type === 'resistor') {
              if (norm === 'pin1') return { x: comp.x + 10, y: comp.y + 28 };
              if (norm === 'pin2') return { x: comp.x + 102, y: comp.y + 28 };
              return { x: comp.x + 56, y: comp.y + 28 };
            }
            if (comp.type === 'breadboard') {
              const rowMatch = norm.match(/^([a-j])(\d+)$/);
              if (rowMatch) {
                const row = rowMatch[1];
                const col = parseInt(rowMatch[2], 10);
                const colX = comp.x + 28 + (col - 1) * 14.4;
                const topRows = ['a', 'b', 'c', 'd', 'e'];
                const botRows = ['f', 'g', 'h', 'i', 'j'];
                if (topRows.includes(row)) {
                  return { x: colX, y: comp.y + 36 + topRows.indexOf(row) * 12 };
                }
                if (botRows.includes(row)) {
                  return { x: colX, y: comp.y + 126 + botRows.indexOf(row) * 12 };
                }
              }
            }
            return { x: comp.x + 40, y: comp.y + 40 };
          };

          const p1 = getAnchor(fromComp, wire.fromPinId);
          const p2 = getAnchor(toComp, wire.toPinId);
          const x1 = p1.x;
          const y1 = p1.y;
          const x2 = p2.x;
          const y2 = p2.y;

          // Smooth Bezier curve control points
          const dx = (x2 - x1) * 0.5;
          const dy = (y2 - y1) * 0.5;
          const path = `M ${x1} ${y1} C ${x1 + dx} ${y1 + 40}, ${x2 - dx} ${y2 - 40}, ${x2} ${y2}`;

          const isSelected = selectedWireId === wire.id;

          return (
            <g key={wire.id}>
              {/* Invisible thicker hit-box path for easier selection */}
              <path
                d={path}
                fill="none"
                stroke="transparent"
                strokeWidth={16}
                className="cursor-pointer pointer-events-auto"
                onClick={(e) => {
                  e.stopPropagation();
                  selectWire(wire.id);
                }}
              />
              {/* Visible rendered wire */}
              <path
                d={path}
                fill="none"
                stroke={wire.color}
                strokeWidth={isSelected ? 4.5 : 3}
                strokeLinecap="round"
                className={`transition-all ${
                  isSelected ? 'filter drop-shadow-[0_0_8px_rgba(22,184,176,0.8)]' : ''
                }`}
              />
              {/* Start & End Terminal solder dots */}
              <circle cx={x1} cy={y1} r={3.5} fill={wire.color} />
              <circle cx={x2} cy={y2} r={3.5} fill={wire.color} />
            </g>
          );
        })}
      </svg>

      {/* Electronic Components Canvas Layer */}
      <div className="relative w-full h-full z-20 pointer-events-none">
        {circuit.components.map((comp) => {
          const isSelected = selectedComponentId === comp.id;
          const activeWiringPin =
            wiringSource?.componentId === comp.id ? wiringSource.pinId : null;

          return (
            <div
              key={comp.id}
              onMouseDown={(e) => handleMouseDown(e, comp.id, comp.x, comp.y)}
              style={{
                position: 'absolute',
                left: `${comp.x}px`,
                top: `${comp.y}px`,
                cursor: draggingCompId === comp.id ? 'grabbing' : 'grab'
              }}
              className="pointer-events-auto"
            >
              {comp.type === 'arduino_uno' && (
                <UnoCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                />
              )}

              {comp.type === 'breadboard' && (
                <BreadboardCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                />
              )}

              {comp.type === 'led' && (
                <LedCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                />
              )}

              {comp.type === 'rgb_led' && (
                <RgbLedCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                />
              )}

              {comp.type === 'resistor' && (
                <ResistorCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                />
              )}

              {comp.type === 'button' && (
                <ButtonCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                  onTogglePress={() => {
                    const current = Boolean(comp.properties?.isPressed);
                    updateComponentProperty(comp.id, 'isPressed', !current);
                  }}
                />
              )}

              {comp.type === 'potentiometer' && (
                <PotentiometerCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                  onValueChange={(val) => updateComponentProperty(comp.id, 'value', val)}
                />
              )}

              {comp.type === 'buzzer' && (
                <BuzzerCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                />
              )}

              {comp.type === 'servo' && (
                <ServoCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                />
              )}

              {comp.type === 'ldr' && (
                <LdrCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                  onValueChange={(val) => updateComponentProperty(comp.id, 'value', val)}
                />
              )}

              {comp.type === 'ultrasonic' && (
                <UltrasonicCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                  onDistanceChange={(val) => updateComponentProperty(comp.id, 'value', val)}
                />
              )}

              {comp.type === 'lcd1602' && (
                <Lcd1602CanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                />
              )}

              {comp.type === 'seven_segment' && (
                <SevenSegmentCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pinId) => handlePinClick(comp.id, pinId)}
                  activeWiringPin={activeWiringPin}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
