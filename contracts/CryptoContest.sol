pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/token/ERC20/MintableToken.sol';
import "./Ballot.sol";

contract CryptoContest is MintableToken {
  string public name = "CRYPTO CONTEST COIN";
  string public symbol = "CCC";
  uint8 public decimals = 18;

  Ballot[] public ballots;

  event BallotCreated(uint256 index, address addr);

  // Returns index in ballots
  function createBallot(
    string _title, string _description, bytes32[] _names, bytes32[] _imageUrls
  ) public {
    require(_names.length == _imageUrls.length);

    Ballot _ballot = new Ballot(_title, _description, _names, _imageUrls);
    ballots.push(_ballot);

    BallotCreated(ballots.length - 1, _ballot);
  }

  function vote(uint _ballotIndex, uint8 _optionIndex, uint256 _betAmount) public {
    require(_betAmount <= balances[msg.sender]);

    balances[msg.sender] = balances[msg.sender].sub(_betAmount);
    ballots[_ballotIndex].vote(msg.sender, _optionIndex, _betAmount);
  }

  function ballotCount() view public returns (uint256) {
    return ballots.length;
  }
}
