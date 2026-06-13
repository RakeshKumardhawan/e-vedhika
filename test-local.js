import http from "http";

http.get('http://localhost:3000/?postId=qkQ9PDCxO0myy5l2seda', (res) => {
  let data = '';
  res.on('data', chunk => { data += chunk; });
  res.on('end', () => {
    const titleMatch = data.match(/<meta property="og:title" content="(.*?)" \/>/);
    console.log("Found og:title:", titleMatch ? titleMatch[1] : "None");
    const imgMatch = data.match(/<meta property="og:image" content="(.*?)" \/>/);
    console.log("Found og:image:", imgMatch ? imgMatch[1] : "None");
  });
}).on("error", (err) => {
  console.log("Error: ", err.message);
});
