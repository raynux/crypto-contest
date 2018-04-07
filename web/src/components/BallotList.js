import _ from 'lodash'
import React from 'react'
// import {Link} from 'react-router-dom'
import {connect} from 'react-redux'

import {
  Dimmer,
  Loader,
  Table
} from 'semantic-ui-react'

import Ballot from '../models/Ballot'

class BallotList extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      isLoading: false,
      ballots: [],
      ballotsInfo: [],
    }
  }

  componentDidMount() {
    this.loadBallots()
  }

  componentWillReceiveProps(nextProps) {
    this.loadBallots(nextProps)
  }

  async loadBallots(targetProps) {
    this.setState({isLoading: true})

    const {cryptoContest, accountStatus, web3} = (targetProps || this.props)
    const {ballotCount} = accountStatus

    const fetchBallotAddrsTasks = []
    for(let i=0; i < ballotCount; i++) {
      fetchBallotAddrsTasks.push(cryptoContest.ballot(i))
    }
    const ballotAddrs = await Promise.all(fetchBallotAddrsTasks)

    const ballotPopulateTasks = []
    for(const addr of ballotAddrs) {
      ballotPopulateTasks.push(Ballot.at(addr, web3))
    }
    const ballots = await Promise.all(ballotPopulateTasks)

    const ballotInfoTasks = []
    for(const b of ballots) {
      ballotInfoTasks.push(b.info())
    }
    const ballotsInfo = _(await Promise.all(ballotInfoTasks))
      .sortBy('startedAt')
      .reverse()
      .value()

    this.setState({ballots, ballotsInfo, isLoading: false})
  }

  tableRows() {
    const {ballotsInfo} = this.state

    return _.map(ballotsInfo, (bi) => (
      <Table.Row key={bi.address}>
        <Table.Cell>{bi.title}</Table.Cell>
        <Table.Cell>{bi.description}</Table.Cell>
        <Table.Cell>{bi.voteCount}</Table.Cell>
        <Table.Cell>{bi.options.length}</Table.Cell>
        <Table.Cell>{bi.startedAt.format()}</Table.Cell>
      </Table.Row>
    ))
  }

  render() {
    const {isLoading} = this.state
    return (
      <div>
        <Dimmer active={isLoading}>
          <Loader size='large' content='Loading' />
        </Dimmer>

        <Table celled>
          <Table.Header>
            <Table.Row>
              <Table.HeaderCell>Title</Table.HeaderCell>
              <Table.HeaderCell>Description</Table.HeaderCell>
              <Table.HeaderCell>Votes</Table.HeaderCell>
              <Table.HeaderCell>Options</Table.HeaderCell>
              <Table.HeaderCell>Started</Table.HeaderCell>
            </Table.Row>

            {this.tableRows()}
          </Table.Header>
        </Table>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  cryptoContest: state.cryptoContest,
  accountStatus: state.accountStatus
})
export default connect(mapStateToProps)(BallotList)
