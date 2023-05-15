// import idl from "./idl.json";
import idl from "../idl.json";
import {
  Connection,
  PublicKey,
  clusterApiUrl,
  Transaction,
  LAMPORTS_PER_SOL,
} from "@solana/web3.js";
// import fs from 'fs';
import {
  Program,
  AnchorProvider,
  web3,
  utils,
  BN,
} from "@project-serum/anchor";
import { useEffect, useState } from "react";
import { Buffer } from "buffer";
import axios from "axios";
import { Link } from "react-router-dom";
import MyContext from "../context/context";
// import GetNFT from "./GetNFT";
import e from "cors";
window.Buffer = Buffer;

const Home = () => {
  const [walletAddress, setWalletAddress] = useState(null);
  const [name, setName] = useState();
  const [description, setDescription] = useState();
  const [url, setUrl] = useState("");
  const [image, setImage] = useState();
  const [value, setValue] = useState();
  const [mintAddress, setMintAddress] = useState("");
  const [statusResponce, setStatusResponce] = useState({});
  const [transectionHash, setTransectionHash] = useState("");
  const [statusTResponce, setStatusTResponce] = useState({});

  console.log("first", name, walletAddress, description, image);

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
  console.log("URLLLL", url);
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
      const response = await solana.connect();
      console.log(
        "=====> connect with publickey: ",
        response.publicKey.toString()
      );
      setWalletAddress(response.publicKey.toString());
    }
  };

  const renderNotConnectedContainer = () => {
    return <button onClick={connectToWallet}> Connect to Wallet </button>;
  };


  const renderConnectedContainer = () => {
    return (
      <div className="bg-white min-h-screen">
        <div className="py-10">
          {/* create NFT */}
          <Link to={`/create_nft/${walletAddress}`}>
            <button
              className="text-3xl font-bold mb-6 bg-blue-500 text-dark py-2 px-4 rounded hover:bg-blue-700"
              class="btn btn-warning"
            >
              Create NFT
            </button>
          </Link>
        </div>
        <br />
        <br />
       
        <button onClick={() => getStatus(mintAddress)}>Get Status</button>
        <input
          type="text"
          placeholder="Enter MintAddress"
          onChange={(e) => setMintAddress(e.target.value)}
        />
        <br />
      </div>
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

export default Home;
