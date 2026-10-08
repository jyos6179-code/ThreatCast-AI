export type AttackStage =
  | 'Reconnaissance'
  | 'Initial Access'
  | 'Lateral Movement'
  | 'Command & Control'
  | 'Data Exfiltration'
  | 'Impact / Ransomware';

export type NodeStatus = 'nominal' | 'probed' | 'compromised' | 'quarantined' | 'isolated';

export type NodeRole =
  | 'attacker'
  | 'perimeter_router'
  | 'firewall'
  | 'dmz_web'
  | 'app_server'
  | 'database'
  | 'domain_controller'
  | 'workstation'
  | 'backup_vault';

export interface NetworkNode {
  id: string;
  label: string;
  role: NodeRole;
  ip: string;
  mac: string;
  os: string;
  subnet: string;
  openPorts: number[];
  services: string[];
  vulnerabilities: string[];
  status: NodeStatus;
  riskScore: number; // 0-100
  x: number; // SVG coordinate
  y: number; // SVG coordinate
  iconType: 'shield' | 'server' | 'database' | 'router' | 'desktop' | 'skull' | 'lock';
  criticality: 'Low' | 'Medium' | 'High' | 'Critical';
}

export interface NetworkEdge {
  id: string;
  source: string;
  target: string;
  protocol: 'TCP' | 'UDP' | 'SMB' | 'HTTP' | 'HTTPS' | 'SSH' | 'RPC' | 'DNS';
  port: number;
  status: 'nominal' | 'suspicious' | 'malicious' | 'blocked';
  packetRate: number; // pps
  byteRate: number; // KB/s
  isPredictedPath?: boolean;
  predictionStep?: 't1' | 't2' | 't3';
}

export interface MitreMapping {
  tactic: string;
  id: string;
  name: string;
  technique: string;
  severity: 'Low' | 'Medium' | 'High' | 'Critical';
  description: string;
}

export interface TimeStateForecast {
  step: 't0' | 't1' | 't2' | 't3';
  timeLabel: string;
  headline: string;
  networkRisk: number;
  activeCompromisedNodes: string[];
  activeEdges: string[];
  forecastSummary: string;
}

export interface AttackForecast {
  currentStage: AttackStage;
  currentObservedTime: string;
  predictedNextStage: AttackStage;
  confidence: number; // e.g. 84%
  forecastHorizon: string; // e.g. "+15m to +45m"
  predictedTargetNodeId: string;
  predictedTargetLabel: string;
  primaryPath: string[]; // Node IDs: ['attacker', 'dmz-web-01', 'srv-app-02', 'db-core-01']
  secondaryPath?: string[];
  networkRiskScore: number;
  leadTimeGainMinutes: number;
  mitreTactics: MitreMapping[];
  timeStates: {
    t0: TimeStateForecast;
    t1: TimeStateForecast;
    t2: TimeStateForecast;
    t3: TimeStateForecast;
  };
}

export interface ShapFeature {
  feature: string;
  impact: number; // positive = pushes towards malicious prediction, negative = pushes towards normal
  value: string;
  baseline: string;
  description: string;
  category: 'Flow Dynamics' | 'TCP Flags' | 'Port Distribution' | 'Graph Centrality' | 'Temporal Rhythm';
}

export interface AttentionToken {
  index: number;
  timestampOffset: string;
  summary: string;
  attentionWeight: number; // 0 to 1
  isAnomaly: boolean;
}

export interface XAIExplanation {
  modelArchitecture: string;
  summaryRationale: string;
  shapFeatures: ShapFeature[];
  attentionSequence: AttentionToken[];
  topDecisiveFeatures: string[];
}

export interface DefensiveAction {
  id: string;
  title: string;
  category: 'Host Isolation' | 'Firewall Block' | 'Port Filtering' | 'Credential Revocation' | 'VLAN Microsegmentation';
  targetNodeId?: string;
  targetEdgeId?: string;
  applied: boolean;
  riskReductionPct: number;
  availabilityImpact: 'None' | 'Low' | 'Medium';
  description: string;
  actionScript: string;
}

export interface TrafficFlow {
  id: string;
  timestamp: string;
  srcIp: string;
  srcPort: number;
  dstIp: string;
  dstPort: number;
  proto: 'TCP' | 'UDP' | 'ICMP';
  flags: string;
  packetCount: number;
  byteCount: number;
  anomalyScore: number;
  label: 'Normal' | 'PortScan' | 'Exploit_Payload' | 'Lateral_SMB' | 'C2_Beacon' | 'Exfiltration';
  stageAffiliation?: AttackStage;
}

export interface ScenarioDataset {
  id: string;
  name: string;
  benchmarkSource: 'CIC-IDS2017' | 'CTU-13' | 'UNSW-NB15' | 'Custom PCAP' | 'Enterprise Threat';
  description: string;
  topology: {
    nodes: NetworkNode[];
    edges: NetworkEdge[];
  };
  forecast: AttackForecast;
  xai: XAIExplanation;
  defensiveActions: DefensiveAction[];
  flows: TrafficFlow[];
}
