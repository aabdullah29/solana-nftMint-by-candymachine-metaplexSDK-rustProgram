import idl from "./idl.json";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
} from "@project-serum/anchor";
import {
  TOKEN_PROGRAM_ID,
  createAssociatedTokenAccountInstruction,
  getAssociatedTokenAddress,
  createInitializeMintInstruction,
  MINT_SIZE,
} from "@solana/spl-token";

import "./App.css";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
window.Buffer = Buffer;

const App = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [url, setURL] = useState([]);
  const [name, setName] = useState([]);
  const [description, setDescription] = useState([]);
  // const [donateAmount, setDonateAmount] = useState([]);
  // const [withdrawAmount, setWithdrawAmount] = useState([]);

  const getProvider = () => {
    const prodramId = new PublicKey(idl.metadata.address);
    const network = clusterApiUrl("devnet");
    const opts = { preflightCommitment: "processed" };
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );

    const program = new Program(idl, prodramId, provider);

    return { connection, provider, program };
  };

  const checkIfWalletIsConnected = async () => {
    try {
      const { solana } = window;
      if (solana) {
        if (solana.isPhantom) {
          console.log("=====> Phantom Wallet found.");
          const response = await solana.connect({ onlyIfTrusted: true });
          console.log(
            "=====> Connect with Publickey: ",
            response.publicKey.toString()
          );
          setWalletAddress(response.publicKey.toString());
        } else {
          alert("Solana object notfound, please install phantom wallet.");
        }
      }
    } catch (error) {
      console.error("===> Error", error);
    }
  };

  const connectToWallet = async () => {
    const { solana } = window;
    if (solana) {
      const responce = await solana.connect();
      console.log(
        "=====> connect with publickey: ",
        responce.publicKey.toString()
      );
      setWalletAddress(responce.publicKey.toString());
    }
  };
  async function transferSOL() {
    const { provider, connection } = getProvider();
    //admin wallet account thats receive sol
    const receiverAddress = "2R8UAanGZpZSYcFrzkyKfm2Z5Eu8MjkFR51h6xkLCuiG";
    //amount of SOL (hardcoding amount)
    const amount = 1;
    const transaction = new web3.Transaction();

    try {
      //convert the sol from decimal
      const lamports = amount * LAMPORTS_PER_SOL;
      console.log("starting sendMoney");
      const destPubkey = new web3.PublicKey(receiverAddress);
      console.log("destPubkey", destPubkey);
      //get wallet info from user side
      const walletAccountInfo = await connection.getAccountInfo(
        provider.wallet.publicKey
      );
      //get wallet info from admin side
      const receiverAccountInfo = await connection.getAccountInfo(destPubkey);
      console.log("provider.wallet.publicKey,", provider.wallet.publicKey);
      console.log("destPubkey", destPubkey);
      console.log("lamports", lamports);
      const instruction = web3.SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: destPubkey,
        lamports,
      });
  
      console.log("instruction", instruction);
      transaction.add(instruction);
      transaction.feePayer = provider.wallet.publicKey;
      let hash = await connection.getRecentBlockhash();
      transaction.recentBlockhash = hash.blockhash;
      console.log("transaction", transaction);
      //sign transaction to transfer sol
      const { signature } = await window.solana.signAndSendTransaction(
        transaction
      );
      await connection.confirmTransaction(signature);
      //
    } catch (e) {
      console.warn("Failed", e);
    }
  }

  const nftMinting = async () => {
    try {
      /////
      // await transferSOL();
      const { solana } = window;
      const { connection, provider, program } = getProvider();

      // token metadata deployed address(built-in)
      const TOKEN_METADATA_PROGRAM_ID = new web3.PublicKey(
        "metaqbxxUerdq28cj1RbAWkYQm3ybzjb6a8bt518x1s"
      );
      // get lamports size for transaction
      const lamports =
        await program.provider.connection.getMinimumBalanceForRentExemption(
          MINT_SIZE
        );
      console.log("lamports", lamports);
      //get address from Program_ID
      const getMetadata = async (mint = web3.PublicKey) => {
        return (
          await web3.PublicKey.findProgramAddress(
            [
              Buffer.from("metadata"),
              TOKEN_METADATA_PROGRAM_ID.toBuffer(),
              mint.toBuffer(),
            ],
            TOKEN_METADATA_PROGRAM_ID
          )
        )[0];
      };

      // for master edition of nft
      const getMasterEdition = async (mint = web3.PublicKey) => {
        return (
          await web3.PublicKey.findProgramAddress(
            [
              Buffer.from("metadata"),
              TOKEN_METADATA_PROGRAM_ID.toBuffer(),
              mint.toBuffer(),
              Buffer.from("edition"),
            ],
            TOKEN_METADATA_PROGRAM_ID
          )
        )[0];
      };

      //create mint keypairs address
      const mintKey = web3.Keypair.generate();
      console.log("mintKey ==> ", mintKey.publicKey.toString());

      //create nft assocaited account
      const NftTokenAccount = await getAssociatedTokenAddress(
        mintKey.publicKey,
        provider.wallet.publicKey
      );
      console.log("NFT Account: ", NftTokenAccount.toBase58());

      //create trasaction for account
      const mint_tx = new web3.Transaction().add(
        web3.SystemProgram.createAccount({
          fromPubkey: provider.wallet.publicKey,
          newAccountPubkey: mintKey.publicKey,
          space: MINT_SIZE,
          programId: TOKEN_PROGRAM_ID,
          lamports,
        }),
        createInitializeMintInstruction(
          mintKey.publicKey,
          0,
          provider.wallet.publicKey,
          provider.wallet.publicKey
        ),
        createAssociatedTokenAccountInstruction(
          provider.wallet.publicKey,
          NftTokenAccount,
          provider.wallet.publicKey,
          mintKey.publicKey
        )
      );

      const res = await program.provider.sendAndConfirm(mint_tx, [mintKey]);
      console.log(
        "res",
        await program.provider.connection.getParsedAccountInfo(
          mintKey.publicKey
        )
      );

      console.log("Account: ", res);
      console.log("Mint key: ", mintKey.publicKey.toString());
      console.log("User: ", provider.wallet.publicKey.toString());

      const metadataAddress = await getMetadata(mintKey.publicKey);
      const masterEdition = await getMasterEdition(mintKey.publicKey);
      console.log("Metadata address: ", metadataAddress.toBase58());
      console.log("MasterEdition: ", masterEdition.toBase58());
      //////////////

      const tx = await program.methods
        .mintNft(mintKey.publicKey, url, name)
        .accounts({
          mintAuthority: provider.wallet.publicKey, //wallet address
          mint: mintKey.publicKey, //mint address
          tokenProgram: TOKEN_PROGRAM_ID, //spl library pre_def account
          metadata: metadataAddress, //meta data address
          tokenAccount: NftTokenAccount, //associated account for token
          tokenMetadataProgram: TOKEN_METADATA_PROGRAM_ID, //spl library pre_def account
          payer: provider.wallet.publicKey, //payer wallet address for sign trx
          systemProgram: web3.SystemProgram.programId, // System Program core program. It acts as "library"
          rent: web3.SYSVAR_RENT_PUBKEY, // cluster state information,
          masterEdition: masterEdition,
        })
        .rpc();

      console.log("=====> trx signature: ", tx);
    } catch (error) {
      console.error("===> Error", error);
    }
  };

  const renderNotConnectedContainer = () => {
    return <button onClick={connectToWallet}> Connect to Wallet </button>;
  };

  const renderConnectedContainer = () => {
    return (
      <>
        <br />
        <div style={{ marginBottom: "500px" }}>
          <h1>Mint NFT</h1>
          <input
            style={{ marginTop: "30px", width: "300px", height: "20px" }}
            type="text"
            placeholder="NFT Name"
            onChange={(e) => {
              setName(e.target.value);
            }}
          ></input>{" "}
          <br />
          {/* <input
            style={{ marginTop: "30px", width: "300px", height: "20px" }}
            type="text"
            placeholder="NFT Description"
            onChange={(e) => {
              setDescription(e.target.value);
            }}
          ></input>{" "} */}
          <br />
          <input
            style={{ marginTop: "30px", width: "300px", height: "20px" }}
            type="text"
            placeholder="Metadata URL"
            onChange={(e) => {
              setURL(e.target.value);
            }}
          ></input>{" "}
          <br />
          {/* <div  style={{ marginTop: "30px" }} >
            <input
              type="file"
            />
          </div> */}
          <button
            onClick={nftMinting}
            style={{ marginTop: "30px", height: "40px", width: "100px" }}
          >
            {" "}
            Mint{" "}
          </button>
        </div>
      </>
    );
  };

  useEffect(() => {
    const onLoad = async () => {
      await checkIfWalletIsConnected();
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return (
    <div className="App">
      {!walletAddress && renderNotConnectedContainer()}
      {walletAddress && renderConnectedContainer()}
    </div>
  );
};

export default App;
