'use client';

import Image from 'next/image';
import { Button } from '@/components/ui/button';
import { ArrowRight, TrendingUp, Activity, Lightbulb, BarChart3 } from 'lucide-react';

/* Brand Logo Component */
function BrandLogo({ size = 40 }: { size?: number }) {
  return (
    <div 
      className="rounded-full overflow-hidden border-2 border-white/30 flex-shrink-0 bg-white"
      style={{ width: size, height: size }}
    >
      <Image
        src="/images/glycocare-logo.jpeg"
        alt="GlycoCare"
        width={size}
        height={size}
        className="object-cover w-full h-full"
        priority
      />
    </div>
  );
}

export default function LandingPage({ onGetStarted }: { onGetStarted: () => void }) {
  return (
    <div className="w-full min-h-screen" style={{ background: 'var(--background)' }}>
      {/* Navigation */}
      <nav className="sticky top-0 w-full z-40 border-b" style={{
        background: 'rgba(255, 248, 214, 0.92)',
        borderColor: 'var(--border)'
      }}>
        <div className="max-w-7xl mx-auto px-6 py-4 flex items-center justify-between">
          {/* Left - Logo and tagline */}
          <div className="flex items-center gap-3">
            <BrandLogo size={36} />
            <div className="flex flex-col">
              <span className="font-bold text-sm" style={{ color: 'var(--foreground)' }}>GlycoCare</span>
              <span className="text-xs" style={{ color: 'var(--muted-foreground)' }}>Manage Your Blood Sugar</span>
            </div>
          </div>

          {/* Right - Navigation and CTA */}
          <div className="flex items-center gap-6">
            <button className="transition" style={{ color: 'var(--muted-foreground)' }}>Features</button>
            <button className="transition" style={{ color: 'var(--muted-foreground)' }}>Pricing</button>
            <button className="transition" style={{ color: 'var(--muted-foreground)' }}>About</button>
            <Button onClick={onGetStarted} className="rounded-full font-semibold" style={{
              background: 'var(--primary)',
              color: 'var(--primary-foreground)'
            }}>Get Started</Button>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-20 pb-20 px-6">
        <div className="max-w-7xl mx-auto grid lg:grid-cols-2 gap-12 items-center">
          {/* Left side - Text */}
          <div className="space-y-8">
            <div className="space-y-4">
              <div className="inline-block px-4 py-2 rounded-full font-semibold text-sm" style={{
                background: 'var(--secondary)',
                color: 'var(--secondary-foreground)'
              }}>
                Smart Glucose Management
              </div>

              <h1 className="text-5xl lg:text-6xl font-bold leading-tight text-balance" style={{ color: 'var(--foreground)' }}>
                GlycoCare
              </h1>
              <p className="text-lg leading-relaxed text-pretty" style={{ color: 'var(--muted-foreground)' }}>
                GlycoCare helps you monitor, understand, and improve your glucose levels with personalized insights and real-time alerts.
              </p>
            </div>
            <div className="flex flex-col sm:flex-row gap-4">
              <Button onClick={onGetStarted} className="px-8 h-12 rounded-full text-base flex items-center gap-2 font-semibold" style={{
                background: 'var(--primary)',
                color: 'var(--primary-foreground)'
              }}>
                Start Free Trial
                <ArrowRight className="w-4 h-4" />
              </Button>
              <Button className="px-8 h-12 rounded-full text-base font-semibold border-2" style={{
                borderColor: 'var(--border)',
                color: 'var(--foreground)',
                background: 'var(--card)'
              }}>
                Watch Demo
              </Button>
            </div>
            <div className="text-sm" style={{ color: 'var(--muted-foreground)' }}>
              ✓ No credit card required • ✓ 30-day free trial • ✓ Cancel anytime
            </div>
          </div>

          {/* Right side - Hero Visual */}
          <div className="relative">
            <div className="relative rounded-3xl p-8 shadow-lg border" style={{
              background: 'var(--card)',
              borderColor: 'var(--border)'
            }}>
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <h3 className="font-semibold" style={{ color: 'var(--foreground)' }}>Today&apos;s Status</h3>
                  <span className="text-sm font-medium" style={{ color: 'var(--primary)' }}>Normal</span>
                </div>
                <div className="space-y-2">
                  <div className="flex items-baseline gap-2">
                    <span className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>128</span>
                    <span style={{ color: 'var(--muted-foreground)' }}>mg/dL</span>
                  </div>
                  <div className="w-full h-2 rounded-full overflow-hidden" style={{ background: 'var(--muted)' }}>
                    <div className="h-full w-3/4 rounded-full" style={{ background: 'var(--primary)' }} />
                  </div>
                </div>
                <div className="grid grid-cols-3 gap-4 pt-4" style={{ borderTopColor: 'var(--border)', borderTopWidth: '1px' }}>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>12</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>Readings</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>6.2%</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>A1C Avg</p>
                  </div>
                  <div className="text-center">
                    <p className="text-2xl font-bold" style={{ color: 'var(--foreground)' }}>95%</p>
                    <p className="text-xs mt-1" style={{ color: 'var(--muted-foreground)' }}>In Range</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6" style={{ background: 'var(--card)' }}>
        <div className="max-w-7xl mx-auto">
          <div className="text-center space-y-4 mb-16">
            <h2 className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>Powerful Features for Better Health</h2>
            <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted-foreground)' }}>
              Everything you need to understand and manage your glucose levels effectively.
            </p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {/* Feature 1 */}
            <div className="p-8 rounded-2xl border" style={{
              background: 'var(--background)',
              borderColor: 'var(--border)'
            }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{
                background: 'var(--secondary)',
                color: 'var(--primary)'
              }}>
                <Activity className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Real-Time Monitoring</h3>
              <p style={{ color: 'var(--muted-foreground)' }}>
                Get instant alerts when your glucose levels go outside your target range, day or night.
              </p>
            </div>

            {/* Feature 2 */}
            <div className="p-8 rounded-2xl border" style={{
              background: 'var(--background)',
              borderColor: 'var(--border)'
            }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{
                background: 'var(--secondary)',
                color: 'var(--primary)'
              }}>
                <BarChart3 className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Smart Insights</h3>
              <p style={{ color: 'var(--muted-foreground)' }}>
                AI-powered analysis of your patterns helps you make better dietary and lifestyle decisions.
              </p>
            </div>

            {/* Feature 3 */}
            <div className="p-8 rounded-2xl border" style={{
              background: 'var(--background)',
              borderColor: 'var(--border)'
            }}>
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4" style={{
                background: 'var(--secondary)',
                color: 'var(--primary)'
              }}>
                <Lightbulb className="w-6 h-6" />
              </div>
              <h3 className="text-xl font-bold mb-2" style={{ color: 'var(--foreground)' }}>Personalized Guidance</h3>
              <p style={{ color: 'var(--muted-foreground)' }}>
                Get tailored recommendations based on your unique glucose patterns and health goals.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="py-20 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8">
            <div className="text-center">
              <div className="flex items-center justify-center gap-2 mb-2">
                <TrendingUp className="w-6 h-6" style={{ color: 'var(--primary)' }} />
                <span className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>98%</span>
              </div>
              <p style={{ color: 'var(--muted-foreground)' }}>Users report better control</p>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>50K+</span>
              <p style={{ color: 'var(--muted-foreground)' }}>Active users worldwide</p>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>24/7</span>
              <p style={{ color: 'var(--muted-foreground)' }}>Real-time monitoring</p>
            </div>
            <div className="text-center">
              <span className="text-4xl font-bold" style={{ color: 'var(--foreground)' }}>4.9★</span>
              <p style={{ color: 'var(--muted-foreground)' }}>User satisfaction rating</p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 px-6" style={{ background: 'var(--primary)' }}>
        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="space-y-4">
            <h2 className="text-4xl font-bold" style={{ color: 'var(--primary-foreground)' }}>Ready to Take Control?</h2>
            <p className="text-lg" style={{ color: 'rgba(240, 248, 255, 0.8)' }}>
              Join thousands of users managing their glucose with confidence and ease.
            </p>
          </div>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button onClick={onGetStarted} className="px-8 h-12 rounded-full text-base font-semibold" style={{
              background: 'var(--primary-foreground)',
              color: 'var(--primary)'
            }}>
              Start Free Trial Now
            </Button>
            <Button className="px-8 h-12 rounded-full text-base font-semibold border-2" style={{
              borderColor: 'var(--primary-foreground)',
              color: 'var(--primary-foreground)',
              background: 'transparent'
            }}>
              Schedule a Demo
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer style={{ background: 'var(--sidebar-bg)', color: 'var(--sidebar-fg)' }} className="py-12 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="grid md:grid-cols-4 gap-8 mb-8">
            <div>
              <div className="flex items-center gap-3 mb-4">
                <BrandLogo size={40} />
                <span className="font-bold" style={{ color: 'var(--sidebar-fg)' }}>GlycoCare</span>
              </div>
              <p className="text-sm opacity-70">Smart glucose management for everyone.</p>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--sidebar-fg)' }}>Product</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100 transition">Features</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Pricing</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Security</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--sidebar-fg)' }}>Company</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100 transition">About</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Blog</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Careers</a></li>
              </ul>
            </div>
            <div>
              <h4 className="font-semibold mb-4" style={{ color: 'var(--sidebar-fg)' }}>Legal</h4>
              <ul className="space-y-2 text-sm opacity-70">
                <li><a href="#" className="hover:opacity-100 transition">Privacy</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Terms</a></li>
                <li><a href="#" className="hover:opacity-100 transition">Contact</a></li>
              </ul>
            </div>
          </div>
          <div className="pt-8 text-center text-sm opacity-60" style={{ borderTopColor: 'rgba(255,255,255,0.1)', borderTopWidth: '1px' }}>
            <p>&copy; 2026 GlycoCare. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}
