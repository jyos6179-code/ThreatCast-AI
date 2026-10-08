import React, { useState } from 'react';
import { XAIExplanation, ShapFeature } from '../types/threatcast';
import { Cpu, BarChart2, Layers, HelpCircle, CheckCircle2, ChevronRight, Activity, Zap } from 'lucide-react';

interface ExplainableDefenceViewProps {
  xai: XAIExplanation;
}

export const ExplainableDefenceView: React.FC<ExplainableDefenceViewProps> = ({ xai }) => {
  const [selectedFeature, setSelectedFeature] = useState<ShapFeature | null>(xai.shapFeatures[0] || null);

  return (
    <div className="space-y-6">
      {/* Top Banner: Architecture & Rationale */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-800">
          <div>
            <div className="flex items-center gap-2">
              <span className="text-xs font-mono font-bold text-sky-400 bg-sky-950/60 border border-sky-800 px-2 py-0.5 rounded">
                EXPLAINABLE AI (XAI)
              </span>
              <h2 className="text-lg font-bold text-slate-100 tracking-tight">
                Explainable Cyber Defence &amp; SHAP/Attention Engine
              </h2>
            </div>
            <p className="text-xs text-slate-400 mt-1 max-w-2xl">
              Eliminating black-box alert fatigue. Inspect feature attributions, temporal attention weights, and graph relational embeddings that drove the world model&apos;s attack forecast.
            </p>
          </div>

          <div className="p-3 bg-slate-950 rounded-lg border border-slate-800 text-xs text-slate-300 font-mono flex items-center gap-2 shrink-0">
            <Cpu className="w-4 h-4 text-sky-400" />
            <div>
              <span className="text-slate-500 block text-[10px]">Model Architecture:</span>
              <span className="text-sky-300 font-medium">{xai.modelArchitecture}</span>
            </div>
          </div>
        </div>

        {/* SOC Plain-English Rationale */}
        <div className="mt-4 p-4 rounded-lg bg-sky-950/20 border border-sky-900/50">
          <div className="flex items-center gap-2 text-xs font-semibold text-sky-300 mb-1">
            <Activity className="w-4 h-4 text-sky-400" />
            <span>Automated SOC Analyst Rationale (Executive Summary)</span>
          </div>
          <p className="text-xs text-slate-300 leading-relaxed font-sans">
            {xai.summaryRationale}
          </p>
        </div>
      </div>

      {/* SHAP Feature Importance Waterfall / Bar Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
          <div className="flex items-center justify-between mb-4">
            <div>
              <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
                <BarChart2 className="w-4 h-4 text-rose-400" />
                <span>SHAP (Shapley Additive exPlanations) Feature Attributions</span>
              </h3>
              <p className="text-xs text-slate-400">
                Marginal contribution of each network flow feature pushing prediction toward Malicious (+) or Normal (-).
              </p>
            </div>
            <span className="text-xs font-mono text-slate-400">Top 5 Determinants</span>
          </div>

          <div className="space-y-4">
            {xai.shapFeatures.map((feat) => {
              const isSelected = selectedFeature?.feature === feat.feature;
              const isPositive = feat.impact > 0;
              const barWidth = Math.min(100, Math.round(Math.abs(feat.impact) * 220));

              return (
                <div
                  key={feat.feature}
                  onClick={() => setSelectedFeature(feat)}
                  className={`p-3.5 rounded-lg border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-slate-800 border-sky-500 shadow-md ring-1 ring-sky-500/20'
                      : 'bg-slate-950 border-slate-800 hover:border-slate-700'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 text-xs mb-1.5">
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-semibold text-slate-200">{feat.feature}</span>
                      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
                        {feat.category}
                      </span>
                    </div>

                    <div className="flex items-center gap-2 font-mono">
                      <span className="text-slate-400 text-[11px]">val: {feat.value}</span>
                      <span
                        className={`text-xs font-bold ${
                          isPositive ? 'text-rose-400' : 'text-emerald-400'
                        }`}
                      >
                        {isPositive ? `+${feat.impact.toFixed(2)}` : feat.impact.toFixed(2)}
                      </span>
                    </div>
                  </div>

                  {/* SHAP Bar with center zero-line */}
                  <div className="relative w-full h-3 bg-slate-900 rounded-full overflow-hidden flex items-center border border-slate-800">
                    <div className="absolute left-1/2 top-0 bottom-0 w-0.5 bg-slate-700 z-10"></div>
                    {isPositive ? (
                      <div
                        className="absolute left-1/2 h-full bg-gradient-to-r from-rose-500 to-rose-600 rounded-r transition-all duration-300"
                        style={{ width: `${barWidth / 2}%` }}
                      ></div>
                    ) : (
                      <div
                        className="absolute right-1/2 h-full bg-gradient-to-l from-emerald-500 to-emerald-600 rounded-l transition-all duration-300"
                        style={{ width: `${barWidth / 2}%` }}
                      ></div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>

          <div className="mt-4 flex items-center justify-between text-[11px] text-slate-400 font-mono pt-3 border-t border-slate-800">
            <span className="text-emerald-400">&larr; Pushes Toward Normal Baseline</span>
            <span className="text-rose-400">Pushes Toward Malicious Forecast &rarr;</span>
          </div>
        </div>

        {/* Feature Detail Inspector Card */}
        <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3 border-b border-slate-800 mb-4">
              <span className="font-semibold text-sm text-slate-200">Feature Deep-Dive</span>
              <span className="text-xs font-mono text-sky-400">XAI Details</span>
            </div>

            {selectedFeature ? (
              <div className="space-y-4">
                <div>
                  <div className="text-xs text-slate-400 uppercase font-mono">Feature Name</div>
                  <div className="text-sm font-mono font-bold text-white mt-0.5">{selectedFeature.feature}</div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Observed Value</span>
                    <span className="text-rose-400 font-bold text-sm">{selectedFeature.value}</span>
                  </div>
                  <div className="p-2.5 rounded bg-slate-950 border border-slate-800">
                    <span className="text-slate-500 block text-[10px]">Nominal Baseline</span>
                    <span className="text-slate-300 font-bold text-sm">{selectedFeature.baseline}</span>
                  </div>
                </div>

                <div>
                  <div className="text-xs text-slate-400 uppercase font-mono mb-1">Cyber Analyst Explanation</div>
                  <p className="text-xs text-slate-300 leading-relaxed p-3 bg-slate-950 rounded-lg border border-slate-800">
                    {selectedFeature.description}
                  </p>
                </div>
              </div>
            ) : (
              <div className="text-xs text-slate-400 text-center py-8">Select a feature to inspect</div>
            )}
          </div>

          <div className="pt-4 border-t border-slate-800 text-[11px] text-slate-400 font-mono">
            Attribution computed using TreeSHAP on CIC-IDS2017 &amp; CTU-13 verified flows.
          </div>
        </div>
      </div>

      {/* Temporal Attention Sequence Heatmap: Transformer Multi-Head Attention */}
      <div className="bg-slate-900 border border-slate-800 rounded-xl p-5 shadow-xl">
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-base font-semibold text-slate-100 flex items-center gap-2">
              <Zap className="w-4 h-4 text-sky-400" />
              <span>Temporal Transformer Attention Sequence Weights</span>
            </h3>
            <p className="text-xs text-slate-400">
              Attention weights assigned across sliding temporal packet windows. Peaks highlight specific packet events that focused the model.
            </p>
          </div>
          <span className="text-xs font-mono text-sky-400 bg-sky-950/60 border border-sky-800 px-2 py-0.5 rounded">
            Multi-Head Attention
          </span>
        </div>

        <div className="space-y-3">
          {xai.attentionSequence.map((tok) => {
            const isAnomaly = tok.isAnomaly;
            const pct = Math.round(tok.attentionWeight * 100);

            return (
              <div key={tok.index} className="p-3 bg-slate-950 rounded-lg border border-slate-800">
                <div className="flex items-center justify-between gap-3 text-xs mb-1.5">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-slate-400 text-[11px]">#{tok.index}</span>
                    <span className="font-mono text-sky-400 font-semibold">{tok.timestampOffset}</span>
                    <span className="text-slate-200 font-medium truncate max-w-md sm:max-w-xl">{tok.summary}</span>
                  </div>

                  <div className="flex items-center gap-2 font-mono shrink-0">
                    {isAnomaly && (
                      <span className="text-[10px] font-bold text-rose-400 bg-rose-950/60 border border-rose-800 px-1.5 py-0.2 rounded">
                        ANOMALY
                      </span>
                    )}
                    <span className="text-xs font-bold text-slate-200">{pct}%</span>
                  </div>
                </div>

                <div className="w-full bg-slate-900 rounded-full h-1.5 overflow-hidden">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      isAnomaly ? 'bg-gradient-to-r from-amber-500 to-rose-500' : 'bg-slate-600'
                    }`}
                    style={{ width: `${pct}%` }}
                  ></div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
};
