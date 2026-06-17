async function test() {
  try {
    const req = await fetch('http://127.0.0.1:3000/api/about');
    console.log(req.status, await req.text().then(t => t.slice(0, 50)));
  } catch(e) {
    console.error("fetch error:", e.message);
  }
}
test();
