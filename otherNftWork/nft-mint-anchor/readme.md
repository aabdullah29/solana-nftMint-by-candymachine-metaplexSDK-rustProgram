# Mint NFTs on Solana using Metaplex and Anchor

1. Set devnet config generate key fair
	- `$ solana config set --url devnet`
	- `$ solana-keygen new`

2. Setting Custom Path, Value
	- Some values need to be changed depending on each local path. 
	- Check the `Anchor.toml > [provider]`
		- cluster = "devnet"
		- wallet = "/Users/<user>/.config/solana/id.json"
		- Check the <user> path.
	
3. build, deploy, and test
	- Now execute the test script.
	- `$ yarn install`
	- `$ anchor build`
	- `$ anchor deploy`
		- when deployment is completed, you can get the program_id (That is related metaplex nft)
		- Replace the program Id in the `Anchor.toml > [programs.devnet] > metaplex_anchor_nft`
	- `$ anchor test`


Account:  4UncGoJJaT8yUdT8chiocTmtiMUGNDwZvb3BwH3V9SBF496yUaVNBtyPCgtZNofBubvxA8ruh6MTJqhttUp2FiLQ
Mint key:  G8oR4YkrbAYjwCxbXWs9j4KbcBa2YjduCuvyS4jUMZnJ
User:  ApvqyqLgJ4qnAgtaGc9gdkZfZ6zHKd9vD1dBJtzFqekz
Metadata address:  FwhiPRcWq81Sk1YV6UfEquzwqbzX5J96cmPcWvPadBY2
MasterEdition:  6wzxJ8h6KF3ysEG9VScKbmMCcdNNxnKDpTYFxnpEQDrf
Your transaction signature 5aoBUXZ1hxvrdnSVgTVinzTkv8PcqMYWTWLpbrZbUPZ4dvo9kjqBtynF44Gtykr34QHuY7xdY8mL1ehkzfHG5CXf

















