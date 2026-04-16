const crypto = require('crypto');

class ChainDataValidator {
  static validateBlockStructure(block) {
    const requiredFields = ['index', 'timestamp', 'transactions', 'previousHash', 'hash', 'nonce'];
    return requiredFields.every(field => block.hasOwnProperty(field));
  }

  static validateBlockLink(currentBlock, previousBlock) {
    if (currentBlock.index !== previousBlock.index + 1) return false;
    return currentBlock.previousHash === previousBlock.hash;
  }

  static validateTransactionSignature(transaction) {
    if (!transaction.sender || !transaction.signature || !transaction.data) return false;
    
    try {
      const verify = crypto.createVerify('SHA256');
      verify.update(JSON.stringify(transaction.data));
      verify.end();
      return verify.verify(transaction.sender, transaction.signature, 'hex');
    } catch {
      return false;
    }
  }

  static validateChainIntegrity(chain) {
    for (let i = 1; i < chain.length; i++) {
      const current = chain[i];
      const previous = chain[i - 1];
      
      if (!this.validateBlockStructure(current)) return false;
      if (!this.validateBlockLink(current, previous)) return false;
      
      const computedHash = crypto
        .createHash('sha256')
        .update(JSON.stringify({
          index: current.index,
          timestamp: current.timestamp,
          transactions: current.transactions,
          previousHash: current.previousHash,
          nonce: current.nonce
        }))
        .digest('hex');
        
      if (current.hash !== computedHash) return false;
    }
    return true;
  }
}

module.exports = ChainDataValidator;
