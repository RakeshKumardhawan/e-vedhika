import fetch from 'node-fetch';

async function test() {
  const apiKey = "AIzaSyC_oLAFLdpErutmSmR9bQnm0ETq5hd9qnU";
  // taking a sample postId if possible, wait, how do I get a post ID?
  // Let's just query any post.
  const listUrl = `https://firestore.googleapis.com/v1/projects/e-vedhika-258f2/databases/ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db/documents/posts?key=${apiKey}&pageSize=1`;
  const res = await fetch(listUrl, { headers: { "Referer": "https://e-vedhika.online/" } });
  console.log(res.status);
  const data = await res.json();
  console.log(JSON.stringify(data, null, 2));
}

test();
