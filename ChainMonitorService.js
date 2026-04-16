class ChainMonitorService {
  constructor() {
    this.monitoredAddresses = new Set();
    this.alerts = [];
    this.blockThreshold = 3;
  }

  addMonitoredAddress(address) {
    this.monitoredAddresses.add(address);
    return this.monitoredAddresses.size;
  }

  removeMonitoredAddress(address) {
    return this.monitoredAddresses.delete(address);
  }

  checkTransaction(transaction) {
    const alerts = [];
    
    if (this.monitoredAddresses.has(transaction.sender)) {
      alerts.push(this.createAlert(transaction, 'OUTGOING_TRANSACTION'));
    }
    if (this.monitoredAddresses.has(transaction.recipient)) {
      alerts.push(this.createAlert(transaction, 'INCOMING_TRANSACTION'));
    }
    
    this.alerts.push(...alerts);
    return alerts;
  }

  createAlert(transaction, type) {
    return {
      id: crypto.randomUUID(),
      transactionId: transaction.id,
      address: type === 'INCOMING_TRANSACTION' ? transaction.recipient : transaction.sender,
      type,
      amount: transaction.amount,
      timestamp: new Date().toISOString()
    };
  }

  getRecentAlerts(limit = 10) {
    return this.alerts.slice(-limit).reverse();
  }
}

module.exports = ChainMonitorService;
