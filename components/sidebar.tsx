"use client";

import {
  LayoutDashboard,
  Utensils,
  BookOpen,
  Lightbulb,
  UploadCloud,
  ClipboardList, // ✅ added icon for glucose log
  AlertTriangle,
  X,
} from "lucide-react";

/* ✅ FIX: added "glucoselog" */
export type NavTab =
  | "dashboard"
  | "diet"
  | "story"
  | "insights"
  | "glucoselog"
  | "reports";

/* ✅ FIX: added glucose log tab */
const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard", label: "Dashboard",     icon: LayoutDashboard },
  { id: "diet",      label: "Diet Log",      icon: Utensils },
  { id: "glucoselog",label: "Glucose Log",   icon: ClipboardList }, // ✅ NEW
  { id: "story",     label: "Weekly Story",  icon: BookOpen },
  { id: "insights",  label: "Insights",      icon: Lightbulb },
  { id: "reports",   label: "Upload Report", icon: UploadCloud },
];

/* ── Pill illustration ── */
function PillIllustration() {
  return (
    <svg width="68" height="30" viewBox="0 0 68 30" fill="none">
      <rect x="0" y="0" width="34" height="30" rx="15" fill="#FFF3A3" opacity="0.95"/>
      <rect x="34" y="0" width="34" height="30" rx="15" fill="#B0E0E6" opacity="0.95"/>
      <path d="M10 10 Q34 4 58 10" stroke="white" strokeWidth="2" fill="none" strokeLinecap="round" opacity="0.5"/>
      <line x1="34" y1="3" x2="34" y2="27" stroke="white" strokeWidth="1.5" opacity="0.6"/>
    </svg>
  );
}

/* ── Alert ── */
export function GlobalAlert({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="pulse-high fixed top-4 left-1/2 -translate-x-1/2 z-50 w-auto max-w-sm">
      <div className="bg-destructive text-destructive-foreground rounded-2xl px-5 py-3 flex items-center gap-3 shadow-xl">
        <AlertTriangle size={16} />
        <p className="text-sm font-bold flex-1 whitespace-nowrap">
          High risk in 30 minutes
        </p>
        <button onClick={onDismiss}>
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
    <aside className="flex flex-col h-screen w-60 sticky top-0"
      style={{ background: "var(--sidebar-bg)" }}
    >
      {/* Brand */}
      <div className="px-6 pt-8 pb-6 flex items-center gap-3">
        <PillIllustration />
        <span className="font-bold text-lg">GlycoCare</span>
      </div>

      {/* Nav */}
      <nav className="flex flex-col gap-1 px-3 flex-1">
        {navItems.map(({ id, label, icon: Icon }) => {
          const isActive = active === id;

          return (
            <button
              key={id}
              onClick={() => onNav(id)}
              className="flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-semibold"
              style={
                isActive
                  ? { background: "var(--sidebar-active)", color: "var(--sidebar-active-fg)" }
                  : { opacity: 0.7 }
              }
            >
              <Icon size={18} />
              {label}
            </button>
          );
        })}
      </nav>
    </aside>
  );
}