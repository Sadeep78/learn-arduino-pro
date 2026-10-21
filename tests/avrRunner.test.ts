import { describe, it, expect } from 'vitest';
import { parseHex } from '../src/lib/avr/hexParser';
import { PRECOMPILED_HEX } from '../src/data/precompiledHex';

describe('AVR8js Hex Parser & Precompiled Sketches', () => {
  it('parses valid Intel HEX records into progBytes memory buffer', () => {
    const buffer = new Uint8Array(32768);
    const hex = PRECOMPILED_HEX['lesson-1'];
    expect(hex).toBeTruthy();

    const result = parseHex(hex, buffer);
    expect(result.bytesLoaded).toBeGreaterThan(0);
    expect(result.maxAddress).toBeGreaterThan(0);
  });

  it('handles EOF record properly', () => {
    const buffer = new Uint8Array(256);
    const sampleHex = ':020000040000FA\n:100000000C9434000C9441000C9441000C9441000C\n:00000001FF';
    const result = parseHex(sampleHex, buffer);
    expect(result.bytesLoaded).toBe(16);
    expect(buffer[0]).toBe(0x0C);
    expect(buffer[1]).toBe(0x94);
  });
});
