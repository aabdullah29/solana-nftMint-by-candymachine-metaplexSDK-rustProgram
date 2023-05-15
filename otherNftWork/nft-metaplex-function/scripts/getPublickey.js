import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

(async () => {
  const DEMO_WALLET_SECRET_KEY = Uint8Array.from([
    122, 48, 121, 179, 106, 195, 89, 252, 149, 69, 208, 12, 39, 172, 165, 143,
    185, 221, 200, 109, 221, 61, 213, 217, 50, 198, 182, 99, 49, 100, 105, 125,
    195, 253, 217, 167, 171, 158, 62, 148, 187, 197, 30, 118, 87, 244, 32, 144,
    219, 247, 122, 165, 219, 113, 69, 191, 9, 195, 98, 166, 104, 7, 166, 91,
  ]);
  const keypair = Keypair.fromSecretKey(DEMO_WALLET_SECRET_KEY);
  console.log("Res", keypair.publicKey.toString());
})();
