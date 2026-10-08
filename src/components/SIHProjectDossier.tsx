import React from 'react';
import { BENCHMARK_COMPARISONS } from '../data/mockDatasets';
import { Shield, Cpu, CheckCircle2, ArrowRight, Layers, Target, Clock, BarChart3, TrendingUp, Building2, Server, Terminal, Lock, Activity } from 'lucide-react';

export const SIHProjectDossier: React.FC = () => {
  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      {/* Title & Autonomous System Architecture Hero Card */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900/90 to-rose-950/30 border border-slate-800 rounded-2xl p-6 sm:p-8 shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10 pointer-events-none">
          <Shield className="w-64 h-64 text-rose-500" />
        </div>

        <div className="relative z-10">
          <div className="flex flex-wrap items-center gap-2 mb-3">
            <span className="px-2.5 py-1 rounded bg-rose-500/15 text-rose-300 border border-rose-500/30 text-xs font-mono font-bold tracking-wider uppercase">
              PREDICTIVE DEFENCE OPS
            </span>
            <span className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 border border-slate-700 text-xs font-mono">
              AI World Model Intelligence
            </span>
            <span className="px-2.5 py-1 rounded bg-indigo-950/60 text-indigo-300 border border-indigo-800 text-xs font-mono">
              Enterprise Cyber Infrastructure
            </span>
          </div>

          <h1 className="text-2xl sm:text-4xl font-extrabold text-white tracking-tight mt-2">
            ThreatCast: AI-Powered Network Attack Forecasting &amp; Digital Twin
          </h1>

          <p className="text-base sm:text-lg text-rose-300 font-medium italic mt-2">
            &ldquo;Predict the threat, Protect the network&rdquo; &mdash; From Reactive Intrusion Detection to Predictive Cyber Defence
          </p>

          <div className="mt-6 flex flex-wrap items-center gap-6 pt-4 border-t border-slate-800/80 text-xs text-slate-400">
            <div>
              <span className="text-slate-500 block">Core Architecture:</span>
              <span className="text-white font-bold text-sm">Temporal Transformer + Relational GNN World Model</span>
            </div>
            <div>
              <span className="text-slate-500 block">Forecasting Horizon:</span>
              <span className="text-slate-200 font-medium">+15m to +60m Multi-Step Windows ($t_0 \to t_3$)</span>
            </div>
            <div>
              <span className="text-slate-500 block">Validated Benchmark Datasets:</span>
              <span className="text-slate-200 font-medium">CIC-IDS2017/2018 · CTU-13 Botnet · UNSW-NB15</span>
            </div>
          </div>
        </div>
      </div>

      {/* Core Contrasts: 6 Flaws of Reactive Security vs ThreatCast */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <TrendingUp className="w-5 h-5 text-rose-400" />
          <span>The Security Paradigm Shift: Reactive vs. Predictive</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Traditional intrusion detection systems (IDS/IPS) raise alerts <em>after</em> an attack has already traversed internal networks. ThreatCast transforms raw packet flows into proactive future intelligence.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3.5">
          {[
            {
              flaw: 'Attack detected too late',
              solution: 'Early Attack Forecast',
              desc: 'Projects attack trajectory stages ahead of time, giving security operations teams proactive reaction windows.',
            },
            {
              flaw: 'Unknown next attack stage',
              solution: 'Future-State Prediction',
              desc: 'Simulates probable network states across t1, t2, and t3 windows via temporal transformers.',
            },
            {
              flaw: 'No visibility into attacker movement',
              solution: 'Attack Path Forecasting',
              desc: 'Relational Graph Neural Networks (GNNs) map multi-hop traversal paths through subnets.',
            },
            {
              flaw: 'Unclear which device is at risk',
              solution: 'Next-Target Prediction',
              desc: 'Identifies high-value target assets (Server-02, Database, Active Directory) before compromise.',
            },
            {
              flaw: 'Alert without explanation',
              solution: 'Explainable AI (SHAP & Attention)',
              desc: 'Quantifies feature contributions and packet attention weights, ending black-box alert fatigue.',
            },
            {
              flaw: 'Defence action is reactive',
              solution: 'What-If Defence Simulation',
              desc: 'Defenders simulate host isolations and ACL updates on a digital twin before executing.',
            },
          ].map((item, idx) => (
            <div key={idx} className="p-4 rounded-lg bg-slate-950 border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="text-[11px] font-mono text-rose-400 line-through opacity-80 mb-1">
                  {item.flaw}
                </div>
                <div className="text-sm font-bold text-emerald-400 flex items-center gap-1.5 mb-2">
                  <CheckCircle2 className="w-4 h-4 shrink-0" />
                  <span>{item.solution}</span>
                </div>
                <p className="text-xs text-slate-300 leading-relaxed">{item.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Conceptual Improvements in Key Areas (Quantitative Benchmark vs Reactive IDS) */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <div className="flex items-center justify-between mb-2">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <BarChart3 className="w-5 h-5 text-emerald-400" />
            <span>Empirical Performance Benchmarks (Reactive IDS vs. ThreatCast)</span>
          </h2>
          <span className="text-xs font-mono text-slate-400">Benchmarked on Verified Traces</span>
        </div>
        <p className="text-xs text-slate-400 mb-6">
          Quantified operational advantage observed when applying the Temporal + GNN World Model against historical CIC-IDS and CTU-13 intrusion traces.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {BENCHMARK_COMPARISONS.map((b, idx) => (
            <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <h3 className="font-bold text-slate-200 text-sm">{b.title}</h3>
                  <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950/60 border border-emerald-800 px-2 py-0.5 rounded">
                    {b.deltaText}
                  </span>
                </div>

                <div className="grid grid-cols-2 gap-3 my-3 font-mono text-xs">
                  <div className="p-2.5 rounded bg-slate-900 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Reactive IDS (Legacy)</span>
                    <span className="text-rose-400 font-bold text-base">{b.reactiveValue}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-900 border border-emerald-800/60">
                    <span className="text-slate-500 block text-[10px]">ThreatCast (Predictive)</span>
                    <span className="text-emerald-400 font-bold text-base">{b.predictiveValue}</span>
                  </div>
                </div>

                <p className="text-xs text-slate-400 leading-relaxed">{b.explanation}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* System Architecture & Methodology Flow */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Layers className="w-5 h-5 text-sky-400" />
          <span>Autonomous 6-Stage Neural Architecture</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Seamless end-to-end pipeline from packet stream ingestion to automated cyber decision-support.
        </p>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-6 gap-3">
          {[
            { step: '01. Ingest', title: 'Network Data', desc: 'PCAP flows, packet timing, TCP flags, sliding arrival intervals' },
            { step: '02. Learn', title: 'Temporal Models', desc: 'LSTM & Transformer learning sequential traffic dynamics' },
            { step: '03. Represent', title: 'Graph Learning', desc: 'Relational GNN embedding network devices & topologies' },
            { step: '04. Forecast', title: 'World Model', desc: 'Simulating future network states over t0, t1, t2 windows' },
            { step: '05. Explain', title: 'MITRE & SHAP', desc: 'Explainable AI attributing traffic features & kill-chains' },
            { step: '06. Defend', title: 'What-If Defence', desc: 'Security decision support for proactive zero-downtime containment' },
          ].map((s, idx) => (
            <div key={idx} className="p-3.5 bg-slate-950 rounded-lg border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
              <div>
                <div className="text-[10px] font-mono font-bold text-rose-400 mb-1">{s.step}</div>
                <div className="font-bold text-white text-xs mb-1.5">{s.title}</div>
                <p className="text-[11px] text-slate-400 leading-normal">{s.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Feasibility & Deployment Scalability Roadmap */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-xl">
        <h2 className="text-lg font-bold text-white mb-2 flex items-center gap-2">
          <Building2 className="w-5 h-5 text-amber-400" />
          <span>Enterprise Production Deployment Roadmap</span>
        </h2>
        <p className="text-xs text-slate-400 mb-6">
          Fully software-defined architecture operating with standard NetFlow/IPFIX and PCAP data without costly specialized hardware appliances.
        </p>

        <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
          {[
            {
              stage: 'Phase 1: Verification',
              icon: Cpu,
              scope: 'Testbed & Lab Subnets',
              desc: 'Offline PCAP parsing and simulated world-model verification across isolated staging subnets.',
            },
            {
              stage: 'Phase 2: Enterprise',
              icon: Server,
              scope: 'SOC & SIEM Pipelines',
              desc: 'Integration with Splunk, Elastic, and Sentinel workflows for real-time flow forecasting.',
            },
            {
              stage: 'Phase 3: Data Center',
              icon: Layers,
              scope: 'SDN & Multi-Cloud Mesh',
              desc: 'SDN controller orchestration with automated BGP Flowspec and OpenFlow isolation playbooks.',
            },
            {
              stage: 'Phase 4: Critical Infra',
              icon: Shield,
              scope: 'SCADA / ICS / Power Grids',
              desc: 'Strict air-gap compatible forecasting models preventing catastrophic infrastructure outages.',
            },
          ].map((phase, idx) => {
            const Icon = phase.icon;
            return (
              <div key={idx} className="p-4 bg-slate-950 rounded-xl border border-slate-800 flex flex-col justify-between hover:border-slate-700 transition-colors">
                <div>
                  <div className="w-8 h-8 rounded-lg bg-slate-900 border border-slate-700 flex items-center justify-center text-rose-400 mb-3">
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="text-xs font-mono font-bold text-rose-400">{phase.stage}</div>
                  <div className="font-bold text-slate-100 text-sm mt-0.5 mb-1.5">{phase.scope}</div>
                  <p className="text-xs text-slate-400 leading-relaxed">{phase.desc}</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
