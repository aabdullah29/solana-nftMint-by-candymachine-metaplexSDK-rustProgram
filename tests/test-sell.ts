import * as anchor from "@project-serum/anchor";
import {  createKeypairFromFile,} from './util';
// ** Comment this to use solpg imported IDL **
import { SolanaNftRust } from "../target/types/solana_nft_rust";


describe("sell-nft", async () => {
  

  const provider = anchor.AnchorProvider.env()
  const wallet = provider.wallet as anchor.Wallet;
  anchor.setProvider(provider);

  // ** Un-comment this to use solpg imported IDL **
  // const program = new anchor.Program(
  //   require("../clint/idl.json"), 
  //   new anchor.web3.PublicKey("copy and past program ID"),
  // );
  // ** Comment this to use solpg imported IDL **
  const program = anchor.workspace.SolanaNftRust as anchor.Program<SolanaNftRust>;


  it("Sell!", async () => {

    // Testing constants
    const saleAmount = 2 * anchor.web3.LAMPORTS_PER_SOL;
    const mint: anchor.web3.PublicKey = new anchor.web3.PublicKey(
      "7Kf19R2V5DkNZePFMArQJYUjM3yy3kysig3prBpPnTny"
    );
    // const buyer: anchor.web3.Keypair = await createKeypairFromFile(__dirname + "my-solana-wallet/buy.json");
    const buyer: anchor.web3.Keypair = await createKeypairFromFile("/home/abdullah/solana/solana-nft-rust/my-solana-wallet/buy.json");
    console.log(`Buyer public key: ${buyer.publicKey}`);

    // Derive the associated token account address for owner & buyer

    const ownerTokenAddress = await anchor.utils.token.associatedAddress({
      mint: mint,
      owner: wallet.publicKey
    });
    const buyerTokenAddress = await anchor.utils.token.associatedAddress({
      mint: mint,
      owner: buyer.publicKey,
    });
    console.log(`Request to sell NFT: ${mint} for ${saleAmount} lamports.`);
    console.log(`Owner's Token Address: ${ownerTokenAddress}`);
    console.log(`Buyer's Token Address: ${buyerTokenAddress}`);

    // Transact with the "sell" function in our on-chain program
    
    await program.methods.sell(
      new anchor.BN(saleAmount)
    )
    .accounts({
      mint: mint,
      ownerTokenAccount: ownerTokenAddress,
      ownerAuthority: wallet.publicKey,
      buyerTokenAccount: buyerTokenAddress,
      buyerAuthority: buyer.publicKey,
    })
    .signers([buyer])
    .rpc();
  });
});