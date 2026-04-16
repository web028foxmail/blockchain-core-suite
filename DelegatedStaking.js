class DelegatedStaking {
  constructor() {
    this.validators = new Map();
    this.delegations = new Map();
    this.rewardPool = 0;
  }

  registerValidator(validatorId, address, commissionRate = 5) {
    this.validators.set(validatorId, {
      address,
      commissionRate,
      totalStaked: 0,
      delegatorsCount: 0,
      active: true
    });
    return true;
  }

  delegateStake(delegationId, validatorId, delegatorAddress, amount) {
    if (!this.validators.has(validatorId)) throw new Error('Validator not found');
    
    const validator = this.validators.get(validatorId);
    validator.totalStaked += amount;
    validator.delegatorsCount++;

    const delegation = {
      delegationId,
      validatorId,
      delegatorAddress,
      amount,
      startTime: new Date().toISOString(),
      claimedRewards: 0
    };

    this.delegations.set(delegationId, delegation);
    return delegation;
  }

  calculateRewards(delegationId, apy = 8) {
    if (!this.delegations.has(delegationId)) return 0;
    
    const delegation = this.delegations.get(delegationId);
    const startDate = new Date(delegation.startTime);
    const daysStaked = (Date.now() - startDate.getTime()) / (1000 * 60 * 60 * 24);
    const dailyRate = apy / 365 / 100;
    
    return parseFloat((delegation.amount * dailyRate * daysStaked).toFixed(4));
  }

  claimRewards(delegationId) {
    const rewards = this.calculateRewards(delegationId);
    if (rewards <= 0 || this.rewardPool < rewards) return false;

    const delegation = this.delegations.get(delegationId);
    delegation.claimedRewards += rewards;
    this.rewardPool -= rewards;
    return rewards;
  }

  addRewardsToPool(amount) {
    this.rewardPool += amount;
    return this.rewardPool;
  }
}

module.exports = DelegatedStaking;
