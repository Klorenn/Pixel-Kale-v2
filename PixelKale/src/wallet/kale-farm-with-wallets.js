// KALE Farm with Wallet Integration - Integración completa con wallets
const StellarWalletIntegration = require('./stellar-wallet-integration');
const { execSync } = require('child_process');
const crypto = require('crypto');

class KaleFarmWithWallets {
  constructor(network = 'testnet') {
    this.network = network;
    this.contractId = network === 'testnet' 
      ? 'CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO'
      : 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA';
    
    this.walletIntegration = new StellarWalletIntegration(network);
    this.miningStats = {
      attempts: 0,
      successfulHashes: 0,
      totalRewards: 0,
      startTime: null
    };
  }

  // Conectar wallet
  async connectWallet(walletType) {
    console.log(`🔌 Connecting to ${walletType} wallet...`);
    
    const result = await this.walletIntegration.connectWallet(walletType);
    
    if (result.success) {
      console.log(`✅ Connected to ${walletType} successfully!`);
      console.log(`   Public Key: ${result.publicKey}`);
      return { success: true, publicKey: result.publicKey };
    } else {
      console.log(`❌ Failed to connect to ${walletType}: ${result.error}`);
      return { success: false, error: result.error };
    }
  }

  // Desconectar wallet
  async disconnectWallet() {
    console.log('🔌 Disconnecting wallet...');
    
    const result = await this.walletIntegration.disconnectWallet();
    
    if (result.success) {
      console.log('✅ Wallet disconnected successfully!');
      return { success: true };
    } else {
      console.log(`❌ Failed to disconnect wallet: ${result.error}`);
      return { success: false, error: result.error };
    }
  }

  // Obtener información de la cuenta
  async getAccountInfo() {
    console.log('📊 Getting account information...');
    
    const result = await this.walletIntegration.getAccountInfo();
    
    if (result.success) {
      console.log('✅ Account information retrieved successfully!');
      return { success: true, account: result.account };
    } else {
      console.log(`❌ Failed to get account info: ${result.error}`);
      return { success: false, error: result.error };
    }
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
      const decoded = StellarSdk.StrKey.decodeEd25519PublicKey(address);
      return Buffer.from(decoded);
    } catch (error) {
      // Fallback: usar hash de la dirección
      const hash = crypto.createHash('sha256').update(address).digest();
      return hash;
    }
  }

  // Plant KALE usando wallet
  async plantKale(amount = 0) {
    if (!this.walletIntegration.isConnected) {
      throw new Error('No wallet connected');
    }

    console.log(`🌱 Planting ${amount} KALE using wallet...`);
    
    try {
      // Crear operación de contrato
      const operation = StellarSdk.Operation.invokeContractFunction({
        contract: this.contractId,
        function: 'plant',
        args: [
          StellarSdk.nativeToScVal(this.walletIntegration.publicKey, { type: 'address' }),
          StellarSdk.nativeToScVal(amount, { type: 'i128' })
        ]
      });

      // Crear transacción
      const transactionResult = await this.walletIntegration.createTransaction([operation]);
      
      if (!transactionResult.success) {
        throw new Error(transactionResult.error);
      }

      // Firmar transacción
      const signResult = await this.walletIntegration.signTransaction(transactionResult.transaction);
      
      if (!signResult.success) {
        throw new Error(signResult.error);
      }

      // Enviar transacción
      const submitResult = await this.walletIntegration.submitTransaction(signResult.signedTransaction);
      
      if (submitResult.success) {
        console.log('✅ Planted successfully using wallet!');
        console.log(`   Amount: ${amount} KALE`);
        console.log(`   Transaction Hash: ${submitResult.result.hash}`);
        return { success: true, result: submitResult.result };
      } else {
        throw new Error(submitResult.error);
      }
    } catch (error) {
      console.log(`❌ Plant failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Work KALE usando wallet
  async workKale(index, nonce, hash) {
    if (!this.walletIntegration.isConnected) {
      throw new Error('No wallet connected');
    }

    console.log(`⛏️ Working on KALE using wallet...`);
    console.log(`   Index: ${index}`);
    console.log(`   Nonce: ${nonce}`);
    console.log(`   Hash: ${hash.substring(0, 16)}...`);
    
    try {
      // Crear operación de contrato
      const operation = StellarSdk.Operation.invokeContractFunction({
        contract: this.contractId,
        function: 'work',
        args: [
          StellarSdk.nativeToScVal(this.walletIntegration.publicKey, { type: 'address' }),
          StellarSdk.nativeToScVal(hash, { type: 'bytesN', size: 32 }),
          StellarSdk.nativeToScVal(nonce, { type: 'u64' })
        ]
      });

      // Crear transacción
      const transactionResult = await this.walletIntegration.createTransaction([operation]);
      
      if (!transactionResult.success) {
        throw new Error(transactionResult.error);
      }

      // Firmar transacción
      const signResult = await this.walletIntegration.signTransaction(transactionResult.transaction);
      
      if (!signResult.success) {
        throw new Error(signResult.error);
      }

      // Enviar transacción
      const submitResult = await this.walletIntegration.submitTransaction(signResult.signedTransaction);
      
      if (submitResult.success) {
        console.log('✅ Work completed successfully using wallet!');
        console.log(`   Transaction Hash: ${submitResult.result.hash}`);
        return { success: true, result: submitResult.result };
      } else {
        throw new Error(submitResult.error);
      }
    } catch (error) {
      console.log(`❌ Work failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Harvest KALE usando wallet
  async harvestKale(index) {
    if (!this.walletIntegration.isConnected) {
      throw new Error('No wallet connected');
    }

    console.log(`🌾 Harvesting KALE using wallet...`);
    console.log(`   Index: ${index}`);
    
    try {
      // Crear operación de contrato
      const operation = StellarSdk.Operation.invokeContractFunction({
        contract: this.contractId,
        function: 'harvest',
        args: [
          StellarSdk.nativeToScVal(this.walletIntegration.publicKey, { type: 'address' }),
          StellarSdk.nativeToScVal(index, { type: 'u32' })
        ]
      });

      // Crear transacción
      const transactionResult = await this.walletIntegration.createTransaction([operation]);
      
      if (!transactionResult.success) {
        throw new Error(transactionResult.error);
      }

      // Firmar transacción
      const signResult = await this.walletIntegration.signTransaction(transactionResult.transaction);
      
      if (!signResult.success) {
        throw new Error(signResult.error);
      }

      // Enviar transacción
      const submitResult = await this.walletIntegration.submitTransaction(signResult.signedTransaction);
      
      if (submitResult.success) {
        console.log('✅ Harvested successfully using wallet!');
        console.log(`   Transaction Hash: ${submitResult.result.hash}`);
        return { success: true, result: submitResult.result };
      } else {
        throw new Error(submitResult.error);
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
      const hash = this.generateHash(index, nonce, entropy, this.walletIntegration.publicKey);
      
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

  // Proceso completo de farming con wallet
  async farmKale(amount = 0, difficulty = 2) {
    if (!this.walletIntegration.isConnected) {
      throw new Error('No wallet connected. Please connect a wallet first.');
    }

    console.log(`🌱 Starting KALE Farming with Wallet`);
    console.log(`===================================`);
    console.log(`Amount: ${amount} KALE`);
    console.log(`Difficulty: ${difficulty} leading zeros`);
    console.log(`Farmer: ${this.walletIntegration.publicKey}`);
    console.log(`Wallet: ${this.walletIntegration.walletType}`);
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
      console.log(`   KALE farming with wallet is working correctly!`);
      return { success: true, plantResult, workResult, harvestResult };
    } else {
      console.log(`\n⚠️ Harvest failed: ${harvestResult.error}`);
      return { success: false, step: 'harvest', error: harvestResult.error, plantResult, workResult, harvestResult };
    }
  }

  // Start mining loop con wallet
  async startMining(interval = 10000, difficulty = 2) {
    if (!this.walletIntegration.isConnected) {
      console.log('❌ No wallet connected. Please connect a wallet first.');
      return;
    }

    console.log(`🚀 Starting KALE Mining with Wallet`);
    console.log(`===================================`);
    console.log(`Farmer: ${this.walletIntegration.publicKey}`);
    console.log(`Wallet: ${this.walletIntegration.walletType}`);
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
    return this.walletIntegration.getConnectionStatus();
  }
}

module.exports = KaleFarmWithWallets;
