'use client';

import { X, AlertTriangle } from 'lucide-react';

interface AlertBannerProps {
  message?: string;
  onDismiss?: () => void;
}

export default function AlertBanner({
  message = 'High risk in 30 minutes — consider eating a snack',
  onDismiss,
}: AlertBannerProps) {
  return (
    <div className="pulse-high fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div
        className="flex items-center gap-3 rounded-2xl px-5 py-3 shadow-xl"
        style={{ background: '#E53E3E', color: '#fff' }}
      >
        <AlertTriangle size={15} className="flex-shrink-0" />
        <p className="text-sm font-bold whitespace-nowrap">{message}</p>
        {onDismiss && (
          <button
            onClick={onDismiss}
            className="opacity-70 hover:opacity-100 transition-opacity ml-2"
          >
            <X size={14} />
          </button>
        )}
      </div>
    </div>
  );
}
