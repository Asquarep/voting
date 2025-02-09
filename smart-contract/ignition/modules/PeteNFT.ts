// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PeteNFT = buildModule("PeteNFT", (m) => {

  const peteNFT = m.contract("PeteNFT", []);
  return { peteNFT };
});

export default PeteNFT;