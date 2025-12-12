// Quick script to generate a random secret for ADMIN_SESSION_SECRET
const crypto = require('crypto');
console.log(crypto.randomBytes(32).toString('base64'));

