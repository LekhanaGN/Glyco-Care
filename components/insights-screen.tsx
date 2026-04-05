"use client";

import { useState, useRef, useEffect } from "react";
import {
  Brain, TrendingDown, AlertTriangle, BarChart3,
  MessageCircle, Send, ChevronDown, ChevronUp,
} from "lucide-react";

/* ── Brain illustration — bold block style ── */
function BrainIllustration() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none" className="bob">
      {/* yellow block card */}
      <rect x="2" y="2" width="86" height="86" rx="22" fill="#FFF3A3" opacity="0.9"/>
      {/* blue circle block */}
      <circle cx="45" cy="45" r="32" fill="#0F4D92" opacity="0.85"/>
      {/* brain lobes — white on blue */}
      <path d="M45 24 C33 22, 22 30, 22 40 C22 50, 28 56, 36 58 C36 64, 40 68, 45 68"
        stroke="white" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M45 24 C57 22, 68 30, 68 40 C68 50, 62 56, 54 58 C54 64, 50 68, 45 68"
        stroke="#B0E0E6" strokeWidth="2.5" strokeLinecap="round" fill="none" opacity="0.7"/>
      <path d="M30 40 C30 40, 35 36, 39 40 C43 44, 47 36, 52 40 C56 44, 60 40, 60 40"
        stroke="#B0E0E6" strokeWidth="1.8" strokeLinecap="round" fill="none" opacity="0.5"/>
      {/* highlight dot */}
      <circle cx="45" cy="24" r="3" fill="#FFF3A3" opacity="0.9"/>
    </svg>
  );
}

const insightCards = [
  {
    icon: TrendingDown,
    title: "Glucose dropping rapidly",
    body: "Your glucose declined 16 mg/dL in 30 min — faster than your baseline rate. Act soon.",
    color: "border-destructive/30 bg-destructive/8",
    iconColor: "text-destructive",
    badge: "Critical",
    badgeColor: "bg-destructive/15 text-destructive border-destructive/25",
  },
  {
    icon: AlertTriangle,
    title: "Risk threshold approaching",
    body: "Based on trend, glucose may cross 70 mg/dL in ~28 minutes. Have a snack on hand.",
    color: "border-accent/40 bg-accent/8",
    iconColor: "text-accent",
    badge: "Warning",
    badgeColor: "bg-accent/15 text-accent border-accent/25",
  },
  {
    icon: BarChart3,
    title: "Consistent downward pattern",
    body: "A 3-hour downward pattern similar to previous hypoglycemia events has been detected.",
    color: "border-primary/30 bg-primary/6",
    iconColor: "text-primary",
    badge: "Trend",
    badgeColor: "bg-primary/15 text-primary border-primary/25",
  },
];

const confidenceLevels = [
  { label: "Not available", min: 0,  max: 9,        color: "bg-muted" },
  { label: "Low",           min: 10, max: 19,       color: "bg-secondary" },
  { label: "Medium",        min: 20, max: 39,       color: "bg-accent" },
  { label: "High",          min: 40, max: Infinity, color: "bg-primary" },
];
const READINGS = 24;
function getConf(n: number) {
  return confidenceLevels.find(c => n >= c.min && n <= c.max) ?? confidenceLevels[0];
}

type Msg = { role: "user" | "ai"; text: string };
const SUGGESTED = ["Should I eat now?", "Is my trend improving?", "What caused this drop?"];
const AI_RESP: Record<string, string> = {
  "Should I eat now?": "Yes — your glucose is likely to fall below the safe threshold in under 30 minutes. A 15g carb snack is recommended.",
  "Is my trend improving?": "No, the trend is still declining. You have dropped 16 mg/dL in the last 30 minutes with no sign of reversal.",
  "What caused this drop?": "Most probable cause: a 4+ hour meal gap combined with elevated recent activity. Overnight patterns also show increased sensitivity.",
};

export default function InsightsScreen() {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi Hamsini — I am monitoring your glucose data in real time. Ask me anything about your current risk or trend." },
  ]);
  const [input, setInput] = useState("");
  const [open, setOpen] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);
  useEffect(() => { endRef.current?.scrollIntoView({ behavior: "smooth" }); }, [msgs]);

  function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;
    setInput("");
    setMsgs(m => [...m, { role: "user", text: q }]);
    setTimeout(() => {
      const r = AI_RESP[q] ?? "Based on your current data, I recommend staying alert and having a snack on hand. I will keep monitoring your trend.";
      setMsgs(m => [...m, { role: "ai", text: r }]);
    }, 600);
  }

  const conf = getConf(READINGS);

  return (
    <div className="flex flex-col gap-6">
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">AI-Powered Analysis</p>
          <h1 className="text-3xl font-bold text-foreground mt-1">Insights</h1>
        </div>
        <BrainIllustration />
      </div>

      <div className="grid grid-cols-3 gap-5">
        {/* Left: insight cards + confidence */}
        <div className="col-span-1 flex flex-col gap-4">
          {insightCards.map(({ icon: Icon, title, body, color, iconColor, badge, badgeColor }) => (
            <div key={title} className={`rounded-2xl border-2 p-5 ${color} relative overflow-hidden`}>
              <div className="absolute -right-3 -bottom-3 w-16 h-16 rounded-full bg-foreground/5"/>
              <div className="relative">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex items-center gap-2">
                    <Icon size={15} className={iconColor}/>
                    <span className="font-bold text-sm text-foreground">{title}</span>
                  </div>
                  <span className={`text-xs font-mono px-2 py-0.5 rounded-full border ml-2 whitespace-nowrap ${badgeColor}`}>
                    {badge}
                  </span>
                </div>
                <p className="text-muted-foreground text-xs leading-relaxed">{body}</p>
              </div>
            </div>
          ))}

          {/* Model confidence */}
          <div className="bg-card border border-border rounded-2xl p-5 shadow-sm">
            <div className="flex items-center gap-2 mb-3">
              <Brain size={15} className="text-primary"/>
              <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">Model Confidence</p>
            </div>
            <div className="flex items-center justify-between mb-3">
              <span className="font-bold text-sm text-foreground">{conf.label}</span>
              <span className="text-xs font-mono text-muted-foreground">{READINGS} readings</span>
            </div>
            <div className="flex gap-1.5">
              {confidenceLevels.map((c, i) => (
                <div key={i}
                  className={`h-2 flex-1 rounded-full transition-all ${READINGS >= c.min ? c.color : "bg-muted"}`}/>
              ))}
            </div>
            <div className="flex justify-between mt-1.5 text-xs font-mono text-muted-foreground">
              <span>{"<10"}</span><span>10</span><span>20</span><span>40+</span>
            </div>
          </div>
        </div>

        {/* Right: AI Chat */}
        <div className="col-span-2 bg-card border border-border rounded-2xl overflow-hidden shadow-sm flex flex-col">
          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center justify-between px-6 py-4 border-b border-border hover:bg-muted/50 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <MessageCircle size={16} className="text-primary"/>
              <span className="font-bold text-sm text-foreground">AI Assistant</span>
              <span className="text-xs font-mono bg-primary/15 text-primary px-2 py-0.5 rounded-full border border-primary/25">Live</span>
            </div>
            {open ? <ChevronUp size={16} className="text-muted-foreground"/> : <ChevronDown size={16} className="text-muted-foreground"/>}
          </button>

          {open && (
            <div className="flex flex-col flex-1 min-h-0">
              {/* Messages */}
              <div className="flex-1 px-5 py-4 overflow-y-auto flex flex-col gap-3 max-h-[400px]">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div
                      className={`rounded-2xl px-4 py-2.5 text-sm max-w-[80%] leading-relaxed ${
                        m.role === "user"
                          ? "rounded-br-sm"
                          : "rounded-bl-sm"
                      }`}
                      style={m.role === "user"
                        ? { background: "var(--primary)", color: "var(--primary-foreground)" }
                        : { background: "var(--muted)", color: "var(--foreground)" }
                      }
                    >
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={endRef}/>
              </div>

              {/* Suggested */}
              <div className="px-5 pb-2 flex flex-wrap gap-2">
                {SUGGESTED.map(q => (
                  <button key={q} onClick={() => send(q)}
                    className="text-xs font-mono text-primary border border-primary/30 px-3 py-1.5 rounded-full hover:bg-primary/10 transition-colors">
                    {q}
                  </button>
                ))}
              </div>

              {/* Input */}
              <div className="flex items-center gap-2 px-5 pb-5">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  placeholder="Ask about your glucose..."
                  className="flex-1 bg-card border border-border rounded-xl px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/70 transition-colors"
                />
                <button
                  onClick={() => send()}
                  className="w-10 h-10 rounded-xl flex items-center justify-center flex-shrink-0 hover:opacity-90 transition-opacity"
                  style={{ background: "var(--primary)" }}
                >
                  <Send size={15} style={{ color: "var(--primary-foreground)" }}/>
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
