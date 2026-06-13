const apiUrl = "https://firestore.googleapis.com/v1/projects/e-vedhika-258f2/databases/ai-studio-22c3cfb1-d6e9-43a5-89ff-c26680c1e4db/documents/posts?pageSize=1&key=AIzaSyC_oLAFLdpErutmSmR9bQnm0ETq5hd9qnU";
fetch(apiUrl).then(res => res.json()).then(console.log).catch(console.error);
