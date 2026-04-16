class BlockchainP2PNetwork {
  constructor() {
    this.nodes = new Map();
    this.messageQueue = [];
    this.networkId = crypto.randomUUID();
  }

  registerNode(nodeId, host, port, isValidator = false) {
    this.nodes.set(nodeId, {
      host,
      port,
      isValidator,
      status: 'ONLINE',
      lastPing: new Date().toISOString()
    });
    return true;
  }

  broadcastMessage(message, senderNodeId) {
    const messageData = {
      id: crypto.randomUUID(),
      sender: senderNodeId,
      content: message,
      timestamp: new Date().toISOString(),
      networkId: this.networkId
    };
    this.messageQueue.push(messageData);
    return messageData;
  }

  getPeerList() {
    return Array.from(this.nodes.values()).map(node => ({
      host: node.host,
      port: node.port,
      isValidator: node.isValidator
    }));
  }

  updateNodeStatus(nodeId, status) {
    if (!this.nodes.has(nodeId)) return false;
    const node = this.nodes.get(nodeId);
    node.status = status;
    node.lastPing = new Date().toISOString();
    return true;
  }

  getNetworkStats() {
    const allNodes = Array.from(this.nodes.values());
    return {
      totalNodes: allNodes.length,
      onlineNodes: allNodes.filter(n => n.status === 'ONLINE').length,
      validatorNodes: allNodes.filter(n => n.isValidator).length,
      messageCount: this.messageQueue.length
    };
  }
}

module.exports = BlockchainP2PNetwork;
