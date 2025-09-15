// KALE Farm SDK for PixelKale
const StellarSdk = require('stellar-sdk');
const NETWORKS = require('../../config/network.js');

class KaleFarmSDK {
  constructor(network = 'testnet') {
    this.network = network;
    this.networkConfig = NETWORKS[network];
    this.contractId = this.networkConfig.contractId;
    this.server = new StellarSdk.Horizon.Server(this.networkConfig.server);
    this.userAccount = null;
  }

  setAccount(publicKey, secretKey = null) {
    this.userAccount = { publicKey, secretKey, isPasskey: !secretKey };
    console.log(`✅ Account configured: ${publicKey}`);
    return this;
  }

  async healthCheck() {
    try {
      const testAccount = 'GARWCMCLMLEQAWA77CJMO6ASIZU3AG56VX7RZZ4CVX2WOLF42PYGNLBJ';
      await this.server.loadAccount(testAccount);
      return { status: 'healthy', network: this.network, contractId: this.contractId };
    } catch (error) {
      return { status: 'unhealthy', error: error.message };
    }
  }

  // Plant KALE (start farming)
  async plantKale(amount = 0) {
    console.log('🌱 Planting KALE...');
    console.log(`   Amount: ${amount} KALE`);
    
    try {
      const { execSync } = require('child_process');
      const command = `stellar contract invoke --id ${this.contractId} --source-account alice --network ${this.network} -- plant --farmer ${this.userAccount.publicKey} --amount ${amount}`;
      
      const result = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log(`✅ Plant executed successfully`);
      return { success: true, result: result };
    } catch (error) {
      console.log(`❌ Plant failed:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // Work on the farm (proof of work)
  async workKale(nonce = null, hash = null) {
    console.log('⛏️ Working on KALE...');
    
    if (!nonce) nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
    if (!hash) hash = '0000000000000000000000000000000000000000000000000000000000000000';
    
    console.log(`   Nonce: ${nonce}`);
    console.log(`   Hash: ${hash}`);
    
    try {
      const { execSync } = require('child_process');
      const command = `stellar contract invoke --id ${this.contractId} --source-account alice --network ${this.network} -- work --farmer ${this.userAccount.publicKey} --hash ${hash} --nonce ${nonce}`;
      
      const result = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log(`✅ Work executed successfully`);
      return { success: true, result: result };
    } catch (error) {
      console.log(`❌ Work failed:`, error.message);
      return { success: false, error: error.message };
    }
  }

  // Harvest KALE (claim rewards)
  async harvestKale(index = 1) {
    console.log('🌾 Harvesting KALE...');
    console.log(`   Index: ${index}`);
    
    try {
      const { execSync } = require('child_process');
      const command = `stellar contract invoke --id ${this.contractId} --source-account alice --network ${this.network} -- harvest --farmer ${this.userAccount.publicKey} --index ${index}`;
      
      const result = execSync(command, { 
        encoding: 'utf8',
        stdio: 'pipe'
      });
      
      console.log(`✅ Harvest executed successfully`);
      return { success: true, result: result };
    } catch (error) {
      console.log(`❌ Harvest failed:`, error.message);
      return { success: false, error: error.message };
    }
  }

  async getContractInfo() {
    return {
      success: true,
      contractId: this.contractId,
      network: this.network,
      assetCode: this.networkConfig.assetCode,
      assetIssuer: this.networkConfig.assetIssuer,
      sac: this.networkConfig.sac
    };
  }
}

module.exports = KaleFarmSDK;
