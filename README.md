# Introduction

LACChain DNS is a Decentralized Name Service that helps to maintain a registry of verified entities through a set of certificates issued by Certification Authorities (CA) associated with a DID (ethr). 
Certificates that are used to register and validate the entity in an Ethereum-based smart contract called DNSRegistry.

LACChain DNS also provides a Decentralized Application (DApp) to control the entities registered in the DNSRegistry (listing, registration and revocation). 
As well as, a smart contract in solidity, which is based on the OpenZepellin standard for upgradeable contracts. 

# DID Generation
In order to register a DID in the DNS service, it must be generated from a valid X.509 certificate. The steps for the generation of the certificates are described in the section below.

## Generate Certificates

In order to validate the data of the entity to be registered in the DNS, it is necessary to have a valid X.509 certificate issued by a certifying entity (CA). Likewise, it is necessary to generate a request signing certificate (CSR) with the ethereum keys to send to IDEMIA and a certificate is generated under the hierarchy of said root CA.

Optionally, an X.509 v3 certificate with post-quantum keys can be generated to add these keys as attributes in the CSR that will be sent to IDEMIA

### 1. Ethereum-based Certificate Request (CSR)
Ethereum keys are based on the secp256k1 elliptical curve algorithm. 
It is possible to generate a Certificate Signing Request (CSR) using the key pair of an Ethereum account, 
but for this it is necessary to specify the details using the Abstract Syntax Notation One (ASN1).

```
asn1 = SEQUENCE:seq_section
 
[seq_section]
version    = INTEGER:01
privateKey = FORMAT:HEX,OCT:<ethereum private key hex>
parameters = EXPLICIT:0,OID:secp256k1
publicKey  = EXPLICIT:1,FORMAT:HEX,BITSTR:04<ethereum public key hex>
```

Finally, the CSR can be built with the following openssl commands with an intermediate step over a DER format key expressed in the ASN.1 file.

```
> openssl asn1parse -noout -genconf ethereum.asn1 -out eth_private_key.der 
> openssl ec -inform DER -in eth_private_key.der -out eth_private_key.pem 
> openssl req -new -key eth_private_key.pem -days 365 -out eth_certificate_request.csr
```

### 2. Post-Quantum Certificate

## Sending to IDEMIA

# DApp (Decentralized Application)

**Important:** The dependency chain for this implementation of onchain permisioning includes [web3js](https://github.com/ethereum/web3.js/) which is LGPL licensed.  

The LACChain DNS Registry has been deployed in the following addresses.

| Network                                  | Address                                                |
| -----------------------------------------| ------------------------------------------------------ |
| MainNet (id: 648529)                     |      Pending to deploy...                              |
| David19 (id: 648530)                     |      Pending to deploy...                              |
| TestNet (id: 648539)                     |      0x1024d31846670b356f952F4c002E3758Ab9c4FFC        |


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
