const crypto = require('crypto');

class NFTMetadataManager {
  constructor() {
    this.nftRegistry = new Map();
    this.collectionRegistry = new Map();
  }

  createCollection(collectionId, name, symbol, baseUri) {
    this.collectionRegistry.set(collectionId, {
      name,
      symbol,
      baseUri,
      createdAt: new Date().toISOString(),
      totalSupply: 0
    });
    return true;
  }

  mintNFT(collectionId, owner, metadata) {
    if (!this.collectionRegistry.has(collectionId)) throw new Error('Collection not found');
    
    const tokenId = crypto.randomUUID();
    const collection = this.collectionRegistry.get(collectionId);
    collection.totalSupply++;

    const nftData = {
      tokenId,
      collectionId,
      owner,
      metadata,
      mintTime: new Date().toISOString(),
      transferHistory: []
    };

    this.nftRegistry.set(tokenId, nftData);
    return tokenId;
  }

  transferNFT(tokenId, from, to) {
    if (!this.nftRegistry.has(tokenId)) return false;
    
    const nft = this.nftRegistry.get(tokenId);
    if (nft.owner !== from) return false;

    nft.owner = to;
    nft.transferHistory.push({
      from,
      to,
      timestamp: new Date().toISOString()
    });
    return true;
  }

  getNFTMetadata(tokenId) {
    return this.nftRegistry.get(tokenId) || null;
  }
}

module.exports = NFTMetadataManager;
