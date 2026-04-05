"use client";

import { useState, useRef, useCallback } from "react";
import {
  UploadCloud, FileText, FileImage, FileSpreadsheet,
  CheckCircle2, XCircle, Trash2, AlertTriangle, ChevronDown, ChevronUp
} from "lucide-react";

/* ── Illustration ── */
function UploadIllustration() {
  return (
    <svg width="120" height="96" viewBox="0 0 120 96" fill="none" aria-hidden="true">
      {/* yellow block base */}
      <rect x="10" y="40" width="100" height="48" rx="16" fill="#FFF3A3" opacity="0.9" />
      {/* blue document stack */}
      <rect x="22" y="28" width="56" height="68" rx="10" fill="#B0E0E6" opacity="0.7" />
      <rect x="30" y="20" width="56" height="68" rx="10" fill="#4D9DE0" opacity="0.5" />
      <rect x="38" y="14" width="56" height="68" rx="10" fill="#0F4D92" opacity="0.88" />
      {/* lines on doc */}
      <rect x="50" y="30" width="28" height="4" rx="2" fill="white" opacity="0.4" />
      <rect x="50" y="40" width="20" height="4" rx="2" fill="white" opacity="0.4" />
      <rect x="50" y="50" width="24" height="4" rx="2" fill="white" opacity="0.4" />
      {/* upward arrow */}
      <circle cx="30" cy="22" r="14" fill="#FFF3A3" opacity="0.95" />
      <path d="M30 29 L30 15" stroke="#0F4D92" strokeWidth="2.5" strokeLinecap="round" />
      <path d="M24 21 L30 15 L36 21" stroke="#0F4D92" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

function SuccessIllustration() {
  return (
    <svg width="80" height="80" viewBox="0 0 80 80" fill="none" aria-hidden="true">
      <rect x="4" y="4" width="72" height="72" rx="20" fill="#FFF3A3" opacity="0.8" />
      <circle cx="40" cy="40" r="26" fill="#0F4D92" opacity="0.88" />
      <path d="M28 40 L36 48 L52 30" stroke="white" strokeWidth="3.5" strokeLinecap="round" strokeLinejoin="round" fill="none" />
    </svg>
  );
}

/* ── Types ── */
type UploadStatus = "idle" | "uploading" | "done" | "error";

interface UploadedFile {
  id: string;
  name: string;
  size: number;
  type: string;
  status: UploadStatus;
  progress: number;
  error?: string;
}

interface ParsedReading {
  date: string;
  time: string;
  glucose: number;
  flag: "normal" | "low" | "high";
}

const MOCK_READINGS: ParsedReading[] = [
  { date: "Apr 3", time: "07:12", glucose: 82, flag: "normal" },
  { date: "Apr 3", time: "12:45", glucose: 115, flag: "normal" },
  { date: "Apr 3", time: "18:30", glucose: 68, flag: "low" },
  { date: "Apr 3", time: "21:55", glucose: 71, flag: "normal" },
  { date: "Apr 4", time: "07:03", glucose: 78, flag: "normal" },
  { date: "Apr 4", time: "13:10", glucose: 142, flag: "high" },
  { date: "Apr 4", time: "19:22", glucose: 63, flag: "low" },
  { date: "Apr 5", time: "07:40", glucose: 91, flag: "normal" },
  { date: "Apr 5", time: "12:15", glucose: 107, flag: "normal" },
  { date: "Apr 5", time: "17:50", glucose: 98, flag: "normal" },
];

const ACCEPTED_TYPES = [
  "application/pdf",
  "text/csv",
  "image/png",
  "image/jpeg",
  "image/jpg",
];
const ACCEPTED_EXTENSIONS = [".pdf", ".csv", ".png", ".jpg", ".jpeg"];

function formatBytes(bytes: number) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
}

function fileIcon(type: string) {
  if (type.includes("pdf"))   return <FileText size={20} className="text-primary" />;
  if (type.includes("csv"))   return <FileSpreadsheet size={20} className="text-primary" />;
  if (type.includes("image")) return <FileImage size={20} className="text-primary" />;
  return <FileText size={20} className="text-primary" />;
}

const flagStyle: Record<ParsedReading["flag"], string> = {
  normal: "bg-green-100 text-green-700 border-green-200",
  low:    "bg-yellow-100 text-yellow-700 border-yellow-200",
  high:   "bg-red-100 text-red-700 border-red-200",
};

export default function UploadScreen() {
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [dragging, setDragging] = useState(false);
  const [showReadings, setShowReadings] = useState(false);
  const [expandedFile, setExpandedFile] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  const processFiles = useCallback((incoming: File[]) => {
    const valid = incoming.filter(f =>
      ACCEPTED_TYPES.includes(f.type) || ACCEPTED_EXTENSIONS.some(ext => f.name.toLowerCase().endsWith(ext))
    );
    const invalid = incoming.filter(f => !valid.includes(f));

    const newEntries: UploadedFile[] = [
      ...valid.map(f => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        name: f.name,
        size: f.size,
        type: f.type || "application/octet-stream",
        status: "uploading" as UploadStatus,
        progress: 0,
      })),
      ...invalid.map(f => ({
        id: `${f.name}-${Date.now()}-${Math.random()}`,
        name: f.name,
        size: f.size,
        type: f.type,
        status: "error" as UploadStatus,
        progress: 0,
        error: "Unsupported file type",
      })),
    ];

    setFiles(prev => [...prev, ...newEntries]);

    // Simulate upload progress for valid files
    newEntries.filter(e => e.status === "uploading").forEach(entry => {
      let progress = 0;
      const interval = setInterval(() => {
        progress += Math.random() * 25 + 10;
        if (progress >= 100) {
          progress = 100;
          clearInterval(interval);
          setFiles(prev =>
            prev.map(f =>
              f.id === entry.id ? { ...f, progress: 100, status: "done" } : f
            )
          );
          setShowReadings(true);
        } else {
          setFiles(prev =>
            prev.map(f => (f.id === entry.id ? { ...f, progress } : f))
          );
        }
      }, 300);
    });
  }, []);

  const onDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setDragging(false);
    processFiles(Array.from(e.dataTransfer.files));
  }, [processFiles]);

  const onInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) processFiles(Array.from(e.target.files));
    e.target.value = "";
  };

  const removeFile = (id: string) => {
    setFiles(prev => prev.filter(f => f.id !== id));
    if (files.filter(f => f.id !== id && f.status === "done").length === 0) {
      setShowReadings(false);
    }
  };

  const doneCount  = files.filter(f => f.status === "done").length;
  const errorCount = files.filter(f => f.status === "error").length;
  const avgGlucose = Math.round(MOCK_READINGS.reduce((s, r) => s + r.glucose, 0) / MOCK_READINGS.length);
  const lowCount   = MOCK_READINGS.filter(r => r.flag === "low").length;
  const highCount  = MOCK_READINGS.filter(r => r.flag === "high").length;

  return (
    <div className="flex flex-col gap-8 max-w-5xl mx-auto">

      {/* ── Header ── */}
      <div className="flex items-start justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-foreground tracking-tight">Upload Medical Report</h1>
          <p className="text-muted-foreground text-sm font-light mt-1">
            Upload your glucose logs, lab PDFs, or CGM CSV exports. The AI will extract readings automatically.
          </p>
        </div>
        <div className="shrink-0 hidden md:block">
          <UploadIllustration />
        </div>
      </div>

      {/* ── Drop zone ── */}
      <div
        role="button"
        tabIndex={0}
        aria-label="Upload area — drag and drop files or click to browse"
        onDragOver={e => { e.preventDefault(); setDragging(true); }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        onClick={() => inputRef.current?.click()}
        onKeyDown={e => { if (e.key === "Enter" || e.key === " ") inputRef.current?.click(); }}
        className="rounded-3xl border-2 border-dashed cursor-pointer transition-all duration-200 flex flex-col items-center justify-center gap-5 py-14 px-8 select-none"
        style={{
          borderColor: dragging ? "var(--primary)" : "var(--border)",
          background: dragging ? "rgba(15,77,146,0.05)" : "var(--card)",
        }}
      >
        <div
          className="w-16 h-16 rounded-2xl flex items-center justify-center transition-transform duration-200"
          style={{ background: dragging ? "var(--primary)" : "var(--muted)", transform: dragging ? "scale(1.1)" : "scale(1)" }}
        >
          <UploadCloud size={30} style={{ color: dragging ? "var(--primary-foreground)" : "var(--primary)" }} />
        </div>
        <div className="text-center">
          <p className="font-bold text-foreground text-base">
            {dragging ? "Drop files here" : "Drag & drop files, or click to browse"}
          </p>
          <p className="text-muted-foreground text-sm font-light mt-1">
            Supports PDF, CSV, PNG, JPG — up to 20 MB per file
          </p>
        </div>
        <div className="flex gap-2 flex-wrap justify-center">
          {["PDF report", "CSV export", "CGM image", "Lab result"].map(label => (
            <span
              key={label}
              className="text-xs font-mono px-3 py-1 rounded-full border"
              style={{ background: "var(--muted)", borderColor: "var(--border)", color: "var(--muted-foreground)" }}
            >
              {label}
            </span>
          ))}
        </div>
        <input
          ref={inputRef}
          type="file"
          multiple
          accept={ACCEPTED_EXTENSIONS.join(",")}
          onChange={onInputChange}
          className="hidden"
          aria-hidden="true"
        />
      </div>

      {/* ── File list ── */}
      {files.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex items-center justify-between">
            <h2 className="font-bold text-foreground text-sm uppercase tracking-wider font-mono">
              Uploads ({files.length})
            </h2>
            {(doneCount > 0 || errorCount > 0) && (
              <div className="flex gap-3 text-xs font-mono">
                {doneCount > 0 && (
                  <span className="flex items-center gap-1 text-green-600">
                    <CheckCircle2 size={13} /> {doneCount} processed
                  </span>
                )}
                {errorCount > 0 && (
                  <span className="flex items-center gap-1 text-destructive">
                    <XCircle size={13} /> {errorCount} failed
                  </span>
                )}
              </div>
            )}
          </div>

          {files.map(file => (
            <div
              key={file.id}
              className="bg-card rounded-2xl border border-border overflow-hidden"
            >
              {/* Top strip */}
              <div
                className="h-1.5 w-full transition-all duration-300"
                style={{
                  background:
                    file.status === "done"  ? "#22c55e" :
                    file.status === "error" ? "var(--destructive)" :
                    "var(--primary)",
                  width: file.status === "uploading" ? `${file.progress}%` : "100%",
                }}
              />

              <div className="px-5 py-4 flex items-center gap-4">
                <div
                  className="w-10 h-10 rounded-xl flex items-center justify-center shrink-0"
                  style={{ background: "var(--muted)" }}
                >
                  {fileIcon(file.type)}
                </div>

                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-foreground truncate">{file.name}</p>
                  <div className="flex items-center gap-3 mt-0.5">
                    <span className="text-xs font-mono text-muted-foreground">{formatBytes(file.size)}</span>
                    {file.status === "uploading" && (
                      <span className="text-xs font-mono text-primary">
                        {Math.round(file.progress)}%
                      </span>
                    )}
                    {file.status === "done" && (
                      <span className="text-xs font-mono text-green-600 flex items-center gap-1">
                        <CheckCircle2 size={11} /> Processed
                      </span>
                    )}
                    {file.status === "error" && (
                      <span className="text-xs font-mono text-destructive flex items-center gap-1">
                        <XCircle size={11} /> {file.error}
                      </span>
                    )}
                  </div>
                </div>

                <div className="flex items-center gap-2 shrink-0">
                  {file.status === "done" && (
                    <button
                      onClick={() => setExpandedFile(expandedFile === file.id ? null : file.id)}
                      className="text-xs font-mono flex items-center gap-1 px-3 py-1.5 rounded-lg transition-colors hover:bg-muted"
                      style={{ color: "var(--primary)" }}
                    >
                      Preview
                      {expandedFile === file.id ? <ChevronUp size={13} /> : <ChevronDown size={13} />}
                    </button>
                  )}
                  <button
                    onClick={() => removeFile(file.id)}
                    aria-label="Remove file"
                    className="w-8 h-8 rounded-lg flex items-center justify-center transition-colors hover:bg-destructive/10 text-muted-foreground hover:text-destructive"
                  >
                    <Trash2 size={15} />
                  </button>
                </div>
              </div>

              {/* Expanded preview */}
              {expandedFile === file.id && file.status === "done" && (
                <div className="px-5 pb-5 border-t border-border">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wider mt-4 mb-3">
                    Extracted content preview
                  </p>
                  <div
                    className="rounded-xl p-4 text-xs font-mono leading-6"
                    style={{ background: "var(--muted)", color: "var(--muted-foreground)" }}
                  >
                    <span className="font-bold text-foreground">Patient:</span> Hamsini R. &nbsp;|&nbsp;
                    <span className="font-bold text-foreground">Period:</span> Apr 3–5, 2025 &nbsp;|&nbsp;
                    <span className="font-bold text-foreground">Device:</span> Freestyle Libre 3{"\n"}
                    <br />
                    <span className="font-bold text-foreground">Readings extracted:</span> {MOCK_READINGS.length} &nbsp;|&nbsp;
                    <span className="font-bold text-foreground">Avg glucose:</span> {avgGlucose} mg/dL &nbsp;|&nbsp;
                    <span className="font-bold text-foreground">Low events:</span> {lowCount} &nbsp;|&nbsp;
                    <span className="font-bold text-foreground">High events:</span> {highCount}
                  </div>
                </div>
              )}
            </div>
          ))}
        </div>
      )}

      {/* ── Parsed readings table ── */}
      {showReadings && (
        <div className="bg-card rounded-3xl border border-border overflow-hidden">
          {/* Header block */}
          <div className="flex items-center justify-between px-7 py-5" style={{ borderBottom: "1px solid var(--border)" }}>
            <div className="flex items-center gap-4">
              <div className="shrink-0">
                <SuccessIllustration />
              </div>
              <div>
                <h2 className="font-extrabold text-lg text-foreground">Readings Extracted</h2>
                <p className="text-muted-foreground text-sm font-light">
                  {MOCK_READINGS.length} glucose entries detected · AI confidence 94%
                </p>
              </div>
            </div>
            <button
              className="px-5 py-2.5 rounded-xl font-bold text-sm transition-all hover:opacity-90 hover:scale-105"
              style={{ background: "var(--primary)", color: "var(--primary-foreground)" }}
            >
              Import to Dashboard
            </button>
          </div>

          {/* Summary chips */}
          <div className="flex gap-4 px-7 py-4 flex-wrap" style={{ borderBottom: "1px solid var(--border)" }}>
            {[
              { label: "Average", value: `${avgGlucose} mg/dL`, blockColor: "#0F4D92" },
              { label: "Low events", value: lowCount.toString(), blockColor: "#ca8a04" },
              { label: "High events", value: highCount.toString(), blockColor: "#E53E3E" },
              { label: "Days covered", value: "3 days", blockColor: "#B0E0E6" },
            ].map(({ label, value, blockColor }) => (
              <div
                key={label}
                className="flex flex-col rounded-2xl overflow-hidden border border-border flex-1 min-w-[100px]"
              >
                <div className="h-1.5" style={{ background: blockColor }} />
                <div className="px-4 py-3">
                  <p className="text-xs font-mono text-muted-foreground uppercase tracking-wide">{label}</p>
                  <p className="font-extrabold text-xl font-mono mt-0.5 text-foreground">{value}</p>
                </div>
              </div>
            ))}
          </div>

          {/* Readings table */}
          <div className="overflow-x-auto">
            <table className="w-full text-sm" aria-label="Extracted glucose readings">
              <thead>
                <tr style={{ background: "var(--muted)" }}>
                  {["Date", "Time", "Glucose (mg/dL)", "Status"].map(col => (
                    <th key={col} className="text-left px-7 py-3 text-xs font-mono text-muted-foreground uppercase tracking-wider font-semibold">
                      {col}
                    </th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MOCK_READINGS.map((r, i) => (
                  <tr
                    key={i}
                    className="border-t border-border transition-colors hover:bg-muted/40"
                  >
                    <td className="px-7 py-3 font-mono text-muted-foreground text-xs">{r.date}</td>
                    <td className="px-7 py-3 font-mono text-muted-foreground text-xs">{r.time}</td>
                    <td className="px-7 py-3">
                      <div className="flex items-center gap-2">
                        {r.flag === "low" && (
                          <AlertTriangle size={13} className="text-yellow-600" aria-hidden="true" />
                        )}
                        <span className="font-extrabold font-mono text-foreground">{r.glucose}</span>
                      </div>
                    </td>
                    <td className="px-7 py-3">
                      <span
                        className={`text-xs font-mono font-bold px-2.5 py-1 rounded-full border ${flagStyle[r.flag]}`}
                      >
                        {r.flag.toUpperCase()}
                      </span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Empty state */}
      {files.length === 0 && (
        <div className="grid grid-cols-3 gap-4">
          {[
            { title: "PDF Lab Reports", desc: "Upload hospital glucose test PDFs", color: "#0F4D92" },
            { title: "CGM CSV Exports", desc: "Drag in Freestyle Libre / Dexcom CSVs", color: "#4D9DE0" },
            { title: "Glucose Images", desc: "Photo of glucometer or handwritten log", color: "#B0E0E6" },
          ].map(({ title, desc, color }) => (
            <div key={title} className="bg-card rounded-2xl border border-border overflow-hidden">
              <div className="h-2" style={{ background: color }} />
              <div className="px-5 py-4">
                <p className="font-bold text-sm text-foreground">{title}</p>
                <p className="text-xs text-muted-foreground font-light mt-1">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
