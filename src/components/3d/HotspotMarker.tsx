import React, { useState } from 'react';
import { Html } from '@react-three/drei';
import { HotspotData } from './HotspotsData';

interface HotspotMarkerProps {
  hotspot: HotspotData;
  isSelected: boolean;
  onSelect: (id: string) => void;
}

export const HotspotMarker: React.FC<HotspotMarkerProps> = ({
  hotspot,
  isSelected,
  onSelect
}) => {
  const [hovered, setHovered] = useState(false);

  return (
    <group position={hotspot.position}>
      {/* 3D Pulsing Spheres */}
      <mesh
        onClick={(e) => {
          e.stopPropagation();
          onSelect(hotspot.id);
        }}
        onPointerOver={(e) => {
          e.stopPropagation();
          setHovered(true);
          document.body.style.cursor = 'pointer';
        }}
        onPointerOut={(e) => {
          e.stopPropagation();
          setHovered(false);
          document.body.style.cursor = 'auto';
        }}
      >
        <sphereGeometry args={[0.13, 16, 16]} />
        <meshStandardMaterial
          color={isSelected ? '#00F5D4' : hovered ? '#16B8B0' : '#0D9488'}
          emissive={isSelected ? '#00F5D4' : '#16B8B0'}
          emissiveIntensity={isSelected ? 1.2 : hovered ? 0.8 : 0.4}
        />
      </mesh>

      {/* Pulsing Outer Aura */}
      <mesh>
        <ringGeometry args={[0.16, 0.22, 24]} />
        <meshBasicMaterial
          color="#16B8B0"
          transparent
          opacity={isSelected ? 0.9 : hovered ? 0.7 : 0.35}
          depthWrite={false}
        />
      </mesh>

      {/* HTML Label Card and Dashed Connector */}
      <Html
        position={[0, 0.15, 0]}
        center
        distanceFactor={10}
        zIndexRange={[100, 0]}
      >
        <div
          onClick={() => onSelect(hotspot.id)}
          className={`cursor-pointer transition-all duration-300 pointer-events-auto select-none ${
            isSelected || hovered ? 'scale-105 opacity-100 z-50' : 'opacity-85 hover:opacity-100'
          }`}
          style={{ transform: `translate(${hotspot.labelOffset[0]}px, ${hotspot.labelOffset[1]}px)` }}
        >
          {/* Label Card */}
          <div
            className={`px-3 py-1.5 rounded-xl border backdrop-blur-md shadow-lg transition-all flex items-center gap-2 whitespace-nowrap ${
              isSelected
                ? 'bg-blueprint-navy text-white border-blueprint-teal shadow-teal-glow ring-2 ring-blueprint-teal/40'
                : hovered
                ? 'bg-white/95 dark:bg-blueprint-nightCard text-blueprint-navy dark:text-white border-blueprint-teal'
                : 'bg-white/90 dark:bg-blueprint-nightCard/90 text-blueprint-navy dark:text-gray-200 border-blueprint-creamBorder dark:border-blueprint-nightBorder'
            }`}
          >
            <span className={`w-2 h-2 rounded-full ${isSelected ? 'bg-blueprint-teal animate-ping' : 'bg-blueprint-teal'}`} />
            <span className="text-xs font-mono font-bold tracking-tight">{hotspot.name}</span>
          </div>
        </div>
      </Html>
    </group>
  );
};
