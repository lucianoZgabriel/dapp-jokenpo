# JoKenPo Blockchain Game

A Rock, Paper, Scissors (JoKenPo) game implemented on the BSC Testnet. Players can compete by betting BNB, with the winner taking the prize.

🎮 **[Play Now: dapp-jokenpo.vercel.app](https://dapp-jokenpo.vercel.app)**

## 📋 Table of Contents

- [Quick Start](#-quick-start)
- [How to Play](#-how-to-play)
- [Running Locally](#-running-locally)
  - [Prerequisites](#prerequisites)
  - [Environment Setup](#environment-setup)
  - [Project Structure](#project-structure)
- [Wallet Configuration](#-wallet-configuration)
- [Interacting with the Game](#-interacting-with-the-game)
- [Contributing](#-contributing)
- [License](#-license)

## 🚀 Quick Start

1. **Get Test BNB**
   - Join the [BNB Chain Discord](https://discord.com/invite/bnbchain)
   - Get test tokens from the [BNB Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet)
   - The Discord faucet is the fastest way to get test tokens

2. **Play the Game**
   - Visit [dapp-jokenpo.vercel.app](https://dapp-jokenpo.vercel.app)
   - Connect your MetaMask wallet
   - Choose your move and place your bet!

## 🎮 How to Play

1. **Connect Your Wallet**
   - Use a BSC Testnet-compatible wallet (like MetaMask)
   - Make sure you have test BNB in your wallet
   - Connect your wallet to the website

2. **Game Rules**
   - Minimum bet: 0.01 BNB
   - Two players are required for a match
   - First player chooses between Rock, Paper, or Scissors
   - Second player makes their choice
   - Winner takes the prize (minus contract commission)

3. **Results**
   - Rock beats Scissors
   - Scissors beats Paper
   - Paper beats Rock
   - In case of a tie, the prize is doubled for the next round

## 🚀 Running Locally

### Prerequisites

- Node.js v16 or higher
- npm or yarn
- MetaMask or other Web3 wallet
- Test BNB (you can get them from BSC Testnet faucets)

### Environment Setup

1. Clone the repository:
```bash
git clone [REPOSITORY_URL]
cd [DIRECTORY_NAME]
```

2. Install dependencies:
```bash
npm install
```

3. Create a `.env` file in the project root:
```env
REACT_APP_CONTRACT_ADDRESS="[ADAPTER_CONTRACT_ADDRESS]"
REACT_APP_WEBSOCKET_URL="wss://bsc-testnet.publicnode.com"
```

4. Start the development server:
```bash
npm start
```

The application will be available at `http://localhost:3000`

### Project Structure

The project consists of:
- Smart Contracts:
  - `JoKenPo.sol`: Main game contract
  - `JKPAdapter.sol`: Adapter for events and interactions
  - `JKPLibrary.sol`: Library with types and structures
  - `IJoKenPo.sol`: Contract interface

## 🔧 Wallet Configuration

1. Add BSC Testnet to MetaMask:
   - Network Name: BSC Testnet
   - RPC URL: https://data-seed-prebsc-1-s1.binance.org:8545/
   - Chain ID: 97
   - Currency Symbol: BNB
   - Block Explorer URL: https://testnet.bscscan.com

2. Get test BNB:
   - Join the [BNB Chain Discord](https://discord.com/invite/bnbchain)
   - Visit the [BNB Testnet Faucet](https://www.bnbchain.org/en/testnet-faucet)
   - Request test tokens through Discord (recommended method)

## 📱 Interacting with the Game

1. **To Start a Match:**
   - Connect your wallet
   - Choose your move (Rock, Paper, or Scissors)
   - Send the transaction with the minimum bet of 0.01 BNB

2. **To Join an Existing Match:**
   - Check if there's a match waiting for a second player
   - Make your choice
   - Send the transaction with the corresponding bet

3. **To View the Scoreboard:**
   - Access the Leaderboard section
   - See players with the most wins

## 🤝 Contributing

Feel free to open issues or submit pull requests with improvements.

## 📄 License

This project is licensed under the MIT License.
