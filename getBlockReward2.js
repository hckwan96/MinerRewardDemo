const { Alchemy, Network } = require("alchemy-sdk");
const { ethers, BigNumber } = require('ethers');
require('dotenv').config();

const ALCHEMY_API_KEY = process.env.ALCHEMY_API_KEY;

const settings = {
  apiKey: ALCHEMY_API_KEY,
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

const getBlockReward = async (blockNum) => {
  try {
    // Fetch the block
    const block = await alchemy.core.getBlock(blockNum);

    if (!block) {
      console.log("Block not found");
      return;
    }

    console.log("Block data:", block);

    const blockNumber = parseInt(block.number);
    const transactions = block.transactions;
    const baseFeePerGas = block.baseFeePerGas || 0;
    const gasUsed = block.gasUsed || 0;

    let minerTips = [];
    let sumMinerTips = 0;
    for (const tx of transactions) {
      const txReceipt = await alchemy.core.getTransactionReceipt(tx);
      const totalFee = ethers.utils.formatEther(
        BigNumber.from(txReceipt.gasUsed).mul(BigNumber.from(txReceipt.effectiveGasPrice))
      );
      minerTips.push(Number(totalFee));
    }

    if (transactions.length > 0) {
      sumMinerTips = minerTips.reduce(
        (prevTip, currentTip) => prevTip + currentTip
      );
    }

    const burnedFee = ethers.utils.formatEther(
      BigNumber.from(gasUsed).mul(BigNumber.from(baseFeePerGas))
    );

    const baseBlockReward = 2;
    const nephewReward = baseBlockReward / 32;
    const uncleHashes = block.uncles || [];  // Default to an empty array if uncles is undefined
    const uncleCount = uncleHashes.length;
    const totalNephewReward = uncleCount * nephewReward;

    let uncleRewardsArr = [];
    for (const uncleHash of uncleHashes) {
      const uncle = await alchemy.core.getBlock(uncleHash);
      if (uncle) {
        const uncleNum = parseInt(uncle.number);
        const uncleMiner = uncle.miner;
        const uncleReward = ((uncleNum + 8 - blockNumber) * baseBlockReward) / 8;
        uncleRewardsArr.push({
          reward: `${uncleReward}ETH`,
          miner: uncleMiner,
        });
      } else {
        console.log(`Uncle block for hash ${uncleHash} not found`);
      }
    }

    const blockReward = baseBlockReward + (sumMinerTips - Number(burnedFee));

    if (uncleCount > 0) {
      console.log("Block reward:", blockReward + totalNephewReward + "ETH");
      console.log("miner:", block.miner);
      console.log("Uncle rewards:");
      console.log(uncleRewardsArr);
    } else {
      console.log("Block reward:", blockReward + "ETH");
      console.log("miner:", block.miner);
    }
  } catch (error) {
    console.log("Error:", error);
  }
};

getBlockReward(15349734);
