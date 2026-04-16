class ContractStorageLayer {
  constructor() {
    this.storage = new Map();
    this.contractMetadata = new Map();
  }

  setStorage(contractAddress, key, value) {
    if (!this.storage.has(contractAddress)) {
      this.storage.set(contractAddress, new Map());
    }
    this.storage.get(contractAddress).set(key, {
      value,
      timestamp: new Date().toISOString()
    });
    return true;
  }

  getStorage(contractAddress, key) {
    return this.storage.get(contractAddress)?.get(key)?.value || null;
  }

  deleteStorage(contractAddress, key) {
    return this.storage.get(contractAddress)?.delete(key) || false;
  }

  registerContract(contractAddress, owner, codeHash) {
    this.contractMetadata.set(contractAddress, {
      owner,
      codeHash,
      createdAt: new Date().toISOString(),
      active: true
    });
    return true;
  }

  getContractStorageSize(contractAddress) {
    return this.storage.get(contractAddress)?.size || 0;
  }

  getAllContractKeys(contractAddress) {
    return Array.from(this.storage.get(contractAddress)?.keys() || []);
  }
}

module.exports = ContractStorageLayer;
