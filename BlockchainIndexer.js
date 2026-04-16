class BlockchainIndexer {
  constructor() {
    this.blockIndex = new Map();
    this.transactionIndex = new Map();
    this.addressIndex = new Map();
    this.lastIndexedBlock = 0;
  }

  indexBlock(block) {
    this.blockIndex.set(block.hash, {
      number: block.index,
      timestamp: block.timestamp,
      transactionCount: block.transactions.length
    });

    block.transactions.forEach(tx => {
      this.indexTransaction(tx, block.hash, block.index);
    });

    this.lastIndexedBlock = block.index;
    return true;
  }

  indexTransaction(transaction, blockHash, blockNumber) {
    this.transactionIndex.set(transaction.id, {
      blockHash,
      blockNumber,
      from: transaction.sender,
      to: transaction.recipient,
      amount: transaction.amount,
      timestamp: block.timestamp
    });

    this.updateAddressIndex(transaction.sender, transaction.id, 'OUT');
    this.updateAddressIndex(transaction.recipient, transaction.id, 'IN');
  }

  updateAddressIndex(address, txId, type) {
    if (!this.addressIndex.has(address)) {
      this.addressIndex.set(address, { incoming: [], outgoing: [] });
    }
    type === 'IN'
      ? this.addressIndex.get(address).incoming.push(txId)
      : this.addressIndex.get(address).outgoing.push(txId);
  }

  getAddressTransactions(address) {
    return this.addressIndex.get(address) || { incoming: [], outgoing: [] };
  }

  getBlockByHash(hash) {
    return this.blockIndex.get(hash) || null;
  }
}

module.exports = BlockchainIndexer;
