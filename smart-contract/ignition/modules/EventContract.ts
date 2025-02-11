// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const EventContract = buildModule("EventContract", (m:any) => {
  // 0x0000000000000000000000000000000000000000
  
  const event = m.contract("EventContract", []);
  return { event };
});

export default EventContract;