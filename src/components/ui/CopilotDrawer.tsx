'use client';

import React, { useState } from 'react';
import {
  Bot,
  X,
  Send,
  Sparkles,
  ShieldCheck,
  Zap,
  AlertTriangle,
  Navigation,
  Home,
  ShieldAlert,
  Activity,
  CheckCircle2,
  Radio,
  ArrowRight
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
      text: 'Hello. I am ClimateShield AI Copilot — your real-time disaster intelligence assistant.\n\nI continuously inspect spatial memory telemetry across Chennai risk zones, shelters, incidents, and road networks.\n\nSelect a quick query below or ask any emergency question.',
      timestamp: 'Just now'
    }
  ]);

  const [inputQuery, setInputQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const quickPrompts = [
    {
      icon: AlertTriangle,
      label: '🚨 Evacuation Areas',
      desc: 'Which areas need immediate evacuation?',
      query: 'Which areas need immediate evacuation?'
    },
    {
      icon: Navigation,
      label: '🗺️ Safest Evacuation Route',
      desc: 'What is the safest evacuation route?',
      query: 'What is the safest evacuation route?'
    },
    {
      icon: Home,
      label: '🏠 Shelter Capacity',
      desc: 'Which shelters have available capacity?',
      query: 'Which shelter has capacity?'
    },
    {
      icon: ShieldAlert,
      label: '🚑 Rescue Priorities',
      desc: 'Where should rescue teams go first?',
      query: 'Where should I send the next rescue team?'
    },
    {
      icon: Activity,
      label: '🌧️ Risk Drivers',
      desc: 'What is causing the current risk elevation?',
      query: 'Summarize the current emergency.'
    },
    {
      icon: Radio,
      label: '⚠️ Dangerous Roads',
      desc: 'Which roads are flooded or blocked?',
      query: 'Which roads should be avoided?'
    }
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
    <div className="fixed inset-0 z-[700] bg-slate-950/90 backdrop-blur-xl flex items-center justify-center p-2 sm:p-4 lg:p-6 animate-fadeIn">
      {/* Large Dedicated Modal Window */}
      <div className="w-full max-w-5xl h-[92vh] sm:h-[88vh] bg-slate-950 border border-cyan-500/40 rounded-2xl lg:rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.2)] flex flex-col overflow-hidden">
        
        {/* Header Bar */}
        <div className="p-4 sm:p-5 lg:px-6 border-b border-slate-800 bg-slate-900/90 flex items-center justify-between shrink-0">
          <div className="flex items-center gap-3.5">
            <div className="rounded-2xl bg-cyan-500/20 p-3 text-cyan-300 border border-cyan-500/40 shadow-lg shadow-cyan-500/10">
              <Bot className="h-7 w-7" />
            </div>
            <div>
              <div className="flex items-center gap-3">
                <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight">
                  ClimateShield AI Copilot
                </h2>
                <span className="hidden sm:inline-flex items-center gap-1.5 rounded-full bg-emerald-500/10 border border-emerald-500/40 px-3 py-1 text-xs font-mono font-bold text-emerald-400">
                  <span className="h-2 w-2 rounded-full bg-emerald-400 animate-ping" />
                  ● Connected to ClimateShield Intelligence
                </span>
              </div>
              <p className="text-xs sm:text-sm font-medium text-slate-300 mt-0.5">
                Your real-time disaster intelligence assistant • Reading live spatial telemetry store
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="rounded-xl border border-slate-700 bg-slate-900 p-2.5 text-slate-300 hover:text-white hover:border-slate-500 transition-all cursor-pointer"
            title="Close Copilot (Esc)"
          >
            <X className="h-6 w-6" />
          </button>
        </div>

        {/* Conversation Area */}
        <div className="flex-1 p-4 sm:p-6 overflow-y-auto space-y-6">
          
          {/* Quick Prompts Grid (Shown at start or top) */}
          {messages.length <= 1 && (
            <div className="space-y-3 mb-6">
              <div className="text-xs font-mono font-bold text-cyan-400 uppercase tracking-wider flex items-center gap-2">
                <Zap className="h-4 w-4 text-cyan-400" />
                SELECT A FREQUENT DISASTER INTELLIGENCE QUERY:
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                {quickPrompts.map((p, idx) => {
                  return (
                    <button
                      key={idx}
                      onClick={() => handleSend(p.query)}
                      className="rounded-2xl border border-slate-800 bg-slate-900/90 hover:bg-cyan-950/30 hover:border-cyan-500/50 p-4 text-left transition-all hover:scale-[1.01] cursor-pointer group shadow-md flex flex-col justify-between"
                    >
                      <div className="font-bold text-sm lg:text-base text-white group-hover:text-cyan-300 flex items-center justify-between">
                        <span>{p.label}</span>
                        <ArrowRight className="h-4 w-4 text-slate-500 group-hover:text-cyan-400 transition-transform group-hover:translate-x-1" />
                      </div>
                      <p className="text-xs text-slate-400 mt-1.5 font-normal leading-relaxed">
                        {p.desc}
                      </p>
                    </button>
                  );
                })}
              </div>
            </div>
          )}

          {/* Chat Messages */}
          {messages.map((msg) => (
            <div
              key={msg.id}
              className={`flex flex-col ${msg.sender === 'user' ? 'items-end' : 'items-start'}`}
            >
              <div
                className={`max-w-[90%] sm:max-w-[85%] rounded-2xl p-5 text-base leading-relaxed transition-all shadow-xl ${
                  msg.sender === 'user'
                    ? 'bg-gradient-to-r from-cyan-600 to-teal-600 border border-cyan-400/40 text-white rounded-tr-xs font-medium'
                    : 'bg-slate-900/95 border border-slate-800 text-slate-100 rounded-tl-xs space-y-4'
                }`}
              >
                <div className="whitespace-pre-line text-slate-100 font-normal leading-relaxed text-base">
                  {msg.text}
                </div>

                {/* Highlighted Emergency Data Pill Card */}
                {msg.response && (
                  <div className="mt-4 pt-4 border-t border-slate-800 space-y-3">
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono text-xs">
                      <div className="rounded-xl border border-red-500/30 bg-red-950/20 p-2.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Risk Level</span>
                        <span className="text-sm font-extrabold text-red-400">CRITICAL (94/100)</span>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Primary Target</span>
                        <span className="text-sm font-extrabold text-white">Velachery Zone 4</span>
                      </div>
                      <div className="rounded-xl border border-slate-800 bg-slate-950 p-2.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Water Inundation</span>
                        <span className="text-sm font-extrabold text-cyan-300">+1.85m MSL</span>
                      </div>
                      <div className="rounded-xl border border-emerald-500/30 bg-emerald-950/20 p-2.5">
                        <span className="text-[10px] text-slate-400 uppercase font-bold block">Safe Route</span>
                        <span className="text-sm font-extrabold text-emerald-400">GST Road Flyover</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-between text-xs font-mono text-cyan-300 pt-1">
                      <span className="flex items-center gap-1.5 font-bold">
                        <ShieldCheck className="h-4 w-4 text-cyan-400" />
                        AI Telemetry Confidence: {msg.response.confidencePct}%
                      </span>
                      <span className="text-slate-400 text-[11px] font-medium">{msg.response.disclaimer}</span>
                    </div>
                  </div>
                )}
              </div>

              <span className="text-xs font-mono text-slate-400 font-medium mt-1.5 px-2">
                {msg.timestamp}
              </span>
            </div>
          ))}

          {loading && (
            <div className="flex items-center gap-3 text-sm font-mono text-cyan-300 p-4 bg-slate-900 rounded-2xl border border-slate-700/80 w-fit shadow-xl animate-pulse">
              <Sparkles className="h-5 w-5 text-cyan-400 shrink-0" />
              <span>Reading live telemetry store & reasoning emergency guidance...</span>
            </div>
          )}
        </div>

        {/* Input Bar */}
        <div className="p-4 sm:p-5 lg:px-6 border-t border-slate-800 bg-slate-900/95 shrink-0">
          <form
            onSubmit={(e) => {
              e.preventDefault();
              handleSend();
            }}
            className="flex items-center gap-3"
          >
            <input
              type="text"
              value={inputQuery}
              onChange={(e) => setInputQuery(e.target.value)}
              placeholder="Ask about risk, evacuation, shelters, roads or rescue..."
              className="flex-1 rounded-2xl border border-slate-700 bg-slate-950 px-5 py-4 text-base lg:text-lg text-white placeholder-slate-400 focus:border-cyan-400 focus:ring-1 focus:ring-cyan-400 focus:outline-none transition-all font-normal shadow-inner"
            />
            <button
              type="submit"
              disabled={loading || !inputQuery.trim()}
              className="rounded-2xl bg-gradient-to-r from-cyan-400 to-teal-400 px-6 py-4 text-slate-950 font-bold text-base hover:scale-105 transition-all shadow-lg shadow-cyan-500/20 disabled:opacity-40 disabled:hover:scale-100 flex items-center gap-2 shrink-0 cursor-pointer"
            >
              <span>Send</span>
              <Send className="h-5 w-5" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
};
