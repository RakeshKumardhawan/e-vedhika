const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

// Import the modal
content = content.replace("import { WelcomeModal } from './components/WelcomeModal';", "import { WelcomeModal } from './components/WelcomeModal';\nimport { ContactAdminModal } from './components/ContactAdminModal';");

// Add state for the modal
const stateRegex = /const \[showProfileModal, setShowProfileModal\] = useState\(false\);/;
content = content.replace(stateRegex, "const [showProfileModal, setShowProfileModal] = useState(false);\n  const [showContactAdmin, setShowContactAdmin] = useState(false);");

// Add it to the rendering (just before </main>)
const renderRegex = /\{showProfileModal && \(\s*<UserProfileModal[\s\S]*?\/>\s*\)\}/;
content = content.replace(renderRegex, `{showProfileModal && (\n          <UserProfileModal\n            user={user}\n            userProfile={userProfile || user}\n            onClose={() => setShowProfileModal(false)}\n            addToast={addToast}\n          />\n        )}\n        {showContactAdmin && (\n          <ContactAdminModal user={user} userProfile={userProfile || user} onClose={() => setShowContactAdmin(false)} />\n        )}`);

// Add button to Profile Dropdown (Desktop/Top Right)
const editProfileBtn = /<button[\s\S]*?Edit Profile[\s\S]*?<\/button>/;
const contactAdminBtn = `<button
                      aria-label="Message Admin"
                      onClick={() => {
                        setShowContactAdmin(true);
                        setShowProfileDropdown(false);
                      }}
                      className="w-full flex items-center gap-3 px-4 py-2.5 text-sm font-bold text-slate-700 hover:bg-purple-50 transition-colors rounded-xl group text-left"
                    >
                      <div className="p-2 bg-purple-50 text-purple-600 rounded-lg group-hover:bg-purple-100 transition-colors">
                        <Mail size={18} />
                      </div>
                      Message Admin
                    </button>
                    <div className="h-px bg-slate-100 my-1 mx-2" />`;

// Let's do it right before the Edit Profile button.
content = content.replace(editProfileBtn, match => contactAdminBtn + '\n' + match);

fs.writeFileSync('src/App.tsx', content, 'utf8');
