import { buildModule } from "@nomicfoundation/hardhat-ignition/modules";

const PiggyBank = buildModule("PiggyBank", (m) => {
    const tokenAddress = m.getParameter("_tokenAddress");
    tokenAddress.defaultValue = `0x5FbDB2315678afecb367f032d93F642f64180aa3`;
    const NFTAddress = m.getParameter("_NFTAddress");
    NFTAddress.defaultValue = `0xe7f1725E7734CE288F8367e1Bb143E90bb3F0512`;
    const targetAmount = m.getParameter("_targetAmount");
    targetAmount.defaultValue = 300;
    const withdrawalDate = m.getParameter("_withdrawalDate");
    withdrawalDate.defaultValue = 1741362146000;
    const manager = m.getParameter("_manager");
    manager.defaultValue = `0x70997970C51812dc3A010C7d01b50e0d17dc79C8`;

    const piggyBank = m.contract("PiggyBank", [
        tokenAddress,
        NFTAddress,
        targetAmount,
        withdrawalDate,
        manager
    ]);

    return { piggyBank };
});

export default PiggyBank;