import { ethers } from "ethers";

async function reverseLookup(address) {
  try {
    // Connect to a provider (use your preferred provider)
    const provider = new ethers.providers.InfuraProvider('mainnet', process.env.INFURA_API_URL); 

    // Perform reverse lookup
    const ensName = await provider.lookupAddress(address);

    if (ensName) {
      console.log(`ENS name for ${address}: ${ensName}`);
    } else {
      console.log(`No ENS name found for ${address}`);
    }

    console.log(ensName)
    return ensName;
  } catch (error) {
    console.error('Error performing reverse lookup:', error);
  }
}

// Example usage
reverseLookup("0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97");
