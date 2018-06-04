pragma solidity ^0.4.17;

import 'zeppelin-solidity/contracts/math/SafeMath.sol';

contract Ballot {
  using SafeMath for uint256;

  enum State { OPEN, CLOSED }

  uint8 constant public MAX_OPTION = 8;

  struct Option {
    bytes32 name;
    bytes32 imageUrl;   // likely be a shortened URL
    uint256 betAmount;
  }

  struct Vote {
    address voter;
    uint8 optionIndex;
    uint256 bet;
    uint256 timestamp;
  }

  address public creator;
  State public state;
  string public title;
  string public description;
  uint256 public startedAt;
  uint256 public closedAt;

  Option[] public options;
  Vote[] public votes;

  address[] public winners;
  mapping(address => uint256) public rewards;

  event BallotSummary(uint256 index, address addr);

  function Ballot(string _title, string _description, bytes32[] _names, bytes32[] _imageUrls) public {
    require(_names.length == _imageUrls.length);
    require(_names.length <= MAX_OPTION);

    title = _title;
    description = _description;
    state = State.OPEN;
    creator = tx.origin;
    startedAt = now;

    for (uint8 i = 0; i < _names.length; i++) {
      options.push(
        Option({
          name: _names[i],
          imageUrl: _imageUrls[i],
          betAmount: 0
        })
      );
    }
  }

  function optionCount() view public returns (uint256) {
    return options.length;
  }

  function voteCount() view public returns (uint256) {
    return votes.length;
  }

  function vote(address voter, uint8 _optionIndex, uint256 _bet) external {
    require(0 < _bet);

    options[_optionIndex].betAmount = options[_optionIndex].betAmount.add(_bet);
    votes.push(
      Vote({
        voter: voter,
        optionIndex: _optionIndex,
        bet: _bet,
        timestamp: now
      })
    );
  }

  function totalBet() view private returns (uint256) {
    uint256 _totalBet = 0;
    for(uint8 i = 0; i < options.length; i++) {
      _totalBet = _totalBet.add(options[i].betAmount);
    }
    return _totalBet;
  }

  function winningIndex() view private returns (uint8) {
    uint8 _winningIndex = 0;
    uint256 _currentMax = 0;

    for(uint8 i = 0; i < options.length; i++) {
      if(options[i].betAmount > _currentMax) {
        _winningIndex = i;
        _currentMax = options[i].betAmount;
      }
    }

    return _winningIndex;
  }

  /*
    returns the size of winners
   */
  function close() external returns (uint256) {
    state = State.CLOSED;
    closedAt = now;

    uint256 _totalBet = totalBet();
    uint8 _winningIndex = winningIndex();

    for(uint256 i = 0; i < votes.length; i++) {
      Vote memory _vote = votes[i];

      if(_vote.optionIndex == _winningIndex) {
        uint256 _rewardAmount = _totalBet.div(_vote.bet);
        winners.push(_vote.voter);
        rewards[_vote.voter] = _rewardAmount;
      }
    }

    return winners.length;
  }
}
