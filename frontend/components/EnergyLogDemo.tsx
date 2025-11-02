"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useAccount, useChainId, useWalletClient, useSwitchChain } from "wagmi";
import { ConnectButton } from "@rainbow-me/rainbowkit";
import { ethers } from "ethers";
import { useFhevm } from "../fhevm/useFhevm";
import { useInMemoryStorage } from "../hooks/useInMemoryStorage";
import { FhevmDecryptionSignature } from "../fhevm/FhevmDecryptionSignature";
import { EnergyLogStorageAddresses } from "../abi/EnergyLogStorageAddresses";
import { EnergyLogStorageABI } from "../abi/EnergyLogStorageABI";

type EnergyLog = {
  index: number;
  date: string;
  electricity?: string;
  gas?: string;
  water?: string;
  encrypted: boolean;
};

export const EnergyLogDemo = () => {
  const { address, isConnected } = useAccount();
  const chainId = useChainId();
  const { data: walletClient } = useWalletClient();
  const { switchChain } = useSwitchChain();
  const { storage: fhevmDecryptionSignatureStorage } = useInMemoryStorage();

  const [form, setForm] = useState({
    date: new Date().toISOString().split("T")[0],
    electricity: "",
    gas: "",
    water: "",
  });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");
  const [logs, setLogs] = useState<EnergyLog[]>([]);
  const [decryptingIndex, setDecryptingIndex] = useState<number | null>(null);

  // Get contract info
  const contractInfo = chainId
    ? EnergyLogStorageAddresses[chainId.toString() as keyof typeof EnergyLogStorageAddresses]
    : undefined;

  const contractAddress = contractInfo?.address;
  const isDeployed = contractAddress && contractAddress !== ethers.ZeroAddress;

  // Get provider for FHEVM - use walletClient directly (Eip1193Provider) or fallback to RPC URL string
  const fhevmProvider = useMemo(() => {
    if (walletClient) {
      // walletClient from wagmi is already an Eip1193Provider, use it directly
      return walletClient as any;
    }
    // Fallback to RPC URL string for localhost
    if (chainId === 31337) {
      return "http://localhost:8545";
    }
    return undefined;
  }, [walletClient, chainId]);

  // Regular provider for ethers operations
  const provider = useMemo(() => {
    if (walletClient) {
      return new ethers.BrowserProvider(walletClient as any);
    }
    // Fallback to RPC for localhost
    if (chainId === 31337) {
      return new ethers.JsonRpcProvider("http://localhost:8545");
    }
    return undefined;
  }, [walletClient, chainId]);

  // FHEVM instance
  const {
    instance: fhevmInstance,
    status: fhevmStatus,
    error: fhevmError,
  } = useFhevm({
    provider: fhevmProvider,
    chainId: chainId || undefined,
    enabled: isConnected && !!contractAddress && !!walletClient,
    initialMockChains: { 31337: "http://localhost:8545" },
  });

  // Load logs
  const loadLogs = useCallback(async () => {
    if (!isConnected || !address || !contractAddress || !walletClient) return;

    try {
      const signer = await new ethers.BrowserProvider(walletClient as any).getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        EnergyLogStorageABI.abi as any,
        signer
      );

      // Check if contract has data for this address
      let logCount: bigint;
      try {
        logCount = await contract.getLogCount(address);
      } catch (e: any) {
        // If contract returns empty or error, user has no logs yet
        console.log("No logs found or contract not initialized:", e.message);
        setLogs([]);
        return;
      }

      const count = Number(logCount);
      if (count === 0) {
        setLogs([]);
        return;
      }

      const newLogs: EnergyLog[] = [];
      for (let i = 0; i < count; i++) {
        try {
          const date = await contract.getDate(address, i);
          newLogs.push({
            index: i,
            date,
            encrypted: true,
          });
        } catch (e: any) {
          console.error(`Failed to get log ${i}:`, e);
        }
      }

      setLogs(newLogs);
    } catch (e: any) {
      // Silently handle non-critical errors
      const errorMessage = e?.message || e?.toString() || "";
      const isNonCriticalError = 
        errorMessage.includes("Failed to fetch") ||
        errorMessage.includes("could not decode result data") ||
        errorMessage.includes("NetworkError");

      if (!isNonCriticalError) {
        console.error("Failed to load logs:", e);
        setMessage(`Failed to load logs: ${e.message}`);
      } else {
        // Silently handle - likely just empty contract or network issue
        console.log("No logs available or network issue (non-critical)");
      }
      setLogs([]);
    }
  }, [isConnected, address, contractAddress, walletClient]);

  useEffect(() => {
    if (isConnected && address && contractAddress && walletClient) {
      loadLogs();
    } else {
      setLogs([]);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [isConnected, address, contractAddress, walletClient]);

  // Add energy log
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!isConnected || !walletClient || !contractAddress || !fhevmInstance) {
      setMessage("Please connect wallet and ensure contract is deployed");
      return;
    }

    setLoading(true);
    setMessage("");

    try {
      const signer = await new ethers.BrowserProvider(walletClient as any).getSigner();
      const userAddress = await signer.getAddress();

      // Encrypt values
      const electricity = BigInt(form.electricity);
      const gas = BigInt(form.gas);
      const water = BigInt(form.water);

      const encryptedInput = fhevmInstance
        .createEncryptedInput(contractAddress, userAddress)
        .add64(electricity)
        .add64(gas)
        .add64(water);

      let encrypted;
      try {
        setMessage("Encrypting data...");
        encrypted = await encryptedInput.encrypt();
      } catch (encryptError: any) {
        console.error("Encryption error:", encryptError);
        const errorMessage = encryptError?.message || String(encryptError || "");
        
        // Handle relayer-specific errors
        if (errorMessage.includes("Relayer") || errorMessage.includes("Bad JSON") || errorMessage.includes("relayer")) {
          setMessage(
            "FHEVM Relayer service error. This may be due to: (1) Network connectivity issues, (2) Relayer service temporarily unavailable, (3) Please try again in a few moments. If the problem persists, check your network connection or try switching networks."
          );
          return;
        }
        
        throw encryptError;
      }

      // Call contract
      const contract = new ethers.Contract(
        contractAddress,
        EnergyLogStorageABI.abi as any,
        signer
      );

      setMessage("Submitting transaction...");
      const tx = await contract.addEnergyLog(
        form.date,
        encrypted.handles[0],
        encrypted.handles[1],
        encrypted.handles[2],
        encrypted.inputProof
      );

      setMessage(`Transaction submitted: ${tx.hash}`);
      await tx.wait();
      setMessage("Energy log added successfully!");

      // Reset form
      setForm({
        date: new Date().toISOString().split("T")[0],
        electricity: "",
        gas: "",
        water: "",
      });

      // Reload logs
      await loadLogs();
    } catch (e: any) {
      console.error("Failed to add log:", e);
      const errorMessage = e?.message || String(e || "");
      
      // Provide more helpful error messages
      if (errorMessage.includes("Relayer") || errorMessage.includes("Bad JSON") || errorMessage.includes("relayer")) {
        setMessage(
          "FHEVM Relayer service error. Please: (1) Check your internet connection, (2) Wait a moment and try again, (3) Ensure you're on the correct network (Sepolia or Hardhat Local)"
        );
      } else if (errorMessage.includes("user rejected") || errorMessage.includes("denied")) {
        setMessage("Transaction rejected by user");
      } else if (errorMessage.includes("insufficient funds")) {
        setMessage("Insufficient funds for transaction");
      } else {
        setMessage(`Failed: ${errorMessage}`);
      }
    } finally {
      setLoading(false);
    }
  };

  // Decrypt log
  const decryptLog = async (index: number) => {
    if (!isConnected || !walletClient || !contractAddress || !fhevmInstance || !address) {
      setMessage("Please connect wallet");
      return;
    }

    setDecryptingIndex(index);
    setMessage("");

    try {
      const signer = await new ethers.BrowserProvider(walletClient as any).getSigner();
      const provider = new ethers.BrowserProvider(walletClient as any);

      const contract = new ethers.Contract(
        contractAddress,
        EnergyLogStorageABI.abi as any,
        provider
      );

      // Get encrypted handles
      const [electricityHandle, gasHandle, waterHandle] = await Promise.all([
        contract.getElectricity(address, index),
        contract.getGas(address, index),
        contract.getWater(address, index),
      ]);

      const zero = ethers.ZeroHash;
      const handles = [
        { handle: electricityHandle, contractAddress },
        { handle: gasHandle, contractAddress },
        { handle: waterHandle, contractAddress },
      ].filter((h) => h.handle !== zero);

      if (handles.length === 0) {
        setMessage("No encrypted data found");
        return;
      }

      // Get decryption signature
      const sig = await FhevmDecryptionSignature.loadOrSign(
        fhevmInstance,
        [contractAddress],
        signer,
        fhevmDecryptionSignatureStorage
      );

      if (!sig) {
        setMessage("Failed to create decryption signature");
        return;
      }

      // Decrypt
      const results = await fhevmInstance.userDecrypt(
        handles.map((h) => ({
          handle: h.handle,
          contractAddress: h.contractAddress as `0x${string}`,
        })),
        sig.privateKey,
        sig.publicKey,
        sig.signature,
        sig.contractAddresses,
        sig.userAddress,
        sig.startTimestamp.toString(),
        sig.durationDays.toString()
      );

      // Update log with decrypted values
      setLogs((prev) =>
        prev.map((log) =>
          log.index === index
            ? {
                ...log,
                electricity: results[electricityHandle]?.toString() || undefined,
                gas: results[gasHandle]?.toString() || undefined,
                water: results[waterHandle]?.toString() || undefined,
                encrypted: false,
              }
            : log
        )
      );

      setMessage("Log decrypted successfully!");
    } catch (e: any) {
      const errorMessage = e?.message || e?.toString() || "";
      // Suppress non-critical fetch errors
      if (!errorMessage.includes("Failed to fetch") && !errorMessage.includes("NetworkError")) {
        console.error("Failed to decrypt:", e);
        setMessage(`Failed to decrypt: ${errorMessage}`);
      } else {
        // Network errors - show user-friendly message
        setMessage("Network issue during decryption. Please try again.");
      }
    } finally {
      setDecryptingIndex(null);
    }
  };

  if (!isConnected) {
    return (
      <div className="mx-auto mt-20">
        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-purple-200">
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">
            Connect Your Wallet
          </h2>
          <p className="text-gray-600 mb-6 text-center">
            Connect your Rainbow wallet to start managing your encrypted energy logs
          </p>
          <div className="flex justify-center">
            <ConnectButton />
          </div>
        </div>
      </div>
    );
  }

  // Switch to localhost network
  const switchToLocalhost = async () => {
    if (!walletClient) {
      setMessage("Please connect your wallet first");
      return;
    }

    try {
      // Try to switch to localhost network
      await switchChain({ chainId: 31337 });
      setMessage("Switched to Hardhat Local network successfully!");
    } catch (error: any) {
      console.error("Failed to switch chain:", error);
      
      // If chain doesn't exist (error code 4902), try to add it
      if (error?.code === 4902 || error?.message?.includes("not added") || error?.message?.includes("Unrecognized chain")) {
        try {
          // Use wallet's request method to add chain
          const provider = new ethers.BrowserProvider(walletClient as any);
          const signer = await provider.getSigner();
          const providerEip1193 = signer.provider as any;
          
          await providerEip1193.request({
            method: "wallet_addEthereumChain",
            params: [
              {
                chainId: "0x7A69", // 31337 in hex
                chainName: "Hardhat Local",
                nativeCurrency: {
                  name: "Ether",
                  symbol: "ETH",
                  decimals: 18,
                },
                rpcUrls: ["http://localhost:8545"],
                blockExplorerUrls: [],
              },
            ],
          });
          
          // Try switching again after adding
          await switchChain({ chainId: 31337 });
          setMessage("Added and switched to Hardhat Local network!");
        } catch (addError: any) {
          console.error("Failed to add chain:", addError);
          setMessage("Failed to add network automatically. Please add Hardhat Local network manually in your wallet (RPC: http://localhost:8545, Chain ID: 31337).");
        }
      } else {
        setMessage(`Failed to switch network: ${error?.message || "Unknown error"}`);
      }
    }
  };

  if (!isDeployed) {
    const isSepolia = chainId === 11155111;
    const isLocalhost = chainId === 31337;
    
    return (
      <div className="mx-auto mt-20 max-w-2xl">
        <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-red-200">
          <h2 className="text-2xl font-bold text-red-600 mb-4">
            Contract Not Deployed
          </h2>
          {isSepolia ? (
            <>
              <p className="text-gray-600 mb-4">
                EnergyLogStorage contract is not deployed on Sepolia (chain {chainId}).
              </p>
              <p className="text-gray-800 font-semibold mb-4 text-lg">
                ⚠️ Please switch to Hardhat Local network (Chain ID: 31337).
              </p>
              
              {/* Switch Network Button */}
              <div className="mb-4">
                <button
                  onClick={switchToLocalhost}
                  className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg"
                >
                  🔄 Switch to Hardhat Local Network
                </button>
              </div>

              <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
                <p className="text-blue-800 font-semibold mb-2">Or add network manually:</p>
                <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
                  <li>Click on the network selector in your wallet (top right)</li>
                  <li>Add network manually:</li>
                  <li className="ml-6">- Network Name: Hardhat Local</li>
                  <li className="ml-6">- RPC URL: http://localhost:8545</li>
                  <li className="ml-6">- Chain ID: 31337</li>
                  <li className="ml-6">- Currency Symbol: ETH</li>
                </ol>
              </div>
              <p className="text-gray-600 text-sm">
                Or deploy the contract to Sepolia: <code className="bg-gray-100 px-2 py-1 rounded text-xs">npx hardhat deploy --network sepolia</code>
              </p>
            </>
          ) : isLocalhost ? (
            <>
              <p className="text-gray-600 mb-2">
                EnergyLogStorage contract is not deployed on Hardhat Local (chain {chainId}).
              </p>
              <p className="text-gray-600 mb-2">
                Please deploy it first:
              </p>
              <div className="bg-gray-100 rounded p-3 mb-2">
                <code className="text-sm">npx hardhat deploy --network localhost</code>
              </div>
              <p className="text-gray-500 text-sm">
                Make sure Hardhat node is running: <code className="bg-gray-100 px-2 py-1 rounded text-xs">npx hardhat node</code>
              </p>
            </>
          ) : (
            <>
              <p className="text-gray-600 mb-4">
                EnergyLogStorage contract is not deployed on chain {chainId}.
              </p>
              <button
                onClick={switchToLocalhost}
                className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 transition-all duration-200 shadow-lg mb-4"
              >
                🔄 Switch to Hardhat Local Network
              </button>
            </>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="w-full max-w-6xl mx-auto space-y-6">
      {/* Header with Connect Button and Network Switch */}
      <div className="flex justify-between items-center bg-white rounded-xl p-4 shadow-lg border-2 border-purple-200">
        <div className="flex items-center gap-4">
          <h1 className="text-3xl font-bold text-gray-800">Energy Log Manager</h1>
          {isConnected && (
            <div className="text-sm text-gray-600">
              <span className="font-semibold">Network:</span>{" "}
              {chainId === 31337 ? (
                <span className="text-green-600 font-semibold">Hardhat Local</span>
              ) : chainId === 11155111 ? (
                <span className="text-orange-600 font-semibold">Sepolia</span>
              ) : (
                <span>Chain {chainId}</span>
              )}
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          {isConnected && chainId !== 31337 && (
            <button
              onClick={switchToLocalhost}
              className="bg-orange-500 hover:bg-orange-600 text-white font-semibold py-2 px-4 rounded-lg transition-colors text-sm shadow-md"
              title="Switch to Hardhat Local Network"
            >
              🔄 Switch to Local
            </button>
          )}
          <ConnectButton />
        </div>
      </div>

      {/* Add Log Form */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Add Energy Log</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Date
              </label>
              <input
                type="date"
                required
                value={form.date}
                onChange={(e) => setForm({ ...form, date: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Electricity (kWh)
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.electricity}
                onChange={(e) => setForm({ ...form, electricity: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="100"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Gas
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.gas}
                onChange={(e) => setForm({ ...form, gas: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="50"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Water (liters)
              </label>
              <input
                type="number"
                required
                min="0"
                value={form.water}
                onChange={(e) => setForm({ ...form, water: e.target.value })}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                placeholder="200"
              />
            </div>
          </div>
          <button
            type="submit"
            disabled={loading || fhevmStatus !== "ready"}
            className="w-full bg-gradient-to-r from-purple-600 to-indigo-600 text-white font-semibold py-3 px-6 rounded-lg hover:from-purple-700 hover:to-indigo-700 disabled:opacity-50 disabled:cursor-not-allowed transition-all duration-200 shadow-lg"
          >
            {loading
              ? "Adding..."
              : fhevmStatus !== "ready"
                ? "Initializing encryption..."
                : "Add Energy Log"}
          </button>
        </form>
      </div>

      {/* Status Messages */}
      {message && (
        <div
          className={`p-4 rounded-lg ${
            message.includes("Failed") || message.includes("Error")
              ? "bg-red-100 text-red-700 border border-red-300"
              : "bg-green-100 text-green-700 border border-green-300"
          }`}
        >
          {message}
        </div>
      )}

      {/* FHEVM Status */}
      <div className="bg-white rounded-xl p-4 shadow-lg border-2 border-purple-200">
        <p className="text-sm text-gray-600">
          FHEVM Status: <span className="font-semibold">{fhevmStatus}</span>
          {fhevmError && (
            <span className="text-red-600 ml-2">Error: {fhevmError.message}</span>
          )}
        </p>
      </div>

      {/* Logs List */}
      <div className="bg-white rounded-xl p-6 shadow-lg border-2 border-purple-200">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">
          Your Energy Logs ({logs.length})
        </h2>
        {logs.length === 0 ? (
          <p className="text-gray-500 text-center py-8">No logs yet. Add your first energy log above!</p>
        ) : (
          <div className="space-y-4">
            {logs.map((log) => (
              <div
                key={log.index}
                className="border border-gray-200 rounded-lg p-4 hover:shadow-md transition-shadow"
              >
                <div className="flex justify-between items-start">
                  <div className="flex-1">
                    <h3 className="font-semibold text-lg text-gray-800 mb-2">
                      {log.date}
                    </h3>
                    <div className="grid grid-cols-3 gap-4 text-sm">
                      <div>
                        <span className="text-gray-600">Electricity: </span>
                        <span className="font-semibold">
                          {log.electricity ? `${log.electricity} kWh` : "***"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Gas: </span>
                        <span className="font-semibold">
                          {log.gas ? `${log.gas}` : "***"}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-600">Water: </span>
                        <span className="font-semibold">
                          {log.water ? `${log.water} L` : "***"}
                        </span>
                      </div>
                    </div>
                  </div>
                  {log.encrypted && (
                    <button
                      onClick={() => decryptLog(log.index)}
                      disabled={decryptingIndex === log.index || fhevmStatus !== "ready"}
                      className="ml-4 bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                    >
                      {decryptingIndex === log.index ? "Decrypting..." : "Decrypt"}
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

