const fs = require('fs');
let content = fs.readFileSync('src/App.tsx', 'utf8');

const t1 = `                      postId: post.id
                    });
                  }`;
const r1 = t1 + `\n                  await logUserActivity("Liked Post: " + post.id);`;
content = content.replace(t1, r1);

const t2 = `                          postId: post.id
                        });
                      }`;
const r2 = t2 + `\n                      await logUserActivity("Shared Post: " + post.id);`;
content = content.replace(t2, r2);

fs.writeFileSync('src/App.tsx', content);
