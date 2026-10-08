/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect } from 'react';
import { SCENARIOS } from './data/mockDatasets';
import { ScenarioDataset, NetworkNode, DefensiveAction, TrafficFlow } from './types/threatcast';
import { Header } from './components/Header';
import { NetworkTopologyCanvas } from './components/NetworkTopologyCanvas';
import { AttackForecastView } from './components/AttackForecastView';
import { WhatIfDefenceStudio } from './components/WhatIfDefenceStudio';
import { ExplainableDefenceView } from './components/ExplainableDefenceView';
import { TrafficFlowTable } from './components/TrafficFlowTable';
import { SIHProjectDossier } from './components/SIHProjectDossier';
import { NodeDetailDrawer } from './components/NodeDetailDrawer';
import { Shield, AlertTriangle, ArrowRight, Activity, Cpu, Sparkles, CheckCircle2, RotateCcw } from 'lucide-react';

export default function App() {
  const [selectedScenario, setSelectedScenario] = useState<ScenarioDataset>(SCENARIOS[0]);
  const [activeTab, setActiveTab] = useState<'overview' | 'forecast' | 'whatif' | 'xai' | 'flows' | 'sih'>('overview');
  const [currentTimeWindow, setCurrentTimeWindow] = useState<'t0' | 't1' | 't2' | 't3'>('t0');
  const [isPlaying, setIsPlaying] = useState<boolean>(false);
  const [selectedNode, setSelectedNode] = useState<NetworkNode | null>(null);

  // Mutable state for scenario defensive actions & flows
  const [actions, setActions] = useState<DefensiveAction[]>(selectedScenario.defensiveActions);
  const [flows, setFlows] = useState<TrafficFlow[]>(selectedScenario.flows);
  const [isolatedNodeIds, setIsolatedNodeIds] = useState<string[]>([]);

  // Reset local state when scenario changes
  useEffect(() => {
    setActions(selectedScenario.defensiveActions);
    setFlows(selectedScenario.flows);
    setIsolatedNodeIds([]);
    setCurrentTimeWindow('t0');
    setIsPlaying(false);
    setSelectedNode(null);
  }, [selectedScenario]);

  // Simulation playback loop
  useEffect(() => {
    if (!isPlaying) return;

    const timer = setInterval(() => {
      setCurrentTimeWindow((prev) => {
        if (prev === 't0') return 't1';
        if (prev === 't1') return 't2';
        if (prev === 't2') return 't3';
        return 't0';
      });
    }, 4500);

    return () => clearInterval(timer);
  }, [isPlaying]);

  // Handle action toggle in What-If studio
  const handleToggleAction = (actionId: string) => {
    setActions((prev) =>
      prev.map((a) => {
        if (a.id === actionId) {
          const nextApplied = !a.applied;
          // If action targets a specific node, update isolation status
          if (a.targetNodeId && a.category === 'Host Isolation') {
            if (nextApplied) {
              setIsolatedNodeIds((curr) => Array.from(new Set([...curr, a.targetNodeId!])));
            } else {
              setIsolatedNodeIds((curr) => curr.filter((id) => id !== a.targetNodeId));
            }
          }
          return { ...a, applied: nextApplied };
        }
        return a;
      })
    );
  };

  // Toggle isolation directly from drawer
  const handleToggleNodeIsolation = (nodeId: string) => {
    setIsolatedNodeIds((curr) => {
      const exists = curr.includes(nodeId);
      if (exists) {
        return curr.filter((id) => id !== nodeId);
      } else {
        return [...curr, nodeId];
      }
    });
  };

  // Deploy policy handler
  const handleDeployPolicy = (appliedActions: DefensiveAction[]) => {
    const targetNodes = appliedActions
      .filter((a) => a.category === 'Host Isolation' && a.targetNodeId)
      .map((a) => a.targetNodeId as string);

    setIsolatedNodeIds((curr) => Array.from(new Set([...curr, ...targetNodes])));
  };

  // Inject synthetic flow
  const handleInjectFlow = (newFlow: TrafficFlow) => {
    setFlows((prev) => [newFlow, ...prev]);
  };

  // Compute active compromised nodes based on current time window
  const activeCompromisedNodes =
    selectedScenario.forecast.timeStates[currentTimeWindow].activeCompromisedNodes;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col font-sans selection:bg-rose-500/30">
      {/* Navigation Header */}
      <Header
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        scenarios={SCENARIOS}
        selectedScenario={selectedScenario}
        onSelectScenario={setSelectedScenario}
        isPlaying={isPlaying}
        onTogglePlay={() => setIsPlaying((p) => !p)}
        onReset={() => {
          setCurrentTimeWindow('t0');
          setIsPlaying(false);
          setIsolatedNodeIds([]);
          setActions(selectedScenario.defensiveActions.map((a) => ({ ...a, applied: false })));
        }}
        currentTimeWindow={currentTimeWindow}
      />

      {/* Main Content Viewport */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 py-6">
        {/* TAB 1: Network Overview & Live Topology */}
        {activeTab === 'overview' && (
          <div className="space-y-6">
            {/* Top Quick Status Kicker */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">World Model Status</span>
                  <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mt-0.5">
                    <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                    <span>Continuous Forecasting</span>
                  </div>
                </div>
                <Cpu className="w-6 h-6 text-slate-700" />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">Current Attack Stage</span>
                  <div className="text-sm font-bold text-rose-400 mt-0.5">
                    {selectedScenario.forecast.currentStage}
                  </div>
                </div>
                <AlertTriangle className="w-6 h-6 text-rose-800" />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">Predicted Next Stage</span>
                  <div className="text-sm font-bold text-amber-400 mt-0.5">
                    {selectedScenario.forecast.predictedNextStage}
                  </div>
                </div>
                <ArrowRight className="w-6 h-6 text-amber-700" />
              </div>

              <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex items-center justify-between">
                <div>
                  <span className="text-[10px] font-mono uppercase text-slate-500">Predicted Target Asset</span>
                  <div className="text-sm font-bold text-white mt-0.5 font-mono">
                    {selectedScenario.forecast.predictedTargetLabel}
                  </div>
                </div>
                <Shield className="w-6 h-6 text-indigo-700" />
              </div>
            </div>

            {/* Interactive Topology Canvas */}
            <NetworkTopologyCanvas
              nodes={selectedScenario.topology.nodes}
              edges={selectedScenario.topology.edges}
              selectedNodeId={selectedNode?.id || null}
              onSelectNode={(node) => setSelectedNode(node)}
              predictedPath={selectedScenario.forecast.primaryPath}
              activeCompromisedNodeIds={activeCompromisedNodes}
              isolatedNodeIds={isolatedNodeIds}
              currentTimeWindow={currentTimeWindow}
            />

            {/* Quick Actions & Navigation Strip */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <button
                onClick={() => setActiveTab('forecast')}
                className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-rose-500/50 transition-all text-left flex items-center justify-between group shadow-lg hover:shadow-rose-950/20"
              >
                <div>
                  <span className="text-[10px] font-mono text-rose-400 uppercase font-semibold tracking-wider">
                    Predictive Intelligence
                  </span>
                  <h4 className="font-bold text-sm text-white group-hover:text-rose-200 transition-colors mt-0.5">
                    Inspect Attack Forecast &rarr;
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Explore multi-step kill-chain projections, risk probability gauges, and graph trajectories.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('whatif')}
                className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-emerald-500/50 transition-all text-left flex items-center justify-between group shadow-lg hover:shadow-emerald-950/20"
              >
                <div>
                  <span className="text-[10px] font-mono text-emerald-400 uppercase font-semibold tracking-wider">
                    Security Decision-Support
                  </span>
                  <h4 className="font-bold text-sm text-white group-hover:text-emerald-200 transition-colors mt-0.5">
                    What-If Defence Studio &rarr;
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Test host quarantine, port filters, and BGP flowspec ACLs on the digital twin before production execution.
                  </p>
                </div>
              </button>

              <button
                onClick={() => setActiveTab('xai')}
                className="p-5 rounded-xl bg-gradient-to-br from-slate-900 to-slate-900/60 border border-slate-800 hover:border-sky-500/50 transition-all text-left flex items-center justify-between group shadow-lg hover:shadow-sky-950/20"
              >
                <div>
                  <span className="text-[10px] font-mono text-sky-400 uppercase font-semibold tracking-wider">
                    Explainable AI (XAI)
                  </span>
                  <h4 className="font-bold text-sm text-white group-hover:text-sky-200 transition-colors mt-0.5">
                    SHAP &amp; Attention Attribution &rarr;
                  </h4>
                  <p className="text-xs text-slate-400 mt-1 leading-relaxed">
                    Deconstruct packet-level feature attributions, self-attention weights, and MITRE TTPs.
                  </p>
                </div>
              </button>
            </div>
          </div>
        )}

        {/* TAB 2: Attack Forecast Dashboard */}
        {activeTab === 'forecast' && (
          <AttackForecastView
            forecast={selectedScenario.forecast}
            nodes={selectedScenario.topology.nodes}
            currentTimeWindow={currentTimeWindow}
            onChangeTimeWindow={(step) => setCurrentTimeWindow(step)}
            onSelectNodeById={(id) => {
              const node = selectedScenario.topology.nodes.find((n) => n.id === id);
              if (node) setSelectedNode(node);
            }}
          />
        )}

        {/* TAB 3: What-If Defence Studio */}
        {activeTab === 'whatif' && (
          <WhatIfDefenceStudio
            actions={actions}
            onToggleAction={handleToggleAction}
            nodes={selectedScenario.topology.nodes}
            initialRisk={selectedScenario.forecast.networkRiskScore}
            onDeployPolicy={handleDeployPolicy}
          />
        )}

        {/* TAB 4: Explainable AI & SHAP */}
        {activeTab === 'xai' && <ExplainableDefenceView xai={selectedScenario.xai} />}

        {/* TAB 5: PCAP & Traffic Flows */}
        {activeTab === 'flows' && (
          <TrafficFlowTable flows={flows} onInjectSyntheticFlow={handleInjectFlow} />
        )}

        {/* TAB 6: Architecture & Research Dossier */}
        {activeTab === 'sih' && <SIHProjectDossier />}
      </main>

      {/* Node Detail Drawer Modal */}
      <NodeDetailDrawer
        node={selectedNode}
        onClose={() => setSelectedNode(null)}
        edges={selectedScenario.topology.edges}
        isIsolated={selectedNode ? isolatedNodeIds.includes(selectedNode.id) : false}
        onToggleIsolation={handleToggleNodeIsolation}
      />

      {/* Persistent Clean Cyber Footer */}
      <footer className="border-t border-slate-900 bg-slate-950/80 backdrop-blur-md py-4 px-4 sm:px-6 mt-12 text-xs text-slate-500">
        <div className="max-w-7xl mx-auto flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-2">
            <span className="font-bold text-slate-300">ThreatCast</span>
            <span>&middot;</span>
            <span>Autonomous Network Attack Forecasting Platform</span>
            <span>&middot;</span>
            <span className="text-slate-400">Predict the threat, Protect the network</span>
          </div>
          <div className="flex items-center gap-4 text-[11px] font-mono">
            <span>Validated on CIC-IDS2017 &middot; CTU-13 &middot; UNSW-NB15</span>
            <span className="hidden sm:inline">&middot;</span>
            <span className="hidden sm:inline text-slate-400">GNN + Temporal World Model</span>
          </div>
        </div>
      </footer>
    </div>
  );
}
