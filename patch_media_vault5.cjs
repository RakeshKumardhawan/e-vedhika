const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /downloadURL = data\.url;/g,
  `downloadURL = data.url;\n        await saveToMediaVault(downloadURL, file, auth.currentUser);`
);

code = code.replace(
  /downloadURL = await getDownloadURL\(storageRef\);/g,
  `downloadURL = await getDownloadURL(storageRef);\n        await saveToMediaVault(downloadURL, file, auth.currentUser);`
);

code = code.replace(
  /const downloadURL = await getDownloadURL\(uploadTask\.snapshot\.ref\);/g,
  `const downloadURL = await getDownloadURL(uploadTask.snapshot.ref);\n                    await saveToMediaVault(downloadURL, file, auth.currentUser);`
);

fs.writeFileSync('src/App.tsx', code);
