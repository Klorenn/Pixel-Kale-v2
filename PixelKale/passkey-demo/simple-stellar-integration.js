// Simple Stellar SDK Integration for Mainnet
import * as StellarSdk from '@stellar/stellar-sdk';

export class SimpleStellarIntegration {
  constructor(config) {
    this.config = config;
    
    // Configure Stellar SDK for mainnet
    StellarSdk.Networks.use(new StellarSdk.Network(this.config.networkPassphrase));
    
    // Set up Horizon server
    this.server = new StellarSdk.Server(this.config.horizonUrl || 'https://horizon.stellar.org');
    
    // Set up Soroban RPC
    this.sorobanRpc = new StellarSdk.SorobanRpc.Server(this.config.rpcUrl);
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

  // Get account info
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

  // Get contract info
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

  // Create a simple transaction
  async createTransaction(sourceAccount, operations) {
    try {
      const account = await this.server.loadAccount(sourceAccount);
      
      const transaction = new StellarSdk.TransactionBuilder(account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.config.networkPassphrase
      });

      operations.forEach(op => transaction.addOperation(op));
      
      transaction.setTimeout(30);
      
      return transaction.build();
    } catch (error) {
      console.error('❌ Failed to create transaction:', error);
      throw error;
    }
  }

  // Submit transaction
  async submitTransaction(transaction) {
    try {
      const result = await this.server.submitTransaction(transaction);
      return {
        hash: result.hash,
        ledger: result.ledger,
        success: true
      };
    } catch (error) {
      console.error('❌ Failed to submit transaction:', error);
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
