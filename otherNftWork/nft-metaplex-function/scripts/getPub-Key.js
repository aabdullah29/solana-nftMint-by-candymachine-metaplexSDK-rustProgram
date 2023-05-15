import { Keypair } from "@solana/web3.js";
import bs58 from "bs58";

(async () => {
  //get public key from secret key
  const keypair = Keypair.fromSecretKey(
    bs58.decode(
      "5vo4kPVn1Hb5vgsReyyXq5XLAZWVMetLqacjTm6k5aDZBmqMto4nNSHizrfTrpjmvfNGGxyYVetC18XjAn3xMQGk"
    )
  );
  console.log("first", keypair);
})();
