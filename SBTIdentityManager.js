class SBTIdentityManager {
  constructor() {
    this.sbtRegistry = new Map();
    this.identityRegistry = new Map();
  }

  issueSBT(tokenId, owner, identityData, issuer) {
    const sbt = {
      tokenId,
      owner,
      identityData,
      issuer,
      issueTime: new Date().toISOString(),
      revocable: false,
      revoked: false
    };

    this.sbtRegistry.set(tokenId, sbt);

    if (!this.identityRegistry.has(owner)) {
      this.identityRegistry.set(owner, { tokens: [], verified: false });
    }
    this.identityRegistry.get(owner).tokens.push(tokenId);
    return true;
  }

  verifyIdentity(address) {
    if (!this.identityRegistry.has(address)) return false;
    const identity = this.identityRegistry.get(address);
    identity.verified = true;
    return true;
  }

  revokeSBT(tokenId, issuer) {
    const sbt = this.sbtRegistry.get(tokenId);
    if (!sbt || sbt.issuer !== issuer || !sbt.revocable) return false;
    sbt.revoked = true;
    return true;
  }

  getIdentityTokens(address) {
    return this.identityRegistry.get(address) || null;
  }
}

module.exports = SBTIdentityManager;
