import {
  SET_CRYPTO_CONTEST
} from '../actions/constants'

const {web3} = window

const initState = {
  web3: null,
  cryptoContest: null
}

if(typeof web3 !== 'undefined') {
  Object.assign(initState, {
    web3: window.web3
  })
}

const rootReducer = (state = initState, action) => {
  const newState = {}
  switch (action.type) {
    case SET_CRYPTO_CONTEST:
      Object.assign(newState, state, {cryptoContest: action.data})
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
