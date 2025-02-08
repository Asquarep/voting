import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre, { ethers } from "hardhat";
import { expect } from "chai";
import { HardhatEthersSigner } from "@nomicfoundation/hardhat-ethers/signers";

describe('PiggyBankSafekeep', () => {

    const ADDRESS_ZERO = `0x0000000000000000000000000000000000000000`;

    const deployPiggyContract = async () => {

        const [owner, otherAccount] = await hre.ethers.getSigners();
  
        const piggy = await hre.ethers.getContractFactory("PiggyBankSafekeep");
        const deployedPiggy = await piggy.deploy(1000, Date.now(), `0x95222290dd7278aa3ddd389cc1e1d165cc4bafe5`);

        let withdrawAmount = hre.ethers.toBigInt(2);



        return {deployedPiggy, owner, otherAccount, withdrawAmount};
    }

    describe('deploy piggy', () => {

        it('should have a target amount greater than zero', async () => {
            const {deployedPiggy, owner, otherAccount} = await loadFixture(deployPiggyContract);

            expect(await deployedPiggy.targetAmount()).to.not.equal(0);


        })

        it('should not have a manager address of address zero', async () => {
            const {deployedPiggy, owner, otherAccount} = await loadFixture(deployPiggyContract);

            expect(await deployedPiggy.manager()).to.not.equal(ADDRESS_ZERO);


        })

        it('should have a withdrawal date in the future', async () => {
            const {deployedPiggy, owner, otherAccount} = await loadFixture(deployPiggyContract);

            expect(await deployedPiggy.withdrawalDate()).to.be.greaterThan(new Date("2000-03-25").getMilliseconds());


        })

    })

    describe('deposit', () => {
        it('should increase contributions', async () => {
            const {deployedPiggy, owner, otherAccount} = await loadFixture(deployPiggyContract);

            const signer = deployedPiggy.runner as HardhatEthersSigner;

            const contributionsBeforeDeposit = deployedPiggy.contributorsCount;
            const contributionsAfterDeposit = deployedPiggy.contributorsCount;

            await deployedPiggy.connect(signer).save({value: 2});

            expect(contributionsBeforeDeposit).to.be.lessThan(contributionsAfterDeposit);
            
        })

    })
    describe('withdraw', () => {
        it('should deposit amount', async () => {
            const {deployedPiggy, owner, withdrawAmount} = await loadFixture(deployPiggyContract);
            const signer = deployedPiggy.runner as HardhatEthersSigner;

            // await deployedPiggy.connect(signer).withdrawal(withdrawAmount);

            // await expect(deployedPiggy.withdrawal(100)).to.be.revertedWith("You can't withdraw yet");

            
        })

    })
})