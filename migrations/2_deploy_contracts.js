const CryptoContest = artifacts.require('CryptoContest');

module.exports = (deployer) => {
  deployer.deploy(CryptoContest)
}
