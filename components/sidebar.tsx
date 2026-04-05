"use client";

import Image from "next/image";
import { LayoutDashboard, Utensils, BookOpen, UploadCloud, TableProperties, AlertTriangle, X, Zap, Activity, Menu } from "lucide-react";

export type NavTab = "dashboard" | "diet" | "story" | "reports" | "glucoselog" | "prediction" | "lifestyle";

const navItems: { id: NavTab; label: string; icon: React.ElementType }[] = [
  { id: "dashboard",  label: "Dashboard",     icon: LayoutDashboard },
  { id: "prediction", label: "AI Prediction", icon: Zap },
  { id: "diet",       label: "Diet Log",      icon: Utensils },
  { id: "lifestyle",  label: "Lifestyle",     icon: Activity },
  { id: "story",      label: "Weekly Story",  icon: BookOpen },
  { id: "glucoselog", label: "Glucose Log",   icon: TableProperties },
  { id: "reports",    label: "Upload Report", icon: UploadCloud },
];

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

export function HamburgerButton({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="p-2 rounded-lg hover:bg-black/5 transition-colors"
      aria-label="Open menu"
    >
      <Menu size={24} className="text-foreground" />
    </button>
  );
}

export default function Sidebar({
  active,
  onNav,
  isOpen,
  onClose,
}: {
  active: NavTab;
  onNav: (t: NavTab) => void;
  isOpen: boolean;
  onClose: () => void;
}) {
  const handleNavClick = (id: NavTab) => {
    onNav(id);
    onClose();
  };

  return (
    <>
      {/* Backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 z-40 transition-opacity"
          onClick={onClose}
        />
      )}

      {/* Sidebar drawer */}
      <aside
        className={`fixed top-0 left-0 h-screen w-64 z-50 flex flex-col transform transition-transform duration-300 ease-in-out ${
          isOpen ? "translate-x-0" : "-translate-x-full"
        }`}
        style={{ background: "var(--sidebar-bg)" }}
      >
        {/* Header with close button */}
        <div className="px-4 pt-4 pb-2 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0 bg-white">
              <Image
                src="/images/glycocare-logo.jpeg"
                alt="GlycoCare"
                width={40}
                height={40}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <span className="font-bold text-lg tracking-tight" style={{ color: "var(--sidebar-fg)" }}>
              GlycoCare
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-2 rounded-lg hover:bg-white/10 transition-colors"
            aria-label="Close menu"
          >
            <X size={20} style={{ color: "var(--sidebar-fg)" }} />
          </button>
        </div>

        {/* Patient chip */}
        <div className="mx-4 mb-4 mt-2 rounded-xl px-4 py-3" style={{ background: "rgba(255,255,255,0.08)" }}>
          <p className="text-xs font-mono opacity-60" style={{ color: "var(--sidebar-fg)" }}>Patient</p>
          <p className="font-bold text-sm mt-0.5" style={{ color: "var(--sidebar-fg)" }}>Hamsini R.</p>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="w-1.5 h-1.5 rounded-full bg-green-400 animate-pulse" />
            <span className="text-xs opacity-60 font-mono" style={{ color: "var(--sidebar-fg)" }}>Monitoring live</span>
          </div>
        </div>

        {/* Nav */}
        <nav className="flex flex-col gap-1 px-3 flex-1 overflow-y-auto">
          {navItems.map(({ id, label, icon: Icon }) => {
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => handleNavClick(id)}
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
        <div className="px-6 py-4">
          <p className="text-xs font-mono opacity-40" style={{ color: "var(--sidebar-fg)" }}>
            v2.1 · AI-powered
          </p>
        </div>
      </aside>
    </>
  );
}
