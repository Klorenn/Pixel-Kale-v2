# 🔑 Wallet Integration Guide

This guide covers wallet integration for PixelKale, including Freighter, Albedo, xBull, and Ledger support.

## 🌟 Supported Wallets

| Wallet | Type | Status | Description |
|--------|------|--------|-------------|
| **Freighter** | Browser Extension | ✅ Primary | Main wallet integration |
| **Albedo** | Browser-based | ✅ Available | Web-based wallet |
| **xBull** | Mobile | ✅ Available | Mobile wallet |
| **Ledger** | Hardware | ✅ Available | Hardware wallet |

## 🚀 Quick Start

### 1. Install Dependencies

```bash
cd PixelKale
npm install
```

### 2. Start Wallet Server

```bash
# Start Freighter integration
npm run freighter

# Or start general wallet server
npm run wallet
```

### 3. Open Web Interface

Visit `http://localhost:3000` and connect your wallet.

## 🔧 Freighter Integration

### Setup

1. **Install Freighter Extension**
   - Go to [freighter.app](https://freighter.app/)
   - Install for Chrome, Firefox, or Edge
   - Create or import wallet

2. **Configure Network**
   - Open Freighter extension
   - Switch to Testnet or Mainnet
   - Ensure you have XLM for fees

### Usage

```javascript
// Check if Freighter is available
if (typeof window.freighter !== 'undefined') {
  // Connect to Freighter
  const result = await window.freighter.connect();
  console.log('Connected:', result.publicKey);
  
  // Sign transaction
  const signedTx = await window.freighter.sign(transaction);
  
  // Disconnect
  await window.freighter.disconnect();
}
```

### API Reference

```javascript
// Connection
await window.freighter.connect()
await window.freighter.disconnect()
await window.freighter.isConnected()

// Account info
await window.freighter.getPublicKey()
await window.freighter.getNetwork()

// Transaction signing
await window.freighter.sign(transaction)
await window.freighter.signTransaction(transaction)
```

## 🌐 Albedo Integration

### Setup

1. **No Installation Required**
   - Albedo works in any browser
   - No extensions needed

2. **Configure Network**
   - Albedo automatically detects network
   - Supports both Testnet and Mainnet

### Usage

```javascript
// Check if Albedo is available
if (typeof window.albedo !== 'undefined') {
  // Connect to Albedo
  const result = await window.albedo.publicKey();
  console.log('Public Key:', result.pubkey);
  
  // Sign transaction
  const signedTx = await window.albedo.sign(transaction);
}
```

## 📱 xBull Integration

### Setup

1. **Install xBull App**
   - Download from App Store or Google Play
   - Create or import wallet

2. **Enable Deep Linking**
   - xBull uses deep links for communication
   - Ensure app is installed on device

### Usage

```javascript
// Check if xBull is available
if (typeof window.xBull !== 'undefined') {
  // Connect to xBull
  const result = await window.xBull.connect();
  console.log('Connected:', result.publicKey);
  
  // Sign transaction
  const signedTx = await window.xBull.sign(transaction);
}
```

## 🔒 Ledger Integration

### Setup

1. **Install Ledger Live**
   - Download from [ledger.com](https://ledger.com/)
   - Connect your Ledger device

2. **Install Stellar App**
   - Open Ledger Live
   - Install Stellar app on device

### Usage

```javascript
// Check if Ledger is available
if (typeof window.ledger !== 'undefined') {
  // Connect to Ledger
  const result = await window.ledger.connect();
  console.log('Connected:', result.publicKey);
  
  // Sign transaction
  const signedTx = await window.ledger.sign(transaction);
}
```

## 🔧 Implementation Details

### Wallet Detection

```javascript
class WalletDetector {
  static detectWallets() {
    const wallets = [];
    
    if (typeof window.freighter !== 'undefined') {
      wallets.push('freighter');
    }
    
    if (typeof window.albedo !== 'undefined') {
      wallets.push('albedo');
    }
    
    if (typeof window.xBull !== 'undefined') {
      wallets.push('xBull');
    }
    
    if (typeof window.ledger !== 'undefined') {
      wallets.push('ledger');
    }
    
    return wallets;
  }
}
```

### Connection Management

```javascript
class WalletManager {
  constructor() {
    this.currentWallet = null;
    this.isConnected = false;
    this.publicKey = null;
  }
  
  async connect(walletType) {
    switch (walletType) {
      case 'freighter':
        return await this.connectFreighter();
      case 'albedo':
        return await this.connectAlbedo();
      case 'xBull':
        return await this.connectXBull();
      case 'ledger':
        return await this.connectLedger();
      default:
        throw new Error('Unsupported wallet type');
    }
  }
  
  async disconnect() {
    if (this.currentWallet) {
      await this.currentWallet.disconnect();
      this.currentWallet = null;
      this.isConnected = false;
      this.publicKey = null;
    }
  }
}
```

### Transaction Signing

```javascript
class TransactionSigner {
  async signTransaction(transaction, walletType) {
    switch (walletType) {
      case 'freighter':
        return await window.freighter.sign(transaction);
      case 'albedo':
        return await window.albedo.sign(transaction);
      case 'xBull':
        return await window.xBull.sign(transaction);
      case 'ledger':
        return await window.ledger.sign(transaction);
      default:
        throw new Error('Unsupported wallet type');
    }
  }
}
```

## 🧪 Testing

### Unit Tests

```bash
# Test wallet integration
npm run test:wallet

# Test specific wallet
npm run test:freighter
npm run test:albedo
npm run test:xBull
npm run test:ledger
```

### Integration Tests

```bash
# Test with real wallets
npm run test:integration

# Test wallet switching
npm run test:wallet-switching
```

## 🔒 Security Considerations

### Private Key Protection

- **Never store private keys** in your application
- **Always use wallet APIs** for signing
- **Validate all transactions** before signing

### Network Security

- **Verify network** before connecting
- **Check transaction details** before signing
- **Use HTTPS** for all communications

### Error Handling

```javascript
try {
  const result = await wallet.connect();
  console.log('Connected:', result.publicKey);
} catch (error) {
  console.error('Connection failed:', error.message);
  // Handle error appropriately
}
```

## 🐛 Troubleshooting

### Common Issues

1. **"Wallet not found"**
   - Check if wallet extension is installed
   - Refresh page after installing
   - Check browser compatibility

2. **"Connection failed"**
   - Check if wallet is unlocked
   - Verify network settings
   - Check console for errors

3. **"Transaction failed"**
   - Check account balance
   - Verify transaction parameters
   - Check network connection

### Debug Mode

```javascript
// Enable debug logging
const DEBUG = true;

if (DEBUG) {
  console.log('Wallet detection:', WalletDetector.detectWallets());
  console.log('Current wallet:', this.currentWallet);
  console.log('Connection status:', this.isConnected);
}
```

## 📚 API Reference

### Wallet Interface

```javascript
interface Wallet {
  connect(): Promise<{publicKey: string}>;
  disconnect(): Promise<void>;
  isConnected(): Promise<boolean>;
  getPublicKey(): Promise<string>;
  sign(transaction: Transaction): Promise<Transaction>;
}
```

### Event Handling

```javascript
// Listen for wallet events
window.addEventListener('wallet-connect', (event) => {
  console.log('Wallet connected:', event.detail);
});

window.addEventListener('wallet-disconnect', (event) => {
  console.log('Wallet disconnected:', event.detail);
});
```

## 🔄 Migration Guide

### From v1 to v2

1. **Update wallet detection**
2. **Update connection methods**
3. **Update transaction signing**
4. **Test all wallet types**

### Breaking Changes

- Wallet API changes
- Connection flow updates
- Error handling improvements

## 📚 Additional Resources

- [Freighter Documentation](https://freighter.app/docs)
- [Albedo Documentation](https://albedo.link/)
- [xBull Documentation](https://xbull.app/)
- [Ledger Documentation](https://ledger.com/)

---

**Happy Wallet Integration! 🔑**


