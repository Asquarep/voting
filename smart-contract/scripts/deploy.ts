import { ignition } from "hardhat";
import EventContract from "../ignition/modules/EventContract";
import TicketFactory from "../ignition/modules/TicketFactory";

async function main() {
  console.log("Deploying TicketFactory...");
  const deployedFactory = await ignition.deploy(TicketFactory); // Get deployed instance
  const ticketFactoryAddress = deployedFactory.ticketFactory.target; // Extract address
  console.log("TicketFactory deployed at:", ticketFactoryAddress);

  console.log("Deploying EventContract...");
  const deployedEvent = await ignition.deploy(EventContract, {
    parameters: {
      _ticketFactory: ticketFactoryAddress.toString(), 
    },
  });

  console.log("✅ EventContract deployed at:", deployedEvent.target);
}

main()
  .then(() => process.exit(0))
  .catch((error) => {
    console.error("❌ Deployment failed:", error);
    process.exit(1);
  });
