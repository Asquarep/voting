// SPDX-License-Identifier: UNLICENSED
pragma solidity 0.8.28;

import "./IERC20.sol";

contract PiggyBank {
    address public peteTokenAddress = 0x0000000000000000000000000000000000000000; // Address of the ERC20 token
    IERC20 public peteToken;

    // state variables
    uint256 public targetAmount;
    mapping(address => uint256) public contributions;
    uint256 public immutable withdrawalDate;
    uint8 public contributorsCount;
    address public manager;

    // events
    event Contributed (
        address indexed Contributor,
        uint256 amount,
        uint256 time
    );

    event Withdrawn (
        uint256 amount,
        uint256 time
    );

    // constructor
    constructor (address _tokenAddress, uint256 _targetAmount, uint256 _withdrawalDate, address _manager) {
        require(_withdrawalDate > block.timestamp, 'WITHDRAWAL MUST BE IN FUTURE');
        require(_tokenAddress != address(0), 'PLEASE PROVIDE A TOKEN ADDRESS');
        
        targetAmount = _targetAmount;
        withdrawalDate = _withdrawalDate;
        manager = _manager;

        peteToken = IERC20(peteTokenAddress);


    }

    modifier onlyManager () {
        require(msg.sender == manager, 'YOU WAN THIEF ABI ?');
        _;
    }


    // save
    function save (uint256 _amount) external payable {
        
        require(msg.sender != address(0), 'UNAUTHORIZED ADDRESS');

        require(block.timestamp <= withdrawalDate, 'YOU CAN NO LONGER SAVE');

        require(peteToken.transferFrom(msg.sender, address(this), _amount), "Transfer failed");

        // require(msg.value > 0, 'YOU ARE BROKE');

        // check if the caller is a first time contributor
        if(contributions[msg.sender] == 0) {
            contributorsCount += 1;
        }

        targetAmount = targetAmount + _amount;

        // contributions[msg.sender] += msg.value;


        emit Contributed(msg.sender, msg.value, block.timestamp);
        
    }

    // withdrawal
    function withdrawal () external onlyManager {
        // require that its withdrawal time or greater
        require(block.timestamp >= withdrawalDate, 'NOT YET TIME');

        // require contract bal is > or = targetAmount
        uint256 _contractBal = peteToken.balanceOf(address(this));
        require(_contractBal >= targetAmount, 'TARGET AMOUNT NOT REACHED');

        // transfer to manager
        require(peteToken.transferFrom(address(this), msg.sender, _contractBal), "Transfer failed");

        emit Withdrawn(_contractBal, block.timestamp);
    }

}