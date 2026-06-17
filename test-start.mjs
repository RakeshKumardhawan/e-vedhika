import { exec } from 'child_process';
const proc = exec('npx tsx server.ts');
proc.stdout.on('data', d => console.log(d.toString()));
proc.stderr.on('data', d => console.error(d.toString()));
setTimeout(() => proc.kill(), 5000); // give it 5 seconds
