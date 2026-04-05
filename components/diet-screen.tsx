"use client";

import { useState } from "react";
import { Plus, X, TrendingUp, TrendingDown, Minus } from "lucide-react";
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  ReferenceLine, Tooltip, ReferenceDot,
} from "recharts";

/* ── Food SVG icons — bold color block style ── */
function FoodBowlIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {/* yellow block behind */}
      <rect x="2" y="14" width="32" height="18" rx="8" fill="#FFF3A3" opacity="0.9"/>
      {/* blue bowl */}
      <ellipse cx="18" cy="24" rx="13" ry="7" fill="#0F4D92" opacity="0.85"/>
      <ellipse cx="18" cy="22" rx="13" ry="5" fill="#4D9DE0" opacity="0.5"/>
      {/* steam lines */}
      <path d="M13 14 Q14 10 13 7" stroke="#0F4D92" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M18 12 Q19 8 18 5" stroke="#0F4D92" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M23 14 Q24 10 23 7" stroke="#0F4D92" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  );
}
function AppleIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {/* blue block behind */}
      <rect x="4" y="10" width="28" height="22" rx="10" fill="#B0E0E6" opacity="0.7"/>
      {/* apple body */}
      <path d="M18 8 C18 8, 8 13, 8 23 A10 10 0 0 0 28 23 C28 13, 18 8, 18 8Z"
        fill="#0F4D92" opacity="0.85"/>
      {/* highlight */}
      <ellipse cx="14" cy="18" rx="2.5" ry="4" fill="white" opacity="0.3"/>
      {/* stem */}
      <path d="M18 7 C18 7, 21 4, 23 5" stroke="#0F4D92" strokeWidth="1.5" strokeLinecap="round" fill="none" opacity="0.6"/>
    </svg>
  );
}
function PlateIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {/* yellow block */}
      <rect x="2" y="16" width="32" height="14" rx="7" fill="#FFF3A3" opacity="0.9"/>
      {/* plate */}
      <circle cx="18" cy="22" r="12" fill="#B0E0E6" opacity="0.6"/>
      <circle cx="18" cy="22" r="8" fill="#0F4D92" opacity="0.85"/>
      <circle cx="18" cy="22" r="4" fill="#4D9DE0" opacity="0.5"/>
      {/* fork */}
      <path d="M30 10 L30 18" stroke="#0F4D92" strokeWidth="2" strokeLinecap="round"/>
      <path d="M28 10 L28 15 Q28 18 30 18" stroke="#0F4D92" strokeWidth="1.5" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function CupIcon() {
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none">
      {/* blue block */}
      <rect x="6" y="8" width="24" height="24" rx="8" fill="#0F4D92" opacity="0.85"/>
      {/* cup body lighter */}
      <path d="M10 11 L12 28 Q12 30 18 30 Q24 30 24 28 L26 11Z"
        fill="#4D9DE0" opacity="0.4"/>
      {/* handle */}
      <path d="M26 16 Q32 16 32 20 Q32 24 26 24" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round"/>
      {/* rim */}
      <rect x="9" y="10" width="18" height="3" rx="1.5" fill="white" opacity="0.4"/>
    </svg>
  );
}

const MEAL_ICONS = { breakfast: <FoodBowlIcon/>, lunch: <PlateIcon/>, dinner: <PlateIcon/>, snack: <AppleIcon/>, drink: <CupIcon/> };

type MealSlot = "breakfast" | "lunch" | "dinner" | "snack" | "drink";
type Meal = { id: number; slot: MealSlot; name: string; glucose_impact: "spike" | "drop" | "stable" };

const mealSlots: MealSlot[] = ["breakfast","lunch","dinner","snack","drink"];

const QUICK_MEALS: Record<MealSlot, string[]> = {
  breakfast: ["Oats","Eggs","Toast","Banana"],
  lunch:     ["Rice","Salad","Sandwich","Dal"],
  dinner:    ["Roti","Pasta","Soup","Grilled"],
  snack:     ["Biscuit","Fruit","Nuts","Yogurt"],
  drink:     ["Water","Juice","Tea","Coffee"],
};

const IMPACT_CONFIG = {
  spike:  { icon: <TrendingUp size={12}/>,  label: "Spike",  color: "text-destructive",  bg: "bg-destructive/10",  border: "border-destructive/30" },
  drop:   { icon: <TrendingDown size={12}/>, label: "Drop",   color: "text-accent",       bg: "bg-accent/10",       border: "border-accent/30" },
  stable: { icon: <Minus size={12}/>,        label: "Stable", color: "text-primary",      bg: "bg-primary/10",      border: "border-primary/30" },
};

/* ── Glucose data with meal markers ── */
const glucoseData = [
  { t: "07:00", g: 90,  meal: "Breakfast", impact: "spike" },
  { t: "07:30", g: 95,  meal: null },
  { t: "08:00", g: 112, meal: null },
  { t: "08:30", g: 118, meal: null },
  { t: "09:00", g: 110, meal: null },
  { t: "09:30", g: 103, meal: null },
  { t: "10:00", g: 97,  meal: null },
  { t: "10:30", g: 94,  meal: null },
  { t: "11:00", g: 91,  meal: null },
  { t: "12:00", g: 88,  meal: "Lunch", impact: "spike" },
  { t: "12:30", g: 96,  meal: null },
  { t: "13:00", g: 108, meal: null },
  { t: "13:30", g: 102, meal: null },
  { t: "14:00", g: 97,  meal: null },
  { t: "15:00", g: 91,  meal: "Snack", impact: "stable" },
  { t: "15:30", g: 93,  meal: null },
  { t: "16:00", g: 90,  meal: null },
  { t: "17:00", g: 86,  meal: null },
  { t: "18:00", g: 80,  meal: null },
];

const mealDots = glucoseData.filter(d => d.meal);

const CustomTooltip = ({ active, payload }: { active?: boolean; payload?: { payload: { t: string; g: number; meal: string | null } }[] }) => {
  if (!active || !payload?.length) return null;
  const d = payload[0].payload;
  return (
    <div className="bg-card border border-border rounded-xl px-3 py-2 text-xs font-mono shadow-lg">
      <p className="text-muted-foreground">{d.t}</p>
      <p className="font-bold text-primary">{d.g} mg/dL</p>
      {d.meal && <p className="text-accent font-semibold mt-0.5">{d.meal}</p>}
    </div>
  );
};

const insights = [
  "Skipping meals increases hypoglycemia risk by 40%",
  "Heavy carb lunches cause spike then sharp drop in 2 hrs",
  "Your breakfast glucose trend is most stable",
];

let idCounter = 10;

export default function DietScreen() {
  const [activeSlot, setActiveSlot] = useState<MealSlot>("breakfast");
  const [meals, setMeals] = useState<Meal[]>([
    { id: 1, slot: "breakfast", name: "Oats", glucose_impact: "stable" },
    { id: 2, slot: "lunch",     name: "Rice",  glucose_impact: "spike"  },
    { id: 3, slot: "snack",     name: "Fruit", glucose_impact: "stable" },
  ]);
  const [custom, setCustom] = useState("");

  function addMeal(name: string) {
    const impacts: Meal["glucose_impact"][] = ["spike","drop","stable"];
    setMeals(m => [...m, {
      id: ++idCounter,
      slot: activeSlot,
      name,
      glucose_impact: impacts[Math.floor(Math.random() * 3)],
    }]);
  }

  function removeMeal(id: number) {
    setMeals(m => m.filter(x => x.id !== id));
  }

  const slotMeals = meals.filter(m => m.slot === activeSlot);

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Food &amp; Glucose Impact</p>
        <h1 className="text-3xl font-bold text-foreground mt-1">Diet Log</h1>
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left: log panel */}
        <div className="col-span-1 flex flex-col gap-4">
          {/* Slot tabs */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-3">
            <h3 className="font-bold text-sm text-foreground">Meal Slots</h3>
            <div className="flex flex-col gap-1.5">
              {mealSlots.map(slot => (
                <button key={slot} onClick={() => setActiveSlot(slot)}
                  className="flex items-center gap-3 px-3 py-2 rounded-xl text-sm font-semibold capitalize transition-all text-left"
                  style={activeSlot === slot
                    ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                    : { color: "var(--foreground)", background: "var(--muted)" }
                  }
                >
                  <span className="w-8 h-8 flex items-center justify-center">
                    {MEAL_ICONS[slot]}
                  </span>
                  {slot}
                  <span className="ml-auto text-xs opacity-60">
                    {meals.filter(m => m.slot === slot).length}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* Insight cards */}
          <div className="bg-card border border-border rounded-2xl p-4 shadow-sm flex flex-col gap-2">
            <h3 className="font-bold text-sm text-foreground">Diet Insights</h3>
            {insights.map((ins, i) => (
              <p key={i} className="text-xs text-muted-foreground leading-relaxed bg-muted rounded-xl px-3 py-2">
                {ins}
              </p>
            ))}
          </div>
        </div>

        {/* Right: quick add + chart */}
        <div className="col-span-2 flex flex-col gap-4">

          {/* Quick add */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <h3 className="font-bold text-sm text-foreground mb-3 capitalize">{activeSlot} — Quick Add</h3>
            <div className="flex flex-wrap gap-2 mb-3">
              {QUICK_MEALS[activeSlot].map(q => (
                <button key={q} onClick={() => addMeal(q)}
                  className="flex items-center gap-1.5 px-3 py-1.5 rounded-full text-sm font-semibold border border-border bg-muted hover:border-primary/60 hover:text-primary transition-all"
                >
                  <Plus size={12} /> {q}
                </button>
              ))}
            </div>
            <div className="flex gap-2">
              <input
                value={custom}
                onChange={e => setCustom(e.target.value)}
                onKeyDown={e => { if (e.key === "Enter" && custom.trim()) { addMeal(custom.trim()); setCustom(""); } }}
                placeholder="Custom food item..."
                className="flex-1 bg-card border border-border rounded-xl px-3 py-2 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/70"
              />
              <button
                onClick={() => { if (custom.trim()) { addMeal(custom.trim()); setCustom(""); } }}
                className="px-4 py-2 rounded-xl text-sm font-bold"
                style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
              >Add</button>
            </div>

            {/* Logged items */}
            {slotMeals.length > 0 && (
              <div className="flex flex-wrap gap-2 mt-3">
                {slotMeals.map(m => {
                  const ic = IMPACT_CONFIG[m.glucose_impact];
                  return (
                    <span key={m.id}
                      className={`flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold border ${ic.bg} ${ic.border} ${ic.color}`}
                    >
                      {ic.icon} {m.name}
                      <button onClick={() => removeMeal(m.id)} className="ml-1 opacity-60 hover:opacity-100">
                        <X size={10} />
                      </button>
                    </span>
                  );
                })}
              </div>
            )}
          </div>

          {/* Glucose + meal marker chart */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm flex-1">
            <div className="flex items-center justify-between mb-3">
              <h3 className="font-bold text-sm text-foreground">Glucose vs Meals Today</h3>
              <div className="flex gap-3 text-xs font-mono">
                <span className="flex items-center gap-1 text-primary">
                  <span className="w-3 h-0.5 inline-block bg-primary rounded" /> Glucose
                </span>
                <span className="flex items-center gap-1 text-accent">
                  <span className="w-2.5 h-2.5 rounded-full inline-block bg-accent" /> Meal
                </span>
              </div>
            </div>
            <ResponsiveContainer width="100%" height={200}>
              <AreaChart data={glucoseData} margin={{ top: 8, right: 4, left: -24, bottom: 0 }}>
                <defs>
                  <linearGradient id="dietG" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0%" stopColor="#0F4D92" stopOpacity={0.2} />
                    <stop offset="100%" stopColor="#0F4D92" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="t" tick={{ fill: "#3A6094", fontSize: 9 }} tickLine={false} axisLine={false} interval={3} />
                <YAxis domain={[70, 130]} tick={{ fill: "#3A6094", fontSize: 9 }} tickLine={false} axisLine={false} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={70} stroke="#E53E3E" strokeDasharray="4 3" strokeWidth={1.5} />
                <Area type="monotone" dataKey="g" stroke="#0F4D92" strokeWidth={2.5}
                  fill="url(#dietG)" dot={false} />
                {mealDots.map(md => (
                  <ReferenceDot key={md.t} x={md.t} y={md.g} r={6}
                    fill="#1A6BBF" stroke="#F0F8FF" strokeWidth={2}
                    label={{ value: md.meal as string, position: "top", fill: "#0F4D92", fontSize: 8, fontFamily: "monospace" }}
                  />
                ))}
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </div>
  );
}
