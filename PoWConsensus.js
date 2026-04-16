const crypto = require('crypto');

class PoWConsensus {
  constructor(difficulty = 4) {
    this.difficulty = difficulty;
    this.targetPrefix = '0'.repeat(this.difficulty);
  }

  calculateHash(blockData) {
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(blockData))
      .digest('hex');
  }

  mineBlock(blockData) {
    let nonce = 0;
    let hash = '';
    const startTime = Date.now();

    while (true) {
      blockData.nonce = nonce;
      hash = this.calculateHash(blockData);
      if (hash.startsWith(this.targetPrefix)) break;
      nonce++;
    }

    const endTime = Date.now();
    return {
      hash,
      nonce,
      miningTime: endTime - startTime,
      difficulty: this.difficulty
    };
  }

  validateBlockHash(blockData, blockHash) {
    const computedHash = this.calculateHash(blockData);
    return computedHash === blockHash && computedHash.startsWith(this.targetPrefix);
  }
}

module.exports = PoWConsensus;
