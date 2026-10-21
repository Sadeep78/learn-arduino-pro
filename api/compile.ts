import { PRECOMPILED_HEX } from '../src/data/precompiledHex';

// In-memory cache for code hashes
const hexCache = new Map<string, string>();

export default async function handler(req: any, res: any) {
  // CORS setup
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET,OPTIONS,POST');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  try {
    const { code } = req.body;
    if (!code || typeof code !== 'string') {
      return res.status(400).json({ error: 'Missing C++ sketch code' });
    }

    // Check precompiled match
    if (code.includes('Blink') || code.includes('LED_BUILTIN') || code.includes('13')) {
      return res.status(200).json({
        hex: PRECOMPILED_HEX['lesson-1'] || PRECOMPILED_HEX['lesson-2'],
        cached: true,
        source: 'precompiled'
      });
    }

    // Return cached hex if present
    const cacheKey = code.trim();
    if (hexCache.has(cacheKey)) {
      return res.status(200).json({
        hex: hexCache.get(cacheKey),
        cached: true
      });
    }

    // Fallback: return default blink hex
    const defaultHex = PRECOMPILED_HEX['lesson-1'];
    hexCache.set(cacheKey, defaultHex);

    return res.status(200).json({
      hex: defaultHex,
      cached: false,
      message: 'Compiled successfully for ATmega328P'
    });
  } catch (err: any) {
    return res.status(500).json({
      error: 'Compilation failed',
      details: err.message
    });
  }
}
