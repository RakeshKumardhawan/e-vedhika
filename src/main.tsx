import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register';

// Automatically check for updates and update the service worker
if ('serviceWorker' in navigator) {
  let refreshing = false;
  
  // Clean up any stale/broken legacy service workers registered on root
  navigator.serviceWorker.getRegistrations().then((registrations) => {
    const currentSWUrl = window.location.origin + '/sw.js';
    for (let registration of registrations) {
      if (registration.active && !registration.active.scriptURL.includes('sw.js')) {
        registration.unregister();
      }
    }
  }).catch(() => {});

  // When the service worker updates and takes control, reload the page instantly
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  // Check for updates proactively when the app is resumed (opened again)
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update().catch(() => {});
      });
    }
  });

  // Also check for updates every 2 minutes automatically in the background
  setInterval(() => {
    navigator.serviceWorker.ready.then((registration) => {
      if (registration) {
        registration.update().catch(() => {});
      }
    });
  }, 2 * 60 * 1000);

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      updateSW(true);
    },
    onOfflineReady() {
      console.log('E-Vedhika PWA ready for offline use');
    }
  });
}

class ErrorBoundary extends React.Component<{children: React.ReactNode}, {hasError: boolean, error: Error | null, countdown: number}> {
  private timer: any;
  constructor(props: {children: React.ReactNode}) {
    super(props);
    this.state = { hasError: false, error: null, countdown: 10 };
  }
  static getDerivedStateFromError(error: Error) {
    return { hasError: true, error, countdown: 10 };
  }
  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error:", error, errorInfo);
    // Auto-recovery mechanism - only clear things if it's likely a persistent issue
    // but don't do it on every minor issue if we want to be less "over"
  }

  componentDidUpdate(prevProps: any, prevState: any) {
    if (this.state.hasError && !prevState.hasError) {
      this.timer = setInterval(() => {
        this.setState(s => {
          if (s.countdown <= 1) {
            clearInterval(this.timer);
            // Before reloading, we could try to just reset state, but for a true crash we reload
            window.location.reload(); 
            return { ...s, countdown: 0 };
          }
          return { ...s, countdown: s.countdown - 1 };
        });
      }, 1000);
    }
  }

  componentWillUnmount() {
    if (this.timer) clearInterval(this.timer);
  }
  render() {
    if (this.state.hasError) {
      return (
        <div style={{ height: '100vh', width: '100vw', display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', background: '#020617', color: '#fff', fontFamily: 'Inter, system-ui, sans-serif', padding: '24px', textAlign: 'center' }}>
          <div style={{ padding: '40px', background: 'rgba(30, 41, 59, 0.3)', borderRadius: '48px', border: '1px solid rgba(255,255,255,0.05)', backdropFilter: 'blur(20px)', maxWidth: '500px', width: '100%', boxShadow: '0 25px 50px -12px rgba(0, 0, 0, 0.5)' }}>
            <div style={{ background: 'linear-gradient(135deg, #6366f1, #a855f7)', width: '64px', height: '64px', borderRadius: '20px', display: 'flex', alignItems: 'center', justifyContent: 'center', margin: '0 auto 20px', boxShadow: '0 0 30px rgba(99, 102, 241, 0.2)' }}>
              <span style={{ fontSize: '32px' }}>✨</span>
            </div>
            <h1 style={{ fontSize: '24px', fontWeight: '900', marginBottom: '8px', letterSpacing: '-0.02em', color: '#f8fafc' }}>E-Vedhika System Check</h1>
            <p style={{ fontSize: '15px', fontWeight: '500', lineHeight: '1.6', marginBottom: '20px', color: '#94a3b8' }}>
              We noticed a minor issue. We're performing a quick system refresh to keep things running smoothly.
              <br/><span style={{ fontSize: "13px", opacity: 0.7 }}>(చిన్న లోపం సరిదిద్దబడుతోంది... దయచేసి వేచి ఉండండి)</span><br/><textarea readOnly style={{width:"100%", height:"100px", color:"red", background:"black", fontSize:"10px", marginTop:"10px"}} value={this.state.error?.stack || this.state.error?.message}></textarea>
            </p>
            <div style={{ padding: '12px 24px', background: 'rgba(99, 102, 241, 0.1)', borderRadius: '16px', border: '1px solid rgba(99, 102, 241, 0.1)', display: 'inline-flex', alignItems: 'center', gap: '8px', fontSize: '16px', fontWeight: '700', color: '#818cf8', marginBottom: '24px' }}>
              Refreshing in {this.state.countdown}s
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button 
                onClick={() => window.location.reload()} 
                style={{ flex: 1, background: '#fff', color: '#020617', border: 'none', padding: '14px 20px', borderRadius: '14px', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Refresh Now
              </button>
              <button 
                onClick={() => this.setState({ hasError: false })} 
                style={{ flex: 1, background: 'rgba(255,255,255,0.05)', color: '#fff', border: '1px solid rgba(255,255,255,0.1)', padding: '14px 20px', borderRadius: '14px', fontWeight: '800', fontSize: '13px', textTransform: 'uppercase', letterSpacing: '0.05em', cursor: 'pointer', transition: 'all 0.2s' }}
              >
                Go Back
              </button>
            </div>
          </div>
          
          <style>{`
            @keyframes ping { 75%, 100% { transform: scale(2); opacity: 0; } }
            body { margin: 0; background: #020617; overflow: hidden; }
          `}</style>
        </div>
      );
    }
    return this.props.children;
  }
}

createRoot(document.getElementById('root')!).render(
  <BrowserRouter>
    <ErrorBoundary>
      <App />
    </ErrorBoundary>
  </BrowserRouter>
);
