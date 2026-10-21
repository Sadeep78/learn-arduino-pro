import React, { useState, useRef, useEffect } from 'react';
import {
  RotateCw,
  Trash2,
  Undo2,
  Redo2,
  AlertTriangle,
  Maximize2,
  Play,
  Square,
  Zap,
  Palette,
  Eye,
  EyeOff,
  ZoomIn,
  ZoomOut,
  X
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { useUIStore } from '../../store/useUIStore';
import { ComponentType, CircuitComponent } from '../../types/simulator';
import { LESSONS } from '../../data/lessons';

// Component Canvas Parts
import { UnoCanvasPart, getUnoPinAnchor } from './parts/UnoCanvasPart';
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

export const getAnchor = (comp: CircuitComponent, pinId: string): { x: number; y: number } => {
  const norm = pinId.toLowerCase().trim();

  if (comp.type === 'arduino_uno') {
    const offset = getUnoPinAnchor(pinId);
    return { x: comp.x + offset.x, y: comp.y + offset.y };
  }

  if (comp.type === 'led') {
    if (norm === 'anode' || norm === 'pos' || norm === 'a') return { x: comp.x + 24, y: comp.y + 78 };
    if (norm === 'cathode' || norm === 'neg' || norm === 'k') return { x: comp.x + 56, y: comp.y + 78 };
    return { x: comp.x + 40, y: comp.y + 40 };
  }
  if (comp.type === 'resistor') {
    if (norm === 'pin1' || norm === '1') return { x: comp.x + 10, y: comp.y + 28 };
    if (norm === 'pin2' || norm === '2') return { x: comp.x + 102, y: comp.y + 28 };
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
  if (comp.type === 'button') {
    if (norm === 'pin1' || norm === '1') return { x: comp.x + 40, y: comp.y + 12 };
    if (norm === 'pin2' || norm === '2') return { x: comp.x + 40, y: comp.y + 68 };
    return { x: comp.x + 40, y: comp.y + 40 };
  }
  if (comp.type === 'potentiometer') {
    if (norm === 'vcc' || norm === '5v' || norm === '1') return { x: comp.x + 16, y: comp.y + 116 };
    if (norm === 'wiper' || norm === 'sig' || norm === '2') return { x: comp.x + 56, y: comp.y + 116 };
    if (norm === 'gnd' || norm === '3') return { x: comp.x + 96, y: comp.y + 116 };
    return { x: comp.x + 56, y: comp.y + 64 };
  }
  if (comp.type === 'buzzer') {
    if (norm === 'pos' || norm === 'positive' || norm === '+') return { x: comp.x + 28, y: comp.y + 80 };
    if (norm === 'neg' || norm === 'negative' || norm === '-') return { x: comp.x + 68, y: comp.y + 80 };
    return { x: comp.x + 48, y: comp.y + 48 };
  }
  if (comp.type === 'servo') {
    if (norm === 'signal' || norm === 'sig' || norm === 'pwm') return { x: comp.x + 24, y: comp.y + 98 };
    if (norm === 'vcc' || norm === '5v' || norm === 'red') return { x: comp.x + 56, y: comp.y + 98 };
    if (norm === 'gnd' || norm === 'brown') return { x: comp.x + 88, y: comp.y + 98 };
    return { x: comp.x + 56, y: comp.y + 56 };
  }
  if (comp.type === 'ldr') {
    if (norm === 'pin1' || norm === '1') return { x: comp.x + 32, y: comp.y + 98 };
    if (norm === 'pin2' || norm === '2') return { x: comp.x + 80, y: comp.y + 98 };
    return { x: comp.x + 56, y: comp.y + 56 };
  }
  if (comp.type === 'ultrasonic') {
    if (norm === 'vcc') return { x: comp.x + 28, y: comp.y + 102 };
    if (norm === 'trig') return { x: comp.x + 68, y: comp.y + 102 };
    if (norm === 'echo') return { x: comp.x + 108, y: comp.y + 102 };
    if (norm === 'gnd') return { x: comp.x + 148, y: comp.y + 102 };
    return { x: comp.x + 88, y: comp.y + 40 };
  }
  if (comp.type === 'lcd1602') {
    if (norm === 'gnd') return { x: comp.x + 24, y: comp.y + 116 };
    if (norm === 'vcc') return { x: comp.x + 56, y: comp.y + 116 };
    if (norm === 'sda') return { x: comp.x + 88, y: comp.y + 116 };
    if (norm === 'scl') return { x: comp.x + 120, y: comp.y + 116 };
    return { x: comp.x + 72, y: comp.y + 60 };
  }
  if (comp.type === 'seven_segment') {
    const topLabels = ['g', 'f', 'com1', 'a', 'b'];
    const botLabels = ['e', 'd', 'com2', 'c', 'dp'];
    const tIdx = topLabels.indexOf(norm);
    if (tIdx !== -1) return { x: comp.x + 16 + tIdx * 18, y: comp.y + 10 };
    const bIdx = botLabels.indexOf(norm);
    if (bIdx !== -1) return { x: comp.x + 16 + bIdx * 18, y: comp.y + 116 };
    return { x: comp.x + 52, y: comp.y + 64 };
  }
  if (comp.type === 'rgb_led') {
    if (norm === 'red' || norm === 'r') return { x: comp.x + 16, y: comp.y + 96 };
    if (norm === 'cathode' || norm === 'com' || norm === 'gnd') return { x: comp.x + 40, y: comp.y + 106 };
    if (norm === 'green' || norm === 'g') return { x: comp.x + 64, y: comp.y + 96 };
    if (norm === 'blue' || norm === 'b') return { x: comp.x + 88, y: comp.y + 96 };
    return { x: comp.x + 52, y: comp.y + 40 };
  }

  return { x: comp.x + 40, y: comp.y + 40 };
};

export const CircuitCanvas: React.FC = () => {
  const {
    circuit,
    isRunning,
    startSimulation,
    stopSimulation,
    selectedComponentId,
    selectedWireId,
    wiringSource,
    wireColor,
    warnings,
    past,
    future,
    moveComponent,
    rotateComponent,
    removeComponent,
    selectComponent,
    selectWire,
    removeWire,
    setWireColor,
    undo,
    redo,
    startWiring,
    completeWiring,
    cancelWiring,
    autoWireLed,
    updateComponentProperty
  } = useSimulatorStore();

  const { activeLessonId } = useUIStore();
  const activeLesson = LESSONS.find((l) => l.id === activeLessonId);

  const canvasRef = useRef<HTMLDivElement>(null);
  const [draggingCompId, setDraggingCompId] = useState<string | null>(null);
  const [dragOffset, setDragOffset] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [mousePos, setMousePos] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [showWiringGuide, setShowWiringGuide] = useState<boolean>(false);

  // Pan and Zoom states
  const [zoom, setZoom] = useState<number>(1.0);
  const [pan, setPan] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const [isPanning, setIsPanning] = useState<boolean>(false);
  const panStartRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });

  // Warning toast auto-dismiss
  const [warningDismissed, setWarningDismissed] = useState<boolean>(false);
  const warningTimerRef = useRef<any>(null);

  useEffect(() => {
    if (warnings.length > 0) {
      setWarningDismissed(false);
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
      warningTimerRef.current = setTimeout(() => {
        setWarningDismissed(true);
      }, 6000);
    }
    return () => {
      if (warningTimerRef.current) clearTimeout(warningTimerRef.current);
    };
  }, [warnings]);

  // Fit to view calculation
  const handleFitToView = () => {
    if (!canvasRef.current || circuit.components.length === 0) {
      setZoom(1.0);
      setPan({ x: 0, y: 0 });
      return;
    }

    const rect = canvasRef.current.getBoundingClientRect();
    const width = rect.width || 800;
    const height = rect.height || 600;

    let minX = Infinity;
    let minY = Infinity;
    let maxX = -Infinity;
    let maxY = -Infinity;

    circuit.components.forEach((c) => {
      const compW = c.type === 'arduino_uno' ? 380 : c.type === 'breadboard' ? 460 : 120;
      const compH = c.type === 'arduino_uno' ? 230 : c.type === 'breadboard' ? 160 : 100;
      minX = Math.min(minX, c.x);
      minY = Math.min(minY, c.y);
      maxX = Math.max(maxX, c.x + compW);
      maxY = Math.max(maxY, c.y + compH);
    });

    const pad = 36;
    const bboxW = Math.max(200, maxX - minX + pad * 2);
    const bboxH = Math.max(200, maxY - minY + pad * 2);

    const fitScale = Math.min(1.05, Math.max(0.45, Math.min(width / bboxW, height / bboxH)));
    const centerX = (minX + maxX) / 2;
    const centerY = (minY + maxY) / 2;
    const fitPanX = width / 2 - centerX * fitScale;
    const fitPanY = height / 2 - centerY * fitScale;

    setZoom(fitScale);
    setPan({ x: fitPanX, y: fitPanY });
  };

  // Run Fit to view automatically whenever a lesson loads
  useEffect(() => {
    const timer = setTimeout(() => {
      handleFitToView();
    }, 150);
    return () => clearTimeout(timer);
  }, [activeLessonId]);

  // Dragging logic
  const handleCompMouseDown = (e: React.MouseEvent, compId: string, currentX: number, currentY: number) => {
    e.stopPropagation();
    selectComponent(compId);
    setDraggingCompId(compId);

    if (canvasRef.current) {
      const rect = canvasRef.current.getBoundingClientRect();
      const worldMouseX = (e.clientX - rect.left - pan.x) / zoom;
      const worldMouseY = (e.clientY - rect.top - pan.y) / zoom;
      setDragOffset({
        x: worldMouseX - currentX,
        y: worldMouseY - currentY
      });
    }
  };

  const handleCanvasMouseDown = (e: React.MouseEvent) => {
    // Only pan if clicking canvas background, not controls
    setIsPanning(true);
    panStartRef.current = {
      x: e.clientX - pan.x,
      y: e.clientY - pan.y
    };
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!canvasRef.current) return;
    const rect = canvasRef.current.getBoundingClientRect();
    const worldX = (e.clientX - rect.left - pan.x) / zoom;
    const worldY = (e.clientY - rect.top - pan.y) / zoom;
    setMousePos({ x: worldX, y: worldY });

    if (draggingCompId) {
      const newX = Math.round(worldX - dragOffset.x);
      const newY = Math.round(worldY - dragOffset.y);
      moveComponent(draggingCompId, Math.max(10, newX), Math.max(10, newY));
    } else if (isPanning) {
      setPan({
        x: e.clientX - panStartRef.current.x,
        y: e.clientY - panStartRef.current.y
      });
    }
  };

  const handleMouseUp = () => {
    setDraggingCompId(null);
    setIsPanning(false);
  };

  const handleWheel = (e: React.WheelEvent) => {
    e.preventDefault();
    if (!canvasRef.current) return;

    const zoomFactor = e.deltaY < 0 ? 1.08 : 0.92;
    const newZoom = Math.min(2.0, Math.max(0.4, zoom * zoomFactor));

    const rect = canvasRef.current.getBoundingClientRect();
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;

    const newPanX = mouseX - (mouseX - pan.x) * (newZoom / zoom);
    const newPanY = mouseY - (mouseY - pan.y) * (newZoom / zoom);

    setZoom(newZoom);
    setPan({ x: newPanX, y: newPanY });
  };

  const handlePinClick = (componentId: string, pinId: string) => {
    if (!wiringSource) {
      startWiring(componentId, pinId);
    } else {
      completeWiring(componentId, pinId);
    }
  };

  const wireColors = [
    { label: 'Green', hex: '#10B981' },
    { label: 'Red', hex: '#EF4444' },
    { label: 'Black', hex: '#1F2937' },
    { label: 'Blue', hex: '#3B82F6' },
    { label: 'Yellow', hex: '#EAB308' },
    { label: 'Purple', hex: '#A855F7' }
  ];

  const hasUno = circuit.components.some((c) => c.type === 'arduino_uno');
  const hasLed = circuit.components.some((c) => c.type === 'led');
  const canAutoWire = hasUno && hasLed && !isRunning;

  // Build ghost guide wires for active lesson
  const ghostWires = React.useMemo(() => {
    if (!showWiringGuide || !activeLesson?.requiredCircuit?.connections) return [];

    return activeLesson.requiredCircuit.connections
      .map((conn) => {
        const [fromC, fromP] = conn.from.split(':');
        const [toC, toP] = conn.to.split(':');

        const p1 = (() => {
          let comp = circuit.components.find((c) => c.id === fromC);
          if (!comp) {
            const uno = circuit.components.find((c) => c.type === 'arduino_uno');
            if (uno && fromC.includes('uno')) comp = uno;
          }
          if (!comp) return null;
          return { comp, pinId: fromP, anchor: getAnchor(comp, fromP) };
        })();

        const p2 = (() => {
          let comp = circuit.components.find((c) => c.id === toC);
          if (!comp) {
            if (toC.includes('res')) comp = circuit.components.find((c) => c.type === 'resistor');
            else if (toC.includes('led')) comp = circuit.components.find((c) => c.type === 'led');
            else if (toC.includes('uno')) comp = circuit.components.find((c) => c.type === 'arduino_uno');
            else if (toC.includes('btn') || toC.includes('button')) comp = circuit.components.find((c) => c.type === 'button');
          }
          if (!comp) return null;
          return { comp, pinId: toP, anchor: getAnchor(comp, toP) };
        })();

        if (!p1 || !p2) return null;

        const isWired = circuit.wires.some(
          (w) =>
            (w.fromComponentId === p1.comp.id &&
              w.fromPinId.toLowerCase() === p1.pinId.toLowerCase() &&
              w.toComponentId === p2.comp.id &&
              w.toPinId.toLowerCase() === p2.pinId.toLowerCase()) ||
            (w.fromComponentId === p2.comp.id &&
              w.fromPinId.toLowerCase() === p2.pinId.toLowerCase() &&
              w.toComponentId === p1.comp.id &&
              w.toPinId.toLowerCase() === p1.pinId.toLowerCase())
        );

        return {
          id: `${conn.from}->${conn.to}`,
          p1: p1.anchor,
          p2: p2.anchor,
          description: conn.description,
          isWired
        };
      })
      .filter((g): g is NonNullable<typeof g> => g !== null);
  }, [showWiringGuide, activeLesson, circuit]);

  return (
    <div
      ref={canvasRef}
      onMouseDown={handleCanvasMouseDown}
      onMouseMove={handleMouseMove}
      onMouseUp={handleMouseUp}
      onWheel={handleWheel}
      onClick={(e) => {
        // Deselect if clicking directly on canvas background
        if (e.target === canvasRef.current || (e.target as HTMLElement).tagName === 'svg') {
          selectComponent(null);
          selectWire(null);
          cancelWiring();
        }
      }}
      className={`relative w-full h-[620px] bg-blueprint-cream dark:bg-blueprint-nightBg overflow-hidden select-none ${
        isPanning ? 'cursor-grab active:cursor-grabbing' : ''
      }`}
    >
      {/* Blueprint Grid Lines Background */}
      <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

      {/* Top Canvas Toolbar */}
      <div className="absolute top-3 left-3 right-3 z-30 flex items-center justify-between pointer-events-none gap-2 flex-wrap">
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

        {/* Center: Wire Color Selector + Pan & Zoom Tools */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Wire Color Selector */}
          <div className="hidden sm:flex items-center gap-1 bg-white/90 dark:bg-blueprint-nightCard/90 backdrop-blur-md px-2.5 py-1.5 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm">
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

          {/* Pan & Zoom Controls */}
          <div className="flex items-center gap-1 bg-white/90 dark:bg-blueprint-nightCard/90 backdrop-blur-md px-2 py-1 rounded-xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm">
            <button
              onClick={handleFitToView}
              className="flex items-center gap-1 px-2 py-1 rounded-lg text-xs font-mono font-bold text-blueprint-navy dark:text-gray-200 hover:text-blueprint-teal hover:bg-black/5 dark:hover:bg-white/5 transition"
              title="Fit all components to view"
            >
              <Maximize2 className="w-3.5 h-3.5 text-blueprint-teal" />
              <span className="hidden md:inline">Fit to view</span>
            </button>

            <div className="w-[1px] h-4 bg-gray-300 dark:bg-gray-700 mx-0.5" />

            <button
              onClick={() => setZoom((z) => Math.max(0.4, Number((z - 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-gray-500 hover:text-blueprint-teal transition"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>

            <span className="text-[11px] font-mono font-bold text-gray-500 w-10 text-center">
              {Math.round(zoom * 100)}%
            </span>

            <button
              onClick={() => setZoom((z) => Math.min(2.0, Number((z + 0.1).toFixed(2))))}
              className="p-1 rounded-lg text-gray-500 hover:text-blueprint-teal transition"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>

        {/* Right: Simulation Run/Stop Toggle, Auto-Wire & Show Wiring */}
        <div className="flex items-center gap-2 pointer-events-auto">
          {/* Show me the wiring button */}
          {activeLesson?.requiredCircuit && activeLesson.requiredCircuit.connections.length > 0 && (
            <button
              onClick={() => setShowWiringGuide(!showWiringGuide)}
              className={`flex items-center gap-1.5 px-3 py-2 rounded-xl font-mono font-bold text-xs shadow-md transition ${
                showWiringGuide
                  ? 'bg-cyan-500 hover:bg-cyan-600 text-white ring-2 ring-cyan-300 shadow-cyan-500/30'
                  : 'bg-white/90 dark:bg-blueprint-nightCard/90 text-blueprint-navy dark:text-gray-200 hover:text-cyan-600 border border-blueprint-creamBorder dark:border-blueprint-nightBorder'
              }`}
              title="Show animated wiring connections overlay for this lesson"
            >
              {showWiringGuide ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
              <span className="hidden sm:inline">{showWiringGuide ? 'Hide Wiring' : 'Show Wiring'}</span>
            </button>
          )}

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

      {/* Dismissible & Auto-hiding Warning Toast (Bottom Left, Stacks Above Controls) */}
      {warnings.length > 0 && !warningDismissed && (
        <div className="absolute bottom-4 left-4 z-40 max-w-sm space-y-1.5 pointer-events-auto animate-in slide-in-from-bottom-2 duration-200">
          {warnings.slice(0, 2).map((w) => (
            <div
              key={w.id}
              className={`p-2.5 rounded-xl border backdrop-blur-md shadow-lg flex items-start justify-between gap-2.5 text-xs ${
                w.level === 'error'
                  ? 'bg-red-50/95 dark:bg-red-950/90 border-red-300 dark:border-red-800 text-red-800 dark:text-red-200'
                  : 'bg-amber-50/95 dark:bg-amber-950/90 border-amber-300 dark:border-amber-800 text-amber-800 dark:text-amber-200'
              }`}
            >
              <div className="flex items-start gap-2 min-w-0">
                <AlertTriangle className="w-4 h-4 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="font-bold leading-tight">{w.message}</p>
                  {w.helpText && <p className="text-[11px] opacity-85 mt-0.5 leading-snug">{w.helpText}</p>}
                </div>
              </div>

              <button
                onClick={() => setWarningDismissed(true)}
                className="text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 p-0.5 rounded"
                title="Dismiss warning"
              >
                <X className="w-3.5 h-3.5" />
              </button>
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

      {/* World Transform Container: Scales and Pans All Components and Wires Together */}
      <div
        className="w-full h-full relative"
        style={{
          transform: `translate(${pan.x}px, ${pan.y}px) scale(${zoom})`,
          transformOrigin: '0 0'
        }}
      >
        {/* SVG Wires Layer */}
        <svg className="absolute inset-0 w-[4000px] h-[4000px] pointer-events-none z-10">
          <defs>
            <style>{`
              @keyframes ghostDash {
                to {
                  stroke-dashoffset: -24;
                }
              }
              .ghost-guide-wire {
                animation: ghostDash 1.2s linear infinite;
              }
            `}</style>
          </defs>

          {/* Animated Ghost Guide Wires */}
          {ghostWires.map((g) => (
            <g key={g.id}>
              <path
                d={`M ${g.p1.x} ${g.p1.y} C ${g.p1.x} ${(g.p1.y + g.p2.y) / 2}, ${g.p2.x} ${(g.p1.y + g.p2.y) / 2}, ${g.p2.x} ${g.p2.y}`}
                fill="none"
                stroke={g.isWired ? '#10B981' : '#06B6D4'}
                strokeWidth={g.isWired ? 3 : 2.5}
                strokeDasharray={g.isWired ? 'none' : '6 6'}
                strokeOpacity={g.isWired ? 0.35 : 0.85}
                className={g.isWired ? '' : 'ghost-guide-wire'}
              />
              {!g.isWired && (
                <>
                  <circle cx={g.p1.x} cy={g.p1.y} r={4} fill="#06B6D4" opacity={0.8} />
                  <circle cx={g.p2.x} cy={g.p2.y} r={4} fill="#06B6D4" opacity={0.8} />
                </>
              )}
            </g>
          ))}

          {/* User Connected Wires */}
          {circuit.wires.map((wire) => {
            const fromComp = circuit.components.find((c) => c.id === wire.fromComponentId);
            const toComp = circuit.components.find((c) => c.id === wire.toComponentId);
            if (!fromComp || !toComp) return null;

            const start = getAnchor(fromComp, wire.fromPinId);
            const end = getAnchor(toComp, wire.toPinId);
            const isSelected = selectedWireId === wire.id;

            const midY = (start.y + end.y) / 2;
            const pathData = `M ${start.x} ${start.y} C ${start.x} ${midY}, ${end.x} ${midY}, ${end.x} ${end.y}`;

            return (
              <g
                key={wire.id}
                onClick={(e) => {
                  e.stopPropagation();
                  selectWire(wire.id);
                }}
                className="cursor-pointer pointer-events-auto group"
              >
                {/* Thick invisible hit area for easy wire selection */}
                <path d={pathData} fill="none" stroke="transparent" strokeWidth={16} />
                {/* Visual Wire */}
                <path
                  d={pathData}
                  fill="none"
                  stroke={wire.color}
                  strokeWidth={isSelected ? 4.5 : 3}
                  strokeLinecap="round"
                  className="transition-all group-hover:brightness-125"
                  style={{
                    filter: isSelected ? 'drop-shadow(0 0 4px rgba(22, 184, 176, 0.8))' : 'none'
                  }}
                />
                {/* Terminal Contacts */}
                <circle cx={start.x} cy={start.y} r={3} fill="#1F2937" stroke={wire.color} strokeWidth={1} />
                <circle cx={end.x} cy={end.y} r={3} fill="#1F2937" stroke={wire.color} strokeWidth={1} />
              </g>
            );
          })}

          {/* Active Wiring Cursor Line */}
          {wiringSource && (() => {
            const srcComp = circuit.components.find((c) => c.id === wiringSource.componentId);
            if (!srcComp) return null;
            const start = getAnchor(srcComp, wiringSource.pinId);
            return (
              <line
                x1={start.x}
                y1={start.y}
                x2={mousePos.x}
                y2={mousePos.y}
                stroke={wireColor}
                strokeWidth={3}
                strokeDasharray="4 4"
                className="animate-pulse"
              />
            );
          })()}
        </svg>

        {/* Placed Circuit Components */}
        {circuit.components.map((comp) => {
          const isSelected = selectedComponentId === comp.id;
          const isWiringThisComp = wiringSource?.componentId === comp.id;
          const activePin = isWiringThisComp ? wiringSource?.pinId : null;

          return (
            <div
              key={comp.id}
              onMouseDown={(e) => handleCompMouseDown(e, comp.id, comp.x, comp.y)}
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
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                />
              )}
              {comp.type === 'breadboard' && (
                <BreadboardCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                />
              )}
              {comp.type === 'led' && (
                <LedCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                />
              )}
              {comp.type === 'rgb_led' && (
                <RgbLedCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                />
              )}
              {comp.type === 'resistor' && (
                <ResistorCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                />
              )}
              {comp.type === 'button' && (
                <ButtonCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                  onTogglePress={() => updateComponentProperty(comp.id, 'isPressed', !comp.properties?.isPressed)}
                />
              )}
              {comp.type === 'potentiometer' && (
                <PotentiometerCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                  onValueChange={(val) => updateComponentProperty(comp.id, 'value', val)}
                />
              )}
              {comp.type === 'buzzer' && (
                <BuzzerCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                />
              )}
              {comp.type === 'servo' && (
                <ServoCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                />
              )}
              {comp.type === 'ldr' && (
                <LdrCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                  onValueChange={(val) => updateComponentProperty(comp.id, 'lux', val)}
                />
              )}
              {comp.type === 'ultrasonic' && (
                <UltrasonicCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                  onDistanceChange={(dist) => updateComponentProperty(comp.id, 'distance', dist)}
                />
              )}
              {comp.type === 'lcd1602' && (
                <Lcd1602CanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                />
              )}
              {comp.type === 'seven_segment' && (
                <SevenSegmentCanvasPart
                  component={comp}
                  isSelected={isSelected}
                  onPinClick={(pId) => handlePinClick(comp.id, pId)}
                  activeWiringPin={activePin}
                />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
};
