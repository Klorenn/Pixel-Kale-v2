// Launchtube Integration - Integración con Launchtube para firmar transacciones
const StellarSdk = require('stellar-sdk');
const crypto = require('crypto');

class LaunchtubeIntegration {
  constructor(network = 'testnet') {
    this.network = network;
    this.launchtubeUrl = 'https://launchtube.xyz';
    this.apiKey = null;
    this.publicKey = null;
    this.secretKey = null;
    
    // Configuración de red
    this.networkConfig = {
      testnet: {
        horizonUrl: 'https://horizon-testnet.stellar.org',
        networkPassphrase: StellarSdk.Networks.TESTNET
      },
      mainnet: {
        horizonUrl: 'https://horizon.stellar.org',
        networkPassphrase: StellarSdk.Networks.PUBLIC
      }
    };
    
    // Configurar Stellar SDK
    this.server = new StellarSdk.Horizon.Server(this.networkConfig[network].horizonUrl);
    this.networkPassphrase = this.networkConfig[network].networkPassphrase;
  }

  // Configurar API key de Launchtube
  setApiKey(apiKey) {
    this.apiKey = apiKey;
    console.log('✅ Launchtube API key configured');
    return this;
  }

  // Configurar cuenta (clave pública y privada)
  setAccount(publicKey, secretKey) {
    this.publicKey = publicKey;
    this.secretKey = secretKey;
    console.log(`✅ Account configured: ${publicKey}`);
    return this;
  }

  // Crear transacción
  async createTransaction(operations) {
    try {
      console.log('📝 Creating transaction...');
      
      const account = await this.server.loadAccount(this.publicKey);
      const transaction = new StellarSdk.TransactionBuilder(account, {
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

  // Firmar transacción con Launchtube
  async signTransactionWithLaunchtube(transaction) {
    try {
      console.log('✍️ Signing transaction with Launchtube...');
      
      // Convertir transacción a XDR
      const transactionXdr = transaction.toXDR();
      
      // Crear payload para Launchtube
      const payload = {
        transaction: transactionXdr,
        network: this.network,
        apiKey: this.apiKey
      };

      // Enviar a Launchtube para firmar
      const response = await fetch(`${this.launchtubeUrl}/api/sign-transaction`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (!response.ok) {
        throw new Error(`Launchtube API error: ${response.status} ${response.statusText}`);
      }

      const result = await response.json();
      
      if (result.success) {
        // Convertir XDR firmado de vuelta a transacción
        const signedTransaction = StellarSdk.TransactionBuilder.fromXDR(
          result.signedTransaction,
          this.networkPassphrase
        );
        
        console.log('✅ Transaction signed with Launchtube successfully!');
        return { success: true, signedTransaction };
      } else {
        throw new Error(result.error || 'Failed to sign transaction');
      }
    } catch (error) {
      console.log('❌ Failed to sign with Launchtube:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Firmar transacción localmente (fallback)
  async signTransactionLocally(transaction) {
    try {
      console.log('✍️ Signing transaction locally...');
      
      // Crear keypair desde la clave privada
      const keypair = StellarSdk.Keypair.fromSecret(this.secretKey);
      
      // Firmar transacción
      transaction.sign(keypair);
      
      console.log('✅ Transaction signed locally successfully!');
      return { success: true, signedTransaction: transaction };
    } catch (error) {
      console.log('❌ Failed to sign locally:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Firmar transacción (intenta Launchtube primero, luego local)
  async signTransaction(transaction) {
    // Intentar con Launchtube primero
    if (this.apiKey) {
      const launchtubeResult = await this.signTransactionWithLaunchtube(transaction);
      if (launchtubeResult.success) {
        return launchtubeResult;
      }
      console.log('⚠️ Launchtube signing failed, trying local signing...');
    }

    // Fallback a firma local
    return await this.signTransactionLocally(transaction);
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

  // Obtener información de la cuenta
  async getAccountInfo() {
    try {
      console.log('📊 Getting account information...');
      
      const account = await this.server.loadAccount(this.publicKey);
      
      const accountInfo = {
        publicKey: this.publicKey,
        balance: account.balances,
        sequence: account.sequence,
        subentryCount: account.subentry_count,
        flags: account.flags,
        thresholds: account.thresholds,
        signers: account.signers
      };
      
      console.log('✅ Account information retrieved successfully!');
      console.log(`   Balance: ${account.balances.length} assets`);
      console.log(`   Sequence: ${account.sequence}`);
      
      return { success: true, account: accountInfo };
    } catch (error) {
      console.log('❌ Failed to get account info:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Proceso completo: crear, firmar y enviar transacción
  async createSignAndSubmit(operations) {
    try {
      console.log('🔄 Creating, signing and submitting transaction...');
      
      // 1. Crear transacción
      const createResult = await this.createTransaction(operations);
      if (!createResult.success) {
        return createResult;
      }

      // 2. Firmar transacción
      const signResult = await this.signTransaction(createResult.transaction);
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

  // Cambiar red
  switchNetwork(network) {
    if (network !== 'testnet' && network !== 'mainnet') {
      throw new Error('Invalid network. Use "testnet" or "mainnet"');
    }

    this.network = network;
    this.server = new StellarSdk.Horizon.Server(this.networkConfig[network].horizonUrl);
    this.networkPassphrase = this.networkConfig[network].networkPassphrase;
    
    console.log(`🔄 Switched to ${network} network`);
    return { success: true, network };
  }

  // Obtener estado de conexión
  getConnectionStatus() {
    return {
      isConnected: !!(this.publicKey && this.secretKey),
      publicKey: this.publicKey,
      network: this.network,
      hasApiKey: !!this.apiKey,
      launchtubeEnabled: !!this.apiKey
    };
  }
}

module.exports = LaunchtubeIntegration;
