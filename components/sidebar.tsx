"use client";

import { LayoutDashboard, Utensils, BookOpen, Lightbulb, UploadCloud, AlertTriangle, X } from "lucide-react";

export type NavTab = "dashboard" | "diet" | "story" | "insights" | "reports";

const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard",    icon: LayoutDashboard },
  { id: "diet",      label: "Diet Log",     icon: Utensils },
  { id: "story",     label: "Weekly Story", icon: BookOpen },
  { id: "insights",  label: "Insights",     icon: Lightbulb },
  { id: "reports",   label: "Upload Report",icon: UploadCloud },
];

/* ── Inline SVG illustration: pill capsule — bold block style ── */
function PillIllustration() {
  return (
    <svg width="68" height="30" viewBox="0 0 68 30" fill="none" className="bob">
      {/* warm yellow block half */}
      <rect x="0" y="0" width="34" height="30" rx="15" fill="#FFF3A3" opacity="0.95"/>
      {/* cool blue block half */}
      <rect x="34" y="0" width="34" height="30" rx="15" fill="#B0E0E6" opacity="0.95"/>
      {/* top highlight arc */}
      <path d="M10 10 Q34 4 58 10" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
      {/* center divider */}
      <line x1="34" y1="3" x2="34" y2="27" stroke="white" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  );
}

/* ── Alert banner ── */
export function GlobalAlert({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="pulse-high fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-sm">
      <div className="bg-destructive text-destructive-foreground rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl">
        <AlertTriangle size={16} className="flex-shrink-0" />
        <p className="text-sm font-bold flex-1 whitespace-nowrap">High risk in 30 minutes</p>
        <button onClick={onDismiss} className="opacity-70 hover:opacity-100 transition-opacity">
          <X size={14} />
        </button>
      </div>
    </div>
  );
}

export default function Sidebar({
  active,
  onNav,
}: {
  active: NavTab;
  onNav: (t: NavTab) => void;
}) {
  return (
    <aside
      className="flex flex-col h-screen w-60 shrink-0 sticky top-0"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Brand */}
      <div className="px-6 pt-8 pb-6 flex items-center gap-3">
        <PillIllustration />
        <span className="font-bold text-lg tracking-tight" style={{ color: "var(--sidebar-fg)" }}>
          GlycoCare
        </span>
      </div>

      {/* Patient chip */}
      <div className="mx-4 mb-6 rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.08)" }}>
        <p className="text-xs font-mono opacity-60" style={{ color: "var(--sidebar-fg)" }}>Patient</p>
        <p className="font-bold text-sm mt-0.5" style={{ color: "var(--sidebar-fg)" }}>Hamsini R.</p>
        <div className="flex items-center gap-1.5 mt-1">
          <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
          <span className="text-xs opacity-60 font-mono" style={{ color: "var(--sidebar-fg)" }}>Monitoring live</span>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold transition-all text-left"
              style={
                isActive
                  ? { background: "var(--sidebar-active)", color: "var(--sidebar-active-fg)" }
                  : { color: "var(--sidebar-fg)", opacity: 0.75 }
              }
            >
              <Icon size={18} strokeWidth={isActive ? 2.5 : 1.8} />
              {label}
            </button>
          );
        })}
      </nav>

      {/* Footer */}
      <div className="px-6 py-6">
        <p className="text-xs font-mono opacity-40" style={{ color: "var(--sidebar-fg)" }}>
          v2.1 · AI-powered
        </p>
      </div>
    </aside>
  );
}
