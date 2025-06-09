// scripts/run.js
const hre = require("hardhat");
const { ethers } = hre;
const { Wallet } = require("ethers");
const dotenv = require("dotenv");
dotenv.config();

const gbeseAbi = [
  {
    inputs: [
      { internalType: "address", name: "_kycVerifier", type: "address" },
    ],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "allowance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "ERC20InsufficientAllowance",
    type: "error",
  },
  {
    inputs: [
      { internalType: "address", name: "sender", type: "address" },
      { internalType: "uint256", name: "balance", type: "uint256" },
      { internalType: "uint256", name: "needed", type: "uint256" },
    ],
    name: "ERC20InsufficientBalance",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "approver", type: "address" }],
    name: "ERC20InvalidApprover",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "receiver", type: "address" }],
    name: "ERC20InvalidReceiver",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "sender", type: "address" }],
    name: "ERC20InvalidSender",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "spender", type: "address" }],
    name: "ERC20InvalidSpender",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "owner", type: "address" }],
    name: "OwnableInvalidOwner",
    type: "error",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "OwnableUnauthorizedAccount",
    type: "error",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "owner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "spender",
        type: "address",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Approval",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "address",
        name: "previousOwner",
        type: "address",
      },
      {
        indexed: true,
        internalType: "address",
        name: "newOwner",
        type: "address",
      },
    ],
    name: "OwnershipTransferred",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
    ],
    name: "TokensMinted",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "value",
        type: "uint256",
      },
    ],
    name: "Transfer",
    type: "event",
  },
  {
    anonymous: false,
    inputs: [
      {
        indexed: true,
        internalType: "uint256",
        name: "index",
        type: "uint256",
      },
      { indexed: true, internalType: "address", name: "from", type: "address" },
      { indexed: true, internalType: "address", name: "to", type: "address" },
      {
        indexed: false,
        internalType: "uint256",
        name: "amount",
        type: "uint256",
      },
      {
        indexed: false,
        internalType: "uint256",
        name: "blockNumber",
        type: "uint256",
      },
    ],
    name: "TransferLogged",
    type: "event",
  },
  {
    inputs: [],
    name: "INITIAL_SUPPLY",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "owner", type: "address" },
      { internalType: "address", name: "spender", type: "address" },
    ],
    name: "allowance",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "spender", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "approve",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "account", type: "address" }],
    name: "balanceOf",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "decimals",
    outputs: [{ internalType: "uint8", name: "", type: "uint8" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "kycVerifier",
    outputs: [
      { internalType: "contract IKYCVerifier", name: "", type: "address" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "amount", type: "uint256" },
    ],
    name: "mint",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "name",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "owner",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "renounceOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "_newVerifier", type: "address" },
    ],
    name: "setKYCVerifier",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "symbol",
    outputs: [{ internalType: "string", name: "", type: "string" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "totalSupply",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transfer",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "from", type: "address" },
      { internalType: "address", name: "to", type: "address" },
      { internalType: "uint256", name: "value", type: "uint256" },
    ],
    name: "transferFrom",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [],
    name: "transferIndex",
    outputs: [{ internalType: "uint256", name: "", type: "uint256" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "newOwner", type: "address" }],
    name: "transferOwnership",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

const kycAbi = [
  {
    inputs: [{ internalType: "address", name: "_issuer", type: "address" }],
    stateMutability: "nonpayable",
    type: "constructor",
  },
  { inputs: [], name: "ECDSAInvalidSignature", type: "error" },
  {
    inputs: [{ internalType: "uint256", name: "length", type: "uint256" }],
    name: "ECDSAInvalidSignatureLength",
    type: "error",
  },
  {
    inputs: [{ internalType: "bytes32", name: "s", type: "bytes32" }],
    name: "ECDSAInvalidSignatureS",
    type: "error",
  },
  { inputs: [], name: "InvalidShortString", type: "error" },
  {
    inputs: [{ internalType: "string", name: "str", type: "string" }],
    name: "StringTooLong",
    type: "error",
  },
  { anonymous: false, inputs: [], name: "EIP712DomainChanged", type: "event" },
  {
    inputs: [],
    name: "KYC_TYPEHASH",
    outputs: [{ internalType: "bytes32", name: "", type: "bytes32" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "eip712Domain",
    outputs: [
      { internalType: "bytes1", name: "fields", type: "bytes1" },
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "version", type: "string" },
      { internalType: "uint256", name: "chainId", type: "uint256" },
      { internalType: "address", name: "verifyingContract", type: "address" },
      { internalType: "bytes32", name: "salt", type: "bytes32" },
      { internalType: "uint256[]", name: "extensions", type: "uint256[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "", type: "address" }],
    name: "isVerified",
    outputs: [{ internalType: "bool", name: "", type: "bool" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [],
    name: "issuer",
    outputs: [{ internalType: "address", name: "", type: "address" }],
    stateMutability: "view",
    type: "function",
  },
  {
    inputs: [
      { internalType: "address", name: "user", type: "address" },
      { internalType: "uint256", name: "issuedAt", type: "uint256" },
      { internalType: "bytes", name: "sig", type: "bytes" },
    ],
    name: "verifyKYC",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
];

async function main() {
  // Config
  const TOKEN_ADDRESS = "0xC6dd34113889f23b0bf06FA77b3EBf441cB388eF";
  const KYC_CONTRACT_ADDRESS = "0x16b3574b38ae3653e6768b75344ae2e49d64ed0b";
  const TOKEN_URI     = "ipfs://bafkreihq4j3p34h4j3l5nasom37kwdumclyef54npzpn5b6umcupgmw6qi";
  // const ISSUER_PRIVATE_KEY = process.env.ISSUER_PRIVATE_KEY;
  // const issuer = new Wallet(ISSUER_PRIVATE_KEY, ethers.provider);

  // 1) Signers
  const [owner, buyer] = await ethers.getSigners();
  const signer = owner
  // 2) Deploy GbeseNFT (owner)
  const GbeseNFT = await ethers.getContractFactory("GbeseArts", owner);
  const nft = await GbeseNFT.deploy();
  // waitForDeployment replaces .deployed()
  await nft.waitForDeployment();  
  console.log("🔹 GbeseNFT deployed to:", nft.target);

  // 3) Attach to GBT token (buyer)
  const token = new ethers.Contract(TOKEN_ADDRESS, gbeseAbi, buyer);

  // 4) Set token contract (owner-only)
  await (await nft.connect(owner).setTokenContract(TOKEN_ADDRESS)).wait();
  console.log("🔹 gbeseTokenAddress set to:", TOKEN_ADDRESS);



  const issuedAt = Math.floor(Date.now() / 1000); // timestamp
  const kyc = new ethers.Contract(KYC_CONTRACT_ADDRESS, kycAbi, owner);

  // const domain = {
  //   name: "Gbese KYC",
  //   version: "1",
  //   chainId: 84532, // Base Sepolia
  //   verifyingContract: kyc.target,
  // };

  // const types = {
  //   KYC: [
  //     { name: "user", type: "address" },
  //     { name: "issuedAt", type: "uint256" },
  //   ],
  // };

  // const value = {
  //   user: nft.target,
  //   issuedAt,
  // };


  const payload = JSON.stringify({
  types: {
    EIP712Domain: [
      { name: "name", type: "string" },
      { name: "version", type: "string" },
      { name: "chainId", type: "uint256" },
      { name: "verifyingContract", type: "address" }
    ],
    KYC: [
      { name: "user", type: "address" },
      { name: "issuedAt", type: "uint256" }
    ]
  },
  primaryType: "KYC",
  domain: {
    name: "Gbese KYC",
    version: "1",
    chainId: 84532, // ✅ Base Sepolia
    verifyingContract: kyc.target
  },
  message: {
    user: nft.target,
    issuedAt: Math.floor(Date.now() / 1000)
  }
});




  console.log('getting signature')
  const signature = await hre.ethers.provider.send("eth_signTypedData_v4", [
    owner.address,
    payload,
  ]);
  console.log("Signature:", signature);

  const tx = await kyc.verifyKYC(nft.target, issuedAt, signature);
  await tx.wait();
  console.log("✅ NFT contract KYC verified!");





  // 5) Admin-mint one NFT to buyer
  const mintTx = await nft.connect(owner).mintGbeseArt(buyer.address, TOKEN_URI);
  const mintRc = await mintTx.wait();
  console.log('mintRc:', mintRc)
  console.log("🔹 mintGbeseNFT tx hash:", mintRc.hash);

  // 6) Pre-purchase state
  const price     = await nft.nftPriceInTokens();
  const balance   = await token.balanceOf(buyer.address);
  const allowance = await token.allowance(buyer.address, nft.target);
  console.log(`\n>>> PRE-PURCHASE`);
  console.log("  Price    :", price.toString());
  console.log("  Balance  :", balance.toString());
  console.log("  Allowance:", allowance.toString(), "\n");

  // 7) Approve if needed
  if (allowance < price) {
    console.log("↗️  Approving NFT contract to spend GBT...");
    await (await token.approve(nft.target, price)).wait();
    console.log("✅ Approved");
  }

  // 8) purchaseNFT (buyer)
  try {
    const tx = await nft.connect(buyer).purchaseNFT(TOKEN_URI);
    const rc = await tx.wait();
    console.log("✅ purchaseNFT succeeded:", rc.hash);
  } catch (err) {
    console.error("❌ purchaseNFT reverted!");
    console.error("Reason:", err.reason || err.message);

    const data = err.error?.data || err.data;
    if (data) {
      const reasonHex = "0x" + data.slice(10 + 64);
      console.error("Decoded revert:", ethers.utils.toUtf8String(reasonHex));
    }
  }
}

main()
  .then(() => process.exit(0))
  .catch(e => {
    console.error(e);
    process.exit(1);
  });