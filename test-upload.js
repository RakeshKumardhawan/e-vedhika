import fs from 'fs';
import FormData from 'form-data';
import fetch from 'node-fetch';

async function test() {
  fs.writeFileSync('test.txt', 'hello world');
  const fd = new FormData();
  fd.append('file', fs.createReadStream('test.txt'));

  const res = await fetch('http://localhost:3000/api/upload', {
    method: 'POST',
    body: fd
  });
  console.log(res.status);
  console.log(await res.text());
}
test();
