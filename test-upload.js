const fetch = require('node-fetch');

async function test() {
  const req = await fetch('http://localhost:3000/api/upload', {
    method: 'POST'
  });
  console.log(req.status, await req.text());
}
test();
