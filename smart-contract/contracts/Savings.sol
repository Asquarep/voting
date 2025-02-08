// SPDX-License-Identifier: MIT
pragma solidity ^0.8.26;

contract Savings{

    //the state variables
    uint256 totalDeposits;
    uint256 totalWithdrawals;
    address public owner;

    //making an amount tracable by address
    mapping (address user => uint256) balances;

    constructor(){
        owner = msg.sender;
    }

    // event for logging
    event Deposit(address indexed sender, uint256 amount, uint256 balance);

    event Withraw(address indexed withdrawer, uint256 amount);


    function getTotalDeposits() external view returns (uint256){
        return totalDeposits;
    }
    
    function getTotalWithdrawals() external view returns (uint256){
        return totalWithdrawals;
    }


    //balance check
    function balanceOf(address _address) external view returns (uint256){
        return balances[_address];
    }

    function withdraw(uint256 _amount) external payable  {
        require(msg.sender != address(0), "Withdrawal by zero address is not allowed");

        require(_amount <= balances[msg.sender], "Insufficient funds.");

        payable(msg.sender).transfer(_amount);
        balances[msg.sender] -=  _amount;

        totalWithdrawals = totalWithdrawals + _amount;

        emit Withraw(msg.sender, _amount);
    }


    function deposit() external payable {
        require(msg.sender != address(0), "Deposit by zero address is not allowed");
        balances[msg.sender] =  balances[msg.sender] + msg.value;

        totalDeposits = totalDeposits + msg.value;

        emit Deposit(msg.sender, msg.value, balances[msg.sender]);
    }


}