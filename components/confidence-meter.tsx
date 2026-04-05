'use client';

export type ConfidenceLevel = 'not-available' | 'low' | 'medium' | 'high';

interface ConfidenceMeterProps {
  readingsCount: number;
}

const getConfidenceLevel = (count: number): ConfidenceLevel => {
  if (count < 10) return 'not-available';
  if (count < 20) return 'low';
  if (count < 40) return 'medium';
  return 'high';
};

const confidenceConfig = {
  'not-available': {
    label: 'Not Available',
    color: '#9CA3AF',
    percentage: 0,
  },
  low: {
    label: 'Low',
    color: '#FFF3A3',
    percentage: 33,
  },
  medium: {
    label: 'Medium',
    color: '#4D9DE0',
    percentage: 66,
  },
  high: {
    label: 'High',
    color: '#0F4D92',
    percentage: 100,
  },
};

export default function ConfidenceMeter({
  readingsCount,
}: ConfidenceMeterProps) {
  const level = getConfidenceLevel(readingsCount);
  const config = confidenceConfig[level];

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-3 shadow-sm">
      <div className="flex items-center justify-between">
        <h3 className="font-bold text-sm text-foreground">Prediction Confidence</h3>
        <span
          className="text-xs font-bold font-mono px-2.5 py-1 rounded-lg"
          style={{ background: `${config.color}20`, color: config.color }}
        >
          {config.label}
        </span>
      </div>

      <div className="flex flex-col gap-2">
        <div className="w-full bg-muted rounded-full h-3 overflow-hidden">
          <div
            className="h-full rounded-full transition-all duration-500"
            style={{ background: config.color, width: `${config.percentage}%` }}
          />
        </div>
        <div className="flex items-center justify-between text-xs">
          <span className="text-muted-foreground font-mono">
            {readingsCount} reading{readingsCount !== 1 ? 's' : ''}
          </span>
          {level === 'not-available' && (
            <span className="text-muted-foreground">Need 10+ readings</span>
          )}
          {level === 'low' && (
            <span className="text-muted-foreground">10-20 readings</span>
          )}
          {level === 'medium' && (
            <span className="text-muted-foreground">20-40 readings</span>
          )}
          {level === 'high' && (
            <span className="text-muted-foreground">40+ readings</span>
          )}
        </div>
      </div>
    </div>
  );
}
