// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const Savings = buildModule("Savings", (m) => {
  const savings = m.contract("Savings", []);
  return { savings };
});

export default Savings;