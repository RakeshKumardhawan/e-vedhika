import fs from 'fs';

const file = 'src/App.tsx';
let content = fs.readFileSync(file, 'utf8');

const tNTarget = `export const triggerNotification = (title: string, body: string) => {
  playNotificationSound();`;
const tNRepl = `export const triggerNotification = (title: string, body: string, playSound: boolean = true) => {
  if (playSound) playNotificationSound();`;

content = content.replace(tNTarget, tNRepl);

// Wait, the state
const stateTarget = `  const [dataLoading, setDataLoading] = useState(true);`;
const stateRepl = `  const [dataLoading, setDataLoading] = useState(true);
  const [notifSoundConfig, setNotifSoundConfig] = useState({
    posts: true,
    updates: true,
    general: true,
  });

  useEffect(() => {
    const unsub = onSnapshot(doc(db, "settings", "notification_sounds"), (snap) => {
      if (snap.exists()) {
        setNotifSoundConfig((prev) => ({ ...prev, ...(snap.data() as any) }));
      }
    });
    return () => unsub();
  }, []);`;
  
content = content.replace(stateTarget, stateRepl);

fs.writeFileSync(file, content, 'utf8');
