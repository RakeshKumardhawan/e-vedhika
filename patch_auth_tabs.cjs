const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const target = `      } else if (user && (currentTab === "admin" || currentTab === "editor")) {
        // Enforce user roles for admin and editor if they managed to set the tab
        if (!canAccessAdmin) {
          setCurrentTab("home");
          setSearchParams(new URLSearchParams());
          addToast(
            "Access Denied: You do not have permissions for this section.",
          );
        }
      }`;

const replacement = `      } else if (user && (currentTab === "admin" || currentTab === "editor")) {
        // Enforce user roles for admin and editor if they managed to set the tab
        if (!canAccessAdmin) {
          startTransition(() => { setCurrentTab("home"); });
          setSearchParams(new URLSearchParams());
          addToast(
            "Access Denied: You do not have permissions for this section.",
          );
        }
      } else if (user && currentTab === "logs") {
        if (!(isAdmin || isDevEmail)) {
          startTransition(() => { setCurrentTab("home"); });
          setSearchParams(new URLSearchParams());
          addToast(
            "Access Denied: You do not have permissions for this section.",
          );
        }
      }`;

content = content.replace(target, replacement);
fs.writeFileSync('src/App.tsx', content);
