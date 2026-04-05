'use client';

import { useState } from 'react';
import { AlertCircle, Loader2 } from 'lucide-react';

interface GlucoseInputProps {
  onPredict?: (values: number[]) => Promise<void>;
  isLoading?: boolean;
  error?: string;
}

export default function GlucoseInput({
  onPredict,
  isLoading = false,
  error,
}: GlucoseInputProps) {
  const [inputValue, setInputValue] = useState('');

  const handleRunPrediction = async () => {
    const values = inputValue
      .split(',')
      .map(v => parseFloat(v.trim()))
      .filter(v => !isNaN(v));

    if (values.length < 10) {
      return;
    }

    onPredict?.(values);
  };

  const values = inputValue
    .split(',')
    .map(v => v.trim())
    .filter(v => v.length > 0);

  const isValid = values.length >= 10;

  return (
    <div className="bg-card rounded-2xl border border-border p-5 flex flex-col gap-4 shadow-sm">
      <div>
        <label className="block text-sm font-bold text-foreground mb-2">
          Glucose Values (mg/dL)
        </label>
        <p className="text-xs text-muted-foreground mb-3">
          Enter comma-separated glucose readings (minimum 10 required)
        </p>
        <textarea
          value={inputValue}
          onChange={e => setInputValue(e.target.value)}
          placeholder="e.g., 120, 118, 115, 112, 110, 108, 105, 102, 100, 98, 95, 92..."
          className="w-full bg-input border border-border rounded-xl px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground outline-none focus:border-primary/70 focus:ring-2 focus:ring-primary/20 resize-none"
          rows={4}
        />
      </div>

      {error && (
        <div className="flex items-start gap-3 bg-destructive/10 border border-destructive/30 rounded-xl p-3">
          <AlertCircle size={16} className="text-destructive flex-shrink-0 mt-0.5" />
          <p className="text-xs text-destructive">{error}</p>
        </div>
      )}

      <div className="flex items-center justify-between">
        <p className="text-xs font-mono text-muted-foreground">
          {values.length} reading{values.length !== 1 ? 's' : ''} entered
          {!isValid && values.length > 0 && ` (${10 - values.length} more needed)`}
        </p>
        <button
          onClick={handleRunPrediction}
          disabled={!isValid || isLoading}
          className="flex items-center gap-2 px-6 py-2 rounded-xl text-sm font-bold transition-all"
          style={{
            background: isValid && !isLoading ? 'var(--primary)' : 'var(--muted)',
            color: isValid && !isLoading ? 'var(--primary-foreground)' : 'var(--muted-foreground)',
            cursor: isValid && !isLoading ? 'pointer' : 'not-allowed',
            opacity: isValid && !isLoading ? 1 : 0.6,
          }}
        >
          {isLoading && <Loader2 size={14} className="animate-spin" />}
          {isLoading ? 'Predicting...' : 'Run Prediction'}
        </button>
      </div>
    </div>
  );
}
