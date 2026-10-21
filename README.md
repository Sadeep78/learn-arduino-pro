# Learn Arduino Pro (EXPLORE · UNDERSTAND · BUILD)

> **Learn Arduino Pro** is an advanced, interactive, browser-based Arduino learning platform and in-browser hardware simulator engineered for beginners to intermediate learners.

Designed & Engineered by **Sadeep Sasanka**.

---

## 🌟 Key Highlights & Architecture

- **Original Brand & Blueprint Aesthetics**:
  - Warm cream "engineering blueprint" light theme (`#FAF8F5`, `#16B8B0` teal accents, `#0F1E36` navy text) and dark "night blueprint" theme (`#0B132B`).
  - Original infinity-circuit vector logo and circuit-trace background decorations.
  - JetBrains Mono typography for code and registers.
- **Phase 1: Core Learning UI**:
  - Collapsible responsive sidebar (Home, Lessons, Components, Simulator, Challenges, Projects, Community, Videos, Settings).
  - Dynamic TopBar: curriculum category progress ("BASICS 0/11"), real-time 16 MHz synchronized clock/date, XP & level badge, daily streak counter, and multi-language switcher.
  - Interactive 3D Arduino Uno (React Three Fiber / Three.js) with orbit, zoom, preset isometric & top-down camera views, and 8 pulsing teal hotspots with callouts.
  - Right information panel with 4 tabs: `OVERVIEW`, `PINOUT` (interactive color-coded explorer), `EXAMPLE` (starter C++ code), and `SPECIFICATIONS` (hardware specs).
  - Bottom Lessons Carousel featuring 11 beginner curriculum modules.
- **Phase 2: Real Circuit Simulator**:
  - AVR8js (AVR8 emulator) running ATmega328P instructions at 16 MHz in the browser.
  - Interactive drag-and-drop circuit canvas with grid-snapping (20px), wire drawing, wire color palette, component rotation, and undo/redo history.
  - Electronic components: Arduino Uno R3, Half Breadboard, 5mm LEDs, Common-Cathode RGB LED, Resistors with EIA 4-band color calculator, Tactile Push Buttons, 10k Potentiometer, Piezo Buzzer (with Web Audio API tone synthesis), SG90 Micro Servo (0-180° rotation), Photoresistor (LDR), HC-SR04 Ultrasonic Sonar, 16x2 Character LCD (I2C), and 7-Segment Display.
  - Automated circuit mistake detection: short circuits (5V directly to GND), LEDs without current-limiting resistors, and open circuits with friendly notifications.
  - Precompiled Intel HEX engine for offline operation + Vercel serverless compiler endpoint (`/api/compile`).
- **Phase 3: Smart Code Editor & Developer Tools**:
  - Monaco Editor with C++/Arduino syntax highlighting, autocompletion for standard Arduino API methods, hover documentation tooltips, code formatting, and copy actions.
  - Serial Monitor panel: simulated baud rates, user input transmission, autoscroll, and clear logs.
  - Serial Plotter: live HTML5 Canvas chart displaying real-time numeric telemetry.
  - Multi-channel digital Logic Analyzer waveform oscilloscope.
  - ATmega328P Register Inspector (`PORTB`, `PORTD`, Timers, ADC) and slow-motion step debugging.
  - Physical board hardware upload using Web Serial API (Optiboot / STK500).
- **Phase 4: AI Tutor**:
  - Context-aware "Ask the Tutor" chat assistant with current lesson, student code, and circuit warnings.
  - Secure serverless proxy route (`/api/tutor`) with rate limiting.
  - Intelligent offline fallback response engine.
- **Phase 5: Gamification & Progress**:
  - XP, levels, daily streaks, and 8 unlockable achievement badges.
  - Per-lesson multiple-choice quizzes and bug-fixing challenges with instant scoring.
  - Challenge Mode missions with automatic condition validation.
  - Auto-generated PDF Completion Certificate with student name and verification ID.
- **Phase 6: Accounts, Projects & Community**:
  - Supabase integration with guest mode fallback.
  - Save, load, rename, duplicate, and delete projects.
  - Export and import projects as JSON.
  - Community gallery with project remixing and likes.
- **Phase 7: Components Library & Videos**:
  - 20+ component catalog with datasheet summaries, pinouts, circuit tips, and "Use in simulator" actions.
  - Video masterclass with timestamped chapters and synced transcripts.
- **Cross-Cutting**:
  - i18n support: English, Sinhala (සිංහල), and Tamil (தமிழ்).
  - PWA: Progressive Web App with offline service worker.
  - Responsive layouts: desktop split view, tablet drawers, mobile bottom navigation.

---

## 🚀 Quick Start & Local Run

### Prerequisites
- Node.js 18+ (tested on Node v24)
- npm 9+

### Installation
```bash
git clone <repo-url>
cd learn-arduino-pro
npm install
```

### Development Server
```bash
npm run dev
```
Open `http://localhost:5173` in your browser.

### Run Unit Tests
```bash
npm run test
```

### Production Build
```bash
npm run build
```
Generates optimized bundle in `./dist` with PWA service worker precaching.

---

## 🔑 Environment Variables

Create a `.env` file in the project root:

```env
# Optional: Anthropic Claude API Key for the AI Tutor proxy
ANTHROPIC_API_KEY=your_anthropic_api_key_here

# Optional: Supabase Auth & Cloud Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key_here
```

*(Note: The platform functions 100% in Guest Mode with full simulation and AI tutor capabilities even if these variables are omitted).*

---

## ☁️ Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm install -g vercel
   ```
2. Link & Deploy:
   ```bash
   vercel
   ```
3. Set environment variables in the Vercel Project Settings (`ANTHROPIC_API_KEY`, etc.).
4. The included `vercel.json` automatically maps the `/api/*` serverless functions and routes client URLs to `index.html`.

---

## 📜 Footer Credit

Platform designed, engineered, and maintained by **Sadeep Sasanka**.
License: MIT
