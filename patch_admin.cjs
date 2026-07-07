const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target1 = `  const [logs, setLogs] = useState<any[]>([]);`;
content = content.replace(target1, '');

const target2 = `  const [logsError, setLogsError] = useState(false);`;
content = content.replace(target2, '');

const target3 = `  const [logSearchTerm, setLogSearchTerm] = useState("");`;
content = content.replace(target3, '');

const target4 = `  useEffect(() => {
    const unsubLogs = onSnapshot(
      query(collection(db, "security_logs"), orderBy("time", "desc")),
      (snap) => {
        const lList: any[] = [];
        snap.forEach((d) => lList.push({ id: d.id, ...d.data() }));
        setLogs(lList);
        setLogsError(false);
      },
      (err) => {
        setLogsError(true);
        console.error("Logs error:", err);
      },
    );
    return () => unsubLogs();
  }, []);`;
content = content.replace(target4, '');

fs.writeFileSync('src/App.tsx', content);
