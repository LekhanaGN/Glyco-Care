"use client";

import { createContext, useContext, useState, useMemo, type ReactNode } from "react";
import { calculateLBGI, getRiskLevelFromLBGI, type RiskLevel } from "@/lib/utils";

/* ─────────────────────────── Types ─────────────────────────── */
export type TimeSlot = "Morning" | "Afternoon" | "Night";
export type MealSlot = "breakfast" | "lunch" | "dinner" | "snack" | "drink";
export type GlucoseImpact = "spike" | "drop" | "stable";
export type ActivityLevel = "sedentary" | "light" | "moderate" | "intense";

export interface GlucoseEntry {
  id: number;
  date: string;       // "YYYY-MM-DD"
  time: TimeSlot;
  glucose: number;
  meal?: string;
  medication?: string;
  timestamp?: number; // epoch ms for sorting
}

export interface MealEntry {
  id: number;
  date: string;
  slot: MealSlot;
  name: string;
  glucose_impact: GlucoseImpact;
  carbs?: number;
  timestamp?: number;
}

export interface ActivityEntry {
  id: number;
  date: string;
  type: string;
  duration: number; // minutes
  level: ActivityLevel;
  caloriesBurned?: number;
  timestamp?: number;
}

export interface MedicationEntry {
  id: number;
  date: string;
  name: string;
  dosage?: string;
  time: TimeSlot;
  timestamp?: number;
}

export interface RiskPrediction {
  lbgi: number;
  riskLevel: RiskLevel;
  predictedGlucose: number;
  futureValues: number[];
  trend: number;
  confidence: number;
  factors: RiskFactor[];
  lastUpdated: number;
}

export interface RiskFactor {
  type: "meal" | "activity" | "medication" | "pattern" | "time";
  label: string;
  impact: "positive" | "negative" | "neutral";
  description: string;
}

interface HealthDataContextType {
  // Data entries
  glucoseEntries: GlucoseEntry[];
  mealEntries: MealEntry[];
  activityEntries: ActivityEntry[];
  medicationEntries: MedicationEntry[];
  
  // Data mutations
  addGlucoseEntry: (entry: Omit<GlucoseEntry, "id" | "timestamp">) => void;
  addMealEntry: (entry: Omit<MealEntry, "id" | "timestamp">) => void;
  addActivityEntry: (entry: Omit<ActivityEntry, "id" | "timestamp">) => void;
  addMedicationEntry: (entry: Omit<MedicationEntry, "id" | "timestamp">) => void;
  
  // Risk prediction (computed automatically)
  riskPrediction: RiskPrediction;
  
  // Helpers
  getRecentGlucoseValues: (hours?: number) => number[];
  getTodayEntries: () => { glucose: GlucoseEntry[]; meals: MealEntry[]; activities: ActivityEntry[] };
}

/* ─────────────────────────── Seed Data ─────────────────────── */
const SEED_GLUCOSE: GlucoseEntry[] = [
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

const SEED_MEALS: MealEntry[] = [
  { id: 1, date: "2025-04-05", slot: "breakfast", name: "Dosa", glucose_impact: "stable", carbs: 35 },
  { id: 2, date: "2025-04-05", slot: "lunch", name: "Chapati + Sabzi", glucose_impact: "spike", carbs: 55 },
  { id: 3, date: "2025-04-04", slot: "breakfast", name: "Bread + Egg", glucose_impact: "stable", carbs: 25 },
  { id: 4, date: "2025-04-04", slot: "lunch", name: "Pizza", glucose_impact: "spike", carbs: 80 },
  { id: 5, date: "2025-04-04", slot: "snack", name: "Fruit", glucose_impact: "stable", carbs: 15 },
];

const SEED_ACTIVITIES: ActivityEntry[] = [
  { id: 1, date: "2025-04-05", type: "Walking", duration: 30, level: "light", caloriesBurned: 120 },
  { id: 2, date: "2025-04-04", type: "Yoga", duration: 45, level: "moderate", caloriesBurned: 150 },
  { id: 3, date: "2025-04-03", type: "Running", duration: 20, level: "intense", caloriesBurned: 200 },
  { id: 4, date: "2025-04-02", type: "Walking", duration: 25, level: "light", caloriesBurned: 100 },
];

const SEED_MEDICATIONS: MedicationEntry[] = [
  { id: 1, date: "2025-04-05", name: "Metformin", dosage: "500mg", time: "Morning" },
  { id: 2, date: "2025-04-04", name: "Metformin", dosage: "500mg", time: "Morning" },
  { id: 3, date: "2025-04-02", name: "Glipizide", dosage: "5mg", time: "Night" },
];

/* ─────────────────────────── Context ─────────────────────────── */
const HealthDataContext = createContext<HealthDataContextType | null>(null);

export function useHealthData() {
  const context = useContext(HealthDataContext);
  if (!context) {
    throw new Error("useHealthData must be used within HealthDataProvider");
  }
  return context;
}

let idCounter = 100;

export function HealthDataProvider({ children }: { children: ReactNode }) {
  const [glucoseEntries, setGlucoseEntries] = useState<GlucoseEntry[]>(SEED_GLUCOSE);
  const [mealEntries, setMealEntries] = useState<MealEntry[]>(SEED_MEALS);
  const [activityEntries, setActivityEntries] = useState<ActivityEntry[]>(SEED_ACTIVITIES);
  const [medicationEntries, setMedicationEntries] = useState<MedicationEntry[]>(SEED_MEDICATIONS);

  // Add entry functions
  const addGlucoseEntry = (entry: Omit<GlucoseEntry, "id" | "timestamp">) => {
    setGlucoseEntries(prev => [...prev, { ...entry, id: ++idCounter, timestamp: Date.now() }]);
  };

  const addMealEntry = (entry: Omit<MealEntry, "id" | "timestamp">) => {
    setMealEntries(prev => [...prev, { ...entry, id: ++idCounter, timestamp: Date.now() }]);
  };

  const addActivityEntry = (entry: Omit<ActivityEntry, "id" | "timestamp">) => {
    setActivityEntries(prev => [...prev, { ...entry, id: ++idCounter, timestamp: Date.now() }]);
  };

  const addMedicationEntry = (entry: Omit<MedicationEntry, "id" | "timestamp">) => {
    setMedicationEntries(prev => [...prev, { ...entry, id: ++idCounter, timestamp: Date.now() }]);
  };

  // Helper to get glucose values sorted by date
  const getRecentGlucoseValues = (hours: number = 168) => { // Default 7 days
    const now = Date.now();
    const cutoff = now - hours * 60 * 60 * 1000;
    
    // Sort by date and time
    const sorted = [...glucoseEntries].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      const timeOrder = { Morning: 0, Afternoon: 1, Night: 2 };
      return timeOrder[a.time] - timeOrder[b.time];
    });
    
    return sorted.map(e => e.glucose);
  };

  // Get today's entries
  const getTodayEntries = () => {
    const today = new Date().toISOString().split("T")[0];
    return {
      glucose: glucoseEntries.filter(e => e.date === today),
      meals: mealEntries.filter(e => e.date === today),
      activities: activityEntries.filter(e => e.date === today),
    };
  };

  // Calculate risk prediction automatically based on all data
  const riskPrediction = useMemo<RiskPrediction>(() => {
    const glucoseValues = getRecentGlucoseValues(168); // Last 7 days
    
    if (glucoseValues.length === 0) {
      return {
        lbgi: 0,
        riskLevel: "LOW",
        predictedGlucose: 100,
        futureValues: [],
        trend: 0,
        confidence: 0,
        factors: [],
        lastUpdated: Date.now(),
      };
    }

    // Calculate LBGI using Kovatchev formula
    const lbgi = calculateLBGI(glucoseValues);
    const riskLevel = getRiskLevelFromLBGI(lbgi);

    // Calculate trend from recent values
    const recentValues = glucoseValues.slice(-6);
    const trend = recentValues.length >= 2
      ? (recentValues[recentValues.length - 1] - recentValues[0]) / recentValues.length
      : 0;

    // Predict future values based on patterns
    const lastValue = glucoseValues[glucoseValues.length - 1];
    const avgValue = glucoseValues.reduce((a, b) => a + b, 0) / glucoseValues.length;
    
    // Factor in recent meals (high carbs increase glucose)
    const recentMeals = mealEntries.slice(-5);
    const mealImpact = recentMeals.reduce((acc, meal) => {
      if (meal.glucose_impact === "spike") return acc + 8;
      if (meal.glucose_impact === "drop") return acc - 5;
      return acc;
    }, 0);

    // Factor in activity (reduces glucose)
    const recentActivities = activityEntries.slice(-3);
    const activityImpact = recentActivities.reduce((acc, act) => {
      if (act.level === "intense") return acc - 15;
      if (act.level === "moderate") return acc - 8;
      if (act.level === "light") return acc - 4;
      return acc;
    }, 0);

    // Factor in medications (typically reduce glucose)
    const recentMeds = medicationEntries.slice(-2);
    const medImpact = recentMeds.length > 0 ? -10 : 0;

    // Generate predicted future values (next 4 hours, 30-min intervals)
    const basePredict = lastValue + mealImpact + activityImpact + medImpact;
    const futureValues = Array.from({ length: 8 }, (_, i) => {
      const variance = (Math.random() - 0.5) * 10;
      const timeDecay = trend * (i + 1) * 0.5;
      return Math.max(50, Math.min(200, Math.round(basePredict + timeDecay + variance)));
    });

    // Build risk factors
    const factors: RiskFactor[] = [];

    // Check for low glucose patterns
    const lowReadings = glucoseValues.filter(g => g < 70);
    if (lowReadings.length > 0) {
      factors.push({
        type: "pattern",
        label: `${lowReadings.length} low readings`,
        impact: "negative",
        description: `You had ${lowReadings.length} readings below 70 mg/dL in the past week`,
      });
    }

    // Check for high variability
    const variance = glucoseValues.reduce((acc, g) => acc + Math.pow(g - avgValue, 2), 0) / glucoseValues.length;
    const stdDev = Math.sqrt(variance);
    if (stdDev > 25) {
      factors.push({
        type: "pattern",
        label: "High variability",
        impact: "negative",
        description: "Your glucose levels show high variability",
      });
    }

    // Activity factor
    if (recentActivities.length > 0) {
      const totalDuration = recentActivities.reduce((acc, a) => acc + a.duration, 0);
      factors.push({
        type: "activity",
        label: `${totalDuration} min exercise`,
        impact: "positive",
        description: "Regular activity helps stabilize glucose",
      });
    } else {
      factors.push({
        type: "activity",
        label: "Low activity",
        impact: "neutral",
        description: "Consider adding light exercise",
      });
    }

    // Meal patterns
    const spikeMeals = recentMeals.filter(m => m.glucose_impact === "spike");
    if (spikeMeals.length >= 2) {
      factors.push({
        type: "meal",
        label: `${spikeMeals.length} spike meals`,
        impact: "negative",
        description: "Recent high-carb meals may cause glucose spikes",
      });
    }

    // Medication adherence
    if (recentMeds.length > 0) {
      factors.push({
        type: "medication",
        label: "Medication taken",
        impact: "positive",
        description: "Regular medication helps maintain stable levels",
      });
    }

    // Time-based risk (nighttime often has higher hypo risk)
    const hour = new Date().getHours();
    if (hour >= 22 || hour <= 6) {
      factors.push({
        type: "time",
        label: "Night hours",
        impact: "negative",
        description: "Hypoglycemia risk is elevated during sleep",
      });
    }

    // Calculate confidence based on data availability
    const confidence = Math.min(100, Math.round(
      (glucoseValues.length / 30) * 40 + // More data = higher confidence
      (recentMeals.length / 5) * 20 +
      (recentActivities.length / 3) * 20 +
      (recentMeds.length > 0 ? 20 : 0)
    ));

    return {
      lbgi,
      riskLevel,
      predictedGlucose: futureValues[futureValues.length - 1] || lastValue,
      futureValues,
      trend,
      confidence,
      factors,
      lastUpdated: Date.now(),
    };
  }, [glucoseEntries, mealEntries, activityEntries, medicationEntries]);

  return (
    <HealthDataContext.Provider
      value={{
        glucoseEntries,
        mealEntries,
        activityEntries,
        medicationEntries,
        addGlucoseEntry,
        addMealEntry,
        addActivityEntry,
        addMedicationEntry,
        riskPrediction,
        getRecentGlucoseValues,
        getTodayEntries,
      }}
    >
      {children}
    </HealthDataContext.Provider>
  );
}
