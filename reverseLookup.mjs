import { AlchemyProvider } from "@ethersproject/providers";

const alchemyProvider = new AlchemyProvider("mainnet", process.env.ALCHEMY_API_KEY);

async function reverseLookup(address) {
  try {
   
    const ensName = await alchemyProvider.lookupAddress(address);

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

reverseLookup("0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97");
