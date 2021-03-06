import React, { Component } from 'react'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'
import { connect } from 'react-redux'
import {
  setCryptoContest,
  setAccountStatus
} from './actions'

import './App.css'

import { Container } from 'semantic-ui-react'

import GlobalHeader from './components/GlobalHeader'
// import Dashboard from './components/Dashboard'
import BallotList from './components/BallotList'
import BallotView from './components/BallotView'
import BallotNew from './components/BallotNew'

import CryptoContest from './models/CryptoContest'

const routes = (
  <Switch>
    <Route path='/ballots' component={BallotList} exact />
    <Route path='/ballots/new' component={BallotNew} exact />
    <Route path='/ballots/:index' component={BallotView} exact />
    <Route component={BallotList} />
  </Switch>
)

class App extends Component {
  async componentDidMount() {
    const {dispatch} = this.props

    // Setup Contracts
    const {web3} = this.props
    const cryptoContest = await CryptoContest.deployed(web3)
    dispatch(setCryptoContest(cryptoContest))

    // Fetch current account status
    const [balance, totalSupply, ballotCount] = await Promise.all([
      await cryptoContest.balanceOf(web3.eth.coinbase),
      await cryptoContest.totalSupply(),
      await cryptoContest.ballotCount()
    ])
    dispatch(setAccountStatus({balance, totalSupply, ballotCount}))
  }

  render() {
    const {web3} = this.props
    if(!web3) {
      return <div>Install MetaMask, then give a try</div>
    }

    return (
      <div>
        <GlobalHeader />
        <Container>{routes}</Container>
      </div>
    )
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  CryptoContestContract: state.CryptoContestContract
})
export default withRouter(connect(mapStateToProps)(App))
