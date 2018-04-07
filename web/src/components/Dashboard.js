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

    this.state = {}
  }

  async componentWillReceiveProps(nextProps) {
    // const {web3, cryptoContest} = nextProps
    // await cryptoContest.mint({to: web3.eth.coinbase, amount: 666})
  }

  render() {
    const {web3, accountStatus} = this.props
    const {balance, totalSupply, ballotCount} = accountStatus

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
  cryptoContest: state.cryptoContest,
  accountStatus: state.accountStatus
})
export default connect(mapStateToProps)(Dashboard)
