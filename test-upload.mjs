async function test() {
  try {
    const req = await fetch('http://127.0.0.1:3000/api/upload', {
      method: 'POST',
      headers: { 'Authorization': 'Bearer a.eyAidWlkIjogInRlc3QtMTIzIiB9.c' }
    });
    console.log(req.status, await req.text());
  } catch(e) {
    console.error("fetch failed:", e.message);
  }
}
test();
