import React, { useState } from 'react';
import { NetworkNode, NetworkEdge } from '../types/threatcast';
import { Server, Database, Shield, Monitor, Skull, Lock, Router, Eye, AlertCircle, CheckCircle2 } from 'lucide-react';

interface NetworkTopologyCanvasProps {
  nodes: NetworkNode[];
  edges: NetworkEdge[];
  selectedNodeId: string | null;
  onSelectNode: (node: NetworkNode) => void;
  predictedPath: string[];
  activeCompromisedNodeIds: string[];
  isolatedNodeIds: string[];
  currentTimeWindow: 't0' | 't1' | 't2' | 't3';
}

export const NetworkTopologyCanvas: React.FC<NetworkTopologyCanvasProps> = ({
  nodes,
  edges,
  selectedNodeId,
  onSelectNode,
  predictedPath,
  activeCompromisedNodeIds,
  isolatedNodeIds,
  currentTimeWindow,
}) => {
  const [showFlowVectors, setShowFlowVectors] = useState(true);
  const [showSubnetBoundaries, setShowSubnetBoundaries] = useState(true);

  // Helper to render icon by node role
  const renderNodeIcon = (node: NetworkNode) => {
    const isIsolated = isolatedNodeIds.includes(node.id);
    if (isIsolated) return <Lock className="w-5 h-5 text-slate-400" />;

    switch (node.role) {
      case 'attacker':
        return <Skull className="w-5 h-5 text-rose-400" />;
      case 'firewall':
      case 'perimeter_router':
        return <Shield className="w-5 h-5 text-indigo-400" />;
      case 'database':
        return <Database className="w-5 h-5 text-amber-400" />;
      case 'workstation':
        return <Monitor className="w-5 h-5 text-sky-400" />;
      case 'backup_vault':
        return <Lock className="w-5 h-5 text-emerald-400" />;
      case 'dmz_web':
      case 'app_server':
      case 'domain_controller':
      default:
        return <Server className="w-5 h-5 text-purple-400" />;
    }
  };

  return (
    <div className="bg-slate-900/90 border border-slate-800 rounded-xl overflow-hidden relative shadow-2xl flex flex-col">
      {/* Topology Toolbar */}
      <div className="bg-slate-950/80 px-4 py-2.5 border-b border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2">
          <Router className="w-4 h-4 text-rose-400" />
          <span className="font-semibold text-slate-200">Interactive Network Topology & Attack Vector Twin</span>
          <span className="text-slate-500 font-mono text-[11px]">({nodes.length} nodes · {edges.length} flow channels)</span>
        </div>

        <div className="flex items-center gap-3">
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              type="checkbox"
              checked={showFlowVectors}
              onChange={(e) => setShowFlowVectors(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>Traffic Flow Vectors</span>
          </label>
          <label className="flex items-center gap-1.5 cursor-pointer text-slate-300 hover:text-white select-none">
            <input
              type="checkbox"
              checked={showSubnetBoundaries}
              onChange={(e) => setShowSubnetBoundaries(e.target.checked)}
              className="rounded bg-slate-800 border-slate-700 text-rose-500 focus:ring-0 focus:ring-offset-0"
            />
            <span>Subnet Zones</span>
          </label>
        </div>
      </div>

      {/* SVG Canvas Area */}
      <div className="relative w-full h-[460px] bg-gradient-to-b from-slate-950 via-slate-900 to-slate-950 overflow-auto">
        <svg
          viewBox="0 0 1060 440"
          className="w-full h-full min-w-[760px] select-none"
          xmlns="http://www.w3.org/2000/svg"
        >
          <defs>
            {/* Cyber Grid Pattern */}
            <pattern id="cyber-grid" width="40" height="40" patternUnits="userSpaceOnUse">
              <path d="M 40 0 L 0 0 0 40" fill="none" stroke="rgba(255, 255, 255, 0.03)" strokeWidth="1" />
              <circle cx="40" cy="40" r="1" fill="rgba(255, 255, 255, 0.08)" />
            </pattern>

            {/* Gradients */}
            <linearGradient id="grad-malicious" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#f43f5e" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#e11d48" stopOpacity="0.3" />
            </linearGradient>
            <linearGradient id="grad-predicted" x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor="#f59e0b" stopOpacity="0.9" />
              <stop offset="100%" stopColor="#f43f5e" stopOpacity="0.9" />
            </linearGradient>
            <filter id="glow-red" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="4" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
            <filter id="glow-amber" x="-20%" y="-20%" width="140%" height="140%">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
          </defs>

          {/* Grid Background */}
          <rect width="100%" height="100%" fill="url(#cyber-grid)" />

          {/* Subnet Boundary Backgrounds */}
          {showSubnetBoundaries && (
            <g className="subnets opacity-60">
              {/* External WAN */}
              <rect
                x="30"
                y="50"
                width="140"
                height="340"
                rx="12"
                fill="rgba(244, 63, 94, 0.03)"
                stroke="rgba(244, 63, 94, 0.2)"
                strokeDasharray="4 4"
              />
              <text x="45" y="75" fill="#f43f5e" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                EXTERNAL WAN
              </text>

              {/* Edge & DMZ */}
              <rect
                x="210"
                y="50"
                width="360"
                height="340"
                rx="12"
                fill="rgba(99, 102, 241, 0.03)"
                stroke="rgba(99, 102, 241, 0.2)"
                strokeDasharray="4 4"
              />
              <text x="225" y="75" fill="#818cf8" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                EDGE & DMZ ZONE (10.0.1.0/24)
              </text>

              {/* Core LAN & Secure DB */}
              <rect
                x="610"
                y="50"
                width="420"
                height="340"
                rx="12"
                fill="rgba(16, 185, 129, 0.03)"
                stroke="rgba(16, 185, 129, 0.2)"
                strokeDasharray="4 4"
              />
              <text x="625" y="75" fill="#34d399" fontSize="10" fontFamily="JetBrains Mono" fontWeight="600">
                INTERNAL CORE & DB (10.0.2.0 - 10.0.5.0)
              </text>
            </g>
          )}

          {/* Edges / Network Connections */}
          <g className="edges">
            {edges.map((edge) => {
              const sourceNode = nodes.find((n) => n.id === edge.source);
              const targetNode = nodes.find((n) => n.id === edge.target);
              if (!sourceNode || !targetNode) return null;

              const isSourceIsolated = isolatedNodeIds.includes(sourceNode.id);
              const isTargetIsolated = isolatedNodeIds.includes(targetNode.id);
              const isSevered = isSourceIsolated || isTargetIsolated || edge.status === 'blocked';

              const isPredicted = edge.isPredictedPath;
              const isMalicious = edge.status === 'malicious';
              const isSuspicious = edge.status === 'suspicious';

              // Edge stroke colors
              let strokeColor = '#334155'; // default slate-700
              let strokeWidth = 1.5;
              let strokeDash = '';
              let animClass = '';

              if (isSevered) {
                strokeColor = '#475569';
                strokeDash = '3 3';
              } else if (isMalicious) {
                strokeColor = '#f43f5e';
                strokeWidth = 2.5;
                animClass = showFlowVectors ? 'animate-packet-flow-fast' : '';
              } else if (isPredicted) {
                strokeColor = '#f59e0b';
                strokeWidth = 2.2;
                strokeDash = '5 5';
                animClass = showFlowVectors ? 'animate-packet-flow' : '';
              } else if (isSuspicious) {
                strokeColor = '#fbbf24';
                strokeWidth = 2;
                animClass = showFlowVectors ? 'animate-packet-flow' : '';
              } else {
                strokeColor = '#10b981';
                strokeWidth = 1.5;
                if (showFlowVectors) animClass = 'animate-packet-flow';
              }

              // Path calculation
              const midX = (sourceNode.x + targetNode.x) / 2;
              const midY = (sourceNode.y + targetNode.y) / 2;

              return (
                <g key={edge.id} className="transition-all duration-300">
                  {/* Outer glow line for predicted or malicious path */}
                  {(isPredicted || isMalicious) && !isSevered && (
                    <line
                      x1={sourceNode.x}
                      y1={sourceNode.y}
                      x2={targetNode.x}
                      y2={targetNode.y}
                      stroke={isMalicious ? '#f43f5e' : '#f59e0b'}
                      strokeWidth={6}
                      strokeOpacity={0.25}
                    />
                  )}

                  {/* Primary flow line */}
                  <line
                    x1={sourceNode.x}
                    y1={sourceNode.y}
                    x2={targetNode.x}
                    y2={targetNode.y}
                    stroke={strokeColor}
                    strokeWidth={strokeWidth}
                    strokeDasharray={strokeDash}
                    className={animClass}
                  />

                  {/* Edge Port & Protocol Label */}
                  <g transform={`translate(${midX}, ${midY})`}>
                    <rect
                      x="-28"
                      y="-9"
                      width="56"
                      height="18"
                      rx="4"
                      fill="#0f172a"
                      stroke={isSevered ? '#475569' : strokeColor}
                      strokeWidth="0.8"
                      opacity="0.9"
                    />
                    <text
                      x="0"
                      y="3.5"
                      fill={isSevered ? '#94a3b8' : '#e2e8f0'}
                      fontSize="9"
                      fontFamily="JetBrains Mono"
                      textAnchor="middle"
                    >
                      {isSevered ? 'BLOCKED' : `${edge.protocol}:${edge.port}`}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>

          {/* Predicted Path Trajectory Arrows */}
          <g className="predicted-overlay pointer-events-none">
            {predictedPath.map((nodeId, idx) => {
              if (idx === predictedPath.length - 1) return null;
              const nextNodeId = predictedPath[idx + 1];
              const curr = nodes.find((n) => n.id === nodeId);
              const next = nodes.find((n) => n.id === nextNodeId);
              if (!curr || !next) return null;

              return (
                <g key={`pred-step-${idx}`}>
                  <circle
                    cx={next.x}
                    cy={next.y}
                    r="34"
                    fill="none"
                    stroke="#f59e0b"
                    strokeWidth="1.5"
                    strokeDasharray="4 4"
                    className="animate-spin"
                    style={{ transformOrigin: `${next.x}px ${next.y}px`, animationDuration: '8s' }}
                    opacity={0.6}
                  />
                </g>
              );
            })}
          </g>

          {/* Nodes */}
          <g className="nodes">
            {nodes.map((node) => {
              const isSelected = selectedNodeId === node.id;
              const isIsolated = isolatedNodeIds.includes(node.id);
              const isCompromised = activeCompromisedNodeIds.includes(node.id);
              const isPredictedTarget = predictedPath.includes(node.id) && !isCompromised;

              let nodeBorderColor = '#475569';
              let nodeBg = '#0f172a';
              let badgeText = 'Nominal';
              let badgeColor = '#10b981';

              if (isIsolated) {
                nodeBorderColor = '#64748b';
                nodeBg = '#1e293b';
                badgeText = 'Isolated';
                badgeColor = '#94a3b8';
              } else if (isCompromised) {
                nodeBorderColor = '#f43f5e';
                nodeBg = '#4c0519';
                badgeText = 'Compromised';
                badgeColor = '#f43f5e';
              } else if (isPredictedTarget) {
                nodeBorderColor = '#f59e0b';
                nodeBg = '#451a03';
                badgeText = 'Predicted Next';
                badgeColor = '#f59e0b';
              } else if (node.riskScore > 50) {
                nodeBorderColor = '#eab308';
                badgeText = 'At Risk';
                badgeColor = '#eab308';
              }

              return (
                <g
                  key={node.id}
                  transform={`translate(${node.x}, ${node.y})`}
                  onClick={() => onSelectNode(node)}
                  className="cursor-pointer group"
                >
                  {/* Selection Ring */}
                  {isSelected && (
                    <circle
                      r="32"
                      fill="none"
                      stroke="#38bdf8"
                      strokeWidth="2.5"
                      strokeDasharray="4 4"
                      className="animate-spin"
                      style={{ animationDuration: '6s' }}
                    />
                  )}

                  {/* Threat Pulse for compromised nodes */}
                  {isCompromised && !isIsolated && (
                    <circle
                      r="28"
                      fill="none"
                      stroke="#f43f5e"
                      strokeWidth="2"
                      opacity="0.7"
                      className="animate-ping"
                      style={{ animationDuration: '2.5s' }}
                    />
                  )}

                  {/* Target Crosshair for predicted target */}
                  {isPredictedTarget && (
                    <circle
                      r="26"
                      fill="none"
                      stroke="#f59e0b"
                      strokeWidth="2"
                      opacity="0.8"
                      className="animate-pulse"
                    />
                  )}

                  {/* Main Node Circle */}
                  <circle
                    r="22"
                    fill={nodeBg}
                    stroke={isSelected ? '#38bdf8' : nodeBorderColor}
                    strokeWidth={isSelected ? 3 : 2}
                    className="transition-all duration-200 group-hover:scale-110"
                  />

                  {/* Icon */}
                  <foreignObject x="-10" y="-10" width="20" height="20" className="pointer-events-none">
                    <div className="flex items-center justify-center w-full h-full">
                      {renderNodeIcon(node)}
                    </div>
                  </foreignObject>

                  {/* Node Label */}
                  <text
                    y="36"
                    textAnchor="middle"
                    fill="#f1f5f9"
                    fontSize="11"
                    fontWeight="600"
                    fontFamily="Plus Jakarta Sans"
                    className="select-none"
                  >
                    {node.label}
                  </text>

                  {/* IP Address */}
                  <text
                    y="48"
                    textAnchor="middle"
                    fill="#94a3b8"
                    fontSize="9"
                    fontFamily="JetBrains Mono"
                    className="select-none"
                  >
                    {node.ip}
                  </text>

                  {/* Status Kicker */}
                  <g transform="translate(0, -26)">
                    <rect
                      x="-30"
                      y="-7"
                      width="60"
                      height="14"
                      rx="3"
                      fill="#020617"
                      stroke={badgeColor}
                      strokeWidth="0.8"
                    />
                    <text
                      y="3.5"
                      textAnchor="middle"
                      fill={badgeColor}
                      fontSize="8"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {badgeText}
                    </text>
                  </g>

                  {/* Risk Score Pill */}
                  <g transform="translate(18, -16)">
                    <circle r="9" fill="#0f172a" stroke={badgeColor} strokeWidth="1" />
                    <text
                      y="3"
                      textAnchor="middle"
                      fill="#f8fafc"
                      fontSize="8"
                      fontFamily="JetBrains Mono"
                      fontWeight="bold"
                    >
                      {isIsolated ? '0' : node.riskScore}
                    </text>
                  </g>
                </g>
              );
            })}
          </g>
        </svg>
      </div>

      {/* Topology Legend Footer */}
      <div className="bg-slate-950/90 px-4 py-2 border-t border-slate-800 flex flex-wrap items-center justify-between gap-3 text-xs text-slate-400">
        <div className="flex items-center gap-4 flex-wrap">
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500"></span>
            <span>Nominal Asset</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse"></span>
            <span>Compromised (Active)</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-400"></span>
            <span>Forecasted Target ({currentTimeWindow})</span>
          </div>
          <div className="flex items-center gap-1.5">
            <span className="w-2.5 h-2.5 rounded-full bg-slate-500"></span>
            <span>Quarantined / Isolated</span>
          </div>
        </div>

        <div className="text-slate-500 text-[11px] font-mono flex items-center gap-2">
          <span>Click any node to inspect telemetry & open ports</span>
        </div>
      </div>
    </div>
  );
};
