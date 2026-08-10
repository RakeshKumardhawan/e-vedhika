const { execSync } = require('child_process');
try {
  execSync('npm run build', { stdio: 'inherit' });
  console.log('Build passed');
} catch (e) {
  console.log('Build failed');
}
