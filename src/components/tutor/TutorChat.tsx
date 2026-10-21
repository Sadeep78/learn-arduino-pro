import React, { useState, useRef, useEffect } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  HelpCircle,
  Lightbulb,
  FileQuestion,
  User,
  Zap
} from 'lucide-react';
import { useUIStore } from '../../store/useUIStore';
import { useSimulatorStore } from '../../store/useSimulatorStore';
import { LESSONS } from '../../data/lessons';

interface ChatMessage {
  id: string;
  sender: 'tutor' | 'user';
  text: string;
  timestamp: string;
}

export const TutorChat: React.FC = () => {
  const { isTutorOpen, setIsTutorOpen, activeLessonId } = useUIStore();
  const { activeCode, warnings } = useSimulatorStore();

  const currentLesson = LESSONS.find((l) => l.id === activeLessonId);

  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'welcome',
      sender: 'tutor',
      text: "👋 Hi! I'm your interactive Arduino Tutor. Ask me any questions about your sketch, electronic components, or why something isn't working as expected!",
      timestamp: 'Just now'
    }
  ]);
  const [inputText, setInputText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [hintStage, setHintStage] = useState(1);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isLoading]);

  if (!isTutorOpen) return null;

  const sendMessage = async (customText?: string) => {
    const textToSend = customText || inputText;
    if (!textToSend.trim() || isLoading) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text: textToSend,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    setInputText('');
    setIsLoading(true);

    try {
      const response = await fetch('/api/tutor', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          message: textToSend,
          lessonTitle: currentLesson?.title,
          code: activeCode,
          warnings: warnings.map((w) => ({ message: w.message, helpText: w.helpText })),
          hintStage: textToSend.toLowerCase().includes('hint') ? hintStage : 1
        })
      });

      let tutorReplyText = '';
      if (response.ok) {
        const data = await response.json();
        tutorReplyText = data.reply || "I'm thinking through your circuit configuration...";
      } else {
        tutorReplyText = "I'm having trouble connecting to the tutor server. Let me know if your code has setup() and loop() defined!";
      }

      if (textToSend.toLowerCase().includes('hint')) {
        setHintStage((prev) => (prev >= 3 ? 1 : prev + 1));
      }

      const tutorMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: tutorReplyText,
        timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
      };
      setMessages((prev) => [...prev, tutorMsg]);
    } catch (e) {
      const fallbackMsg: ChatMessage = {
        id: `tutor-${Date.now()}`,
        sender: 'tutor',
        text: "Make sure your circuit has closed loops from 5V/Digital pin through your component into GND, and check that pinMode matches your code!",
        timestamp: 'Just now'
      };
      setMessages((prev) => [...prev, fallbackMsg]);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="fixed inset-y-0 right-0 z-50 w-full sm:w-96 bg-blueprint-cream dark:bg-blueprint-nightCard border-l border-blueprint-creamBorder dark:border-blueprint-nightBorder shadow-2xl flex flex-col animate-in slide-in-from-right duration-300 select-none">
      {/* Top Header */}
      <div className="p-4 bg-blueprint-creamDark/80 dark:bg-blueprint-nightBg/90 border-b border-blueprint-creamBorder dark:border-blueprint-nightBorder flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="w-8 h-8 rounded-xl bg-blueprint-teal text-white flex items-center justify-center shadow-md shadow-blueprint-teal/30">
            <Bot className="w-5 h-5" />
          </div>
          <div>
            <h3 className="text-sm font-extrabold font-mono text-blueprint-navy dark:text-white">
              Ask the Tutor
            </h3>
            <span className="text-[10px] font-mono text-blueprint-teal font-semibold">
              Context-Aware AI Assistant
            </span>
          </div>
        </div>

        <button
          onClick={() => setIsTutorOpen(false)}
          className="p-1.5 rounded-lg text-gray-500 hover:bg-black/5 dark:hover:bg-white/5 transition"
        >
          <X className="w-5 h-5" />
        </button>
      </div>

      {/* Lesson Context Ribbon */}
      <div className="px-4 py-2 bg-blueprint-tealLight/50 dark:bg-blueprint-teal/10 border-b border-blueprint-teal/20 flex items-center justify-between text-xs font-mono">
        <span className="truncate text-blueprint-teal font-bold">
          Lesson: {currentLesson?.title || 'Custom Circuit'}
        </span>
        {warnings.length > 0 && (
          <span className="text-[10px] text-amber-600 dark:text-amber-400 font-bold">
            {warnings.length} Notice{warnings.length > 1 ? 's' : ''}
          </span>
        )}
      </div>

      {/* Quick Action Buttons */}
      <div className="p-2 border-b border-blueprint-creamBorder dark:border-blueprint-nightBorder bg-blueprint-cream/60 dark:bg-blueprint-nightBg/40 flex items-center gap-1.5 overflow-x-auto text-[11px] font-mono">
        <button
          onClick={() => sendMessage('Explain this code')}
          className="px-2.5 py-1 rounded-lg bg-white dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:border-blueprint-teal hover:text-blueprint-teal transition whitespace-nowrap flex items-center gap-1"
        >
          <Lightbulb className="w-3 h-3 text-amber-500" />
          <span>Explain Code</span>
        </button>

        <button
          onClick={() => sendMessage("Why isn't my LED blinking?")}
          className="px-2.5 py-1 rounded-lg bg-white dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:border-blueprint-teal hover:text-blueprint-teal transition whitespace-nowrap flex items-center gap-1"
        >
          <HelpCircle className="w-3 h-3 text-red-500" />
          <span>Why no blink?</span>
        </button>

        <button
          onClick={() => sendMessage('Give me a progressive hint')}
          className="px-2.5 py-1 rounded-lg bg-white dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:border-blueprint-teal hover:text-blueprint-teal transition whitespace-nowrap flex items-center gap-1"
        >
          <Sparkles className="w-3 h-3 text-blueprint-teal" />
          <span>Get Hint ({hintStage}/3)</span>
        </button>

        <button
          onClick={() => sendMessage('Quiz me on this topic')}
          className="px-2.5 py-1 rounded-lg bg-white dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder hover:border-blueprint-teal hover:text-blueprint-teal transition whitespace-nowrap flex items-center gap-1"
        >
          <FileQuestion className="w-3 h-3 text-purple-500" />
          <span>Quiz Me</span>
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-3 font-sans text-xs">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[85%] p-3 rounded-2xl whitespace-pre-wrap leading-relaxed shadow-sm ${
                msg.sender === 'user'
                  ? 'bg-blueprint-teal text-white rounded-br-sm'
                  : 'bg-white dark:bg-blueprint-nightBg text-blueprint-navy dark:text-gray-200 border border-blueprint-creamBorder dark:border-blueprint-nightBorder rounded-bl-sm'
              }`}
            >
              {msg.text}
            </div>
            <span className="text-[9px] font-mono text-gray-400 mt-1 px-1">
              {msg.timestamp}
            </span>
          </div>
        ))}

        {isLoading && (
          <div className="flex items-center gap-2 text-xs font-mono text-blueprint-teal">
            <Bot className="w-4 h-4 animate-bounce" />
            <span>Analyzing code & circuit...</span>
          </div>
        )}

        <div ref={messagesEndRef} />
      </div>

      {/* Bottom Message Input */}
      <form
        onSubmit={(e) => {
          e.preventDefault();
          sendMessage();
        }}
        className="p-3 bg-blueprint-creamDark/60 dark:bg-blueprint-nightBg border-t border-blueprint-creamBorder dark:border-blueprint-nightBorder flex items-center gap-2"
      >
        <input
          type="text"
          value={inputText}
          onChange={(e) => setInputText(e.target.value)}
          placeholder="Ask anything about Arduino..."
          className="flex-1 px-3.5 py-2 rounded-xl bg-white dark:bg-blueprint-nightCard border border-blueprint-creamBorder dark:border-blueprint-nightBorder text-xs text-blueprint-navy dark:text-white placeholder:text-gray-400 focus:outline-none focus:border-blueprint-teal font-sans"
        />
        <button
          type="submit"
          disabled={!inputText.trim() || isLoading}
          className="p-2 rounded-xl bg-blueprint-teal hover:bg-blueprint-tealHover disabled:opacity-40 text-white transition shadow-sm"
        >
          <Send className="w-4 h-4" />
        </button>
      </form>
    </div>
  );
};
