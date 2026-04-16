class ChainSyncService {
  constructor() {
    this.peers = new Map();
    this.syncStatus = { syncing: false, progress: 0, currentBlock: 0, targetBlock: 0 };
  }

  addPeer(peerId, host, port, chainId) {
    this.peers.set(peerId, {
      host,
      port,
      chainId,
      lastSeen: new Date().toISOString(),
      active: true
    });
    return true;
  }

  startSync(localHeight, networkHeight) {
    this.syncStatus = {
      syncing: true,
      progress: 0,
      currentBlock: localHeight,
      targetBlock: networkHeight
    };
    return this.syncStatus;
  }

  updateSyncProgress(currentBlock) {
    if (!this.syncStatus.syncing) return;

    this.syncStatus.currentBlock = currentBlock;
    const progress = ((currentBlock - this.syncStatus.currentBlock) / (this.syncStatus.targetBlock - this.syncStatus.currentBlock)) * 100;
    this.syncStatus.progress = Math.min(100, parseFloat(progress.toFixed(2)));

    if (currentBlock >= this.syncStatus.targetBlock) {
      this.syncStatus.syncing = false;
      this.syncStatus.progress = 100;
    }
    return this.syncStatus;
  }

  getSyncStatus() {
    return { ...this.syncStatus };
  }

  getActivePeers() {
    return Array.from(this.peers.values()).filter(p => p.active);
  }
}

module.exports = ChainSyncService;
