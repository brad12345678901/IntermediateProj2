// SPDX-License-Identifier: UNLICENSED
pragma solidity ^0.8.9;

//import "hardhat/console.sol";

contract TokenMintingBurning {
    address payable public owner;
    uint256 public tokensupply;

    event Mint(uint256 amount);
    event Burn(uint256 amount);
    event EmptySupply();

    constructor(uint initsupply) payable {
        owner = payable(msg.sender);
        tokensupply = initsupply;
    }

    function mint(uint256 _amount) public payable {
        uint _previousBalance = tokensupply;
        require(msg.sender == owner, "You're not the owner, transaction is cancelled");
        tokensupply += _amount;
        assert(tokensupply == _previousBalance + _amount);
        emit Mint(_amount);
    }

    function burn(uint256 _burnamount) public {
        require(msg.sender == owner, "You're not the owner, transaction is cancelled");
        uint _previousBalance = tokensupply;
        if (tokensupply < _burnamount) {
            revert ("Insufficient Balance");
        }
        tokensupply -= _burnamount;
        assert(tokensupply == (_previousBalance - _burnamount));
        emit Burn(_burnamount);
    }

    function emptybalance() public {
        require(msg.sender == owner, "You are not the owner of this account");
        require(tokensupply != 0, "Your balance should not be empty");
        tokensupply -= tokensupply;
        tokensupply = 0;
        assert(tokensupply == 0);
        emit EmptySupply();
    }

    function getSupply() public view returns(uint256){
        return tokensupply;
    }

}
