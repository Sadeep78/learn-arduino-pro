import React, { useRef, useState, Suspense } from 'react';
import { Canvas } from '@react-three/fiber';
import { OrbitControls, PerspectiveCamera } from '@react-three/drei';
import type { OrbitControls as OrbitControlsType } from 'three-stdlib';
import {
  RotateCcw,
  ZoomIn,
  ZoomOut,
  Maximize2,
  Layers,
  Sparkles,
  Info
} from 'lucide-react';
import { ArduinoUnoModel } from './ArduinoUnoModel';
import { useUIStore } from '../../store/useUIStore';

export const BoardScene: React.FC = () => {
  const { selectedHotspot, setSelectedHotspot } = useUIStore();
  const controlsRef = useRef<OrbitControlsType>(null);
  const [viewMode, setViewMode] = useState<'isometric' | 'top'>('isometric');

  const handleResetView = () => {
    if (controlsRef.current) {
      controlsRef.current.reset();
      setViewMode('isometric');
    }
  };

  const handleZoom = (delta: number) => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.multiplyScalar(delta);
      controlsRef.current.update();
    }
  };

  const setTopView = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.set(0, 6.5, 0.001);
      camera.lookAt(0, 0, 0);
      controlsRef.current.update();
      setViewMode('top');
    }
  };

  const setIsometricView = () => {
    if (controlsRef.current) {
      const camera = controlsRef.current.object;
      camera.position.set(4.5, 4.2, 4.5);
      camera.lookAt(0, 0, 0);
      controlsRef.current.update();
      setViewMode('isometric');
    }
  };

  return (
    <div className="relative w-full h-full min-h-[420px] rounded-2xl overflow-hidden bg-gradient-to-b from-blueprint-creamDark/80 to-blueprint-cream/40 dark:from-blueprint-nightBg/90 dark:to-blueprint-nightCard/60 border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-blueprint select-none">
      {/* Blueprint Grid Watermark Layer */}
      <div className="absolute inset-0 blueprint-grid opacity-60 pointer-events-none" />

      {/* Floating View Controls Header Overlay */}
      <div className="absolute top-3 left-3 z-20 flex items-center gap-2">
        <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-white/90 dark:bg-blueprint-nightCard/90 backdrop-blur-md border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm text-xs font-mono font-semibold text-blueprint-navy dark:text-gray-200">
          <Sparkles className="w-3.5 h-3.5 text-blueprint-teal animate-spin-slow" />
          <span>ARDUINO UNO R3</span>
          <span className="opacity-50">· 3D EXPLORER</span>
        </div>

        {/* Isometric vs Top view toggle */}
        <div className="flex items-center p-0.5 rounded-xl bg-white/90 dark:bg-blueprint-nightCard/90 backdrop-blur-md border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-sm text-xs font-mono">
          <button
            onClick={setIsometricView}
            className={`px-2.5 py-1 rounded-lg transition ${
              viewMode === 'isometric'
                ? 'bg-blueprint-teal text-white font-bold shadow-xs'
                : 'text-blueprint-navy dark:text-gray-300 hover:text-blueprint-teal'
            }`}
          >
            3D Iso
          </button>
          <button
            onClick={setTopView}
            className={`px-2.5 py-1 rounded-lg transition ${
              viewMode === 'top'
                ? 'bg-blueprint-teal text-white font-bold shadow-xs'
                : 'text-blueprint-navy dark:text-gray-300 hover:text-blueprint-teal'
            }`}
          >
            Top 2D
          </button>
        </div>
      </div>

      {/* Camera & Zoom Action Buttons (Floating Top Right) */}
      <div className="absolute top-3 right-3 z-20 flex items-center gap-1.5">
        <button
          onClick={() => handleZoom(0.85)}
          className="p-2 rounded-xl bg-white/90 dark:bg-blueprint-nightCard/90 backdrop-blur-md border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-gray-200 hover:bg-blueprint-teal hover:text-white transition shadow-sm"
          title="Zoom In (+)"
          aria-label="Zoom in"
        >
          <ZoomIn className="w-4 h-4" />
        </button>

        <button
          onClick={() => handleZoom(1.15)}
          className="p-2 rounded-xl bg-white/90 dark:bg-blueprint-nightCard/90 backdrop-blur-md border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-gray-200 hover:bg-blueprint-teal hover:text-white transition shadow-sm"
          title="Zoom Out (-)"
          aria-label="Zoom out"
        >
          <ZoomOut className="w-4 h-4" />
        </button>

        <button
          onClick={handleResetView}
          className="p-2 rounded-xl bg-white/90 dark:bg-blueprint-nightCard/90 backdrop-blur-md border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-blueprint-navy dark:text-gray-200 hover:bg-blueprint-teal hover:text-white transition shadow-sm"
          title="Reset View"
          aria-label="Reset view"
        >
          <RotateCcw className="w-4 h-4" />
        </button>
      </div>

      {/* Orbit Hint Footer Bar */}
      <div className="absolute bottom-3 left-3 right-3 z-20 flex items-center justify-between pointer-events-none">
        <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-white/85 dark:bg-blueprint-nightCard/85 backdrop-blur-md border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-[11px] font-mono text-blueprint-navyMuted dark:text-gray-400">
          <Info className="w-3.5 h-3.5 text-blueprint-teal flex-shrink-0" />
          <span>Click & drag to orbit · Scroll to zoom · Click pulsing hotspots to inspect</span>
        </div>

        <div className="hidden sm:flex items-center gap-2 px-3 py-1.5 rounded-xl bg-blueprint-tealLight/80 dark:bg-blueprint-teal/15 border border-blueprint-teal/30 text-[11px] font-mono font-semibold text-blueprint-teal">
          <Layers className="w-3.5 h-3.5" />
          <span>ATmega328P DIP-28</span>
        </div>
      </div>

      {/* R3F 3D Canvas */}
      <Canvas shadows dpr={[1, 2]}>
        <PerspectiveCamera makeDefault position={[4.5, 4.2, 4.5]} fov={45} />
        
        {/* Lights */}
        <ambientLight intensity={0.8} />
        <directionalLight
          position={[6, 9, 5]}
          intensity={1.2}
          castShadow
          shadow-mapSize-width={1024}
          shadow-mapSize-height={1024}
        />
        <pointLight position={[-4, 4, -4]} intensity={0.4} color="#16B8B0" />
        <pointLight position={[3, 2, 3]} intensity={0.3} color="#FFFFFF" />

        <Suspense fallback={null}>
          <ArduinoUnoModel
            selectedHotspot={selectedHotspot}
            onSelectHotspot={(id) => setSelectedHotspot(id)}
          />
        </Suspense>

        <OrbitControls
          ref={controlsRef}
          enableDamping
          dampingFactor={0.06}
          minDistance={3}
          maxDistance={12}
          maxPolarAngle={Math.PI / 2 + 0.1} // Prevent going below ground
        />
      </Canvas>
    </div>
  );
};
