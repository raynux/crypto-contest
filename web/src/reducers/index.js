import {
  SET_CRYPTO_CONTEST,
  SET_ACCOUNT_STATUS
} from '../actions/constants'

const initState = {
  web3: null,
  cryptoContest: null,
  accountStatus: null
}

if(typeof web3 !== 'undefined') {
  const web3instance = new window.Web3(window.web3.currentProvider)
  // web3instance.eth.defaultAccount = web3instance.eth.accounts[0]

  Object.assign(initState, {
    // web3: window.web3
    web3: web3instance
  })
}

const rootReducer = (state = initState, action) => {
  const newState = {}
  switch (action.type) {
    case SET_CRYPTO_CONTEST:
      Object.assign(newState, state, {cryptoContest: action.data})
      break
    case SET_ACCOUNT_STATUS:
      Object.assign(newState, state, {accountStatus: action.data})
      break
    case '@@redux/INIT':
      return state
    default:
      console.warn(`Invalid action received : ${action.type}`)
      return state
  }
  console.log('State', newState)
  return newState
}

export default rootReducer
