import fetch from 'node-fetch';

async function test() {
  const url = `https://firestore.googleapis.com/v1/projects/e-vedhika-258f2/databases/ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db/documents/posts/someid123`;
  const resp = await fetch(url);
  console.log("Status:", resp.status);
  const data = await resp.json();
  console.log(data);
}
test();
