'use client';

import RiskCard, { RiskLevel } from './risk-card';
import { Activity } from 'lucide-react';

interface InsightsCardProps {
  predictedGlucose: number;
  riskLevel: RiskLevel;
  futureValues: number[];
  trend?: number;
  lbgi?: number;
}

export default function InsightsCard({
  predictedGlucose,
  riskLevel,
  futureValues,
  trend = -4.2,
  lbgi,
}: InsightsCardProps) {
  // LBGI interpretation thresholds
  const getLBGIInterpretation = (value: number) => {
    if (value < 1.1) return { label: 'Low Risk', color: '#10B981' };
    if (value <= 2.5) return { label: 'Moderate Risk', color: '#F59E0B' };
    return { label: 'High Risk', color: '#E53E3E' };
  };

  const lbgiInfo = lbgi !== undefined ? getLBGIInterpretation(lbgi) : null;

  return (
    <div className="flex flex-col gap-4">
      <RiskCard
        riskLevel={riskLevel}
        predictedGlucose={predictedGlucose}
        trend={trend}
      />

      {/* LBGI Score Card */}
      {lbgi !== undefined && lbgiInfo && (
        <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
          <div className="flex items-center gap-2 mb-3">
            <Activity size={15} className="text-primary" />
            <h3 className="font-bold text-sm text-foreground">LBGI Score</h3>
          </div>
          <div className="flex items-end gap-2 mb-2">
            <span 
              className="text-3xl font-extrabold font-mono"
              style={{ color: lbgiInfo.color }}
            >
              {lbgi.toFixed(2)}
            </span>
            <span 
              className="text-xs font-bold font-mono mb-1 px-2 py-0.5 rounded-full"
              style={{ 
                backgroundColor: `${lbgiInfo.color}20`,
                color: lbgiInfo.color 
              }}
            >
              {lbgiInfo.label}
            </span>
          </div>
          <p className="text-xs text-muted-foreground leading-relaxed">
            Low Blood Glucose Index based on Kovatchev formula: 
            <span className="font-mono"> f(G) = 1.509[ln(G)<sup>1.084</sup> - 5.381]</span>
          </p>
          <div className="flex gap-2 mt-3 text-xs font-mono">
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-green-500"></span>
              {'<'}1.1
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-yellow-500"></span>
              1.1-2.5
            </span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-red-500"></span>
              {'>'}2.5
            </span>
          </div>
        </div>
      )}

      <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
        <h3 className="font-bold text-sm text-foreground mb-3">
          Next 6 Predictions
        </h3>
        <div className="grid grid-cols-3 gap-2">
          {futureValues.slice(0, 6).map((value, i) => (
            <div
              key={i}
              className="bg-muted rounded-xl p-3 text-center"
            >
              <p className="text-xs text-muted-foreground font-mono">
                +{(i + 1) * 10}m
              </p>
              <p
                className="font-bold text-sm font-mono mt-1"
                style={{
                  color: value < 70 ? '#E53E3E' : value < 100 ? '#F59E0B' : '#10B981',
                }}
              >
                {value}
              </p>
            </div>
          ))}
        </div>
      </div>

      <div className="bg-blue-50 border border-blue-200/60 rounded-2xl p-4">
        <h4 className="text-sm font-bold text-blue-900 mb-2">AI Insight</h4>
        <p className="text-xs text-blue-800 leading-relaxed">
          Based on your current glucose trend, your levels are expected to decline
          over the next 45 minutes. Consider having a light snack with fast-acting
          carbohydrates to stabilize your glucose levels.
        </p>
      </div>
    </div>
  );
}
