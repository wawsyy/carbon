# Encrypted Home Energy Log - Frontend

Next.js frontend application for the Encrypted Home Energy Log dApp.

## Features

- Rainbow wallet integration
- FHEVM encryption/decryption
- Energy log management UI
- Responsive design

## Development

```bash
npm install
npm run dev
```

## Build

```bash
npm run build
npm start
```

## Environment Setup

Make sure the contract is deployed before running the frontend:

```bash
# In the root directory
npx hardhat deploy --network localhost
# Then generate ABI files
npm run genabi
```

