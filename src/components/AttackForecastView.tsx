import React from 'react';
import { AttackForecast, NetworkNode } from '../types/threatcast';
import { AlertTriangle, Clock, ArrowRight, ShieldAlert, Target, Activity, CheckCircle, Info, Zap } from 'lucide-react';

interface AttackForecastViewProps {
  forecast: AttackForecast;
  nodes: NetworkNode[];
  currentTimeWindow: 't0' | 't1' | 't2' | 't3';
  onChangeTimeWindow: (step: 't0' | 't1' | 't2' | 't3') => void;
  onSelectNodeById: (nodeId: string) => void;
}

export const AttackForecastView: React.FC<AttackForecastViewProps> = ({
  forecast,
  nodes,
  currentTimeWindow,
  onChangeTimeWindow,
  onSelectNodeById,
}) => {
  const activeTimeState = forecast.timeStates[currentTimeWindow];
  const targetNode = nodes.find((n) => n.id === forecast.predictedTargetNodeId);

  const killChainStages = [
    'Reconnaissance',
    'Initial Access',
    'Lateral Movement',
    'Command & Control',
    'Data Exfiltration',
  ];

  const currentStageIndex = killChainStages.indexOf(forecast.currentStage);
  const nextStageIndex = killChainStages.indexOf(forecast.predictedNextStage);

  return (
  <div className="space-y-6">
    {/* Threat Intelligence Metrics Dashboard */}
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Card 1: Network Risk Gauge */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 relative overflow-hidden flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium uppercase tracking-wider">Network Compromise Risk</span>
            <span className="font-mono text-rose-400">{currentTimeWindow.toUpperCase()} State</span>
          </div>

          <div className="flex items-baseline gap-3 my-1">
            <span className="text-4xl sm:text-5xl font-black font-mono tracking-tight text-rose-400 tabular-nums">
              {activeTimeState.networkRisk}%
            </span>
            <div className="flex flex-col">
              <span className="text-xs font-semibold text-rose-300">CRITICAL RISK</span>
              <span className="text-[11px] text-slate-400 font-mono">Confidence: {forecast.confidence}%</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="w-full bg-slate-800 rounded-full h-2 mt-3 overflow-hidden">
            <div
              className="bg-gradient-to-r from-amber-500 via-rose-500 to-rose-600 h-full rounded-full transition-all duration-500"
              style={{ width: `${activeTimeState.networkRisk}%` }}
            ></div>
          </div>

          <p className="text-[11px] text-slate-400 mt-2">
            Temporal GNN model projects {activeTimeState.networkRisk > 70 ? 'severe threat acceleration' : 'contained activity'}.
          </p>
        </div>

        {/* Card 2: Current vs Predicted Stage */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium uppercase tracking-wider">Attack Stage Progression</span>
            <span className="text-amber-400 font-mono text-[11px]">MITRE ATT&CK</span>
          </div>

          <div className="space-y-2 my-1">
            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Current Observed:</span>
              <span className="font-mono font-semibold text-slate-200">{forecast.currentStage}</span>
            </div>

            <div className="flex items-center justify-center py-1">
              <div className="flex items-center gap-2 text-rose-400 font-bold text-xs bg-rose-950/40 border border-rose-800/60 px-3 py-1 rounded-full">
                <span>Predicting Next Stage</span>
                <ArrowRight className="w-3.5 h-3.5 animate-pulse" />
              </div>
            </div>

            <div className="text-xs text-slate-400 flex items-center justify-between">
              <span>Forecasted Stage:</span>
              <span className="font-mono font-bold text-rose-400 text-sm">{forecast.predictedNextStage}</span>
            </div>
          </div>

          <div className="text-[11px] text-slate-400 pt-2 border-t border-slate-800/80 font-mono">
            Observed timestamp: {forecast.currentObservedTime}
          </div>
        </div>

        {/* Card 3: Predicted Target Device */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium uppercase tracking-wider">Forecasted Next Target</span>
            <Target className="w-4 h-4 text-amber-400" />
          </div>

          <div className="my-1">
            <div className="text-xl font-bold text-white tracking-tight flex items-center gap-2">
              <span className="text-amber-400">{forecast.predictedTargetLabel}</span>
              <span className="text-[10px] font-mono font-normal px-1.5 py-0.5 rounded bg-rose-950 border border-rose-800 text-rose-300">
                {targetNode?.criticality || 'Critical'} Asset
              </span>
            </div>
            <div className="text-xs font-mono text-slate-400 mt-1">
              IP: {targetNode?.ip || '10.0.2.22'} · Subnet: {targetNode?.subnet || 'Core LAN'}
            </div>
          </div>

          <div className="mt-3">
            <button
              onClick={() => onSelectNodeById(forecast.predictedTargetNodeId)}
              className="w-full text-xs py-1.5 px-2 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg transition-colors font-medium border border-slate-700 flex items-center justify-center gap-1.5"
            >
              <Info className="w-3.5 h-3.5" />
              <span>Inspect Target Vulnerabilities</span>
            </button>
          </div>
        </div>

        {/* Card 4: Forecast Window & Lead Time Advantage */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col justify-between">
          <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
            <span className="font-medium uppercase tracking-wider">Predictive Lead Time</span>
            <Clock className="w-4 h-4 text-emerald-400" />
          </div>

          <div className="my-1">
            <div className="text-3xl font-black font-mono text-emerald-400 tabular-nums">
              +{forecast.leadTimeGainMinutes} min
            </div>
            <div className="text-xs text-slate-300 font-medium mt-0.5">
              Warning lead time before lateral breach
            </div>
          </div>

          <div className="pt-2 border-t border-slate-800/80 text-[11px] text-slate-400 font-mono">
            Horizon: {forecast.forecastHorizon}
          </div>
        </div>
      </div>

      {/* Temporal Future-State Simulator Time Stepper */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Activity className="w-4 h-4 text-rose-400" />
              <span>AI World Model: Future-State Simulation Horizon</span>
            </h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Step through simulated time windows ($t_0 \to t_1 \to t_2 \to t_3$) to observe forecasted network evolution before it occurs.
            </p>
          </div>

          {/* Time Window Stepper Buttons */}
          <div className="flex items-center gap-1.5 bg-slate-950 p-1 rounded-lg border border-slate-800">
            {(['t0', 't1', 't2', 't3'] as const).map((step) => {
              const state = forecast.timeStates[step];
              const isActive = currentTimeWindow === step;
              return (
                <button
                  key={step}
                  onClick={() => onChangeTimeWindow(step)}
                  className={`px-3 py-1.5 text-xs font-mono font-medium rounded-md transition-all ${
                    isActive
                      ? 'bg-rose-600 text-white shadow-md font-semibold'
                      : 'text-slate-400 hover:text-slate-200 hover:bg-slate-900'
                  }`}
                >
                  <span className="uppercase">{step}</span>
                  <span className="text-[10px] opacity-80 block">{step === 't0' ? 'Now' : step === 't1' ? '+15m' : step === 't2' ? '+30m' : '+60m'}</span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Active Simulation Step Details Banner */}
        <div className="mt-4 p-4 rounded-lg bg-slate-950/70 border border-slate-800/80 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="px-2 py-0.5 rounded text-[11px] font-mono font-bold bg-rose-950 border border-rose-800 text-rose-400 uppercase">
                {activeTimeState.step} Timeline
              </span>
              <span className="text-xs font-semibold text-slate-200">{activeTimeState.headline}</span>
            </div>
            <p className="text-xs text-slate-400 max-w-2xl">{activeTimeState.forecastSummary}</p>
          </div>

          <div className="flex items-center gap-4 text-xs font-mono shrink-0">
            <div>
              <span className="text-slate-500 block text-[10px]">Active Compromised:</span>
              <span className="text-rose-400 font-semibold">{activeTimeState.activeCompromisedNodes.length} devices</span>
            </div>
            <div>
              <span className="text-slate-500 block text-[10px]">Predicted Step Risk:</span>
              <span className="text-amber-400 font-semibold">{activeTimeState.networkRisk}%</span>
            </div>
          </div>
        </div>

        {/* Kill Chain Progression Visual Tracker */}
        <div className="mt-6">
          <div className="text-xs font-medium text-slate-400 mb-2">Kill-Chain Sequence Progress</div>
          <div className="grid grid-cols-2 sm:grid-cols-5 gap-2">
            {killChainStages.map((stage, idx) => {
              const isPast = idx < currentStageIndex;
              const isCurrent = idx === currentStageIndex;
              const isPredicted = idx === nextStageIndex;

              let cardBg = 'bg-slate-950/60 border-slate-800 text-slate-500';
              if (isPast) {
                cardBg = 'bg-slate-900 border-slate-700 text-slate-300';
              } else if (isCurrent) {
                cardBg = 'bg-rose-950/50 border-rose-700 text-rose-200 shadow-sm';
              } else if (isPredicted) {
                cardBg = 'bg-amber-950/50 border-amber-600 text-amber-200 shadow-sm animate-pulse';
              }

              return (
                <div key={stage} className={`p-3 rounded-lg border text-xs flex flex-col justify-between ${cardBg}`}>
                  <div className="flex items-center justify-between text-[10px] font-mono mb-1">
                    <span>STAGE 0{idx + 1}</span>
                    {isCurrent && <span className="text-rose-400 font-bold">OBSERVED</span>}
                    {isPredicted && <span className="text-amber-400 font-bold">FORECASTED</span>}
                  </div>
                  <div className="font-semibold">{stage}</div>
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* Attack Path Graph Through Devices */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-amber-400" />
              <span>Forecasted Attacker Trajectory (Graph Neural Network Walk)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Multi-hop path sequence projected by the Relational Graph Neural Network with edge probability weights.
            </p>
          </div>
          <span className="text-xs font-mono text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2.5 py-1 rounded">
            Primary Confidence: 86.4%
          </span>
        </div>

        {/* Visual Node Sequence */}
        <div className="p-4 bg-slate-950 rounded-lg border border-slate-800/80 overflow-x-auto">
          <div className="flex items-center gap-3 min-w-[620px]">
            {forecast.primaryPath.map((nodeId, idx) => {
              const node = nodes.find((n) => n.id === nodeId);
              const isLast = idx === forecast.primaryPath.length - 1;
              const isForecasted = idx >= 2;

              return (
                <React.Fragment key={nodeId}>
                  <div
                    onClick={() => node && onSelectNodeById(node.id)}
                    className={`cursor-pointer p-3 rounded-lg border flex flex-col min-w-[140px] transition-all hover:border-slate-500 ${
                      isForecasted
                        ? 'bg-amber-950/20 border-amber-600/70 text-amber-200'
                        : 'bg-rose-950/20 border-rose-600/70 text-rose-200'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] font-mono">
                      <span>Hop {idx}</span>
                      <span className={isForecasted ? 'text-amber-400' : 'text-rose-400'}>
                        {isForecasted ? 'Forecasted' : 'Compromised'}
                      </span>
                    </div>
                    <div className="font-bold text-sm text-white mt-1 truncate">{node?.label || nodeId}</div>
                    <div className="text-[11px] font-mono text-slate-400 truncate">{node?.ip}</div>
                  </div>

                  {!isLast && (
                    <div className="flex flex-col items-center justify-center shrink-0 text-slate-500">
                      <ArrowRight className={`w-5 h-5 ${isForecasted ? 'text-amber-400' : 'text-rose-400'}`} />
                      <span className="text-[9px] font-mono text-slate-400">{idx === 1 ? 'SMB:445' : idx === 2 ? 'TCP:5432' : 'HTTPS:443'}</span>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        </div>

        {/* Secondary branch path info */}
        {forecast.secondaryPath && (
          <div className="mt-3 text-xs text-slate-400 flex items-center gap-2">
            <span className="font-mono text-slate-500">Alternative Branch (68% prob):</span>
            <span className="font-mono text-slate-300">
              Web-01 &rarr; WS-Finance-09 &rarr; DC-Corp-01 (Kerberoasting pivot)
            </span>
          </div>
        )}
      </div>

      {/* MITRE ATT&CK Matrix Mapping Grid */}
      <div className="bg-slate-900/90 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <ShieldAlert className="w-4 h-4 text-rose-400" />
              <span>MITRE ATT&CK&reg; Enterprise Technique Alignment</span>
            </h3>
            <p className="text-xs text-slate-400">
              Observed telemetry features aligned to standard adversarial tactics, techniques, and procedures (TTPs).
            </p>
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
          {forecast.mitreTactics.map((tactic) => (
            <div key={tactic.id} className="p-3.5 rounded-lg bg-slate-950 border border-slate-800 hover:border-slate-700 transition-colors">
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-rose-400 bg-rose-950/60 border border-rose-800/60 px-1.5 py-0.5 rounded">
                    {tactic.id}
                  </span>
                  <span className="text-xs font-semibold text-slate-200">{tactic.name}</span>
                </div>
                <span className="text-[10px] font-mono uppercase px-1.5 py-0.2 rounded bg-slate-800 text-slate-300">
                  {tactic.tactic}
                </span>
              </div>
              <p className="text-xs text-slate-300 font-medium mb-1">{tactic.technique}</p>
              <p className="text-[11px] text-slate-400">{tactic.description}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
