"use client";

import { useState } from "react";
import { useHealthData } from "@/contexts/health-data-context";
import { 
  Activity, TrendingDown, TrendingUp, Minus, Clock, Utensils, Pill, 
  AlertTriangle, Shield, ShieldAlert, ShieldCheck, Plus, Check,
  ChevronDown, ChevronUp, Info
} from "lucide-react";

const RISK_CONFIG = {
  LOW: {
    color: "#10B981",
    bgColor: "rgba(16, 185, 129, 0.08)",
    borderColor: "rgba(16, 185, 129, 0.25)",
    label: "Low Risk",
    icon: ShieldCheck,
    description: "Your hypoglycemia risk is currently low based on recent patterns.",
  },
  MEDIUM: {
    color: "#F59E0B",
    bgColor: "rgba(245, 158, 11, 0.08)",
    borderColor: "rgba(245, 158, 11, 0.25)",
    label: "Moderate Risk",
    icon: Shield,
    description: "Monitor your glucose levels more closely. Some risk factors detected.",
  },
  HIGH: {
    color: "#E53E3E",
    bgColor: "rgba(229, 62, 62, 0.08)",
    borderColor: "rgba(229, 62, 62, 0.25)",
    label: "High Risk",
    icon: ShieldAlert,
    description: "Take preventive action. Consider having a snack and checking glucose.",
  },
};

const FACTOR_ICONS = {
  meal: Utensils,
  activity: Activity,
  medication: Pill,
  pattern: TrendingDown,
  time: Clock,
};

const IMPACT_COLORS = {
  positive: "#10B981",
  negative: "#E53E3E",
  neutral: "#6B7280",
};

type TimeSlot = "Morning" | "Afternoon" | "Night";

export default function AutoRiskPrediction({ compact = false }: { compact?: boolean }) {
  const { riskPrediction, glucoseEntries, addGlucoseEntry } = useHealthData();
  const [showLogForm, setShowLogForm] = useState(false);
  const [showFactors, setShowFactors] = useState(false);
  const [showHowItWorks, setShowHowItWorks] = useState(false);
  const [glucoseValue, setGlucoseValue] = useState("");
  const [timeSlot, setTimeSlot] = useState<TimeSlot>("Morning");
  const [logSuccess, setLogSuccess] = useState(false);
  
  const { lbgi, riskLevel, predictedGlucose, trend, confidence, factors, lastUpdated } = riskPrediction;
  const config = RISK_CONFIG[riskLevel];
  const RiskIcon = config.icon;

  // Get latest glucose with timestamp info
  const sortedEntries = [...glucoseEntries].sort((a, b) => {
    const dateCompare = b.date.localeCompare(a.date);
    if (dateCompare !== 0) return dateCompare;
    const timeOrder = { Morning: 0, Afternoon: 1, Night: 2 };
    return timeOrder[b.time] - timeOrder[a.time];
  });
  const latestEntry = sortedEntries[0];
  const latestGlucose = latestEntry?.glucose;

  // Format last logged time
  const formatLastLogged = () => {
    if (!latestEntry) return "No readings yet";
    const entryDate = new Date(latestEntry.date);
    const today = new Date();
    const isToday = entryDate.toDateString() === today.toDateString();
    const yesterday = new Date(today);
    yesterday.setDate(yesterday.getDate() - 1);
    const isYesterday = entryDate.toDateString() === yesterday.toDateString();
    
    if (isToday) return `Today, ${latestEntry.time}`;
    if (isYesterday) return `Yesterday, ${latestEntry.time}`;
    return `${entryDate.toLocaleDateString("en-GB", { day: "numeric", month: "short" })}, ${latestEntry.time}`;
  };

  const TrendIcon = trend > 2 ? TrendingUp : trend < -2 ? TrendingDown : Minus;
  const trendColor = trend > 2 ? "#E53E3E" : trend < -2 ? "#10B981" : "#6B7280";

  const handleLogGlucose = () => {
    const value = parseFloat(glucoseValue);
    if (!isNaN(value) && value > 0) {
      const today = new Date().toISOString().split("T")[0];
      addGlucoseEntry({
        date: today,
        time: timeSlot,
        glucose: value,
      });
      setGlucoseValue("");
      setLogSuccess(true);
      setTimeout(() => {
        setLogSuccess(false);
        setShowLogForm(false);
      }, 1500);
    }
  };

  if (compact) {
    return (
      <div 
        className="rounded-2xl border p-4 shadow-sm"
        style={{ backgroundColor: config.bgColor, borderColor: config.borderColor }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="w-12 h-12 rounded-xl flex items-center justify-center"
            style={{ backgroundColor: `${config.color}15` }}
          >
            <RiskIcon size={24} style={{ color: config.color }} />
          </div>
          <div className="flex-1">
            <div className="flex items-center gap-2">
              <span className="font-bold text-lg" style={{ color: config.color }}>
                {config.label}
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-0.5">
              LBGI: {lbgi.toFixed(2)} | {glucoseEntries.length} readings
            </p>
          </div>
          <div className="text-right">
            <div className="flex items-center gap-1">
              <span className="text-2xl font-extrabold font-mono text-foreground">
                {predictedGlucose}
              </span>
              <TrendIcon size={18} style={{ color: trendColor }} />
            </div>
            <span className="text-xs text-muted-foreground">in 2h</span>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Main Risk Assessment Card */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        {/* Risk Status Header */}
        <div 
          className="p-5 border-b"
          style={{ backgroundColor: config.bgColor, borderColor: config.borderColor }}
        >
          <div className="flex items-center gap-4">
            <div 
              className="w-14 h-14 rounded-2xl flex items-center justify-center"
              style={{ backgroundColor: config.color }}
            >
              <RiskIcon size={28} className="text-white" />
            </div>
            <div className="flex-1">
              <div className="flex items-center gap-3">
                <h2 className="font-bold text-xl" style={{ color: config.color }}>
                  {config.label}
                </h2>
                <span 
                  className="px-2 py-0.5 rounded-full text-xs font-mono"
                  style={{ backgroundColor: `${config.color}15`, color: config.color }}
                >
                  {confidence}% conf.
                </span>
              </div>
              <p className="text-sm text-muted-foreground mt-1">
                Hypoglycemia Risk Assessment
              </p>
            </div>
          </div>
          <p className="text-sm text-muted-foreground mt-4 leading-relaxed">
            {config.description}
          </p>
        </div>

        {/* LBGI Score Section */}
        <div className="p-5 border-b border-border">
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
              LBGI Score
            </h3>
            <span className="text-xs text-muted-foreground font-mono">Kovatchev Formula</span>
          </div>
          
          <div className="flex items-center gap-6">
            <span 
              className="text-5xl font-extrabold font-mono"
              style={{ color: config.color }}
            >
              {lbgi.toFixed(2)}
            </span>
            
            {/* Visual Scale */}
            <div className="flex-1">
              <div className="flex h-3 rounded-full overflow-hidden bg-muted">
                <div className="bg-green-500 flex-1" />
                <div className="bg-yellow-500 flex-1" />
                <div className="bg-red-500 flex-1" />
              </div>
              <div className="flex justify-between mt-1.5 text-xs font-mono text-muted-foreground">
                <span>0</span>
                <span>1.1</span>
                <span>2.5</span>
                <span>5+</span>
              </div>
              {/* Indicator */}
              <div 
                className="relative -mt-6"
                style={{ 
                  marginLeft: `${Math.min(95, Math.max(5, (lbgi / 5) * 100))}%`,
                  transform: "translateX(-50%)"
                }}
              >
                <div 
                  className="w-0 h-0 border-l-[6px] border-r-[6px] border-t-[8px] border-l-transparent border-r-transparent"
                  style={{ borderTopColor: config.color }}
                />
              </div>
            </div>
          </div>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-3 divide-x divide-border">
          <div className="p-4 text-center">
            <span className="text-xs text-muted-foreground block mb-1">Current</span>
            <span className="text-2xl font-bold font-mono text-foreground">
              {latestGlucose || "—"}
            </span>
            <span className="text-xs text-muted-foreground block">mg/dL</span>
          </div>
          <div className="p-4 text-center">
            <span className="text-xs text-muted-foreground block mb-1">Predicted (2h)</span>
            <span 
              className="text-2xl font-bold font-mono"
              style={{ color: config.color }}
            >
              {predictedGlucose}
            </span>
            <span className="text-xs text-muted-foreground block">mg/dL</span>
          </div>
          <div className="p-4 text-center">
            <span className="text-xs text-muted-foreground block mb-1">Trend</span>
            <div className="flex items-center justify-center gap-1">
              <TrendIcon size={18} style={{ color: trendColor }} />
              <span 
                className="text-2xl font-bold font-mono"
                style={{ color: trendColor }}
              >
                {trend > 0 ? "+" : ""}{trend.toFixed(1)}
              </span>
            </div>
            <span className="text-xs text-muted-foreground block">mg/dL/hr</span>
          </div>
        </div>

        {/* Last Logged */}
        <div className="px-5 py-3 bg-muted/30 border-t border-border flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs text-muted-foreground">
            <Clock size={12} />
            <span>Last reading: <strong className="text-foreground">{formatLastLogged()}</strong></span>
          </div>
          <span className="text-xs text-muted-foreground font-mono">
            Updated {new Date(lastUpdated).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit" })}
          </span>
        </div>
      </div>

      {/* Quick Log Glucose */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <button
          onClick={() => setShowLogForm(!showLogForm)}
          className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Plus size={20} className="text-primary" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-sm text-foreground block">Log Glucose Reading</span>
              <span className="text-xs text-muted-foreground">Add a new reading to improve predictions</span>
            </div>
          </div>
          {showLogForm ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </button>

        {showLogForm && (
          <div className="p-4 pt-0 border-t border-border mt-0">
            <div className="flex gap-3 mt-4">
              <div className="flex-1">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Glucose (mg/dL)
                </label>
                <input
                  type="number"
                  value={glucoseValue}
                  onChange={(e) => setGlucoseValue(e.target.value)}
                  placeholder="e.g. 105"
                  className="w-full bg-muted border border-border rounded-xl px-4 py-2.5 text-foreground text-lg font-mono outline-none focus:border-primary/50 transition-colors"
                />
              </div>
              <div className="w-32">
                <label className="text-xs font-mono text-muted-foreground uppercase tracking-wider block mb-1.5">
                  Time
                </label>
                <select
                  value={timeSlot}
                  onChange={(e) => setTimeSlot(e.target.value as TimeSlot)}
                  className="w-full bg-muted border border-border rounded-xl px-3 py-2.5 text-foreground text-sm outline-none focus:border-primary/50 transition-colors"
                >
                  <option value="Morning">Morning</option>
                  <option value="Afternoon">Afternoon</option>
                  <option value="Night">Night</option>
                </select>
              </div>
            </div>
            <button
              onClick={handleLogGlucose}
              disabled={!glucoseValue || logSuccess}
              className="w-full mt-3 py-2.5 rounded-xl font-semibold text-sm flex items-center justify-center gap-2 transition-all disabled:opacity-50"
              style={{ 
                backgroundColor: logSuccess ? "#10B981" : "var(--primary)", 
                color: "var(--primary-foreground)" 
              }}
            >
              {logSuccess ? (
                <>
                  <Check size={16} />
                  Logged Successfully
                </>
              ) : (
                <>
                  <Plus size={16} />
                  Add Reading
                </>
              )}
            </button>
          </div>
        )}
      </div>

      {/* Risk Factors - Collapsible */}
      {factors.length > 0 && (
        <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
          <button
            onClick={() => setShowFactors(!showFactors)}
            className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-yellow-500/10 flex items-center justify-center">
                <AlertTriangle size={18} className="text-yellow-600" />
              </div>
              <div className="text-left">
                <span className="font-semibold text-sm text-foreground block">
                  {factors.length} Risk Factors Detected
                </span>
                <span className="text-xs text-muted-foreground">
                  {factors.filter(f => f.impact === "negative").length} negative, {factors.filter(f => f.impact === "positive").length} positive
                </span>
              </div>
            </div>
            {showFactors ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
          </button>

          {showFactors && (
            <div className="p-4 pt-0 border-t border-border">
              <div className="flex flex-col gap-2 mt-4">
                {factors.map((factor, index) => {
                  const FactorIcon = FACTOR_ICONS[factor.type] || Activity;
                  const impactColor = IMPACT_COLORS[factor.impact];
                  
                  return (
                    <div 
                      key={index}
                      className="flex items-center gap-3 rounded-xl px-4 py-3 bg-muted/30"
                    >
                      <div 
                        className="w-8 h-8 rounded-lg flex items-center justify-center flex-shrink-0"
                        style={{ backgroundColor: `${impactColor}12` }}
                      >
                        <FactorIcon size={14} style={{ color: impactColor }} />
                      </div>
                      <div className="flex-1 min-w-0">
                        <span className="text-sm font-medium text-foreground block truncate">
                          {factor.label}
                        </span>
                        <span className="text-xs text-muted-foreground truncate block">
                          {factor.description}
                        </span>
                      </div>
                      <span 
                        className="text-xs font-semibold px-2 py-1 rounded-full flex-shrink-0"
                        style={{ backgroundColor: `${impactColor}12`, color: impactColor }}
                      >
                        {factor.impact === "positive" ? "+" : factor.impact === "negative" ? "-" : "~"}
                      </span>
                    </div>
                  );
                })}
              </div>
            </div>
          )}
        </div>
      )}

      {/* How It Works - Collapsible */}
      <div className="bg-card rounded-2xl border border-border shadow-sm overflow-hidden">
        <button
          onClick={() => setShowHowItWorks(!showHowItWorks)}
          className="w-full p-4 flex items-center justify-between hover:bg-muted/30 transition-colors"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
              <Info size={18} className="text-primary" />
            </div>
            <div className="text-left">
              <span className="font-semibold text-sm text-foreground block">How Risk is Calculated</span>
              <span className="text-xs text-muted-foreground">LBGI formula and data sources</span>
            </div>
          </div>
          {showHowItWorks ? <ChevronUp size={18} className="text-muted-foreground" /> : <ChevronDown size={18} className="text-muted-foreground" />}
        </button>

        {showHowItWorks && (
          <div className="p-4 pt-0 border-t border-border">
            <div className="mt-4 space-y-4">
              {/* Formula */}
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="font-semibold text-sm text-foreground mb-2">LBGI Formula (Kovatchev)</h4>
                <div className="font-mono text-sm text-muted-foreground space-y-1">
                  <p>1. Transform each glucose: <span className="text-foreground">f(G) = 1.509 × [ln(G)<sup>1.084</sup> - 5.381]</span></p>
                  <p>2. If f(G) {"<"} 0, it contributes to hypoglycemia risk</p>
                  <p>3. LBGI = mean of <span className="text-foreground">10 × f(G)²</span> for all f(G) {"<"} 0</p>
                </div>
              </div>

              {/* Thresholds */}
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="font-semibold text-sm text-foreground mb-2">Risk Thresholds</h4>
                <div className="flex gap-3">
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-green-500" />
                    <span className="text-sm text-muted-foreground">{"<"} 1.1 = Low</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-yellow-500" />
                    <span className="text-sm text-muted-foreground">1.1 - 2.5 = Moderate</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="w-3 h-3 rounded-full bg-red-500" />
                    <span className="text-sm text-muted-foreground">{">"} 2.5 = High</span>
                  </div>
                </div>
              </div>

              {/* Data Sources */}
              <div className="bg-muted/30 rounded-xl p-4">
                <h4 className="font-semibold text-sm text-foreground mb-2">Data Used for Prediction</h4>
                <ul className="text-sm text-muted-foreground space-y-1">
                  <li className="flex items-center gap-2">
                    <Activity size={12} className="text-primary" />
                    <span><strong className="text-foreground">{glucoseEntries.length}</strong> glucose readings from past 7 days</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Utensils size={12} className="text-accent" />
                    <span>Meal logs with carb content and glucose impact</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <TrendingUp size={12} className="text-green-500" />
                    <span>Activity level and exercise duration</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Pill size={12} className="text-purple-500" />
                    <span>Medication timing and adherence</span>
                  </li>
                  <li className="flex items-center gap-2">
                    <Clock size={12} className="text-muted-foreground" />
                    <span>Time of day patterns (higher risk at night)</span>
                  </li>
                </ul>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
