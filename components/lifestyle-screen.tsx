"use client";

import React, { useState } from "react";
import { Zap, Moon, Dumbbell } from "lucide-react";

/* ─────────────────────────────────────────
   SVG ICONS — bold block style matching app
───────────────────────────────────────── */

function SleepTabIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1" y="6" width="18" height="12" rx="6" fill="#B0E0E6" opacity="0.7"/>
      <path d="M14 4 C14 4, 6 7, 6 12 A6 6 0 0 0 16 14 C19 10, 14 4 14 4Z"
        fill="#0F4D92" opacity="0.85"/>
      <circle cx="6" cy="6" r="2" fill="#FFF3A3" opacity="0.9"/>
      <circle cx="4" cy="10" r="1.2" fill="#FFF3A3" opacity="0.7"/>
    </svg>
  );
}

function ExerciseTabIcon() {
  return (
    <svg width="20" height="20" viewBox="0 0 20 20" fill="none">
      <rect x="1" y="9" width="18" height="10" rx="5" fill="#B0E0E6" opacity="0.6"/>
      {/* dumbbell */}
      <rect x="2" y="8" width="3" height="4" rx="1.5" fill="#0F4D92" opacity="0.85"/>
      <rect x="15" y="8" width="3" height="4" rx="1.5" fill="#0F4D92" opacity="0.85"/>
      <rect x="5" y="9" width="10" height="2" rx="1" fill="#4D9DE0" opacity="0.9"/>
    </svg>
  );
}

/* Activity icons */
function WalkIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="2" y="16" width="32" height="16" rx="8" fill="#B0E0E6" opacity="0.6"/>
      <circle cx="18" cy="9" r="4" fill="#0F4D92" opacity="0.85"/>
      <path d="M18 13 L15 22 M18 13 L21 22 M15 22 L12 28 M21 22 L24 28" stroke="#0F4D92" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function RunIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="2" y="18" width="32" height="14" rx="7" fill="#FFF3A3" opacity="0.9"/>
      <circle cx="20" cy="8" r="4" fill="#0F4D92" opacity="0.85"/>
      <path d="M20 12 L14 20 M20 12 L26 18 M14 20 L10 28 M26 18 L28 26 M14 20 L20 22" stroke="#0F4D92" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M4 26 L12 26" stroke="#0F4D92" strokeWidth="2" strokeLinecap="round" opacity="0.5"/>
    </svg>
  );
}
function GymIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="2" y="14" width="32" height="16" rx="8" fill="#B0E0E6" opacity="0.6"/>
      <rect x="2" y="14" width="6" height="8" rx="3" fill="#0F4D92" opacity="0.85"/>
      <rect x="28" y="14" width="6" height="8" rx="3" fill="#0F4D92" opacity="0.85"/>
      <rect x="8" y="16" width="20" height="4" rx="2" fill="#4D9DE0" opacity="0.9"/>
      <rect x="14" y="12" width="2" height="12" rx="1" fill="#0F4D92" opacity="0.85"/>
      <rect x="20" y="12" width="2" height="12" rx="1" fill="#0F4D92" opacity="0.85"/>
    </svg>
  );
}
function YogaIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      <rect x="2" y="20" width="32" height="12" rx="6" fill="#FFF3A3" opacity="0.9"/>
      <circle cx="18" cy="8" r="4" fill="#0F4D92" opacity="0.85"/>
      <path d="M18 12 Q12 18 8 22 M18 12 Q24 18 28 22" stroke="#0F4D92" strokeWidth="2.2" strokeLinecap="round" fill="none"/>
      <path d="M8 22 Q14 20 18 24 Q22 20 28 22" stroke="#4D9DE0" strokeWidth="2" strokeLinecap="round" fill="none" opacity="0.9"/>
    </svg>
  );
}

/* ─────────────────────────────────────────
   TYPES
───────────────────────────────────────── */
type Mode = "sleep" | "exercise";
type Activity = "walk" | "run" | "gym" | "yoga";

const ACTIVITY_ICONS: Record<Activity, React.ReactNode> = {
  walk: <WalkIcon />, run: <RunIcon />, gym: <GymIcon />, yoga: <YogaIcon />,
};

const ACTIVITY_LABELS: Record<Activity, string> = {
  walk: "Walk", run: "Run", gym: "Gym", yoga: "Yoga",
};

type Intensity = "low" | "medium" | "high";
const INTENSITIES: Intensity[] = ["low", "medium", "high"];

/* ─────────────────────────────────────────
   SLEEP UTILS
───────────────────────────────────────── */
function sleepQuality(h: number): { label: string; color: string; bg: string } {
  if (h < 5)  return { label: "Poor",      color: "#E53E3E",  bg: "rgba(229,62,62,0.12)"  };
  if (h < 7)  return { label: "Okay",      color: "#F9DC5C",  bg: "rgba(249,220,92,0.2)"  };
  if (h <= 9) return { label: "Good",      color: "#0F4D92",  bg: "rgba(15,77,146,0.1)"   };
  return             { label: "Excellent", color: "#1A6BBF",  bg: "rgba(26,107,191,0.12)" };
}

function sleepSliderColor(h: number): string {
  if (h < 5)  return "#E53E3E";
  if (h < 7)  return "#F9DC5C";
  return "#0F4D92";
}

function sleepInsight(h: number): string {
  if (h < 5)  return "Low sleep may increase glucose fluctuations — take it easy today.";
  if (h < 7)  return "Moderate sleep detected. Try to aim for 7-9 hours for optimal glucose stability.";
  if (h <= 9) return "Good sleep may lead to stable glucose — great start to the day!";
  return "Excellent rest! Extended sleep supports recovery and balanced glucose.";
}

/* ─────────────────────────────────────────
   CROSS-MODE INSIGHTS
───────────────────────────────────────── */
function getCrossInsights(
  sleepHours: number,
  exerciseMins: number,
): { text: string; good: boolean }[] {
  const out: { text: string; good: boolean }[] = [];

  if (sleepHours >= 7 && exerciseMins >= 20)
    out.push({ text: "Exercise + good sleep → stable glucose expected", good: true });

  if (exerciseMins >= 30)
    out.push({ text: "Active day → glucose likely well-managed", good: true });

  if (exerciseMins > 0 && sleepHours < 6)
    out.push({ text: "Exercise helps but low sleep may offset some benefits", good: false });

  if (sleepHours < 5 && exerciseMins === 0)
    out.push({ text: "Low sleep and no exercise → higher glucose risk today", good: false });

  if (out.length === 0)
    out.push({ text: "Keep logging to receive personalised glucose insights", good: true });

  return out.slice(0, 3);
}

/* ─────────────────────────────────────────
   SLEEP MODE
───────────────────────────────────────── */
function SleepMode({ onLog }: { onLog: (h: number) => void }) {
  const [hours, setHours] = useState(7);
  const [logged, setLogged] = useState(false);
  const q = sleepQuality(hours);

  function handleLog() {
    setLogged(true);
    onLog(hours);
  }

  const pct = (hours / 12) * 100;
  const sliderColor = sleepSliderColor(hours);

  return (
    <div className="flex flex-col gap-5">
      <div className="bg-card border border-border rounded-2xl p-6 shadow-sm">
        <h3 className="font-bold text-foreground mb-1">How many hours did you sleep?</h3>
        <p className="text-xs font-mono text-muted-foreground mb-6">Move the slider to log your sleep</p>

        {/* Value display */}
        <div className="flex items-end gap-2 mb-6">
          <span className="text-5xl font-bold tabular-nums" style={{ color: sliderColor }}>
            {hours}
          </span>
          <span className="text-xl font-semibold text-muted-foreground mb-1">hrs</span>
          <span
            className="ml-auto px-3 py-1.5 rounded-full text-sm font-bold"
            style={{ background: q.bg, color: q.color }}
          >
            {q.label}
          </span>
        </div>

        {/* Custom slider */}
        <div className="relative mb-2">
          <div
            className="w-full h-3 rounded-full overflow-hidden"
            style={{ background: "var(--border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{ width: `${pct}%`, background: sliderColor }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={12}
            step={0.5}
            value={hours}
            onChange={e => { setHours(parseFloat(e.target.value)); setLogged(false); }}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-3"
            aria-label="Sleep hours"
          />
        </div>

        {/* Range labels */}
        <div className="flex justify-between text-xs font-mono text-muted-foreground mb-6">
          <span>0 hrs</span>
          <span>6 hrs</span>
          <span>12 hrs</span>
        </div>

        {/* Quality bands */}
        <div className="grid grid-cols-4 gap-2 mb-6">
          {[
            { range: "< 5 hrs", label: "Poor",      color: "#E53E3E", bg: "rgba(229,62,62,0.1)", active: hours < 5 },
            { range: "5-6 hrs", label: "Okay",      color: "#C9A800", bg: "rgba(249,220,92,0.2)", active: hours >= 5 && hours < 7 },
            { range: "7-9 hrs", label: "Good",      color: "#0F4D92", bg: "rgba(15,77,146,0.1)", active: hours >= 7 && hours <= 9 },
            { range: "> 9 hrs", label: "Excellent", color: "#1A6BBF", bg: "rgba(26,107,191,0.12)", active: hours > 9 },
          ].map(band => (
            <div
              key={band.label}
              className="rounded-xl px-2 py-2 text-center border transition-all"
              style={{
                background: band.active ? band.bg : "var(--card)",
                borderColor: band.active ? band.color : "var(--border)",
                opacity: band.active ? 1 : 0.5,
              }}
            >
              <p className="text-xs font-bold" style={{ color: band.color }}>{band.label}</p>
              <p className="text-xs font-mono mt-0.5" style={{ color: "var(--muted-foreground)" }}>{band.range}</p>
            </div>
          ))}
        </div>

        <button
          onClick={handleLog}
          disabled={logged}
          className="w-full py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
          style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
        >
          {logged ? "Sleep Logged" : "Log Sleep"}
        </button>
      </div>

      {/* Insight */}
      <div
        className="flex items-start gap-3 rounded-2xl px-5 py-4 border"
        style={{
          background: q.bg,
          borderColor: hours < 5 ? "rgba(229,62,62,0.3)" : "rgba(15,77,146,0.2)",
          color: q.color,
        }}
      >
        <Moon size={18} className="flex-shrink-0 mt-0.5" />
        <p className="text-sm font-semibold leading-relaxed">{sleepInsight(hours)}</p>
      </div>
    </div>
  );
}

/* ─────────────────────────────────────────
   EXERCISE MODE
───────────────────────────────────────── */
function ExerciseMode({ onLog }: { onLog: (mins: number) => void }) {
  const [activity, setActivity] = useState<Activity>("walk");
  const [duration, setDuration] = useState(30);
  const [intensity, setIntensity] = useState<Intensity>("medium");
  const [logged, setLogged] = useState(false);

  function handleLog() {
    setLogged(true);
    onLog(duration);
  }

  const activities: Activity[] = ["walk", "run", "gym", "yoga"];
  const pct = (duration / 120) * 100;

  const intensityColors: Record<Intensity, { bg: string; color: string }> = {
    low:    { bg: "rgba(15,77,146,0.1)",  color: "#0F4D92" },
    medium: { bg: "rgba(26,107,191,0.15)", color: "#1A6BBF" },
    high:   { bg: "rgba(77,157,224,0.2)", color: "#4D9DE0" },
  };

  return (
    <div className="flex flex-col gap-5">
      {/* Activity selector */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-sm text-foreground mb-4">Select Activity</h3>
        <div className="grid grid-cols-4 gap-3">
          {activities.map(a => (
            <button
              key={a}
              onClick={() => { setActivity(a); setLogged(false); }}
              className="flex flex-col items-center gap-2 py-4 rounded-2xl border text-xs font-bold capitalize transition-all"
              style={activity === a
                ? { background: "var(--primary)", color: "var(--primary-foreground)", borderColor: "var(--primary)" }
                : { background: "var(--card)", color: "var(--foreground)", borderColor: "var(--border)" }
              }
            >
              <span style={activity === a ? { filter: "brightness(0) invert(1)" } : {}}>
                {ACTIVITY_ICONS[a]}
              </span>
              {ACTIVITY_LABELS[a]}
            </button>
          ))}
        </div>
      </div>

      {/* Duration slider */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-bold text-sm text-foreground">Duration</h3>
          <span className="text-2xl font-bold tabular-nums" style={{ color: "var(--primary)" }}>
            {duration} <span className="text-sm font-semibold text-muted-foreground">mins</span>
          </span>
        </div>

        <div className="relative mb-2">
          <div
            className="w-full h-3 rounded-full overflow-hidden"
            style={{ background: "var(--border)" }}
          >
            <div
              className="h-full rounded-full transition-all duration-200"
              style={{ width: `${pct}%`, background: "var(--primary)" }}
            />
          </div>
          <input
            type="range"
            min={0}
            max={120}
            step={5}
            value={duration}
            onChange={e => { setDuration(parseInt(e.target.value)); setLogged(false); }}
            className="absolute inset-0 w-full opacity-0 cursor-pointer h-3"
            aria-label="Exercise duration"
          />
        </div>
        <div className="flex justify-between text-xs font-mono text-muted-foreground mb-4">
          <span>0 min</span><span>60 min</span><span>120 min</span>
        </div>

        {/* Quick picks */}
        <div className="flex gap-2 flex-wrap">
          {[15, 30, 45, 60, 90].map(m => (
            <button
              key={m}
              onClick={() => { setDuration(m); setLogged(false); }}
              className="px-3 py-1.5 rounded-full text-xs font-bold border transition-all"
              style={duration === m
                ? { background: "var(--primary)", color: "var(--primary-foreground)", borderColor: "var(--primary)" }
                : { background: "var(--muted)", color: "var(--foreground)", borderColor: "var(--border)" }
              }
            >
              {m} min
            </button>
          ))}
        </div>
      </div>

      {/* Intensity */}
      <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
        <h3 className="font-bold text-sm text-foreground mb-3">Intensity</h3>
        <div className="flex gap-3">
          {INTENSITIES.map(i => {
            const ic = intensityColors[i];
            return (
              <button
                key={i}
                onClick={() => { setIntensity(i); setLogged(false); }}
                className="flex-1 py-3 rounded-2xl text-sm font-bold capitalize border transition-all"
                style={intensity === i
                  ? { background: ic.bg, color: ic.color, borderColor: ic.color }
                  : { background: "var(--card)", color: "var(--muted-foreground)", borderColor: "var(--border)" }
                }
              >
                {i}
              </button>
            );
          })}
        </div>
      </div>

      <button
        onClick={handleLog}
        disabled={logged}
        className="w-full py-3 rounded-2xl text-sm font-bold transition-all hover:opacity-90 disabled:opacity-50"
        style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
      >
        {logged ? "Exercise Logged" : `Log ${ACTIVITY_LABELS[activity]}`}
      </button>

      {logged && (
        <div
          className="flex items-start gap-3 rounded-2xl px-5 py-4 border"
          style={{ background: "rgba(15,77,146,0.08)", borderColor: "rgba(15,77,146,0.2)", color: "var(--primary)" }}
        >
          <Dumbbell size={18} className="flex-shrink-0 mt-0.5" />
          <p className="text-sm font-semibold leading-relaxed">
            Exercise helps stabilise glucose levels — great effort!
          </p>
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   DAILY SUMMARY
───────────────────────────────────────── */
function DailySummary({
  sleepHours,
  exerciseMins,
}: {
  sleepHours: number;
  exerciseMins: number;
}) {
  const insights = getCrossInsights(sleepHours, exerciseMins);
  const hasActivity = sleepHours > 0 || exerciseMins > 0;

  const summaryText = (() => {
    if (!hasActivity) return "Start logging to see your daily summary";
    const good = sleepHours >= 7 && exerciseMins >= 20;
    if (good) return "Balanced day → stable glucose expected";
    if (sleepHours < 5 && exerciseMins === 0) return "Tough day — prioritise rest and movement";
    return "Keep going — every log helps your glucose insights";
  })();

  return (
    <div className="flex flex-col gap-4">
      {/* Stats row */}
      <div className="grid grid-cols-2 gap-4">
        {[
          { icon: <Moon size={16} />,     label: "Sleep",    value: sleepHours,   unit: "hrs", active: sleepHours > 0 },
          { icon: <Dumbbell size={16} />, label: "Exercise", value: exerciseMins, unit: "min", active: exerciseMins > 0 },
        ].map(s => (
          <div
            key={s.label}
            className="rounded-2xl p-4 border flex flex-col gap-1 transition-all"
            style={{
              background: s.active ? "rgba(15,77,146,0.06)" : "var(--card)",
              borderColor: s.active ? "rgba(15,77,146,0.25)" : "var(--border)",
            }}
          >
            <div className="flex items-center gap-2 text-muted-foreground">
              {s.icon}
              <span className="text-xs font-mono">{s.label}</span>
            </div>
            <p className="text-2xl font-bold tabular-nums" style={{ color: s.active ? "var(--primary)" : "var(--muted-foreground)" }}>
              {s.value}
              <span className="text-sm font-semibold text-muted-foreground ml-1">{s.unit}</span>
            </p>
          </div>
        ))}
      </div>

      {/* Summary insight */}
      <div
        className="rounded-2xl px-5 py-4 border"
        style={{ background: "rgba(15,77,146,0.06)", borderColor: "rgba(15,77,146,0.18)" }}
      >
        <p className="text-sm font-bold text-foreground">{summaryText}</p>
      </div>

      {/* Cross-mode insights */}
      {hasActivity && (
        <div className="flex flex-col gap-2">
          <h4 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Combined Insights</h4>
          {insights.map((ins, i) => (
            <div
              key={i}
              className="flex items-start gap-3 rounded-2xl px-4 py-3 border text-sm font-semibold leading-relaxed"
              style={{
                background: ins.good ? "rgba(15,77,146,0.06)" : "rgba(229,62,62,0.06)",
                borderColor: ins.good ? "rgba(15,77,146,0.2)" : "rgba(229,62,62,0.25)",
                color: ins.good ? "var(--primary)" : "#E53E3E",
              }}
            >
              <Zap size={15} className="flex-shrink-0 mt-0.5" />
              {ins.text}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

/* ─────────────────────────────────────────
   MAIN SCREEN
───────────────────────────────────────── */
export default function LifestyleScreen() {
  const [mode, setMode] = useState<Mode>("sleep");
  const [sleepHours, setSleepHours] = useState(0);
  const [exerciseMins, setExerciseMins] = useState(0);

  const tabs: { id: Mode; label: string; icon: React.ReactNode }[] = [
    { id: "sleep",    label: "Sleep",    icon: <SleepTabIcon /> },
    { id: "exercise", label: "Exercise", icon: <ExerciseTabIcon /> },
  ];

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
          Daily Wellness
        </p>
        <h1 className="text-3xl font-bold text-foreground mt-1">Lifestyle Tracker</h1>
      </div>

      {/* Mode switcher */}
      <div
        className="flex rounded-2xl p-1.5 border"
        style={{ background: "var(--card)", borderColor: "var(--border)" }}
      >
        {tabs.map(t => (
          <button
            key={t.id}
            onClick={() => setMode(t.id)}
            className="flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl text-sm font-bold transition-all"
            style={mode === t.id
              ? { background: "var(--primary)", color: "var(--primary-foreground)" }
              : { color: "var(--muted-foreground)" }
            }
          >
            {t.icon}
            {t.label}
          </button>
        ))}
      </div>

      {/* Panels */}
      <div className="grid grid-cols-3 gap-5">
        {/* Left: active mode */}
        <div className="col-span-2">
          {mode === "sleep"    && <SleepMode    onLog={h => setSleepHours(h)} />}
          {mode === "exercise" && <ExerciseMode onLog={m => setExerciseMins(m)} />}
        </div>

        {/* Right: daily summary */}
        <div className="col-span-1">
          <h3 className="font-bold text-sm text-foreground mb-4">Daily Summary</h3>
          <DailySummary
            sleepHours={sleepHours}
            exerciseMins={exerciseMins}
          />
        </div>
      </div>
    </div>
  );
}
