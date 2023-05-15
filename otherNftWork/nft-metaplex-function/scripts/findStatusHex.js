import {
  Metaplex,
  keypairIdentity,
  bundlrStorage,
} from "@metaplex-foundation/js";
import { Connection, clusterApiUrl, Keypair, PublicKey } from "@solana/web3.js";
import { Account } from "@metaplex-foundation/mpl-core";
import { Metadata } from "@metaplex-foundation/mpl-token-metadata";
import axios from "axios";
const connection = new Connection(clusterApiUrl("devnet"));
const wallet = Keypair.generate();
const metaplex = Metaplex.make(connection);

//get all status provide transaction hash
const txHash =
  "2NJc4aKreXAi4Q8yCJ8rGdKHPtrB1MvEemMbNs3B26MY8a4zhYcVGRxwoWHSZeBKJyvKLNf8LX5YpvNQbLs9oz2T";
const transaction = await connection.getConfirmedTransaction(txHash);
console.log("first:", transaction)
// const NFT_Token_Address =
//   transaction.transaction._message.accountKeys[1].toString();
// console.log("first", NFT_Token_Address);
// if (transaction) {
//   console.log("Timestamp:", new Date(transaction.blockTime * 1000));
// } else {
//   console.log("Transaction not found");
// }
// if (transaction.meta.err === null) {
//   console.log("Transaction Succeed");
// }
// const PDA_metaData = await Metadata.getPDA(NFT_Token_Address);
// console.log("first===========>>>>>", PDA_metaData)

// //getting the account info by the program dervied address, We are getting the following information
// //e.g. Account  Public key, rentEpoch, Lamports, etc
// const mintAccInfo = await connection.getAccountInfo(PDA_metaData);

// const {
//   data: { data: meta_Data },
// } = Metadata.from(new Account(NFT_Token_Address, mintAccInfo));

//Printing out the MetaData of the token address
// console.log(meta_Data);

//Fetching the data of the URI we obtained from the metadata
// let uri_Data = await axios.get(meta_Data.uri);
//Printing the data of the URI
// console.log("name nft: ",uri_Data.data.name);
