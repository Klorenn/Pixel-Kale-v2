// KALE Farm with Launchtube Integration - Farming con Launchtube
const LaunchtubeIntegration = require('./launchtube-integration');
const crypto = require('crypto');

class KaleFarmLaunchtube {
  constructor(network = 'testnet') {
    this.network = network;
    this.contractId = network === 'testnet' 
      ? 'CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO'
      : 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA';
    
    this.launchtube = new LaunchtubeIntegration(network);
    this.miningStats = {
      attempts: 0,
      successfulHashes: 0,
      totalRewards: 0,
      startTime: null
    };
  }

  // Configurar cuenta y API key
  setupAccount(publicKey, secretKey, apiKey = null) {
    console.log('🔧 Setting up account with Launchtube...');
    
    this.launchtube.setAccount(publicKey, secretKey);
    
    if (apiKey) {
      this.launchtube.setApiKey(apiKey);
    }
    
    console.log('✅ Account setup complete!');
    console.log(`   Public Key: ${publicKey}`);
    console.log(`   Network: ${this.network}`);
    console.log(`   Launchtube: ${apiKey ? 'Enabled' : 'Disabled'}`);
    
    return this;
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
      // Decodificar la dirección Stellar
      const StellarSdk = require('stellar-sdk');
      const decoded = StellarSdk.StrKey.decodeEd25519PublicKey(address);
      return Buffer.from(decoded);
    } catch (error) {
      // Fallback: usar hash de la dirección
      const hash = crypto.createHash('sha256').update(address).digest();
      return hash;
    }
  }

  // Plant KALE usando Launchtube
  async plantKale(amount = 0) {
    console.log(`🌱 Planting ${amount} KALE with Launchtube...`);
    
    try {
      const StellarSdk = require('stellar-sdk');
      
      // Crear operación de contrato
      const operation = StellarSdk.Operation.invokeContractFunction({
        contract: this.contractId,
        function: 'plant',
        args: [
          StellarSdk.nativeToScVal(this.launchtube.publicKey, { type: 'address' }),
          StellarSdk.nativeToScVal(amount, { type: 'i128' })
        ]
      });

      // Crear, firmar y enviar transacción
      const result = await this.launchtube.createSignAndSubmit([operation]);
      
      if (result.success) {
        console.log('✅ Planted successfully with Launchtube!');
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

  // Work KALE usando Launchtube
  async workKale(index, nonce, hash) {
    console.log(`⛏️ Working on KALE with Launchtube...`);
    console.log(`   Index: ${index}`);
    console.log(`   Nonce: ${nonce}`);
    console.log(`   Hash: ${hash.substring(0, 16)}...`);
    
    try {
      const StellarSdk = require('stellar-sdk');
      
      // Crear operación de contrato
      const operation = StellarSdk.Operation.invokeContractFunction({
        contract: this.contractId,
        function: 'work',
        args: [
          StellarSdk.nativeToScVal(this.launchtube.publicKey, { type: 'address' }),
          StellarSdk.nativeToScVal(hash, { type: 'bytesN', size: 32 }),
          StellarSdk.nativeToScVal(nonce, { type: 'u64' })
        ]
      });

      // Crear, firmar y enviar transacción
      const result = await this.launchtube.createSignAndSubmit([operation]);
      
      if (result.success) {
        console.log('✅ Work completed successfully with Launchtube!');
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

  // Harvest KALE usando Launchtube
  async harvestKale(index) {
    console.log(`🌾 Harvesting KALE with Launchtube...`);
    console.log(`   Index: ${index}`);
    
    try {
      const StellarSdk = require('stellar-sdk');
      
      // Crear operación de contrato
      const operation = StellarSdk.Operation.invokeContractFunction({
        contract: this.contractId,
        function: 'harvest',
        args: [
          StellarSdk.nativeToScVal(this.launchtube.publicKey, { type: 'address' }),
          StellarSdk.nativeToScVal(index, { type: 'u32' })
        ]
      });

      // Crear, firmar y enviar transacción
      const result = await this.launchtube.createSignAndSubmit([operation]);
      
      if (result.success) {
        console.log('✅ Harvested successfully with Launchtube!');
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
      const hash = this.generateHash(index, nonce, entropy, this.launchtube.publicKey);
      
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

  // Proceso completo de farming con Launchtube
  async farmKale(amount = 0, difficulty = 2) {
    console.log(`🌱 Starting KALE Farming with Launchtube`);
    console.log(`=========================================`);
    console.log(`Amount: ${amount} KALE`);
    console.log(`Difficulty: ${difficulty} leading zeros`);
    console.log(`Farmer: ${this.launchtube.publicKey}`);
    console.log(`Contract: ${this.contractId}`);
    console.log(`Network: ${this.network}`);
    console.log(`Launchtube: ${this.launchtube.apiKey ? 'Enabled' : 'Disabled'}\n`);

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
      console.log(`   KALE farming with Launchtube is working correctly!`);
      return { success: true, plantResult, workResult, harvestResult };
    } else {
      console.log(`\n⚠️ Harvest failed: ${harvestResult.error}`);
      return { success: false, step: 'harvest', error: harvestResult.error, plantResult, workResult, harvestResult };
    }
  }

  // Start mining loop con Launchtube
  async startMining(interval = 10000, difficulty = 2) {
    console.log(`🚀 Starting KALE Mining with Launchtube`);
    console.log(`========================================`);
    console.log(`Farmer: ${this.launchtube.publicKey}`);
    console.log(`Contract: ${this.contractId}`);
    console.log(`Network: ${this.network}`);
    console.log(`Launchtube: ${this.launchtube.apiKey ? 'Enabled' : 'Disabled'}`);
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
    return this.launchtube.getConnectionStatus();
  }
}

module.exports = KaleFarmLaunchtube;
