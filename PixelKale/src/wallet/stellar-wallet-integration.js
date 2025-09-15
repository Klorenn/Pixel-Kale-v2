// Stellar Wallet Integration - Integración completa de wallets de Stellar
const StellarSdk = require('stellar-sdk');

class StellarWalletIntegration {
  constructor(network = 'testnet') {
    this.network = network;
    this.currentWallet = null;
    this.walletType = null;
    this.isConnected = false;
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
    // Set network passphrase for transactions
    this.networkPassphrase = this.networkConfig[network].networkPassphrase;
  }

  // Lista de wallets disponibles
  getAvailableWallets() {
    return [
      {
        name: 'Albedo',
        id: 'albedo',
        description: 'Browser-based wallet for Stellar',
        logo: '🔷',
        available: true,
        connectMethod: 'albedo'
      },
      {
        name: 'xBull',
        id: 'xbull',
        description: 'Mobile wallet for Stellar',
        logo: '🐂',
        available: true,
        connectMethod: 'xbull'
      },
      {
        name: 'Ledger',
        id: 'ledger',
        description: 'Hardware wallet support',
        logo: '🔒',
        available: true,
        connectMethod: 'ledger'
      },
      {
        name: 'LOBSTR',
        id: 'lobstr',
        description: 'Mobile wallet for Stellar',
        logo: '🌊',
        available: false,
        connectMethod: 'lobstr'
      },
      {
        name: 'Rabet',
        id: 'rabet',
        description: 'Browser extension wallet',
        logo: '🐰',
        available: false,
        connectMethod: 'rabet'
      }
    ];
  }

  // Conectar con Albedo
  async connectAlbedo() {
    try {
      console.log('🔷 Connecting to Albedo wallet...');
      
      // Verificar si Albedo está disponible
      if (typeof window !== 'undefined' && window.albedo) {
        const albedo = window.albedo;
        
        // Solicitar conexión
        const result = await albedo.publicKey({
          account: null,
          auth: {
            type: 'albedo',
            params: {
              network: this.network
            }
          }
        });
        
        this.currentWallet = 'albedo';
        this.walletType = 'albedo';
        this.isConnected = true;
        this.publicKey = result.publicKey;
        
        console.log('✅ Connected to Albedo successfully!');
        console.log(`   Public Key: ${this.publicKey}`);
        
        return { success: true, publicKey: this.publicKey, wallet: 'albedo' };
      } else {
        throw new Error('Albedo wallet not found. Please install the Albedo extension.');
      }
    } catch (error) {
      console.log('❌ Albedo connection failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Conectar con xBull
  async connectXBull() {
    try {
      console.log('🐂 Connecting to xBull wallet...');
      
      // Verificar si xBull está disponible
      if (typeof window !== 'undefined' && window.xBull) {
        const xBull = window.xBull;
        
        // Solicitar conexión
        const result = await xBull.connect();
        
        this.currentWallet = 'xbull';
        this.walletType = 'xbull';
        this.isConnected = true;
        this.publicKey = result.publicKey;
        
        console.log('✅ Connected to xBull successfully!');
        console.log(`   Public Key: ${this.publicKey}`);
        
        return { success: true, publicKey: this.publicKey, wallet: 'xbull' };
      } else {
        throw new Error('xBull wallet not found. Please install the xBull app.');
      }
    } catch (error) {
      console.log('❌ xBull connection failed:', error.message);
      return { success: false, error: error.message };
    }
  }


  // Conectar con Ledger
  async connectLedger() {
    try {
      console.log('🔒 Connecting to Ledger wallet...');
      
      // Verificar si Ledger está disponible
      if (typeof window !== 'undefined' && window.ledger) {
        const ledger = window.ledger;
        
        // Solicitar conexión
        const result = await ledger.connect();
        
        this.currentWallet = 'ledger';
        this.walletType = 'ledger';
        this.isConnected = true;
        this.publicKey = result.publicKey;
        
        console.log('✅ Connected to Ledger successfully!');
        console.log(`   Public Key: ${this.publicKey}`);
        
        return { success: true, publicKey: this.publicKey, wallet: 'ledger' };
      } else {
        throw new Error('Ledger wallet not found. Please connect your Ledger device.');
      }
    } catch (error) {
      console.log('❌ Ledger connection failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Conectar con wallet genérico
  async connectWallet(walletType) {
    switch (walletType) {
      case 'albedo':
        return await this.connectAlbedo();
      case 'xbull':
        return await this.connectXBull();
      case 'ledger':
        return await this.connectLedger();
      default:
        throw new Error(`Unsupported wallet type: ${walletType}`);
    }
  }

  // Desconectar wallet
  async disconnectWallet() {
    try {
      console.log(`🔌 Disconnecting ${this.walletType} wallet...`);
      
      this.currentWallet = null;
      this.walletType = null;
      this.isConnected = false;
      this.publicKey = null;
      this.secretKey = null;
      
      console.log('✅ Wallet disconnected successfully!');
      return { success: true };
    } catch (error) {
      console.log('❌ Wallet disconnection failed:', error.message);
      return { success: false, error: error.message };
    }
  }

  // Obtener información de la cuenta
  async getAccountInfo() {
    if (!this.isConnected || !this.publicKey) {
      throw new Error('No wallet connected');
    }

    try {
      console.log('📊 Getting account information...');
      
      const account = await this.server.loadAccount(this.publicKey);
      
      const accountInfo = {
        publicKey: this.publicKey,
        walletType: this.walletType,
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

  // Crear transacción
  async createTransaction(operations) {
    if (!this.isConnected || !this.publicKey) {
      throw new Error('No wallet connected');
    }

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

  // Firmar transacción
  async signTransaction(transaction) {
    if (!this.isConnected) {
      throw new Error('No wallet connected');
    }

    try {
      console.log('✍️ Signing transaction...');
      
      let signedTransaction;
      
      switch (this.walletType) {
        case 'albedo':
          if (window.albedo) {
            signedTransaction = await window.albedo.sign(transaction);
          }
          break;
        case 'xbull':
          if (window.xBull) {
            signedTransaction = await window.xBull.sign(transaction);
          }
          break;
        case 'ledger':
          if (window.ledger) {
            signedTransaction = await window.ledger.sign(transaction);
          }
          break;
        default:
          throw new Error(`Unsupported wallet type for signing: ${this.walletType}`);
      }
      
      console.log('✅ Transaction signed successfully!');
      return { success: true, signedTransaction };
    } catch (error) {
      console.log('❌ Failed to sign transaction:', error.message);
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

  // Obtener estado de conexión
  getConnectionStatus() {
    return {
      isConnected: this.isConnected,
      walletType: this.walletType,
      publicKey: this.publicKey,
      network: this.network
    };
  }

  // Cambiar red
  switchNetwork(network) {
    if (network !== 'testnet' && network !== 'mainnet') {
      throw new Error('Invalid network. Use "testnet" or "mainnet"');
    }

    this.network = network;
    this.server = new StellarSdk.Horizon.Server(this.networkConfig[network].horizonUrl);
    // Set network passphrase for transactions
    this.networkPassphrase = this.networkConfig[network].networkPassphrase;
    
    console.log(`🔄 Switched to ${network} network`);
    return { success: true, network };
  }
}

module.exports = StellarWalletIntegration;
