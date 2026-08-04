import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import { db, analyticsDb } from '../../firebase';
import { collection, addDoc } from 'firebase/firestore';
import { UAParser } from 'ua-parser-js';

export function VisitorTracker({ user }: { user: any }) {
  const location = useLocation();
  const sessionToken = useRef(sessionStorage.getItem('visitor_session') || crypto.randomUUID());
  const hasTrackedInitial = useRef(false);

  useEffect(() => {
    sessionStorage.setItem('visitor_session', sessionToken.current);
    
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
          await addDoc(collection(analyticsDb, "visitor_logs"), {
            uid: user?.uid || "anonymous",
            email: user?.email || "anonymous",
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
