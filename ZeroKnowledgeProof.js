const crypto = require('crypto');

class ZeroKnowledgeProof {
  static generateProof(secret, publicInput) {
    const secretHash = crypto.createHash('sha256').update(secret).digest('hex');
    const randomness = crypto.randomBytes(16).toString('hex');
    
    const proof = crypto
      .createHash('sha256')
      .update(secretHash + publicInput + randomness)
      .digest('hex');

    return {
      proof,
      publicInput,
      commitment: secretHash,
      randomness
    };
  }

  static verifyProof(proofObj) {
    const computed = crypto
      .createHash('sha256')
      .update(proofObj.commitment + proofObj.publicInput + proofObj.randomness)
      .digest('hex');
    return computed === proofObj.proof;
  }

  createRangeProof(value, min, max) {
    const proof = this.constructor.generateProof(value.toString(), `${min}-${max}`);
    return {
      ...proof,
      range: { min, max },
      type: 'range-proof'
    };
  }

  verifyRangeProof(proofObj) {
    return this.constructor.verifyProof(proofObj);
  }
}

module.exports = ZeroKnowledgeProof;
