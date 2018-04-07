const _ = require('lodash')
const moment = require('moment')

const CryptoContestContract = artifacts.require('./CryptoContest.sol')
const BallotContract = artifacts.require('./Ballot.sol')

// const CryptoContest = require('../web/src/models/CryptoContest')
// const Ballot = require('../web/src/models/Ballot')
const CryptoContest = require('../build/cjs/CryptoContest')
const Ballot = require('../build/cjs/Ballot')

contract('CryptoContest', (accounts) => {
  it('creates a ballot', async () => {
    const cryptoContest = new CryptoContest(await CryptoContestContract.new())

    // properties for the new ballot
    const ballotParams = {
      title: 'NEW BALLOT TITLE',
      description: 'NEW BALLOT DESCRIPTION',
      optionNames: ['foo', 'bar', 'buz'],
      optionImageUrls: ['exmaple.com/1', 'exmaple.com/2', 'exmaple.com/3']
    }

    const {address} = await cryptoContest.createBallot(ballotParams)
    const ballot = new Ballot(await BallotContract.at(address))

    assert.equal(
      await ballot.title(),
      ballotParams.title
    )

    assert.equal(
      await ballot.description(),
      ballotParams.description
    )

    assert.equal(
      await ballot.optionCount(),
      ballotParams.optionNames.length
    )

    assert.equal(await ballot.voteCount(), 0)

    assert.equal(
      await ballot.state(),
      Ballot.STATE_OPEN
    )

    const startedAt = await ballot.startedAt()
    assert(startedAt.isSameOrBefore(moment()))

    for(const i in ballotParams.optionNames) {
      const options = await ballot.options()

      assert.equal(
        options[i].name,
        ballotParams.optionNames[i]
      )

      assert.equal(
        options[i].imageUrl,
        ballotParams.optionImageUrls[i]
      )

      assert.equal(options[i].betAmount, 0)
    }
  })

  it('can mint', async () => {
    const MINT_AMOUNT = 100
    const cryptoContest = new CryptoContest(await CryptoContestContract.new())

    assert.equal(await cryptoContest.balanceOf(accounts[0]), 0)
    assert.equal(await cryptoContest.totalSupply(), 0)

    await cryptoContest.mint({
      to: accounts[0],
      amount: MINT_AMOUNT
    })

    assert.equal(await cryptoContest.balanceOf(accounts[0]), MINT_AMOUNT)
    assert.equal(await cryptoContest.totalSupply(), MINT_AMOUNT)

    await cryptoContest.mint({
      to: accounts[0],
      amount: MINT_AMOUNT
    })

    assert.equal(await cryptoContest.balanceOf(accounts[0]), MINT_AMOUNT * 2)
    assert.equal(await cryptoContest.totalSupply(), MINT_AMOUNT * 2)
  })

  it('can count votes', async () => {
    const DEFAULT_BALANCE = 50
    const cryptoContest = new CryptoContest(await CryptoContestContract.new())
    await cryptoContest.mint({
      to: accounts[0],
      amount: DEFAULT_BALANCE
    })

    // properties for the new ballot
    const ballotParams = {
      title: 'NEW BALLOT TITLE',
      description: 'NEW BALLOT DESCRIPTION',
      optionNames: ['foo', 'bar', 'buz'],
      optionImageUrls: ['exmaple.com/1', 'exmaple.com/2', 'exmaple.com/3']
    }

    const {index, address} = await cryptoContest.createBallot(ballotParams)
    const ballot = new Ballot(await BallotContract.at(address))

    assert.equal(await ballot.voteCount(), 0)

    await cryptoContest.vote({
      ballotIndex: index,
      optionIndex: 0,
      bet: 10
    })

    assert.equal(await ballot.voteCount(), 1)

    await cryptoContest.vote({
      ballotIndex: index,
      optionIndex: 1,
      bet: 10
    })

    assert.equal(await ballot.voteCount(), 2)
  })

  it('subtract balance after voting', async () => {
    const DEFAULT_BALANCE = 50
    const cryptoContest = new CryptoContest(await CryptoContestContract.new())

    await cryptoContest.mint({
      to: accounts[0],
      amount: DEFAULT_BALANCE
    })

    // properties for the new ballot
    const ballotParams = {
      title: 'NEW BALLOT TITLE',
      description: 'NEW BALLOT DESCRIPTION',
      optionNames: ['foo', 'bar', 'buz'],
      optionImageUrls: ['exmaple.com/1', 'exmaple.com/2', 'exmaple.com/3']
    }

    const {index, address} = await cryptoContest.createBallot(ballotParams)
    const ballot = new Ballot(await BallotContract.at(address))

    await cryptoContest.vote({
      ballotIndex: index,
      optionIndex: 0,
      bet: 10
    })

    assert.equal(
      await cryptoContest.balanceOf(accounts[0]),
      DEFAULT_BALANCE - 10
    )

    await cryptoContest.vote({
      ballotIndex: index,
      optionIndex: 1,
      bet: 10
    })

    assert.equal(
      await cryptoContest.balanceOf(accounts[0]),
      DEFAULT_BALANCE - 20
    )
  })

  it('increases betAmount for each option', async () => {
    const DEFAULT_BALANCE = 50
    const cryptoContest = new CryptoContest(await CryptoContestContract.new())

    await cryptoContest.mint({
      to: accounts[0],
      amount: DEFAULT_BALANCE
    })

    // properties for the new ballot
    const ballotParams = {
      title: 'NEW BALLOT TITLE',
      description: 'NEW BALLOT DESCRIPTION',
      optionNames: ['foo', 'bar', 'buz'],
      optionImageUrls: ['exmaple.com/1', 'exmaple.com/2', 'exmaple.com/3']
    }

    const {index, address} = await cryptoContest.createBallot(ballotParams)
    const ballot = new Ballot(await BallotContract.at(address))

    let options = await ballot.options()
    assert.equal(options[0].betAmount, 0)
    assert.equal(options[1].betAmount, 0)
    assert.equal(options[2].betAmount, 0)

    await Promise.all([
      cryptoContest.vote({ballotIndex: index, optionIndex: 0, bet: 1}),
      cryptoContest.vote({ballotIndex: index, optionIndex: 1, bet: 10}),
      cryptoContest.vote({ballotIndex: index, optionIndex: 2, bet: 20})
    ])

    options = await ballot.options()
    assert.equal(options[0].betAmount, 1)
    assert.equal(options[1].betAmount, 10)
    assert.equal(options[2].betAmount, 20)

    await Promise.all([
      cryptoContest.vote({ballotIndex: index, optionIndex: 0, bet: 1}),
      cryptoContest.vote({ballotIndex: index, optionIndex: 1, bet: 1}),
      cryptoContest.vote({ballotIndex: index, optionIndex: 2, bet: 1})
    ])

    options = await ballot.options()
    assert.equal(options[0].betAmount, 2)
    assert.equal(options[1].betAmount, 11)
    assert.equal(options[2].betAmount, 21)
  })
})
