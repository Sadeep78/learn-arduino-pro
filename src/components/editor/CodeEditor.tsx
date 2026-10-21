import React, { useState, useRef } from 'react';
import Editor, { OnMount } from '@monaco-editor/react';
import {
  Play,
  Square,
  Copy,
  Check,
  Maximize2,
  Minimize2,
  Upload,
  Sparkles,
  Zap,
  AlignLeft,
  Gauge,
  AlertCircle
} from 'lucide-react';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { flashBoardViaWebSerial } from '../../lib/hardware/webSerial';

interface CodeEditorProps {
  onRun?: () => void;
  onStop?: () => void;
}

export const CodeEditor: React.FC<CodeEditorProps> = () => {
  const {
    activeCode,
    setActiveCode,
    isRunning,
    startSimulation,
    stopSimulation,
    isSlowMo,
    toggleSlowMo
  } = useSimulatorStore();

  const [copied, setCopied] = useState(false);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [flashMessage, setFlashMessage] = useState<string | null>(null);
  const [isFlashing, setIsFlashing] = useState(false);
  const [syntaxNotice, setSyntaxNotice] = useState<string | null>(null);
  const editorRef = useRef<any>(null);

  const handleEditorDidMount: OnMount = (editor, monaco) => {
    editorRef.current = editor;

    // Register Arduino C++ Autocomplete
    monaco.languages.registerCompletionItemProvider('cpp', {
      provideCompletionItems: (model: any, position: any) => {
        const word = model.getWordUntilPosition(position);
        const range = {
          startLineNumber: position.lineNumber,
          endLineNumber: position.lineNumber,
          startColumn: word.startColumn,
          endColumn: word.endColumn
        };

        const suggestions = [
          {
            label: 'pinMode',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Configures the specified pin to behave either as an INPUT, OUTPUT, or INPUT_PULLUP.',
            insertText: 'pinMode(${1:pin}, ${2:OUTPUT});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          },
          {
            label: 'digitalWrite',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Write a HIGH or a LOW value to a digital pin.',
            insertText: 'digitalWrite(${1:pin}, ${2:HIGH});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          },
          {
            label: 'digitalRead',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Reads the value from a specified digital pin, either HIGH or LOW.',
            insertText: 'digitalRead(${1:pin});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          },
          {
            label: 'analogRead',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Reads the value from the specified analog pin (0-1023 for 0-5V).',
            insertText: 'analogRead(${1:A0});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          },
          {
            label: 'analogWrite',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Writes an analog value (PWM wave) to a pin with ~ mark (0 to 255).',
            insertText: 'analogWrite(${1:pin}, ${2:128});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          },
          {
            label: 'delay',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Pauses the program for the amount of time (in milliseconds) specified as parameter.',
            insertText: 'delay(${1:1000});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          },
          {
            label: 'Serial.begin',
            kind: monaco.languages.CompletionItemKind.Method,
            documentation: 'Sets the data rate in bits per second (baud) for serial data transmission.',
            insertText: 'Serial.begin(${1:9600});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          },
          {
            label: 'Serial.println',
            kind: monaco.languages.CompletionItemKind.Method,
            documentation: 'Prints data to the serial port as human-readable ASCII text followed by a carriage return and newline.',
            insertText: 'Serial.println(${1:"Hello Arduino!"});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          },
          {
            label: 'tone',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Generates a square wave of the specified frequency on a pin.',
            insertText: 'tone(${1:pin}, ${2:440}, ${3:500});',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          },
          {
            label: 'map',
            kind: monaco.languages.CompletionItemKind.Function,
            documentation: 'Re-maps a number from one range to another: map(val, fromLow, fromHigh, toLow, toHigh)',
            insertText: 'map(${1:val}, 0, 1023, 0, 255);',
            insertTextRules: monaco.languages.CompletionItemInsertTextRule.InsertAsSnippet,
            range
          }
        ];

        return { suggestions };
      }
    });

    // Register Hover Provider
    monaco.languages.registerHoverProvider('cpp', {
      provideHover: (model: any, position: any) => {
        const word = model.getWordAtPosition(position);
        if (!word) return null;

        const docMap: Record<string, string> = {
          pinMode: '**pinMode(pin, mode)**\nConfigures a digital pin as `INPUT`, `OUTPUT`, or `INPUT_PULLUP`.',
          digitalWrite: '**digitalWrite(pin, value)**\nSets a digital pin voltage to `HIGH` (5V) or `LOW` (0V).',
          digitalRead: '**digitalRead(pin)**\nReads digital voltage on a pin. Returns `1` (`HIGH`) or `0` (`LOW`).',
          analogRead: '**analogRead(analogPin)**\nReads 10-bit analog voltage (0V to 5V) returning an integer from `0` to `1023`.',
          analogWrite: '**analogWrite(pin, dutyCycle)**\nOutputs 8-bit Pulse-Width Modulation (PWM) from `0` (off) to `255` (100% on).',
          delay: '**delay(ms)**\nPauses processor execution for the specified milliseconds.',
          Serial: '**Serial**\nHardware UART interface for serial monitor communication with your computer.'
        };

        if (docMap[word.word]) {
          return {
            contents: [{ value: docMap[word.word] }]
          };
        }
        return null;
      }
    });
  };

  const handleCopy = () => {
    navigator.clipboard.writeText(activeCode);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleFormat = () => {
    if (editorRef.current) {
      editorRef.current.getAction('editor.action.formatDocument')?.run();
    }
  };

  const handleHardwareFlash = async () => {
    setIsFlashing(true);
    setFlashMessage('Connecting to Web Serial USB device...');
    const res = await flashBoardViaWebSerial(activeCode);
    setFlashMessage(res.message);
    setIsFlashing(false);
    setTimeout(() => setFlashMessage(null), 7000);
  };

  return (
    <div
      className={`flex flex-col bg-[#1E1E1E] rounded-2xl border border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-xl overflow-hidden select-none transition-all ${
        isFullscreen ? 'fixed inset-4 z-50' : 'h-full'
      }`}
    >
      {/* Editor Header Bar */}
      <div className="h-12 px-4 bg-[#252526] border-b border-[#333333] flex items-center justify-between text-xs font-mono">
        <div className="flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-blueprint-teal" />
          <span className="font-bold text-gray-200">sketch.ino</span>
          <span className="text-[10px] text-gray-500">· C++ Arduino 16MHz</span>
        </div>

        {/* Toolbar Buttons */}
        <div className="flex items-center gap-1.5">
          {/* Slow Mo Toggle */}
          <button
            onClick={toggleSlowMo}
            className={`px-2 py-1 rounded-lg border transition text-[11px] flex items-center gap-1 ${
              isSlowMo
                ? 'bg-amber-500/20 text-amber-400 border-amber-500/40 font-bold'
                : 'text-gray-400 border-transparent hover:text-gray-200'
            }`}
            title="Step Slow-Motion Mode"
          >
            <Gauge className="w-3.5 h-3.5" />
            <span>Slow-Mo</span>
          </button>

          {/* Format Code */}
          <button
            onClick={handleFormat}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            title="Format Code"
          >
            <AlignLeft className="w-4 h-4" />
          </button>

          {/* Copy Code */}
          <button
            onClick={handleCopy}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            title="Copy Sketch"
          >
            {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
          </button>

          {/* Web Serial Upload */}
          <button
            onClick={handleHardwareFlash}
            disabled={isFlashing}
            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white font-bold transition shadow-xs"
            title="Flash physical Uno board via Web Serial"
          >
            <Upload className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Upload</span>
          </button>

          {/* Fullscreen */}
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg text-gray-400 hover:text-white hover:bg-white/10 transition"
            title={isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'}
          >
            {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
          </button>

          <div className="w-[1px] h-4 bg-gray-700 mx-1" />

          {/* Run / Stop Simulation */}
          {isRunning ? (
            <button
              onClick={stopSimulation}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-red-600 hover:bg-red-500 text-white font-bold transition shadow-xs"
            >
              <Square className="w-3.5 h-3.5 fill-current" />
              <span>Stop</span>
            </button>
          ) : (
            <button
              onClick={() => startSimulation()}
              className="flex items-center gap-1 px-3 py-1 rounded-lg bg-blueprint-teal hover:bg-blueprint-tealHover text-white font-bold transition shadow-xs"
            >
              <Play className="w-3.5 h-3.5 fill-current" />
              <span>Run</span>
            </button>
          )}
        </div>
      </div>

      {/* Web Serial Status Alert if triggered */}
      {flashMessage && (
        <div className="px-4 py-2 bg-blueprint-navy text-teal-300 text-xs font-mono border-b border-blueprint-teal/40 flex items-center justify-between">
          <span>{flashMessage}</span>
          <button onClick={() => setFlashMessage(null)} className="text-gray-400 hover:text-white">
            ✕
          </button>
        </div>
      )}

      {/* Monaco Editor Container */}
      <div className="flex-1 overflow-hidden">
        <Editor
          height="100%"
          defaultLanguage="cpp"
          theme="vs-dark"
          value={activeCode}
          onChange={(val) => setActiveCode(val || '')}
          onMount={handleEditorDidMount}
          options={{
            fontSize: 13,
            fontFamily: '"JetBrains Mono", Consolas, monospace',
            minimap: { enabled: false },
            lineNumbers: 'on',
            scrollBeyondLastLine: false,
            automaticLayout: true,
            tabSize: 2,
            padding: { top: 12, bottom: 12 }
          }}
        />
      </div>
    </div>
  );
};
