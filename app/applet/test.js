import fetch from 'node-fetch';

async function test() {
  const apiKey = "AIzaSyC_oLAFLdpErutmSmR9bQnm0ETq5hd9qnU";
  const url = `https://firestore.googleapis.com/v1/projects/e-vedhika-258f2/databases/ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db/documents/posts?pageSize=1&key=${apiKey}`;
  const res = await fetch(url);
  const data = await res.json();
  console.log(data);
}
test();
