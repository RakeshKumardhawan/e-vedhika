const fs = require('fs');
let c = fs.readFileSync('src/App.tsx', 'utf8');

c = c.replace(/label="[^a-zA-Z]*Home"/g, 'label="Home" icon={Home}');
c = c.replace(/label="[^a-zA-Z]*Mana Panchayath"/g, 'label="Mana Panchayath" icon={Building}');
c = c.replace(/label="[^a-zA-Z]*Emergency Contacts"/g, 'label="Emergency Contacts" icon={AlertTriangle}');
c = c.replace(/label="[^a-zA-Z]*My Activity & Reports"/g, 'label="My Activity & Reports" icon={Activity}');
c = c.replace(/label="[^a-zA-Z]*Edit Profile"/g, 'label="Edit Profile" icon={Settings}');
c = c.replace(/label="Live Chat"/g, 'label="Live Chat" icon={MessageCircle}');
c = c.replace(/label="Union Corner & Polls"/g, 'label="Union Corner & Polls" icon={Vote}');
c = c.replace(/label="What's New!.*"/g, 'label="What\'s New!" icon={Megaphone}');
c = c.replace(/label="[^a-zA-Z]*Public suggestions & Feedback"/g, 'label="Public Suggestions & Feedback" icon={MessageSquare}');
c = c.replace(/label="[^a-zA-Z]*Applications, Formats & GOs"/g, 'label="Applications, Formats & GOs" icon={FileText}');
c = c.replace(/label="[^a-zA-Z]*Useful Information"/g, 'label="Useful Information" icon={Info}');
c = c.replace(/label="[^a-zA-Z]*Excel A4 Print"/g, 'label="Excel A4 Print" icon={FileSpreadsheet}');
c = c.replace(/label="[^a-zA-Z]*Return to Portal"/g, 'label="Return to Portal" icon={ArrowLeft}');
c = c.replace(/label="Page Builder"/g, 'label="Page Builder" icon={Wrench}');
c = c.replace(/label="Locations"/g, 'label="Locations" icon={MapPin}');
c = c.replace(/label="System Config"/g, 'label="System Config" icon={Settings}');
c = c.replace(/label="Gemini AI"/g, 'label="Gemini AI" icon={Bot}');
c = c.replace(/label="[^a-zA-Z]*Admin Panel"/g, 'label="Admin Panel" icon={Shield}');

// Remove all emojis from MenuButton calls
c = c.replace(/\n\s*emoji="[^"]*"/g, '');

fs.writeFileSync('src/App.tsx', c);
console.log('Fixed MenuButtons');
