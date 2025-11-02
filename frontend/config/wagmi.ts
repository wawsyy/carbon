import { getDefaultConfig } from '@rainbow-me/rainbowkit';
import { sepolia, hardhat } from 'wagmi/chains';

// Note: You need to get a WalletConnect Project ID from https://cloud.walletconnect.com
// For local development, you can use a placeholder, but for production you should use a real project ID
const PROJECT_ID = process.env.NEXT_PUBLIC_WALLETCONNECT_PROJECT_ID || 'YOUR_PROJECT_ID';

// Configure hardhat local network properly
const localhost = {
  ...hardhat,
  id: 31337,
  name: 'Hardhat Local',
  nativeCurrency: {
    decimals: 18,
    name: 'Ether',
    symbol: 'ETH',
  },
  rpcUrls: {
    default: {
      http: ['http://localhost:8545'],
    },
  },
};

export const config = getDefaultConfig({
  appName: 'Encrypted Home Energy Log',
  projectId: PROJECT_ID,
  chains: [localhost, sepolia], // Put localhost first to prioritize it
  ssr: true,
});

// Commit 4: docs: update API documentation
