const { Alchemy, Network } = require("alchemy-sdk");
require("dotenv").config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const findBlockWithUncles = async () => {
  try {
    let blockNum = await alchemy.core.getBlockNumber();

    while (blockNum > 0) {
      const block = await alchemy.core.getBlock(blockNum);
      if (block && block.uncles && block.uncles.length > 0) {
        console.log(`Block ${blockNum} has uncles:`);
        console.log(block);
        return blockNum;
      }
      blockNum--;
    }

    console.log("No block with uncles found in the recent blocks.");
  } catch (error) {
    console.log("Error fetching block:", error);
  }
};

findBlockWithUncles();
