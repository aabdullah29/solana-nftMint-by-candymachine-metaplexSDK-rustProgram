import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const metaplex = Metaplex.make(connection);

async function Check() {
  //Get all Minted NFTs provide user Public key
  const owner = new PublicKey("F2YgKD7rDYSntzPTohofUrWHZj2uEqrhDY9tpYs52FBz");
  const allNFTs = await metaplex.nfts().findAllByOwner({ owner });
  console.log("All Nfts:", allNFTs);
}
Check();
// {
//   "dependencies": {
//     "@metaplex-foundation/js": "^0.18.3",
//     "@solana/web3.js": "^1.74.0"
//   },
//   "type": "module"
// }
