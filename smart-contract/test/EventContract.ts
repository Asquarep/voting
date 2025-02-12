import { expect } from "chai";
import { ethers } from "hardhat";
import { loadFixture } from "@nomicfoundation/hardhat-toolbox/network-helpers";

describe("Events Contract", () => {
  const deployContracts = async () => {
    const [owner, user] = await ethers.getSigners();

    // Deploy the TicketFactory contract
    const TicketFactory = await ethers.getContractFactory("TicketFactory");
    const ticketFactory = await TicketFactory.deploy();

    // Deploy the EventContract with ticketFactory's address
    const EventContract = await ethers.getContractFactory("EventContract");
    const eventContract = await EventContract.deploy(ticketFactory.target);
    const blockNumBefore = await ethers.provider.getBlockNumber();
    const block = await ethers.provider.getBlock(blockNumBefore);

    return { eventContract, ticketFactory, owner, user, block };
  };

  describe("EventContract", function () {
    it("Should create an event successfully", async function () {
      const { eventContract, owner, block } = await loadFixture(deployContracts);

      await eventContract.createEvent("Blockchain", "A major blockchain event", block.timestamp + 86400, block.timestamp + 172800, 0, 100, "SummitTicket", "STK");

      const event = await eventContract.events(1);
      expect(event.title).to.equal("Blockchain");
      expect(event.expectedGuestCount).to.equal(100);
      expect(event.organizer).to.equal(owner.address);
    });

    it("Should allow users to register for an event and mint a ticket", async function () {
      const { eventContract, user, block } = await loadFixture(deployContracts);

      await eventContract.createEvent("Tech Expo", "A big tech event", block.timestamp + 86400, block.timestamp + 172800, 0, 50, "ExpoTicket", "ETK");

      await eventContract.connect(user).registerForEvent(1);

      const event = await eventContract.events(1);
      expect(event.registeredGuestCount).to.equal(1);

      const ticketContract = await ethers.getContractAt("PeteOnChainNFT", event.ticketAddress);
      expect(await ticketContract.balanceOf(user.address)).to.equal(1);
    });

    it("Should prevent duplicate registration", async function () {
      const { eventContract, user, block } = await loadFixture(deployContracts);

      await eventContract.createEvent("Duplicate Test", "Testing duplicate registrations", block.timestamp + 86400, block.timestamp + 172800, 0, 10, "DupTicket", "DTK");

      await eventContract.connect(user).registerForEvent(1);
      await expect(eventContract.connect(user).registerForEvent(1)).to.be.revertedWith("ALREADY REGISTERED");
    });

    it("Should allow users to check in if they own a ticket and event has started", async function () {
      const { eventContract, user, block } = await loadFixture(deployContracts);

      const startTime = block.timestamp + 2; // Starts in 2 seconds
      const endTime = startTime + 86400; // 1 day

      await eventContract.createEvent("Live Event", "A test event", startTime, endTime, 0, 5, "LiveTicket", "LTK");
      await eventContract.connect(user).registerForEvent(1);

      await ethers.provider.send("evm_increaseTime", [3]); // Fast-forward time to 3 seconds
      await ethers.provider.send("evm_mine", []);

      await eventContract.connect(user).checkIn(1);
      const event = await eventContract.events(1);
      expect(event.attendedGuestCount).to.equal(1);
    });

    it("Should prevent check-in before event starts", async function () {
      const { eventContract, user, block } = await loadFixture(deployContracts);

      await eventContract.createEvent("Future Event", "Event that hasn't started", block.timestamp + 86400, block.timestamp + 172800, 0, 10, "FutureTicket", "FTK");

      await eventContract.connect(user).registerForEvent(1);
      await expect(eventContract.connect(user).checkIn(1)).to.be.revertedWith("EVENT HAS NOT STARTED");
    });

    it("Should prevent check-in without a valid ticket", async function () {
      const { eventContract, user, block } = await loadFixture(deployContracts);

      await eventContract.createEvent("No Ticket Check-in", "Attempting check-in without ticket", block.timestamp + 2, block.timestamp + 172800, 0, 10, "NoTicket", "NTK");

      await ethers.provider.send("evm_increaseTime", [3]);
      await ethers.provider.send("evm_mine", []);

      await expect(eventContract.connect(user).checkIn(1)).to.be.revertedWith("NO VALID TICKET AVAILABLE FOR THIS GUEST");
    });

    it("Should prevent duplicate check-ins", async function () {
      const { eventContract, user, block } = await loadFixture(deployContracts);

      const startTime = block.timestamp + 2; // starts in two seconds
      const endTime = startTime + 86400;

      await eventContract.createEvent("Single Check-in", "Ensure single attendance", startTime, endTime, 0, 5, "SCITicket", "SCIT");

      await eventContract.connect(user).registerForEvent(1);

      await ethers.provider.send("evm_increaseTime", [3]); // Fast-forward time 3 seconds
      await ethers.provider.send("evm_mine", []);

      await eventContract.connect(user).checkIn(1);
      await expect(eventContract.connect(user).checkIn(1)).to.be.revertedWith("ALREADY CHECKED IN");
    });
  });
});
