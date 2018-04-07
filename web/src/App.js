import React, { Component } from 'react'
import {
  Route,
  Switch,
  withRouter
} from 'react-router-dom'
import { connect } from 'react-redux'
import contract from 'truffle-contract'
import {
  setCryptoContest
} from './actions'

import './App.css'

import Dashboard from './components/Dashboard'
import CryptoContest from './models/CryptoContest'

const routes = (
  <Switch>
    <Route path='/' component={Dashboard} exact />
    <Route component={Dashboard} />
  </Switch>
)

class App extends Component {
  async componentDidMount() {
    const {dispatch} = this.props

    // Setup Contracts
    const {web3} = this.props
    const CryptoContestContract = contract(require('./contracts/CryptoContest.json'))
    CryptoContestContract.defaults({from: web3.eth.coinbase})
    CryptoContestContract.setProvider(web3.currentProvider)

    const instance = await CryptoContestContract.deployed()
    dispatch(setCryptoContest(new CryptoContest(instance)))
  }

  render() {
    const {web3} = this.props
    if(!web3) {
      return <div>Install MetaMask, then give a try</div>
    }

    return (
      <div>
        {routes}
      </div>
    )
  }
}

const mapStateToProps = state => ({
  web3: state.web3,
  CryptoContestContract: state.CryptoContestContract
})
export default withRouter(connect(mapStateToProps)(App))
