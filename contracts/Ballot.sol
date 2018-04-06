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

  Option[] public options;
  Vote[] public votes;

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

  function vote(address voter, uint8 _optionIndex, uint256 _bet) public {
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
}
