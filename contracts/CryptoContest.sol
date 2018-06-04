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

  function ballotCount() view public returns (uint256) {
    return ballots.length;
  }

  function vote(uint256 _ballotIndex, uint8 _optionIndex, uint256 _bet) public {
    require(0 < _bet);
    require(_bet <= balances[msg.sender]);

    /*  TODO: this should be "transfer" */
    balances[msg.sender] = balances[msg.sender].sub(_bet);
    ballots[_ballotIndex].vote(msg.sender, _optionIndex, _bet);
  }

  function closeBallot(uint256 _ballotIndex) public {
    Ballot ballot = ballots[_ballotIndex];
    uint256 winnerCount = ballot.close();

    /* Reward calculation */
    for(uint256 i = 0; i < winnerCount; i++) {
      address _winner = ballot.winners(i);
      uint256 _reward = ballot.rewards(_winner);

      /*  TODO: this should be "transferFrom"? */
      balances[_winner] = balances[_winner].add(_reward);
    }
  }
}
