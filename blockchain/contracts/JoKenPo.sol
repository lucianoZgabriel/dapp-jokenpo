// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

contract JoKenPo {
    enum Options {
        NONE,
        ROCK,
        PAPER,
        SCISSOR
    }
    Options private choice1 = Options.NONE;
    address private player1;
    string private result = "";
    uint256 bid = 0.01 ether;
    uint8 private commission = 10;

    struct Player {
        address wallet;
        int32 wins;
    }
    Player[] public players;

    address payable private immutable owner;

    constructor() {
        owner = payable(msg.sender);
    }

    function getBid() external view returns (uint256) {
        return bid;
    }

    function getCommission() external view returns (uint8) {
        return commission;
    }

    function setCommission(uint8 newCommission) external {
        require(
            msg.sender == owner,
            "Only the owner can change the commission"
        );
        require(
            player1 == address(0),
            "You can't change the commission while a game is running"
        );
        commission = newCommission;
    }

    function setBid(uint256 newBid) external {
        require(msg.sender == owner, "Only the owner can change the bid");
        require(
            player1 == address(0),
            "You can't change the bid while a game is running"
        );
        bid = newBid;
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
        players.push(Player(winner, 1));
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
        choice1 = Options.NONE;
    }

    function play(Options newChoice) external payable {
        require(msg.sender != owner, "Owner can not play");
        require(newChoice != Options.NONE, "You must choose one");
        require(player1 != msg.sender, "Wait the Player 2 to play");
        require(msg.value >= bid, "Minimum bid 0.01 Ether");

        if (choice1 == Options.NONE) {
            player1 = msg.sender;
            choice1 = newChoice;
            result = "Player 1 has chosen, waiting for Player 2.";
        } else if (choice1 == Options.ROCK && newChoice == Options.SCISSOR) {
            finishGame("Rock smash scissor, player 1 won.", player1);
        } else if (choice1 == Options.PAPER && newChoice == Options.ROCK) {
            finishGame("Paper wraps rock, player 1 won.", player1);
        } else if (choice1 == Options.SCISSOR && newChoice == Options.PAPER) {
            finishGame("Scissor cuts paper, player 1 won.", player1);
        } else if (choice1 == Options.SCISSOR && newChoice == Options.ROCK) {
            finishGame("Rock smash scissor, player 2 won.", msg.sender);
        } else if (choice1 == Options.ROCK && newChoice == Options.PAPER) {
            finishGame("Paper wraps rock, player 2 won.", msg.sender);
        } else if (choice1 == Options.PAPER && newChoice == Options.SCISSOR) {
            finishGame("Scissor cuts paper, player 2 won.", msg.sender);
        } else {
            result = "It' a draw. The prize is doubled";
            player1 = address(0);
            choice1 = Options.NONE;
        }
    }

    function getLeaderboard() external view returns (Player[] memory) {
        if (players.length < 2) return players;

        Player[] memory arr = new Player[](players.length);
        for (uint i = 0; i < players.length; i++) {
            arr[i] = players[i];
        }

        for (uint i = 0; i < arr.length - 1; i++) {
            for (uint j = i + 1; j < arr.length; j++) {
                if ((arr[i].wins < arr[j].wins)) {
                    Player memory temp = arr[i];
                    arr[i] = arr[j];
                    arr[j] = temp;
                }
            }
        }
        return arr;
    }
}
