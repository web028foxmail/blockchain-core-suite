class GasFeeCalculator {
  constructor(baseFee = 10, priorityFee = 2) {
    this.baseFee = baseFee;
    this.priorityFee = priorityFee;
    this.networkCongestion = 0.5;
  }

  calculateTransactionGas(transactionType) {
    const gasLimits = {
      TRANSFER: 21000,
      CONTRACT_DEPLOY: 500000,
      CONTRACT_CALL: 100000,
      NFT_MINT: 150000,
      STAKE: 80000
    };
    return gasLimits[transactionType] || gasLimits.TRANSFER;
  }

  calculateDynamicBaseFee() {
    return this.baseFee * (1 + this.networkCongestion);
  }

  calculateTotalFee(transactionType, isPriority = false) {
    const gasLimit = this.calculateTransactionGas(transactionType);
    const dynamicBase = this.calculateDynamicBaseFee();
    const fee = isPriority ? dynamicBase + this.priorityFee : dynamicBase;
    return parseFloat((gasLimit * fee).toFixed(2));
  }

  updateNetworkCongestion(congestion) {
    if (congestion < 0 || congestion > 1) throw new Error('Congestion must be 0-1');
    this.networkCongestion = congestion;
  }

  estimateFeeRange(transactionType) {
    const low = this.calculateTotalFee(transactionType, false);
    const high = this.calculateTotalFee(transactionType, true);
    return { low, high, average: (low + high) / 2 };
  }
}

module.exports = GasFeeCalculator;
