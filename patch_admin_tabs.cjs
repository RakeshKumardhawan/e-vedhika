const fs = require('fs');
let content = fs.readFileSync('src/components/SuperAdminDashboard.tsx', 'utf8');

// Add imports
content = content.replace("import { ExeUbdLiveMonitoring } from './ExeUbdLiveMonitoring';", 
`import { ExeUbdLiveMonitoring } from './ExeUbdLiveMonitoring';
import { AdminInbox } from './admin/AdminInbox';
import { UserChatManagement } from './admin/UserChatManagement';`);

// Add items to Desktop Sidebar
const tabRegex = /{ id: "settings", icon: Settings, label: "Master Settings" },/;
content = content.replace(tabRegex, 
`{ id: "admin_inbox", icon: FileText, label: "Admin Inbox" },
            { id: "chat_mgmt", icon: MessageSquare, label: "User Chat Mgmt" },
            { id: "settings", icon: Settings, label: "Master Settings" },`);

// Add items to Mobile Tabs
const mobileTabRegex = /{ id: "settings", icon: Settings, label: "Settings" },/;
content = content.replace(mobileTabRegex, 
`{ id: "admin_inbox", icon: FileText, label: "Admin Inbox" },
            { id: "chat_mgmt", icon: MessageSquare, label: "Chat Mgmt" },
            { id: "settings", icon: Settings, label: "Settings" },`);

// Add rendering logic
const renderRegex = /activeTab === "users" \? \(/;
content = content.replace(renderRegex, 
`activeTab === "admin_inbox" ? (
              <AdminInbox user={user} />
            ) : activeTab === "chat_mgmt" ? (
              <UserChatManagement />
            ) : activeTab === "users" ? (`);

fs.writeFileSync('src/components/SuperAdminDashboard.tsx', content, 'utf8');
