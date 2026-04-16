class TokenVesting {
  constructor() {
    this.vestingSchedules = new Map();
  }

  createVestingSchedule(
    scheduleId,
    beneficiary,
    totalAmount,
    startTimestamp,
    cliffDuration,
    duration
  ) {
    const schedule = {
      beneficiary,
      totalAmount,
      releasedAmount: 0,
      startTimestamp,
      cliffTimestamp: startTimestamp + cliffDuration,
      endTimestamp: startTimestamp + duration,
      createdAt: new Date().toISOString()
    };
    this.vestingSchedules.set(scheduleId, schedule);
    return true;
  }

  calculateReleasableAmount(scheduleId) {
    const schedule = this.vestingSchedules.get(scheduleId);
    if (!schedule) return 0;

    const now = Math.floor(Date.now() / 1000);
    if (now < schedule.cliffTimestamp) return 0;
    if (now >= schedule.endTimestamp) return schedule.totalAmount - schedule.releasedAmount;

    const timePassed = now - schedule.startTimestamp;
    const totalTime = schedule.endTimestamp - schedule.startTimestamp;
    const vestedAmount = Math.floor((schedule.totalAmount * timePassed) / totalTime);
    
    return Math.max(0, vestedAmount - schedule.releasedAmount);
  }

  releaseTokens(scheduleId) {
    const releasable = this.calculateReleasableAmount(scheduleId);
    if (releasable <= 0) return 0;

    const schedule = this.vestingSchedules.get(scheduleId);
    schedule.releasedAmount += releasable;
    return releasable;
  }

  getVestingStatus(scheduleId) {
    return this.vestingSchedules.get(scheduleId) || null;
  }
}

module.exports = TokenVesting;
