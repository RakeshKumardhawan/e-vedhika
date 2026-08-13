const fs = require('fs');
let code = fs.readFileSync('src/App.tsx', 'utf8');

code = code.replace(
  /uploadedImageUrl = data\.url;/g,
  `uploadedImageUrl = data.url;\n            await saveToMediaVault(uploadedImageUrl, processedFile, auth.currentUser);`
);

code = code.replace(
  /uploadedImageUrl = await getDownloadURL\(storageRef\);/g,
  `uploadedImageUrl = await getDownloadURL(storageRef);\n            await saveToMediaVault(uploadedImageUrl, processedFile, auth.currentUser);`
);

fs.writeFileSync('src/App.tsx', code);
