import React from 'react';
import { Shield, Play, Pause, RotateCcw, AlertTriangle, Cpu, Radio, Network, Sliders, FileText, Layers } from 'lucide-react';
import { ScenarioDataset } from '../types/threatcast';

interface HeaderProps {
  activeTab: 'overview' | 'forecast' | 'whatif' | 'xai' | 'flows' | 'sih';
  setActiveTab: (tab: 'overview' | 'forecast' | 'whatif' | 'xai' | 'flows' | 'sih') => void;
  scenarios: ScenarioDataset[];
  selectedScenario: ScenarioDataset;
  onSelectScenario: (scenario: ScenarioDataset) => void;
  isPlaying: boolean;
  onTogglePlay: () => void;
  onReset: () => void;
  currentTimeWindow: 't0' | 't1' | 't2' | 't3';
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  scenarios,
  selectedScenario,
  onSelectScenario,
  isPlaying,
  onTogglePlay,
  onReset,
  currentTimeWindow,
}) => {
  return (
    <header className="border-b border-slate-800/80 bg-slate-950/95 backdrop-blur-xl sticky top-0 z-40 transition-all">
      {/* Top Cyber Telemetry Status Ribbon */}
      <div className="bg-gradient-to-r from-slate-950 via-slate-900/90 to-slate-950 border-b border-slate-800/50 px-4 sm:px-6 py-1.5 flex items-center justify-between text-xs text-slate-400">
        <div className="flex items-center gap-3">
          <div className="flex items-center gap-1.5">
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500"></span>
            </span>
            <span className="font-mono text-[11px] font-semibold text-emerald-400 tracking-wide uppercase">
              Predictive Cyber Defence
            </span>
          </div>
          <span className="text-slate-700 hidden sm:inline">|</span>
          <span className="hidden sm:inline text-slate-300 font-mono text-[11px]">
            Engine: <span className="text-slate-100">Temporal Transformer + Relational GNN</span>
          </span>
          <span className="text-slate-700 hidden md:inline">|</span>
          <span className="hidden md:inline text-slate-400 font-mono text-[11px]">
            Telemetry: <span className="text-cyan-400">Live Ingestion (14ms latency)</span>
          </span>
        </div>

        <div className="flex items-center gap-3 text-[11px] font-mono">
          <span className="text-slate-400 italic hidden lg:inline">
            &ldquo;Predict the threat, Protect the network&rdquo;
          </span>
          <span className="text-slate-700 hidden lg:inline">·</span>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-300">
            <Radio className="w-3 h-3 text-rose-400 animate-pulse" />
            <span>Multi-Stage Horizon: <strong className="text-white">Active</strong></span>
          </div>
        </div>
      </div>

      {/* Main Header Bar: 3-Zone Contract */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex items-center justify-between gap-4">
        {/* Zone 1: Brand Wordmark */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setActiveTab('overview')}
            className="flex items-center gap-3 group text-left focus:outline-none"
          >
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-rose-500/20 via-slate-900 to-indigo-500/20 border border-rose-500/30 group-hover:border-rose-400/60 flex items-center justify-center text-rose-400 shadow-[0_0_20px_rgba(244,63,94,0.15)] transition-all">
              <Shield className="w-5 h-5 transition-transform group-hover:scale-110" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl text-white tracking-tight group-hover:text-rose-200 transition-colors">
                  ThreatCast
                </span>
                <span className="text-[10px] font-mono font-bold text-rose-400 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded shadow-sm tracking-wider">
                  AI DEFENCE
                </span>
              </div>
              <p className="text-[11px] text-slate-400 font-medium hidden sm:block">
                Autonomous Attack Forecasting Platform
              </p>
            </div>
          </button>
        </div>

        {/* Zone 2: Navigation Links */}
        <nav className="hidden lg:flex items-center gap-1 p-1 bg-slate-900/80 rounded-xl border border-slate-800/80">
          <button
            onClick={() => setActiveTab('overview')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'overview'
                ? 'bg-slate-800 text-white shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Network className="w-3.5 h-3.5 text-indigo-400" />
            <span>Network Twin</span>
          </button>

          <button
            onClick={() => setActiveTab('forecast')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'forecast'
                ? 'bg-rose-950/60 text-rose-200 shadow-sm border border-rose-800/80'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Attack Forecast</span>
          </button>

          <button
            onClick={() => setActiveTab('whatif')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'whatif'
                ? 'bg-emerald-950/60 text-emerald-200 shadow-sm border border-emerald-800/80'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Sliders className="w-3.5 h-3.5 text-emerald-400" />
            <span>What-If Defence</span>
          </button>

          <button
            onClick={() => setActiveTab('xai')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'xai'
                ? 'bg-sky-950/60 text-sky-200 shadow-sm border border-sky-800/80'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Cpu className="w-3.5 h-3.5 text-sky-400" />
            <span>Explainable XAI</span>
          </button>

          <button
            onClick={() => setActiveTab('flows')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'flows'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <Layers className="w-3.5 h-3.5 text-slate-400" />
            <span>PCAP &amp; Flows</span>
          </button>

          <button
            onClick={() => setActiveTab('sih')}
            className={`px-3 py-1.5 text-xs font-semibold rounded-lg transition-all whitespace-nowrap flex items-center gap-1.5 ${
              activeTab === 'sih'
                ? 'bg-slate-800 text-slate-100 shadow-sm border border-slate-700/80'
                : 'text-slate-400 hover:text-slate-200 hover:bg-slate-800/50'
            }`}
          >
            <FileText className="w-3.5 h-3.5 text-rose-400" />
            <span>Architecture &amp; Research</span>
          </button>
        </nav>

        {/* Zone 3: Interactive Scenario & Simulation Controls */}
        <div className="flex items-center gap-2">
          {/* Scenario Picker */}
          <div className="relative">
            <select
              aria-label="Select benchmark dataset scenario"
              value={selectedScenario.id}
              onChange={(e) => {
                const found = scenarios.find((s) => s.id === e.target.value);
                if (found) onSelectScenario(found);
              }}
              className="bg-slate-900 border border-slate-700/80 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:ring-1 focus:ring-rose-500 font-mono max-w-[190px] sm:max-w-[250px] truncate cursor-pointer hover:border-slate-600 transition-colors"
            >
              {scenarios.map((sc) => (
                <option key={sc.id} value={sc.id}>
                  [{sc.benchmarkSource}] {sc.name}
                </option>
              ))}
            </select>
          </div>

          {/* Play/Pause Simulation */}
          <button
            onClick={onTogglePlay}
            title={isPlaying ? 'Pause Simulation' : 'Stream Continuous Progression'}
            className={`px-2.5 py-1.5 rounded-lg border text-xs font-semibold flex items-center gap-1.5 transition-all shadow-sm ${
              isPlaying
                ? 'bg-amber-950/70 border-amber-600 text-amber-200 hover:bg-amber-900/90 shadow-[0_0_12px_rgba(245,158,11,0.2)]'
                : 'bg-emerald-950/70 border-emerald-600 text-emerald-200 hover:bg-emerald-900/90 shadow-[0_0_12px_rgba(16,185,129,0.2)]'
            }`}
          >
            {isPlaying ? <Pause className="w-3.5 h-3.5" /> : <Play className="w-3.5 h-3.5" />}
            <span className="hidden sm:inline font-mono">{isPlaying ? 'Pause' : 'Stream'}</span>
          </button>

          {/* Reset */}
          <button
            onClick={onReset}
            title="Reset Simulation Horizon to t0"
            className="p-1.5 rounded-lg border border-slate-700/80 bg-slate-900 text-slate-400 hover:text-slate-100 hover:bg-slate-800 transition-colors"
          >
            <RotateCcw className="w-4 h-4" />
          </button>

          {/* Active Time Window Pill */}
          <div className="hidden sm:flex items-center px-2 py-1 rounded bg-slate-900 border border-slate-800 font-mono text-[11px] text-slate-300 tabular-nums">
            <span className="text-slate-500 mr-1.5">Horizon:</span>
            <span className="text-rose-400 font-bold">{currentTimeWindow.toUpperCase()}</span>
          </div>
        </div>
      </div>

      {/* Mobile Nav Tabs */}
      <div className="lg:hidden px-4 pb-2.5 flex items-center gap-1.5 overflow-x-auto no-scrollbar border-t border-slate-900 pt-2">
        <button
          onClick={() => setActiveTab('overview')}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'overview' ? 'bg-slate-800 text-white' : 'text-slate-400'
          }`}
        >
          Network Twin
        </button>
        <button
          onClick={() => setActiveTab('forecast')}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'forecast' ? 'bg-rose-950/60 text-rose-200' : 'text-slate-400'
          }`}
        >
          Attack Forecast
        </button>
        <button
          onClick={() => setActiveTab('whatif')}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'whatif' ? 'bg-emerald-950/60 text-emerald-200' : 'text-slate-400'
          }`}
        >
          What-If Defence
        </button>
        <button
          onClick={() => setActiveTab('xai')}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'xai' ? 'bg-sky-950/60 text-sky-200' : 'text-slate-400'
          }`}
        >
          Explainable XAI
        </button>
        <button
          onClick={() => setActiveTab('flows')}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'flows' ? 'bg-slate-800 text-slate-200' : 'text-slate-400'
          }`}
        >
          PCAP Flows
        </button>
        <button
          onClick={() => setActiveTab('sih')}
          className={`px-3 py-1 text-xs font-medium rounded-lg whitespace-nowrap ${
            activeTab === 'sih' ? 'bg-slate-800 text-slate-200' : 'text-slate-400'
          }`}
        >
          Research &amp; Architecture
        </button>
      </div>
    </header>
  );
};

