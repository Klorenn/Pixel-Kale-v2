// Wallet Server - Servidor web con integración de wallets
const express = require('express');
const path = require('path');
const KaleFarmWithWallets = require('../wallet/kale-farm-with-wallets');

class WalletServer {
  constructor(port = 3000) {
    this.app = express();
    this.port = port;
    this.kaleFarm = new KaleFarmWithWallets('testnet');
    this.setupMiddleware();
    this.setupRoutes();
  }

  // Configurar middleware
  setupMiddleware() {
    this.app.use(express.json());
    this.app.use(express.static(path.join(__dirname, '../../public')));
    this.app.use(express.static(path.join(__dirname, '../wallet')));
  }

  // Configurar rutas
  setupRoutes() {
    // Ruta principal
    this.app.get('/', (req, res) => {
      res.sendFile(path.join(__dirname, '../wallet/wallet-connector.html'));
    });

    // API para conectar wallet
    this.app.post('/api/connect-wallet', async (req, res) => {
      try {
        const { walletType } = req.body;
        
        if (!walletType) {
          return res.status(400).json({ success: false, error: 'Wallet type required' });
        }

        const result = await this.kaleFarm.connectWallet(walletType);
        res.json(result);
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para desconectar wallet
    this.app.post('/api/disconnect-wallet', async (req, res) => {
      try {
        const result = await this.kaleFarm.disconnectWallet();
        res.json(result);
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para obtener información de cuenta
    this.app.get('/api/account-info', async (req, res) => {
      try {
        const result = await this.kaleFarm.getAccountInfo();
        res.json(result);
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para plant KALE
    this.app.post('/api/plant-kale', async (req, res) => {
      try {
        const { amount = 0 } = req.body;
        const result = await this.kaleFarm.plantKale(amount);
        res.json(result);
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para work KALE
    this.app.post('/api/work-kale', async (req, res) => {
      try {
        const { index, nonce, hash } = req.body;
        
        if (!index || !nonce || !hash) {
          return res.status(400).json({ success: false, error: 'Index, nonce, and hash required' });
        }

        const result = await this.kaleFarm.workKale(index, nonce, hash);
        res.json(result);
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para harvest KALE
    this.app.post('/api/harvest-kale', async (req, res) => {
      try {
        const { index } = req.body;
        
        if (!index) {
          return res.status(400).json({ success: false, error: 'Index required' });
        }

        const result = await this.kaleFarm.harvestKale(index);
        res.json(result);
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para ciclo completo de farming
    this.app.post('/api/farm-kale', async (req, res) => {
      try {
        const { amount = 0, difficulty = 2 } = req.body;
        const result = await this.kaleFarm.farmKale(amount, difficulty);
        res.json(result);
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para generar hash válido
    this.app.post('/api/generate-hash', async (req, res) => {
      try {
        const { difficulty = 2 } = req.body;
        const result = await this.kaleFarm.generateValidHash(difficulty);
        res.json(result);
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para iniciar minería
    this.app.post('/api/start-mining', async (req, res) => {
      try {
        const { interval = 10000, difficulty = 2 } = req.body;
        
        // Iniciar minería en background
        this.kaleFarm.startMining(interval, difficulty).then(() => {
          console.log('Mining completed');
        }).catch((error) => {
          console.error('Mining error:', error);
        });
        
        res.json({ success: true, message: 'Mining started' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para detener minería
    this.app.post('/api/stop-mining', async (req, res) => {
      try {
        this.kaleFarm.stopMining();
        res.json({ success: true, message: 'Mining stopped' });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para obtener estadísticas
    this.app.get('/api/stats', (req, res) => {
      try {
        const stats = this.kaleFarm.miningStats;
        res.json({ success: true, stats });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para obtener estado de conexión
    this.app.get('/api/connection-status', (req, res) => {
      try {
        const status = this.kaleFarm.getConnectionStatus();
        res.json({ success: true, status });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para cambiar red
    this.app.post('/api/switch-network', (req, res) => {
      try {
        const { network } = req.body;
        
        if (!network || (network !== 'testnet' && network !== 'mainnet')) {
          return res.status(400).json({ success: false, error: 'Invalid network. Use "testnet" or "mainnet"' });
        }

        this.kaleFarm.walletIntegration.switchNetwork(network);
        res.json({ success: true, network });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });

    // API para obtener wallets disponibles
    this.app.get('/api/available-wallets', (req, res) => {
      try {
        const wallets = this.kaleFarm.walletIntegration.getAvailableWallets();
        res.json({ success: true, wallets });
      } catch (error) {
        res.status(500).json({ success: false, error: error.message });
      }
    });
  }

  // Iniciar servidor
  start() {
    this.app.listen(this.port, () => {
      console.log(`\n🚀 PixelKale Wallet Server Started!`);
      console.log(`===================================`);
      console.log(`🌐 Server: http://localhost:${this.port}`);
      console.log(`🔌 Wallet Connector: http://localhost:${this.port}/`);
      console.log(`📊 API Endpoints: http://localhost:${this.port}/api/`);
      console.log(`\nAvailable Wallets:`);
      console.log(`   🔷 Albedo (Browser-based)`);
      console.log(`   🐂 xBull (Mobile)`);
      console.log(`   🔒 Ledger (Hardware wallet)`);
      console.log(`\nPress Ctrl+C to stop the server`);
    });
  }

  // Detener servidor
  stop() {
    console.log(`\n⏹️ Stopping PixelKale Wallet Server...`);
    process.exit(0);
  }
}

// Crear y iniciar servidor
const server = new WalletServer(3000);

// Manejar cierre del servidor
process.on('SIGINT', () => {
  server.stop();
});

// Iniciar servidor
server.start();

module.exports = WalletServer;
