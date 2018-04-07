import React from 'react'
// import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {
  Container,
  Statistic,
  Label
} from 'semantic-ui-react'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      balance: 0,
      totalSupply: 0,
      ballotCount: 0,
    }
  }

  async componentWillReceiveProps(nextProps) {
    const {web3, cryptoContest} = nextProps

    // await cryptoContest.mint({to: web3.eth.coinbase, amount: 666})

    const [balance, totalSupply, ballotCount] = await Promise.all([
      await cryptoContest.balanceOf(web3.eth.coinbase),
      await cryptoContest.totalSupply(),
      await cryptoContest.ballotCount()
    ])

    this.setState({balance, totalSupply, ballotCount})
  }

  render() {
    const {web3} = this.props
    const {balance, totalSupply, ballotCount} = this.state

    return (
      <Container>
        <div>
          <Label>{web3.eth.coinbase}</Label>
        </div>
        <Statistic label='Token Supply' value={totalSupply} />
        <Statistic label='Token Balance' value={balance} />
        <Statistic label='Ballots' value={ballotCount} />
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  cryptoContest: state.cryptoContest
})
export default connect(mapStateToProps)(Dashboard)
