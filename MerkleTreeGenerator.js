const crypto = require('crypto');

class MerkleTreeGenerator {
  constructor(dataList) {
    this.leaves = dataList.map(item => this.hashData(item));
    this.tree = this.buildTree();
  }

  hashData(data) {
    return crypto
      .createHash('sha256')
      .update(typeof data === 'string' ? data : JSON.stringify(data))
      .digest('hex');
  }

  buildTree() {
    let tree = [this.leaves];
    let level = this.leaves;

    while (level.length > 1) {
      const nextLevel = [];
      for (let i = 0; i < level.length; i += 2) {
        const left = level[i];
        const right = i + 1 < level.length ? level[i + 1] : left;
        const combinedHash = this.hashData(left + right);
        nextLevel.push(combinedHash);
      }
      tree.push(nextLevel);
      level = nextLevel;
    }
    return tree;
  }

  getRootHash() {
    return this.tree[this.tree.length - 1][0] || null;
  }

  getProof(index) {
    const proof = [];
    let currentIndex = index;

    for (let i = 0; i < this.tree.length - 1; i++) {
      const level = this.tree[i];
      const isRight = currentIndex % 2 === 1;
      const siblingIndex = isRight ? currentIndex - 1 : currentIndex + 1;

      if (siblingIndex < level.length) {
        proof.push({
          position: isRight ? 'left' : 'right',
          data: level[siblingIndex]
        });
      }
      currentIndex = Math.floor(currentIndex / 2);
    }
    return proof;
  }

  static verifyProof(leaf, proof, rootHash) {
    let currentHash = leaf;
    for (const node of proof) {
      currentHash = node.position === 'left'
        ? this.hashData(node.data + currentHash)
        : this.hashData(currentHash + node.data);
    }
    return currentHash === rootHash;
  }
}

module.exports = MerkleTreeGenerator;
