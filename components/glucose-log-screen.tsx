"use client";

import { useState, useMemo } from "react";
import {
  ArrowUp, ArrowDown, Minus, ChevronDown, ChevronRight,
  ChevronUp, SlidersHorizontal, X, Calendar, TrendingUp,
  TrendingDown, AlertCircle, Plus, Check, Clock
} from "lucide-react";
import { useHealthData } from "@/contexts/health-data-context";
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
  ReferenceLine, CartesianGrid
} from "recharts";

/* ─────────────────────────── Types ─────────────────────────── */
type TimeSlot = "Morning" | "Afternoon" | "Night";
type RiskLevel = "Low" | "Medium" | "High";

interface GlucoseEntry {
  id: number;
  date: string;       // "YYYY-MM-DD"
  time: TimeSlot;
  glucose: number;
  meal?: string;
  medication?: string;
}

/* ─────────────────────────── Seed data ─────────────────────── */
const RAW: GlucoseEntry[] = [
  // April 2025
  { id: 1,  date: "2025-04-01", time: "Morning",   glucose: 94,  meal: "Oats",         medication: "Metformin" },
  { id: 2,  date: "2025-04-01", time: "Afternoon",  glucose: 112, meal: "Rice + dal" },
  { id: 3,  date: "2025-04-01", time: "Night",      glucose: 88 },
  { id: 4,  date: "2025-04-02", time: "Morning",   glucose: 102, meal: "Idli",         medication: "Metformin" },
  { id: 5,  date: "2025-04-02", time: "Afternoon",  glucose: 135, meal: "Biryani" },
  { id: 6,  date: "2025-04-02", time: "Night",      glucose: 68,  medication: "Glipizide" },
  { id: 7,  date: "2025-04-03", time: "Morning",   glucose: 89,  meal: "Upma" },
  { id: 8,  date: "2025-04-03", time: "Afternoon",  glucose: 106, meal: "Salad" },
  { id: 9,  date: "2025-04-03", time: "Night",      glucose: 97,  medication: "Metformin" },
  { id: 10, date: "2025-04-04", time: "Morning",   glucose: 110, meal: "Bread + egg",  medication: "Metformin" },
  { id: 11, date: "2025-04-04", time: "Afternoon",  glucose: 143, meal: "Pizza" },
  { id: 12, date: "2025-04-04", time: "Night",      glucose: 72 },
  { id: 13, date: "2025-04-05", time: "Morning",   glucose: 91,  meal: "Dosa",         medication: "Metformin" },
  { id: 14, date: "2025-04-05", time: "Afternoon",  glucose: 118, meal: "Chapati" },
  { id: 15, date: "2025-04-05", time: "Night",      glucose: 84 },
  // March 2025
  { id: 16, date: "2025-03-28", time: "Morning",   glucose: 98,  meal: "Muesli",       medication: "Metformin" },
  { id: 17, date: "2025-03-28", time: "Afternoon",  glucose: 121, meal: "Sandwich" },
  { id: 18, date: "2025-03-28", time: "Night",      glucose: 93 },
  { id: 19, date: "2025-03-15", time: "Morning",   glucose: 107, meal: "Poha",         medication: "Metformin" },
  { id: 20, date: "2025-03-15", time: "Afternoon",  glucose: 148, meal: "Fried rice" },
  { id: 21, date: "2025-03-15", time: "Night",      glucose: 65,  medication: "Glipizide" },
  { id: 22, date: "2025-03-08", time: "Morning",   glucose: 95 },
  { id: 23, date: "2025-03-08", time: "Afternoon",  glucose: 109, meal: "Khichdi" },
  { id: 24, date: "2025-03-08", time: "Night",      glucose: 88,  medication: "Metformin" },
  // February 2025
  { id: 25, date: "2025-02-20", time: "Morning",   glucose: 115, meal: "Paratha",      medication: "Metformin" },
  { id: 26, date: "2025-02-20", time: "Afternoon",  glucose: 138, meal: "Thali" },
  { id: 27, date: "2025-02-20", time: "Night",      glucose: 78 },
  { id: 28, date: "2025-02-10", time: "Morning",   glucose: 103, meal: "Oats" },
  { id: 29, date: "2025-02-10", time: "Afternoon",  glucose: 127, meal: "Dal rice" },
  { id: 30, date: "2025-02-10", time: "Night",      glucose: 92,  medication: "Metformin" },
];

/* ─────────────────────────── Helpers ───────────────────────── */
function riskOf(g: number): RiskLevel {
  if (g < 70 || g > 140) return "High";
  if (g < 80 || g > 120) return "Medium";
  return "Low";
}

function changeOf(curr: number, prev: number | null) {
  if (prev === null) return "stable" as const;
  const diff = curr - prev;
  if (Math.abs(diff) < 5) return "stable" as const;
  return diff > 0 ? ("up" as const) : ("down" as const);
}

function monthKey(date: string) {
  const d = new Date(date);
  return `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, "0")}`;
}
function monthLabel(key: string) {
  const [y, m] = key.split("-");
  return new Date(Number(y), Number(m) - 1).toLocaleDateString("en-GB", { month: "long", year: "numeric" });
}

const RISK_COLORS: Record<RiskLevel, { bg: string; text: string; border: string }> = {
  Low:    { bg: "rgba(176,224,230,0.25)", text: "#0F4D92", border: "#B0E0E6" },
  Medium: { bg: "rgba(255,243,163,0.5)",  text: "#7A5C00", border: "#F9DC5C" },
  High:   { bg: "rgba(229,62,62,0.08)",   text: "#E53E3E", border: "#fca5a5" },
};

const TIME_DOT: Record<TimeSlot, string> = {
  Morning:   "#F9DC5C",
  Afternoon: "#B0E0E6",
  Night:     "#0F4D92",
};

/* ─────────────────────────── Sub-components ────────────────── */
function ChangeArrow({ dir, glucose }: { dir: "up" | "down" | "stable"; glucose: number }) {
  const risk = riskOf(glucose);
  const color =
    risk === "High" ? "#E53E3E"
    : dir === "stable" ? "#8AA4C8"
    : "#0F4D92";

  if (dir === "up")     return <ArrowUp   size={14} style={{ color }} />;
  if (dir === "down")   return <ArrowDown size={14} style={{ color }} />;
  return <Minus size={14} style={{ color, opacity: 0.5 }} />;
}

function RiskBadge({ level }: { level: RiskLevel }) {
  const c = RISK_COLORS[level];
  return (
    <span
      className="text-xs font-bold px-2.5 py-0.5 rounded-full border font-mono"
      style={{ background: c.bg, color: c.text, borderColor: c.border }}
    >
      {level}
    </span>
  );
}

/* Day detail modal */
function DayDetailModal({
  date, entries, onClose,
}: { date: string; entries: GlucoseEntry[]; onClose: () => void }) {
  const sorted = [...entries].sort((a, b) => {
    const order = { Morning: 0, Afternoon: 1, Night: 2 };
    return order[a.time] - order[b.time];
  });
  const chartData = sorted.map(e => ({ time: e.time, glucose: e.glucose }));

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
      <div
        className="rounded-3xl border border-border shadow-2xl w-full max-w-lg mx-4 overflow-hidden"
        style={{ background: "var(--card)" }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-6 pb-4">
          <div>
            <p className="text-xs font-mono text-muted-foreground uppercase tracking-widest">Daily Detail</p>
            <h3 className="font-extrabold text-xl text-foreground mt-0.5">
              {new Date(date).toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
            </h3>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 rounded-full border border-border flex items-center justify-center hover:border-primary/60 transition-colors"
          >
            <X size={16} className="text-muted-foreground" />
          </button>
        </div>

        {/* Mini chart */}
        <div className="px-6 pb-4">
          <div className="h-32">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="var(--border)" strokeOpacity={0.5} />
                <XAxis dataKey="time" tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} />
                <YAxis domain={[60, 160]} tick={{ fontSize: 11, fill: "var(--muted-foreground)" }} width={32} />
                <ReferenceLine y={70}  stroke="#E53E3E" strokeDasharray="4 3" strokeOpacity={0.6} />
                <ReferenceLine y={140} stroke="#F9DC5C" strokeDasharray="4 3" strokeOpacity={0.6} />
                <Tooltip
                  contentStyle={{ background: "var(--card)", border: "1px solid var(--border)", borderRadius: 12, fontSize: 12 }}
                  formatter={(v: number) => [`${v} mg/dL`, "Glucose"]}
                />
                <Line
                  type="monotone" dataKey="glucose"
                  stroke="#0F4D92" strokeWidth={2.5} dot={{ fill: "#0F4D92", r: 4 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Rows */}
        <div className="px-6 pb-6 flex flex-col gap-2">
          {sorted.map((e, i) => {
            const prev = i > 0 ? sorted[i - 1].glucose : null;
            const dir = changeOf(e.glucose, prev);
            const risk = riskOf(e.glucose);
            const c = RISK_COLORS[risk];
            return (
              <div key={e.id}
                className="flex items-center gap-3 rounded-xl px-4 py-3 border"
                style={{ background: c.bg, borderColor: c.border }}>
                <span
                  className="w-2.5 h-2.5 rounded-full flex-shrink-0"
                  style={{ background: TIME_DOT[e.time] }}
                />
                <span className="text-xs font-mono text-muted-foreground w-20">{e.time}</span>
                <span className="font-extrabold font-mono text-lg" style={{ color: c.text }}>{e.glucose}</span>
                <span className="text-xs text-muted-foreground">mg/dL</span>
                <ChangeArrow dir={dir} glucose={e.glucose} />
                <div className="ml-auto flex items-center gap-2">
                  {e.meal && <span className="text-xs bg-white/60 border border-border rounded-full px-2 py-0.5 text-muted-foreground">{e.meal}</span>}
                  {e.medication && <span className="text-xs bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5">{e.medication}</span>}
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

/* ─────────────────────────── Main screen ───────────────────── */
export default function GlucoseLogScreen() {
  const [filterRisk, setFilterRisk] = useState<RiskLevel | "All">("All");
  const [sortMode, setSortMode] = useState<"recent" | "highest" | "lowest">("recent");
  const [expandedMonths, setExpandedMonths] = useState<Set<string>>(new Set(["2025-04"]));
  const [selectedDate, setSelectedDate] = useState<string | null>(null);
  const [showFilters, setShowFilters] = useState(false);
  const [dateFrom, setDateFrom] = useState("");
  const [dateTo, setDateTo] = useState("");
  
  // New glucose logging form state
  const [showLogForm, setShowLogForm] = useState(false);
  const [newGlucose, setNewGlucose] = useState("");
  const [newTime, setNewTime] = useState<TimeSlot>("Morning");
  const [newMeal, setNewMeal] = useState("");
  const [newMedication, setNewMedication] = useState("");
  const [logSuccess, setLogSuccess] = useState(false);
  
  const { addGlucoseEntry, glucoseEntries: contextEntries } = useHealthData();

  // Handle new glucose log
  const handleLogGlucose = () => {
    const value = parseFloat(newGlucose);
    if (!isNaN(value) && value > 0) {
      const today = new Date().toISOString().split("T")[0];
      addGlucoseEntry({
        date: today,
        time: newTime,
        glucose: value,
        meal: newMeal || undefined,
        medication: newMedication || undefined,
      });
      setNewGlucose("");
      setNewMeal("");
      setNewMedication("");
      setLogSuccess(true);
      setTimeout(() => {
        setLogSuccess(false);
        setShowLogForm(false);
      }, 1500);
    }
  };

  // Get last logged info
  const getLastLoggedInfo = () => {
    if (contextEntries.length === 0) return null;
    const sorted = [...contextEntries].sort((a, b) => {
      const dateCompare = b.date.localeCompare(a.date);
      if (dateCompare !== 0) return dateCompare;
      const timeOrder = { Morning: 0, Afternoon: 1, Night: 2 };
      return timeOrder[b.time] - timeOrder[a.time];
    });
    return sorted[0];
  };
  const lastLogged = getLastLoggedInfo();

  /* Merge RAW seed data with context entries (removing duplicates by id) */
  const allEntries = useMemo(() => {
    const rawIds = new Set(RAW.map(r => r.id));
    // Context entries that aren't in RAW (imported/manually added)
    const newEntries = contextEntries.filter(e => !rawIds.has(e.id));
    return [...RAW, ...newEntries];
  }, [contextEntries]);

  /* Enrich entries with change direction */
  const enriched = useMemo(() => {
    const sorted = [...allEntries].sort((a, b) => {
      const timeOrder = { Morning: 0, Afternoon: 1, Night: 2 };
      return a.date.localeCompare(b.date) || timeOrder[a.time] - timeOrder[b.time];
    });
    return sorted.map((entry, i) => ({
      ...entry,
      risk: riskOf(entry.glucose),
      dir: changeOf(entry.glucose, i > 0 ? sorted[i - 1].glucose : null),
    }));
  }, [allEntries]);

  /* Apply filters + sort */
  const filtered = useMemo(() => {
    let rows = enriched;
    if (filterRisk !== "All") rows = rows.filter(r => r.risk === filterRisk);
    if (dateFrom) rows = rows.filter(r => r.date >= dateFrom);
    if (dateTo)   rows = rows.filter(r => r.date <= dateTo);
    if (sortMode === "highest") return [...rows].sort((a, b) => b.glucose - a.glucose);
    if (sortMode === "lowest")  return [...rows].sort((a, b) => a.glucose - b.glucose);
    return [...rows].sort((a, b) => b.date.localeCompare(a.date));
  }, [enriched, filterRisk, sortMode, dateFrom, dateTo]);

  /* Group by month */
  const byMonth = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const row of filtered) {
      const mk = monthKey(row.date);
      if (!map.has(mk)) map.set(mk, []);
      map.get(mk)!.push(row);
    }
    return Array.from(map.entries()).sort(([a], [b]) => b.localeCompare(a));
  }, [filtered]);

  /* Monthly summary */
  function monthlySummary(rows: typeof filtered) {
    const glucoses = rows.map(r => r.glucose);
    const avg = Math.round(glucoses.reduce((a, b) => a + b, 0) / glucoses.length);
    const high = Math.max(...glucoses);
    const low  = Math.min(...glucoses);
    const risks = rows.filter(r => r.risk === "High").length;
    // trend: compare first half avg vs second half
    const mid = Math.floor(glucoses.length / 2);
    const firstHalf = glucoses.slice(0, mid);
    const secondHalf = glucoses.slice(mid);
    const f = firstHalf.reduce((a, b) => a + b, 0) / (firstHalf.length || 1);
    const s = secondHalf.reduce((a, b) => a + b, 0) / (secondHalf.length || 1);
    const trend: "up" | "down" | "stable" =
      s - f > 5 ? "up" : f - s > 5 ? "down" : "stable";
    return { avg, high, low, risks, trend };
  }

  /* Day entries for modal */
  const dayEntries = useMemo(() => {
    if (!selectedDate) return [];
    return allEntries.filter(r => r.date === selectedDate);
  }, [selectedDate, allEntries]);

  /* Stat overview cards */
  const allGlucoses = allEntries.map(r => r.glucose);
  const overallAvg  = allGlucoses.length > 0 ? Math.round(allGlucoses.reduce((a, b) => a + b, 0) / allGlucoses.length) : 0;
  const overallHigh = allGlucoses.length > 0 ? Math.max(...allGlucoses) : 0;
  const overallLow  = allGlucoses.length > 0 ? Math.min(...allGlucoses) : 0;
  const riskCount   = allEntries.filter(r => riskOf(r.glucose) === "High").length;

  const statCards = [
    { label: "Overall Avg",    value: `${overallAvg}`,  unit: "mg/dL", blockColor: "#0F4D92" },
    { label: "Highest",        value: `${overallHigh}`, unit: "mg/dL", blockColor: "#E53E3E" },
    { label: "Lowest",         value: `${overallLow}`,  unit: "mg/dL", blockColor: "#B0E0E6" },
    { label: "Risk Events",    value: `${riskCount}`,   unit: "total", blockColor: "#F9DC5C" },
  ];

  return (
    <div className="flex flex-col gap-6">

      {/* ── Header + controls ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Glucose Log</h1>
          <p className="text-sm text-muted-foreground font-light mt-0.5">
            Full history with trend indicators and monthly analysis
          </p>
        </div>
        <button
          onClick={() => setShowFilters(f => !f)}
          className="flex items-center gap-2 px-4 py-2.5 rounded-xl border border-border text-sm font-semibold transition-all hover:border-primary/60"
          style={{ background: "var(--card)", color: "var(--foreground)" }}
        >
          <SlidersHorizontal size={15} />
          Filters &amp; Sort
          {showFilters ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
        </button>
      </div>

      {/* ── Quick Log Card ── */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <button
          onClick={() => setShowLogForm(!showLogForm)}
          className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-4">
            <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus size={22} className="text-primary" />
            </div>
            <div className="text-left">
              <span className="font-bold text-foreground block">Log New Reading</span>
              <span className="text-sm text-muted-foreground">
                {lastLogged ? (
                  <span className="flex items-center gap-1.5">
                    <Clock size={12} />
                    Last: <strong>{lastLogged.glucose} mg/dL</strong> on {lastLogged.date}, {lastLogged.time}
                  </span>
                ) : (
                  "Add your first glucose reading"
                )}
              </span>
            </div>
          </div>
          {showLogForm ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </button>

        {showLogForm && (
          <div className="p-5 pt-0 border-t border-border">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-4">
              {/* Glucose Value */}
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Glucose (mg/dL) *
                </label>
                <input
                  type="number"
                  value={newGlucose}
                  onChange={(e) => setNewGlucose(e.target.value)}
                  placeholder="105"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-lg font-mono outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              
              {/* Time Slot */}
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Time of Day
                </label>
                <select
                  value={newTime}
                  onChange={(e) => setNewTime(e.target.value as TimeSlot)}
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-foreground outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
              </div>
              
              {/* Meal */}
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Meal (optional)
                </label>
                <input
                  type="text"
                  value={newMeal}
                  onChange={(e) => setNewMeal(e.target.value)}
                  placeholder="e.g. Rice + dal"
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-foreground text-sm outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              
              {/* Medication */}
              <div>
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Medication (optional)
                </label>
                <input
                  type="text"
                  value={newMedication}
                  onChange={(e) => setNewMedication(e.target.value)}
                  placeholder="e.g. Metformin"
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-foreground text-sm outline-none focus:border-primary/50 transition-colors"
                />
              </div>
            </div>

            <button
              onClick={handleLogGlucose}
              disabled={!newGlucose || logSuccess}
              className="w-full mt-4 py-3 rounded-xl font-bold flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ 
                backgroundColor: logSuccess ? "#10B981" : "var(--primary)", 
                color: "var(--primary-foreground)" 
              }}
            >
              {logSuccess ? (
                <>
                  <Check size={18} />
                  Logged Successfully!
                </>
              ) : (
                <>
                  <Plus size={18} />
                  Add Reading
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* ── Stat cards ── */}
      <div className="grid grid-cols-4 gap-4">
        {statCards.map(({ label, value, unit, blockColor }) => (
          <div key={label} className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden flex flex-col">
            <div className="h-1.5 w-full" style={{ background: blockColor }} />
            <div className="p-5 flex flex-col gap-0.5">
              <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider">{label}</p>
              <div className="flex items-end gap-1.5 mt-1">
                <span className="text-3xl font-extrabold font-mono text-foreground">{value}</span>
                <span className="text-xs text-muted-foreground mb-1 font-light">{unit}</span>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* ── Filter panel ── */}
      {showFilters && (
        <div className="bg-card rounded-2xl border border-border p-5 flex flex-wrap gap-5 items-end">
          {/* Risk filter */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Risk Level</label>
            <div className="flex gap-2">
              {(["All", "Low", "Medium", "High"] as const).map(r => (
                <button
                  key={r}
                  onClick={() => setFilterRisk(r)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
                  style={filterRisk === r
                    ? { background: "var(--primary)", color: "var(--primary-foreground)", borderColor: "var(--primary)" }
                    : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }
                  }
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Sort */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Sort By</label>
            <div className="flex gap-2">
              {([
                { id: "recent",  label: "Most Recent" },
                { id: "highest", label: "Highest" },
                { id: "lowest",  label: "Lowest" },
              ] as const).map(s => (
                <button
                  key={s.id}
                  onClick={() => setSortMode(s.id)}
                  className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
                  style={sortMode === s.id
                    ? { background: "var(--primary)", color: "var(--primary-foreground)", borderColor: "var(--primary)" }
                    : { background: "transparent", color: "var(--muted-foreground)", borderColor: "var(--border)" }
                  }
                >
                  {s.label}
                </button>
              ))}
            </div>
          </div>

          {/* Date range */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Date From</label>
            <input
              type="date" value={dateFrom}
              onChange={e => setDateFrom(e.target.value)}
              className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/70"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider">Date To</label>
            <input
              type="date" value={dateTo}
              onChange={e => setDateTo(e.target.value)}
              className="bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground outline-none focus:border-primary/70"
            />
          </div>
          {(filterRisk !== "All" || sortMode !== "recent" || dateFrom || dateTo) && (
            <button
              onClick={() => { setFilterRisk("All"); setSortMode("recent"); setDateFrom(""); setDateTo(""); }}
              className="flex items-center gap-1.5 text-xs font-bold text-destructive border border-destructive/30 rounded-full px-3 py-1.5 hover:bg-destructive/10 transition-colors"
            >
              <X size={12} /> Clear
            </button>
          )}
        </div>
      )}

      {/* ── Monthly grouped table ── */}
      <div className="flex flex-col gap-4">
        {byMonth.length === 0 && (
          <div className="bg-card rounded-2xl border border-border p-10 text-center text-muted-foreground text-sm font-light">
            No entries match your filters.
          </div>
        )}

        {byMonth.map(([mk, rows]) => {
          const summary = monthlySummary(rows);
          const isOpen = expandedMonths.has(mk);

          return (
            <div key={mk} className="bg-card rounded-2xl border border-border overflow-hidden shadow-sm">

              {/* Month header row */}
              <button
                className="w-full flex items-center gap-4 px-6 py-4 hover:bg-muted/30 transition-colors"
                onClick={() => {
                  setExpandedMonths(prev => {
                    const next = new Set(prev);
                    if (next.has(mk)) next.delete(mk);
                    else next.add(mk);
                    return next;
                  });
                }}
              >
                {/* Month label */}
                <div className="flex items-center gap-2 min-w-36">
                  <Calendar size={15} className="text-primary" />
                  <span className="font-extrabold text-sm text-foreground">{monthLabel(mk)}</span>
                </div>

                {/* Summary chips */}
                <div className="flex items-center gap-3 flex-1 flex-wrap">
                  <span className="text-xs font-mono text-muted-foreground">
                    Avg <span className="font-bold text-foreground">{summary.avg}</span> mg/dL
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    High <span className="font-bold" style={{ color: "#E53E3E" }}>{summary.high}</span>
                  </span>
                  <span className="text-xs font-mono text-muted-foreground">
                    Low <span className="font-bold" style={{ color: "#0F4D92" }}>{summary.low}</span>
                  </span>
                  {summary.risks > 0 && (
                    <span className="flex items-center gap-1 text-xs font-bold text-destructive">
                      <AlertCircle size={12} />
                      {summary.risks} risk event{summary.risks > 1 ? "s" : ""}
                    </span>
                  )}
                  {/* Trend */}
                  <span className="ml-auto flex items-center gap-1 text-xs font-bold"
                    style={{ color: summary.trend === "down" ? "#E53E3E" : summary.trend === "up" ? "#0F4D92" : "#8AA4C8" }}>
                    {summary.trend === "up"   && <><TrendingUp   size={14} /> Improving</>}
                    {summary.trend === "down" && <><TrendingDown size={14} /> Worsening</>}
                    {summary.trend === "stable" && <><Minus size={14} /> Stable</>}
                  </span>
                </div>

                {isOpen
                  ? <ChevronDown size={16} className="text-muted-foreground flex-shrink-0" />
                  : <ChevronRight size={16} className="text-muted-foreground flex-shrink-0" />
                }
              </button>

              {/* Daily log table */}
              {isOpen && (
                <div className="border-t border-border">
                  {/* Sticky table head */}
                  <div className="grid grid-cols-[1.5fr_1fr_1fr_1.5fr_1.5fr_0.8fr_0.8fr] gap-2 px-6 py-2.5 text-xs font-mono text-muted-foreground uppercase tracking-widest sticky top-[57px] z-10 border-b border-border"
                    style={{ background: "var(--muted)" }}>
                    <span>Date</span>
                    <span>Time</span>
                    <span>Glucose</span>
                    <span>Meal</span>
                    <span>Medication</span>
                    <span>Change</span>
                    <span>Risk</span>
                  </div>

                  {/* Rows — group by date inside month */}
                  {(() => {
                    const byDate = new Map<string, typeof rows>();
                    for (const r of rows) {
                      if (!byDate.has(r.date)) byDate.set(r.date, []);
                      byDate.get(r.date)!.push(r);
                    }
                    const dates = Array.from(byDate.keys()).sort((a, b) => b.localeCompare(a));
                    return dates.map(date => {
                      const dayRows = byDate.get(date)!;
                      return (
                        <div key={date}>
                          {dayRows.map((row, ri) => {
                            const risk = riskOf(row.glucose);
                            const c = RISK_COLORS[risk];
                            const rowBg =
                              risk === "High"   ? "rgba(229,62,62,0.06)"
                              : risk === "Medium" ? "rgba(249,220,92,0.15)"
                              : "transparent";
                            return (
                              <button
                                key={row.id}
                                className="w-full grid grid-cols-[1.5fr_1fr_1fr_1.5fr_1.5fr_0.8fr_0.8fr] gap-2 px-6 py-3 text-sm text-left transition-colors hover:bg-primary/5 group"
                                style={{ background: rowBg, borderBottom: "1px solid var(--border)" }}
                                onClick={() => setSelectedDate(date)}
                              >
                                {/* Date — only on first row of day */}
                                <span className="font-mono text-xs text-muted-foreground self-center">
                                  {ri === 0
                                    ? new Date(date).toLocaleDateString("en-GB", { day: "numeric", month: "short" })
                                    : ""}
                                </span>
                                {/* Time */}
                                <span className="flex items-center gap-1.5 self-center">
                                  <span className="w-2 h-2 rounded-full flex-shrink-0"
                                    style={{ background: TIME_DOT[row.time] }} />
                                  <span className="text-xs font-mono text-muted-foreground">{row.time}</span>
                                </span>
                                {/* Glucose */}
                                <span
                                  className="font-extrabold font-mono text-base self-center"
                                  style={{ color: c.text }}
                                >
                                  {row.glucose}
                                  <span className="text-xs font-normal text-muted-foreground ml-1">mg/dL</span>
                                </span>
                                {/* Meal */}
                                <span className="text-xs text-muted-foreground self-center truncate">
                                  {row.meal
                                    ? <span className="bg-white border border-border rounded-full px-2 py-0.5 font-medium">{row.meal}</span>
                                    : <span className="opacity-30">—</span>}
                                </span>
                                {/* Medication */}
                                <span className="text-xs self-center">
                                  {row.medication
                                    ? <span className="bg-primary/10 text-primary border border-primary/20 rounded-full px-2 py-0.5 font-medium">{row.medication}</span>
                                    : <span className="text-muted-foreground opacity-30">—</span>}
                                </span>
                                {/* Change arrow */}
                                <span className="self-center flex items-center">
                                  <ChangeArrow dir={row.dir} glucose={row.glucose} />
                                </span>
                                {/* Risk badge */}
                                <span className="self-center">
                                  <RiskBadge level={risk} />
                                </span>
                              </button>
                            );
                          })}
                        </div>
                      );
                    });
                  })()}
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* ── Day detail modal ── */}
      {selectedDate && dayEntries.length > 0 && (
        <DayDetailModal
          date={selectedDate}
          entries={dayEntries}
          onClose={() => setSelectedDate(null)}
        />
      )}
    </div>
  );
}
