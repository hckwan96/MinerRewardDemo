import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";

// Replace with your Alchemy API Key
const settings = {
  apiKey: "Ni7WdWUmz5fL_VtxRo-CbOZ5iXKCi6no",
  network: Network.ETH_MAINNET,
};

const alchemy = new Alchemy(settings);

async function getBlockNumberForTimestamp(timestamp) {
  const provider = new ethers.providers.AlchemyProvider("homestead", settings.apiKey);
  const block = await provider.getBlock("latest");
  let blockNumber = block.number;

  // Binary search to find the block number closest to the timestamp
  let lower = 0;
  let upper = blockNumber;
  while (lower <= upper) {
    const mid = Math.floor((lower + upper) / 2);
    const block = await provider.getBlock(mid);
    if (block.timestamp < timestamp) {
      lower = mid + 1;
    } else {
      upper = mid - 1;
    }
  }
  return lower;
}

async function getTotalTransactionsForDate(date) {
  const startOfDay = new Date();
  startOfDay.setUTCHours(0, 0, 0, 0);
  const endOfDay = new Date();
  endOfDay.setUTCHours(23, 59, 59, 999);
  console.log(startOfDay)
  console.log(endOfDay)
  const startTimestamp = Math.floor(startOfDay.getTime() / 1000);
  const endTimestamp = Math.floor(endOfDay.getTime() / 1000);

  const startBlockNumber = await getBlockNumberForTimestamp(startTimestamp);
  const endBlockNumber = await getBlockNumberForTimestamp(endTimestamp);

  let totalTransactions = 0;
  for (let i = startBlockNumber; i <= endBlockNumber; i++) {
    const block = await alchemy.core.getBlockWithTransactions(i);
    console.log(block.transactions.length)
    totalTransactions += block.transactions.length;
  }

  return totalTransactions;
}

const date = "2024-07-31"; // Replace with the desired date
getTotalTransactionsForDate(date).then(totalTransactions => {
  console.log(`Total transactions for ${date}:`, totalTransactions);
});
