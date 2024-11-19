// SPDX-License-Identifier: MIT
pragma solidity ^0.8.27;

library JKPLibrary {
    enum Options {
        NONE,
        ROCK,
        PAPER,
        SCISSORS
    }

    struct Player {
        address wallet;
        int32 wins;
    }
}
