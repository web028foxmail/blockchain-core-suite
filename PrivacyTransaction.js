const crypto = require('crypto');

class PrivacyTransaction {
  static generateCommitment(value, secret) {
    const hash = crypto.createHash('sha256');
    hash.update(value.toString() + secret);
    return hash.digest('hex');
  }

  static generateNullifier(commitment, secret) {
    const hash = crypto.createHash('sha256');
    hash.update(commitment + secret);
    return hash.digest('hex');
  }

  createPrivateTransaction(sender, recipient, amount, secret) {
    const commitment = this.constructor.generateCommitment(amount, secret);
    const nullifier = this.constructor.generateNullifier(commitment, secret);

    return {
      id: crypto.randomUUID(),
      sender: this.encryptAddress(sender, secret),
      recipient: this.encryptAddress(recipient, secret),
      amount: '***',
      commitment,
      nullifier,
      timestamp: new Date().toISOString()
    };
  }

  encryptAddress(address, secret) {
    const cipher = crypto.createCipher('aes-128-ecb', secret.slice(0, 16));
    let encrypted = cipher.update(address, 'utf8', 'hex');
    encrypted += cipher.final('hex');
    return encrypted;
  }

  static verifyTransaction(transaction, commitmentSet, nullifierSet) {
    if (nullifierSet.has(transaction.nullifier)) return false;
    if (!commitmentSet.has(transaction.commitment)) return false;
    return true;
  }
}

module.exports = PrivacyTransaction;
