import { pushPostToSupportSystem } from './src/services/supportTicketService';

async function testPush() {
  const dummyPost = {
    id: "AZPOaVFqPnwppKLjgYLj",
    title: "Test Support Push",
    content: "Testing push post to support system",
    userName: "Citizen Rakesh",
    uid: "test-uid-123"
  };

  const adminUser = {
    fullName: "Rakesh Admin",
    username: "rakeshadmin",
    uid: "admin-uid-456"
  };

  console.log("Calling pushPostToSupportSystem...");
  const res = await pushPostToSupportSystem(dummyPost, adminUser, "Admin testing support push");
  console.log("Result:", JSON.stringify(res, null, 2));

  if (!res.success) {
    console.error("FAILED with error:", res.error);
    process.exit(1);
  }
  console.log("SUCCESS! Ticket created with tracking:", res.trackingNumber);
  process.exit(0);
}

testPush();
