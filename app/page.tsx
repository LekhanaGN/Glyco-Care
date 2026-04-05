"use client";

import { useState, useEffect } from "react";
import { X, AlertTriangle } from "lucide-react";
import Sidebar, { type NavTab } from "@/components/sidebar";
import DashboardScreen from "@/components/dashboard-screen";
import DietScreen from "@/components/diet-screen";
import StoryScreen from "@/components/story-screen";
import InsightsScreen from "@/components/insights-screen";
import UploadScreen from "@/components/upload-screen";

function GlobalAlert({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="pulse-high fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div
        className="flex items-center gap-3 rounded-2xl px-5 py-3 shadow-xl"
        style={{ background: "#E53E3E", color: "#fff" }}
      >
        <AlertTriangle size={15} className="flex-shrink-0" />
        <p className="text-sm font-bold whitespace-nowrap">High risk in 30 minutes — consider eating a snack</p>
        <button onClick={onDismiss} className="opacity-70 hover:opacity-100 transition-opacity ml-2">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

const screens: Record<NavTab, React.ReactNode> = {
  dashboard: <DashboardScreen />,
  diet:      <DietScreen />,
  story:     <StoryScreen />,
  insights:  <InsightsScreen />,
  reports:   <UploadScreen />,
};

export default function GlycoCareApp() {
  const [tab, setTab] = useState<NavTab>("dashboard");
  const [alert, setAlert] = useState(true);

  useEffect(() => {
    if (tab === "dashboard") setAlert(true);
  }, [tab]);

  return (
    <div className="flex min-h-screen w-full overflow-hidden" style={{ background: "var(--background)" }}>
      {/* Sidebar */}
      <Sidebar active={tab} onNav={setTab} />

      {/* Main content */}
      <main className="flex-1 overflow-y-auto min-h-screen">
        {/* Top bar */}
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 border-b border-border backdrop-blur-sm"
          style={{ background: "rgba(255,248,214,0.92)" }}
        >
          <div className="flex items-center gap-3">
            <h2 className="font-bold text-foreground capitalize tracking-tight">{tab}</h2>
            <span className="text-xs font-mono text-muted-foreground">
              {new Date().toLocaleDateString("en-GB", { weekday: "long", day: "numeric", month: "long" })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            {/* Live indicator */}
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground">Monitoring live</span>
            </div>
            {/* Avatar */}
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              HR
            </div>
          </div>
        </header>

        {/* Page content */}
        <div className="px-8 py-7 max-w-7xl mx-auto">
          {screens[tab]}
        </div>
      </main>

      {/* Global alert */}
      {alert && tab === "dashboard" && (
        <GlobalAlert onDismiss={() => setAlert(false)} />
      )}
    </div>
  );
}
