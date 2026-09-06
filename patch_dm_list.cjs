const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `const filteredUsers = allUsers
      .filter(u => u.id !== user.uid)
      .map(u => {`;

const replacement = `const officialConv = conversations.get("e-vedika-official");
    const officialUser = {
      id: "e-vedika-official",
      name: "e-Vedika Team",
      role: "system",
      lastMessageAt: officialConv ? officialConv.lastMessageAt : 0,
      lastMessageText: officialConv ? officialConv.lastMessageText : "",
      lastMessageSender: officialConv ? officialConv.lastMessageSender : "",
      lastMessageRead: officialConv ? officialConv.lastMessageRead : false,
      unreadCount: officialConv ? officialConv.unread : 0
    };

    const filteredUsers = allUsers
      .filter(u => u.id !== user.uid)
      .map(u => {`;

content = content.replace(targetStr, replacement);

const returnFilteredStr = `return searchOk && matchesSmartFilter(filtered, currentFilter);
    });

    return result.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  }, [allUsers, allDmMessages, user, dmSearchQuery, notifTab]);`;

const returnFilteredReplacement = `return searchOk && matchesSmartFilter(filtered, currentFilter);
    });

    if (officialConv) {
      result.unshift(officialUser);
    }

    return result.sort((a, b) => b.lastMessageAt - a.lastMessageAt);
  }, [allUsers, allDmMessages, user, dmSearchQuery, notifTab]);`;

content = content.replace(returnFilteredStr, returnFilteredReplacement);

fs.writeFileSync('src/App.tsx', content, 'utf8');
