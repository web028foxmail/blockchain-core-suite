class CrossChainBridge {
  constructor() {
    this.supportedChains = ['ETH', 'BSC', 'SOL', 'TRON'];
    this.pendingTransfers = new Map();
    this.completedTransfers = new Map();
  }

  initiateTransfer(transferId, fromChain, toChain, sender, recipient, amount, token) {
    if (!this.supportedChains.includes(fromChain) || !this.supportedChains.includes(toChain)) {
      throw new Error('Unsupported chain');
    }

    const transfer = {
      transferId,
      fromChain,
      toChain,
      sender,
      recipient,
      amount,
      token,
      status: 'PENDING',
      initiateTime: new Date().toISOString(),
      signature: null
    };

    this.pendingTransfers.set(transferId, transfer);
    return transfer;
  }

  signTransfer(transferId, validatorSignature) {
    if (!this.pendingTransfers.has(transferId)) return false;
    
    const transfer = this.pendingTransfers.get(transferId);
    transfer.signature = validatorSignature;
    transfer.status = 'SIGNED';
    return true;
  }

  completeTransfer(transferId) {
    if (!this.pendingTransfers.has(transferId)) return false;
    
    const transfer = this.pendingTransfers.get(transferId);
    transfer.status = 'COMPLETED';
    transfer.completeTime = new Date().toISOString();
    
    this.pendingTransfers.delete(transferId);
    this.completedTransfers.set(transferId, transfer);
    return true;
  }

  getTransferStatus(transferId) {
    return this.pendingTransfers.get(transferId) || this.completedTransfers.get(transferId) || null;
  }
}

module.exports = CrossChainBridge;
