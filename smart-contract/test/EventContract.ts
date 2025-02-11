// import { expect } from "chai";
// import { ethers } from "hardhat";
// // import { EventContract, TicketFactory, PeteOnChainNFT } from "../typechain-types";

// describe("EventContract", function () {
//   it("Should create an event successfully", async function () {
//     const [owner] = await ethers.getSigners();

//     const TicketFactory = await ethers.getContractFactory("TicketFactory");
//     const ticketFactory = await TicketFactory.deploy();
//     await ticketFactory.deployed();

//     const EventContract = await ethers.getContractFactory("EventContract");
//     const eventContract = await EventContract.deploy(ticketFactory.address);
//     await eventContract.deployed();

//     const tx = await eventContract.createEvent(
//       "Blockchain Summit",
//       "A major blockchain event",
//       (await ethers.provider.getBlock("latest")).timestamp + 86400, // Start date (1 day ahead)
//       (await ethers.provider.getBlock("latest")).timestamp + 172800, // End date (2 days ahead)
//       0, // Free event
//       100, // Expected guests
//       "SummitTicket",
//       "STK"
//     );

//     await tx.wait();

//     const event = await eventContract.events(1);
//     expect(event.title).to.equal("Blockchain Summit");
//     expect(event.expectedGuestCount).to.equal(100);
//     expect(event.organizer).to.equal(owner.address);
//   });

//   it("Should allow users to register for an event and mint a ticket", async function () {
//     const [owner, user] = await ethers.getSigners();

//     const TicketFactory = await ethers.getContractFactory("TicketFactory");
//     const ticketFactory = await TicketFactory.deploy();
//     await ticketFactory.deployed();

//     const EventContract = await ethers.getContractFactory("EventContract");
//     const eventContract = await EventContract.deploy(ticketFactory.address);
//     await eventContract.deployed();

//     await eventContract.createEvent(
//       "Tech Expo",
//       "A big tech event",
//       (await ethers.provider.getBlock("latest")).timestamp + 86400,
//       (await ethers.provider.getBlock("latest")).timestamp + 172800,
//       0,
//       50,
//       "ExpoTicket",
//       "ETK"
//     );

//     await eventContract.connect(user).registerForEvent(1);

//     const event = await eventContract.events(1);
//     expect(event.registeredGuestCount).to.equal(1);

//     const ticketContract = await ethers.getContractAt("PeteOnChainNFT", event.ticketAddress);
//     expect(await ticketContract.balanceOf(user.address)).to.equal(1);
//   });

//   it("Should prevent duplicate registration", async function () {
//     const [_, user] = await ethers.getSigners();

//     const TicketFactory = await ethers.getContractFactory("TicketFactory");
//     const ticketFactory = await TicketFactory.deploy();
//     await ticketFactory.deployed();

//     const EventContract = await ethers.getContractFactory("EventContract");
//     const eventContract = await EventContract.deploy(ticketFactory.address);
//     await eventContract.deployed();

//     await eventContract.createEvent(
//       "Duplicate Test",
//       "Testing duplicate registrations",
//       (await ethers.provider.getBlock("latest")).timestamp + 86400,
//       (await ethers.provider.getBlock("latest")).timestamp + 172800,
//       0,
//       10,
//       "DupTicket",
//       "DTK"
//     );

//     await eventContract.connect(user).registerForEvent(1);
//     await expect(eventContract.connect(user).registerForEvent(1)).to.be.revertedWith("ALREADY REGISTERED");
//   });

//   it("Should allow users to check in if they own a ticket and event has started", async function () {
//     const [_, user] = await ethers.getSigners();

//     const TicketFactory = await ethers.getContractFactory("TicketFactory");
//     const ticketFactory = await TicketFactory.deploy();
//     await ticketFactory.deployed();

//     const EventContract = await ethers.getContractFactory("EventContract");
//     const eventContract = await EventContract.deploy(ticketFactory.address);
//     await eventContract.deployed();

//     const startTime = (await ethers.provider.getBlock("latest")).timestamp + 2; // Starts in 2 seconds
//     const endTime = startTime + 86400;

//     await eventContract.createEvent("Live Event", "A test event", startTime, endTime, 0, 5, "LiveTicket", "LTK");
//     await eventContract.connect(user).registerForEvent(1);

//     await ethers.provider.send("evm_increaseTime", [3]); // Fast-forward time
//     await ethers.provider.send("evm_mine", []);

//     await eventContract.connect(user).checkIn(1);
//     const event = await eventContract.events(1);
//     expect(event.attendedGuestCount).to.equal(1);
//   });

//   it("Should prevent check-in before event starts", async function () {
//     const [_, user] = await ethers.getSigners();

//     const TicketFactory = await ethers.getContractFactory("TicketFactory");
//     const ticketFactory = await TicketFactory.deploy();
//     await ticketFactory.deployed();

//     const EventContract = await ethers.getContractFactory("EventContract");
//     const eventContract = await EventContract.deploy(ticketFactory.address);
//     await eventContract.deployed();

//     await eventContract.createEvent(
//       "Future Event",
//       "Event that hasn't started",
//       (await ethers.provider.getBlock("latest")).timestamp + 86400,
//       (await ethers.provider.getBlock("latest")).timestamp + 172800,
//       0,
//       10,
//       "FutureTicket",
//       "FTK"
//     );

//     await eventContract.connect(user).registerForEvent(1);
//     await expect(eventContract.connect(user).checkIn(1)).to.be.revertedWith("EVENT HAS NOT STARTED");
//   });

//   it("Should prevent check-in without a valid ticket", async function () {
//     const [_, user] = await ethers.getSigners();

//     const TicketFactory = await ethers.getContractFactory("TicketFactory");
//     const ticketFactory = await TicketFactory.deploy();
//     await ticketFactory.deployed();

//     const EventContract = await ethers.getContractFactory("EventContract");
//     const eventContract = await EventContract.deploy(ticketFactory.address);
//     await eventContract.deployed();

//     await eventContract.createEvent(
//       "No Ticket Check-in",
//       "Attempting check-in without ticket",
//       (await ethers.provider.getBlock("latest")).timestamp + 2,
//       (await ethers.provider.getBlock("latest")).timestamp + 172800,
//       0,
//       10,
//       "NoTicket",
//       "NTK"
//     );

//     await ethers.provider.send("evm_increaseTime", [3]); // Fast-forward time
//     await ethers.provider.send("evm_mine", []);

//     await expect(eventContract.connect(user).checkIn(1)).to.be.revertedWith("NO VALID TICKET");
//   });

//   it("Should prevent duplicate check-ins", async function () {
//     const [_, user] = await ethers.getSigners();

//     const TicketFactory = await ethers.getContractFactory("TicketFactory");
//     const ticketFactory = await TicketFactory.deploy();
//     await ticketFactory.deployed();

//     const EventContract = await ethers.getContractFactory("EventContract");
//     const eventContract = await EventContract.deploy(ticketFactory.address);
//     await eventContract.deployed();

//     const startTime = (await ethers.provider.getBlock("latest")).timestamp + 2;
//     const endTime = startTime + 86400;

//     await eventContract.createEvent("Single Check-in", "Ensure single attendance", startTime, endTime, 0, 5, "SCITicket", "SCIT");

//     await eventContract.connect(user).registerForEvent(1);

//     await ethers.provider.send("evm_increaseTime", [3]); // Fast-forward time
//     await ethers.provider.send("evm_mine", []);

//     await eventContract.connect(user).checkIn(1);
//     await expect(eventContract.connect(user).checkIn(1)).to.be.revertedWith("ALREADY CHECKED IN");
//   });
// });
