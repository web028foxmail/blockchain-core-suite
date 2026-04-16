class BlockRewardSystem {
  constructor(baseReward = 10, halvingInterval = 210000) {
    this.baseReward = baseReward;
    this.halvingInterval = halvingInterval;
    this.totalMinted = 0;
  }

  calculateBlockReward(blockHeight) {
    const halvingCount = Math.floor(blockHeight / this.halvingInterval);
    let reward = this.baseReward / (2 ** halvingCount);
    return parseFloat(reward.toFixed(2));
  }

  distributeReward(miner, blockHeight, feePool = 0) {
    const blockReward = this.calculateBlockReward(blockHeight);
    const totalReward = blockReward + feePool;
    this.totalMinted += blockReward;

    return {
      miner,
      blockHeight,
      baseReward: blockReward,
      feeReward: feePool,
      totalReward,
      totalMinted: this.totalMinted,
      timestamp: new Date().toISOString()
    };
  }

  getHalvingInfo(blockHeight) {
    const nextHalving = this.halvingInterval - (blockHeight % this.halvingInterval);
    const currentHalving = Math.floor(blockHeight / this.halvingInterval);
    return {
      currentHalvingCount: currentHalving,
      blocksToNextHalving: nextHalving,
      currentReward: this.calculateBlockReward(blockHeight)
    };
  }
}

module.exports = BlockRewardSystem;
