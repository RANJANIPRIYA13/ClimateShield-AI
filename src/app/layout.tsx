'use client';

import React, { useState } from 'react';
import './globals.css';
import { Sidebar } from '@/components/ui/Sidebar';
import { Topbar } from '@/components/ui/Topbar';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <html lang="en" className="dark">
      <head>
        <title>ClimateShield AI - Emergency Operations & Climate Resilience</title>
        <meta
          name="description"
          content="Next-generation Emergency Operations Command & Climate Resilience Platform powered by ClimateShield AI."
        />
      </head>
      <body className="bg-[#0b0f19] text-slate-100 min-h-screen flex flex-col font-sans antialiased selection:bg-cyan-500 selection:text-black">
        <div className="flex flex-1 min-h-screen overflow-hidden">
          {/* Reusable Sidebar */}
          <Sidebar mobileOpen={mobileOpen} setMobileOpen={setMobileOpen} />

          {/* Main Content Area */}
          <div className="flex flex-1 flex-col overflow-y-auto">
            {/* Topbar Header */}
            <Topbar onMobileToggle={() => setMobileOpen(true)} />

            {/* View Shell Content */}
            <main className="flex-1 p-4 lg:p-6 bg-tactical-grid bg-radial-gradient">
              {children}
            </main>
          </div>
        </div>
      </body>
    </html>
  );
}
