import { Account, Connection, PublicKey, SystemProgram, Transaction } from "@solana/web3.js";
import { Token, TOKEN_PROGRAM_ID } from "@solana/spl-token";
import { CreateMetadataArgs, Metadata, MetadataProgram } from "@metaplex-foundation/mpl-metaplex";

async function createMint(connection, payer, mintAuthority, decimals,provider) {
  const mintAccount = new Account(); // Create a new mint account
  const createMintAccountIx = Token.createInitMintInstruction(
    TOKEN_PROGRAM_ID,
    mintAuthority, // Use the new mint account's public key
    decimals,
    payer,
    null
  );

  const transaction = new Transaction().add(createMintAccountIx);
  transaction.feePayer = payer;
  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;
    console.log("blockhash", blockhash)
  const signedTransaction = await window.solana.signTransaction(transaction);
  console.log(signedTransaction);
  const signature = await provider.signAndSendTransaction(transaction);

  // Create a new Token instance with the created mint account's public key
  const mint = new Token(connection, payer, TOKEN_PROGRAM_ID, payer);

  return mint;
}

async function createMetadata(connection, metadata, mintAccount, payer) {
  const metadataProgramId = MetadataProgram.programId;
  const metadataAccount = await Metadata.getOrCreateMetadataAccount(
    metadataProgramId,
    mintAccount.publicKey,
    payer,
    payer
  );

  const createMetadataArgs = new CreateMetadataArgs(metadata);
  const createMetadataInstruction = MetadataProgram.createCreateMetadataInstruction(
    metadataProgramId,
    metadataAccount,
    mintAccount.publicKey,
    payer,
    payer,
    createMetadataArgs
  );

  const transaction = new Transaction().add(createMetadataInstruction);
  transaction.feePayer = payer;
  const { blockhash } = await connection.getRecentBlockhash();
  transaction.recentBlockhash = blockhash;

  const signedTransaction = await window.solana.signTransaction(transaction);
  const signature = await connection.sendRawTransaction(signedTransaction.serialize());

  return metadataAccount;
}

export async function mintNFT(connection, payer, wallet, metadata) {
  // Create mint
  const mint = await createMint(connection, payer, wallet.publicKey, 0,wallet); // Use 0 decimals for NFTs

  // Mint one token (NFT) to the wallet
  const tokenId = await mint.mintTo(wallet.publicKey, payer, [], 1);

  // Create metadata account for the NFT using the Metaplex standard
  const metadataAddress = await createMetadata(connection, metadata, mint, payer);

  return { tokenId, metadataAddress };
}
