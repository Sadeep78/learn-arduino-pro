import { CircuitCheckItem } from '../../types/simulator';

export interface CodeFixInfo {
  fixable: boolean;
  pin?: number;
  missingLine?: string;
  explanation?: string;
  fixType?: 'pinMode_output' | 'pinMode_pullup' | 'pin_mismatch';
}

/**
 * Analyzes a failed circuit check item and determines if an automatic C++ sketch fix is available.
 */
export function detectCodeFix(item: CircuitCheckItem, code: string): CodeFixInfo {
  if (item.status !== 'fail') {
    return { fixable: false };
  }

  // 1. Missing pinMode(X, OUTPUT)
  const pinOutputMatch =
    item.label.match(/pinMode\((\d+),\s*OUTPUT\)/i) ||
    item.details.match(/pinMode\((\d+),\s*OUTPUT\)/i) ||
    item.id.match(/chk-led-code-pinmode-(\d+)/i);

  if (pinOutputMatch) {
    const pin = parseInt(pinOutputMatch[1], 10);
    return {
      fixable: true,
      pin,
      missingLine: `pinMode(${pin}, OUTPUT);`,
      explanation: `By default, ATmega328P pins start in high-impedance INPUT mode for safety. Calling pinMode(${pin}, OUTPUT) activates the internal transistors so the board can output 5V current to light your component.`,
      fixType: 'pinMode_output'
    };
  }

  // 2. Missing pinMode(X, INPUT_PULLUP)
  const pullupMatch =
    item.label.match(/pinMode\((\d+),\s*INPUT_PULLUP\)/i) ||
    item.details.match(/pinMode\((\d+),\s*INPUT_PULLUP\)/i);

  if (pullupMatch) {
    const pin = parseInt(pullupMatch[1], 10);
    return {
      fixable: true,
      pin,
      missingLine: `pinMode(${pin}, INPUT_PULLUP);`,
      explanation: `Buttons wired to GND without an external resistor require the microcontroller's internal 20kΩ pull-up resistor. Calling pinMode(${pin}, INPUT_PULLUP) prevents a floating, noisy input.`,
      fixType: 'pinMode_pullup'
    };
  }

  // 3. Generic pin mismatch (e.g. "Code drives Pin 13, but LED is connected to Pin 8")
  if (item.details.toLowerCase().includes('pinmode') || item.label.toLowerCase().includes('pinmode')) {
    const numMatch = item.details.match(/Pin\s*(\d+)/i) || item.label.match(/Pin\s*(\d+)/i);
    if (numMatch) {
      const pin = parseInt(numMatch[1], 10);
      return {
        fixable: true,
        pin,
        missingLine: `pinMode(${pin}, OUTPUT);`,
        explanation: `Your component wire is connected to Digital Pin ${pin}. Add pinMode(${pin}, OUTPUT) so the sketch enables power output to this pin.`,
        fixType: 'pinMode_output'
      };
    }
  }

  return { fixable: false };
}

/**
 * Inserts the missing line inside void setup() {} cleanly, preserving formatting.
 */
export function applyCodeFix(code: string, lineToInsert: string): string {
  const trimmedLine = lineToInsert.trim();
  if (code.includes(trimmedLine)) {
    return code; // already present
  }

  // Locate void setup()
  const setupRegex = /(void\s+setup\s*\(\s*\)\s*\{)/;
  if (setupRegex.test(code)) {
    return code.replace(setupRegex, `$1\n  ${trimmedLine}`);
  }

  // If no setup() exists in code, prepend one
  return `void setup() {\n  ${trimmedLine}\n}\n\n` + code;
}
