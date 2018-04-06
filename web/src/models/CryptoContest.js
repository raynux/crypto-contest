class CryptoContest {
  constructor(artifact) {
    this.artifact = artifact
  }

  async mint({to, amount}) {
    await this.artifact.mint(to, amount)
  }

  async balanceOf(addr) {
    console.log()
    return (await this.artifact.balanceOf.call(addr)).toNumber()
  }

  async totalSupply() {
    return (await this.artifact.totalSupply.call()).toNumber()
  }

  async createBallot({title, description, optionNames, optionImageUrls}) {
    const resp = await this.artifact.createBallot(
      title, description, optionNames, optionImageUrls
    )

    const index = resp.logs[0].args.index.toNumber()
    const address = resp.logs[0].args.addr
    return {index, address}
  }

  async ballot(index) {
    return await this.artifact.ballots.call(index)
  }

  async vote({ballotIndex, optionIndex, bet}) {
    await this.artifact.vote(ballotIndex, optionIndex, bet)
  }
}

module.exports = CryptoContest
