import admin from 'firebase-admin';
console.log(admin ? "Admin imported" : "Admin missing");
if (admin) console.log(admin.apps ? "apps exists" : "apps missing");
