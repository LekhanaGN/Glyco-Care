"use client";

import { useState, useMemo } from "react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  ReferenceLine, ReferenceDot, Tooltip,
  BarChart, Bar, Cell,
} from "recharts";
import { TrendingDown, AlertTriangle, CalendarDays, Zap } from "lucide-react";

/* ── Illustrations ── */
function HeartBeatIllustration() {
  return (
    <svg width="140" height="72" viewBox="0 0 140 72" fill="none" className="bob opacity-95">
      {/* bold color block background — sky blue rectangle, like the reference */}
      <rect x="0" y="8" width="140" height="56" rx="16" fill="#B0E0E6" opacity="0.45"/>
      <rect x="4" y="12" width="132" height="48" rx="12" fill="#4D9DE0" opacity="0.18"/>
      <polyline
        points="10,38 30,38 38,14 46,58 58,22 68,44 78,44 88,26 100,58 110,22 120,38 140,38"
        stroke="#0F4D92" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" fill="none"
      />
      {/* dot accent */}
      <circle cx="68" cy="44" r="4" fill="#0F4D92" opacity="0.7"/>
    </svg>
  );
}

function DropletIllustration() {
  return (
    <svg width="48" height="56" viewBox="0 0 48 56" fill="none" className="bob">
      {/* bold yellow block behind */}
      <rect x="2" y="18" width="44" height="32" rx="10" fill="#FFF3A3" opacity="0.9"/>
      <path d="M24 2 C24 2, 4 28, 4 38 A20 20 0 0 0 44 38 C44 28, 24 2, 24 2Z"
        fill="#0F4D92" opacity="0.75" />
      <ellipse cx="17" cy="32" rx="4" ry="6" fill="white" opacity="0.3" />
    </svg>
  );
}

function CalendarIllustration() {
  return (
    <svg width="56" height="56" viewBox="0 0 56 56" fill="none">
      {/* bold sky-blue block card */}
      <rect x="2" y="8" width="52" height="44" rx="10" fill="#B0E0E6" opacity="0.7"/>
      <rect x="2" y="8" width="52" height="16" rx="10" fill="#0F4D92" opacity="0.85"/>
      <rect x="2" y="20" width="52" height="4" fill="#0F4D92" opacity="0.85"/>
      {/* pin caps */}
      <rect x="16" y="3" width="5" height="12" rx="2.5" fill="#0F4D92" opacity="0.7"/>
      <rect x="35" y="3" width="5" height="12" rx="2.5" fill="#0F4D92" opacity="0.7"/>
      {/* dot grid */}
      {[0,1,2,3,4,5,6,7,8,9,10,11].map(i => (
        <rect key={i}
          x={10 + (i % 4) * 12}
          y={34 + Math.floor(i / 4) * 8}
          width="6" height="5" rx="2"
          fill={i === 3 ? "#FFF3A3" : "#0F4D92"} opacity={i === 3 ? 1 : 0.3}
        />
      ))}
    </svg>
  );
}

/* ── Data ── */
function makeData() {
  const now = Date.now();
  const step = 10 * 60 * 1000;
  const pastVals = [108,107,106,104,103,101,99,98,96,95,94,92,91,90,89,88];
  const futureVals = [87,85,82,79,75,71,66,62];
  return [
    ...pastVals.map((v, i) => ({
      time: new Date(now - (pastVals.length - i) * step)
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      glucose: v, past: v, pred: undefined as number | undefined, isPast: true,
    })),
    ...futureVals.map((v, i) => ({
      time: new Date(now + (i + 1) * step)
        .toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" }),
      glucose: v, past: undefined as number | undefined, pred: v, isPast: false,
    })),
  ];
}

const weekData = [
  { day: "Mon", avg: 104 }, { day: "Tue", avg: 98 },
  { day: "Wed", avg: 112 }, { day: "Thu", avg: 88 },
  { day: "Fri", avg: 95 },  { day: "Sat", avg: 101 },
  { day: "Sun", avg: 91 },
];

const heatmapData = Array.from({ length: 30 }, (_, i) => ({
  day: i + 1,
  level: Math.random() > 0.85 ? "high" : Math.random() > 0.6 ? "med" : "low",
}));

const heatColor: Record<string, string> = {
  low:  "#B0E0E6",
  med:  "#4D9DE0",
  high: "#E53E3E",
};

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { time: string; glucose: number; isPast: boolean } }[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs font-mono shadow-lg">
      <p className="text-muted-foreground">{d.time}</p>
      <p className="font-bold text-primary">{d.glucose} mg/dL{!d.isPast && " (predicted)"}</p>
    </div>
  );
};

/* ── Log input ── */
type LogEntry = { time: "morning" | "afternoon" | "night"; value: number };
const sessions: { id: "morning" | "afternoon" | "night"; label: string; icon: string }[] = [
  { id: "morning",   label: "Morning",   icon: "🌅" },
  { id: "afternoon", label: "Afternoon", icon: "☀️" },
  { id: "night",     label: "Night",     icon: "🌙" },
];

export default function DashboardScreen() {
  const [view, setView] = useState<"day" | "week" | "month">("day");
  const [logs, setLogs] = useState<LogEntry[]>([
    { time: "morning", value: 108 },
    { time: "afternoon", value: 94 },
  ]);
  const [inputVal, setInputVal] = useState("");
  const [inputSlot, setInputSlot] = useState<"morning" | "afternoon" | "night">("morning");

  const data = useMemo(makeData, []);
  const lowPoint = data.find(d => !d.isPast && d.glucose < 70);

  function addLog() {
    const v = parseFloat(inputVal);
    if (!isNaN(v) && v > 0) {
      setLogs(l => [...l, { time: inputSlot, value: v }]);
      setInputVal("");
    }
  }

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Good evening, Hamsini</p>
          <h1 className="text-3xl font-bold text-foreground mt-1">Glucose Dashboard</h1>
        </div>
        <HeartBeatIllustration />
      </div>

      {/* ── Top stat cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { label: "Current", value: "88", unit: "mg/dL", sub: "Declining", color: "text-primary", icon: <DropletIllustration />, blockColor: "#0F4D92" },
          { label: "Avg Today", value: "97", unit: "mg/dL", sub: "Within range", color: "text-primary", icon: null, blockColor: "#4D9DE0" },
          { label: "Risk Events", value: "2", unit: "today", sub: "High alerts", color: "text-destructive", icon: null, blockColor: "#E53E3E" },
          { label: "Stability", value: "74%", unit: "score", sub: "Moderate", color: "text-primary", icon: null, blockColor: "#B0E0E6" },
        ].map(({ label, value, unit, sub, color, icon, blockColor }) => (
          <div key={label} className="bg-card rounded-2xl border border-border shadow-sm flex flex-col overflow-hidden relative">
            {/* Bold color block top strip */}
            <div className="h-2 w-full" style={{ background: blockColor }} />
            <div className="p-5 flex flex-col gap-1 relative">
              {icon && <div className="absolute right-2 bottom-2 opacity-50">{icon}</div>}
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</p>
              <div className="flex items-end gap-1.5">
                <span className={`text-3xl font-extrabold font-mono ${color}`}>{value}</span>
                <span className="text-xs text-muted-foreground mb-1 font-light">{unit}</span>
              </div>
              <p className="text-xs text-muted-foreground font-light">{sub}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Main content grid ── */}
      <div className="grid grid-cols-3 gap-5">

        {/* Chart (2/3 width) */}
        <div className="col-span-2 bg-card rounded-2xl border border-border p-5 shadow-sm">
          {/* View toggle */}
          <div className="flex items-center justify-between mb-4">
            <h2 className="font-bold text-foreground">Glucose Trend</h2>
            <div className="flex gap-1">
              {(["day","week","month"] as const).map(v => (
                <button
                  key={v}
                  onClick={() => setView(v)}
                  className="px-3 py-1 rounded-full text-xs font-bold font-mono transition-all capitalize"
                  style={view === v
                    ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                    : { background: "var(--muted)", color: "var(--muted-foreground)" }
                  }
                >{v}</button>
              ))}
            </div>
          </div>

          {view === "day" && (
            <>
              <div className="flex gap-4 mb-3 text-xs font-mono">
                <span className="flex items-center gap-1.5 text-primary">
                  <span className="inline-block w-4 h-0.5 bg-primary rounded" /> Past
                </span>
                <span className="flex items-center gap-1.5 text-accent">
                  <span className="inline-block w-4 border-t-2 border-dashed border-accent" /> Predicted
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
                  <ReferenceLine y={70} stroke="#E53E3E" strokeDasharray="4 3" strokeWidth={1.5}
                    label={{ value: "70", fill: "#E53E3E", fontSize: 9, fontFamily: "monospace" }} />
                  {lowPoint && (
                    <ReferenceDot x={lowPoint.time} y={lowPoint.glucose} r={6}
                      fill="#E53E3E" stroke="#F0F8FF" strokeWidth={2} />
                  )}
                  <XAxis dataKey="time" tick={{ fill: "#3A6094", fontSize: 9 }} tickLine={false} axisLine={false} interval={5} />
                  <YAxis domain={[55,115]} tick={{ fill: "#3A6094", fontSize: 9 }} tickLine={false} axisLine={false} />
                  <Tooltip content={<CustomTooltip />} />
                  <Area type="monotone" dataKey="past" stroke="#0F4D92" strokeWidth={2.5}
                    fill="url(#pastG)" dot={false} connectNulls />
                  <Area type="monotone" dataKey="pred" stroke="#4D9DE0" strokeWidth={2}
                    strokeDasharray="6 4" fill="url(#predG)" dot={false} connectNulls />
                </AreaChart>
              </ResponsiveContainer>
            </>
          )}

          {view === "week" && (
            <ResponsiveContainer width="100%" height={240}>
              <BarChart data={weekData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                <XAxis dataKey="day" tick={{ fill: "#3A6094", fontSize: 10 }} tickLine={false} axisLine={false} />
                <YAxis domain={[60, 130]} tick={{ fill: "#3A6094", fontSize: 9 }} tickLine={false} axisLine={false} />
                <Tooltip
                  contentStyle={{ background: "#F0F8FF", border: "1px solid #C5D8F0", borderRadius: 12 }}
                  labelStyle={{ color: "#0F2A5A", fontFamily: "monospace", fontSize: 11 }}
                  itemStyle={{ color: "#0F4D92", fontFamily: "monospace", fontSize: 11 }}
                />
                <ReferenceLine y={70} stroke="#E53E3E" strokeDasharray="4 3" strokeWidth={1.5} />
                {weekData.map(d => (
                  <Bar key={d.day} dataKey="avg" radius={[6,6,0,0]}>
                    {weekData.map((entry, idx) => (
                      <Cell key={idx} fill={entry.avg < 80 ? "#E53E3E" : entry.avg < 95 ? "#4D9DE0" : "#0F4D92"} />
                    ))}
                  </Bar>
                ))}
                <Bar dataKey="avg" radius={[6,6,0,0]}>
                  {weekData.map((entry, idx) => (
                    <Cell key={idx} fill={entry.avg < 80 ? "#E53E3E" : entry.avg < 95 ? "#4D9DE0" : "#0F4D92"} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          )}

          {view === "month" && (
            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-10 gap-1.5">
                {heatmapData.map(({ day, level }) => (
                  <div key={day}
                    className="w-full aspect-square rounded-md flex items-center justify-center text-[9px] font-mono font-bold cursor-pointer hover:scale-110 transition-transform"
                    style={{ background: heatColor[level], color: level === "high" ? "#fff" : "#0F2A5A" }}
                    title={`Day ${day}`}
                  >{day}</div>
                ))}
              </div>
              <div className="flex gap-4 text-xs font-mono text-muted-foreground">
                {Object.entries(heatColor).map(([k, c]) => (
                  <span key={k} className="flex items-center gap-1.5">
                    <span className="w-3 h-3 rounded-sm inline-block" style={{ background: c }} />
                    {k === "low" ? "Stable" : k === "med" ? "Moderate" : "High risk"}
                  </span>
                ))}
              </div>
              {/* Monthly summary */}
              <div className="grid grid-cols-3 gap-3 mt-1">
                {[
                  { label: "Avg Glucose", value: "96 mg/dL" },
                  { label: "Risk Events",  value: "5 days" },
                  { label: "Stability",    value: "78%" },
                ].map(({ label, value }) => (
                  <div key={label} className="bg-muted rounded-xl p-3 text-center">
                    <p className="text-xs font-mono text-muted-foreground">{label}</p>
                    <p className="font-bold text-primary mt-1">{value}</p>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* Right column: log + prediction */}
        <div className="flex flex-col gap-4">

          {/* Prediction card */}
          <div className="pulse-high bg-destructive/10 border-2 border-destructive/40 rounded-2xl p-5 flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <AlertTriangle size={16} className="text-destructive" />
              <span className="text-xs font-bold font-mono uppercase text-destructive tracking-wider">High Risk</span>
            </div>
            <p className="font-bold text-foreground text-sm leading-snug">
              Glucose predicted to hit <span className="text-destructive">65 mg/dL</span> in ~45 min
            </p>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground font-mono">
              <TrendingDown size={12} /> -4.2 mg/dL per 10 min
            </div>
          </div>

          {/* Quick log */}
          <div className="bg-card border border-border rounded-2xl p-5 flex flex-col gap-3 shadow-sm">
            <div className="flex items-center gap-2">
              <Zap size={15} className="text-primary" />
              <h3 className="font-bold text-sm text-foreground">Log Reading</h3>
            </div>
            <div className="flex gap-1">
              {sessions.map(s => (
                <button key={s.id} onClick={() => setInputSlot(s.id)}
                  className="flex-1 py-1.5 rounded-lg text-xs font-bold transition-all"
                  style={inputSlot === s.id
                    ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                    : { background: "var(--muted)", color: "var(--muted-foreground)" }
                  }
                >{s.label}</button>
              ))}
            </div>
            <div className="flex gap-2">
              {[70,90,110,130].map(q => (
                <button key={q} onClick={() => setInputVal(String(q))}
                  className="flex-1 py-1 rounded-lg text-xs font-mono font-bold border border-border hover:border-primary/60 transition-colors"
                  style={{ color: "var(--primary)" }}
                >{q}</button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                type="number"
                value={inputVal}
                onChange={e => setInputVal(e.target.value)}
                placeholder="Enter mg/dL"
                className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/70"
              />
              <button onClick={addLog}
                className="px-4 py-2 rounded-xl text-sm font-bold transition-all"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >Add</button>
            </div>
            {/* Today's log */}
            <div className="flex flex-col gap-1.5 max-h-28 overflow-y-auto">
              {logs.map((l, i) => (
                <div key={i} className="flex items-center justify-between text-xs font-mono bg-muted rounded-lg px-3 py-1.5">
                  <span className="text-muted-foreground capitalize">{l.time}</span>
                  <span className="font-bold text-primary">{l.value} mg/dL</span>
                </div>
              ))}
            </div>
          </div>

          {/* Calendar icon card */}
          <div className="bg-card border border-border rounded-2xl p-5 flex items-center gap-4 shadow-sm">
            <CalendarIllustration />
            <div>
              <p className="font-bold text-sm text-foreground">This Month</p>
              <p className="text-xs text-muted-foreground mt-0.5 font-mono">5 risk events<br/>78% stability</p>
            </div>
            <CalendarDays size={16} className="text-muted-foreground ml-auto" />
          </div>
        </div>
      </div>
    </div>
  );
}
