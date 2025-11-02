export const errorNotDeployed = (chainId: number | undefined) => {
  const isSepolia = chainId === 11155111;
  const isLocalhost = chainId === 31337;
  
  return (
    <div className="mx-auto mt-20">
      <div className="bg-white rounded-xl p-8 shadow-lg border-2 border-red-200">
        <h2 className="text-2xl font-bold text-red-600 mb-4">
          Contract Not Deployed
        </h2>
        {isSepolia ? (
          <>
            <p className="text-gray-600 mb-2">
              EnergyLogStorage contract is not deployed on Sepolia (chain {chainId}).
            </p>
            <p className="text-gray-600 mb-4">
              <strong>Please switch to Hardhat Local network (Chain ID: 31337) in your wallet.</strong>
            </p>
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-4">
              <p className="text-blue-800 font-semibold mb-2">How to switch to local network:</p>
              <ol className="list-decimal list-inside text-blue-700 space-y-1 text-sm">
                <li>Open your wallet (Rainbow/MetaMask)</li>
                <li>Click on the network selector</li>
                <li>Add or select "Hardhat Local" network</li>
                <li>RPC URL: http://localhost:8545</li>
                <li>Chain ID: 31337</li>
                <li>Currency Symbol: ETH</li>
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
            <p className="text-gray-600">
              Please deploy it first by running: <code className="bg-gray-100 px-2 py-1 rounded">npx hardhat deploy --network localhost</code>
            </p>
            <p className="text-gray-500 text-sm mt-2">
              Make sure Hardhat node is running: <code className="bg-gray-100 px-2 py-1 rounded text-xs">npx hardhat node</code>
            </p>
          </>
        ) : (
          <>
            <p className="text-gray-600 mb-2">
              EnergyLogStorage contract is not deployed on chain {chainId}.
            </p>
            <p className="text-gray-600">
              Please switch to Hardhat Local network (Chain ID: 31337) or deploy to the current network.
            </p>
          </>
        )}
      </div>
    </div>
  );
};

