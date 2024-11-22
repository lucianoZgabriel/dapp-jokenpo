// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

import "./IJoKenPo.sol";
import "./JKPLibrary.sol";

contract JoKenPo is IJoKenPo {
    JKPLibrary.Options private choice1 = JKPLibrary.Options.NONE;
    address private player1;
    string private result = "";
    uint256 bid = 0.01 ether;
    uint8 private commission = 10;

    JKPLibrary.Player[] public players;

    address payable private immutable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function getBid() external view returns (uint256) {
        return bid;
    }

    function setBid(uint256 newBid) external {
        require(tx.origin == owner, "Only the owner can change the bid");
        require(
            player1 == address(0),
            "You can't change the bid while a game is running"
        );
        bid = newBid;
    }

    function getCommission() external view returns (uint8) {
        return commission;
    }

    function setCommission(uint8 newCommission) external {
        require(tx.origin == owner, "Only the owner can change the commission");
        require(
            player1 == address(0),
            "You can't change the commission while a game is running"
        );
        commission = newCommission;
    }

    function getResult() external view returns (string memory) {
        return result;
    }

    function updateWinner(address winner) private {
        for (uint i = 0; i < players.length; i++) {
            if (winner == players[i].wallet) {
                players[i].wins++;
                return;
            }
        }
        players.push(JKPLibrary.Player(winner, 1));
    }

    function finishGame(string memory newResult, address winner) private {
        address contractAddress = address(this);
        payable(winner).transfer(
            (contractAddress.balance / 100) * (100 - commission)
        );
        owner.transfer(contractAddress.balance);

        updateWinner(winner);

        result = newResult;
        player1 = address(0);
        choice1 = JKPLibrary.Options.NONE;
    }

    function play(
        JKPLibrary.Options newChoice
    ) external payable returns (string memory) {
        require(tx.origin != owner, "Owner can not play");
        require(
            newChoice != JKPLibrary.Options.NONE,
            "You must choose a valid option"
        );
        require(player1 != tx.origin, "Wait the Player 2 to play");
        require(msg.value >= bid, "Minimum bid is 0.01 ether");

        if (choice1 == JKPLibrary.Options.NONE) {
            player1 = tx.origin;
            choice1 = newChoice;
            result = "Player 1 has chosen, waiting for Player 2.";
        } else if (
            choice1 == JKPLibrary.Options.ROCK &&
            newChoice == JKPLibrary.Options.SCISSORS
        ) {
            finishGame("Rock smash scissor, player 1 won.", player1);
        } else if (
            choice1 == JKPLibrary.Options.PAPER &&
            newChoice == JKPLibrary.Options.ROCK
        ) {
            finishGame("Paper wraps rock, player 1 won.", player1);
        } else if (
            choice1 == JKPLibrary.Options.SCISSORS &&
            newChoice == JKPLibrary.Options.PAPER
        ) {
            finishGame("Scissor cuts paper, player 1 won.", player1);
        } else if (
            choice1 == JKPLibrary.Options.SCISSORS &&
            newChoice == JKPLibrary.Options.ROCK
        ) {
            finishGame("Rock smash scissor, player 2 won.", tx.origin);
        } else if (
            choice1 == JKPLibrary.Options.ROCK &&
            newChoice == JKPLibrary.Options.PAPER
        ) {
            finishGame("Paper wraps rock, player 2 won.", tx.origin);
        } else if (
            choice1 == JKPLibrary.Options.PAPER &&
            newChoice == JKPLibrary.Options.SCISSORS
        ) {
            finishGame("Scissor cuts paper, player 2 won.", tx.origin);
        } else {
            result = "It' a draw. The prize is doubled";
            player1 = address(0);
            choice1 = JKPLibrary.Options.NONE;
        }
        return result;
    }

    function getLeaderboard()
        external
        view
        returns (JKPLibrary.Player[] memory)
    {
        if (players.length < 2) return players;

        JKPLibrary.Player[] memory arr = new JKPLibrary.Player[](
            players.length
        );
        for (uint i = 0; i < players.length; i++) {
            arr[i] = players[i];
        }

        for (uint i = 0; i < arr.length - 1; i++) {
            for (uint j = i + 1; j < arr.length; j++) {
                if ((arr[i].wins < arr[j].wins)) {
                    JKPLibrary.Player memory temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    }
}
