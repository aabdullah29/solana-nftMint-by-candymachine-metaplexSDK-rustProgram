const {
  Metaplex,
  bundlrStorage,
  createNftBuilder,
  keypairIdentity,
  toMetaplexFile,
} = require("@metaplex-foundation/js");

const {
  Connection,
  clusterApiUrl,
  PublicKey,
  Keypair,
  LAMPORTS_PER_SOL,
  Transaction,
  sendAndConfirmTransaction,
  sendTransaction,
} = require("@solana/web3.js");
const bs58 = require("bs58");

const splToken = require("@solana/spl-token");

const fs = require("fs");

const log = require("./log");
const { resolveSoa } = require("dns");
const { TOKEN_PROGRAM_ID } = require("@solana/spl-token");

const dataDir = __dirname + "/data";
// dataDir should be created

let CFG = {
  cluster: "devnet",
  bundlr: {
    address: "https://devnet.bundlr.network",
    providerUrl: "https://api.devnet.solana.com",
  },
};
if (process.env.MAINNET) {
  // TODO: ...
}
function loadWallet(fileName) {
  const p = "data/" + fileName;

  if (!fs.existsSync(p)) {
    throw Error("wallet not found:", fileName);
  }
  let secretKey = fs.readFileSync(p);
  return Keypair.fromSecretKey(secretKey);
}

const payerWallet = loadWallet("payer");
log("payer wallet:", payerWallet.publicKey.toString());

async function transferNft(transferToStr, mintAddressStr) {
  const transferTo = new PublicKey(
    "A8ZXQAR4YarHyYTXfwqCJRYghiHc39j6U6x2HpnFgUP8"
  );
  const mintAddress = new PublicKey(
    "8Lueji9nwzfSjPn3F2N4WsC8hkqMGEFPehdXHzgjMba6"
  );
  const wallet = Keypair.fromSecretKey(
    bs58.decode(
      // "5vo4kPVn1Hb5vgsReyyXq5XLAZWVMetLqacjTm6k5aDZBmqMto4nNSHizrfTrpjmvfNGGxyYVetC18XjAn3xMQGk"
      "51nxb5UUrxmzKCR4cv3riFHLZBYkAfdLCoei51gMoFAq6k9SEKvSVUmZc3WkJBbVPFiiqaQShQ7yHDZUvTPpwTRJ"
    )
  );
  console.log("wallet: ", wallet.publicKey.toString());
  const conn = new Connection(clusterApiUrl(CFG.cluster));

  const tokenAddress = await splToken.getAssociatedTokenAddress(
    mintAddress,
    wallet.publicKey
  );
  log(`token addr: ${tokenAddress.toString()}`);

  const toTokenAccount = await splToken.getOrCreateAssociatedTokenAccount(
    conn,
    payerWallet,
    mintAddress,
    transferTo
  );
  log(`to token addr: ${toTokenAccount.address.toString()}`);

  (async () => {
    const tx = new Transaction();
    tx.add(
      splToken.createTransferInstruction(
        tokenAddress, // fromTokenAssocaitedAccount       toTokenAccount.address, // toTokenAddress
        wallet.publicKey, // from Owner's Account
        1 // amount
      )
    );
    const result = await sendAndConfirmTransaction(conn, tx, [
      payerWallet,
      wallet,
    ]);
    log("result:", result);

    return {
      tx: result,
      confirmed: 1,
    };
  })();
}
transferNft();

module.exports = {
  transferNft,
};
