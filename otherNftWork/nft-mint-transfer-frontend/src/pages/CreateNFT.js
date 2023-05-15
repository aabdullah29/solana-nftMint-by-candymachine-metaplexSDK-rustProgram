import React, { useEffect, useState } from "react";
import axios from "axios";
// import './resources/css/custom2.css';
import { signAndConfirmTransactionFe } from "../utilityfunc";

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
import disPic from "../assets/images/upload-file.jpg";
import { useParams } from "react-router";
const xApiKey = "Rj_GTwQGOZFuTJXg"; //Enter Your x-api-key here
const Create = () => {
  const [file, setfile] = useState();
  const [displayPic, setDisplayPic] = useState(disPic);
  const [network, setnetwork] = useState("devnet");
  // const [privKey, setprivKey] = useState();
  const [pubKey, setPublicKey] = useState("");
  const [name, setName] = useState();
  const [symbol, setSymbol] = useState();
  const [desc, setDesc] = useState();
  const [attr, setAttr] = useState(
    JSON.stringify([{ trait_type: "edification", value: "100" }])
  );
  const [extUrl, setExtUrl] = useState();
  const [maxSup, setMaxSup] = useState(0);
  const [roy, setRoy] = useState(99);
  const [Thash, setThash] = useState("");

  const [minted, setMinted] = useState();
  const [saveMinted, setSaveMinted] = useState();
  const [errorRoy, setErrorRoy] = useState();

  const [status, setStatus] = useState("Awaiting Upload");
  const [dispResponse, setDispResp] = useState("");

  const [connStatus, setConnStatus] = useState(true);
  const [mintAddress, setMintAddress] = useState("");
  const { walletAddress } = useParams();
  useEffect(() => {
    if (walletAddress) {
      setPublicKey(walletAddress);
    }
  }, []);

  console.log("walletAddress::", walletAddress);
  const callback = (signature, result) => {
    console.log("Signature ", signature);
    console.log("result ", result);
    if (signature.err === null) {
      setMinted(saveMinted);
      setStatus("success: Successfully Signed and Minted.");
    }
  };
  //set the network provider
  const getProvider = () => {
    const network = clusterApiUrl("devnet");
    const opts = { preflightCommitment: "processed" };
    const connection = new Connection(network, opts.preflightCommitment);
    const provider = new AnchorProvider(
      connection,
      window.solana,
      opts.preflightCommitment
    );

    return { connection, provider };
  };
  //transfer funtion
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
      //get wallet info from user side
      const walletAccountInfo = await connection.getAccountInfo(
        provider.wallet.publicKey
      );
      //get wallet info from admin side
      const receiverAccountInfo = await connection.getAccountInfo(destPubkey);
      const instruction = web3.SystemProgram.transfer({
        fromPubkey: provider.wallet.publicKey,
        toPubkey: destPubkey,
        lamports,
      });
      //create instruction
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

  //mint function
  async function mintNow(e) {
    e.preventDefault();
    transferSOL();
    setStatus("Loading");
    //catching params
    let formData = new FormData();
    formData.append("network", network);
    formData.append("wallet", pubKey);
    formData.append("name", name);
    formData.append("symbol", symbol);
    formData.append("description", desc);
    formData.append("attributes", JSON.stringify(attr));
    formData.append("external_url", extUrl);
    formData.append("max_supply", maxSup);
    formData.append("royalty", roy);
    formData.append("file", file);

    axios({
      // Endpoint to send files
      url: "https://api.shyft.to/sol/v1/nft/create_detach",
      method: "POST",
      headers: {
        "Content-Type": "multipart/form-data",
        "x-api-key": xApiKey,
        Accept: "*/*",
        "Access-Control-Allow-Origin": "*",
      },

      // attaching the form data
      data: formData,
    })
      // handle the response from backend here
      .then(async (res) => {
        console.log(res);
        if (res.data.success === true) {
          setStatus(
            "success: Transaction Created. Signing Transactions. Please Wait."
          );
          const transaction = res.data.result.encoded_transaction;
          setSaveMinted(res.data.result.mint);
          //sign transaction for mint the nft
          const ret_result = await signAndConfirmTransactionFe(
            network,
            transaction,
            callback
          );
          setMintAddress(res.data.result.mint);
          setThash(ret_result);
          console.log(ret_result);
          setDispResp(res.data);
        }
      })

      // Catch errors if any
      .catch((err) => {
        console.warn(err);
        setStatus("success: false");
      });
  }

  return (
    <div className="gradient-background">
      <div className="container p-5">
        {connStatus && (
          <div
            className="form-container border border-primary rounded py-3 px-5"
            style={{ backgroundColor: "#FFFFFFEE" }}
          >
            <h3 className="pt-4">Create An Nft</h3>
            <form>
              <div className="img-container text-center mt-5">
                <div
                  className="uploaded-img"
                  style={{
                    height: "200px",
                    width: "200px",
                    backgroundColor: "grey",
                    margin: "0 auto",
                    borderRadius: "10px",
                  }}
                >
                  <img
                    src={displayPic}
                    alt="To be uploaded"
                    style={{
                      height: "100%",
                      width: "100%",
                      objectFit: "cover",
                    }}
                  />
                </div>
                <div className="mt-3"></div>
                <button className="btn btn-primary button-24 text-light rounded-pill m-2">
                  Select File
                </button>
                <br></br>
                <input
                  type="file"
                  style={{
                    position: "absolute",
                    zIndex: "3",
                    marginTop: "-50px",
                    marginLeft: "-70px",
                    width: "150px",
                    height: "40px",
                    opacity: "0",
                  }}
                  onChange={(e) => {
                    const [file_selected] = e.target.files;
                    setfile(e.target.files[0]);
                    setDisplayPic(URL.createObjectURL(file_selected));
                  }}
                />
                <div className="mb-3"></div>
              </div>
              <div className="fields">
                <table className="table">
                  <tbody>
                    <tr>
                      <td className="py-4 ps-2 w-50 text-start">
                        Network
                        <br />
                        <small>
                          Solana blockchain environment
                          (testnet/devnet/mainnet-beta)
                        </small>
                      </td>
                      <td className="px-5 pt-4">
                        <select
                          name="network"
                          className="form-select"
                          onChange={(e) => setnetwork(e.target.value)}
                        >
                          <option value="devnet">Devnet</option>
                          <option value="testnet">Testnet</option>
                          <option value="mainnet-beta">Mainnet Beta</option>
                        </select>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 ps-2 w-50 text-start">
                        Public Key
                        <br />
                        <small>Your wallet's public key (string)</small>
                      </td>
                      <td className="px-5 pt-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Your Wallet's Public Key"
                          value={pubKey}
                          onChange={(e) => setPublicKey(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 ps-2 text-start">
                        Name
                        <br />
                        <small>Your NFT Name (string)</small>
                      </td>
                      <td className="px-5 pt-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter NFT Name"
                          value={name}
                          onChange={(e) => setName(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 ps-2 text-start">
                        Symbol
                        <br />
                        <small>Your NFT Symbol (string)</small>
                      </td>
                      <td className="px-5 pt-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="symbol"
                          value={symbol}
                          onChange={(e) => setSymbol(e.target.value)}
                          required
                        />
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 ps-2 text-start">
                        Description <br />
                        <small>Add a small story to this NFT (string)</small>
                      </td>
                      <td className="px-5 py-3">
                        <textarea
                          className="form-control"
                          placeholder="Enter Description"
                          value={desc}
                          onChange={(e) => setDesc(e.target.value)}
                          required
                        ></textarea>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 ps-2 text-start">
                        Attributes <br />
                        <small>
                          Attributes associated to this NFT. (Should have
                          'trait_type' and 'value')
                        </small>
                      </td>
                      <td className="px-5 py-3">
                        <textarea
                          className="form-control"
                          placeholder="Enter Attributes"
                          value={attr}
                          onChange={(e) => setAttr(e.target.value)}
                          required
                        ></textarea>
                      </td>
                    </tr>
                    <tr>
                      <td className="py-4 ps-2 text-start">
                        External Url <br />
                        <small>Any url to associate with the NFT</small>
                      </td>
                      <td className="px-5 pt-4">
                        <input
                          type="text"
                          className="form-control"
                          placeholder="Enter Url if Any"
                          value={extUrl}
                          onChange={(e) => setExtUrl(e.target.value)}
                        />
                      </td>
                    </tr>
                  </tbody>
                </table>
                <div className="p-5 text-center">
                  <button
                    type="submit"
                    className="btn btn-success button-25"
                    onClick={mintNow}
                  >
                    Submit
                  </button>
                </div>
              </div>
            </form>
            <div className="text-center">
              This creates one of kind NFTs by setting the{" "}
              <code>max_supply</code> parameter to 0. But you can update it
              needed, it should be between <i>0-100</i>.
            </div>
          </div>
        )}

        <div className="py-5">
          <h2 className="text-center pb-3">Response</h2>
          <div className="status text-center text-info p-3">
            <b>{status}</b>
          </div>
          <textarea
            className="form-control"
            name=""
            value={JSON.stringify(dispResponse)}
            id=""
            cols="30"
            rows="10"
          ></textarea>
        </div>
        <div>
          <h3>Transection Hash</h3>
          <p>{Thash}</p>
          <h3>Mint Address</h3>
          <p>{mintAddress}</p>
        </div>
      </div>
    </div>
  );
};

export default Create;
