async function test() {
  const FormData = require('form-data');
  const fs = require('fs');

  const form = new FormData();
  form.append('file', Buffer.from('hello world'), 'test.txt');

  try {
    const req = await fetch('http://127.0.0.1:3000/api/upload', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer a.eyAidWlkIjogInRlc3QtMTIzIiB9.c',
        ...form.getHeaders()
      },
      body: form
    });
    console.log(req.status, await req.text());
  } catch(e) {
    console.error("fetch failed:", e.message);
  }
}
test();
