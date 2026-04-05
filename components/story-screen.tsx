"use client";

import { useState } from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";

/* ── Inline story illustrations — bold color-block style ── */
function IllustrationRisk() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="bob">
      {/* bold blue background block */}
      <rect x="5" y="5" width="100" height="100" rx="24" fill="#0F4D92" opacity="0.12"/>
      {/* yellow warning block */}
      <rect x="22" y="40" width="66" height="46" rx="14" fill="#FFF3A3" opacity="0.9"/>
      {/* blue top block */}
      <rect x="22" y="22" width="66" height="30" rx="14" fill="#0F4D92" opacity="0.85"/>
      {/* triangle icon */}
      <polygon points="55,28 66,44 44,44" fill="white" opacity="0.9"/>
      <rect x="53" y="32" width="4" height="7" rx="2" fill="#0F4D92"/>
      <circle cx="55" cy="42" r="1.8" fill="#0F4D92"/>
      {/* lightning bolts bottom */}
      <path d="M32 72 L39 58 L35 58 L42 46" stroke="#0F4D92" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
      <path d="M68 72 L75 58 L71 58 L78 46" stroke="#0F4D92" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.5"/>
    </svg>
  );
}
function IllustrationEvening() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="bob">
      {/* sky blue background block */}
      <rect x="5" y="5" width="100" height="100" rx="24" fill="#B0E0E6" opacity="0.6"/>
      {/* dark navy block (night sky) */}
      <rect x="18" y="18" width="74" height="74" rx="18" fill="#0F4D92" opacity="0.85"/>
      {/* moon shape */}
      <path d="M65 35 A22 22 0 1 1 42 76 A16 16 0 0 0 65 35Z" fill="#FFF3A3" opacity="0.9"/>
      {/* stars */}
      <circle cx="30" cy="32" r="3" fill="white" opacity="0.7"/>
      <circle cx="82" cy="45" r="2" fill="white" opacity="0.5"/>
      <circle cx="28" cy="62" r="2" fill="white" opacity="0.5"/>
      {/* dipping graph line */}
      <polyline points="20,82 34,80 48,76 62,68 76,58 88,72"
        stroke="#B0E0E6" strokeWidth="3" strokeLinecap="round" fill="none"/>
    </svg>
  );
}
function IllustrationStable() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="bob">
      {/* pastel yellow block */}
      <rect x="5" y="5" width="100" height="100" rx="24" fill="#FFF3A3" opacity="0.8"/>
      {/* blue circle card */}
      <circle cx="55" cy="55" r="38" fill="#0F4D92" opacity="0.12"/>
      <circle cx="55" cy="55" r="28" fill="#0F4D92" opacity="0.85"/>
      {/* white check */}
      <path d="M42 55 L51 64 L68 42" stroke="white" strokeWidth="4" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
      {/* orbit dots */}
      {[0,60,120,180,240,300].map((deg,i) => (
        <circle key={i}
          cx={55 + 42 * Math.cos(deg * Math.PI / 180)}
          cy={55 + 42 * Math.sin(deg * Math.PI / 180)}
          r="3.5" fill="#B0E0E6" opacity="0.7"/>
      ))}
    </svg>
  );
}
function IllustrationImproved() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="bob">
      {/* blue top block */}
      <rect x="5" y="5" width="100" height="52" rx="22" fill="#0F4D92" opacity="0.85"/>
      {/* yellow bottom block */}
      <rect x="5" y="53" width="100" height="52" rx="22" fill="#FFF3A3" opacity="0.9"/>
      {/* rising bars */}
      <rect x="18" y="68" width="12" height="26" rx="5" fill="#0F4D92" opacity="0.4"/>
      <rect x="34" y="60" width="12" height="34" rx="5" fill="#0F4D92" opacity="0.55"/>
      <rect x="50" y="50" width="12" height="44" rx="5" fill="#0F4D92" opacity="0.7"/>
      <rect x="66" y="40" width="12" height="54" rx="5" fill="#0F4D92" opacity="0.85"/>
      {/* up arrow on top */}
      <path d="M55 38 L55 16" stroke="white" strokeWidth="3.5" strokeLinecap="round"/>
      <path d="M44 26 L55 16 L66 26" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none"/>
    </svg>
  );
}
function IllustrationBestDay() {
  return (
    <svg width="110" height="110" viewBox="0 0 110 110" fill="none" className="bob">
      {/* sky blue block */}
      <rect x="5" y="5" width="100" height="100" rx="24" fill="#B0E0E6" opacity="0.55"/>
      {/* inner yellow block */}
      <rect x="20" y="20" width="70" height="70" rx="18" fill="#FFF3A3" opacity="0.9"/>
      {/* sun rays */}
      {[0,45,90,135,180,225,270,315].map((deg,i) => (
        <line key={i}
          x1={55 + 26 * Math.cos(deg * Math.PI / 180)}
          y1={55 + 26 * Math.sin(deg * Math.PI / 180)}
          x2={55 + 36 * Math.cos(deg * Math.PI / 180)}
          y2={55 + 36 * Math.sin(deg * Math.PI / 180)}
          stroke="#0F4D92" strokeWidth="3" strokeLinecap="round" opacity="0.6"/>
      ))}
      <circle cx="55" cy="55" r="18" fill="#0F4D92" opacity="0.85"/>
      <circle cx="55" cy="55" r="10" fill="#FFF3A3" opacity="0.7"/>
    </svg>
  );
}

const stories = [
  {
    id: 1,
    label: "Risk Events",
    headline: "3 risk events this week",
    sub: "Two evening drops and one post-lunch spike were detected. Tuesday and Thursday were the riskiest days.",
    tag: "RISK",
    tagColor: "bg-destructive/20 text-destructive border-destructive/30",
    blockTop: "#0F4D92",
    blockBottom: "#FFF3A3",
    illustration: <IllustrationRisk />,
  },
  {
    id: 2,
    label: "Pattern",
    headline: "Evening drops most frequent",
    sub: "Between 6–9 PM, your glucose consistently dips. This pattern has appeared 4 of the last 7 days.",
    tag: "PATTERN",
    tagColor: "bg-accent/15 text-accent border-accent/30",
    blockTop: "#0F4D92",
    blockBottom: "#B0E0E6",
    illustration: <IllustrationEvening />,
  },
  {
    id: 3,
    label: "Best Day",
    headline: "Most stable day: Tuesday",
    sub: "Your glucose stayed between 85–105 mg/dL all day. Regular meals and light activity contributed.",
    tag: "STABLE",
    tagColor: "bg-primary/15 text-primary border-primary/30",
    blockTop: "#B0E0E6",
    blockBottom: "#FFF3A3",
    illustration: <IllustrationBestDay />,
  },
  {
    id: 4,
    label: "Progress",
    headline: "Glucose improved this week",
    sub: "Average glucose dropped from 103 to 96 mg/dL compared to last week. Risk events reduced by 1.",
    tag: "PROGRESS",
    tagColor: "bg-primary/15 text-primary border-primary/30",
    blockTop: "#FFF3A3",
    blockBottom: "#0F4D92",
    illustration: <IllustrationImproved />,
  },
  {
    id: 5,
    label: "Overall",
    headline: "Stable trend overall",
    sub: "This week scores 78% on our stability index — up 4 points from last week. Keep up the consistent logging.",
    tag: "GOOD",
    tagColor: "bg-secondary/40 text-secondary-foreground border-secondary/50",
    blockTop: "#B0E0E6",
    blockBottom: "#FFFFFF",
    illustration: <IllustrationStable />,
  },
];

export default function StoryScreen() {
  const [current, setCurrent] = useState(0);
  const story = stories[current];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Your health narrative</p>
        <h1 className="text-3xl font-bold text-foreground mt-1">Weekly Story</h1>
      </div>

      <div className="grid grid-cols-3 gap-6">
        {/* Story card (large, 2/3) */}
        <div className="col-span-2 flex flex-col gap-4">
          {/* Progress dots */}
          <div className="flex gap-2">
            {stories.map((_, i) => (
              <button
                key={i}
                onClick={() => setCurrent(i)}
                className="h-1.5 rounded-full transition-all"
                style={{
                  width: i === current ? "2.5rem" : "0.75rem",
                  background: i === current ? "var(--primary)" : "var(--border)",
                }}
              />
            ))}
          </div>

          {/* Main story card — two-tone color block layout */}
          <div className="rounded-3xl border border-border shadow-sm overflow-hidden flex min-h-[340px] relative">
            {/* Left: colored top block (like reference warm/cold blocks) */}
            <div className="flex flex-col flex-1 relative">
              {/* Top color block */}
              <div className="h-40 flex items-end justify-end p-6 relative overflow-hidden"
                style={{ background: story.blockTop }}>
                <div className="absolute right-6 bottom-4 opacity-90 scale-125 origin-bottom-right">
                  {story.illustration}
                </div>
              </div>
              {/* Bottom content block */}
              <div className="flex-1 p-7 flex flex-col gap-4" style={{ background: story.blockBottom }}>
                <span className={`text-xs font-mono font-bold px-3 py-1 rounded-full border w-fit ${story.tagColor}`}>
                  {story.tag}
                </span>
                <h2 className="text-2xl font-extrabold leading-tight max-w-xs text-balance"
                  style={{ color: story.blockBottom === "#0F4D92" ? "#FFF3A3" : "#0F2A5A" }}>
                  {story.headline}
                </h2>
                <p className="leading-relaxed max-w-sm text-sm font-light"
                  style={{ color: story.blockBottom === "#0F4D92" ? "rgba(255,255,255,0.75)" : "#3A6094" }}>
                  {story.sub}
                </p>
                {/* Nav arrows */}
                <div className="flex gap-3 mt-auto">
                  <button
                    onClick={() => setCurrent(c => Math.max(0, c - 1))}
                    disabled={current === 0}
                    className="w-10 h-10 rounded-full border border-border flex items-center justify-center disabled:opacity-30 hover:border-primary/60 transition-colors bg-white/80"
                  >
                    <ChevronLeft size={18} className="text-foreground" />
                  </button>
                  <button
                    onClick={() => setCurrent(c => Math.min(stories.length - 1, c + 1))}
                    disabled={current === stories.length - 1}
                    className="w-10 h-10 rounded-full flex items-center justify-center disabled:opacity-30 transition-all hover:scale-105"
                    style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
                  >
                    <ChevronRight size={18} />
                  </button>
                  <span className="ml-auto text-xs font-mono self-center opacity-60"
                    style={{ color: story.blockBottom === "#0F4D92" ? "white" : "var(--muted-foreground)" }}>
                    {current + 1} / {stories.length}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Right: all story cards list */}
        <div className="flex flex-col gap-3">
          <h3 className="font-bold text-sm text-foreground">All Stories</h3>
          {stories.map((s, i) => (
            <button
              key={s.id}
              onClick={() => setCurrent(i)}
              className="flex items-center gap-3 p-4 rounded-2xl border text-left transition-all"
              style={
                i === current
                  ? { background: "var(--primary)", borderColor: "var(--primary)", color: "var(--primary-foreground)" }
                  : { background: "var(--card)", borderColor: "var(--border)", color: "var(--foreground)" }
              }
            >
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center flex-shrink-0 ${i === current ? "bg-white/20" : "bg-muted"}`}>
                <span className="text-base">{i + 1}</span>
              </div>
              <div className="min-w-0">
                <p className="font-bold text-xs">{s.label}</p>
                <p className="text-xs opacity-70 truncate">{s.headline}</p>
              </div>
            </button>
          ))}

          {/* Weekly summary stats */}
          <div className="mt-2 bg-card border border-border rounded-2xl p-4 shadow-sm">
            <p className="text-xs font-mono font-bold text-muted-foreground uppercase tracking-wider mb-3">Week Summary</p>
            {[
              { label: "Avg Glucose", val: "96 mg/dL" },
              { label: "Risk Events", val: "3" },
              { label: "Stability",   val: "78%" },
              { label: "Best Day",    val: "Tuesday" },
            ].map(({ label, val }) => (
              <div key={label} className="flex justify-between py-1.5 border-b border-border last:border-0">
                <span className="text-xs text-muted-foreground">{label}</span>
                <span className="text-xs font-bold text-primary">{val}</span>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
