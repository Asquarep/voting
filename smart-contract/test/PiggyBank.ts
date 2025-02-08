import {
    loadFixture,
  } from "@nomicfoundation/hardhat-toolbox/network-helpers";
import hre from "hardhat";
import { expect } from "chai";

describe('PiggyBank', () => {

    // const deployPiggyContract = async () => {

    //     const [owner, otherAccount] = await hre.ethers.getSigners();
  
    //     const piggy = await hre.ethers.getContractFactory("PiggyBank");
    //     const deployedPiggy = await piggy.deploy(`0x0000000000000000000000000000000000000000`, 1000, 1741362146, `0x0000000000000000000000000000000000000000`);


    //     return {deployedPiggy, owner, otherAccount};
    // }

    // describe('deploy piggy', () => {

    //     it('should have a target amount greater than zero', async () => {
    //         const {deployedPiggy, owner, otherAccount} = await loadFixture(deployPiggyContract);

    //         expect(await deployedPiggy.targetAmount()).to.not.equal(0);


    //     })

    //     it('should have a withdrawal date in the future', async () => {
    //         const {deployedPiggy, owner, otherAccount} = await loadFixture(deployPiggyContract);

    //         expect(await deployedPiggy.withdrawalDate()).to.not.equal(0);


    //     })

    // })

    // describe('decrement', () => {
    //     it('should decrease count', async () => {
    //         const {deployedCount} = await loadFixture(deployCounterContract);

    //         await deployedCount.increaseCount();

    //         let countBeforeDecrease = await deployedCount.count();

    //         await deployedCount.decreaseCount();

    //         let countAfterDecrease = await deployedCount.count();

    //         expect(countAfterDecrease).to.be.lessThan(countBeforeDecrease);
    //     })

    //     it('should decrease by 1', async () => {
    //         const {deployedCount} = await loadFixture(deployCounterContract);

    //         await deployedCount.increaseCount();

    //         await deployedCount.increaseCount();

    //         let countBeforeDecrease = await deployedCount.count();

    //         await deployedCount.decreaseCount();

    //         let countAfterDecrease = await deployedCount.count();

    //         expect(countAfterDecrease).to.be.equal(1);
    //     })
    // })
})