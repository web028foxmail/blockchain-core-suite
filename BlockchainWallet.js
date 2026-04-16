const crypto = require('crypto');
const elliptic = require('elliptic');
const ec = new elliptic.ec('secp256k1');

class BlockchainWallet {
  constructor() {
    this.keyPair = this.generateKeyPair();
    this.publicKey = this.keyPair.getPublic('hex');
    this.privateKey = this.keyPair.getPrivate('hex');
    this.address = this.generateAddress();
  }

  generateKeyPair() {
    return ec.genKeyPair();
  }

  generateAddress() {
    const publicKeyHash = crypto
      .createHash('ripemd160')
      .update(crypto.createHash('sha256').update(this.publicKey).digest())
      .digest('hex');
    return `0x${publicKeyHash}`;
  }

  signData(data) {
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return this.keyPair.sign(hash, 'hex').toDER('hex');
  }

  static verifySignature(publicKey, data, signature) {
    const hash = crypto.createHash('sha256').update(data).digest('hex');
    return ec.verify(hash, signature, publicKey, 'hex');
  }
}

module.exports = BlockchainWallet;
