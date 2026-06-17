import { exec } from 'child_process';
const proc = exec('npx tsx server.ts');
proc.stdout.on('data', d => console.log('STDOUT:', d.toString()));
proc.stderr.on('data', d => console.error('STDERR:', d.toString()));
setTimeout(() => {
  console.log('Sending upload request...');
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  let body = '';
  body += '--' + boundary + '\r\n';
  body += 'Content-Disposition: form-data; name="file"; filename="test.txt"\r\n';
  body += 'Content-Type: text/plain\r\n\r\n';
  body += 'hello world\r\n';
  body += '--' + boundary + '--\r\n';

  fetch('http://127.0.0.1:3000/api/upload', {
    method: 'POST',
    headers: { 
      'Authorization': 'Bearer a.eyAidWlkIjogInRlc3QtMTIzIiB9.c',
      'Content-Type': 'multipart/form-data; boundary=' + boundary
    },
    body: body
  }).then(r => r.text()).then(t => console.log('UPLOAD RES:', t)).catch(e => console.error('UPLOAD ERR:', e.message));

  setTimeout(() => proc.kill(), 2000);
}, 2000);
