// KALE Farm with Demo Wallet Integration - Farming con Demo Wallet
const LaunchtubeDemoWallet = require('./launchtube-demo-wallet');
const crypto = require('crypto');

class KaleFarmDemoWallet {
  constructor(network = 'testnet') {
    this.network = network;
    this.contractId = network === 'testnet' 
      ? 'CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO'
      : 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA';
    
    this.wallet = new LaunchtubeDemoWallet(network);
    this.miningStats = {
      attempts: 0,
      successfulHashes: 0,
      totalRewards: 0,
      startTime: null
    };
  }

  // Configurar cuenta con clave privada
  setupAccount(publicKey, secretKey) {
    console.log('🔧 Setting up account with Demo Wallet...');
    
    this.wallet.setAccount(publicKey, secretKey);
    
    console.log('✅ Account setup complete!');
    console.log(`   Public Key: ${publicKey}`);
    console.log(`   Network: ${this.network}`);
    console.log(`   Contract: ${this.contractId}`);
    
    return this;
  }

  // Configurar Passkey
  async setupPasskey() {
    console.log('🔑 Setting up Passkey authentication...');
    
    const result = await this.wallet.setupPasskey();
    
    if (result.success) {
      console.log('✅ Passkey setup complete!');
    } else {
      console.log(`❌ Passkey setup failed: ${result.error}`);
    }
    
    return result;
  }

  // Generar hash según el algoritmo oficial de KALE-sc
  generateHash(index, nonce, entropy, farmerAddress) {
    // Crear array de 76 bytes según el algoritmo oficial
    const hashArray = Buffer.alloc(76);
    
    // Convertir farmer address a bytes (últimos 32 bytes)
    const farmerBytes = this.addressToBytes(farmerAddress);
    
    // Index (4 bytes, big endian)
    const indexBuffer = Buffer.alloc(4);
    indexBuffer.writeUInt32BE(index, 0);
    indexBuffer.copy(hashArray, 0);
    
    // Nonce (8 bytes, big endian)
    const nonceBuffer = Buffer.alloc(8);
    nonceBuffer.writeBigUInt64BE(BigInt(nonce), 0);
    nonceBuffer.copy(hashArray, 4);
    
    // Entropy (32 bytes)
    const entropyBuffer = Buffer.from(entropy, 'hex');
    entropyBuffer.copy(hashArray, 12);
    
    // Farmer address (32 bytes)
    farmerBytes.copy(hashArray, 44);
    
    // Aplicar Keccak256
    const hash = crypto.createHash('sha3-256').update(hashArray).digest('hex');
    
    return hash;
  }

  // Convertir dirección Stellar a bytes (últimos 32 bytes)
  addressToBytes(address) {
    try {
      const StellarSdk = require('stellar-sdk');
      const decoded = StellarSdk.StrKey.decodeEd25519PublicKey(address);
      return Buffer.from(decoded);
    } catch (error) {
      // Fallback: usar hash de la dirección
      const hash = crypto.createHash('sha256').update(address).digest();
      return hash;
    }
  }

  // Plant KALE
  async plantKale(amount = 0) {
    console.log(`🌱 Planting ${amount} KALE with Demo Wallet...`);
    
    try {
      const result = await this.wallet.plantKale(amount);
      
      if (result.success) {
        console.log('✅ Planted successfully!');
        console.log(`   Amount: ${amount} KALE`);
        console.log(`   Transaction Hash: ${result.result.hash}`);
        return { success: true, result: result.result };
      } else {
        console.log(`❌ Plant failed: ${result.error}`);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.log(`❌ Plant failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Work KALE
  async workKale(index, nonce, hash) {
    console.log(`⛏️ Working on KALE with Demo Wallet...`);
    console.log(`   Index: ${index}`);
    console.log(`   Nonce: ${nonce}`);
    console.log(`   Hash: ${hash.substring(0, 16)}...`);
    
    try {
      const result = await this.wallet.workKale(index, nonce, hash);
      
      if (result.success) {
        console.log('✅ Work completed successfully!');
        console.log(`   Transaction Hash: ${result.result.hash}`);
        return { success: true, result: result.result };
      } else {
        console.log(`❌ Work failed: ${result.error}`);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.log(`❌ Work failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Harvest KALE
  async harvestKale(index) {
    console.log(`🌾 Harvesting KALE with Demo Wallet...`);
    console.log(`   Index: ${index}`);
    
    try {
      const result = await this.wallet.harvestKale(index);
      
      if (result.success) {
        console.log('✅ Harvested successfully!');
        console.log(`   Transaction Hash: ${result.result.hash}`);
        return { success: true, result: result.result };
      } else {
        console.log(`❌ Harvest failed: ${result.error}`);
        return { success: false, error: result.error };
      }
    } catch (error) {
      console.log(`❌ Harvest failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Generar hash válido con proof-of-work
  async generateValidHash(difficulty = 2) {
    console.log(`🔐 Generating valid hash with difficulty ${difficulty}...`);
    
    const index = 1; // Usar índice fijo por ahora
    const entropy = crypto.randomBytes(32).toString('hex');
    
    let attempts = 0;
    const maxAttempts = 100000;
    let bestZeros = 0;
    
    while (attempts < maxAttempts) {
      attempts++;
      
      const nonce = Math.floor(Math.random() * Number.MAX_SAFE_INTEGER);
      const hash = this.generateHash(index, nonce, entropy, this.wallet.publicKey);
      
      const leadingZeros = hash.match(/^0*/)[0].length;
      
      if (leadingZeros > bestZeros) {
        bestZeros = leadingZeros;
      }
      
      if (leadingZeros >= difficulty) {
        console.log(`✅ Valid hash found after ${attempts} attempts!`);
        console.log(`   Hash: ${hash}`);
        console.log(`   Leading zeros: ${leadingZeros}`);
        console.log(`   Index: ${index}`);
        console.log(`   Nonce: ${nonce}`);
        return { hash, index, nonce, entropy, attempts, success: true };
      }
      
      if (attempts % 10000 === 0) {
        console.log(`   Attempt ${attempts}: Best so far ${bestZeros} zeros`);
      }
    }
    
    console.log(`⚠️ No valid hash found after ${attempts} attempts (best: ${bestZeros} zeros)`);
    return { hash: null, index, nonce: 0, entropy, attempts, success: false };
  }

  // Proceso completo de farming
  async farmKale(amount = 0, difficulty = 2) {
    console.log(`🌱 Starting KALE Farming with Demo Wallet`);
    console.log(`==========================================`);
    console.log(`Amount: ${amount} KALE`);
    console.log(`Difficulty: ${difficulty} leading zeros`);
    console.log(`Farmer: ${this.wallet.publicKey}`);
    console.log(`Contract: ${this.contractId}`);
    console.log(`Network: ${this.network}\n`);

    // Paso 1: Plant
    console.log(`1️⃣ Planting KALE...`);
    const plantResult = await this.plantKale(amount);
    
    if (!plantResult.success) {
      console.log(`❌ Planting failed: ${plantResult.error}`);
      return { success: false, step: 'plant', error: plantResult.error };
    }

    // Esperar un poco entre plant y work
    console.log(`⏳ Waiting 3 seconds before work...`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Paso 2: Generar hash válido
    console.log(`\n2️⃣ Generating valid hash...`);
    const hashResult = await this.generateValidHash(difficulty);
    
    if (!hashResult.success) {
      console.log(`❌ Hash generation failed, trying with lower difficulty...`);
      const easyHashResult = await this.generateValidHash(1);
      if (!easyHashResult.success) {
        console.log(`❌ Cannot generate valid hash`);
        return { success: false, step: 'hash', error: 'Cannot generate valid hash' };
      }
      hashResult = easyHashResult;
    }

    // Paso 3: Work
    console.log(`\n3️⃣ Working on farm...`);
    const workResult = await this.workKale(
      hashResult.index,
      hashResult.nonce,
      hashResult.hash
    );
    
    if (!workResult.success) {
      console.log(`❌ Work failed: ${workResult.error}`);
      return { success: false, step: 'work', error: workResult.error };
    }

    // Esperar un poco entre work y harvest
    console.log(`⏳ Waiting 3 seconds before harvest...`);
    await new Promise(resolve => setTimeout(resolve, 3000));

    // Paso 4: Harvest
    console.log(`\n4️⃣ Harvesting KALE...`);
    const harvestResult = await this.harvestKale(hashResult.index);
    
    if (harvestResult.success) {
      console.log(`\n🎉 COMPLETE FARMING CYCLE SUCCESSFUL!`);
      console.log(`   KALE farming with Demo Wallet is working correctly!`);
      return { success: true, plantResult, workResult, harvestResult };
    } else {
      console.log(`\n⚠️ Harvest failed: ${harvestResult.error}`);
      return { success: false, step: 'harvest', error: harvestResult.error, plantResult, workResult, harvestResult };
    }
  }

  // Start mining loop
  async startMining(interval = 10000, difficulty = 2) {
    console.log(`🚀 Starting KALE Mining with Demo Wallet`);
    console.log(`=========================================`);
    console.log(`Farmer: ${this.wallet.publicKey}`);
    console.log(`Contract: ${this.contractId}`);
    console.log(`Network: ${this.network}`);
    console.log(`Interval: ${interval}ms`);
    console.log(`Difficulty: ${difficulty} leading zeros`);
    console.log(`\nPress Ctrl+C to stop mining...\n`);

    this.isMining = true;
    this.miningStats.startTime = new Date();

    while (this.isMining) {
      try {
        this.miningStats.attempts++;
        
        console.log(`⛏️ Mining attempt #${this.miningStats.attempts}`);
        
        // Generar hash válido
        const hashResult = await this.generateValidHash(difficulty);
        
        if (hashResult && hashResult.success) {
          // Intentar work con el hash válido
          const workResult = await this.workKale(
            hashResult.index,
            hashResult.nonce,
            hashResult.hash
          );
          
          if (workResult.success) {
            this.miningStats.successfulHashes++;
            console.log(`🎉 Successful work!`);
            
            // Intentar harvest
            const harvestResult = await this.harvestKale(hashResult.index);
            if (harvestResult.success) {
              console.log(`🎉 Successful harvest!`);
              this.miningStats.totalRewards++;
            }
          }
        }
        
        // Wait before next attempt
        await new Promise(resolve => setTimeout(resolve, interval));
        
      } catch (error) {
        console.log(`❌ Mining error: ${error.message}`);
        await new Promise(resolve => setTimeout(resolve, interval));
      }
    }
  }

  // Stop mining
  stopMining() {
    this.isMining = false;
    console.log(`\n⏹️ Mining stopped`);
    this.showStats();
  }

  // Show mining statistics
  showStats() {
    const duration = this.miningStats.startTime 
      ? (new Date() - this.miningStats.startTime) / 1000 
      : 0;
    
    console.log(`\n📊 Mining Statistics:`);
    console.log(`========================`);
    console.log(`⏱️  Duration: ${Math.round(duration)}s`);
    console.log(`🔄 Attempts: ${this.miningStats.attempts}`);
    console.log(`✅ Successful: ${this.miningStats.successfulHashes}`);
    console.log(`📈 Success Rate: ${this.miningStats.attempts > 0 ? Math.round((this.miningStats.successfulHashes / this.miningStats.attempts) * 100) : 0}%`);
    console.log(`💰 Total Rewards: ${this.miningStats.totalRewards} KALE`);
  }

  // Obtener estado de conexión
  getConnectionStatus() {
    return this.wallet.getConnectionStatus();
  }
}

module.exports = KaleFarmDemoWallet;
