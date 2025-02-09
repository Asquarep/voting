// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PeteToken = buildModule("PeteToken", (m) => {
  const initialSupply = m.getParameter("initialSupply");
  initialSupply.defaultValue = 100;

  const peteToken = m.contract("PeteToken", [initialSupply]);
  return { peteToken };
});

export default PeteToken;