'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff, Mail, Lock, ArrowLeft } from 'lucide-react';

interface LoginPageProps {
  onLogin: () => void;
  onBack: () => void;
}

export default function LoginPage({ onLogin, onBack }: LoginPageProps) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    setIsLoading(true);

    // Simulate login - replace with actual auth
    await new Promise(resolve => setTimeout(resolve, 1000));

    if (email && password) {
      onLogin();
    } else {
      setError('Please enter both email and password');
    }
    setIsLoading(false);
  };

  return (
    <div className="min-h-screen w-full flex" style={{ background: 'var(--background)' }}>
      {/* Left side - Branding */}
      <div
        className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12"
        style={{ background: 'var(--sidebar-bg)' }}
      >
        <div>
          <button
            onClick={onBack}
            className="flex items-center gap-2 text-sm font-medium opacity-70 hover:opacity-100 transition-opacity"
            style={{ color: 'var(--sidebar-fg)' }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>
        </div>

        <div className="space-y-8">
          <div className="flex items-center gap-4">
            <div className="w-16 h-16 rounded-full overflow-hidden border-2 border-white/30 bg-white">
              <Image
                src="/images/glycocare-logo.jpeg"
                alt="GlycoCare"
                width={64}
                height={64}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <span className="text-3xl font-bold" style={{ color: 'var(--sidebar-fg)' }}>
              GlycoCare
            </span>
          </div>

          <div className="space-y-4">
            <h1 className="text-4xl font-bold leading-tight text-balance" style={{ color: 'var(--sidebar-fg)' }}>
              Monitor. Understand. Improve.
            </h1>
            <p className="text-lg opacity-70 leading-relaxed text-pretty" style={{ color: 'var(--sidebar-fg)' }}>
              Your personal AI-powered glucose management companion. Get real-time insights and predictions to help you live healthier.
            </p>
          </div>

          {/* Feature highlights */}
          <div className="space-y-4 pt-4">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--sidebar-active)' }}>
                <span className="text-sm font-bold" style={{ color: 'var(--sidebar-active-fg)' }}>1</span>
              </div>
              <span className="font-medium" style={{ color: 'var(--sidebar-fg)' }}>Real-time glucose monitoring</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--sidebar-active)' }}>
                <span className="text-sm font-bold" style={{ color: 'var(--sidebar-active-fg)' }}>2</span>
              </div>
              <span className="font-medium" style={{ color: 'var(--sidebar-fg)' }}>AI-powered predictions</span>
            </div>
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full flex items-center justify-center" style={{ background: 'var(--sidebar-active)' }}>
                <span className="text-sm font-bold" style={{ color: 'var(--sidebar-active-fg)' }}>3</span>
              </div>
              <span className="font-medium" style={{ color: 'var(--sidebar-fg)' }}>Personalized health insights</span>
            </div>
          </div>
        </div>

        <div>
          <p className="text-sm opacity-50" style={{ color: 'var(--sidebar-fg)' }}>
            &copy; 2026 GlycoCare. All rights reserved.
          </p>
        </div>
      </div>

      {/* Right side - Login Form */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6 lg:p-12">
        <div className="w-full max-w-md space-y-8">
          {/* Mobile back button */}
          <button
            onClick={onBack}
            className="lg:hidden flex items-center gap-2 text-sm font-medium transition-colors"
            style={{ color: 'var(--muted-foreground)' }}
          >
            <ArrowLeft size={16} />
            Back to Home
          </button>

          {/* Mobile logo */}
          <div className="lg:hidden flex items-center gap-3 justify-center">
            <div className="w-12 h-12 rounded-full overflow-hidden border-2 bg-white" style={{ borderColor: 'var(--border)' }}>
              <Image
                src="/images/glycocare-logo.jpeg"
                alt="GlycoCare"
                width={48}
                height={48}
                className="object-cover w-full h-full"
                priority
              />
            </div>
            <span className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>
              GlycoCare
            </span>
          </div>

          {/* Form header */}
          <div className="text-center lg:text-left space-y-2">
            <h2 className="text-3xl font-bold" style={{ color: 'var(--foreground)' }}>
              Welcome back
            </h2>
            <p style={{ color: 'var(--muted-foreground)' }}>
              Sign in to continue managing your glucose levels
            </p>
          </div>

          {/* Login form */}
          <form onSubmit={handleSubmit} className="space-y-5">
            {error && (
              <div
                className="p-4 rounded-xl text-sm font-medium"
                style={{ background: 'rgba(229, 62, 62, 0.1)', color: 'var(--destructive)' }}
              >
                {error}
              </div>
            )}

            {/* Email field */}
            <div className="space-y-2">
              <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                Email address
              </label>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }}>
                  <Mail size={18} />
                </div>
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="name@example.com"
                  className="w-full h-12 pl-12 pr-4 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                  }}
                />
              </div>
            </div>

            {/* Password field */}
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <label className="text-sm font-semibold" style={{ color: 'var(--foreground)' }}>
                  Password
                </label>
                <button
                  type="button"
                  className="text-sm font-medium transition-colors hover:underline"
                  style={{ color: 'var(--primary)' }}
                >
                  Forgot password?
                </button>
              </div>
              <div className="relative">
                <div className="absolute left-4 top-1/2 -translate-y-1/2" style={{ color: 'var(--muted-foreground)' }}>
                  <Lock size={18} />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="Enter your password"
                  className="w-full h-12 pl-12 pr-12 rounded-xl border text-sm font-medium transition-colors focus:outline-none focus:ring-2"
                  style={{
                    background: 'var(--card)',
                    borderColor: 'var(--border)',
                    color: 'var(--foreground)',
                  }}
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-1/2 -translate-y-1/2 transition-colors"
                  style={{ color: 'var(--muted-foreground)' }}
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember me */}
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="remember"
                className="w-4 h-4 rounded border-2 accent-[var(--primary)]"
                style={{ borderColor: 'var(--border)' }}
              />
              <label htmlFor="remember" className="text-sm font-medium" style={{ color: 'var(--muted-foreground)' }}>
                Remember me for 30 days
              </label>
            </div>

            {/* Submit button */}
            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-12 rounded-xl text-base font-semibold transition-all"
              style={{
                background: 'var(--primary)',
                color: 'var(--primary-foreground)',
                opacity: isLoading ? 0.7 : 1,
              }}
            >
              {isLoading ? (
                <span className="flex items-center gap-2">
                  <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Signing in...
                </span>
              ) : (
                'Sign in'
              )}
            </Button>

            {/* Divider */}
            <div className="relative py-4">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t" style={{ borderColor: 'var(--border)' }} />
              </div>
              <div className="relative flex justify-center">
                <span className="px-4 text-sm" style={{ background: 'var(--background)', color: 'var(--muted-foreground)' }}>
                  or continue with
                </span>
              </div>
            </div>

            {/* Social login */}
            <div className="grid grid-cols-2 gap-3">
              <button
                type="button"
                className="h-12 rounded-xl border font-semibold text-sm transition-colors hover:bg-black/5 flex items-center justify-center gap-2"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <svg className="w-5 h-5" viewBox="0 0 24 24">
                  <path
                    fill="currentColor"
                    d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                  />
                  <path
                    fill="currentColor"
                    d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                  />
                  <path
                    fill="currentColor"
                    d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                  />
                </svg>
                Google
              </button>
              <button
                type="button"
                className="h-12 rounded-xl border font-semibold text-sm transition-colors hover:bg-black/5 flex items-center justify-center gap-2"
                style={{ borderColor: 'var(--border)', color: 'var(--foreground)' }}
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12.152 6.896c-.948 0-2.415-1.078-3.96-1.04-2.04.027-3.91 1.183-4.961 3.014-2.117 3.675-.546 9.103 1.519 12.09 1.013 1.454 2.208 3.09 3.792 3.039 1.52-.065 2.09-.987 3.935-.987 1.831 0 2.35.987 3.96.948 1.637-.026 2.676-1.48 3.676-2.948 1.156-1.688 1.636-3.325 1.662-3.415-.039-.013-3.182-1.221-3.22-4.857-.026-3.04 2.48-4.494 2.597-4.559-1.429-2.09-3.623-2.324-4.39-2.376-2-.156-3.675 1.09-4.61 1.09zM15.53 3.83c.843-1.012 1.4-2.427 1.245-3.83-1.207.052-2.662.805-3.532 1.818-.78.896-1.454 2.338-1.273 3.714 1.338.104 2.715-.688 3.559-1.701" />
                </svg>
                Apple
              </button>
            </div>

            {/* Sign up link */}
            <p className="text-center text-sm" style={{ color: 'var(--muted-foreground)' }}>
              {"Don't have an account? "}
              <button
                type="button"
                className="font-semibold transition-colors hover:underline"
                style={{ color: 'var(--primary)' }}
              >
                Sign up for free
              </button>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}
