const fetchObj = typeof fetch !== 'undefined' ? fetch : require('node-fetch');
async function test() {
  try {
     const postId = '1781498068765-748982420'; // existing post from list? No, from the list I can grab an ID. Note: the prior run showed the list of docs.
    const firestoreUrl = `http://127.0.0.1:3000/?postId=1781498068765-748982420`; 
    const res = await fetchObj(firestoreUrl);
    console.log(await res.status);
    // console.log(await res.text());
  } catch(e) { console.error(e) }
}
test();
