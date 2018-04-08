const _ = require('lodash')
const moment = require('moment')
const contract = require('truffle-contract')

const STATE_OPEN = 0
const STATE_CLOSED = 1

class Ballot {
  static async at(addr, web3) {
    const BallotContract = contract(require('../contracts/Ballot.json'))
    BallotContract.defaults({from: web3.eth.coinbase})
    BallotContract.setProvider(web3.currentProvider)

    const instance = await BallotContract.at(addr)
    return new this(instance, web3)
  }

  constructor(artifact, web3) {
    this.artifact = artifact
    this.web3 = web3
  }

  // Retrieve all information about this ballot
  async info() {
    const res = await Promise.all([
      this.title(),
      this.description(),
      this.voteCount(),
      this.startedAt(),
      this.state(),
      this.options()
    ])

    const keys = [
      'title', 'description', 'voteCount',
      'startedAt', 'state', 'options'
    ]

    return _(res)
      .transform((r, v, i) => {
        r[keys[i]] = v
        return r
      }, {address: this.artifact.address})
      .tap((v) => {
        v.totalBetAmount = _.sumBy(v.options, 'betAmount')
        return v
      })
      .value()
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
    const {web3} = this
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
