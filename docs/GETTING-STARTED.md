# 🚀 Getting Started with Top-Kale-Smart-Contract

This guide will help you set up and start farming KALE tokens on the Stellar network.

## 📋 Prerequisites

Before you begin, make sure you have:

- **Node.js 16+** - [Download here](https://nodejs.org/)
- **Rust** - [Install here](https://rustup.rs/)
- **Git** - [Download here](https://git-scm.com/)
- **A Stellar wallet** - [Freighter](https://freighter.app/) recommended

## 🔧 Installation

### 1. Clone the Repository

```bash
git clone <your-repository-url>
cd Top-Kale-Smart-Contract
```

### 2. Install Dependencies

```bash
# Install Node.js dependencies
npm install

# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env
```

### 3. Verify Installation

```bash
# Check Node.js version
node --version

# Check Rust version
rustc --version

# Check npm packages
npm list
```

## 🌐 Network Setup

### Testnet (Recommended for Testing)

```bash
# Set up testnet environment
export STELLAR_NETWORK=testnet
export HORIZON_URL=https://horizon-testnet.stellar.org
export CONTRACT_ID=CDSWUUXGPWDZG76ISKSUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO
```

### Mainnet (Production)

```bash
# Set up mainnet environment
export STELLAR_NETWORK=mainnet
export HORIZON_URL=https://horizon.stellar.org
export CONTRACT_ID=CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA
```

## 🔑 Wallet Setup

### Option 1: Freighter (Recommended)

1. **Install Freighter Extension**
   - Go to [freighter.app](https://freighter.app/)
   - Install for Chrome, Firefox, or Edge
   - Create a new wallet or import existing

2. **Fund Your Wallet**
   - Get testnet XLM from [Stellar Laboratory](https://laboratory.stellar.org/#account-creator?network=testnet)
   - For mainnet, buy XLM from an exchange

3. **Connect to PixelKale**
   - Start the server: `npm run freighter`
   - Open `http://localhost:3000`
   - Click "Connect Freighter"

### Option 2: Other Wallets

- **Albedo**: Browser-based wallet
- **xBull**: Mobile wallet
- **Ledger**: Hardware wallet

## 🚀 Launchtube Setup (Optional)

Launchtube simplifies transaction submission by handling fees and network complexity.

### 1. Generate Token

```bash
node generate-launchtube-token.js
```

### 2. Activate Token

- Visit the provided activation URL
- Complete the activation process
- Copy the activated token

### 3. Use in Code

```javascript
const LAUNCHTUBE_TOKEN = "your-activated-token";
const LAUNCHTUBE_URL = 'https://launchtube.xyz';
```

## 🌱 Start Farming

### 1. Start the Server

```bash
# Start with Freighter integration
cd PixelKale
npm run freighter
```

### 2. Open Web Interface

- Go to `http://localhost:3000`
- Connect your wallet
- Start farming KALE!

### 3. Farming Process

1. **Plant KALE**: Stake XLM to start a farm
2. **Work KALE**: Generate hash and work on your farm
3. **Harvest KALE**: Collect earned KALE tokens
4. **Check Balance**: View your KALE balance

## 🧪 Testing

### Run All Tests

```bash
npm test
```

### Test Specific Components

```bash
# Test smart contracts
npm run test:contract

# Test wallet integration
npm run test:wallet

# Test Launchtube integration
npm run test:launchtube
```

## 🔧 Development

### Smart Contract Development

```bash
# Compile contracts
npm run compile

# Run tests
npm run test:contract

# Deploy to testnet
npm run deploy:testnet
```

### Web Interface Development

```bash
# Start development server
npm run dev

# Run wallet tests
npm run test:wallet
```

## 🐛 Troubleshooting

### Common Issues

1. **"Freighter wallet not found"**
   - Make sure Freighter extension is installed
   - Refresh the page after installing
   - Check if extension is enabled

2. **"Transaction failed"**
   - Ensure you have enough XLM for fees
   - Check network connection
   - Verify contract address

3. **"Compilation failed"**
   - Check Rust installation
   - Update Rust: `rustup update`
   - Check contract syntax

### Debug Mode

Enable debug logging:

```bash
# Set debug environment
export DEBUG=true
export LOG_LEVEL=debug

# Start server
npm start
```

## 📚 Next Steps

- [Smart Contract Guide](smart-contract.md)
- [Wallet Integration](wallet-integration.md)
- [API Reference](api.md)
- [Deployment Guide](deployment.md)

## 🆘 Need Help?

- Check the [FAQ](faq.md)
- Join our [Discord](https://discord.gg/stellar)
- Open an [issue](https://github.com/your-repo/issues)

---

**Happy Farming! 🌱🥬**


