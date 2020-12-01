const crypto = require('crypto');
const envConfig = require('../config/envConfig');

const algorithm = 'aes-256-ctr';
const secretKey = envConfig.cipher_secret;
const iv = crypto.randomBytes(16);

const encrypt = text => {
  const cipher = crypto.createCipheriv(algorithm, secretKey, iv);

  const encrypted = Buffer.concat([cipher.update(text), cipher.final()]);

  return {
    iv: iv.toString('hex'),
    content: encrypted.toString('hex'),
  };
};

// ingresa un objeto con el iv y el hash
const decrypt = hash => {
  const decipher = crypto.createDecipheriv(algorithm, secretKey, Buffer.from(hash.iv, 'hex'));

  const decrpyted = Buffer.concat([decipher.update(Buffer.from(hash.content, 'hex')), decipher.final()]);

  return decrpyted.toString();
};

module.exports = {
  encrypt,
  decrypt,
};
