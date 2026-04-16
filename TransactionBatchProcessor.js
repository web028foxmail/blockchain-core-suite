class TransactionBatchProcessor {
  constructor() {
    this.batches = new Map();
    this.processedCount = 0;
  }

  createBatch(batchId, transactions) {
    const batch = {
      batchId,
      transactions,
      status: 'CREATED',
      size: transactions.length,
      createdAt: new Date().toISOString(),
      processedAt: null
    };
    this.batches.set(batchId, batch);
    return batch;
  }

  validateTransaction(transaction) {
    return transaction && transaction.id && transaction.sender && transaction.recipient && transaction.amount > 0;
  }

  processBatch(batchId) {
    if (!this.batches.has(batchId)) return false;

    const batch = this.batches.get(batchId);
    const validTransactions = batch.transactions.filter(tx => this.validateTransaction(tx));
    
    batch.status = 'PROCESSED';
    batch.processedAt = new Date().toISOString();
    batch.validCount = validTransactions.length;
    batch.invalidCount = batch.size - validTransactions.length;
    this.processedCount++;

    return batch;
  }

  getBatchStats() {
    return {
      totalBatches: this.batches.size,
      totalProcessed: this.processedCount,
      pendingBatches: Array.from(this.batches.values()).filter(b => b.status === 'CREATED').length
    };
  }
}

module.exports = TransactionBatchProcessor;
