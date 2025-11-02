import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";
import { ethers, fhevm, deployments } from "hardhat";
import { EnergyLogStorage } from "../types";
import { expect } from "chai";
import { FhevmType } from "@fhevm/hardhat-plugin";

type Signers = {
  alice: HardhatEthersSigner;
};

describe("EnergyLogStorageSepolia", function () {
  let signers: Signers;
  let energyLogStorageContract: EnergyLogStorage;
  let energyLogStorageContractAddress: string;
  let step: number;
  let steps: number;

  function progress(message: string) {
    console.log(`${++step}/${steps} ${message}`);
  }

  before(async function () {
    if (fhevm.isMock) {
      console.warn(`This hardhat test suite can only run on Sepolia Testnet`);
      this.skip();
    }

    try {
      const EnergyLogStorageDeployment = await deployments.get("EnergyLogStorage");
      energyLogStorageContractAddress = EnergyLogStorageDeployment.address;
      energyLogStorageContract = await ethers.getContractAt(
        "EnergyLogStorage",
        EnergyLogStorageDeployment.address
      );
    } catch (e) {
      (e as Error).message += ". Call 'npx hardhat deploy --network sepolia'";
      throw e;
    }

    const ethSigners: HardhatEthersSigner[] = await ethers.getSigners();
    signers = { alice: ethSigners[0] };
  });

  beforeEach(async () => {
    step = 0;
    steps = 0;
  });

  it("should add and retrieve an energy log entry", async function () {
    steps = 12;

    this.timeout(4 * 40000);

    const date = "2024-01-15";
    const electricity = 100;
    const gas = 50;
    const water = 200;

    progress(`Encrypting energy values (electricity=${electricity}, gas=${gas}, water=${water})...`);
    const encryptedInput = await fhevm
      .createEncryptedInput(energyLogStorageContractAddress, signers.alice.address)
      .add64(BigInt(electricity))
      .add64(BigInt(gas))
      .add64(BigInt(water))
      .encrypt();

    progress(
      `Call addEnergyLog() EnergyLogStorage=${energyLogStorageContractAddress} signer=${signers.alice.address}...`
    );
    let tx = await energyLogStorageContract
      .connect(signers.alice)
      .addEnergyLog(date, encryptedInput.handles[0], encryptedInput.handles[1], encryptedInput.handles[2], encryptedInput.inputProof);
    await tx.wait();

    progress(`Call getLogCount()...`);
    const logCount = await energyLogStorageContract.getLogCount(signers.alice.address);
    expect(logCount).to.eq(1);

    progress(`Call getDate()...`);
    const retrievedDate = await energyLogStorageContract.getDate(signers.alice.address, 0);
    expect(retrievedDate).to.eq(date);

    progress(`Call getElectricity()...`);
    const encryptedElectricity = await energyLogStorageContract.getElectricity(signers.alice.address, 0);

    progress(`Call getGas()...`);
    const encryptedGas = await energyLogStorageContract.getGas(signers.alice.address, 0);

    progress(`Call getWater()...`);
    const encryptedWater = await energyLogStorageContract.getWater(signers.alice.address, 0);

    progress(`Decrypting electricity handle=${encryptedElectricity}...`);
    const clearElectricity = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedElectricity,
      energyLogStorageContractAddress,
      signers.alice
    );
    progress(`Clear electricity=${clearElectricity} kWh`);

    progress(`Decrypting gas handle=${encryptedGas}...`);
    const clearGas = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedGas,
      energyLogStorageContractAddress,
      signers.alice
    );
    progress(`Clear gas=${clearGas}`);

    progress(`Decrypting water handle=${encryptedWater}...`);
    const clearWater = await fhevm.userDecryptEuint(
      FhevmType.euint64,
      encryptedWater,
      energyLogStorageContractAddress,
      signers.alice
    );
    progress(`Clear water=${clearWater} liters`);

    expect(clearElectricity).to.eq(BigInt(electricity));
    expect(clearGas).to.eq(BigInt(gas));
    expect(clearWater).to.eq(BigInt(water));
  });
});

