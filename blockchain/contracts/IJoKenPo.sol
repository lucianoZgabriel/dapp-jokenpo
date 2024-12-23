// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./JKPLibrary.sol";

interface IJoKenPo {
    function getBid() external view returns (uint256);

    function getCommission() external view returns (uint8);

    function setCommission(uint8 newCommission) external;

    function setBid(uint256 newBid) external;

    function getResult() external view returns (string memory);

    function play(
        JKPLibrary.Options newChoice
    ) external payable returns (string memory);

    function getLeaderboard()
        external
        view
        returns (JKPLibrary.Player[] memory);
}
