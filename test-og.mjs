const fetchObj = typeof fetch !== 'undefined' ? fetch : require('node-fetch');
async function test() {
  try {
    const res = await fetchObj('http://0.0.0.0:3000/?postId=eJc4S50d'); // Random existing
    const text = await res.text();
    const meta = text.split('\n').filter(l => l.includes('og:'));
    console.log(meta.join('\n'));
  } catch(e) { console.error(e) }
}
test();
