// import _ from 'lodash'
import numeral from 'numeral'
import React from 'react'
import {Link, withRouter} from 'react-router-dom'
import {connect} from 'react-redux'

import {
  Container,
  Menu,
  Statistic,
  Label,
  Divider
} from 'semantic-ui-react'

class GlobalHeader extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
    }
  }

  render() {
    const {web3, accountStatus, location} = this.props
    const {balance, totalSupply, ballotCount} = accountStatus
    const {pathname} = location

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

        <Menu>
          <Menu.Item name='Ballots' as={Link} to='/ballots' active={pathname === '/ballots'} />
          <Menu.Item name='New' as={Link} to='/ballots/new' active={pathname === '/ballots/new'} />
        </Menu>

        <Divider hidden />
      </Container>
    )
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  accountStatus: state.accountStatus
})
export default withRouter(connect(mapStateToProps)(GlobalHeader))
