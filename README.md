<div align="center">

# ⚡ Learn Arduino Pro
### 🚀 DESIGN · SIMULATE · INNOVATE · MASTER PHYSICAL COMPUTING

**An advanced, full-featured web-based Arduino learning platform, interactive 3D digital twin, and real-time electronic circuit simulator with cycle-accurate AVR emulation.**

[![License: MIT](https://img.shields.io/badge/License-MIT-0f766e?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=1e1b4b)](LICENSE)
[![React 18](https://img.shields.io/badge/React-18.3-0369a1?style=for-the-badge&logo=react&logoColor=white&labelColor=172554)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-1d4ed8?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0f172a)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-7e22ce?style=for-the-badge&logo=vite&logoColor=white&labelColor=3b0764)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-047857?style=for-the-badge&logo=tailwind-css&logoColor=white&labelColor=064e3b)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-c2410c?style=for-the-badge&logo=three.js&logoColor=white&labelColor=431407)](https://threejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-27%20Passing-15803d?style=for-the-badge&logo=vitest&logoColor=white&labelColor=365314)](https://vitest.dev/)
[![Playwright](https://img.shields.io/badge/Playwright-5%20Passing-2ea44f?style=for-the-badge&logo=playwright&logoColor=white&labelColor=1b4d24)](https://playwright.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-86198f?style=for-the-badge&logo=pwa&logoColor=white&labelColor=4c0519)](https://web.dev/progressive-web-apps/)

[✨ GitHub Repository](https://github.com/Sadeep78/learn-arduino-pro) • [📖 Documentation](#-curriculum--learning-path) • [🛠️ Circuit Simulator](#-in-browser-circuit-simulator-avr8js) • [💡 Component Catalog](#-simulated-electronics-library) • [🎥 Video Masterclass](#-interactive-video-masterclass-77-chapters) • [📜 License](LICENSE)

</div>

<br/>

## 📖 Table of Contents

- [🌟 Overview](#-overview)
- [🎨 Engineering Blueprint Aesthetics](#-engineering-blueprint-aesthetics)
- [✨ Core Features](#-core-features)
  - [🕹️ Interactive 3D Arduino Uno Board](#️-interactive-3d-arduino-uno-board)
  - [⚡ In-Browser Circuit Simulator (AVR8js)](#-in-browser-circuit-simulator-avr8js)
  - [📋 Electrical Rules Engine & Live Circuit Check](#-electrical-rules-engine--live-circuit-check)
  - [💻 Professional Code Editor & Telemetry](#-professional-code-editor--telemetry)
  - [🤖 Context-Aware AI Tutor](#-context-aware-ai-tutor)
  - [🏆 Gamification, Badges & PDF Certificate](#-gamification-badges--pdf-certificate)
  - [🌐 Multi-Language Localization (i18n)](#-multi-language-localization-i18n)
  - [🎥 Interactive Video Masterclass (77 Chapters)](#-interactive-video-masterclass-77-chapters)
- [📚 Curriculum & Learning Path](#-curriculum--learning-path)
- [🧰 Simulated Electronics Library](#-simulated-electronics-library)
- [🛠️ Architecture & Tech Stack](#️-architecture--tech-stack)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [🔑 Environment Variables](#-environment-variables)
- [🧪 Running Tests & Build](#-running-tests--build)
- [🤝 Contributing](#-contributing)
- [📜 License & Credits](#-license--credits)

---

## 🌟 Overview

**Learn Arduino Pro** is an open-source, full-featured web application engineered to transform how students, makers, and embedded engineers learn physical computing. By combining:

1. 🕹️ **A photorealistic 3D Arduino Uno R3 digital twin** with interactive callout hotspots and synchronized pinout explorers,
2. ⚡ **A cycle-accurate 16 MHz AVR CPU emulator (`AVR8js`)** running genuine compiled C++ Arduino sketches right in the browser,
3. 📐 **A distraction-free circuit studio** with drag-and-drop breadboards, real-time wire drawing, electrical connectivity checking, and smooth pan/zoom,
4. 📋 **An intelligent Circuit Check panel & "Fix it for me" assistant** that detects reversed LEDs, missing resistors, wrong pins, or missing `pinMode()` and automatically injects fixes,
5. 💻 **Professional developer tools** including a multi-channel digital logic analyzer, oscilloscope, ATmega328P register inspector, and Web Serial USB hardware flashing,
6. 🤖 **An intelligent context-aware AI Tutor** powered by Anthropic's Claude 3.5 Sonnet, and
7. 🎥 **An embedded 4-hour Arduino Masterclass** with 77 synchronized chapters and instant 1-click simulator loading,

Learn Arduino Pro provides a complete embedded systems laboratory directly in your browser with zero installation required.

---

## 🎨 Engineering Blueprint Aesthetics

The interface is built around an original, high-precision **Engineering Blueprint** design language:

| Visual Element | Specification | Description |
| :--- | :--- | :--- |
| ☀️ **Light Theme** | `#FAF8F5` | Warm blueprint cream with faint schematic grid traces |
| 🌙 **Night Theme** | `#0B132B` | Deep navy blueprint with glowing phosphorescent accents |
| ⚡ **Current Accent** | `#16B8B0` | Electric Teal representing active voltage and circuit flow |
| 🔤 **Typography** | `Plus Jakarta Sans` & `JetBrains Mono` | Clean geometric UI typography & monospace code font |
| 📐 **Visual Polish** | 12–16px rounded engineering cards | Soft isometric depth, glassmorphism panels & accessible contrast |

---

## ✨ Core Features

### 🕹️ Interactive 3D Arduino Uno Board
- 🌐 **WebGL 3D Engine**: Built with `@react-three/fiber` and `@react-three/drei`.
- 🔄 **Full 360° Camera Control**: Smooth orbital rotation, pan, zoom, and instant view-reset presets (*Isometric*, *Top-Down Pinout*, *Front*).
- 📍 **8 Pulsing Hotspots**: Interactive callout markers over essential board sections:
  - 🔌 USB Type-B Interface & Serial Communication
  - ⚡ DC Barrel Jack & 7–12V Voltage Regulator
  - 🧠 ATmega328P 8-bit Microcontroller IC
  - 🔢 Digital I/O Pins & PWM Channels (Pins 0–13)
  - 📊 Analog Input Header (A0–A5)
  - ⚡ Power Distribution Rails (5V, 3.3V, GND, VIN)
  - ⏱️ 16 MHz Crystal Oscillator
  - 🔄 Tactile Reset Switch
- 📋 **Synchronized Right Panel**: Clicking any hotspot opens a detailed dossier with pinout maps, electrical ratings, schematic excerpts, and starter C++ code.

---

### ⚡ In-Browser Circuit Simulator (AVR8js)
- ⚡ **16 MHz Cycle-Accurate Emulation**: Directly executes AVR machine instructions in client WebAssembly/JavaScript.
- 📐 **Dedicated, Clean Layout Modes**:
  - `[ 🔌 Circuit ]`: Full-width hardware workbench with unobstructed breadboard, Arduino Uno, and collapsible component palette.
  - `[ 💻 sketch.ino ]`: Focused Arduino IDE editor with integrated Serial Monitor & Telemetry.
  - `[ 📋 Circuit Check ]`: Dedicated verification dashboard with visual checkmarks and the "Fix it for me" code injector.
  - `[ 🔀 Split ]`: Resizable side-by-side studio (Canvas on Left, Code Editor on Right).
- 🔍 **Pan, Zoom & "Fit to View"**: Seamless canvas dragging, scroll-wheel zooming (40% to 200%), and automatic 1-click circuit centering.
- 💾 **Save to "My Projects"**: Save custom circuits and sketches to local storage with custom project titles.

---

### 📋 Electrical Rules Engine & Live Circuit Check
The simulator converts components, wires, and breadboard strips into an electrical netlist using Union-Find algorithms:
- ⚡ **Short Circuit Protection**: Detects direct connections between `5V` and `GND` and halts simulation with clear warnings.
- 💡 **Polarity & Current-Limiting Checks**:
  - Confirms LED Anode connects to positive voltage and Cathode to GND.
  - Warns if LEDs lack a 220Ω series current-limiting resistor to prevent burnt out states.
- 🔘 **Floating Input Detection**: Warns when buttons lack pull-up/pull-down resistors.
- 🔧 **"Fix it for me" Assistant**: When code issues are detected (e.g. missing `pinMode(8, OUTPUT)`), a single click cleanly injects the required configuration into `void setup()`.

---

### 💻 Professional Code Editor & Telemetry
- 📝 **Monaco Editor Studio**:
  - Full C++ syntax highlighting, autocomplete, and bracket matching.
  - Pre-populated starter code for each curriculum lesson.
  - Inline error diagnostics and compilation status.
- 📟 **Simulated Serial Monitor**: Configurable baud rates (9600 to 115200), bi-directional user text transmission, autoscroll, and log clearing.
- 📈 **Real-Time Serial Plotter**: High-performance HTML5 Canvas graphing tool that parses numeric serial streams into multi-variable graphs.
- 🔬 **Digital Logic Analyzer & Registers**: 5-channel waveform oscilloscope capturing pin transitions over time alongside live bitwise inspection of `PORTB`, `PORTD`, `DDRB`, and `DDRD`.
- 🔌 **Physical Web Serial Flashing**: Flash compiled `.hex` files directly to a physical Arduino board over USB using Web Serial and the STK500/Optiboot protocol!

---

### 🤖 Context-Aware AI Tutor
- 🧠 **Context-Informed Help**: Automatically analyzes your current lesson, circuit wiring netlist, sketch code, and runtime serial output.
- 💡 **One-Click Prompts**:
  - *"Explain this code line by line"*
  - *"Why isn't my LED blinking?"*
  - *"Give me a progressive hint"*
  - *"Quiz me on this concept"*
- 🔒 **Zero Bundle Leaks**: API calls route through a secure serverless proxy (`/api/tutor`) with intelligent offline fallback.

---

### 🏆 Gamification, Badges & PDF Certificate
- 🌟 **XP & Level Progression**: Earn experience points for completing lessons, fixing circuits, and passing quizzes.
- 🔥 **Daily Streak Tracker**: Stay consistent with local and cloud streak counters.
- 🎖️ **8 Unlockable Achievements**: *First Spark*, *Blink Master*, *Button Wizard*, *Analog Alchemist*, *Color Maestro*, *Tone Architect*, *Sonic Explorer*, and *Arduino Certified Pro*.
- 🎓 **Official Vector PDF Certificate**: Download a high-resolution, print-ready PDF certificate signed with your name, verification ID, and completion date.

---

### 🌐 Multi-Language Localization (i18n)
Full internationalization powered by `i18next`:
- 🇬🇧 **English**
- 🇱🇰 **Sinhala (සිංහල)** — සම්පූර්ණ පරිවර්තනය
- 🇱🇰 **Tamil (தமிழ்)** — முழுமையான மொழிபெயர்ப்பு

---

### 🎥 Interactive Video Masterclass (77 Chapters)
- 🎬 Embedded 4-hour comprehensive Arduino masterclass (*freeCodeCamp* & *Ashish Bansal*).
- 📑 **77 Synchronized Chapters**: Complete timestamps covering electronics foundations, breadboard wiring, programming, sensors, and libraries.
- 🚀 **1-Click "Open in Simulator"**: Directly loads the matching circuit and sketch code corresponding to the current video chapter!

---

## 📚 Curriculum & Learning Path

Learn Arduino Pro includes 11 comprehensive hands-on modules designed for progressive mastery:

| # | Lesson Title | Hardware Focus | Software Concepts | XP |
| :---: | :--- | :--- | :--- | :---: |
| **01** | 🔰 **Meet the Board** | Arduino Uno R3, USB, Regulators | Microcontroller architecture, power distribution | `+50` |
| **02** | 💡 **Blink an LED** | 5mm LED, 220Ω Resistor | `pinMode()`, `digitalWrite()`, `delay()` | `+100` |
| **03** | 🔘 **Push a Button** | Tactile Switch, 10kΩ Pull-down | `digitalRead()`, input pin states, conditionals | `+100` |
| **04** | 🎛️ **Turn a Knob** | 10kΩ Rotary Potentiometer | `analogRead()`, 10-bit ADC resolution, `map()` | `+120` |
| **05** | 🌈 **Mix Colours** | 4-Pin Common Cathode RGB LED | `analogWrite()`, 8-bit PWM duty cycles | `+150` |
| **06** | 🔊 **Buzzer & Sound** | Piezoelectric Buzzer Element | `tone()`, `noTone()`, audio frequencies | `+130` |
| **07** | ☀️ **Light Sensor** | LDR Photoresistor, Voltage Divider | Sensor calibrations, dynamic thresholds | `+140` |
| **08** | 🦾 **Servo Motor** | SG90 9g Micro Servo Motor | `<Servo.h>`, angle sweep (0°–180°), PWM timing | `+160` |
| **09** | 📟 **Serial Monitor** | Serial UART Interface (TX/RX) | `Serial.begin(9600)`, telemetry debugging | `+120` |
| **10** | 🦇 **Ultrasonic Distance** | HC-SR04 Sonar Module | Speed of sound, `pulseIn()`, echo timing | `+180` |
| **11** | 🚀 **Mini Project: Smart Guard** | HC-SR04, RGB LED, Piezo Buzzer | Sensor integration, state-machine logic | `+250` |

---

## 🧰 Simulated Electronics Library

The simulator includes 13 realistic electronic components:

| Component | Pin Count | Interactive Controls & Features |
| :--- | :---: | :--- |
| 🧠 **Arduino Uno R3** | 30 | Full ATmega328P 16MHz emulation, 14 digital, 6 analog, power rails |
| 🔲 **Half Breadboard** | 400 | Standard 400-tie tie-point board with connected power buses |
| 💡 **5mm Standard LED** | 2 | Red, Green, Blue, Yellow, Amber options with realistic PWM brightness |
| 🌈 **RGB LED** | 4 | Common-Cathode RGB LED with true 24-bit color blending |
| ⚡ **Carbon Resistor** | 2 | Configurable resistance (100Ω to 1MΩ) with auto EIA 4-band color rings |
| 🔘 **Tactile Push Button** | 4 | Click-to-press / hold button with pull-up/pull-down support |
| 🎛️ **10kΩ Potentiometer** | 3 | Smooth rotary dial knob feeding variable 0–5V analog signal |
| 🔊 **Piezo Buzzer** | 2 | Synthesizes genuine square wave tones via the Web Audio API |
| 🦾 **SG90 Micro Servo** | 3 | Animated servo horn rotating accurately between 0° and 180° |
| ☀️ **LDR Photoresistor** | 2 | Ambient light intensity slider simulating changing resistance |
| 🦇 **HC-SR04 Ultrasonic** | 4 | Real-time distance slider (2cm to 400cm) generating echo pulses |
| 📺 **16x2 Character LCD** | 4 (I2C) | Simulated dot-matrix LCD panel displaying LiquidCrystal text |
| 🔢 **7-Segment Display** | 10 | Common-Cathode 7-segment numerical display with decimal point |

---

## 🛠️ Architecture & Tech Stack

```
learn-arduino-pro/
├── 🌐 public/                  # Static assets & PWA manifest
├── ☁️ api/                     # Vercel Serverless Functions (tutor & compile)
├── 📦 src/
│   ├── 🎨 components/
│   │   ├── 3d/                # Three.js / React Three Fiber Uno Model & Scene
│   │   ├── canvas/            # Canvas, Component Palette, Circuit Check, Parts
│   │   ├── editor/            # Monaco Editor, Serial Monitor/Plotter, Logic Analyzer
│   │   ├── layout/            # TopBar, Sidebar, BottomNav, Footer
│   │   ├── tutor/             # Context-aware AI Tutor Slide-Over & Chat
│   │   └── video/             # YouTube IFrame API Video Player & Chapters
│   ├── 📊 data/               # Lessons, 77-Chapter Videos, Components Catalog
│   ├── 🌍 i18n/               # Localization (English, Sinhala, Tamil)
│   ├── ⚡ lib/circuit/         # Netlist, Electrical Engine, Code Fixer
│   ├── 🏪 store/              # Zustand stores (simulator, UI, progress, projects)
│   ├── 🖥️ views/              # Home, Lessons, Simulator, Videos, Settings, Projects
│   └── 🧪 tests/              # Vitest test suites
├── 🎭 e2e/                     # Playwright end-to-end automated smoke tests
```

---

## 🚀 Quick Start Guide

### Prerequisites
- [Node.js](https://nodejs.org/) version 18.0.0 or higher
- [npm](https://www.npmjs.com/) version 9.0.0 or higher

### 1. Clone the Repository
```bash
git clone https://github.com/Sadeep78/learn-arduino-pro.git
cd learn-arduino-pro
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Start the Development Server
```bash
npm run dev
```
Open your browser and navigate to **`http://localhost:5173`**.

---

## 🔑 Environment Variables

The application runs **100% locally out-of-the-box** without any configuration! 

To enable the optional AI Tutor proxy and Supabase cloud sync, create a `.env` file in the root directory:

```env
# Optional: Anthropic Claude API Key for the AI Tutor serverless proxy
ANTHROPIC_API_KEY=sk-ant-api03-xxxx...

# Optional: Supabase Auth & Cloud Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## 🧪 Running Tests & Build

### Run Unit Tests (Vitest)
```bash
npm test
```
Executes all 27 unit tests covering electrical rules, netlist union-find, AVR runner, and chapter parsers.

### Run End-to-End Tests (Playwright)
```bash
npm run test:e2e
```
Executes 5 automated smoke tests testing route navigation, language switching, quiz completion, simulator circuit verification, and Full HD split view.

### Type Check & Build
```bash
npm run typecheck
npm run build
```
Generates an optimized, tree-shaken production distribution in `./dist` with PWA service worker precaching.

---

## 🤝 Contributing

Contributions are what make the open-source community such an amazing place to learn, inspire, and create. Any contributions you make are **greatly appreciated**!

1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'feat: Add AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

---

## 📜 License & Credits

Distributed under the **MIT License**. See [`LICENSE`](LICENSE) for more information.

<div align="center">

### 👨‍💻 Designed, Engineered & Maintained by
### **[Sadeep Sasanka](https://github.com/Sadeep78)**

⭐ *If you find Learn Arduino Pro helpful, please consider giving the repository a star on GitHub!* ⭐

[![GitHub stars](https://img.shields.io/github/stars/Sadeep78/learn-arduino-pro?style=social)](https://github.com/Sadeep78/learn-arduino-pro)
[![GitHub forks](https://img.shields.io/github/forks/Sadeep78/learn-arduino-pro?style=social)](https://github.com/Sadeep78/learn-arduino-pro)

</div>
