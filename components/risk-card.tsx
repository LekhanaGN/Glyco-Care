'use client';

import { AlertTriangle, TrendingDown, TrendingUp } from 'lucide-react';

export type RiskLevel = 'LOW' | 'MEDIUM' | 'HIGH';

interface RiskCardProps {
  riskLevel: RiskLevel;
  predictedGlucose: number;
  trend?: number; // mg/dL per 10 min
}

const riskConfig = {
  LOW: {
    bgColor: 'bg-green-50',
    borderColor: 'border-green-200',
    textColor: 'text-green-900',
    badgeColor: '#10B981',
    label: 'Low Risk',
  },
  MEDIUM: {
    bgColor: 'bg-yellow-50',
    borderColor: 'border-yellow-200',
    textColor: 'text-yellow-900',
    badgeColor: '#F59E0B',
    label: 'Medium Risk',
  },
  HIGH: {
    bgColor: 'bg-red-50',
    borderColor: 'border-red-200/60',
    textColor: 'text-red-900',
    badgeColor: '#E53E3E',
    label: 'High Risk',
    pulse: true,
  },
};

export default function RiskCard({
  riskLevel,
  predictedGlucose,
  trend = -4.2,
}: RiskCardProps) {
  const config = riskConfig[riskLevel];
  const isTrendingDown = trend < 0;

  return (
    <div
      className={`${config.bgColor} ${config.borderColor} rounded-2xl border-2 p-5 flex flex-col gap-3 ${
        riskLevel === 'HIGH' ? 'pulse-high' : ''
      }`}
    >
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          {riskLevel === 'HIGH' && <AlertTriangle size={18} className={config.textColor} />}
          <span
            className="text-xs font-bold font-mono uppercase tracking-wider"
            style={{ color: config.badgeColor }}
          >
            {config.label}
          </span>
        </div>
      </div>

      <div className="flex items-end gap-2">
        <span className="text-4xl font-extrabold font-mono" style={{ color: config.badgeColor }}>
          {predictedGlucose}
        </span>
        <span className="text-sm text-muted-foreground mb-1">mg/dL</span>
      </div>

      <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
        {isTrendingDown ? (
          <TrendingDown size={12} style={{ color: config.badgeColor }} />
        ) : (
          <TrendingUp size={12} style={{ color: config.badgeColor }} />
        )}
        {trend > 0 ? '+' : ''}{trend.toFixed(1)} mg/dL per 10 min
      </div>

      {riskLevel === 'HIGH' && (
        <p className="text-xs text-red-700 leading-snug">
          Consider eating a snack to prevent low glucose
        </p>
      )}
    </div>
  );
}
