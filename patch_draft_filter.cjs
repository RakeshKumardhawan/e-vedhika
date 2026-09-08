const fs = require('fs');
const file = 'src/App.tsx';
let code = fs.readFileSync(file, 'utf8');

const targetStr = `const unsubPosts = onSnapshot(
      query(collection(db, "posts")),
      (snap) => {
        const pArr: Post[] = [];
        snap.forEach((d) => {
          const data = d.data() as any;
          pArr.push({ id: d.id, ...data } as Post);`;

const newStr = `const unsubPosts = onSnapshot(
      query(collection(db, "posts")),
      (snap) => {
        const pArr: Post[] = [];
        snap.forEach((d) => {
          const data = d.data() as any;
          pArr.push({ id: d.id, ...data } as Post);`;

if (code.includes(targetStr)) {
  console.log("Draft filter logic target found.");
} else {
  console.log("Draft filter logic target NOT found.");
}
