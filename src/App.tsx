import React, { useState, useEffect } from 'react';
import {
  Flag,
  Server,
  Layers,
  MapPin,
  Code2,
  Terminal,
  Sun,
  Moon,
  Copy,
  Check,
  Download,
  Gauge,
  Box,
  Activity
} from 'lucide-react';
import { F1TelemetryGCCD } from './components/f1/F1TelemetryGCCD';
import { InterlagosCircuitCard } from './components/f1/InterlagosCircuitCard';
import { FastApiExplorer } from './components/f1/FastApiExplorer';
import { GccdMethodologyTab } from './components/GccdMethodologyTab';
import { CodeViewer } from './components/CodeViewer';
import { TerminalSimulator } from './components/TerminalSimulator';
import { FASTAPI_BACKEND_CODE } from './data/fastApiCode';

type TabId = 'telemetria' | 'circuito' | 'fastapi' | 'gccd' | 'code' | 'terminal';

export default function App() {
  const [activeTab, setActiveTab] = useState<TabId>('telemetria');
  const [darkMode, setDarkMode] = useState<boolean>(false); // Welcoming, light & warm by default, toggleable to dark

  // Sync theme with html class for Tailwind v4 @custom-variant dark
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  const handleDownloadFastApi = () => {
    const blob = new Blob([FASTAPI_BACKEND_CODE], { type: 'text/x-python;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = 'main.py';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    URL.revokeObjectURL(url);
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-150">
      {/* Top Bar - Compact (h-14), Welcoming & Responsive */}
      <header className="sticky top-0 z-40 bg-white/90 dark:bg-slate-900/90 backdrop-blur-md border-b border-slate-200/80 dark:border-slate-800 shadow-xs">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 h-14 flex items-center justify-between gap-3">
          {/* Zone 1: Single Wordmark */}
          <div className="flex items-center gap-2.5 shrink-0">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_8px_rgba(16,185,129,0.7)] inline-block" />
            <span className="text-sm sm:text-base font-bold tracking-tight text-slate-900 dark:text-white flex items-center gap-1.5">
              <span>F1 GP Brasil</span>
              <span className="text-xs font-normal text-slate-500 dark:text-slate-400 hidden sm:inline">· Interlagos</span>
            </span>
          </div>

          {/* Zone 2: Navigation Links (Compact & Single-line) */}
          <nav className="hidden md:flex items-center gap-1 shrink-0">
            {[
              { id: 'telemetria', label: 'Telemetria 3D', icon: Gauge },
              { id: 'circuito', label: 'Interlagos', icon: MapPin },
              { id: 'fastapi', label: 'FastAPI Backend', icon: Server },
              { id: 'gccd', label: 'Metodologia GCCD', icon: Layers },
              { id: 'code', label: 'Código Python', icon: Code2 },
              { id: 'terminal', label: 'Terminal', icon: Terminal }
            ].map((tab) => {
              const Icon = tab.icon;
              const isActive = activeTab === tab.id;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as TabId)}
                  className={`px-2.5 py-1 text-xs font-medium rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
                    isActive
                      ? 'bg-emerald-50 dark:bg-emerald-950/60 text-emerald-700 dark:text-emerald-300 font-semibold border border-emerald-300/80 dark:border-emerald-700/60 shadow-xs'
                      : 'text-slate-600 dark:text-slate-300 hover:text-slate-900 dark:hover:text-white hover:bg-slate-100/80 dark:hover:bg-slate-800/80'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </nav>

          {/* Zone 3: Actions + Theme Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => setDarkMode(!darkMode)}
              className="p-1.5 text-slate-500 hover:text-slate-800 dark:text-slate-400 dark:hover:text-white rounded-lg hover:bg-slate-100 dark:hover:bg-slate-800 border border-slate-200 dark:border-slate-700 transition-colors"
              title={darkMode ? 'Mudar para Tema Claro (Leve e Acolhedor)' : 'Mudar para Tema Escuro'}
              aria-label="Alternar tema"
            >
              {darkMode ? <Sun className="w-4 h-4 text-amber-400" /> : <Moon className="w-4 h-4 text-slate-600" />}
            </button>

            <button
              onClick={handleDownloadFastApi}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-bold text-slate-900 bg-amber-400 hover:bg-amber-300 active:scale-95 rounded-lg transition-all shadow-xs border border-amber-300"
            >
              <Download className="w-3.5 h-3.5" />
              <span className="hidden sm:inline">Baixar</span> main.py
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip (Responsive Scroll) */}
        <div className="md:hidden flex items-center px-2 py-1.5 border-t border-slate-200/80 dark:border-slate-800 bg-white/95 dark:bg-slate-900/95 overflow-x-auto gap-1 text-xs">
          {[
            { id: 'telemetria', label: 'Telemetria' },
            { id: 'circuito', label: 'Interlagos' },
            { id: 'fastapi', label: 'FastAPI' },
            { id: 'gccd', label: 'GCCD' },
            { id: 'code', label: 'Código' },
            { id: 'terminal', label: 'Terminal' }
          ].map((tab) => (
            <button
              key={tab.id}
              onClick={() => setActiveTab(tab.id as TabId)}
              className={`px-2.5 py-1 rounded-md whitespace-nowrap font-medium text-xs transition-colors ${
                activeTab === tab.id
                  ? 'bg-emerald-100 dark:bg-emerald-950 text-emerald-800 dark:text-emerald-300 font-bold'
                  : 'text-slate-600 dark:text-slate-400 hover:text-slate-900'
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>
      </header>

      {/* Main Container - Compact Spacing */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-3 sm:px-5 lg:px-6 py-4 sm:py-5">
        {activeTab === 'telemetria' && <F1TelemetryGCCD darkMode={darkMode} />}
        {activeTab === 'circuito' && <InterlagosCircuitCard />}
        {activeTab === 'fastapi' && <FastApiExplorer />}
        {activeTab === 'gccd' && <GccdMethodologyTab />}
        {activeTab === 'code' && <CodeViewer />}
        {activeTab === 'terminal' && <TerminalSimulator />}
      </main>

      {/* Footer - Compact */}
      <footer className="border-t border-slate-200 dark:border-slate-800 py-3 bg-white/70 dark:bg-slate-900/70 text-xs text-slate-500 dark:text-slate-400">
        <div className="max-w-7xl mx-auto px-3 sm:px-5 lg:px-6 flex flex-col sm:flex-row items-center justify-between gap-2 text-center sm:text-left">
          <div className="flex items-center gap-2">
            <span className="font-semibold text-slate-700 dark:text-slate-300">
              Fórmula 1 · GP do Brasil (Interlagos)
            </span>
            <span>·</span>
            <span>FastAPI Backend</span>
            <span>·</span>
            <span>Metodologia GCCD</span>
          </div>

          <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-mono">
            <span>Autódromo José Carlos Pace · 4.309m</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
