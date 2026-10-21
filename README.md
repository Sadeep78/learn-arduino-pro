<div align="center">

# ⚡ Learn Arduino Pro
### 🚀 EXPLORE · UNDERSTAND · BUILD

**An advanced, interactive browser-based Arduino learning platform, 3D digital twin, and real-time electronic circuit simulator.**

[![License: MIT](https://img.shields.io/badge/License-MIT-0f766e?style=for-the-badge&logo=opensourceinitiative&logoColor=white&labelColor=1e1b4b)](LICENSE)
[![React 18](https://img.shields.io/badge/React-18.3-0369a1?style=for-the-badge&logo=react&logoColor=white&labelColor=172554)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.5-1d4ed8?style=for-the-badge&logo=typescript&logoColor=white&labelColor=0f172a)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.4-7e22ce?style=for-the-badge&logo=vite&logoColor=white&labelColor=3b0764)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind_CSS-3.4-047857?style=for-the-badge&logo=tailwind-css&logoColor=white&labelColor=064e3b)](https://tailwindcss.com/)
[![Three.js](https://img.shields.io/badge/Three.js-R3F-c2410c?style=for-the-badge&logo=three.js&logoColor=white&labelColor=431407)](https://threejs.org/)
[![Vitest](https://img.shields.io/badge/Vitest-14%20Passing-15803d?style=for-the-badge&logo=vitest&logoColor=white&labelColor=365314)](https://vitest.dev/)
[![PWA Ready](https://img.shields.io/badge/PWA-Installable-86198f?style=for-the-badge&logo=pwa&logoColor=white&labelColor=4c0519)](https://web.dev/progressive-web-apps/)

[✨ GitHub Repository](https://github.com/Sadeep78/learn-arduino-pro) • [📖 Documentation](#-curriculum--learning-path) • [🛠️ Circuit Simulator](#-in-browser-circuit-simulator) • [💡 Component Catalog](#-simulated-electronics-library) • [📜 License](LICENSE)

---

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSadeep78%2Flearn-arduino-pro)

</div>

<br/>

## 📖 Table of Contents

- [🌟 Overview](#-overview)
- [🎨 Engineering Blueprint Aesthetics](#-engineering-blueprint-aesthetics)
- [✨ Core Features](#-core-features)
  - [🕹️ Interactive 3D Arduino Uno Board](#️-interactive-3d-arduino-uno-board)
  - [⚡ In-Browser Circuit Simulator (AVR8js)](#-in-browser-circuit-simulator-avr8js)
  - [💻 Professional Code Editor & Diagnostic Tools](#-professional-code-editor--diagnostic-tools)
  - [🤖 Context-Aware AI Tutor](#-context-aware-ai-tutor)
  - [🏆 Gamification, Badges & PDF Certificate](#-gamification-badges--pdf-certificate)
  - [🌐 Multi-Language Support (i18n)](#-multi-language-support-i18n)
  - [🎥 Interactive Video Masterclass](#-interactive-video-masterclass)
- [📚 Curriculum & Learning Path](#-curriculum--learning-path)
- [🧰 Simulated Electronics Library](#-simulated-electronics-library)
- [🛠️ Architecture & Tech Stack](#️-architecture--tech-stack)
- [🚀 Quick Start Guide](#-quick-start-guide)
- [🔑 Environment Variables](#-environment-variables)
- [🧪 Running Tests & Build](#-running-tests--build)
- [☁️ Vercel Deployment](#️-vercel-deployment)
- [🤝 Contributing](#-contributing)
- [📜 License & Credits](#-license--credits)

---

## 🌟 Overview

**Learn Arduino Pro** is an open-source, full-featured web application created to transform how students, makers, and embedded engineers learn physical computing. By combining:

1. **A photorealistic 3D Arduino Uno R3** with interactive pulsing hotspots and pinout explorers,
2. **An actual 16 MHz AVR CPU cycle emulator (`AVR8js`)** running genuine compiled C++ Arduino sketches in the browser,
3. **An interactive circuit canvas** with drag-and-drop breadboards, sensors, servos, LEDs, sound synthesis, and real-time wire tracing,
4. **Professional developer tools** including a multi-channel digital logic analyzer, oscilloscope, ATmega328P register inspector, and Web Serial hardware flashing, and
5. **An intelligent context-aware AI Tutor** powered by Anthropic's Claude 3.5 Sonnet,

Learn Arduino Pro provides a complete laboratory environment without needing physical hardware.

---

## 🎨 Engineering Blueprint Aesthetics

The interface is built around an original, high-precision **Engineering Blueprint** design language:

| Visual Element | Specification |
| :--- | :--- |
| **Light Theme** | Warm blueprint cream (`#FAF8F5`) with faint schematic grid traces |
| **Night Theme** | Deep navy night blueprint (`#0B132B`) with glowing phosphorescent accents |
| **Brand Accent** | Electric Teal (`#16B8B0`) representing active circuit current |
| **Typography** | `Plus Jakarta Sans` for clean UI typography & `JetBrains Mono` for code & registers |
| **Visual Style** | Rounded 12–16px engineering cards, soft isometric depth, and full `prefers-reduced-motion` compliance |

---

## ✨ Core Features

### 🕹️ Interactive 3D Arduino Uno Board
- **Web-GL 3D Rendering**: Built with `@react-three/fiber` and `@react-three/drei`.
- **Full Camera Control**: Smooth orbital rotation, panning, zoom, and instant view-reset presets (Isometric, Top-Down Pinout, Front).
- **8 Pulsing Hotspots**: Interactive callout markers over:
  - 🔌 USB Type-B Interface & Serial Communication
  - ⚡ DC Barrel Jack & 7–12V Voltage Regulator
  - 🧠 ATmega328P 8-bit Microcontroller IC
  - 🔢 Digital I/O Pins & PWM Channels (Pins 0–13)
  - 📊 Analog Input Header (A0–A5)
  - ⚡ Power Distribution Rails (5V, 3.3V, GND, Vin)
  - ⏱️ 16 MHz Crystal Oscillator
  - 🔄 Tactile Reset Switch
- **Synchronized Right Panel**: Clicking any hotspot opens a detailed dossier with Pinout maps, functional specs, starter C++ code, and electrical ratings.

---

### ⚡ In-Browser Circuit Simulator (AVR8js)
- **16 MHz Cycle-Accurate Emulation**: Directly executes AVR machine instructions in client WebAssembly/JavaScript.
- **Drag-and-Drop Canvas**: 20px grid snapping, dynamic multi-color wire routing, 90° component rotation, duplicate, and undo/redo history.
- **Smart Safety Circuit Validation**:
  - ⚠️ **Short Circuit Protection**: Detects direct connections between `5V` and `GND`.
  - ⚠️ **Current-Limiting Alerts**: Warns when LEDs are connected without series resistors.
  - ⚠️ **Floating / Open Pin Warnings**: Identifies unconnected signals.
- **Dual Execution Engines**:
  - ⚡ **Zero-Latency Instant Runner**: Instant execution of all 11 curriculum lessons with precompiled Intel HEX images.
  - ☁️ **Cloud Compiler**: Vercel serverless `arduino-cli` endpoint (`/api/compile`) for custom arbitrary student sketches.

---

### 💻 Professional Code Editor & Diagnostic Tools
- **Monaco Editor Integration**:
  - Full C++ syntax highlighting and bracket matching.
  - Intelligent autocompletion for standard Arduino APIs (`pinMode`, `digitalWrite`, `analogRead`, `Serial.println`, etc.).
  - Hover tooltips with documentation and parameter descriptions.
  - Auto-formatting (`clang-format` style), copy, and fullscreen toggle.
- **Diagnostic Tool Suite**:
  - 📟 **Simulated Serial Monitor**: Configurable baud rates (9600 to 115200), bi-directional user text transmission, autoscroll, and log clearing.
  - 📈 **Real-Time Serial Plotter**: High-performance HTML5 Canvas graphing tool that parses numeric serial streams into multi-variable graphs.
  - 🔬 **Digital Logic Analyzer**: 5-channel waveform oscilloscope capturing pin transitions over time.
  - ⚙️ **ATmega328P Register Inspector**: Live bitwise inspection of `PORTB`, `PORTD`, `DDRB`, `DDRD`, timers, and ADC registers with single-step clock execution.
  - 🔌 **Web Serial Board Flashing**: Flash compiled `.hex` files directly to a physical Arduino board over USB using Web Serial and STK500/Optiboot protocol!

---

### 🤖 Context-Aware AI Tutor
- **Slide-Over Intelligent Assistant**: Always available with one click.
- **Context-Informed Help**: Automatically reads the current lesson, user's circuit layout, written code, and runtime serial output to provide pinpoint assistance.
- **Interactive Prompts**:
  - 💡 *"Explain this code line by line"*
  - 🔍 *"Why isn't my LED blinking?"*
  - 🧩 *"Give me a hint (progressive hints without spoiling the answer)"*
  - ❓ *"Quiz me on this concept"*
- **Privacy & Security**: All API keys remain protected on the Vercel serverless proxy (`/api/tutor`) with rate limiting and an offline intelligent response engine fallback.

---

### 🏆 Gamification, Badges & PDF Certificate
- **XP & Level Progression**: Earn experience points for completing lessons, fixing bugs, and answering quizzes.
- **Daily Streak Tracker**: Stay consistent with streak counters saved locally and synchronized to the cloud.
- **8 Unlockable Achievements**:
  - ⚡ *First Spark* (Complete your first lesson)
  - 💡 *Blink Master* (Master LED digital output)
  - 🔘 *Button Wizard* (Handle push buttons & debouncing)
  - 🎛️ *Analog Alchemist* (Read ADC potentiometer inputs)
  - 🌈 *Color Maestro* (Drive RGB PWM channels)
  - 🔊 *Tone Architect* (Synthesize piezo audio frequencies)
  - 🦇 *Sonic Explorer* (Measure distance with ultrasound)
  - 🎓 *Arduino Certified Pro* (Complete the entire curriculum)
- **Official Blueprint PDF Certificate**: Download an auto-generated, print-ready, high-resolution vector PDF certificate signed with your name and unique verification ID.

---

### 🌐 Multi-Language Support (i18n)
Full internationalization powered by `i18next`:
- 🇬🇧 **English** (Default)
- 🇱🇰 **Sinhala (සිංහල)** — සම්පූර්ණ පරිවර්තනය
- 🇱🇰 **Tamil (தமிழ்)** — முழுமையான மொழிபெயர்ப்பு

---

### 🎥 Interactive Video Masterclass
- Embedded 4-hour comprehensive Arduino course (by *freeCodeCamp* & *Ashish Bansal*).
- **Interactive Chapters**: Jump to specific topics with auto-scrolling synced transcripts.
- **1-Click "Open in Simulator"**: Directly loads the circuit and starter code corresponding to the current video chapter!

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

The simulator comes packed with 13 realistic electronic components:

| Component | Pin Count | Interactive Controls & Features |
| :--- | :---: | :--- |
| **Arduino Uno R3** | 30 | Full ATmega328P 16MHz emulation, 14 digital, 6 analog, power rails |
| **Half Breadboard** | 400 | Standard 400-tie tie-point board with connected power buses |
| **5mm Standard LED** | 2 | Red, Green, Blue, Yellow, Amber options; realistic PWM brightness |
| **RGB LED** | 4 | Common-Cathode RGB LED with true 24-bit color blending |
| **Carbon Resistor** | 2 | Configurable resistance (100Ω to 1MΩ) with auto EIA 4-band color rings |
| **Tactile Push Button** | 4 | Click-to-press / hold button with pull-up/pull-down support |
| **10kΩ Potentiometer** | 3 | Smooth rotary dial knob feeding variable 0–5V analog signal |
| **Piezo Buzzer** | 2 | Synthesizes genuine square wave tones via the Web Audio API |
| **SG90 Micro Servo** | 3 | Animated servo horn rotating accurately between 0° and 180° |
| **LDR Photoresistor** | 2 | Ambient light intensity slider simulating changing resistance |
| **HC-SR04 Ultrasonic** | 4 | Real-time distance slider (2cm to 400cm) generating microsecond echo pulses |
| **16x2 Character LCD** | 4 (I2C) | Simulated dot-matrix LCD panel showing text written via LiquidCrystal |
| **7-Segment Display** | 10 | Common-Cathode 7-segment numerical display with decimal point |

---

## 🛠️ Architecture & Tech Stack

```
learn-arduino-pro/
├── 🌐 public/                  # Static assets & PWA manifest
├── ☁️ api/                     # Vercel Serverless Functions
│   ├── compile.ts             # Arduino-CLI sketch compiler endpoint
│   └── tutor.ts               # Anthropic Claude 3.5 Sonnet secure proxy
├── 📦 src/
│   ├── 🎨 components/
│   │   ├── 3d/                # Three.js / React Three Fiber Uno Model & Scene
│   │   ├── circuit/           # DND Canvas, Wire Renderer, 13 Electronic Parts
│   │   ├── common/            # Buttons, Modals, Badges, Tabs, TopBar, Sidebar
│   │   ├── editor/            # Monaco Editor, Serial Monitor/Plotter, Logic Analyzer
│   │   └── tutor/             # AI Tutor Slide-Over Panel & Chat UI
│   ├── 📊 data/               # Lessons, Videos, Components Catalog, Precompiled HEX
│   ├── 🌍 i18n/               # Translations (English, Sinhala, Tamil)
│   ├── ⚡ simulator/           # AVR8js CPU runner, instant runner, circuit validator
│   ├── 🏪 store/              # Zustand stores (circuit, lessons, projects, tutor)
│   └── 🧪 tests/              # Vitest test suites
```

### Core Technologies
- **Frontend Framework**: [React 18](https://reactjs.org/) + [TypeScript](https://www.typescriptlang.org/)
- **Bundler & Tooling**: [Vite 5](https://vitejs.dev/) + [Vite PWA Plugin](https://vite-pwa-org.netlify.app/)
- **Styling & Icons**: [Tailwind CSS 3](https://tailwindcss.com/) + [Lucide Icons](https://lucide.dev/)
- **3D Digital Twin**: [Three.js](https://threejs.org/) + [@react-three/fiber](https://docs.pmnd.rs/react-three-fiber) + [@react-three/drei](https://github.com/pmndrs/drei)
- **Hardware Simulation**: [AVR8js](https://github.com/wokwi/avr8js) (ATmega328P 16MHz cycle emulator)
- **Code Editor**: [@monaco-editor/react](https://github.com/suren-atoyan/monaco-react)
- **Audio Synthesis**: Native Browser Web Audio API
- **State Management**: [Zustand](https://github.com/pmndrs/zustand)
- **Testing**: [Vitest](https://vitest.dev/)
- **PDF Generation**: [jsPDF](https://github.com/parallax/jsPDF)
- **Backend / Auth**: [Supabase](https://supabase.com/) (with seamless Guest Mode fallback)

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

If you want to enable the online AI Tutor proxy and Supabase cloud sync, create a `.env` file in the root directory:

```env
# Optional: Anthropic Claude API Key for the AI Tutor serverless proxy
ANTHROPIC_API_KEY=sk-ant-api03-xxxx...

# Optional: Supabase Auth & Cloud Database
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOi...
```

---

## 🧪 Running Tests & Build

### Run Unit Tests
```bash
npm run test
```
All 14 tests covering the circuit validator, AVR runner, lessons data, and component states will execute via Vitest.

### Production Build
```bash
npm run build
```
Generates an optimized, tree-shaken production distribution in `./dist` with PWA service worker precaching.

### Preview Production Build
```bash
npm run preview
```

---

## ☁️ Vercel Deployment

Deploying **Learn Arduino Pro** to Vercel takes less than a minute:

1. Push your repository to GitHub.
2. Click the button below or import your repo in the [Vercel Dashboard](https://vercel.com):

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2FSadeep78%2Flearn-arduino-pro)

3. Set `ANTHROPIC_API_KEY` under **Project Settings > Environment Variables** (optional).
4. The included `vercel.json` will automatically configure API route rewrites and Single Page Application (SPA) routing.

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
