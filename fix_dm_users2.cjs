const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const targetStr = `    // If no search query, only show "Friends" (Following)
    return filteredUsers.filter(u => 
      (userProfile?.following || []).includes(u.id)
    ).sort((a, b) => b.lastMessageAt - a.lastMessageAt);`;

// We also want to make sure the users they *already* have an active conversation with
// show up in the list, otherwise they can never click them again unless they search!
const replacement = `    // If no search query, only show "Friends" (Following) OR users with active history
    return filteredUsers.filter(u => 
      (userProfile?.following || []).includes(u.id) || u.lastMessageAt > 0
    ).sort((a, b) => b.lastMessageAt - a.lastMessageAt);`;

if(content.includes(targetStr)) {
  fs.writeFileSync('src/App.tsx', content.replace(targetStr, replacement));
  console.log("Replaced successfully!");
} else {
  console.log("Could not find target string.");
}
