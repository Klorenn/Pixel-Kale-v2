# 🥬 PixelKale - Wallet Integration Guide

## 🌟 Overview

PixelKale now includes complete integration with Stellar wallets, allowing users to connect their wallets and farm KALE directly through the web interface. This integration supports all major Stellar wallets and provides a seamless farming experience.

## 🔌 Supported Wallets

### ✅ Available Wallets

| Wallet | Type | Status | Description |
|--------|------|--------|-------------|
| **Albedo** | Browser-based | ✅ Available | Browser-based wallet for Stellar |
| **xBull** | Mobile | ✅ Available | Mobile wallet for Stellar |
| **Ledger** | Hardware | ✅ Available | Hardware wallet support |

### ⚠️ Unavailable Wallets

| Wallet | Type | Status | Description |
|--------|------|--------|-------------|
| **LOBSTR** | Mobile | ❌ Not Available | Mobile wallet for Stellar |
| **Rabet** | Browser Extension | ❌ Not Available | Browser extension wallet |

## 🚀 Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start the Wallet Server

```bash
npm run wallet
```

### 3. Open the Web Interface

Open your browser and go to: `http://localhost:3000`

### 4. Connect Your Wallet

1. Click on your preferred wallet (Albedo, xBull, or Ledger)
2. Follow the wallet's connection prompts
3. Once connected, you can start farming KALE!

## 📁 Project Structure

```
PixelKale/
├── src/
│   ├── wallet/
│   │   ├── stellar-wallet-integration.js    # Core wallet integration
│   │   ├── kale-farm-with-wallets.js        # KALE Farm with wallet support
│   │   └── wallet-connector.html            # Web interface
│   ├── server/
│   │   └── wallet-server.js                 # Web server with API
│   └── blockchain/
│       └── kale-farm-sdk.js                 # KALE Farm SDK
├── start-wallet-farming.js                  # Main startup script
├── wallet-farming-demo.js                   # Demo script
└── package.json
```

## 🔧 API Endpoints

### Wallet Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/connect-wallet` | Connect a Stellar wallet |
| `POST` | `/api/disconnect-wallet` | Disconnect current wallet |
| `GET` | `/api/connection-status` | Get current connection status |
| `GET` | `/api/available-wallets` | Get list of available wallets |

### Account Information

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/account-info` | Get account information |
| `POST` | `/api/switch-network` | Switch between testnet/mainnet |

### KALE Farming

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/plant-kale` | Plant KALE (staking) |
| `POST` | `/api/work-kale` | Work on KALE (proof-of-work) |
| `POST` | `/api/harvest-kale` | Harvest KALE (claim rewards) |
| `POST` | `/api/farm-kale` | Complete farming cycle |

### Mining Operations

| Method | Endpoint | Description |
|--------|----------|-------------|
| `POST` | `/api/start-mining` | Start mining loop |
| `POST` | `/api/stop-mining` | Stop mining loop |
| `GET` | `/api/stats` | Get mining statistics |
| `POST` | `/api/generate-hash` | Generate valid proof-of-work hash |

## 💻 Usage Examples

### Connect Wallet (JavaScript)

```javascript
// Connect to Albedo wallet
const response = await fetch('/api/connect-wallet', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ walletType: 'albedo' })
});

const result = await response.json();
console.log('Connected:', result.success);
```

### Plant KALE (JavaScript)

```javascript
// Plant 0 KALE (free staking)
const response = await fetch('/api/plant-kale', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ amount: 0 })
});

const result = await response.json();
console.log('Planted:', result.success);
```

### Complete Farming Cycle (JavaScript)

```javascript
// Complete farming cycle
const response = await fetch('/api/farm-kale', {
  method: 'POST',
  headers: { 'Content-Type': 'application/json' },
  body: JSON.stringify({ 
    amount: 0, 
    difficulty: 2 
  })
});

const result = await response.json();
console.log('Farming complete:', result.success);
```

## 🔐 Security Features

### Wallet Security

- **No Private Keys Stored**: Private keys never leave the user's wallet
- **Transaction Signing**: All transactions are signed by the user's wallet
- **Secure Communication**: All API calls use HTTPS in production
- **Network Validation**: Automatic network validation for all operations

### Smart Contract Security

- **XDR Validation**: All contract calls use proper XDR encoding
- **Parameter Validation**: All parameters are validated before sending
- **Error Handling**: Comprehensive error handling for all operations
- **Transaction Verification**: All transactions are verified before submission

## 🌐 Network Support

### Testnet (Default)

- **Horizon URL**: `https://horizon-testnet.stellar.org`
- **Network Passphrase**: `Test SDF Network ; September 2015`
- **Contract ID**: `CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO`
- **Asset**: `KALE:GCHPTWXMT3HYF4RLZHWBNRF4MPXLTJ76ISHMSYIWCCDXWUYOQG5MR2AB`

### Mainnet

- **Horizon URL**: `https://horizon.stellar.org`
- **Network Passphrase**: `Public Global Stellar Network ; September 2015`
- **Contract ID**: `CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA`
- **Asset**: `KALE:GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE`

## 🛠️ Development

### Running in Development Mode

```bash
# Start the development server
npm run dev

# Run the wallet demo
npm run wallet-demo

# Start the wallet server
npm run wallet-server
```

### Testing

```bash
# Run all tests
npm test

# Run wallet integration tests
npm run test:wallet

# Run farming tests
npm run test:farming
```

## 📊 Monitoring

### Real-time Statistics

The wallet integration provides real-time monitoring of:

- **Connection Status**: Current wallet connection status
- **Account Balance**: Real-time account balance updates
- **Mining Statistics**: Hash attempts, successful operations, rewards
- **Transaction History**: Complete transaction history
- **Network Status**: Current network connectivity

### Logging

All operations are logged with:

- **Timestamp**: When the operation occurred
- **Operation Type**: What operation was performed
- **Result**: Success or failure status
- **Details**: Additional operation details
- **Error Information**: Detailed error messages when failures occur

## 🔧 Configuration

### Environment Variables

```bash
# Network configuration
NETWORK=testnet  # or mainnet
HORIZON_URL=https://horizon-testnet.stellar.org

# Server configuration
PORT=3000
NODE_ENV=development

# Wallet configuration
WALLET_TIMEOUT=30000
TRANSACTION_TIMEOUT=30
```

### Wallet Configuration

```javascript
// Custom wallet configuration
const walletConfig = {
  timeout: 30000,
  retries: 3,
  network: 'testnet',
  contractId: 'CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO'
};
```

## 🐛 Troubleshooting

### Common Issues

#### Wallet Connection Failed

**Problem**: Cannot connect to wallet
**Solution**: 
1. Ensure wallet extension is installed
2. Check if wallet is unlocked
3. Verify network connection
4. Try refreshing the page

#### Transaction Failed

**Problem**: Transaction submission failed
**Solution**:
1. Check account balance
2. Verify network connectivity
3. Ensure sufficient XLM for fees
4. Check transaction parameters

#### Hash Generation Failed

**Problem**: Cannot generate valid proof-of-work hash
**Solution**:
1. Reduce difficulty level
2. Check entropy generation
3. Verify hash algorithm implementation
4. Increase timeout duration

### Debug Mode

Enable debug mode for detailed logging:

```bash
DEBUG=pixelkale:* npm run wallet
```

## 📚 Additional Resources

### Documentation

- [Stellar SDK Documentation](https://developers.stellar.org/docs)
- [Soroban Smart Contracts](https://soroban.stellar.org/docs)
- [KALE Farm Contract](https://github.com/kalepail/kale-sc)

### Community

- [Stellar Discord](https://discord.gg/stellar)
- [KALE Discord](https://discord.gg/kale)
- [PixelKale GitHub](https://github.com/Klorenn/PixelKale)

### Support

- **Issues**: [GitHub Issues](https://github.com/Klorenn/PixelKale/issues)
- **Discussions**: [GitHub Discussions](https://github.com/Klorenn/PixelKale/discussions)
- **Email**: support@pixelkale.com

## 🎉 Conclusion

PixelKale's wallet integration provides a complete, secure, and user-friendly way to farm KALE using Stellar wallets. With support for all major wallets, comprehensive API, and real-time monitoring, users can easily connect their wallets and start farming KALE immediately.

The integration is production-ready and includes all necessary security features, error handling, and monitoring capabilities to ensure a smooth farming experience.

**Happy Farming! 🥬⛏️🌾**
