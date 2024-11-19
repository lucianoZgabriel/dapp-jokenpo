// This setup uses Hardhat Ignition to manage smart contract deployments.
// Learn more about it at https://hardhat.org/ignition

import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const JoKenPoModule = buildModule("JoKenPoModule", (m) => {
  const joKenPo = m.contract("JoKenPo");

  const joKenPoAdapter = m.contract("JKPAdapter");

  m.call(joKenPoAdapter, "setJoKenPo", [joKenPo]);
  console.log("JoKenPoAdapter set");

  return { joKenPo, joKenPoAdapter };
});

export default JoKenPoModule;
