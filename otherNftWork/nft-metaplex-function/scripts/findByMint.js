import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

// const connection = new Connection(clusterApiUrl("devnet"));
// // const wallet = Keypair.generate();
// const metaplex = Metaplex.make(connection);

// async function Check() {
//   //Get Minted details provide token address
//   const mintAddress = new PublicKey(
//     "DzKets2eU5C6WHXgHiVkzK5gkrY3ZgVommSaqquUEDJw"
//   );
//   const nft = await metaplex.nfts().findByMint({ mintAddress });
//   console.log("Status: ", nft);
// }
// Check();

async function nftStatus(b) {
  // const conn = await new Connection(clusterApiUrl(CFG.cluster));
  
  let a = b;
  const connection = new Connection(clusterApiUrl("devnet"));
  const metaplex = Metaplex.make(connection);

  const mintAddress = new PublicKey(a);
  const nft = await metaplex.nfts().findByMint({ mintAddress });
  console.log("Status: ", nft);

  return nft;
}
nftStatus("DzKets2eU5C6WHXgHiVkzK5gkrY3ZgVommSaqquUEDJw");