'use client';

import {
  ResponsiveContainer,
  AreaChart,
  Area,
  XAxis,
  YAxis,
  ReferenceLine,
  ReferenceDot,
  Tooltip,
} from 'recharts';

interface ChartDataPoint {
  time: string;
  glucose?: number;
  past?: number;
  pred?: number;
  isPast: boolean;
}

interface PredictionChartProps {
  data: ChartDataPoint[];
}

const CustomTooltip = ({
  active,
  payload,
}: {
  active?: boolean;
  payload?: { payload: ChartDataPoint }[];
}) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs font-mono shadow-lg">
      <p className="text-muted-foreground">{d.time}</p>
      <p className="font-bold text-primary">
        {d.past || d.pred} mg/dL
        {!d.isPast && ' (predicted)'}
      </p>
    </div>
  );
};

export default function PredictionChart({ data }: PredictionChartProps) {
  const lowPoint = data.find(d => !d.isPast && (d.pred || 0) < 70);

  return (
    <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
      <div className="mb-4">
        <h2 className="font-bold text-foreground">Glucose Trend</h2>
      </div>

      <div className="flex gap-4 mb-3 text-xs font-mono">
        <span className="flex items-center gap-1.5 text-primary">
          <span className="inline-block w-4 h-0.5 bg-primary rounded" /> Past
        </span>
        <span className="flex items-center gap-1.5 text-accent">
          <span className="inline-block w-4 border-t-2 border-dashed border-accent" />{' '}
          Predicted
        </span>
        <span className="flex items-center gap-1.5 text-destructive">
          <span className="inline-block w-3 h-3 rounded-sm bg-destructive/20" /> Danger &lt;70
        </span>
      </div>

      <ResponsiveContainer width="100%" height={220}>
        <AreaChart data={data} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
          <defs>
            <linearGradient id="pastG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#0F4D92" stopOpacity={0.25} />
              <stop offset="100%" stopColor="#0F4D92" stopOpacity={0} />
            </linearGradient>
            <linearGradient id="predG" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#4D9DE0" stopOpacity={0.2} />
              <stop offset="100%" stopColor="#4D9DE0" stopOpacity={0} />
            </linearGradient>
          </defs>
          <ReferenceLine
            y={70}
            stroke="#E53E3E"
            strokeDasharray="4 3"
            strokeWidth={1.5}
            label={{
              value: '70',
              fill: '#E53E3E',
              fontSize: 9,
              fontFamily: 'monospace',
            }}
          />
          {lowPoint && (
            <ReferenceDot
              x={lowPoint.time}
              y={lowPoint.pred}
              r={6}
              fill="#E53E3E"
              stroke="#F0F8FF"
              strokeWidth={2}
            />
          )}
          <XAxis
            dataKey="time"
            tick={{ fill: '#3A6094', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
            interval={Math.max(0, Math.floor(data.length / 6))}
          />
          <YAxis
            domain={[55, 115]}
            tick={{ fill: '#3A6094', fontSize: 9 }}
            tickLine={false}
            axisLine={false}
          />
          <Tooltip content={<CustomTooltip />} />
          <Area
            type="monotone"
            dataKey="past"
            stroke="#0F4D92"
            strokeWidth={2.5}
            fill="url(#pastG)"
            dot={false}
            connectNulls
          />
          <Area
            type="monotone"
            dataKey="pred"
            stroke="#4D9DE0"
            strokeWidth={2}
            strokeDasharray="6 4"
            fill="url(#predG)"
            dot={false}
            connectNulls
          />
        </AreaChart>
      </ResponsiveContainer>
    </div>
  );
}
