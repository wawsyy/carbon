import { FhevmType } from "@fhevm/hardhat-plugin";
import { task } from "hardhat/config";
import type { TaskArguments } from "hardhat/types";

/**
 * Tutorial: Deploy and Interact Locally (--network localhost)
 * ===========================================================
 *
 * 1. From a separate terminal window:
 *
 *   npx hardhat node
 *
 * 2. Deploy the EnergyLogStorage contract
 *
 *   npx hardhat --network localhost deploy
 *
 * 3. Interact with the EnergyLogStorage contract
 *
 *   npx hardhat --network localhost task:add-log --date "2024-01-15" --electricity 100 --gas 50 --water 200
 *   npx hardhat --network localhost task:get-log-count
 *   npx hardhat --network localhost task:decrypt-log --index 0
 *
 *
 * Tutorial: Deploy and Interact on Sepolia (--network sepolia)
 * ===========================================================
 *
 * 1. Deploy the EnergyLogStorage contract
 *
 *   npx hardhat --network sepolia deploy
 *
 * 2. Interact with the EnergyLogStorage contract
 *
 *   npx hardhat --network sepolia task:add-log --date "2024-01-15" --electricity 100 --gas 50 --water 200
 *   npx hardhat --network sepolia task:get-log-count
 *   npx hardhat --network sepolia task:decrypt-log --index 0
 *
 */

/**
 * Example:
 *   - npx hardhat --network localhost task:address
 *   - npx hardhat --network sepolia task:address
 */
task("task:address", "Prints the EnergyLogStorage address").setAction(async function (_taskArguments: TaskArguments, hre) {
  const { deployments } = hre;

  const energyLogStorage = await deployments.get("EnergyLogStorage");

  console.log("EnergyLogStorage address is " + energyLogStorage.address);
});

/**
 * Example:
 *   - npx hardhat --network localhost task:get-log-count
 *   - npx hardhat --network sepolia task:get-log-count
 */
task("task:get-log-count", "Gets the number of logs for the caller").setAction(async function (
  _taskArguments: TaskArguments,
  hre
) {
  const { ethers, deployments } = hre;

  const EnergyLogStorageDeployment = await deployments.get("EnergyLogStorage");
  console.log(`EnergyLogStorage: ${EnergyLogStorageDeployment.address}`);

  const signers = await ethers.getSigners();
  const energyLogStorageContract = await ethers.getContractAt(
    "EnergyLogStorage",
    EnergyLogStorageDeployment.address
  );

  const logCount = await energyLogStorageContract.connect(signers[0]).getLogCount(signers[0].address);
  console.log(`Log count for ${signers[0].address}: ${logCount}`);
});

/**
 * Example:
 *   - npx hardhat --network localhost task:add-log --date "2024-01-15" --electricity 100 --gas 50 --water 200
 *   - npx hardhat --network sepolia task:add-log --date "2024-01-15" --electricity 100 --gas 50 --water 200
 */
task("task:add-log", "Adds a new energy log entry")
  .addOptionalParam("address", "Optionally specify the EnergyLogStorage contract address")
  .addParam("date", "The date string (e.g., '2024-01-15')")
  .addParam("electricity", "The electricity usage in kWh")
  .addParam("gas", "The gas usage")
  .addParam("water", "The water usage in liters")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const electricity = parseInt(taskArguments.electricity);
    const gas = parseInt(taskArguments.gas);
    const water = parseInt(taskArguments.water);

    if (!Number.isInteger(electricity) || !Number.isInteger(gas) || !Number.isInteger(water)) {
      throw new Error(`Arguments must be integers`);
    }

    await fhevm.initializeCLIApi();

    const EnergyLogStorageDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("EnergyLogStorage");
    console.log(`EnergyLogStorage: ${EnergyLogStorageDeployment.address}`);

    const signers = await ethers.getSigners();

    const energyLogStorageContract = await ethers.getContractAt(
      "EnergyLogStorage",
      EnergyLogStorageDeployment.address
    );

    // Encrypt the values
    const encryptedInput = await fhevm
      .createEncryptedInput(EnergyLogStorageDeployment.address, signers[0].address)
      .add64(BigInt(electricity))
      .add64(BigInt(gas))
      .add64(BigInt(water))
      .encrypt();

    const tx = await energyLogStorageContract
      .connect(signers[0])
      .addEnergyLog(
        taskArguments.date,
        encryptedInput.handles[0],
        encryptedInput.handles[1],
        encryptedInput.handles[2],
        encryptedInput.inputProof
      );
    console.log(`Wait for tx:${tx.hash}...`);

    const receipt = await tx.wait();
    console.log(`tx:${tx.hash} status=${receipt?.status}`);

    const newLogCount = await energyLogStorageContract.connect(signers[0]).getLogCount(signers[0].address);
    console.log(`New log count: ${newLogCount}`);

    console.log(`EnergyLogStorage addEnergyLog() succeeded!`);
  });

/**
 * Example:
 *   - npx hardhat --network localhost task:decrypt-log --index 0
 *   - npx hardhat --network sepolia task:decrypt-log --index 0
 */
task("task:decrypt-log", "Decrypts and displays a log entry")
  .addOptionalParam("address", "Optionally specify the EnergyLogStorage contract address")
  .addParam("index", "The log index (0-based)")
  .setAction(async function (taskArguments: TaskArguments, hre) {
    const { ethers, deployments, fhevm } = hre;

    const index = parseInt(taskArguments.index);
    if (!Number.isInteger(index)) {
      throw new Error(`Argument --index is not an integer`);
    }

    await fhevm.initializeCLIApi();

    const EnergyLogStorageDeployment = taskArguments.address
      ? { address: taskArguments.address }
      : await deployments.get("EnergyLogStorage");
    console.log(`EnergyLogStorage: ${EnergyLogStorageDeployment.address}`);

    const signers = await ethers.getSigners();

    const energyLogStorageContract = await ethers.getContractAt(
      "EnergyLogStorage",
      EnergyLogStorageDeployment.address
    );

    const date = await energyLogStorageContract.connect(signers[0]).getDate(signers[0].address, index);
    const encryptedElectricity = await energyLogStorageContract
      .connect(signers[0])
      .getElectricity(signers[0].address, index);
    const encryptedGas = await energyLogStorageContract.connect(signers[0]).getGas(signers[0].address, index);
    const encryptedWater = await energyLogStorageContract.connect(signers[0]).getWater(signers[0].address, index);

    console.log(`Date: ${date}`);
    console.log(`Encrypted electricity: ${encryptedElectricity}`);
    console.log(`Encrypted gas: ${encryptedGas}`);
    console.log(`Encrypted water: ${encryptedWater}`);

    // Decrypt values
    const clearElectricity = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedElectricity,
      EnergyLogStorageDeployment.address,
      signers[0]
    );
    const clearGas = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedGas,
      EnergyLogStorageDeployment.address,
      signers[0]
    );
    const clearWater = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedWater,
      EnergyLogStorageDeployment.address,
      signers[0]
    );

    console.log(`Clear electricity: ${clearElectricity} kWh`);
    console.log(`Clear gas: ${clearGas}`);
    console.log(`Clear water: ${clearWater} liters`);
  });

