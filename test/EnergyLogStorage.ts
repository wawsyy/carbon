import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm } from "hardhat";
import { EnergyLogStorage, EnergyLogStorage__factory } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  deployer: HardhatEthersSigner;
  alice: HardhatEthersSigner;
  bob: HardhatEthersSigner;
};

async function deployFixture() {
  const factory = (await ethers.getContractFactory("EnergyLogStorage")) as EnergyLogStorage__factory;
  const energyLogStorageContract = (await factory.deploy()) as EnergyLogStorage;
  const energyLogStorageContractAddress = await energyLogStorageContract.getAddress();

  return { energyLogStorageContract, energyLogStorageContractAddress };
}

describe("EnergyLogStorage", function () {
  let signers: Signers;
  let energyLogStorageContract: EnergyLogStorage;
  let energyLogStorageContractAddress: string;

  before(async function () {
    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { deployer: ethSigners[0], alice: ethSigners[1], bob: ethSigners[2] };
  });

  beforeEach(async function () {
    // Check whether the tests are running against an FHEVM mock environment
    if (!fhevm.isMock) {
      console.warn(`This hardhat test suite cannot run on Sepolia Testnet`);
      this.skip();
    }

    ({ energyLogStorageContract, energyLogStorageContractAddress } = await deployFixture());
  });

  it("should have zero logs after deployment", async function () {
    const logCount = await energyLogStorageContract.getLogCount(signers.alice.address);
    expect(logCount).to.eq(0);
  });

  it("should add a new energy log entry", async function () {
    const date = "2024-01-15";
    const electricity = 100;
    const gas = 50;
    const water = 200;

    // Encrypt values
    const encryptedInput = await fhevm
      .createEncryptedInput(energyLogStorageContractAddress, signers.alice.address)
      .add64(BigInt(electricity))
      .add64(BigInt(gas))
      .add64(BigInt(water))
      .encrypt();

    const tx = await energyLogStorageContract
      .connect(signers.alice)
      .addEnergyLog(date, encryptedInput.handles[0], encryptedInput.handles[1], encryptedInput.handles[2], encryptedInput.inputProof);
    await tx.wait();

    const logCount = await energyLogStorageContract.getLogCount(signers.alice.address);
    expect(logCount).to.eq(1);

    const retrievedDate = await energyLogStorageContract.getDate(signers.alice.address, 0);
    expect(retrievedDate).to.eq(date);
  });

  it("should retrieve and decrypt energy log values", async function () {
    const date = "2024-01-20";
    const electricity = 150;
    const gas = 75;
    const water = 300;

    // Encrypt values
    const encryptedInput = await fhevm
      .createEncryptedInput(energyLogStorageContractAddress, signers.alice.address)
      .add64(BigInt(electricity))
      .add64(BigInt(gas))
      .add64(BigInt(water))
      .encrypt();

    const tx = await energyLogStorageContract
      .connect(signers.alice)
      .addEnergyLog(date, encryptedInput.handles[0], encryptedInput.handles[1], encryptedInput.handles[2], encryptedInput.inputProof);
    await tx.wait();

    // Retrieve encrypted values
    const encryptedElectricity = await energyLogStorageContract.getElectricity(signers.alice.address, 0);
    const encryptedGas = await energyLogStorageContract.getGas(signers.alice.address, 0);
    const encryptedWater = await energyLogStorageContract.getWater(signers.alice.address, 0);

    // Decrypt values
    const clearElectricity = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedElectricity,
      energyLogStorageContractAddress,
      signers.alice
    );
    const clearGas = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedGas,
      energyLogStorageContractAddress,
      signers.alice
    );
    const clearWater = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedWater,
      energyLogStorageContractAddress,
      signers.alice
    );

    expect(clearElectricity).to.eq(BigInt(electricity));
    expect(clearGas).to.eq(BigInt(gas));
    expect(clearWater).to.eq(BigInt(water));
  });

  it("should allow multiple log entries", async function () {
    const dates = ["2024-01-15", "2024-01-16", "2024-01-17"];
    const values = [
      { electricity: 100, gas: 50, water: 200 },
      { electricity: 120, gas: 55, water: 220 },
      { electricity: 110, gas: 52, water: 210 },
    ];

    for (let i = 0; i < dates.length; i++) {
      const encryptedInput = await fhevm
        .createEncryptedInput(energyLogStorageContractAddress, signers.alice.address)
        .add64(BigInt(values[i].electricity))
        .add64(BigInt(values[i].gas))
        .add64(BigInt(values[i].water))
        .encrypt();

      const tx = await energyLogStorageContract
        .connect(signers.alice)
        .addEnergyLog(
          dates[i],
          encryptedInput.handles[0],
          encryptedInput.handles[1],
          encryptedInput.handles[2],
          encryptedInput.inputProof
        );
      await tx.wait();
    }

    const logCount = await energyLogStorageContract.getLogCount(signers.alice.address);
    expect(logCount).to.eq(3);

    // Verify each entry
    for (let i = 0; i < dates.length; i++) {
      const retrievedDate = await energyLogStorageContract.getDate(signers.alice.address, i);
      expect(retrievedDate).to.eq(dates[i]);
    }
  });

  it("should prevent access to out-of-bounds indices", async function () {
    await expect(energyLogStorageContract.getDate(signers.alice.address, 0)).to.be.revertedWith(
      "Index out of bounds"
    );
  });
});

