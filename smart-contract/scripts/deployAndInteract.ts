import { ethers, network } from "hardhat";
import fs from "fs";
import path from "path";

const delay = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const FILE_PATH = path.join(__dirname, "addressesByNetwork.json");

async function main() {
  const [deployer, user] = await ethers.getSigners();
  const networkName = network.name;

  console.log(`Running on network: ${networkName}`);
  console.log("Deploying contracts with account:", deployer.address);

  // Load or initialize already deployed addressesByNetwork.json
  let addresses: Record<string, any> = {};
  if (fs.existsSync(FILE_PATH)) {
    addresses = JSON.parse(fs.readFileSync(FILE_PATH, "utf8"));
  }

  let ticketFactoryAddress;
  let eventContractAddress;

  // Check if contracts are already deployed (skip deployment for persistent networks)
  if (addresses[networkName] && networkName !== "localhost" && networkName !== "hardhat") {
    console.log(`Contracts already deployed on ${networkName}:`, addresses[networkName]);
  } else {
    console.log("Deploying contracts...");

    // Deploy TicketFactory
    const TicketFactory = await ethers.getContractFactory("TicketFactory");
    const ticketFactory = await TicketFactory.deploy();
    await ticketFactory.waitForDeployment();
    console.log("TicketFactory deployed to:", ticketFactory.target);

    // Deploy EventContract with TicketFactory's address
    const EventContract = await ethers.getContractFactory("EventContract");
    const eventContract = await EventContract.deploy(ticketFactory.target);
    await eventContract.waitForDeployment();
    console.log("EventContract deployed to:", eventContract.target);

    // Save addresses
    addresses[networkName] = {
      ticketFactory: ticketFactory.target,
      eventContract: eventContract.target,
    };
    fs.writeFileSync(FILE_PATH, JSON.stringify(addresses, null, 2));
  }

  // Get contract instances
  ticketFactoryAddress = addresses[networkName].ticketFactory;
  eventContractAddress = addresses[networkName].eventContract;
  const eventContract = await ethers.getContractAt("EventContract", eventContractAddress);

  // Get block timestamp for event start time
  const block = await ethers.provider.getBlock("latest");
  const startTime = block.timestamp + 10;
  const endTime = startTime + 86400;

  // Create an event
  console.log("Creating an event...");
  let tx = await eventContract.createEvent("Blockchain Summit", "A major blockchain event", startTime, endTime, 0, 100, "SummitTicket", "STK");
  await tx.wait();
  console.log("Event created successfully.");

  // Register a user for the event
  console.log("Registering user for event...");
  tx = await eventContract.connect(user).registerForEvent(1);
  await tx.wait();
  console.log("User registered successfully.");

  // Get event details
  const event = await eventContract.events(1);
  console.log("Event details:", event);

  // Get ticket contract instance
  const ticketContract = await ethers.getContractAt("PeteOnChainNFT", event.ticketAddress);
  console.log("Ticket contract deployed to:", event.ticketAddress);

  // Check user ticket balance
  const ticketBalance = await ticketContract.balanceOf(user.address);
  console.log("User ticket balance:", ticketBalance.toString());

  // Wait for event to start
  console.log("Waiting for event to start...");
  await delay(10000);

  // Check-in user
  console.log("Checking in user...");
  tx = await eventContract.connect(user).checkIn(1);
  await tx.wait();
  console.log("User checked in successfully.");

  // Get updated event details
  const updatedEvent = await eventContract.events(1);
  console.log("Updated event details:", updatedEvent);
}

// Execute script
main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error(error);
    process.exit(1);
  });
