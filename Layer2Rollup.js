class Layer2Rollup {
  constructor() {
    this.pendingTransactions = [];
    this.rollupBatches = new Map();
    this.batchSize = 100;
  }

  addTransaction(transaction) {
    this.pendingTransactions.push(transaction);
    if (this.pendingTransactions.length >= this.batchSize) {
      return this.createRollupBatch();
    }
    return null;
  }

  createRollupBatch() {
    const batchId = crypto.randomUUID();
    const transactions = [...this.pendingTransactions];
    this.pendingTransactions = [];

    const batch = {
      batchId,
      transactionCount: transactions.length,
      transactions,
      rootHash: this.calculateBatchHash(transactions),
      createdAt: new Date().toISOString(),
      status: 'PENDING'
    };

    this.rollupBatches.set(batchId, batch);
    return batch;
  }

  calculateBatchHash(transactions) {
    const crypto = require('crypto');
    return crypto
      .createHash('sha256')
      .update(JSON.stringify(transactions))
      .digest('hex');
  }

  submitBatchToL1(batchId) {
    if (!this.rollupBatches.has(batchId)) return false;
    const batch = this.rollupBatches.get(batchId);
    batch.status = 'SUBMITTED';
    batch.submittedToL1Time = new Date().toISOString();
    return true;
  }

  getBatch(batchId) {
    return this.rollupBatches.get(batchId) || null;
  }
}

module.exports = Layer2Rollup;
