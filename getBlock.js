// Imports the Alchemy SDK
const { Alchemy, Network } = require("alchemy-sdk");

// Configures the Alchemy SDK
const config = {
  apiKey: "alchemy-replit", // Replace with your API key
  network: Network.ETH_MAINNET, // Replace with your network
};

// Creates an Alchemy object instance with the config to use for making requests
const alchemy = new Alchemy(config);

const main = async () => {
  // using the block tag "latest" to get the latest block 
  // could've used a block hash to get a particualr block as well
  //let blockTagOrHash = "latest"
  //let blockTagOrHash = 2056987
  let blockTagOrHash = "0x0cc9a86a198251accf2b3fe281b01c4dbfbfc1ec2c2774385141e50f7ff83e73"

  let response = await alchemy.core.getBlock(blockTagOrHash);

  // logging the response to the console
  console.log(response)
};

main();