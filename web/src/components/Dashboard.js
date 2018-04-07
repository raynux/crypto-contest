import numeral from 'numeral'
import React from 'react'
// import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {
  Container,
  Statistic,
  Label,
  Divider,
  Tab
} from 'semantic-ui-react'

import BallotList from './BallotList'
import BallotNew from './BallotNew'

class Dashboard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {}
  }

  render() {
    const {web3, accountStatus} = this.props
    const {balance, totalSupply, ballotCount} = accountStatus

    const panes = [
      {
        menuItem: 'Ballots',
        render: () => (
          <div>
            <Divider hidden />
            <BallotList />
          </div>
        )
      },
      {
        menuItem: 'New',
        render: () => (
          <div>
            <Divider hidden />
            <BallotNew />
          </div>
        )
      }
    ]

    return (
      <Container>
        <div>
          <Label>{web3.eth.coinbase}</Label>
        </div>
        <Statistic.Group widths='six'>
          <Statistic label='Token Supply' value={numeral(totalSupply).format('0,0')} />
          <Statistic label='Token Balance' value={numeral(balance).format('0,0')} />
          <Statistic label='Ballots' value={numeral(ballotCount).format('0,0')} />
        </Statistic.Group>

        <Divider hidden />

        <Tab menu={{ secondary: true, pointing: true }} panes={panes} />
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
