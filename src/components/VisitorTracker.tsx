import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { db, analyticsDb } from '../../firebase';
import { collection, addDoc, doc, setDoc, increment } from 'firebase/firestore';
import { UAParser } from 'ua-parser-js';

function getSafeUUID(): string {
  try {
    if (typeof window !== 'undefined' && window.crypto && typeof window.crypto.randomUUID === 'function') {
      return window.crypto.randomUUID();
    }
  } catch (e) {}
  return 'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g, function(c) {
    const r = (Math.random() * 16) | 0;
    const v = c === 'x' ? r : (r & 0x3) | 0x8;
    return v.toString(16);
  });
}

function getStoredSession(): string {
  try {
    return sessionStorage.getItem('visitor_session') || getSafeUUID();
  } catch (e) {
    return getSafeUUID();
  }
}

export function VisitorTracker({ user, userProfile }: { user: any; userProfile?: any }) {
  const location = useLocation();
  const sessionToken = useRef(getStoredSession());
  const hasTrackedInitial = useRef(false);

  useEffect(() => {
    try {
      sessionStorage.setItem('visitor_session', sessionToken.current);
    } catch (e) {}
    
    const track = async () => {

      try {
        let ip = "Unknown";
        if (!hasTrackedInitial.current) {
          try {
            const ipRes = await fetch('https://api.ipify.org?format=json');
            const ipData = await ipRes.json();
            ip = ipData.ip;
          } catch(e) {}
          hasTrackedInitial.current = true;
        }
        
        const parser = new UAParser();
        const result = parser.getResult();
        
        try {
          const uName = userProfile?.name || user?.displayName || "";
          const uUsername = userProfile?.username || "";
          await addDoc(collection(analyticsDb, "visitor_logs"), {
            uid: user?.uid || "anonymous",
            email: user?.email || "anonymous",
            username: uUsername,
            name: uName,
            path: location.pathname + location.search,
            url: window.location.href,
            userAgent: navigator.userAgent,
            browser: (result.browser.name || "Browser") + " " + (result.browser.version || ""),
            os: (result.os.name || "OS") + " " + (result.os.version || ""),
            device: result.device.type || "desktop",
            resolution: window.innerWidth + "x" + window.innerHeight,
            language: navigator.language,
            timezone: Intl.DateTimeFormat().resolvedOptions().timeZone,
            timestamp: Date.now(),
            sessionToken: sessionToken.current,
            ip
          });

          // Day-by-Day Traffic Logging
          const today = new Date().toLocaleDateString('en-CA'); // YYYY-MM-DD
          const dailyRef = doc(analyticsDb, "daily_traffic", today);
          await setDoc(dailyRef, {
            date: today,
            visits: increment(1),
            lastUpdated: Date.now()
          }, { merge: true });

        } catch (fsErr) {
          // Ignore analytics write errors gracefully
        }
      } catch (err) {
        // Silent error suppression
      }
    };

    track();
  }, [location.pathname, location.search, user]);

  return null;
}
