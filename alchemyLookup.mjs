
import { Alchemy, Network } from "alchemy-sdk";
import { ethers } from "ethers";

// const config = {
//   apiKey: process.env.ALCHEMY_API_KEY,
//   network: Network.ETH_MAINNET,
// };
// const alchemy = new Alchemy(config);

// const walletAddress = "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97"; // replace with wallet address
// const ensContractAddress = "0x4838b106fce9647bdf1e7877bf73ce8b0bad5f97";
// const nfts = await alchemy.nft.getNftsForOwner(walletAddress, {
//   contractAddresses: [ensContractAddress],
// });

// console.log(nfts);

const mainnetProvider = new ethers.providers.JsonRpcProvider("https://eth-mainnet-public.unifra.io");
const ensname = await mainnetProvider.lookupAddress('0xc30992a53b3e91385ace2575963aa392edb3b931'); // this returns ens name
mainnetProvider.resolveName('sandeep45.eth'); // this returns address

console.log(ensname)