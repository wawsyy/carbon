# Encrypted Home Energy Log

A fully homomorphic encryption (FHE) enabled dApp for storing and managing home energy usage data (electricity, gas, water) with end-to-end encryption on the blockchain.

## Features

- **End-to-End Encryption**: All energy usage data is encrypted using FHEVM before being stored on-chain
- **Privacy-First**: Only encrypted data is stored on the blockchain; decryption happens locally
- **User-Friendly**: Simple interface for adding and viewing energy logs
- **Rainbow Wallet Integration**: Connect using Rainbow wallet for seamless Web3 experience
- **Multi-Device Support**: Access your energy logs from any device with wallet connection
- **Historical Analytics**: Track your energy usage patterns over time with secure local analysis

## Quick Start

### Prerequisites

- **Node.js**: Version 20 or higher
- **npm**: Package manager

### Installation

1. **Install dependencies**

   ```bash
   npm install
   cd frontend
   npm install
   ```

2. **Set up environment variables**

   ```bash
   npx hardhat vars set MNEMONIC

   # Set your Infura API key for network access
   npx hardhat vars set INFURA_API_KEY

   # Optional: Set Etherscan API key for contract verification
   npx hardhat vars set ETHERSCAN_API_KEY
   ```

3. **Compile and test**

   ```bash
   npm run compile
   npm run test
   ```

4. **Deploy to local network**

   ```bash
   # Start a local FHEVM-ready node
   npx hardhat node
   # In another terminal, deploy to local network
   npx hardhat deploy --network localhost
   ```

5. **Run the frontend**

   ```bash
   cd frontend
   npm run dev
   ```

6. **Deploy to Sepolia Testnet**

   ```bash
   # Deploy to Sepolia
   npx hardhat deploy --network sepolia
   # Verify contract on Etherscan
   npx hardhat verify --network sepolia <CONTRACT_ADDRESS>
   ```

## Project Structure

```
pro18/
├── contracts/              # Smart contract source files
│   └── EnergyLogStorage.sol # Main contract for storing encrypted energy logs
├── deploy/                 # Deployment scripts
├── tasks/                 # Hardhat custom tasks
├── test/                  # Test files
│   ├── EnergyLogStorage.ts
│   └── EnergyLogStorageSepolia.ts
├── frontend/              # Next.js frontend application
│   ├── app/              # Next.js app directory
│   ├── components/       # React components
│   ├── hooks/            # Custom React hooks
│   └── fhevm/            # FHEVM integration utilities
├── hardhat.config.ts     # Hardhat configuration
└── package.json          # Dependencies and scripts
```

## Available Scripts

| Script             | Description              |
| ------------------ | ------------------------ |
| `npm run compile`  | Compile all contracts    |
| `npm run test`     | Run all tests            |
| `npm run coverage` | Generate coverage report |
| `npm run lint`     | Run linting checks       |
| `npm run clean`    | Clean build artifacts    |

## Contract Overview

### EnergyLogStorage.sol

The main smart contract that stores encrypted energy usage data:

- **addEnergyLog**: Add a new energy log entry with encrypted values
- **getLogCount**: Get the number of logs for an address
- **getDate**: Get the clear text date for a log entry
- **getElectricity/Gas/Water**: Get encrypted handles for energy values
- **getLog**: Get all data for a specific log entry

## Frontend Features

- **Add Energy Log**: Submit new energy usage data (encrypted locally before submission)
- **View Logs**: View all your energy logs with dates
- **Decrypt Data**: Decrypt and view your encrypted energy data locally
- **Rainbow Wallet**: Connect using Rainbow wallet (top right corner)

## Testing

### Local Testing

```bash
npm run test
```

### Sepolia Testing

```bash
npm run test:sepolia
```

### Coverage Testing

```bash
npm run coverage
```

## Documentation

- [FHEVM Documentation](https://docs.zama.ai/fhevm)
- [FHEVM Hardhat Setup Guide](https://docs.zama.ai/protocol/solidity-guides/getting-started/setup)
- [RainbowKit Documentation](https://rainbowkit.com)

## License

This project is licensed under the BSD-3-Clause-Clear License.

---

**Built with ❤️ using Zama FHEVM**

// Commit 7: chore: update dependency versions
