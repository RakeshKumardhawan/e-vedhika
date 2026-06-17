import { exec } from 'child_process';
const proc = exec('npx tsx server.ts');
proc.stdout.on('data', d => console.log('stdout:', d.toString()));
proc.stderr.on('data', d => console.error('stderr:', d.toString()));
setTimeout(() => {
  console.log('5 sec passed. Server still running?', !proc.killed);
  proc.kill();
}, 5000);
