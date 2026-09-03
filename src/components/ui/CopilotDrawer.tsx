'use client';

import React, { useState } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  AlertTriangle,
  Navigation,
  Home,
  ShieldAlert,
  Activity,
  CheckCircle2
} from 'lucide-react';
import { CopilotResponse } from '@/lib/ai/copilotEngine';

interface CopilotDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

interface ChatMessage {
  id: string;
  sender: 'user' | 'copilot';
  text: string;
  response?: CopilotResponse;
  timestamp: string;
}

export const CopilotDrawer: React.FC<CopilotDrawerProps> = ({ isOpen, onClose }) => {
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: 'msg-welcome',
      sender: 'copilot',
      text: 'Hello Command Center. I am ClimateShield Copilot. I read live telemetry across Chennai risk zones, shelters, incidents, and roads. Select a quick query or ask any emergency question.',
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    { label: '🚨 Evacuation Areas', query: 'Which areas need immediate evacuation?' },
    { label: '🚤 Dispatch Target', query: 'Where should I send the next rescue team?' },
    { label: '🏠 Shelter Capacity', query: 'Which shelter has capacity?' },
    { label: '⚠️ Roads to Avoid', query: 'Which roads should be avoided?' },
    { label: '📊 Emergency Summary', query: 'Summarize the current emergency.' }
  ];

  const handleSend = async (queryToSend?: string) => {
    const text = queryToSend || inputQuery;
    if (!text.trim()) return;

    const userMsg: ChatMessage = {
      id: `user-${Date.now()}`,
      sender: 'user',
      text,
      timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    };

    setMessages((prev) => [...prev, userMsg]);
    if (!queryToSend) setInputQuery('');
    setLoading(true);

    try {
      const res = await fetch('/api/copilot/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ message: text })
      });
      const json = await res.json();

      if (json.success) {
        const copilotMsg: ChatMessage = {
          id: `copilot-${Date.now()}`,
          sender: 'copilot',
          text: json.data.answer,
          response: json.data,
          timestamp: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
        };
        setMessages((prev) => [...prev, copilotMsg]);
      }
    } catch (err) {
      console.error('Copilot error:', err);
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-y-0 right-0 z-[650] w-full max-w-lg bg-slate-950/95 border-l border-cyan-500/30 shadow-2xl backdrop-blur-2xl flex flex-col animate-slideLeft">
      {/* Drawer Header */}
      <div className="p-4 border-b border-slate-800 bg-slate-900/80 flex items-center justify-between">
        <div className="flex items-center gap-2.5">
          <div className="rounded-xl bg-cyan-500/20 p-2 text-cyan-300 border border-cyan-500/40">
            <Bot className="h-5 w-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="text-sm font-bold text-white">ClimateShield Copilot</h3>
              <span className="rounded bg-cyan-500/10 text-cyan-300 border border-cyan-500/30 px-2 py-0.5 text-[9px] font-mono font-bold">
                AI ENGINE V1.0
              </span>
            </div>
            <p className="text-[10px] font-mono text-slate-400">
              Reading Live Telemetry Store • Grounded AI Support
            </p>
          </div>
        </div>

        <button
          onClick={onClose}
          className="rounded-lg border border-slate-800 bg-slate-900 p-1.5 text-slate-400 hover:text-white"
        >
          <X className="h-4 w-4" />
        </button>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 p-4 overflow-y-auto space-y-4">
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
          >
            <div
              className={`max-w-[90%] rounded-2xl p-4 text-xs space-y-2 leading-relaxed ${
                msg.sender === 'user'
                  ? 'bg-cyan-600 text-white rounded-br-none font-semibold'
                  : 'bg-slate-900/90 border border-slate-800 text-slate-200 rounded-bl-none shadow-lg'
              }`}
            >
              <div className="whitespace-pre-line">{msg.text}</div>

              {msg.response && (
                <div className="pt-2 border-t border-slate-800/80 text-[10px] font-mono text-cyan-300 flex items-center justify-between">
                  <span>Confidence: {msg.response.confidencePct}%</span>
                  <span className="text-slate-400">{msg.response.disclaimer}</span>
                </div>
              )}
            </div>
            <span className="text-[9px] font-mono text-slate-500 mt-1 px-1">{msg.timestamp}</span>
          </div>
        ))}

        {loading && (
          <div className="flex items-center gap-2 text-xs font-mono text-cyan-400 p-3 bg-slate-900/80 rounded-xl border border-slate-800 w-fit animate-pulse">
            <Sparkles className="h-4 w-4" />
            Reading live telemetry store & reasoning...
          </div>
        )}
      </div>

      {/* Quick Prompt Pills Bar */}
      <div className="p-3 border-t border-slate-800/80 bg-slate-950 flex gap-1.5 overflow-x-auto text-[11px]">
        {quickPrompts.map((p, idx) => (
          <button
            key={idx}
            onClick={() => handleSend(p.query)}
            className="rounded-xl border border-slate-800 bg-slate-900/90 px-3 py-1.5 font-medium text-slate-300 hover:border-cyan-500/40 hover:text-cyan-300 transition-all shrink-0"
          >
            {p.label}
          </button>
        ))}
      </div>

      {/* Chat Input Bar */}
      <div className="p-4 border-t border-slate-800 bg-slate-900/90">
        <form
          onSubmit={(e) => {
            e.preventDefault();
            handleSend();
          }}
          className="flex items-center gap-2"
        >
          <input
            type="text"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            placeholder="Ask Copilot about risk zones, shelters, or routes..."
            className="flex-1 rounded-xl border border-slate-800 bg-slate-950 px-3.5 py-2.5 text-xs text-slate-200 focus:border-cyan-500 focus:outline-none"
          />
          <button
            type="submit"
            disabled={loading || !inputQuery.trim()}
            className="rounded-xl bg-gradient-to-r from-cyan-500 to-teal-500 p-2.5 text-slate-950 hover:scale-105 transition-all disabled:opacity-50"
          >
            <Send className="h-4 w-4" />
          </button>
        </form>
      </div>
    </div>
  );
};
