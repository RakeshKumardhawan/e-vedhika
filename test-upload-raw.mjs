async function test() {
  const boundary = '----WebKitFormBoundary7MA4YWxkTrZu0gW';
  let body = '';
  body += '--' + boundary + '\r\n';
  body += 'Content-Disposition: form-data; name="file"; filename="test.txt"\r\n';
  body += 'Content-Type: text/plain\r\n\r\n';
  body += 'hello world\r\n';
  body += '--' + boundary + '--\r\n';

  try {
    const req = await fetch('http://127.0.0.1:3000/api/upload', {
      method: 'POST',
      headers: { 
        'Authorization': 'Bearer a.eyAidWlkIjogInRlc3QtMTIzIiB9.c',
        'Content-Type': 'multipart/form-data; boundary=' + boundary
      },
      body: body
    });
    console.log(req.status, await req.text());
  } catch(e) {
    console.error("fetch failed:", e.message);
  }
}
test();
