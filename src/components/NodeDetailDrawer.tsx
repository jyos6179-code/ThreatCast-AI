import React from 'react';
import { NetworkNode, NetworkEdge } from '../types/threatcast';
import { X, Shield, Server, Lock, AlertTriangle, CheckCircle, Activity, Globe, Cpu } from 'lucide-react';

interface NodeDetailDrawerProps {
  node: NetworkNode | null;
  onClose: () => void;
  edges: NetworkEdge[];
  isIsolated: boolean;
  onToggleIsolation: (nodeId: string) => void;
}

export const NodeDetailDrawer: React.FC<NodeDetailDrawerProps> = ({
  node,
  onClose,
  edges,
  isIsolated,
  onToggleIsolation,
}) => {
  if (!node) return null;

  const connectedEdges = edges.filter((e) => e.source === node.id || e.target === node.id);

  return (
    <div className="fixed inset-y-0 right-0 w-full sm:w-96 bg-slate-900/95 backdrop-blur-md border-l border-slate-800 z-50 p-5 overflow-y-auto shadow-2xl flex flex-col justify-between">
      <div>
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2">
            <span className="p-2 rounded-lg bg-slate-800 border border-slate-700 text-rose-400">
              <Server className="w-4 h-4" />
            </span>
            <div>
              <h3 className="font-bold text-base text-white">{node.label}</h3>
              <span className="text-[11px] font-mono text-slate-400">{node.ip}</span>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-lg text-slate-400 hover:text-white hover:bg-slate-800 transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Status & Risk score */}
        <div className="mt-4 p-3.5 rounded-lg bg-slate-950 border border-slate-800 flex items-center justify-between">
          <div>
            <div className="text-[10px] text-slate-500 uppercase font-mono">Current Asset State</div>
            <div className="flex items-center gap-2 mt-1">
              <span
                className={`w-2.5 h-2.5 rounded-full ${
                  isIsolated
                    ? 'bg-slate-500'
                    : node.status === 'compromised'
                    ? 'bg-rose-500 animate-pulse'
                    : node.status === 'probed'
                    ? 'bg-amber-400'
                    : 'bg-emerald-400'
                }`}
              ></span>
              <span className="text-xs font-bold text-white capitalize">
                {isIsolated ? 'Quarantined / Isolated' : node.status}
              </span>
            </div>
          </div>

          <div className="text-right font-mono">
            <div className="text-[10px] text-slate-500 uppercase">Risk Level</div>
            <div
              className={`text-xl font-black ${
                isIsolated
                  ? 'text-slate-400'
                  : node.riskScore > 70
                  ? 'text-rose-400'
                  : node.riskScore > 40
                  ? 'text-amber-400'
                  : 'text-emerald-400'
              }`}
            >
              {isIsolated ? '0 / 100' : `${node.riskScore} / 100`}
            </div>
          </div>
        </div>

        {/* System Metadata */}
        <div className="mt-4 space-y-2.5 text-xs font-mono">
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-500">Operating System</span>
            <span className="text-slate-200 text-right">{node.os}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-500">Subnet Zone</span>
            <span className="text-slate-200">{node.subnet}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-500">MAC Address</span>
            <span className="text-slate-300">{node.mac}</span>
          </div>
          <div className="flex justify-between py-1 border-b border-slate-800/60">
            <span className="text-slate-500">Criticality</span>
            <span className="text-rose-400 font-bold">{node.criticality}</span>
          </div>
        </div>

        {/* Open Ports & Services */}
        <div className="mt-5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wide font-mono mb-2">
            Active Ports &amp; Services
          </div>
          <div className="flex flex-wrap gap-1.5">
            {node.openPorts.map((port, idx) => (
              <span
                key={port}
                className="px-2 py-0.5 rounded bg-slate-950 border border-slate-800 text-[11px] font-mono text-slate-300"
              >
                Port {port} ({node.services[idx] || 'Daemon'})
              </span>
            ))}
          </div>
        </div>

        {/* Known Vulnerabilities */}
        <div className="mt-5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wide font-mono mb-2 flex items-center gap-1.5">
            <AlertTriangle className="w-3.5 h-3.5 text-amber-400" />
            <span>Telemetry CVE Findings</span>
          </div>
          {node.vulnerabilities.length > 0 ? (
            <div className="space-y-1.5">
              {node.vulnerabilities.map((vuln, idx) => (
                <div
                  key={idx}
                  className="p-2.5 rounded bg-rose-950/30 border border-rose-900/60 text-rose-300 text-xs font-mono"
                >
                  {vuln}
                </div>
              ))}
            </div>
          ) : (
            <div className="p-2.5 rounded bg-slate-950 border border-slate-800 text-slate-400 text-xs font-mono">
              No known critical unpatched CVEs found on this asset.
            </div>
          )}
        </div>

        {/* Connected Channels */}
        <div className="mt-5">
          <div className="text-xs font-bold text-slate-300 uppercase tracking-wide font-mono mb-2">
            Active Connected Channels ({connectedEdges.length})
          </div>
          <div className="space-y-1.5">
            {connectedEdges.map((edge) => (
              <div
                key={edge.id}
                className="p-2 bg-slate-950 rounded border border-slate-800 text-xs font-mono flex items-center justify-between"
              >
                <span className="text-slate-300">
                  {edge.protocol}:{edge.port}
                </span>
                <span
                  className={`text-[10px] font-bold ${
                    edge.status === 'malicious'
                      ? 'text-rose-400'
                      : edge.status === 'suspicious'
                      ? 'text-amber-400'
                      : 'text-emerald-400'
                  }`}
                >
                  {edge.packetRate} pkts/s
                </span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Footer Quick Action */}
      <div className="mt-6 pt-4 border-t border-slate-800">
        <button
          onClick={() => onToggleIsolation(node.id)}
          className={`w-full py-2.5 px-4 rounded-lg font-semibold text-xs flex items-center justify-center gap-2 transition-all ${
            isIsolated
              ? 'bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700'
              : 'bg-rose-600 hover:bg-rose-500 text-white shadow-lg shadow-rose-950/50'
          }`}
        >
          <Lock className="w-4 h-4" />
          <span>{isIsolated ? 'Restore Network Bridge (Un-quarantine)' : 'Quarantine & Isolate Node Now'}</span>
        </button>
      </div>
    </div>
  );
};
