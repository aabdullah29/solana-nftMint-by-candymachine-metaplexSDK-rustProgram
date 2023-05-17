## 1. collection mint using candy machine 
1. run `yarn install` in client/metaplex/js
2. install ts-node globally
3. create new keygen
4. add your assets and their json metadata in client/candy-machine/Assets
5. check candy-machine version:
`ts-node client/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts --version`
6. upload:
`ts-node client/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts upload -k [your keygen file path] -cp client/candy-machine/config.json client/candy-machine/Assets`
7. verify:
`ts-node client/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts verify_upload -k [your keygen file path]'
8. update:
`ts-node client/metaplex/js/packages/cli/src/candy-machine-v2-cli.ts update_candy_machine -k [your keygen file path] -cp client/candy-machine/config.json client/candy-machine/Assets`


## 2. single nft mint using metaplex js SDK
1. run `yarn install` in client/metaplex-sdk
2. change wallet file path with your keygen file path in client/metapler-sdk/app.js
3. now you can do the following operation using this file
    1. findByMint
    2. findAllByMintList
    3. findAllByOwner
    4. findAllByCreator
    5. findAllByCandyMachine
    6. uploadMetadata
    7. create_nft
    8. update_nft
    9. printNewEdition

## 3- single nft mint by custom rust code using anchor
1. run `yarn install` in root directory
2. run `anchor build` and change program id in "Anchor.toml" file and in "program/solana-nft-rust/src/lib.rs"
3. change keygen path in "Anchor.toml"
4. run `anchor build && anchor deploy`
5. set your buyer and seller wallet address in "test-mint.ts" and "test-sell.ts" files
6. run `anchor run test-mint` and `anchor run test-sell`



## 4. collection mint using candy machine 
1. install sugar
2. run `cd client/sugar`
3. run `sugar validate Assets`
4. run `sugar upload Assets -c config.json --cache cache.json`
4. run `sugar deploy -c config.json --cache cache.json`
4. run `sugar verify --cache cache.json`

"Sugar includes other commands to manage a Candy Machine."
5. `sugar mint --cache cache.json` or `sugar mint -n 3 -cache cache.json`
6. `sugar show <CANDY MACHINE>`
7. `sugar withdraw <CANDY MACHINE>`
8. `sugar bundlr balance` and `sugar bundlr withdraw`


## 5. otherNftWork:
1. `nft_metaplex_function` metaplex nft functions
2. `nft-mint-rust-anchor` mint nft using rust program write in rust using metaplex sdk written with anchor
    - `frontend` frontend for that rust program that will integrate the phantom wallet then get perameters and mint the nft
3. `nft-mint-transfer-frontend` mint and transfer nft through front end **[use shyft api](https://docs.shyft.to/start-hacking/nft) **