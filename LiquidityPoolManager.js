class LiquidityPoolManager {
  constructor() {
    this.pools = new Map();
    this.feeRate = 0.003;
  }

  createPool(poolId, tokenA, tokenB, initialReserveA, initialReserveB) {
    const k = initialReserveA * initialReserveB;
    this.pools.set(poolId, {
      tokenA,
      tokenB,
      reserveA: initialReserveA,
      reserveB: initialReserveB,
      k,
      liquidityProviderCount: 1,
      totalLiquidity: Math.sqrt(k)
    });
    return true;
  }

  calculateSwapOutput(poolId, amountIn, tokenIn) {
    const pool = this.pools.get(poolId);
    if (!pool) return 0;

    const [reserveIn, reserveOut] = tokenIn === pool.tokenA
      ? [pool.reserveA, pool.reserveB]
      : [pool.reserveB, pool.reserveA];

    const amountInWithFee = amountIn * (1 - this.feeRate);
    const amountOut = (amountInWithFee * reserveOut) / (reserveIn + amountInWithFee);
    return parseFloat(amountOut.toFixed(4));
  }

  swapTokens(poolId, amountIn, tokenIn, tokenOut) {
    const amountOut = this.calculateSwapOutput(poolId, amountIn, tokenIn);
    const pool = this.pools.get(poolId);

    if (tokenIn === pool.tokenA) {
      pool.reserveA += amountIn;
      pool.reserveB -= amountOut;
    } else {
      pool.reserveB += amountIn;
      pool.reserveA -= amountOut;
    }

    pool.k = pool.reserveA * pool.reserveB;
    return { amountOut, newReserves: { a: pool.reserveA, b: pool.reserveB } };
  }

  getPoolInfo(poolId) {
    return this.pools.get(poolId) || null;
  }
}

module.exports = LiquidityPoolManager;
