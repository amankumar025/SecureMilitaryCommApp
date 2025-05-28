// utils/encryption.js
const crypto = require('crypto');
const AES_SECRET_KEY = Buffer.from(process.env.AES_SECRET_KEY); // Must be 16 bytes

const encrypt = (text) => {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv('aes-128-cbc', AES_SECRET_KEY, iv);
  let encrypted = cipher.update(text, 'utf8', 'hex');
  encrypted += cipher.final('hex');
  return iv.toString('hex') + ':' + encrypted;
};

const decrypt = (encryptedText) => {
  if (!encryptedText || !encryptedText.includes(':')) {
    console.warn("Invalid encrypted text:", encryptedText);
    return '';
  }

  const [ivHex, encrypted] = encryptedText.split(':'); // error solved
  const iv = Buffer.from(ivHex, 'hex');
  const decipher = crypto.createDecipheriv('aes-128-cbc', AES_SECRET_KEY, iv);
  let decrypted = decipher.update(encrypted, 'hex', 'utf8');
  decrypted += decipher.final('utf8');
  return decrypted;
};

module.exports = { encrypt, decrypt };