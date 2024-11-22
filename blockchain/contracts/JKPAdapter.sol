// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./IJoKenPo.sol";
import "./JKPLibrary.sol";

contract JKPAdapter {
    IJoKenPo private joKenPo;
    address public immutable owner;

    event Played(address indexed player, string result);

    constructor() {
        owner = msg.sender;
    }

    function getImplementationAddress() external view returns (address) {
        return address(joKenPo);
    }

    function getResult() external view setContract returns (string memory) {
        return joKenPo.getResult();
    }

    function play(JKPLibrary.Options newChoice) external payable setContract {
        string memory result = joKenPo.play{value: msg.value}(newChoice);
        emit Played(msg.sender, result);
    }

    function getLeaderboard()
        external
        view
        setContract
        returns (JKPLibrary.Player[] memory)
    {
        return joKenPo.getLeaderboard();
    }

    function getBid() external view setContract returns (uint256) {
        return joKenPo.getBid();
    }

    function setBid(uint256 newBid) external onlyOwner setContract {
        return joKenPo.setBid(newBid);
    }

    function getCommission() external view setContract returns (uint8) {
        return joKenPo.getCommission();
    }

    function setCommission(uint8 newCommission) external onlyOwner setContract {
        return joKenPo.setCommission(newCommission);
    }

    function setJoKenPo(address _joKenPo) external onlyOwner {
        require(_joKenPo != address(0), "Invalid JoKenPo address");
        joKenPo = IJoKenPo(_joKenPo);
    }

    modifier onlyOwner() {
        require(msg.sender == owner, "Only the owner can call this function");
        _;
    }

    modifier setContract() {
        require(
            address(joKenPo) != address(0),
            "JoKenPo contract address not set"
        );
        _;
    }
}
