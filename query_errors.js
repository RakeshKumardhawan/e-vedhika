// query_errors.js
async function run() {
  try {
    const res = await fetch("https://firestore.googleapis.com/v1/projects/e-vedhika-258f2/databases/(default)/documents/app_errors");
    const data = await res.json();
    if (data.documents) {
      console.log(`Found ${data.documents.length} errors:`);
      data.documents.forEach((d, i) => {
        console.log(`\n--- Error ${i+1} ---`);
        console.log("Create Time:", d.createTime);
        const fields = d.fields || {};
        console.log("Error Message (error):", fields.error?.stringValue || "N/A");
        console.log("Operation Type:", fields.operationType?.stringValue || "N/A");
        console.log("Path:", fields.path?.stringValue || "N/A");
        console.log("User:", fields.authInfo?.mapValue?.fields?.email?.stringValue || "N/A");
      });
    } else {
      console.log("No app_errors found / empty.");
    }
  } catch (err) {
    console.error("Error fetching errors:", err);
  }
}
run();
