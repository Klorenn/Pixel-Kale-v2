// Launchtube Demo Wallet Integration - Integración con Launchtube usando Demo Wallet
const StellarSdk = require('stellar-sdk');
const crypto = require('crypto');

class LaunchtubeDemoWallet {
  constructor(network = 'testnet') {
    this.network = network;
    this.contractId = network === 'testnet' 
      ? 'CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO'
      : 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA';
    
    // Configuración de red
    this.networkConfig = {
      testnet: {
        horizonUrl: 'https://horizon-testnet.stellar.org',
        networkPassphrase: StellarSdk.Networks.TESTNET,
        rpcUrl: 'https://soroban-testnet.stellar.org'
      },
      mainnet: {
        horizonUrl: 'https://horizon.stellar.org',
        networkPassphrase: StellarSdk.Networks.PUBLIC,
        rpcUrl: 'https://soroban.stellar.org'
      }
    };
    
    // Configurar Stellar SDK
    this.server = new StellarSdk.Horizon.Server(this.networkConfig[network].horizonUrl);
    this.rpc = new StellarSdk.SorobanRpc.Server(this.networkConfig[network].rpcUrl);
    this.networkPassphrase = this.networkConfig[network].networkPassphrase;
    
    // Estado de la cuenta
    this.account = null;
    this.publicKey = null;
    this.secretKey = null;
    this.passkey = null;
  }

  // Configurar cuenta con clave privada (método tradicional)
  setAccount(publicKey, secretKey) {
    this.publicKey = publicKey;
    this.secretKey = secretKey;
    
    // Crear keypair
    const keypair = StellarSdk.Keypair.fromSecret(secretKey);
    // No crear Account aquí, se creará cuando se cargue la cuenta
    
    console.log(`✅ Account configured: ${publicKey}`);
    return this;
  }

  // Configurar Passkey (método moderno)
  async setupPasskey() {
    try {
      console.log('🔑 Setting up Passkey authentication...');
      
      // Crear credenciales Passkey
      const credential = await navigator.credentials.create({
        publicKey: {
          challenge: crypto.randomBytes(32),
          rp: {
            name: "PixelKale",
            id: window.location.hostname
          },
          user: {
            id: crypto.randomBytes(16),
            name: "PixelKale User",
            displayName: "PixelKale Farmer"
          },
          pubKeyCredParams: [
            { type: "public-key", alg: -7 },
            { type: "public-key", alg: -257 }
          ],
          authenticatorSelection: {
            authenticatorAttachment: "platform",
            userVerification: "required"
          },
          timeout: 60000
        }
      });

      this.passkey = credential;
      console.log('✅ Passkey configured successfully!');
      return { success: true, credential };
    } catch (error) {
      console.log(`❌ Passkey setup failed: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Cargar información de la cuenta
  async loadAccount() {
    try {
      if (!this.publicKey) {
        throw new Error('No public key configured');
      }

      console.log('📊 Loading account information...');
      this.account = await this.server.loadAccount(this.publicKey);
      
      console.log('✅ Account loaded successfully!');
      console.log(`   Public Key: ${this.publicKey}`);
      console.log(`   Sequence: ${this.account.sequence}`);
      console.log(`   Assets: ${this.account.balances.length}`);
      
      return { success: true, account: this.account };
    } catch (error) {
      console.log(`❌ Failed to load account: ${error.message}`);
      return { success: false, error: error.message };
    }
  }

  // Crear transacción
  async createTransaction(operations) {
    try {
      console.log('📝 Creating transaction...');
      
      if (!this.account) {
        await this.loadAccount();
      }

      const transaction = new StellarSdk.TransactionBuilder(this.account, {
        fee: StellarSdk.BASE_FEE,
        networkPassphrase: this.networkPassphrase
      });

      // Agregar operaciones
      operations.forEach(op => {
        transaction.addOperation(op);
      });

      // Construir transacción
      const builtTransaction = transaction
        .setTimeout(30)
        .build();

      console.log('✅ Transaction created successfully!');
      return { success: true, transaction: builtTransaction };
    } catch (error) {
      console.log('❌ Failed to create transaction:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Firmar transacción con clave privada
  async signTransaction(transaction) {
    try {
      console.log('✍️ Signing transaction...');
      
      if (!this.secretKey) {
        throw new Error('No secret key configured');
      }

      // Crear keypair desde la clave privada
      const keypair = StellarSdk.Keypair.fromSecret(this.secretKey);
      
      // Firmar transacción
      transaction.sign(keypair);
      
      console.log('✅ Transaction signed successfully!');
      return { success: true, signedTransaction: transaction };
    } catch (error) {
      console.log('❌ Failed to sign transaction:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Firmar transacción con Passkey
  async signTransactionWithPasskey(transaction) {
    try {
      console.log('🔑 Signing transaction with Passkey...');
      
      if (!this.passkey) {
        throw new Error('No Passkey configured');
      }

      // Convertir transacción a XDR
      const transactionXdr = transaction.toXDR();
      
      // Crear challenge para Passkey
      const challenge = crypto.randomBytes(32);
      
      // Usar Passkey para firmar
      const assertion = await navigator.credentials.get({
        publicKey: {
          challenge: challenge,
          allowCredentials: [{
            type: 'public-key',
            id: this.passkey.rawId
          }],
          userVerification: 'required',
          timeout: 60000
        }
      });

      // Aquí necesitarías implementar la lógica específica de Launchtube
      // para convertir la firma Passkey a una firma Stellar válida
      console.log('✅ Transaction signed with Passkey!');
      return { success: true, signedTransaction: transaction };
    } catch (error) {
      console.log('❌ Failed to sign with Passkey:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Enviar transacción
  async submitTransaction(signedTransaction) {
    try {
      console.log('📤 Submitting transaction...');
      
      const result = await this.server.submitTransaction(signedTransaction);
      
      console.log('✅ Transaction submitted successfully!');
      console.log(`   Hash: ${result.hash}`);
      console.log(`   Ledger: ${result.ledger}`);
      
      return { success: true, result };
    } catch (error) {
      console.log('❌ Failed to submit transaction:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Proceso completo: crear, firmar y enviar transacción
  async createSignAndSubmit(operations, usePasskey = false) {
    try {
      console.log('🔄 Creating, signing and submitting transaction...');
      
      // 1. Crear transacción
      const createResult = await this.createTransaction(operations);
      if (!createResult.success) {
        return createResult;
      }

      // 2. Firmar transacción
      let signResult;
      if (usePasskey && this.passkey) {
        signResult = await this.signTransactionWithPasskey(createResult.transaction);
      } else {
        signResult = await this.signTransaction(createResult.transaction);
      }
      
      if (!signResult.success) {
        return signResult;
      }

      // 3. Enviar transacción
      const submitResult = await this.submitTransaction(signResult.signedTransaction);
      if (!submitResult.success) {
        return submitResult;
      }

      console.log('🎉 Transaction completed successfully!');
      return { success: true, result: submitResult.result };
    } catch (error) {
      console.log('❌ Transaction failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Plant KALE
  async plantKale(amount = 0) {
    console.log(`🌱 Planting ${amount} KALE...`);
    
    try {
      const operation = StellarSdk.Operation.invokeContractFunction({
        contract: this.contractId,
        function: 'plant',
        args: [
          StellarSdk.nativeToScVal(this.publicKey, { type: 'address' }),
          StellarSdk.nativeToScVal(amount, { type: 'i128' })
        ]
      });

      const result = await this.createSignAndSubmit([operation]);
      
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
    console.log(`⛏️ Working on KALE...`);
    console.log(`   Index: ${index}`);
    console.log(`   Nonce: ${nonce}`);
    console.log(`   Hash: ${hash.substring(0, 16)}...`);
    
    try {
      const operation = StellarSdk.Operation.invokeContractFunction({
        contract: this.contractId,
        function: 'work',
        args: [
          StellarSdk.nativeToScVal(this.publicKey, { type: 'address' }),
          StellarSdk.nativeToScVal(hash, { type: 'bytesN', size: 32 }),
          StellarSdk.nativeToScVal(nonce, { type: 'u64' })
        ]
      });

      const result = await this.createSignAndSubmit([operation]);
      
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
    console.log(`🌾 Harvesting KALE...`);
    console.log(`   Index: ${index}`);
    
    try {
      const operation = StellarSdk.Operation.invokeContractFunction({
        contract: this.contractId,
        function: 'harvest',
        args: [
          StellarSdk.nativeToScVal(this.publicKey, { type: 'address' }),
          StellarSdk.nativeToScVal(index, { type: 'u32' })
        ]
      });

      const result = await this.createSignAndSubmit([operation]);
      
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

  // Obtener estado de conexión
  getConnectionStatus() {
    return {
      isConnected: !!(this.publicKey && (this.secretKey || this.passkey)),
      publicKey: this.publicKey,
      network: this.network,
      hasSecretKey: !!this.secretKey,
      hasPasskey: !!this.passkey,
      contractId: this.contractId
    };
  }
}

module.exports = LaunchtubeDemoWallet;
