import * as anchor from "@project-serum/anchor";
// ** Comment this to use solpg imported IDL **
import { SolanaNftRust } from "../target/types/solana_nft_rust";


describe("nft-marketplace", async () => {
  
  const testNftTitle = "NFT Beta";
  const testNftSymbol = "BETA";
  const testNftUri = "https://fxcus6wgjod2hjzxopgcuiacziog3p3c27e3ji5fsyx2gutwwona.arweave.net/LcVJesZLh6OnN3PMKiACyhxtv2LXybSjpZYvo1J2s5o/";

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

  const TOKEN_METADATA_PROGRAM_ID = new anchor.web3.PublicKey(
    "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s" //metaplex token program
  );


  it("Mint!", async () => {

    // Derive the mint address and the associated token account address
    const mintKeypair: anchor.web3.Keypair = anchor.web3.Keypair.generate();
    const tokenAddress = await anchor.utils.token.associatedAddress({
      mint: mintKeypair.publicKey,
      owner: wallet.publicKey
    });
    console.log(`New token: ${mintKeypair.publicKey}`);

    // Derive the metadata and master edition addresses

    const metadataAddress = (await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
    console.log("Metadata initialized");
    const masterEditionAddress = (await anchor.web3.PublicKey.findProgramAddress(
      [
        Buffer.from("metadata"),
        TOKEN_METADATA_PROGRAM_ID.toBuffer(),
        mintKeypair.publicKey.toBuffer(),
        Buffer.from("edition"),
      ],
      TOKEN_METADATA_PROGRAM_ID
    ))[0];
    console.log("Master edition metadata initialized");

    // Transact with the "mint" function in our on-chain program
    
    await program.methods.mint(
      testNftTitle, testNftSymbol, testNftUri
    )
    .accounts({
      masterEdition: masterEditionAddress,
      metadata: metadataAddress,
      mint: mintKeypair.publicKey,
      tokenAccount: tokenAddress,
      mintAuthority: wallet.publicKey,
      tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID,
    })
    .signers([mintKeypair])
    .rpc();
  });
});