// Working PasskeyKit + Stellar SDK Integration for Mainnet
import * as StellarSdk from '@stellar/stellar-sdk';
import { PasskeyKit, PasskeyServer } from 'passkey-kit';

export class WorkingPasskeyIntegration {
  constructor(config) {
    this.config = config;
    
    // Configure Stellar SDK for mainnet
    StellarSdk.Networks.use(new StellarSdk.Network(this.config.networkPassphrase));
    
    // Set up Horizon server
    this.server = new StellarSdk.Server(this.config.horizonUrl || 'https://horizon.stellar.org');
    
    // Set up Soroban RPC
    this.sorobanRpc = new StellarSdk.SorobanRpc.Server(this.config.rpcUrl);
    
    // Initialize PasskeyKit with proper configuration
    this.passkeyKit = new PasskeyKit({
      rpcUrl: this.config.rpcUrl,
      networkPassphrase: this.config.networkPassphrase,
      walletWasmHash: this.config.walletWasmHash,
      rpId: window.location.hostname,
      timeoutInSeconds: 30,
    });

    // Initialize PasskeyServer
    this.passkeyServer = new PasskeyServer({
      rpcUrl: this.config.rpcUrl,
      launchtubeUrl: this.config.launchtubeUrl,
      launchtubeJwt: this.config.launchtubeJwt,
      forwardOnChain: true,
    });
  }

  // Test connection to mainnet
  async testConnection() {
    try {
      console.log('🔍 Testing Stellar Mainnet connection...');
      
      // Test Horizon connection
      const account = await this.server.loadAccount('GAYOLLLUIZE4DZMBB2ZBKGBUBZLIOYU6XFLW37BQPJ3H4G5GY7OAHNSV');
      console.log('✅ Horizon connection successful');
      
      // Test Soroban RPC connection
      const latestLedger = await this.sorobanRpc.getLatestLedger();
      console.log('✅ Soroban RPC connection successful');
      console.log(`📊 Latest ledger: ${latestLedger.sequence}`);
      
      return {
        horizon: true,
        soroban: true,
        latestLedger: latestLedger.sequence
      };
    } catch (error) {
      console.error('❌ Connection test failed:', error);
      throw error;
    }
  }

  // Create wallet with PasskeyKit and WebAuthn
  async createWallet(name, description) {
    try {
      console.log('🔑 Creating wallet with PasskeyKit...');
      
      // First test connection
      await this.testConnection();
      
      // Create wallet using PasskeyKit (this will trigger WebAuthn)
      const result = await this.passkeyKit.createWallet(name, description);
      
      console.log(`✅ Wallet created: contractId=${result.contractId}`);
      
      return {
        contractId: result.contractId,
        keyId: result.keyId,
        keyIdBase64: result.keyIdBase64,
        signedTx: result.signedTx
      };
    } catch (error) {
      console.error('❌ Create wallet failed:', error);
      throw new Error(`Failed to create wallet: ${error.message}`);
    }
  }

  // Connect to existing wallet
  async connectWallet(keyId, contractId) {
    try {
      console.log('🔌 Connecting to wallet...');
      
      // Test connection first
      await this.testConnection();
      
      // Connect using PasskeyKit
      const result = await this.passkeyKit.connectWallet({
        keyId,
        getContractId: async (kid) => {
          if (contractId) return contractId;
          const pasted = window.prompt('Paste contractId for this passkey:') || '';
          if (!pasted) throw new Error('Missing contractId');
          return pasted;
        },
      });

      const cid = result.contractId || contractId || '';
      
      console.log(`✅ Connected: contractId=${cid}`);
      
      return {
        contractId: cid,
        keyId,
        keyIdBase64: this.toBase64Url(keyId)
      };
    } catch (error) {
      console.error('❌ Connect wallet failed:', error);
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  // Send transaction using PasskeyServer
  async sendTransaction(signedTx) {
    try {
      if (!this.config.launchtubeJwt) {
        throw new Error('Missing Launchtube JWT');
      }

      console.log('📤 Sending transaction via Launchtube...');
      
      const result = await this.passkeyServer.send(signedTx);
      
      console.log(`✅ Sent: hash=${result.hash}`);
      return result;
    } catch (error) {
      console.error('❌ Send transaction failed:', error);
      throw new Error(`Failed to send transaction: ${error.message}`);
    }
  }

  // Create and send wallet in one step
  async createAndSendWallet(name, description) {
    try {
      const wallet = await this.createWallet(name, description);
      
      if (wallet.signedTx) {
        const sendResult = await this.sendTransaction(wallet.signedTx);
        return {
          ...wallet,
          txHash: sendResult.hash,
          ledger: sendResult.ledger
        };
      }
      
      return wallet;
    } catch (error) {
      console.error('❌ Create and send wallet failed:', error);
      throw error;
    }
  }

  // Sign transaction
  async signTransaction(transaction, keyId) {
    try {
      console.log('✍️ Signing transaction...');
      
      const signedTx = await this.passkeyKit.sign(transaction, { keyId });
      
      console.log('✅ Transaction signed');
      return signedTx;
    } catch (error) {
      console.error('❌ Sign transaction failed:', error);
      throw new Error(`Failed to sign transaction: ${error.message}`);
    }
  }

  // Get account info using Stellar SDK
  async getAccountInfo(accountId) {
    try {
      const account = await this.server.loadAccount(accountId);
      return {
        id: account.accountId(),
        sequence: account.sequenceNumber(),
        balances: account.balances,
        subentryCount: account.subentryCount()
      };
    } catch (error) {
      console.error('❌ Failed to get account info:', error);
      throw error;
    }
  }

  // Get contract info using Soroban RPC
  async getContractInfo(contractId) {
    try {
      const contract = await this.sorobanRpc.getContractData(contractId, '');
      return contract;
    } catch (error) {
      console.error('❌ Failed to get contract info:', error);
      throw error;
    }
  }

  // Get network info
  async getNetworkInfo() {
    try {
      const latestLedger = await this.sorobanRpc.getLatestLedger();
      const networkInfo = await this.server.fetchTimebounds(600);
      
      return {
        network: 'mainnet',
        passphrase: this.config.networkPassphrase,
        latestLedger: latestLedger.sequence,
        baseFee: StellarSdk.BASE_FEE,
        timebounds: networkInfo
      };
    } catch (error) {
      console.error('❌ Failed to get network info:', error);
      throw error;
    }
  }

  // Utility functions
  toBase64Url(b64) {
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  fromBase64Url(u) {
    let s = u.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return s;
  }

  // Storage functions
  saveToStorage(keyId, contractId) {
    const keyIdB64url = this.toBase64Url(keyId);
    localStorage.setItem('pixelkale:keyId', keyIdB64url);
    localStorage.setItem('pixelkale:contractId', contractId);
  }

  loadFromStorage() {
    const keyIdStored = localStorage.getItem('pixelkale:keyId');
    const contractId = localStorage.getItem('pixelkale:contractId');
    
    if (!keyIdStored || !contractId) return null;
    
    return {
      keyId: this.fromBase64Url(keyIdStored),
      contractId
    };
  }

  clearStorage() {
    localStorage.removeItem('pixelkale:keyId');
    localStorage.removeItem('pixelkale:contractId');
    localStorage.removeItem('pixelkale:lt_jwt');
  }
}
