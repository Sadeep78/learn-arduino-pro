# Contributing to Learn Arduino Pro

Thank you for your interest in contributing to **Learn Arduino Pro**! This guide outlines how to add new curriculum lessons and electronic simulator components.

---

## 1. Adding a New Lesson

All curriculum lessons are strictly typed and located in `src/data/lessons.ts`.

### Step 1: Define Lesson Metadata
Add an object conforming to the `Lesson` schema in `src/data/lessons.ts`:

```typescript
{
  id: 'lesson-12',
  number: 12,
  title: 'I2C Temperature & Humidity Sensor',
  category: 'sensors',
  categoryLabel: 'DIGITAL BUSES',
  difficulty: 'Intermediate',
  xpReward: 200,
  estimatedMinutes: 15,
  description: 'Connect an I2C sensor using SDA (A4) and SCL (A5)...',
  summary: 'The Inter-Integrated Circuit (I2C) protocol...',
  hardwareParts: ['Arduino Uno R3', 'I2C Sensor', 'Jumper Wires'],
  learningGoals: ['Understand Two-Wire Interface', 'Scan I2C addresses'],
  schematicDescription: 'SDA to A4, SCL to A5, VCC to 5V, GND to GND.',
  codeSnippet: `// Your sample sketch\nvoid setup() {\n  Wire.begin();\n}\nvoid loop() {}`,
  precompiledHex: ':10000000...',
  initialCircuit: {
    components: [ ... ],
    wires: [ ... ]
  },
  checkpoints: [
    {
      id: 'cp12-1',
      titleKey: 'Initialize I2C bus',
      descriptionKey: 'Run simulation and observe I2C communication.',
      completed: false,
      type: 'run_simulation'
    }
  ],
  quiz: [
    {
      id: 'q12-1',
      question: 'Which pin on the Uno is hardware I2C Data (SDA)?',
      options: ['Pin A4', 'Pin A5', 'Pin 13', 'Pin 2'],
      correctIndex: 0,
      explanation: 'Pin A4 is wired to the ATmega328P SDA line.'
    }
  ],
  troubleshootingTips: [ ... ]
}
```

### Step 2: Add Translations
Add localized title and description strings in `src/i18n/locales/en.json`, `si.json`, and `ta.json`.

---

## 2. Adding a New Component

Electronic components are defined in two locations:

### Step 1: Catalog Definition
In `src/data/componentsCatalog.ts`, add a `ComponentCatalogItem` entry with datasheet summaries, pinouts, and typical applications.

### Step 2: Visual Canvas Part
1. Create a canvas component in `src/components/canvas/parts/YourPart.tsx`.
2. Register the component type in `src/types/simulator.ts` under `ComponentType`.
3. In `src/components/canvas/CircuitCanvas.tsx`, render your part inside the component mapping loop.
4. If the component interacts with the AVR8 core (e.g. analog voltage or digital interrupts), hook its property updates into `src/lib/avr/avrRunner.ts` or `src/lib/avr/sketchRunner.ts`.

---

## 3. Running Verification Tests

Before submitting a Pull Request, run the full test suite and verify production build:

```bash
# Run unit tests
npm run test

# Run TypeScript check & production bundler
npm run build
```
