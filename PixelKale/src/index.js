// PixelKale - KaleCraft Main Entry Point
const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config();

// Load passkey integration
let pixelkalePasskey = null;
try {
  const passkeyModule = require('./utils/passkey-kit');
  pixelkalePasskey = passkeyModule.pixelkalePasskey;
  console.log('✅ Passkey integration loaded successfully');
} catch (error) {
  console.log('❌ Failed to load passkey integration:', error.message);
  console.log('Stack:', error.stack);
}

const app = express();
const PORT = process.env.PORT || 3010;

// Middleware
app.use(cors());
app.use(express.json());
// Serve static files from absolute path to avoid cwd issues
app.use(express.static(path.join(__dirname, '..', 'public')));

// Routes
app.get('/', (req, res) => {
  res.json({
    message: '🌱 Welcome to PixelKale - KaleCraft!',
    version: '1.0.0',
    description: 'The first immersive blockchain agriculture experience on Stellar',
    features: [
      'Real blockchain farming with KALE tokens',
      'Pixel art interface with day/night themes',
      'Proof-of-work mining mechanics',
      'Stellar blockchain integration'
    ],
    endpoints: Object.assign({
      health: '/health',
      farm: '/farm',
      blockchain: '/blockchain'
    }, pixelkalePasskey ? {
      passkey: {
        store: '/api/passkey/store',
        connect: '/api/passkey/connect',
        config: '/api/passkey/config',
        status: '/api/passkey/status',
        sessions: '/api/passkey/sessions',
        disconnect: '/api/passkey/disconnect'
      }
    } : {})
  });
});

app.get('/health', (req, res) => {
  res.json({
    status: 'healthy',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    memory: process.memoryUsage()
  });
});

app.get('/farm', (req, res) => {
  res.json({
    message: '🌾 KALE Farm Integration',
    contract: {
      testnet: 'CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO',
      mainnet: 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA'
    },
    functions: ['plant', 'work', 'harvest']
  });
});

app.get('/blockchain', (req, res) => {
  res.json({
    network: 'Stellar',
    smartContracts: 'Soroban',
    token: 'KALE',
    farming: 'Proof-of-Teamwork'
  });
});

// No HTML routes; console-first workflow

// Test endpoint to verify code is running
app.get('/test-debug', (req, res) => {
  res.json({ 
    message: 'Debug endpoint working',
    timestamp: new Date().toISOString(),
    passkeyLoaded: !!pixelkalePasskey
  });
});

// Passkey endpoints (T2: Register Passkey)
if (pixelkalePasskey) {
  console.log('🔑 Registering passkey endpoints...');

  app.post('/api/passkey/store', async (req, res) => {
    try {
      const { keyId, contractId, appName } = req.body;
      const result = pixelkalePasskey.storeSession({ keyId, contractId, appName });
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.post('/api/passkey/connect', async (req, res) => {
    try {
      const { keyId } = req.body;
      const result = pixelkalePasskey.connectSession(keyId);
      res.json(result);
    } catch (error) {
      res.status(500).json({ success: false, error: error.message });
    }
  });

  app.get('/api/passkey/config', (req, res) => {
    const config = pixelkalePasskey.getConfig();
    res.json({ success: true, config });
  });

  app.get('/api/passkey/sessions', (req, res) => {
    const sessions = pixelkalePasskey.listSessions();
    res.json(sessions);
  });

  app.get('/api/passkey/status', (req, res) => {
    const status = pixelkalePasskey.getStatus();
    res.json(status);
  });

  app.post('/api/passkey/disconnect', (req, res) => {
    pixelkalePasskey.disconnect();
    res.json({ success: true, message: 'Wallet disconnected' });
  });

  console.log('✅ Passkey endpoints registered successfully');
} else {
  console.log('⚠️ Passkey integration not available - endpoints not registered');
}

// Start server
app.listen(PORT, () => {
  console.log('🌱 PixelKale - KaleCraft Server Started!');
  console.log(`🚀 Server running on port ${PORT}`);
  console.log(`🌐 Visit: http://localhost:${PORT}`);
  console.log('🎮 Ready for blockchain farming!');
});

module.exports = app;
