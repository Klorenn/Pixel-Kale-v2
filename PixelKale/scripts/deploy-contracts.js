#!/usr/bin/env node

const { StellarSdk } = require('@stellar/stellar-sdk');
const fs = require('fs');
const path = require('path');

// Network configuration
const NETWORKS = {
  testnet: {
    horizon: 'https://horizon-testnet.stellar.org',
    networkPassphrase: StellarSdk.Networks.TESTNET,
    contractId: 'CDSWUUXGPWDZG76ISKSUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO'
  },
  mainnet: {
    horizon: 'https://horizon.stellar.org',
    networkPassphrase: StellarSdk.Networks.PUBLIC,
    contractId: 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA'
  }
};

async function deployContract(network) {
  const config = NETWORKS[network];
  if (!config) {
    console.error(`❌ Unknown network: ${network}`);
    process.exit(1);
  }

  console.log(`🚀 Deploying to ${network.toUpperCase()}`);
  console.log(`📡 Horizon: ${config.horizon}`);
  console.log(`🆔 Contract ID: ${config.contractId}`);
  
  // Check if contract is already deployed
  try {
    const server = new StellarSdk.Server(config.horizon);
    const contract = await server.getContract(config.contractId);
    console.log(`✅ Contract already deployed at: ${config.contractId}`);
    console.log(`📊 Contract details:`, contract);
  } catch (error) {
    console.log(`ℹ️ Contract not found or not accessible: ${error.message}`);
    console.log(`💡 Make sure the contract is deployed and the contract ID is correct`);
  }
}

// Main execution
const network = process.argv[2] || 'testnet';
deployContract(network).catch(console.error);


