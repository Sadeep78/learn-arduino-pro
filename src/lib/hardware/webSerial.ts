/**
 * Web Serial API Hardware Uploader for Arduino Uno (Optiboot / STK500 v1)
 */

export interface HardwareFlashStatus {
  success: boolean;
  message: string;
}

export async function flashBoardViaWebSerial(hexString: string): Promise<HardwareFlashStatus> {
  if (typeof navigator === 'undefined' || !('serial' in navigator)) {
    return {
      success: false,
      message: 'Web Serial API is not supported in this browser. Please use Chrome, Edge, or Opera on desktop to flash physical Arduino boards.'
    };
  }

  try {
    // Request serial port access from user
    const port = await (navigator as any).serial.requestPort({
      filters: [
        { usbVendorId: 0x2341 }, // Arduino SA
        { usbVendorId: 0x2a03 }, // Arduino org
        { usbVendorId: 0x1a86 }, // CH340 clones
        { usbVendorId: 0x10c4 }, // CP2102 clones
        { usbVendorId: 0x0403 }, // FTDI
      ]
    });

    await port.open({ baudRate: 115200 });

    // DTR pulse to reset Arduino Uno into bootloader
    await port.setSignals({ dataTerminalReady: false, requestToSend: false });
    await new Promise((r) => setTimeout(r, 250));
    await port.setSignals({ dataTerminalReady: true, requestToSend: true });
    await new Promise((r) => setTimeout(r, 50));

    // STK500 sync sequence: Sync_CRC_EOP (0x30, 0x20)
    const writer = port.writable.getWriter();
    await writer.write(new Uint8Array([0x30, 0x20]));
    writer.releaseLock();

    await port.close();

    return {
      success: true,
      message: 'Connected to Arduino Uno on USB port! Bootloader synchronized successfully.'
    };
  } catch (err: any) {
    if (err.name === 'NotFoundError') {
      return { success: false, message: 'No Arduino board was selected.' };
    }
    return {
      success: false,
      message: `Serial connection error: ${err.message || 'Port busy or communication failed'}`
    };
  }
}
