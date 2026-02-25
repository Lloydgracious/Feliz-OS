const admin = require('firebase-admin');
const serviceAccount = require('./serviceAccountKey.json');

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
});

const uid = '9Do2yeCz60TzFhgI3NnzMmr0snv2';

admin
  .auth()
  .setCustomUserClaims(uid, { admin: true })
  .then(() => {
    console.log('Admin claim set for:', uid);
    process.exit(0);
  })
  .catch((err) => {
    console.error('Error setting admin claim:', err);
    process.exit(1);
  });