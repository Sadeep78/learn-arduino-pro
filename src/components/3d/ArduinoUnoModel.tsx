import React, { useRef } from 'react';
import * as THREE from 'three';
import { HOTSPOTS } from './HotspotsData';
import { HotspotMarker } from './HotspotMarker';

interface ArduinoUnoModelProps {
  selectedHotspot: string | null;
  onSelectHotspot: (id: string) => void;
}

export const ArduinoUnoModel: React.FC<ArduinoUnoModelProps> = ({
  selectedHotspot,
  onSelectHotspot
}) => {
  const groupRef = useRef<THREE.Group>(null);

  return (
    <group ref={groupRef} dispose={null}>
      {/* 1. PCB Main Board (Classic Deep Teal / Italian Blue with silkscreen traces) */}
      <mesh position={[0, 0, 0]} castShadow receiveShadow>
        <boxGeometry args={[5.3, 0.16, 3.8]} />
        <meshStandardMaterial
          color="#006978" // Teal engineering board
          roughness={0.45}
          metalness={0.15}
        />
      </mesh>

      {/* PCB Silkscreen White Label Area */}
      <mesh position={[0, 0.085, -0.1]} receiveShadow>
        <planeGeometry args={[4.8, 3.3]} />
        <meshStandardMaterial
          color="#00838F"
          roughness={0.5}
        />
      </mesh>

      {/* Silkscreen "ARDUINO UNO" Banner Plate */}
      <mesh position={[0.4, 0.09, -0.6]}>
        <planeGeometry args={[2.2, 0.4]} />
        <meshStandardMaterial color="#E0F2F1" roughness={0.9} />
      </mesh>

      {/* 4 Corner Mounting Holes (Metallic rings) */}
      {[
        [-2.3, 0.09, -1.6],
        [-2.3, 0.09, 1.6],
        [2.3, 0.09, -1.1],
        [2.3, 0.09, 1.6],
      ].map((pos, idx) => (
        <group key={idx} position={pos as [number, number, number]}>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <ringGeometry args={[0.12, 0.22, 16]} />
            <meshStandardMaterial color="#D1D5DB" metalness={0.8} roughness={0.2} />
          </mesh>
          <mesh rotation={[-Math.PI / 2, 0, 0]}>
            <circleGeometry args={[0.11, 16]} />
            <meshBasicMaterial color="#004D40" />
          </mesh>
        </group>
      ))}

      {/* 2. USB Type-B Port (Silver metal housing) */}
      <group position={[-2.15, 0.45, -0.9]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.2, 0.75, 0.95]} />
          <meshStandardMaterial
            color="#D1D5DB"
            metalness={0.9}
            roughness={0.2}
          />
        </mesh>
        {/* USB Inside cavity */}
        <mesh position={[-0.61, 0, 0]}>
          <planeGeometry args={[0.6, 0.7]} />
          <meshBasicMaterial color="#111827" />
        </mesh>
      </group>

      {/* 3. DC Barrel Jack (Black cylindrical body) */}
      <group position={[-2.3, 0.45, 1.25]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[1.1, 0.8, 0.9]} />
          <meshStandardMaterial color="#1E293B" roughness={0.6} />
        </mesh>
        {/* Center metallic pin */}
        <mesh position={[-0.56, 0, 0]} rotation={[0, 0, Math.PI / 2]}>
          <cylinderGeometry args={[0.1, 0.1, 0.2, 16]} />
          <meshStandardMaterial color="#9CA3AF" metalness={0.8} />
        </mesh>
      </group>

      {/* 4. ATmega328P DIP-28 Microcontroller */}
      <group position={[0.55, 0.25, 0.45]}>
        {/* Socket */}
        <mesh position={[0, -0.06, 0]}>
          <boxGeometry args={[2.2, 0.12, 0.72]} />
          <meshStandardMaterial color="#111827" roughness={0.7} />
        </mesh>
        {/* IC Body */}
        <mesh position={[0, 0.05, 0]} castShadow>
          <boxGeometry args={[2.1, 0.16, 0.65]} />
          <meshStandardMaterial color="#1F2937" roughness={0.3} metalness={0.1} />
        </mesh>
        {/* Silver notch on left */}
        <mesh position={[-1.0, 0.12, 0]}>
          <cylinderGeometry args={[0.08, 0.08, 0.05, 16]} />
          <meshStandardMaterial color="#6B7280" />
        </mesh>
        {/* DIP Pins along both sides */}
        {Array.from({ length: 14 }).map((_, i) => (
          <React.Fragment key={i}>
            <mesh position={[-0.9 + i * 0.14, -0.05, 0.36]}>
              <boxGeometry args={[0.04, 0.15, 0.08]} />
              <meshStandardMaterial color="#E5E7EB" metalness={0.85} roughness={0.2} />
            </mesh>
            <mesh position={[-0.9 + i * 0.14, -0.05, -0.36]}>
              <boxGeometry args={[0.04, 0.15, 0.08]} />
              <meshStandardMaterial color="#E5E7EB" metalness={0.85} roughness={0.2} />
            </mesh>
          </React.Fragment>
        ))}
      </group>

      {/* 5. 16 MHz Quartz Crystal Oscillator (Silver oval can) */}
      <group position={[-0.75, 0.25, 0.2]}>
        <mesh rotation={[0, 0, Math.PI / 2]} castShadow>
          <cylinderGeometry args={[0.15, 0.15, 0.7, 16]} />
          <meshStandardMaterial color="#E5E7EB" metalness={0.9} roughness={0.15} />
        </mesh>
      </group>

      {/* 6. Digital Pin Headers (D0 - D13, GND, AREF) */}
      <group position={[0.2, 0.35, -1.65]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.2, 0.5, 0.3]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>
        {/* Pin Sockets (Gold holes) */}
        {Array.from({ length: 16 }).map((_, i) => (
          <mesh key={i} position={[-1.4 + i * 0.19, 0.26, 0]}>
            <boxGeometry args={[0.09, 0.02, 0.09]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* 7. Power & Analog Pin Headers */}
      <group position={[0.2, 0.35, 1.65]}>
        <mesh castShadow receiveShadow>
          <boxGeometry args={[3.0, 0.5, 0.3]} />
          <meshStandardMaterial color="#111827" roughness={0.8} />
        </mesh>
        {/* Pin Sockets */}
        {Array.from({ length: 14 }).map((_, i) => (
          <mesh key={i} position={[-1.3 + i * 0.2, 0.26, 0]}>
            <boxGeometry args={[0.09, 0.02, 0.09]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.7} />
          </mesh>
        ))}
      </group>

      {/* 8. Reset Push Button (Silver base + Red plunger) */}
      <group position={[-2.2, 0.3, -1.65]}>
        <mesh>
          <boxGeometry args={[0.4, 0.25, 0.4]} />
          <meshStandardMaterial color="#9CA3AF" metalness={0.8} />
        </mesh>
        <mesh position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.1, 0.1, 0.1, 16]} />
          <meshStandardMaterial color="#DC2626" roughness={0.3} />
        </mesh>
      </group>

      {/* 9. Indicator LEDs */}
      {/* "L" Built-in LED on Pin 13 (Yellow) */}
      <group position={[-0.3, 0.12, -1.2]}>
        <mesh>
          <boxGeometry args={[0.1, 0.06, 0.14]} />
          <meshStandardMaterial color="#F59E0B" emissive="#F59E0B" emissiveIntensity={0.8} />
        </mesh>
      </group>

      {/* TX/RX LEDs (Green) */}
      <group position={[-0.3, 0.12, -0.85]}>
        <mesh position={[0, 0, -0.1]}>
          <boxGeometry args={[0.08, 0.05, 0.1]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.6} />
        </mesh>
        <mesh position={[0, 0, 0.1]}>
          <boxGeometry args={[0.08, 0.05, 0.1]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.6} />
        </mesh>
      </group>

      {/* ON Power LED (Green) */}
      <group position={[1.4, 0.12, -1.2]}>
        <mesh>
          <boxGeometry args={[0.1, 0.06, 0.14]} />
          <meshStandardMaterial color="#10B981" emissive="#10B981" emissiveIntensity={0.9} />
        </mesh>
      </group>

      {/* 10. ICSP Header (6 gold pins) */}
      <group position={[2.1, 0.3, 0.3]}>
        {[
          [-0.1, 0, -0.1],
          [-0.1, 0, 0.1],
          [0, 0, -0.1],
          [0, 0, 0.1],
          [0.1, 0, -0.1],
          [0.1, 0, 0.1],
        ].map((p, idx) => (
          <mesh key={idx} position={p as [number, number, number]}>
            <cylinderGeometry args={[0.025, 0.025, 0.4, 8]} />
            <meshStandardMaterial color="#F59E0B" metalness={0.9} />
          </mesh>
        ))}
      </group>

      {/* Hotspot Markers Overlay */}
      {HOTSPOTS.map((hotspot) => (
        <HotspotMarker
          key={hotspot.id}
          hotspot={hotspot}
          isSelected={selectedHotspot === hotspot.id}
          onSelect={onSelectHotspot}
        />
      ))}
    </group>
  );
};
