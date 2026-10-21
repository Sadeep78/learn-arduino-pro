/**
 * Intel HEX format parser for AVR8js progBytes memory
 */

export function parseHex(hex: string, targetBuffer: Uint8Array): { bytesLoaded: number; minAddress: number; maxAddress: number } {
  const lines = hex.split('\n');
  let bytesLoaded = 0;
  let minAddress = Infinity;
  let maxAddress = 0;
  let upperAddress = 0;

  for (const line of lines) {
    const trimmed = line.trim();
    if (!trimmed.startsWith(':')) continue;

    const byteCount = parseInt(trimmed.slice(1, 3), 16);
    const address = parseInt(trimmed.slice(3, 7), 16);
    const recordType = parseInt(trimmed.slice(7, 9), 16);

    if (recordType === 0) {
      // Data Record
      const fullAddress = upperAddress + address;
      for (let i = 0; i < byteCount; i++) {
        const byte = parseInt(trimmed.slice(9 + i * 2, 11 + i * 2), 16);
        if (fullAddress + i < targetBuffer.length) {
          targetBuffer[fullAddress + i] = byte;
          bytesLoaded++;
          if (fullAddress + i < minAddress) minAddress = fullAddress + i;
          if (fullAddress + i > maxAddress) maxAddress = fullAddress + i;
        }
      }
    } else if (recordType === 1) {
      // End of File
      break;
    } else if (recordType === 2) {
      // Extended Segment Address
      upperAddress = parseInt(trimmed.slice(9, 13), 16) << 4;
    } else if (recordType === 4) {
      // Extended Linear Address
      upperAddress = parseInt(trimmed.slice(9, 13), 16) << 16;
    }
  }

  return {
    bytesLoaded,
    minAddress: minAddress === Infinity ? 0 : minAddress,
    maxAddress
  };
}
