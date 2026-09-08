const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `const unsubPosts = onSnapshot(
      query(collection(db, "posts")),
      (snap) => {
        const pArr: Post[] = [];
        snap.forEach((d) => {
          const data = d.data() as any;
          pArr.push({ id: d.id, ...data } as Post);
        });

        setPosts(
          pArr.sort((a, b) => {`;

const newStr = `const unsubPosts = onSnapshot(
      query(collection(db, "posts")),
      (snap) => {
        const pArr: Post[] = [];
        snap.forEach((d) => {
          const data = d.data() as any;
          if (data.status === "draft") {
            if (userRole === "admin" || userRole === "editor") {
              pArr.push({ id: d.id, ...data } as Post);
            }
          } else {
             pArr.push({ id: d.id, ...data } as Post);
          }
        });

        setPosts(
          pArr.sort((a, b) => {`;

if (code.includes(targetStr)) {
  code = code.replace(targetStr, newStr);
  console.log("Filter posts array logic updated.");
} else {
  console.log("Filter posts array target NOT found.");
}
fs.writeFileSync(file, code);
