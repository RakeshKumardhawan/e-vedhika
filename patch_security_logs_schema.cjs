const fs = require('fs');

// Fix TechCommunityModeration.tsx
let content = fs.readFileSync('src/components/admin/TechCommunityModeration.tsx', 'utf8');
content = content.replace(/action: "Post Published",\s*target: id,\s*timestamp: Date\.now\(\),\s*actor: "Admin"/g, 'category: "PERMISSION_CHANGE", title: "Post Published", description: "Post " + id + " was published", admin: "Admin", time: Date.now()');
content = content.replace(/action: "Post Rejected",\s*target: id,\s*timestamp: Date\.now\(\),\s*actor: "Admin"/g, 'category: "DELETE", title: "Post Rejected", description: "Post " + id + " was rejected", admin: "Admin", time: Date.now()');
content = content.replace(/action: "Post Moved to Private Support",\s*target: id,\s*timestamp: Date\.now\(\),\s*actor: "Admin"/g, 'category: "SETTINGS_CHANGE", title: "Post Moved to Private Support", description: "Post " + id + " was moved to private support", admin: "Admin", time: Date.now()');
fs.writeFileSync('src/components/admin/TechCommunityModeration.tsx', content, 'utf8');

// Fix EmergencyBroadcast.tsx
let content2 = fs.readFileSync('src/components/admin/EmergencyBroadcast.tsx', 'utf8');
content2 = content2.replace(/action: "Broadcast Message Sent",\s*target: targetType === 'all' \? 'All Users' : targetUid,\s*timestamp: Date\.now\(\),\s*actor: "Admin"/g, 'category: "SETTINGS_CHANGE", title: "Broadcast Message Sent", description: "Broadcast sent to " + (targetType === "all" ? "All Users" : targetUid), admin: "Admin", time: Date.now()');
fs.writeFileSync('src/components/admin/EmergencyBroadcast.tsx', content2, 'utf8');

