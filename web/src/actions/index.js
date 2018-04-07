import * as constants from './constants'

export function setCryptoContest(data) {
  return {type: constants.SET_CRYPTO_CONTEST, data}
}

export function setAccountStatus(data) {
  return {type: constants.SET_ACCOUNT_STATUS, data}
}
