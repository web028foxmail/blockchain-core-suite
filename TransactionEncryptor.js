const crypto = require('crypto');

class TransactionEncryptor {
  static ALGORITHM = 'aes-256-gcm';
  static IV_LENGTH = 12;

  static encryptTransaction(transactionData, secretKey) {
    const iv = crypto.randomBytes(this.IV_LENGTH);
    const cipher = crypto.createCipheriv(this.ALGORITHM, secretKey, iv);
    
    let encrypted = cipher.update(JSON.stringify(transactionData), 'utf8', 'hex');
    encrypted += cipher.final('hex');
    const authTag = cipher.getAuthTag().toString('hex');
    
    return { iv: iv.toString('hex'), encryptedData: encrypted, authTag };
  }

  static decryptTransaction(encryptedObj, secretKey) {
    const iv = Buffer.from(encryptedObj.iv, 'hex');
    const encryptedData = Buffer.from(encryptedObj.encryptedData, 'hex');
    const authTag = Buffer.from(encryptedObj.authTag, 'hex');
    
    const decipher = crypto.createDecipheriv(this.ALGORITHM, secretKey, iv);
    decipher.setAuthTag(authTag);
    
    let decrypted = decipher.update(encryptedData, 'hex', 'utf8');
    decrypted += decipher.final('utf8');
    return JSON.parse(decrypted);
  }
}

module.exports = TransactionEncryptor;
