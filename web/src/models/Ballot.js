const moment = require('moment')

const STATE_OPEN = 0
const STATE_CLOSED = 1

class Ballot {
  constructor(artifact) {
    this.artifact = artifact
  }

  async title() {
    return await this.artifact.title.call()
  }

  async description() {
    return await this.artifact.description.call()
  }

  async optionCount() {
    return (await this.artifact.optionCount.call()).toNumber()
  }

  async voteCount() {
    return (await this.artifact.voteCount.call()).toNumber()
  }

  async creator() {
    return await this.artifact.creator.call()
  }

  async startedAt() {
    const startedAt = (await this.artifact.startedAt.call()).toNumber()
    return moment.unix(startedAt)
  }

  async state() {
    return (await this.artifact.voteCount.call()).toNumber()
  }

  async options() {
    const count = (await this.artifact.optionCount.call()).toNumber()
    const options = []

    for(let i=0; i < count; i++) {
      const option = await this.artifact.options.call(i)
      options.push({
        name: web3.toUtf8(option[0]),
        imageUrl: web3.toUtf8(option[1]),
        betAmount: option[2].toNumber()
      })
    }

    return options
  }
}

Ballot.STATE_OPEN = STATE_OPEN
Ballot.STATE_CLOSED = STATE_CLOSED

export default Ballot
