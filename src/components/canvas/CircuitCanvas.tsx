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
    resetCanvas
  } = useSimulatorStore();

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

        {/* Right: Simulation Run/Stop Toggle */}
        <div className="flex items-center gap-2 pointer-events-auto">
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

          // Estimate pin anchor positions
          const x1 = fromComp.x + 40;
          const y1 = fromComp.y + 40;
          const x2 = toComp.x + 40;
          const y2 = toComp.y + 40;

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
