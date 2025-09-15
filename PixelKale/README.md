# 🌱 PixelKale - KaleCraft

**PixelKale** is the first immersive blockchain agriculture experience on Stellar. Players cultivate, mine, and harvest KALE tokens while enjoying a modern pixel art interface with dynamic day/night themes. It combines real blockchain technology with an interactive and addictive farming game.

> **Inspired by Ben Wallet's ecosystem** - Built on the same KALE infrastructure with enhanced gaming mechanics

## 🎮 Features

- **🌾 Real Blockchain Farming**: Interact with actual KALE smart contracts on Stellar
- **🎨 Pixel Art Interface**: Modern, retro-inspired graphics with dynamic themes
- **🌅 Day/Night Cycle**: Dynamic visual themes that change throughout the day
- **⛏️ Mining Mechanics**: Proof-of-work style mining for KALE tokens
- **🌱 Cultivation System**: Plant, grow, and harvest virtual crops
- **💰 Token Rewards**: Earn real KALE tokens through gameplay
- **🔗 Stellar Integration**: Built on the Stellar blockchain using Soroban smart contracts

## 🚀 Getting Started

### Prerequisites

- Node.js 16+ 
- npm or yarn
- Stellar account with XLM for transaction fees
- KALE tokens for farming (optional, can start with 0)

### Installation

```bash
# Clone the repository
git clone https://github.com/Klorenn/PixelKale.git
cd PixelKale

# Install dependencies
npm install

# Start the development server
npm start
```

### Configuration

1. **Set up your Stellar account**:
   ```bash
   # Create a new account
   stellar keys generate --global player
   
   # Fund your account (testnet)
   stellar keys fund player --network testnet
   ```

2. **Configure the game**:
   - Edit `config/network.js` to set your preferred network
   - Add your account details in `config/account.js`

## 🎯 Gameplay

### Farming Process

1. **🌱 Plant**: Stake KALE tokens to start farming
2. **⛏️ Work**: Mine for blocks using proof-of-work
3. **🌾 Harvest**: Collect your KALE rewards

### Smart Contract Integration

The game integrates with the official KALE ecosystem contracts:

- **KALE Homestead (Mainnet)**: `CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA`
- **KALE Tractor**: `CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3`
- **KALE SAC Contract**: `CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV`
- **Testnet Contract**: `CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO`

## 🛠️ Development

### Project Structure

```
PixelKale/
├── src/
│   ├── components/     # React components
│   ├── game/          # Game logic and mechanics
│   ├── blockchain/    # Stellar/Soroban integration
│   ├── assets/        # Images, sounds, sprites
│   └── utils/         # Helper functions
├── config/            # Configuration files
├── docs/              # Documentation
└── tests/             # Test files
```

### Available Scripts

```bash
# Development
npm start              # Start development server
npm run build          # Build for production
npm run test           # Run tests

# Blockchain
npm run deploy         # Deploy smart contracts
npm run fund           # Fund test accounts
npm run farm           # Run farming simulation
```

## 🔧 Blockchain Integration

### KALE Farm Contract

The game uses the official KALE Farm smart contract for all farming operations:

```javascript
// Example usage
import { KaleFarmSDK } from './src/blockchain/kale-farm-sdk.js';

const sdk = new KaleFarmSDK('testnet');
await sdk.setAccount(publicKey, secretKey);

// Plant KALE
await sdk.plantKale(1000);

// Work on the farm
await sdk.workKale(nonce, hash);

// Harvest rewards
await sdk.harvestKale(farmIndex);
```

### Network Configuration

```javascript
const NETWORKS = {
  testnet: {
    contractId: 'CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO',
    assetCode: 'KALE',
    assetIssuer: 'GCHPTWXMT3HYF4RLZHWBNRF4MPXLTJ76ISHMSYIWCCDXWUYOQG5MR2AB'
  },
  mainnet: {
    contractId: 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA',
    assetCode: 'KALE',
    assetIssuer: 'GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE'
  }
};
```

## 🎨 Art & Design

### Pixel Art Style

- **16x16 pixel sprites** for characters and items
- **Retro color palette** inspired by classic farming games
- **Smooth animations** with pixel-perfect movement
- **Dynamic lighting** for day/night cycles

### Themes

- **🌅 Day Theme**: Bright, cheerful colors
- **🌙 Night Theme**: Dark, mysterious atmosphere
- **🌧️ Weather Effects**: Rain, snow, and seasonal changes

## 📊 Tokenomics

### KALE Token

- **Total Supply**: 500M KALE (capped)
- **Emission Rate**: 500 KALE per minute
- **Decay Rate**: 5% monthly compounding
- **Farming Rewards**: Distributed based on stake, work, and timing

### Game Economy

- **Planting**: Stake KALE tokens to start farming
- **Mining**: Use CPU power to generate valid hashes
- **Harvesting**: Collect rewards based on contribution
- **Risk/Reward**: Higher stakes = higher rewards but more risk

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

### Development Setup

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🔗 Links

- **Game**: [kalefarm.xyz](https://kalefarm.xyz)
- **Stellar Expert**: [View Contract](https://stellar.expert/explorer/testnet/contract/CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO)
- **Discord**: [Join the Community](https://discord.gg/stellar)
- **Twitter**: [@PixelKale](https://twitter.com/PixelKale)

## 🙏 Acknowledgments

- **KALE Farm Contract**: [kalepail/KALE-sc](https://github.com/kalepail/KALE-sc)
- **Ben Wallet Ecosystem**: [Ben Wallet Architecture](https://ben-wallet.gitbook.io/ben-wallet/sdlc/development/architecture/context) for KALE infrastructure inspiration
- **Launchtube API**: [launchtube.xyz](https://launchtube.xyz/) for blockchain integration
- **Stellar Foundation**: For the amazing blockchain platform
- **Community**: All the farmers and developers who make this possible

---

**Happy Farming! 🌱⛏️🌾**

*Built with ❤️ on Stellar*