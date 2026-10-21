// In-memory rate limiting map: IP -> timestamp[]
const rateLimits = new Map<string, number[]>();

export default async function handler(req: any, res: any) {
  res.setHeader('Access-Control-Allow-Credentials', 'true');
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST,OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  // Rate Limiting: max 15 requests per minute per IP
  const ip = (req.headers && req.headers['x-forwarded-for']) || req.socket?.remoteAddress || 'local';
  const now = Date.now();
  const timestamps = rateLimits.get(ip) || [];
  const recent = timestamps.filter((t) => now - t < 60000);

  if (recent.length >= 15) {
    return res.status(429).json({
      error: 'Rate limit exceeded. Please wait a minute before asking the AI Tutor again.'
    });
  }
  recent.push(now);
  rateLimits.set(ip, recent);

  const { message, lessonTitle, code, warnings, hintStage } = req.body || {};

  const apiKey = typeof process !== 'undefined' ? process.env?.ANTHROPIC_API_KEY : undefined;

  if (apiKey) {
    try {
      const systemPrompt = `You are "Arduino Tutor Pro", an encouraging, pedagogically skilled embedded systems engineering teacher. 
You guide beginners patiently. You are aware of the student's current lesson (${lessonTitle || 'General Sketch'}), their code, and any circuit warnings.
When asked for a hint, give progressive hints (stage ${hintStage || 1}) without giving away the complete solution immediately.
Explain electronics principles (Ohm's law, GPIO, PWM, pull-ups) with clear analogies.`;

      const userContext = `Current Lesson: ${lessonTitle || 'Custom Circuit'}
Circuit Warnings: ${JSON.stringify(warnings || [])}
Student's Code:
\`\`\`cpp
${code || '// Empty sketch'}
\`\`\`

Student's Question:
${message}`;

      const response = await fetch('https://api.anthropic.com/v1/messages', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'x-api-key': apiKey,
          'anthropic-version': '2023-06-01'
        },
        body: JSON.stringify({
          model: 'claude-3-5-sonnet-20241022',
          max_tokens: 800,
          system: systemPrompt,
          messages: [{ role: 'user', content: userContext }]
        })
      });

      if (!response.ok) {
        throw new Error(`Anthropic API returned status ${response.status}`);
      }

      const data = await response.json();
      const reply = data.content?.[0]?.text || 'No response generated.';
      return res.status(200).json({ reply });
    } catch (e: any) {
      console.error('Claude API call failed, using intelligent fallback', e);
    }
  }

  // Intelligent Context-Aware Fallback Engine (Runs offline & without API key!)
  let reply = '';
  const msgLower = (message || '').toLowerCase();

  if (msgLower.includes('why isn') || msgLower.includes('not blinking') || msgLower.includes('not work')) {
    if (warnings && warnings.length > 0) {
      reply = `I checked your circuit and noticed: **${warnings[0].message}**.\n\n${warnings[0].helpText || 'Check your connections.'}\n\nAlso make sure:\n1. Your pin number in \`pinMode(pin, OUTPUT)\` matches where the wire is connected.\n2. \`digitalWrite(pin, HIGH)\` is followed by a \`delay()\` so human eyes can perceive the flash!`;
    } else {
      reply = `Here are the top 3 reasons LEDs don't blink in Arduino:\n\n1. **Pin mismatch**: Is your wire connected to the same pin number specified in \`pinMode\` and \`digitalWrite\`?\n2. **Polarity**: The longer lead (Anode) must go towards the 5V / Arduino signal pin, and the flat lead (Cathode) must go to GND.\n3. **Loop timing**: If you don't have \`delay(500)\` between HIGH and LOW, the LED toggles millions of times per second and appears continuously on or off!`;
    }
  } else if (msgLower.includes('hint')) {
    const stage = hintStage || 1;
    if (stage === 1) {
      reply = `💡 **Hint 1/3 (Gentle Nudge):** Think about which Arduino pin should be listening as an input vs which should drive current as an output. Check your \`setup()\` function!`;
    } else if (stage === 2) {
      reply = `💡 **Hint 2/3 (Closer):** When reading an analog sensor like a potentiometer or photoresistor, remember that \`analogRead()\` returns **0 to 1023**, while PWM \`analogWrite()\` expects **0 to 255**. Can you use \`map()\`?`;
    } else {
      reply = `💡 **Hint 3/3 (Direct Guidance):** Try writing:\n\`\`\`cpp\nint sensorVal = analogRead(A0);\nint pwmVal = map(sensorVal, 0, 1023, 0, 255);\nanalogWrite(9, pwmVal);\n\`\`\``;
    }
  } else if (msgLower.includes('explain')) {
    reply = `Here is a breakdown of your sketch:\n\n- **setup()**: Executes once when the board powers on or resets. You use it to define pin modes (\`pinMode\`) and start serial communications (\`Serial.begin\`).\n- **loop()**: Runs continuously in an infinite loop as long as the board has power.\n- **digitalWrite**: Sets the pin to 5V (HIGH) or 0V (LOW).\n- **delay**: Freezes execution for milliseconds so actions occur at human-observable speeds.`;
  } else if (msgLower.includes('quiz')) {
    reply = `🧠 **Quick Check:** What does \`analogRead(A0)\` return when the voltage on pin A0 is exactly 2.5 Volts?\n\nA) 128\nB) 255\nC) 512\nD) 1023\n\n*(Think about the 10-bit resolution of the ATmega328P ADC!)*`;
  } else {
    reply = `Hello maker! I am your AI Arduino Tutor. I can inspect your circuit connections, debug compiler errors, explain C++ code line-by-line, or give you progressive hints for your project. What would you like to explore?`;
  }

  return res.status(200).json({ reply });
}
