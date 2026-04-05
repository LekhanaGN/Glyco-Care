'use client';

import { useMemo } from 'react';
import PredictionChart from './prediction-chart';
import ConfidenceMeter from './confidence-meter';
import AIChat from './ai-chat';
import AlertBanner from './alert-banner';
import AutoRiskPrediction from './auto-risk-prediction';
import { useHealthData } from '@/contexts/health-data-context';
import { Activity, Utensils, TrendingUp, Pill, Brain } from 'lucide-react';
import type { RiskLevel } from '@/lib/utils';

export type { RiskLevel };

export default function PredictionScreen() {
  // Get all data from context - prediction is calculated automatically
  const { 
    glucoseEntries, 
    mealEntries, 
    activityEntries, 
    medicationEntries,
    riskPrediction 
  } = useHealthData();

  const { riskLevel, predictedGlucose, futureValues } = riskPrediction;

  // Build chart data from stored glucose entries
  const chartData = useMemo(() => {
    if (glucoseEntries.length === 0) return [];

    // Sort entries by date and time
    const sorted = [...glucoseEntries].sort((a, b) => {
      const dateCompare = a.date.localeCompare(b.date);
      if (dateCompare !== 0) return dateCompare;
      const timeOrder = { Morning: 0, Afternoon: 1, Night: 2 };
      return timeOrder[a.time] - timeOrder[b.time];
    });

    // Take last 16 readings for the chart
    const recent = sorted.slice(-16);
    const now = Date.now();
    const step = 10 * 60 * 1000; // 10 minutes

    // Map past readings
    const pastData = recent.map((entry, i) => ({
      time: new Date(now - (recent.length - i) * step).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      glucose: entry.glucose,
      past: entry.glucose,
      pred: undefined as number | undefined,
      isPast: true,
    }));

    // Map predicted future values
    const futureData = futureValues.map((v, i) => ({
      time: new Date(now + (i + 1) * step).toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
      }),
      glucose: v,
      past: undefined as number | undefined,
      pred: v,
      isPast: false,
    }));

    return [...pastData, ...futureData];
  }, [glucoseEntries, futureValues]);

  const showAlert = riskLevel === 'HIGH' && predictedGlucose < 70;

  return (
    <div className="flex flex-col gap-6">
      {/* Header */}
      <div>
        <div className="flex items-center gap-2 mb-1">
          <Brain size={16} className="text-primary" />
          <p className="text-xs font-mono uppercase tracking-widest text-primary">
            AI-Powered Analysis
          </p>
        </div>
        <h1 className="text-2xl font-bold text-foreground">
          Hypoglycemia Risk Prediction
        </h1>
        <p className="text-sm text-muted-foreground mt-1">
          Risk calculated automatically from your logged glucose, meals, activities, and medications.
        </p>
      </div>

      {/* Alert Banner */}
      {showAlert && (
        <AlertBanner
          message={`High risk detected — predicted glucose of ${predictedGlucose} mg/dL based on your current patterns`}
          onDismiss={() => {}}
        />
      )}

      {/* Main content grid */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5">
        {/* Left column: Chart + Data Summary */}
        <div className="lg:col-span-3 flex flex-col gap-5">
          {/* Chart */}
          {chartData.length > 0 ? (
            <PredictionChart data={chartData} />
          ) : (
            <div className="bg-card rounded-2xl border border-border p-12 text-center">
              <Activity size={32} className="text-muted-foreground mx-auto mb-3 opacity-50" />
              <p className="text-sm text-muted-foreground">
                No glucose data available. Add readings from the Dashboard or Glucose Log.
              </p>
            </div>
          )}

          {/* Data Sources Summary */}
          <div className="bg-card rounded-2xl border border-border p-5 shadow-sm">
            <h3 className="font-bold text-sm text-foreground mb-4">
              Data Sources Contributing to Prediction
            </h3>
            
            <div className="grid grid-cols-4 gap-3">
              <div className="bg-muted/40 rounded-xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Activity size={18} className="text-primary" />
                </div>
                <span className="text-2xl font-extrabold font-mono text-foreground block">
                  {glucoseEntries.length}
                </span>
                <span className="text-xs text-muted-foreground">Glucose</span>
              </div>

              <div className="bg-muted/40 rounded-xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-accent/10 flex items-center justify-center mx-auto mb-2">
                  <Utensils size={18} className="text-accent" />
                </div>
                <span className="text-2xl font-extrabold font-mono text-foreground block">
                  {mealEntries.length}
                </span>
                <span className="text-xs text-muted-foreground">Meals</span>
              </div>

              <div className="bg-muted/40 rounded-xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-green-500/10 flex items-center justify-center mx-auto mb-2">
                  <TrendingUp size={18} className="text-green-500" />
                </div>
                <span className="text-2xl font-extrabold font-mono text-foreground block">
                  {activityEntries.length}
                </span>
                <span className="text-xs text-muted-foreground">Activities</span>
              </div>

              <div className="bg-muted/40 rounded-xl p-4 text-center">
                <div className="w-10 h-10 rounded-full bg-purple-500/10 flex items-center justify-center mx-auto mb-2">
                  <Pill size={18} className="text-purple-500" />
                </div>
                <span className="text-2xl font-extrabold font-mono text-foreground block">
                  {medicationEntries.length}
                </span>
                <span className="text-xs text-muted-foreground">Medications</span>
              </div>
            </div>
          </div>

          {/* Confidence Meter */}
          <ConfidenceMeter readingsCount={glucoseEntries.length} />
        </div>

        {/* Right column: Risk Prediction + Chat */}
        <div className="lg:col-span-2 flex flex-col gap-5">
          {/* Auto Risk Prediction - includes logging, factors, and explanation */}
          <AutoRiskPrediction />

          {/* Chat */}
          <AIChat riskLevel={riskLevel} />
        </div>
      </div>
    </div>
  );
}
