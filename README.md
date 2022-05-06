# Open Punks

## Technology Stack & Tools

- Solidity (Writing Smart Contract)
- Javascript (React & Testing)
- [Web3](https://web3js.readthedocs.io/en/v1.5.2/) (Blockchain Interaction)
- [Truffle](https://www.trufflesuite.com/docs/truffle/overview) (Development Framework)
- [Ganache](https://www.trufflesuite.com/ganache) (For Local Blockchain)
- [Infura.io](https://infura.io/) (For copying the Ethereum mainnet)
- [MetaMask](https://metamask.io/) (Ethereum Wallet)
- [Git](https://git-scm.com/)/[GitHub](https://github.com) (Commit our code)
- [Fleek](https://fleek.co/) (Website Deployment)

## Requirements For Initial Setup
- Install [NodeJS](https://nodejs.org/en/), I recommend using node version 10.16.3 to avoid any potential dependency issues
- Install [Truffle](https://www.trufflesuite.com/docs/truffle/overview), In your terminal, you can check to see if you have truffle by running `truffle --version`. To install truffle run `npm i -g truffle`.
- Install [Ganache](https://www.trufflesuite.com/ganache).
- Install [MetaMask](https://metamask.io/) in your browser.

## Setting Up
### 1. Clone/Download the Repository

### 2. Install Dependencies:
`$ npm install `

### 3. Setup .env File
Create a .env file or rename the .env.example file, and update the values. The API & IPFS keys are technically optional for local testing, if you plan to deploy to the testnet or mainnet, you'll need to update those values.

### 4. Start Ganache

### 5. Migrate Smart Contracts
`$ truffle migrate --reset`

### 6. Run Frontend Application
In a separate CMD prompt/terminal run:
`$ npm start`

### 7. (Optional) Test Smart Contracts
`$ truffle test`

## Preparing for Contract Deployment
- Create or log in to your [Infura.io](https://infura.io/login) account and create a new project, and save your project ID located in your project settings, you'll need this if deploying to Ethereum Mainnet, or Rinkeby Testnet.

- If deploying to Polygon, you may need to setup the network in MetaMask. To do this, open MetaMask, in the top right click on your profile icon -> Settings -> Networks -> Add Network. 
  - For **Polygon Mainnet** fill in the following:
    1. **Network Name**: Polygon
    2. **New RPC URL**: https://rpc-mainnet.maticvigil.com/
    3. **Chain ID**: 137
    4. **Currency Symbol**: MATIC
    5. **Block Explorer URL**: https://polygonscan.com/
  - For the **Polygon Mumbai Testnet** fill in the following:
    1. **Network Name**: Polygon Mumbai
    2. **New RPC URL**: https://rpc-mumbai.maticvigil.com/
    3. **Chain ID**: 80001
    4. **Currency Symbol**: MATIC
    5. **Block Explorer URL**: https://mumbai.polygonscan.com/

### Funding your MetaMask Wallet

- If deploying to Polygon Mainnet, you will need to fund your MetaMask account with MATIC on the polygon chain, How you decide to transfer/fund is entirely upto you. Keep in mind if you have MATIC currently on the Ethereum Mainnet, you will need to bridge your MATIC over to the polygon chain. You can do this by visiting [https://wallet.polygon.technology/](https://wallet.polygon.technology/), also keep in mind you will have to have ETH in your account to cover gas fees!

- If deploying to Rinkeby testnet, you may use this ETH faucet supplied by chainlink to fund your account: [https://faucets.chain.link/rinkeby](https://faucets.chain.link/rinkeby).

- If deploying to Polygon Mumbai testnet, you may use this MATIC faucet: [https://faucet.polygon.technology/](https://faucet.polygon.technology/)

### 1. Setup your .env file
Create a .env file in the root directory of your project, and fill in the following:
- DEPLOYER_PRIVATE_KEY="YOUR_PRIVATE_KEY"
- INFURA_API_KEY="PROJECT_ID"
- ETHERSCAN_API_KEY="API_TOKEN"

- PROJECT_NAME="YOUR_PROJECT_NAME"
- PROJECT_SYMBOL="YOUR_PROJECT_SYMBOL"
- MINT_COST=0
- MAX_SUPPLY=1000

- IPFS_IMAGE_METADATA_CID="IPFS_CID"
- IPFS_HIDDEN_IMAGE_METADATA_CID="IPFS_CID"
- NFT_MINT_DATE="Oct 27, 2021 20:00:00"

### 2. Run your migrations
- For Rinkeby testnet: `truffle migrate --reset --network rinkeby`
- For Polygon Mainnet: `truffle migrate --reset --network matic`

### 3. Verify your contracts
- For Rinkeby testnet: `truffle run verify OpenPunks --network rinkeby`
- For Polygon Mainnet: `truffle run verify OpenPunks --network matic`

## Preparing for Frontend Deployment
### 1. Create or Login to your GitHub account

### 2. Create a new repository
Input the name of your project, and a description if you wish. You may also choose to make the repository public or private

### 3. Commit your code
If you have downloaded this code, you may need to initialize it as a git repository, to do this back in your terminal run:
`$ git init`

Add files for staging:
`$ git add .`

This will ready your files for the commit, you may see if they have been added by running:
`$ git status`

Finally commit your code
`$ git commit -m "Deployment Setup"`

### 4. Update & Push to Remote URL
If you cloned from a repository, go ahead and update the origin link to the repository you created on GitHub by running:
`$ git remote set-url origin <YOUR-GITHUB-REPO-LINK>`

Otherwise run this command instead:
`$ git remote add origin <YOUR-GITHUB-REPO-LINK>`

Finally, push the code to the repoository:
`$ git push origin master`

### 5. Create or sign in to your Fleek account
Easiest option is to sign in with your GitHub account.

Click on Add new site & Connect with GitHub

Configure and select your repo to deploy

For deploy location, select IPFS hosting

On the build options and deploy tab, under the section Basic Build Settings, for framework select Create React App, then click on Deploy site.