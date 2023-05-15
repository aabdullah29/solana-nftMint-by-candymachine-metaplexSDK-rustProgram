import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair } from "@solana/web3.js";

const connection = new Connection(clusterApiUrl("devnet"));
const wallet = Keypair.generate();
console.log("Public Key: ", wallet.publicKey.toString());

(async () => {
  //air drop
  const airdropSignature = await connection.requestAirdrop(
    wallet.publicKey,
    2000000000 // (1 SOL = 1000000000 lamports)
  );

  await connection.confirmTransaction(airdropSignature);
  console.log(`Airdrop of 1 SOL complete: ${wallet.publicKey.toBase58()}`);

  const metaplex = Metaplex.make(connection)

    .use(keypairIdentity(wallet))

    .use(
      bundlrStorage({
        address: "https://devnet.bundlr.network",

        providerUrl: "https://api.devnet.solana.com",

        timeout: 60000,
      })
    );

  //upload Metadata
  const { uri } = await metaplex.nfts().uploadMetadata({
    name: "My Old NFT",
    description: "My Old description",
    image: "https://arweave.net/123",
  });

  console.log("URI: ", uri);

  //mint NFT
  // const { nft } = await metaplex.nfts().create(
  //   {
  //     uri: "https://arweave.net/123",
  //     name: "My Old NFT",
  //     sellerFeeBasisPoints: 500, // Represents 5.00%.
  //   },
  //   { commitment: "finalized" }
  // );
  
  // console.log("Token Address: ", nft)

  // //Update Metadata
  // const { uri: newUri } = await metaplex.nfts().uploadMetadata({
  //   ...nft.json,
  //   name: "My Updated Metadata",
  //   description: "My Updated Metadata Description",
  // });

  // const update = await metaplex.nfts().update({
  //   nftOrSft: nft,
  //   uri: newUri,
  // });
  // console.log("New Metadata URI: ", newUri);

  // console.log("Tx Signature:", update.response.signature);
})();
