import React, { useState } from 'react';
import { TrafficFlow } from '../types/threatcast';
import { Search, Filter, Upload, Download, Eye, Terminal, ArrowDownRight, RefreshCw, AlertTriangle } from 'lucide-react';

interface TrafficFlowTableProps {
  flows: TrafficFlow[];
  onInjectSyntheticFlow: (newFlow: TrafficFlow) => void;
}

export const TrafficFlowTable: React.FC<TrafficFlowTableProps> = ({ flows, onInjectSyntheticFlow }) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [labelFilter, setLabelFilter] = useState<string>('all');
  const [selectedFlow, setSelectedFlow] = useState<TrafficFlow | null>(flows[0] || null);
  const [isUploading, setIsUploading] = useState(false);

  // Filter flows
  const filteredFlows = flows.filter((f) => {
    const matchesSearch =
      f.srcIp.includes(searchTerm) ||
      f.dstIp.includes(searchTerm) ||
      f.srcPort.toString().includes(searchTerm) ||
      f.dstPort.toString().includes(searchTerm) ||
      f.flags.toLowerCase().includes(searchTerm.toLowerCase());

    const matchesLabel = labelFilter === 'all' || f.label === labelFilter;

    return matchesSearch && matchesLabel;
  });

  const handleSimulateBurst = () => {
    const synthetic: TrafficFlow = {
      id: `burst-${Date.now().toString().slice(-4)}`,
      timestamp: new Date().toISOString().substring(11, 23),
      srcIp: '10.0.1.15',
      srcPort: 49900 + Math.floor(Math.random() * 50),
      dstIp: '10.0.2.22',
      dstPort: 445,
      proto: 'TCP',
      flags: 'SYN,ACK',
      packetCount: 48,
      byteCount: 3072,
      anomalyScore: 0.94,
      label: 'Lateral_SMB',
      stageAffiliation: 'Lateral Movement',
    };
    onInjectSyntheticFlow(synthetic);
  };

  const handleFileUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setIsUploading(true);
    setTimeout(() => {
      setIsUploading(false);
      // Inject sample parsed packet from uploaded trace
      const parsedFlow: TrafficFlow = {
        id: `pcap-${Date.now().toString().slice(-4)}`,
        timestamp: new Date().toISOString().substring(11, 23),
        srcIp: '192.168.1.100',
        srcPort: 54210,
        dstIp: '10.0.1.15',
        dstPort: 443,
        proto: 'TCP',
        flags: 'PSH,ACK',
        packetCount: 124,
        byteCount: 88200,
        anomalyScore: 0.91,
        label: 'Exploit_Payload',
        stageAffiliation: 'Initial Access',
      };
      onInjectSyntheticFlow(parsedFlow);
    }, 800);
  };

  return (
    <div className="space-y-6">
      {/* Table Header & Controls */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-slate-300 bg-slate-800 px-2 py-0.5 rounded">
                INGESTION LAYER
              </span>
              <h2 className="text-lg font-bold text-slate-100 tracking-tight">
                PCAP Network Flow Stream &amp; Packet Inspector
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Real-time packet arrival dynamics, bidirectional connection stats, and heuristic anomaly scores ingested by the World Model.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handleSimulateBurst}
              className="px-3 py-1.5 bg-rose-950/60 hover:bg-rose-900/80 text-rose-300 rounded-lg text-xs font-semibold border border-rose-800 transition-colors flex items-center gap-1.5"
            >
              <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />
              <span>Inject Malicious Burst</span>
            </button>

            <label className="px-3 py-1.5 bg-slate-800 hover:bg-slate-700 text-slate-200 rounded-lg text-xs font-semibold border border-slate-700 transition-colors flex items-center gap-1.5 cursor-pointer">
              <Upload className={`w-3.5 h-3.5 ${isUploading ? 'animate-bounce text-sky-400' : ''}`} />
              <span>{isUploading ? 'Parsing PCAP...' : 'Upload PCAP/CSV'}</span>
              <input
                type="file"
                accept=".pcap,.pcapng,.csv,.cap"
                className="hidden"
                onChange={handleFileUpload}
              />
            </label>
          </div>
        </div>

        {/* Filter Toolbar */}
        <div className="mt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="relative flex-1 max-w-sm">
            <Search className="w-3.5 h-3.5 absolute left-3 top-2.5 text-slate-400" />
            <input
              type="text"
              placeholder="Filter by IP, port, or flags..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-lg pl-8 pr-3 py-1.5 text-xs text-slate-200 placeholder-slate-500 font-mono focus:outline-none focus:ring-1 focus:ring-rose-500"
            />
          </div>

          {/* Segmented Filter Buttons */}
          <div className="flex items-center gap-1 overflow-x-auto">
            {['all', 'Lateral_SMB', 'Exploit_Payload', 'C2_Beacon', 'PortScan', 'Normal'].map((label) => (
              <button
                key={label}
                onClick={() => setLabelFilter(label)}
                className={`px-2.5 py-1 rounded text-[11px] font-mono transition-colors whitespace-nowrap ${
                  labelFilter === label
                    ? 'bg-slate-800 text-rose-300 border border-slate-700 font-semibold'
                    : 'text-slate-400 hover:text-slate-200 hover:bg-slate-950'
                }`}
              >
                {label.replace('_', ' ')}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Main Flow Table & Inspector Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Table column */}
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl overflow-hidden shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950 border-b border-slate-800 text-slate-400 font-mono text-[11px] uppercase">
                <tr>
                  <th className="py-2.5 px-3">Timestamp</th>
                  <th className="py-2.5 px-3">Source &rarr; Dest</th>
                  <th className="py-2.5 px-3">Proto / Flags</th>
                  <th className="py-2.5 px-3 text-right">Packets / Bytes</th>
                  <th className="py-2.5 px-3 text-center">Score</th>
                  <th className="py-2.5 px-3">Label</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60 font-mono text-slate-300">
                {filteredFlows.length === 0 ? (
                  <tr>
                    <td colSpan={6} className="py-8 text-center text-slate-500">
                      No network flows match the selected filter.
                    </td>
                  </tr>
                ) : (
                  filteredFlows.map((flow) => {
                    const isSelected = selectedFlow?.id === flow.id;
                    const isSevere = flow.anomalyScore > 0.8;
                    const isWarning = flow.anomalyScore > 0.5 && !isSevere;

                    return (
                      <tr
                        key={flow.id}
                        onClick={() => setSelectedFlow(flow)}
                        className={`cursor-pointer transition-colors ${
                          isSelected
                            ? 'bg-slate-800/90 text-white font-medium'
                            : 'hover:bg-slate-800/40'
                        }`}
                      >
                        <td className="py-2.5 px-3 whitespace-nowrap text-slate-400 text-[11px] tabular-nums">
                          {flow.timestamp}
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <div className="flex items-center gap-1 text-[11px]">
                            <span className="text-slate-200">{flow.srcIp}:{flow.srcPort}</span>
                            <span className="text-slate-500">&rarr;</span>
                            <span className="text-slate-200">{flow.dstIp}:{flow.dstPort}</span>
                          </div>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap text-[11px]">
                          <span className="text-slate-400 mr-1.5">{flow.proto}</span>
                          <span className="text-slate-300 font-bold bg-slate-950 px-1 py-0.2 rounded border border-slate-800 text-[10px]">
                            {flow.flags}
                          </span>
                        </td>
                        <td className="py-2.5 px-3 text-right whitespace-nowrap tabular-nums text-[11px]">
                          <span className="text-slate-300">{flow.packetCount}</span>
                          <span className="text-slate-500 mx-1">/</span>
                          <span className="text-slate-400">{(flow.byteCount / 1024).toFixed(1)} KB</span>
                        </td>
                        <td className="py-2.5 px-3 text-center whitespace-nowrap tabular-nums">
                          <span
                            className={`text-[11px] font-bold ${
                              isSevere
                                ? 'text-rose-400'
                                : isWarning
                                ? 'text-amber-400'
                                : 'text-emerald-400'
                            }`}
                          >
                            {(flow.anomalyScore * 100).toFixed(0)}%
                          </span>
                        </td>
                        <td className="py-2.5 px-3 whitespace-nowrap">
                          <span
                            className={`px-1.5 py-0.5 rounded text-[10px] font-bold ${
                              flow.label === 'Normal'
                                ? 'bg-emerald-950/60 border border-emerald-800 text-emerald-400'
                                : flow.label === 'Lateral_SMB'
                                ? 'bg-amber-950/60 border border-amber-800 text-amber-300'
                                : 'bg-rose-950/60 border border-rose-800 text-rose-300'
                            }`}
                          >
                            {flow.label}
                          </span>
                        </td>
                      </tr>
                    );
                  })
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Selected Flow Packet Inspector */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="font-semibold text-sm text-slate-200">Packet Field Inspector</span>
              <span className="text-xs font-mono text-rose-400">Layer 4/7 Analysis</span>
            </div>

            {selectedFlow ? (
              <div className="space-y-3.5 text-xs font-mono">
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase">Flow Identifier</div>
                  <div className="text-slate-200 font-bold mt-0.5">{selectedFlow.id}</div>
                  <div className="text-[11px] text-slate-400 mt-1">
                    {selectedFlow.srcIp}:{selectedFlow.srcPort} &rarr; {selectedFlow.dstIp}:{selectedFlow.dstPort}
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Protocol</span>
                    <span className="text-slate-200 font-bold">{selectedFlow.proto}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">TCP Flags</span>
                    <span className="text-rose-400 font-bold">{selectedFlow.flags}</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Byte Count</span>
                    <span className="text-slate-200 font-bold">{selectedFlow.byteCount} bytes</span>
                  </div>
                  <div className="p-2.5 bg-slate-950 rounded border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Anomaly Score</span>
                    <span className="text-rose-400 font-bold">{(selectedFlow.anomalyScore * 100).toFixed(1)}%</span>
                  </div>
                </div>

                {selectedFlow.stageAffiliation && (
                  <div className="p-3 bg-rose-950/30 rounded-lg border border-rose-900/60">
                    <div className="text-[10px] text-rose-400 uppercase font-bold">MITRE Attack Stage Mapping</div>
                    <div className="text-slate-200 font-semibold mt-0.5">{selectedFlow.stageAffiliation}</div>
                    <div className="text-[11px] text-slate-400 mt-1">
                      Flow matched temporal signature for automated stage forecasting.
                    </div>
                  </div>
                )}

                {/* Hex / ASCII Payload Preview */}
                <div className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                  <div className="text-[10px] text-slate-500 uppercase mb-1">Payload Hex Preview (Offset 0x00)</div>
                  <div className="text-[10px] text-slate-400 bg-black/60 p-2 rounded overflow-x-auto leading-relaxed">
                    0000: 45 00 00 3c 1c 46 40 00 40 06 b1 e6 0a 00 01 0f <br />
                    0010: 0a 00 02 16 c2 94 01 bd 84 92 10 32 00 00 00 00 <br />
                    0020: a0 02 72 10 c3 41 00 00 02 04 05 b4 04 02 08 0a
                  </div>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center py-8">Select a flow row to inspect</div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};
