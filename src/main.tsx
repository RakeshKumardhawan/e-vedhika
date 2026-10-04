import React, {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';

import { BrowserRouter } from 'react-router-dom';
import './index.css';
import App from './App.tsx';
import { registerSW } from 'virtual:pwa-register';
import { collection, addDoc, doc, getDoc } from 'firebase/firestore';
import { db, auth } from '../firebase';

// Global PWA Update Handler & Registration
if (typeof window !== 'undefined' && 'serviceWorker' in navigator) {
  let refreshing = false;

  // Global helper for manual PWA update
  (window as any).__triggerPWAUpdate = async () => {
    try {
      if ('caches' in window) {
        const cacheNames = await caches.keys();
        await Promise.all(cacheNames.map((name) => caches.delete(name)));
      }
      const regs = await navigator.serviceWorker.getRegistrations();
      for (const reg of regs) {
        await reg.update();
      }
      window.location.reload();
    } catch (e) {
      window.location.reload();
    }
  };

  // When the service worker updates and takes control, reload the page cleanly
  navigator.serviceWorker.addEventListener('controllerchange', () => {
    if (!refreshing) {
      refreshing = true;
      window.location.reload();
    }
  });

  const updateSW = registerSW({
    immediate: true,
    onNeedRefresh() {
      console.log('New PWA version detected! Updating service worker cache...');
      window.dispatchEvent(new CustomEvent('pwa-update-available', { detail: { updateSW } }));
      updateSW(true);
    },
    onOfflineReady() {
      console.log('E-Vedhika PWA ready for offline use');
    },
    onRegisteredSW(swUrl, r) {
      if (r) {
        // Proactive update check every 30s in foreground
        setInterval(() => {
          r.update().catch(() => {});
        }, 30 * 1000);
      }
    }
  });

  // Check on tab focus / visibility resume
  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') {
      navigator.serviceWorker.ready.then((registration) => {
        registration.update().catch(() => {});
      }).catch(() => {});
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
  async logErrorToFirestore(error: Error, errorInfo: React.ErrorInfo) {
    try {
      const user = auth.currentUser;
      let userId = 'Anonymous';
      let userEmail = 'Anonymous User';
      let userRole = 'User';

      if (user) {
        userId = user.uid;
        userEmail = user.email || user.displayName || 'No Email';
        try {
          const userDoc = await getDoc(doc(db, 'users', user.uid));
          if (userDoc.exists()) {
            userRole = userDoc.data().role || 'User';
          }
        } catch (e) {
          console.warn("Failed to fetch user role for error boundary:", e);
        }
      }

      const errorMsg = error.message || 'Unknown Runtime Exception';
      const errorStack = error.stack || '';
      const compStack = errorInfo.componentStack || '';

      // Auto generate possible fix
      let fix = '';
      if (errorMsg.includes('permission') || errorMsg.includes('insufficient')) {
        fix = 'Check Firestore Security Rules or verify user RBAC role permissions.';
      } else if (errorMsg.includes('network') || errorMsg.includes('fetch') || errorMsg.includes('unreachable')) {
        fix = 'Verify server connectivity, API endpoint status, or internet connection.';
      } else if (errorMsg.includes('null') || errorMsg.includes('undefined')) {
        fix = 'Ensure proper state initialization and optional chaining before property access.';
      } else {
        fix = 'Review module stack trace, inspect payload schema, or clear browser local state.';
      }

      await addDoc(collection(db, 'system_errors'), {
        error: errorMsg,
        reason: errorStack.substring(0, 200) || 'Unhandled runtime execution error',
        module: 'Global Error Boundary (Client)',
        time: Date.now(),
        timestamp: Date.now(),
        user: userEmail,
        userId: userId,
        userRole: userRole,
        ip: '127.0.0.1 (Cloud Run Proxy)',
        possibleFix: fix,
        status: 'Unresolved',
        severity: 'Critical',
        stackTrace: errorStack,
        componentStack: compStack,
        url: window.location.href,
        userAgent: navigator.userAgent,
        retryCount: 0
      });
      console.log('Exception successfully logged to system_errors collection.');
    } catch (e) {
      console.error('Failed to log runtime exception to Firestore:', e);
    }
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error("Uncaught error caught by global ErrorBoundary:", error, errorInfo);
    this.logErrorToFirestore(error, errorInfo);
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
