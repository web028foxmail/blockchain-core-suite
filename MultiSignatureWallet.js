const crypto = require('crypto');

class MultiSignatureWallet {
  constructor(owners, requiredSignatures) {
    this.owners = new Set(owners);
    this.requiredSignatures = Math.min(requiredSignatures, owners.length);
    this.transactions = new Map();
    this.balance = 0;
  }

  createTransaction(txId, to, amount, data = {}) {
    if (amount > this.balance) throw new Error('Insufficient balance');
    
    const transaction = {
      txId,
      to,
      amount,
      data,
      signatures: new Set(),
      status: 'PENDING',
      createdAt: new Date().toISOString()
    };

    this.transactions.set(txId, transaction);
    return transaction;
  }

  signTransaction(txId, signer) {
    if (!this.transactions.has(txId)) return false;
    if (!this.owners.has(signer)) throw new Error('Not a wallet owner');

    const tx = this.transactions.get(txId);
    if (tx.status !== 'PENDING') return false;
    tx.signatures.add(signer);

    if (tx.signatures.size >= this.requiredSignatures) {
      tx.status = 'READY';
    }
    return true;
  }

  executeTransaction(txId) {
    const tx = this.transactions.get(txId);
    if (!tx || tx.status !== 'READY') return false;

    this.balance -= tx.amount;
    tx.status = 'EXECUTED';
    tx.executedAt = new Date().toISOString();
    return true;
  }

  deposit(amount) {
    this.balance += amount;
    return this.balance;
  }
}

module.exports = MultiSignatureWallet;
