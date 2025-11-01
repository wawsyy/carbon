// SPDX-License-Identifier: MIT
pragma solidity ^0.8.24;

import {FHE, euint64, externalEuint64} from "@fhevm/solidity/lib/FHE.sol";
import {SepoliaConfig} from "@fhevm/solidity/config/ZamaConfig.sol";

/// @title EnergyLogStorage
/// @notice Store and retrieve user's encrypted home energy usage data (electricity, gas, water)
/// @dev Uses Zama FHEVM types. All numerical fields are encrypted euint64.
contract EnergyLogStorage is SepoliaConfig {
    struct EnergyLog {
        string date; // clear text date (e.g., "2024-01-15")
        euint64 electricity; // kWh
        euint64 gas; // cubic meters or kWh equivalent
        euint64 water; // liters
    }

    mapping(address => EnergyLog[]) private _logs;
    mapping(address => uint256) private _logCount;

    /// @notice Add a new energy log entry for the caller
    /// @param date clear text date string
    /// @param electricity external encrypted electricity handle
    /// @param gas external encrypted gas handle
    /// @param water external encrypted water handle
    /// @param inputProof input proof returned by the relayer SDK encrypt()
    function addEnergyLog(
        string calldata date,
        externalEuint64 electricity,
        externalEuint64 gas,
        externalEuint64 water,
        bytes calldata inputProof
    ) external {
        euint64 _electricity = FHE.fromExternal(electricity, inputProof);
        euint64 _gas = FHE.fromExternal(gas, inputProof);
        euint64 _water = FHE.fromExternal(water, inputProof);

        EnergyLog memory newLog = EnergyLog({
            date: date,
            electricity: _electricity,
            gas: _gas,
            water: _water
        });

        _logs[msg.sender].push(newLog);
        _logCount[msg.sender]++;

        uint256 index = _logCount[msg.sender] - 1;

        // Allow access: contract and user
        FHE.allowThis(_logs[msg.sender][index].electricity);
        FHE.allowThis(_logs[msg.sender][index].gas);
        FHE.allowThis(_logs[msg.sender][index].water);

        FHE.allow(_logs[msg.sender][index].electricity, msg.sender);
        FHE.allow(_logs[msg.sender][index].gas, msg.sender);
        FHE.allow(_logs[msg.sender][index].water, msg.sender);
    }

    /// @notice Get the number of logs for an account
    /// @param account address to query
    /// @return count number of logs
    function getLogCount(address account) external view returns (uint256) {
        return _logCount[account];
    }

    /// @notice Get clear date for a specific log entry
    /// @param account address to query
    /// @param index log index (0-based)
    /// @return date clear text date string
    function getDate(address account, uint256 index) external view returns (string memory) {
        require(index < _logCount[account], "Index out of bounds");
        return _logs[account][index].date;
    }

    /// @notice Get encrypted electricity value for a specific log entry
    /// @param account address to query
    /// @param index log index (0-based)
    /// @return electricity encrypted electricity handle
    function getElectricity(address account, uint256 index) external view returns (euint64) {
        require(index < _logCount[account], "Index out of bounds");
        return _logs[account][index].electricity;
    }

    /// @notice Get encrypted gas value for a specific log entry
    /// @param account address to query
    /// @param index log index (0-based)
    /// @return gas encrypted gas handle
    function getGas(address account, uint256 index) external view returns (euint64) {
        require(index < _logCount[account], "Index out of bounds");
        return _logs[account][index].gas;
    }

    /// @notice Get encrypted water value for a specific log entry
    /// @param account address to query
    /// @param index log index (0-based)
    /// @return water encrypted water handle
    function getWater(address account, uint256 index) external view returns (euint64) {
        require(index < _logCount[account], "Index out of bounds");
        return _logs[account][index].water;
    }

    /// @notice Get all encrypted data for a specific log entry
    /// @param account address to query
    /// @param index log index (0-based)
    /// @return date clear text date
    /// @return electricity encrypted electricity handle
    /// @return gas encrypted gas handle
    /// @return water encrypted water handle
    function getLog(
        address account,
        uint256 index
    ) external view returns (string memory date, euint64 electricity, euint64 gas, euint64 water) {
        require(index < _logCount[account], "Index out of bounds");
        EnergyLog storage log = _logs[account][index];
        return (log.date, log.electricity, log.gas, log.water);
    }
}

// Commit 1: feat: improve energy log storage efficiency
