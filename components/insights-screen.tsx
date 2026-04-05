"use client";

import { useState, useRef, useEffect } from "react";
import {
  Brain, TrendingDown, AlertTriangle, BarChart3,
  MessageCircle, Send, ChevronDown, ChevronUp,
} from "lucide-react";

/* ── Brain illustration ── */
function BrainIllustration() {
  return (
    <svg width="90" height="90" viewBox="0 0 90 90" fill="none">
      <rect x="2" y="2" width="86" height="86" rx="22" fill="#FFF3A3" opacity="0.9"/>
      <circle cx="45" cy="45" r="32" fill="#0F4D92" opacity="0.85"/>
    </svg>
  );
}

type Msg = { role: "user" | "ai"; text: string };

type Props = {
  predictionData: any;
  onPredict: (sequence: number[]) => void;
};

export default function InsightsScreen({ predictionData, onPredict }: Props) {
  const [msgs, setMsgs] = useState<Msg[]>([
    { role: "ai", text: "Hi — I am monitoring your glucose data. Ask anything." },
  ]);
  const [input, setInput] = useState("");
  const [sequenceInput, setSequenceInput] = useState("");
  const [open, setOpen] = useState(true);
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [msgs]);

  function send(text?: string) {
    const q = (text ?? input).trim();
    if (!q) return;

    setInput("");
    setMsgs(m => [...m, { role: "user", text: q }]);

    setTimeout(() => {
      let response = "Stay alert and monitor your glucose.";

      if (predictionData?.risk === "HIGH") {
        response = "⚠️ High risk detected. Eat a fast-acting carb snack.";
      } else if (predictionData?.risk === "MEDIUM") {
        response = "Glucose trending down. Keep a snack ready.";
      }

      setMsgs(m => [...m, { role: "ai", text: response }]);
    }, 600);
  }

  const handlePredict = () => {
    const seq = sequenceInput.split(",").map(Number);
    onPredict(seq);
  };

  // 🔥 Dynamic insights
  const dynamicInsights = predictionData ? [
    {
      icon: TrendingDown,
      title: "Predicted Glucose",
      body: `Next value: ${predictionData.predicted_glucose?.toFixed(2)} mg/dL`,
    },
    {
      icon: AlertTriangle,
      title: "Risk Level",
      body: `Current risk: ${predictionData.risk}`,
    },
    {
      icon: BarChart3,
      title: "Future Trend",
      body: `Next values: ${predictionData.future_values?.slice(0,3).map((v:number)=>v.toFixed(1)).join(", ")}`,
    },
  ] : [];

  return (
    <div className="flex flex-col gap-6">

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <p className="text-xs font-mono uppercase tracking-widest text-muted-foreground">
            AI-Powered Analysis
          </p>
          <h1 className="text-3xl font-bold text-foreground mt-1">
            Insights
          </h1>
        </div>
        <BrainIllustration />
      </div>

      {/* 🔥 Input for prediction */}
      <div className="bg-card border border-border rounded-xl p-4">
        <p className="text-sm mb-2">Enter glucose values (comma-separated)</p>
        <div className="flex gap-2">
          <input
            value={sequenceInput}
            onChange={(e) => setSequenceInput(e.target.value)}
            className="flex-1 border p-2 rounded text-black"
            placeholder="e.g. 110,108,105,100..."
          />
          <button
            onClick={handlePredict}
            className="bg-blue-500 text-white px-4 rounded"
          >
            Predict
          </button>
        </div>
      </div>

      <div className="grid grid-cols-3 gap-5">

        {/* Left: Insights */}
        <div className="col-span-1 flex flex-col gap-4">

          {predictionData ? dynamicInsights.map(({ icon: Icon, title, body }) => (
            <div key={title} className="rounded-xl border p-4">
              <div className="flex items-center gap-2 mb-2">
                <Icon size={16}/>
                <span className="font-bold">{title}</span>
              </div>
              <p className="text-sm">{body}</p>
            </div>
          )) : (
            <p className="text-sm text-muted-foreground">
              Enter data to generate insights
            </p>
          )}

        </div>

        {/* Right: AI Chat */}
        <div className="col-span-2 bg-card border border-border rounded-2xl flex flex-col">

          <button
            onClick={() => setOpen(o => !o)}
            className="flex items-center justify-between px-6 py-4 border-b"
          >
            <span className="font-bold">AI Assistant</span>
            {open ? <ChevronUp size={16}/> : <ChevronDown size={16}/>}
          </button>

          {open && (
            <>
              <div className="flex-1 p-4 overflow-y-auto flex flex-col gap-3 max-h-[300px]">
                {msgs.map((m, i) => (
                  <div key={i} className={`flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                    <div className="bg-muted p-2 rounded max-w-[70%]">
                      {m.text}
                    </div>
                  </div>
                ))}
                <div ref={endRef}/>
              </div>

              <div className="flex gap-2 p-4">
                <input
                  value={input}
                  onChange={e => setInput(e.target.value)}
                  onKeyDown={e => e.key === "Enter" && send()}
                  className="flex-1 border p-2 rounded text-black"
                />
                <button onClick={() => send()} className="bg-blue-500 text-white px-3 rounded">
                  <Send size={14}/>
                </button>
              </div>
            </>
          )}

        </div>
      </div>
    </div>
  );
}