const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/\{ id: "dash", label: "Analytics Hub", emoji: "[^"]*" \}/g, '{ id: "dash", label: "Analytics Hub", icon: BarChart3 }');
c = c.replace(/\{ id: "reports", label: "Posts & Issues", emoji: "[^"]*" \}/g, '{ id: "reports", label: "Posts & Issues", icon: FileText }');
c = c.replace(/\{ id: "updates", label: "Flash News", emoji: "[^"]*" \}/g, '{ id: "updates", label: "Flash News", icon: Zap }');
c = c.replace(/\{ id: "users", label: "User Access", emoji: "[^"]*" \}/g, '{ id: "users", label: "User Access", icon: Users }');
c = c.replace(/label: "Staff Management",\s*emoji: "[^"]*",/g, 'label: "Staff Management", icon: Shield,');
c = c.replace(/\{ id: "logs", label: "Security Logs", emoji: "[^"]*" \}/g, '{ id: "logs", label: "Security Logs", icon: ShieldAlert }');
c = c.replace(/label: "Farmer Registry Logs",\s*emoji: "[^"]*",/g, 'label: "Farmer Registry Logs", icon: FileText,');
c = c.replace(/label: "Survey Reports",\s*emoji: "[^"]*",/g, 'label: "Survey Reports", icon: Database,');
c = c.replace(/label: "[^a-zA-Z]*About E-Vedhika",\s*emoji: "[^"]*",/g, 'label: "About E-Vedhika", icon: Info,');

fs.writeFileSync('src/App.tsx', c);
console.log('Fixed admin menus');
