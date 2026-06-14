import fs from 'fs';

const targetFile = 'src/App.tsx';
let content = fs.readFileSync(targetFile, 'utf8');

const tTarget = `const [notifSoundConfig, setNotifSoundConfig] = useState({
    posts: true,
    updates: true,
    general: true,
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "notification_sounds"), (snap) => {
      if (snap.exists() && snap.data()) {
        setNotifSoundConfig((prev) => ({ ...prev, ...snap.data() }));
      }
    });
    return () => unsub();
  }, []);`;

const tRepl = `const [notifSoundConfig, setNotifSoundConfig] = useState<any>({
    posts: "default_ding",
    updates: "default_ding",
    general: "default_ding",
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "notification_sounds"), (snap) => {
      if (snap.exists() && snap.data()) {
        const d = snap.data();
        let formatted: any = {};
        ["posts", "updates", "general"].forEach(key => {
            if (typeof d[key] === "boolean") formatted[key] = d[key] ? "default_ding" : "false";
            else if (d[key]) formatted[key] = d[key];
            else formatted[key] = "default_ding";
        });
        setNotifSoundConfig((prev: any) => ({ ...prev, ...formatted }));
      }
    });
    return () => unsub();
  }, []);`;

content = content.replace(tTarget, tRepl);

fs.writeFileSync(targetFile, content, 'utf8');
