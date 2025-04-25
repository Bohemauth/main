# BohemAuth

BohemAuth enables brands and manufacturers to create tamper-proof, verified product listings using **Flare's Data Connector (FDC)** and zero-knowledge proofs while connecting to external verification databases.

![Made-With-Flare](https://img.shields.io/badge/MADE%20WITH-Flare-ff2973.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=flare)
![Made-With-React](https://img.shields.io/badge/MADE%20WITH-NEXT-000000.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=nextdotjs)
![Made-With-Tailwind](https://img.shields.io/badge/MADE%20WITH-TAILWIND-06B6D4.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=tailwindcss)
![Made-With-Javascript](https://img.shields.io/badge/MADE%20WITH-Javascript-ffd000.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=javascript)
![Made-With-Solidity](https://img.shields.io/badge/MADE%20WITH-Solidity-000000.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=solidity)
![Made-With-Noir](https://img.shields.io/badge/MADE%20WITH-Noir-ffffff.svg?colorA=222222&style=for-the-badge&logoWidth=14&logo=noir)

This is the BohemAuth main repository which is built during _[Encode X Flare Hackathon](https://www.encode.club/flare-hackathon/)_, consisting of the following components:

- `server`: The main server application
- `app`: The client application
- `contracts`: The smart contracts powered by Flare
- `circuits`: The zero-knowledge proof circuits written using Noir

## Flare Implemention

- Flare's Data Connector Implementation in accordance with Prisma Schema - [_server/utils/fdc.js_](https://github.com/Bohemauth/main/blob/9670de75e251fe30418952e57da36b68062827aa/server/utils/fdc.js#L197)
- Using FDC Proof to register products on BohemAuth Contract - [_server/utils/Queue.js_](https://github.com/Bohemauth/main/blob/9670de75e251fe30418952e57da36b68062827aa/server/utils/Queue.js#L73)
- Using FDC Proof to redeem a listing - [_server/controllers/listingController.js_](https://github.com/Bohemauth/main/blob/9670de75e251fe30418952e57da36b68062827aa/server/controllers/listingController.js#L321)

## Smart Contracts Implementation

- BohemAuth Contract - [0xa4E6692C0AA19Fc75265267a771188eCA57C3C49](https://coston2-explorer.flare.network/address/0xa4E6692C0AA19Fc75265267a771188eCA57C3C49?tab=contract)
- BohemAuth NFT Contract - [0x95F1Adb21c4eF3E9a81FEEE6188A6afA727389f7](https://coston2-explorer.flare.network/token/0x95F1Adb21c4eF3E9a81FEEE6188A6afA727389f7?tab=contract)
- Noir Zk-proof Verifier - [0xBf2D2E15d7C73e67126328eAA7D3a95e414442aB](https://coston2-explorer.flare.network/address/0xBf2D2E15d7C73e67126328eAA7D3a95e414442aB?tab=contract)

## Client Setup

> **Pre-requisites:**
>
> - Setup Node.js v18+ (recommended via [nvm](https://github.com/nvm-sh/nvm) with `nvm install 18`)
> - Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
> - Clone this repository


```bash
# Install dependencies
cd app
npm install

# fill environments
cp .env.local.example .env.local
```

### Development

```bash
# Start development server
npm run dev

# Build production frontend & start server
npm run build
npm run start
```

## Server Setup

> **Pre-requisites:**
>
> - Setup Node.js v18+ (recommended via [nvm](https://github.com/nvm-sh/nvm) with `nvm install 18`)
> - Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
> - Clone this repository

```bash
# Install dependencies
cd server
npm install

# fill environments
cp .env.example .env
```

### Development

```bash
# Start the server
npm run start
```

## Contract Setup

> **Pre-requisites:**
>
> - Setup Node.js v18+ (recommended via [nvm](https://github.com/nvm-sh/nvm) with `nvm install 18`)
> - Install [npm](https://docs.npmjs.com/downloading-and-installing-node-js-and-npm)
> - Clone this repository

```bash
# Install dependencies
cd contracts
npm install

# fill environments
cp .env.example .env
```

### Development

```bash
# Compile all the contracts
npx hardhat compile

# Deploy on Flare Testnet, Check hardhat.config.js to check or add supported chains
npx hardhat run --network flareTestnet scripts/deploy.js
```

## Noir Circuit Setup

> **Pre-requisites:**
>
> - Setup Nargo (recommended via [nargo](https://noir-lang.org/docs/getting_started/installation/))
> - Install [Noir](https://noir-lang.org/docs/getting_started/installation/)
> - Clone this repository

### Development

```bash
# Executing deploy_prove circuit
cd circuits/shamir_prove
nargo execute

# Checking constraints
nargo info

# Testing circuits
nargo check

# Generate zk-proof
nargo prove

# generate Solidity Verifier
nargo codegen-verifier
```

## Contributing

1. Fork the repository
2. Create your feature branch (git checkout -b feature/AmazingFeature)
3. Commit your changes (git commit -m 'Add some AmazingFeature')
4. Push to the branch (git push origin feature/AmazingFeature)
5. Open a Pull Request

## License

Distributed under the MIT License. See LICENSE for more information.





