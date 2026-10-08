import React, { useState } from 'react';
import { DefensiveAction, NetworkNode } from '../types/threatcast';
import { Shield, ShieldAlert, CheckCircle2, Lock, ArrowRight, Play, RefreshCw, Cpu, Check, AlertOctagon } from 'lucide-react';

interface WhatIfDefenceStudioProps {
  actions: DefensiveAction[];
  onToggleAction: (actionId: string) => void;
  nodes: NetworkNode[];
  initialRisk: number;
  onDeployPolicy: (appliedActions: DefensiveAction[]) => void;
}

export const WhatIfDefenceStudio: React.FC<WhatIfDefenceStudioProps> = ({
  actions,
  onToggleAction,
  nodes,
  initialRisk,
  onDeployPolicy,
}) => {
  const [isSimulating, setIsSimulating] = useState(false);
  const [simulationRun, setSimulationRun] = useState(true);
  const [deploymentLog, setDeploymentLog] = useState<string | null>(null);

  // Compute calculated risk after applying selected mitigations
  const totalReduction = actions
    .filter((a) => a.applied)
    .reduce((sum, a) => sum + a.riskReductionPct, 0);

  // Ensure risk doesn't drop below 8% baseline
  const mitigatedRisk = Math.max(8, Math.round(initialRisk * (1 - Math.min(0.9, totalReduction / 100))));
  const riskDelta = initialRisk - mitigatedRisk;
  const activeCount = actions.filter((a) => a.applied).length;

  const handleSimulate = () => {
    setIsSimulating(true);
    setTimeout(() => {
      setIsSimulating(false);
      setSimulationRun(true);
    }, 600);
  };

  const handleDeploy = () => {
    const applied = actions.filter((a) => a.applied);
    onDeployPolicy(applied);
    setDeploymentLog(
      `[SOC-AUDIT-${new Date().toISOString().substring(11, 19)}] Policy deployed successfully. ${applied.length} mitigation rules pushed to SDN controller & EDR agents. Network risk contained from ${initialRisk}% to ${mitigatedRisk}%.`
    );
  };

  return (
    <div className="space-y-6">
      {/* Header Banner: SIH Slide 6 Screen 3 - Security Decision Support */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
              DECISION-SUPPORT TWIN
            </span>
            <h2 className="text-lg font-bold text-slate-100 tracking-tight">
              What-If Defence &amp; Security Decision-Support
            </h2>
          </div>
          <p className="text-xs text-slate-400 mt-1 max-w-2xl">
            Simulate defensive playbooks on the digital network twin <em>before</em> making live changes. Predict risk reduction, blast radius containment, and business SLA impact without operational downtime.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <button
            onClick={handleSimulate}
            disabled={isSimulating}
            className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-slate-100 rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-2 shadow-sm"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${isSimulating ? 'animate-spin text-emerald-400' : ''}`} />
            <span>{isSimulating ? 'Recalculating Twin...' : 'Simulate Defence'}</span>
          </button>

          <button
            onClick={handleDeploy}
            disabled={activeCount === 0}
            className={`px-4 py-2 rounded-lg text-xs font-semibold transition-all flex items-center gap-2 ${
              activeCount > 0
                ? 'bg-emerald-600 hover:bg-emerald-500 text-white shadow-lg shadow-emerald-950/40'
                : 'bg-slate-800 text-slate-500 cursor-not-allowed border border-slate-800'
            }`}
          >
            <CheckCircle2 className="w-4 h-4" />
            <span>Deploy Active Policy ({activeCount})</span>
          </button>
        </div>
      </div>

      {/* BEFORE vs AFTER Direct Visual Comparison: Direct realization of Slide 6 Prototype Screen 3 */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* BEFORE BOX */}
        <div className="bg-slate-900/90 border border-rose-900/50 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
                <span className="font-bold text-sm text-slate-100 uppercase tracking-wide">BEFORE MITIGATION</span>
              </div>
              <span className="text-xs font-mono text-rose-400 bg-rose-950/80 border border-rose-800/80 px-2 py-0.5 rounded">
                Unmitigated Trajectory
              </span>
            </div>

            {/* Before Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Network Risk</div>
                <div className="text-2xl font-bold font-mono text-rose-400 mt-1">{initialRisk}%</div>
                <div className="text-[10px] text-rose-300 font-semibold">Critical Threat</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Assets Threatened</div>
                <div className="text-2xl font-bold font-mono text-rose-400 mt-1">4 Nodes</div>
                <div className="text-[10px] text-slate-400">Web, App, DB, DC</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Blast Radius</div>
                <div className="text-2xl font-bold font-mono text-amber-400 mt-1">High</div>
                <div className="text-[10px] text-slate-400">Inter-Subnet Spread</div>
              </div>
            </div>

            {/* Before Diagram Representation */}
            <div className="p-4 bg-slate-950 rounded-lg border border-rose-950 flex flex-col items-center justify-center min-h-[160px] text-center">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-rose-950/60 border border-rose-700 text-rose-300 flex flex-col items-center">
                  <ShieldAlert className="w-5 h-5 mb-1 text-rose-400 animate-bounce" />
                  <span>Web-01</span>
                  <span className="text-[10px] text-rose-400">Compromised</span>
                </div>
                <ArrowRight className="w-5 h-5 text-rose-500 animate-pulse" />
                <div className="p-3 rounded-lg bg-slate-900 border border-amber-600/70 text-amber-200 flex flex-col items-center">
                  <AlertOctagon className="w-5 h-5 mb-1 text-amber-400" />
                  <span>Server-02</span>
                  <span className="text-[10px] text-amber-400">Forecasted Target</span>
                </div>
                <ArrowRight className="w-5 h-5 text-slate-600" />
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 flex flex-col items-center">
                  <span className="text-xs">DB-Core-01</span>
                  <span className="text-[10px] text-slate-500">Impending Dump</span>
                </div>
              </div>
              <p className="text-xs text-rose-300/80 mt-4 max-w-sm">
                Without intervention, lateral spread traverses SMB/RPC to Server-02 within 18 minutes.
              </p>
            </div>
          </div>
        </div>

        {/* AFTER BOX */}
        <div className="bg-slate-900/90 border border-emerald-900/50 rounded-xl p-5 flex flex-col justify-between shadow-xl">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
                <span className="font-bold text-sm text-slate-100 uppercase tracking-wide">AFTER DEFENCE SIMULATION</span>
              </div>
              <span className="text-xs font-mono text-emerald-400 bg-emerald-950/80 border border-emerald-800/80 px-2 py-0.5 rounded">
                Protected State
              </span>
            </div>

            {/* After Metrics */}
            <div className="grid grid-cols-3 gap-3 mb-4">
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Mitigated Risk</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">{mitigatedRisk}%</div>
                <div className="text-[10px] text-emerald-300 font-semibold">-{riskDelta}% Contained</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Downstream Saved</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">100%</div>
                <div className="text-[10px] text-slate-400">Core Assets Shielded</div>
              </div>
              <div className="bg-slate-950 p-3 rounded-lg border border-slate-800 text-center">
                <div className="text-[10px] text-slate-500 uppercase font-mono">Network Uptime</div>
                <div className="text-2xl font-bold font-mono text-emerald-400 mt-1">99.4%</div>
                <div className="text-[10px] text-slate-400">Zero SLA Breach</div>
              </div>
            </div>

            {/* After Diagram Representation */}
            <div className="p-4 bg-slate-950 rounded-lg border border-emerald-950 flex flex-col items-center justify-center min-h-[160px] text-center">
              <div className="flex items-center gap-4 text-xs font-mono">
                <div className="p-3 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 flex flex-col items-center relative">
                  <div className="absolute -top-2 -right-2 bg-slate-800 text-slate-300 p-0.5 rounded border border-slate-700">
                    <Lock className="w-3.5 h-3.5 text-slate-400" />
                  </div>
                  <span>Web-01</span>
                  <span className="text-[10px] text-slate-400">Isolated &amp; Quarantined</span>
                </div>
                <div className="text-xs text-rose-500 font-mono font-bold px-1.5 py-0.5 bg-rose-950/60 rounded border border-rose-800">
                  SEVERED
                </div>
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-600 text-emerald-200 flex flex-col items-center">
                  <CheckCircle2 className="w-5 h-5 mb-1 text-emerald-400" />
                  <span>Server-02</span>
                  <span className="text-[10px] text-emerald-400">Secured &amp; Active</span>
                </div>
                <ArrowRight className="w-5 h-5 text-emerald-600" />
                <div className="p-3 rounded-lg bg-emerald-950/40 border border-emerald-600 text-emerald-200 flex flex-col items-center">
                  <CheckCircle2 className="w-5 h-5 mb-1 text-emerald-400" />
                  <span className="text-xs">DB-Core-01</span>
                  <span className="text-[10px] text-emerald-400">Safe (TLS intact)</span>
                </div>
              </div>
              <p className="text-xs text-emerald-300/80 mt-4 max-w-sm">
                Attacker trapped on isolated perimeter VLAN. Zero unauthorized lateral access to internal credentials.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Deployment Log Feedback */}
      {deploymentLog && (
        <div className="p-3.5 rounded-lg bg-emerald-950/40 border border-emerald-700/80 text-emerald-300 text-xs font-mono flex items-center gap-2">
          <Check className="w-4 h-4 shrink-0 text-emerald-400" />
          <span>{deploymentLog}</span>
        </div>
      )}

      {/* Interactive Defensive Playbook Action Cards */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Shield className="w-4 h-4 text-emerald-400" />
              <span>Available Defensive Countermeasures (Click to Toggle in Simulation)</span>
            </h3>
            <p className="text-xs text-slate-400">
              Select one or multiple playbooks to test composite risk reduction on the AI World Model.
            </p>
          </div>
          <span className="text-xs font-mono text-slate-400">
            {activeCount} of {actions.length} selected
          </span>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
          {actions.map((act) => {
            return (
              <div
                key={act.id}
                onClick={() => onToggleAction(act.id)}
                className={`p-4 rounded-lg border cursor-pointer transition-all ${
                  act.applied
                    ? 'bg-emerald-950/30 border-emerald-600 shadow-md ring-1 ring-emerald-500/20'
                    : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="flex items-start justify-between gap-3">
                  <div className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={act.applied}
                      onChange={() => onToggleAction(act.id)}
                      className="rounded bg-slate-900 border-slate-700 text-emerald-600 focus:ring-0 focus:ring-offset-0 cursor-pointer"
                      onClick={(e) => e.stopPropagation()}
                    />
                    <div>
                      <h4 className="text-xs font-bold text-white tracking-tight">{act.title}</h4>
                      <span className="text-[10px] font-mono text-slate-400">{act.category}</span>
                    </div>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono font-bold text-emerald-400">
                      -{act.riskReductionPct}% Risk
                    </span>
                    <span className="block text-[10px] text-slate-500">
                      Impact: {act.availabilityImpact}
                    </span>
                  </div>
                </div>

                <p className="text-xs text-slate-300 mt-2">{act.description}</p>

                <div className="mt-2.5 pt-2 border-t border-slate-800/80">
                  <span className="text-[10px] font-mono text-slate-500 block mb-0.5">Execution Rule / Script:</span>
                  <code className="text-[10px] font-mono text-slate-300 bg-slate-900 px-2 py-0.5 rounded block truncate">
                    {act.actionScript}
                  </code>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
