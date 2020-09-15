# Introduction

LACChain DNS is a Decentralized Name Service that helps to maintain a registry of verified entities through a set of certificates issued by Certification Authorities (CA) associated with a DID (ethr). 
Certificates will be used to register and validate the entity in an Ethereum Smart contract, which we called: **DNSRegistry**.

LACChain DNS also provides a Decentralized Application (DApp) to control the entities registered in the DNSRegistry (listing, registration and revocation). 
As well as, a smart contract in solidity, which is based on the OpenZeppelin standard for upgradeable contracts. 

# DApp (Decentralized Application)

**Important:** The dependency chain for this implementation of onchain permisioning includes [web3js](https://github.com/ethereum/web3.js/) which is LGPL licensed.  

The LACChain DNS Registry has been deployed in the following addresses.

| Network                                  | Address                                                |
| -----------------------------------------| ------------------------------------------------------ |
| Pro TestNet (id: 648529)                 |      0x87570d1Be0174a214465E27D70647a564CaB595c        |
| MultiLedgers (id: 648539)                |      0x1024d31846670b356f952F4c002E3758Ab9c4FFC        |
| David19 (id: 648530)                     |      Pending to deploy...                              |


## Deployment
Note: The build process for the Dapp is currently not supported on Windows.

### Initialise dependencies ###
Run `yarn install` to initialise project dependencies. This step is only required when setting up project
for the first time.

### DNS Management DApp

The DApp will facilitate managing DIDs records and maintaining the list of authorized entities.

### Requirements

 -  NodeJS v12.4.0

### Start the Development server ####

1. Run `yarn install` to install dependencies.
2. Configure environment variables or provide a .env file in the root of this project that configures the following variables
  - `REACT_APP_CONTRACT`: The DNSRegistry contract address
3. Run `yarn run start` to start the web server that is serving our Dapp.
4. The default endpoint of application is http://localhost:3000
5. In your browser, connect Metamask to the LACChain network (the default endpoint is `http://35.184.61.29:4545/`)
6. All changes made to the smart contracts or to the DApp code will be automatically refreshed on the website. 
There is no need to restart the web server after making changes.

### Build the LACChain DNS DApp for Production ####

The deployment process covers 5 steps:
1. If this is the first time setting up the project, run `yarn install` to initialise project dependencies, otherwise skip this step.
2. Configure environment variables or provide a .env file in the root of this project that configures the following variables
  - `REACT_APP_CONTRACT`: The DNSRegistry contract address
4. With these environment variables provided run `yarn run build` to create a production bundle
4. Use a webserver of your choice to host the contents of the folder as static files directing root requests to `index.html`

### DNSRegistry Smart Contract

This smart contract will serve as a public database to store a list of validated DIDs. 
The DNS Registry will be public and acceisble from different apps/wallets to verify if a DID is validated.
There is also a set of methods to be used with the DApp in this project to manage (create, revoke and enable) the DID List.

Summarizing, this smart contract allows to register, revoke and verify if a DID is been validated. 

## Deploy and Upgrade Smart Contract

We are using [Openzeppelin Cli](https://docs.openzeppelin.com/cli/2.8/) to deploy the upgradable smart contract.

This is the easiest way to get started for development with the smart contract:

First, you need to install openzeppelin cli dependencies. 

```$ npm install --save-dev @openzeppelin/cli```

Second, you need to rename truffle-config.js.default to truffle-config.js and modify the file to set the node and private key to deploy the smart contract. Next execute the command to deploy. 

```$ npx oz deploy```

If you need to upgrade the smart contract then execute the following command.

```npx oz upgrade```
