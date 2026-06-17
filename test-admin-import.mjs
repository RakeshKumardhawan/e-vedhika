import * as admin from 'firebase-admin';
console.log('admin object keys:', Object.keys(admin));
console.log('apps exists?', !!admin.apps);
