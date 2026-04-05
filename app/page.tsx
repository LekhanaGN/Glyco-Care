'use client';

import { useState } from 'react';
import LandingPage from '@/components/landing-page';
import LoginPage from '@/components/login-page';
import Sidebar, { type NavTab, HamburgerButton } from '@/components/sidebar';
import DashboardScreen from '@/components/dashboard-screen';
import DietScreen from '@/components/diet-screen';
import StoryScreen from '@/components/story-screen';
import UploadScreen from '@/components/upload-screen';
import GlucoseLogScreen from '@/components/glucose-log-screen';
import PredictionScreen from '@/components/prediction-screen';
import LifestyleScreen from '@/components/lifestyle-screen';
import FloatingAIAssistant from '@/components/floating-ai-assistant';
import { X, AlertTriangle } from 'lucide-react';

function GlobalAlert({ onDismiss }: { onDismiss: () => void }) {
  return (
    <div className="pulse-high fixed top-5 left-1/2 -translate-x-1/2 z-50 pointer-events-auto">
      <div
        className="flex items-center gap-3 rounded-2xl px-5 py-3 shadow-xl"
        style={{ background: '#E53E3E', color: '#fff' }}
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

function getScreens(setTab: (tab: NavTab) => void): Record<NavTab, React.ReactNode> {
  return {
    dashboard: <DashboardScreen />,
    diet: <DietScreen />,
    lifestyle: <LifestyleScreen />,
    story: <StoryScreen />,
    glucoselog: <GlucoseLogScreen />,
    reports: <UploadScreen onImportComplete={() => setTab('dashboard')} />,
    prediction: <PredictionScreen />,
  };
}

export default function Home() {
  const [view, setView] = useState<'landing' | 'login' | 'app'>('landing');
  const [tab, setTab] = useState<NavTab>('dashboard');
  const [alert, setAlert] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  if (view === 'landing') {
    return <LandingPage onGetStarted={() => setView('login')} />;
  }

  if (view === 'login') {
    return <LoginPage onLogin={() => setView('app')} onBack={() => setView('landing')} />;
  }

  return (
    <div className="flex h-screen w-full overflow-hidden" style={{ background: 'var(--background)' }}>
      <Sidebar active={tab} onNav={setTab} isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />

      <main className="flex-1 overflow-y-auto h-screen w-full">
        <header
          className="sticky top-0 z-30 flex items-center justify-between px-4 md:px-8 py-3 border-b border-border backdrop-blur-sm"
          style={{ background: 'rgba(255,248,214,0.92)' }}
        >
          <div className="flex items-center gap-3">
            <HamburgerButton onClick={() => setSidebarOpen(true)} />
            <h2 className="font-bold text-foreground capitalize tracking-tight">{tab}</h2>
            <span className="text-xs font-mono text-muted-foreground hidden sm:block">
              {new Date().toLocaleDateString('en-GB', { weekday: 'long', day: 'numeric', month: 'long' })}
            </span>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-1.5">
              <span className="w-2 h-2 rounded-full bg-green-500 animate-pulse" />
              <span className="text-xs font-mono text-muted-foreground hidden sm:block">Monitoring live</span>
            </div>
            <div
              className="w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold"
              style={{ background: 'var(--primary)', color: 'var(--primary-foreground)' }}
            >
              HR
            </div>
          </div>
        </header>

        <div className="px-8 py-7 max-w-7xl mx-auto">
          {getScreens(setTab)[tab]}
        </div>
      </main>

      {alert && tab === 'dashboard' && (
        <GlobalAlert onDismiss={() => setAlert(false)} />
      )}

      {/* Floating AI Assistant - available on all screens */}
      <FloatingAIAssistant />
    </div>
  );
}
