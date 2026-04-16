class DAOGovernance {
  constructor() {
    this.proposals = new Map();
    this.voters = new Map();
    this.quorum = 51;
  }

  registerVoter(voterAddress, votingPower) {
    this.voters.set(voterAddress, {
      votingPower,
      votedProposals: new Set()
    });
    return true;
  }

  createProposal(proposalId, creator, title, description, options) {
    this.proposals.set(proposalId, {
      title,
      description,
      options,
      votes: new Map(options.map(opt => [opt, 0])),
      creator,
      status: 'ACTIVE',
      startTime: new Date().toISOString(),
      endTime: null
    });
    return true;
  }

  castVote(proposalId, voterAddress, option) {
    if (!this.proposals.has(proposalId)) return false;
    if (!this.voters.has(voterAddress)) throw new Error('Voter not registered');

    const proposal = this.proposals.get(proposalId);
    const voter = this.voters.get(voterAddress);

    if (proposal.status !== 'ACTIVE' || voter.votedProposals.has(proposalId)) return false;

    proposal.votes.set(option, proposal.votes.get(option) + voter.votingPower);
    voter.votedProposals.add(proposalId);
    return true;
  }

  finalizeProposal(proposalId) {
    const proposal = this.proposals.get(proposalId);
    if (!proposal || proposal.status !== 'ACTIVE') return false;

    const totalVotes = Array.from(proposal.votes.values()).reduce((a, b) => a + b, 0);
    const totalVotingPower = Array.from(this.voters.values()).reduce((a, b) => a + b.votingPower, 0);
    const participation = (totalVotes / totalVotingPower) * 100;

    proposal.status = participation >= this.quorum ? 'PASSED' : 'FAILED';
    proposal.endTime = new Date().toISOString();
    return proposal.status;
  }

  getProposalResult(proposalId) {
    return this.proposals.get(proposalId) || null;
  }
}

module.exports = DAOGovernance;
