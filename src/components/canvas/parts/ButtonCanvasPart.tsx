import React from 'react';
import { CircuitComponent } from '../../../types/simulator';

interface ButtonPartProps {
  component: CircuitComponent;
  isSelected: boolean;
  onPinClick: (pinId: string) => void;
  activeWiringPin: string | null;
  onTogglePress: () => void;
}

export const ButtonCanvasPart: React.FC<ButtonPartProps> = ({
  component,
  isSelected,
  onPinClick,
  activeWiringPin,
  onTogglePress
}) => {
  const isPressed = Boolean(component.properties?.isPressed);

  return (
    <div
      className={`relative w-20 h-20 rounded-xl bg-gray-200 dark:bg-gray-800 border-2 border-gray-400 p-2 flex flex-col items-center justify-between select-none shadow-md ${
        isSelected ? 'border-blueprint-teal shadow-teal-glow' : ''
      }`}
      style={{ transform: `rotate(${component.rotation}deg)` }}
    >
      {/* Top Pin 1 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPinClick('pin1');
        }}
        className={`w-3.5 h-3.5 rounded-full border-2 transition ${
          activeWiringPin === 'pin1'
            ? 'bg-blueprint-teal border-white animate-ping'
            : 'bg-gray-400 border-gray-600 hover:bg-blueprint-teal'
        }`}
        title="Button Contact Pin 1"
      />

      {/* Tactile Button Round Plunger (Clickable directly on canvas) */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onTogglePress();
        }}
        className={`w-10 h-10 rounded-full border-2 shadow-inner transition-transform active:scale-90 flex items-center justify-center ${
          isPressed
            ? 'bg-blueprint-teal text-white border-teal-300 scale-95 shadow-none'
            : 'bg-gray-900 text-gray-300 border-gray-700 hover:border-blueprint-teal'
        }`}
        title={isPressed ? 'Button Pressed (LOW)' : 'Click to Press Button'}
      >
        <span className="text-[8px] font-mono font-bold tracking-tighter">
          {isPressed ? 'DOWN' : 'PUSH'}
        </span>
      </button>

      {/* Bottom Pin 2 */}
      <button
        onClick={(e) => {
          e.stopPropagation();
          onPinClick('pin2');
        }}
        className={`w-3.5 h-3.5 rounded-full border-2 transition ${
          activeWiringPin === 'pin2'
            ? 'bg-blueprint-teal border-white animate-ping'
            : 'bg-gray-400 border-gray-600 hover:bg-blueprint-teal'
        }`}
        title="Button Contact Pin 2"
      />
    </div>
  );
};
