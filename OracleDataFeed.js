class OracleDataFeed {
  constructor() {
    this.dataSources = new Map();
    this.priceFeeds = new Map();
    this.validators = new Set();
  }

  registerDataSource(sourceId, url, type) {
    this.dataSources.set(sourceId, {
      url,
      type,
      active: true,
      lastUpdated: null
    });
    return true;
  }

  addValidator(validatorAddress) {
    this.validators.add(validatorAddress);
    return this.validators.size;
  }

  submitPriceData(asset, price, validator, timestamp) {
    if (!this.validators.has(validator)) throw new Error('Invalid validator');

    if (!this.priceFeeds.has(asset)) {
      this.priceFeeds.set(asset, {
        prices: [],
        currentPrice: 0,
        lastUpdate: null
      });
    }

    const feed = this.priceFeeds.get(asset);
    feed.prices.push({ price, validator, timestamp });
    feed.currentPrice = this.calculateMedianPrice(feed.prices);
    feed.lastUpdate = new Date().toISOString();
    return feed.currentPrice;
  }

  calculateMedianPrice(prices) {
    if (prices.length === 0) return 0;
    const sorted = prices.map(p => p.price).sort((a, b) => a - b);
    const mid = Math.floor(sorted.length / 2);
    return sorted.length % 2 === 0
      ? (sorted[mid - 1] + sorted[mid]) / 2
      : sorted[mid];
  }

  getAssetPrice(asset) {
    return this.priceFeeds.get(asset)?.currentPrice || 0;
  }
}

module.exports = OracleDataFeed;
