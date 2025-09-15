# 🥬 Top-Kale-Smart-Contract

**KALE Farming on Stellar Network with Soroban Smart Contracts**

A complete blockchain agriculture experience where users can farm KALE tokens using Stellar smart contracts, with support for multiple wallets and Launchtube integration.

## 🌟 Features

- **🌱 KALE Farming**: Plant, work, and harvest KALE tokens
- **🔑 Multi-Wallet Support**: Freighter, Albedo, xBull, and Ledger
- **🚀 Launchtube Integration**: Easy transaction submission
- **🌐 Dual Network**: Testnet and Mainnet support
- **🎮 Web Interface**: User-friendly farming interface
- **📊 Real-time Stats**: Live farming statistics and rewards

## 🚀 Quick Start

### Prerequisites

- Node.js 16+ 
- Rust (for smart contracts)
- Freighter wallet extension (optional)

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd Top-Kale-Smart-Contract

# Install dependencies
npm install

# Install Rust (if not already installed)
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
```

### Smart Contract Setup

```bash
# Compile the smart contract
cd contracts/kale_farm
cargo build --target wasm32-unknown-unknown --release

# Deploy to testnet
npm run deploy:testnet

# Deploy to mainnet
npm run deploy:mainnet
```

### Web Interface

```bash
# Start the web server
cd PixelKale
npm install
npm start
```

Visit `http://localhost:8080` to start farming!

## 📁 Project Structure

```
Top-Kale-Smart-Contract/
├── contracts/                 # Soroban smart contracts
│   └── kale_farm/            # Main KALE farming contract
├── PixelKale/                # Web interface and wallet integration
│   ├── src/                  # Source code
│   ├── scripts/              # Utility scripts
│   └── docs/                 # Documentation
├── config/                   # Network configurations
└── docs/                     # Documentation
```

## 🔧 Available Scripts

### Smart Contract
- `cargo build --target wasm32-unknown-unknown --release` - Compile smart contracts
- `npm run deploy:testnet` - Deploy to testnet
- `npm run deploy:mainnet` - Deploy to mainnet

### Web Interface
- `npm start` - Start main server
- `npm run dev` - Start development server

## 🌐 Network Configuration

### Testnet
- **Contract ID**: `CDSWUUXGPWDZG76ISKSUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO`
- **Network**: Stellar Testnet
- **Horizon**: `https://horizon-testnet.stellar.org`

### Mainnet
- **Contract ID**: `CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA`
- **Network**: Stellar Mainnet
- **Horizon**: `https://horizon.stellar.org`

## 🌱 KALE Farming

### Farming Process

1. **Plant**: Stake XLM to start a farm
2. **Work**: Generate hash and work on your farm
3. **Harvest**: Collect earned KALE tokens

### Smart Contract Functions

- `plant(public_key, stake_amount)` - Start farming
- `work(public_key, hash, nonce)` - Work on farm
- `harvest(public_key, farm_index)` - Collect rewards
- `get_kale_balance(public_key)` - Check balance

## 📚 Documentation

- [Smart Contract Guide](docs/SMART-CONTRACT.md)
- [Wallet Integration](docs/WALLET-INTEGRATION.md)
- [Deployment Guide](docs/DEPLOYMENT.md)
- [Getting Started](docs/GETTING-STARTED.md)

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests
5. Submit a pull request

## 📄 License

MIT License - see [LICENSE](LICENSE) file for details

---

**Happy Farming! 🌱🥬**