const { default: axios } = require("axios");
const { ethers } = require("ethers");
require("dotenv").config();

const ALCHEMY_API_URL = process.env.MAINNET_API_URL;

const getBlockReward = async blockNum => {
  const getBlock = async num => {
    try {
      console.log("Converting block number to hex:", num);
      const blockNumHex = ethers.utils.hexlify(num);
      console.log("Block number in hex:", blockNumHex);
      const blockRes = await axios.post(ALCHEMY_API_URL, {
        jsonrpc: "2.0",
        method: "eth_getBlockByNumber",
        params: [blockNumHex, true],
        id: 0,
      });
      
      return blockRes.data.result;
    } catch (error) {
      console.error("Error fetching block:", error);
    }
  };

  const getBlockByHash = async (hash) => {
    try {
      console.log("Fetching block by hash:", hash);
      const blockRes = await axios.post(ALCHEMY_API_URL, {
        jsonrpc: "2.0",
        method: "eth_getBlockByHash",
        params: [hash, true],
        id: 0,
      });

      return blockRes.data.result;
    } catch (error) {
      console.error("Error fetching block by hash:", error);
    }
  };

  const getGasUsage = async hash => {
    try {
      const txRes = await axios.post(ALCHEMY_API_URL, {
        jsonrpc: "2.0",
        method: "eth_getTransactionReceipt",
        params: [`${hash}`],
        id: 0,
      });
      return txRes.data.result.gasUsed;
    } catch (error) {
      console.error("Error fetching transaction receipt:", error);
    }
  };

  const getUncle = async hash => {
    try {
      const uncleRes = await axios.post(ALCHEMY_API_URL, {
        jsonrpc: "2.0",
        method: "eth_getBlockByHash",
        params: [`${hash}`, false],
        id: 0,
      });
      console.log("uncleRes:", uncleRes);
      return uncleRes.data.result;
    } catch (error) {
      console.error("Error fetching uncle block:", error);
    }
  };

  try {
    console.log("fetching block rewards...");
    console.log()
    if (!blockNum.startsWith("0x")) 
    {
      block = await getBlock(blockNum);
    } else {
      // If it starts with "0x", assume it's a block hash
      block = await getBlockByHash(blockNum);
    }


    //const block = await getBlock(blockNum);
    if (!block) {
      console.log("Block not found");
      return;
    }

    const blockNumber = parseInt(block.number);
    const transactions = block.transactions;
    const baseFeePerGas = block.baseFeePerGas ? block.baseFeePerGas : 0;
    const gasUsed = block.gasUsed;

    let minerTips = [];
    let sumMinerTips = 0;
    for (const tx of transactions) {
      const txGasUsage = await getGasUsage(tx.hash);
      const totalFee = ethers.utils.formatEther(
        BigInt(txGasUsage) * BigInt(tx.gasPrice)
      );
      minerTips.push(Number(totalFee));
    }

    if (transactions.length > 0) {
      sumMinerTips = minerTips.reduce(
        (prevTip, currentTip) => prevTip + currentTip
      );
    }

    const burnedFee = ethers.utils.formatEther(
      BigInt(gasUsed) * BigInt(baseFeePerGas)
    );

    //const baseBlockReward = baseFeePerGas == 0 ?  2 : 0;
    const baseBlockReward =  block.number >= 4370000 ? block.number >= 7280000 ?  baseFeePerGas == 0 ? 2 : 0 : 3 : 5;
    const nephewReward = baseBlockReward / 32;
    const uncleCount = block.uncles ? block.uncles.length : 0;
    const totalNephewReward = uncleCount * nephewReward;

    let uncleRewardsArr = [];
    for (const hash of block.uncles) {
      const uncle = await getUncle(hash);
      if (uncle) {
        const uncleNum = parseInt(uncle.number);
        const uncleMiner = uncle.miner;
        const uncleReward = ((uncleNum + 8 - blockNumber) * baseBlockReward) / 8;
        uncleRewardsArr.push({
          reward: `${uncleReward}ETH`,
          miner: uncleMiner,
        });

      console.log("uncle:", uncle);
      } else {
        console.log(`Uncle block for hash ${hash} not found`);
      }
    }

    const blockReward = baseBlockReward + (sumMinerTips - Number(burnedFee));

    if (uncleCount > 0) {
      console.log("\n\nBlock reward:", blockReward + totalNephewReward + "ETH");
      console.log("nephewReward:", totalNephewReward);
      console.log("sumMinerTips:", sumMinerTips);
      console.log("burnedFee:", burnedFee);
      console.log("miner:", block.miner);
      console.log("Uncle rewards:", uncleRewardsArr);
    } else {
      console.log("\n\nBlock reward:", blockReward + "ETH");
      console.log("baseBlockReward:", baseBlockReward);
      console.log("baseFeePerGas:", baseFeePerGas);
      console.log("sumMinerTips:", sumMinerTips);
      console.log("burnedFee:", burnedFee);
      console.log("miner:", block.miner);
    }
  } catch (error) {
    console.log(error);
  }
};

//getBlockReward(4370000);
getBlockReward("0x35fb355a9d66a3d2cf30f35eb4b98d5a7c2d76148056093d3856ee81eaba3a31")