# Vercel Deployment Guide

This guide will help you deploy the Encrypted Home Energy Log frontend to Vercel.

## Prerequisites

1. A Vercel account (sign up at https://vercel.com)
2. A WalletConnect Project ID (get one at https://cloud.walletconnect.com)

## Deployment Steps

### 1. Prepare Your Repository

Make sure your code is pushed to a Git repository (GitHub, GitLab, or Bitbucket).

### 2. Connect to Vercel

1. Go to https://vercel.com and sign in
2. Click "Add New Project"
3. Import your Git repository
4. Select the repository containing this project

### 3. Configure Project Settings

In the Vercel project settings:

**Root Directory:**
- Set to `pro18/frontend` (or the path to your frontend directory)

**Build Command:**
- Use: `npm run build:vercel` (or just `npm run build`)

**Output Directory:**
- Use: `.next` (default for Next.js)

**Install Command:**
- Use: `npm install` (default)

### 4. Set Environment Variables

In the Vercel project settings, go to "Environment Variables" and add:

```
NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID=your_walletconnect_project_id_here
```

**Important:** Replace `your_walletconnect_project_id_here` with your actual WalletConnect Project ID.

### 5. Deploy

1. Click "Deploy"
2. Wait for the build to complete
3. Your app will be live at the provided Vercel URL

## Post-Deployment

### Verify Deployment

1. Visit your Vercel deployment URL
2. Connect your wallet (Rainbow or MetaMask)
3. Make sure you're connected to Sepolia testnet (the contract is deployed there)
4. Test the energy log functionality

### Network Configuration

The app supports:
- **Sepolia Testnet** (Chain ID: 11155111) - Contract is deployed here
- **Hardhat Local** (Chain ID: 31337) - For local development only

**Note:** Users will need to connect to Sepolia testnet to use the deployed contract.

## Troubleshooting

### Build Fails

- Make sure the root directory is set correctly (`pro18/frontend`)
- Check that all dependencies are in `package.json`
- Verify Node.js version (Vercel uses Node 18+ by default)

### Wallet Connection Issues

- Verify `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` is set correctly
- Check that the WalletConnect Project ID is valid and active

### Contract Not Found

- Ensure users are connected to Sepolia testnet
- Verify the contract address in `abi/EnergyLogStorageAddresses.ts` is correct

## Environment Variables Reference

| Variable | Description | Required |
|----------|-------------|----------|
| `NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID` | WalletConnect Project ID for wallet connections | Yes |

## Additional Notes

- The ABI files are already generated and included in the repository
- The build process will skip ABI generation on Vercel (not needed)
- Make sure the contract is deployed to Sepolia before users can interact with it

