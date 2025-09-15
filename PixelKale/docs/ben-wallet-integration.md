# 🔗 Ben Wallet Integration

## Overview

PixelKale is built on the same KALE infrastructure as [Ben Wallet](https://ben-wallet.gitbook.io/ben-wallet/sdlc/development/architecture/context), leveraging their established ecosystem for enhanced functionality.

## KALE Ecosystem Contracts

### Mainnet Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| **KALE Homestead** | `CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA` | Main farming contract |
| **KALE Tractor** | `CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3` | Farming automation |
| **KALE SAC** | `CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV` | Stellar Asset Contract |

### Testnet Contracts

| Contract | Address | Purpose |
|----------|---------|---------|
| **KALE Farm** | `CDSWUUXGPWDZG76ISK6SUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO` | Test farming contract |
| **KALE SAC** | `CAAVU2UQJLMZ3GUZFM56KVNHLPA3ZSSNR4VP2U53YBXFD2GI3QLIVHZZ` | Test SAC contract |

## Launchtube Integration

### API Endpoints

- **Base URL**: `https://launchtube.xyz/`
- **Purpose**: Blockchain transaction relaying and account management
- **Features**: Passkey authentication, transaction signing, account funding

### Integration Benefits

1. **Simplified Authentication**: Passkey-based login
2. **Transaction Relaying**: No need for direct blockchain interaction
3. **Account Management**: Automatic account creation and funding
4. **Cross-Platform**: Works on mobile and web

## PixelKale Enhancements

### Gaming Layer

While Ben Wallet focuses on wallet functionality, PixelKale adds:

- **🎮 Interactive Farming**: Visual farming interface
- **🎨 Pixel Art**: Retro gaming aesthetics
- **🌅 Day/Night Cycles**: Dynamic visual themes
- **⛏️ Mining Mechanics**: Proof-of-work gameplay
- **🏆 Achievement System**: Gamified progression

### Technical Integration

```javascript
// Example: Using Ben Wallet's KALE infrastructure
const sdk = new KaleFarmSDK('mainnet');
await sdk.setAccount(publicKey, secretKey);

// Access different KALE contracts
const homestead = sdk.networkConfig.homestead;
const tractor = sdk.networkConfig.tractor;
const sac = sdk.networkConfig.sac;

// Use Launchtube for transactions
const launchtube = sdk.networkConfig.launchtube;
```

## Shared Infrastructure

### KALE Token

- **Asset Code**: `KALE`
- **Issuer**: `GBDVX4VELCDSQ54KQJYTNHXAHFLBCA77ZY2USQBM4CSHTTV7DME7KALE`
- **Network**: Stellar Mainnet
- **Type**: Stellar Asset Contract (SAC)

### Stellar Network

- **Mainnet**: `https://horizon.stellar.org`
- **Testnet**: `https://horizon-testnet.stellar.org`
- **Protocol**: Stellar Protocol 23
- **Smart Contracts**: Soroban

## Development Workflow

### 1. Setup

```bash
# Clone PixelKale
git clone https://github.com/Klorenn/PixelKale.git
cd PixelKale

# Install dependencies
npm install

# Configure environment
cp env.example .env
```

### 2. Network Configuration

```javascript
// Use Ben Wallet's network configuration
const NETWORKS = {
  mainnet: {
    homestead: 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA',
    tractor: 'CBGSBKYMYO6OMGHQXXNOBRGVUDFUDVC2XLC3SXON5R2SNXILR7XCKKY3',
    sac: 'CB23WRDQWGSP6YPMY4UV5C4OW5CBTXKYN3XEATG7KJEZCXMJBYEHOUOV',
    launchtube: 'https://launchtube.xyz/'
  }
};
```

### 3. Testing

```bash
# Test with testnet
npm run test:testnet

# Test with mainnet (requires KALE tokens)
npm run test:mainnet

# Test Launchtube integration
npm run test:launchtube
```

## Benefits of Integration

### For Users

1. **Familiar Interface**: Same KALE ecosystem as Ben Wallet
2. **Seamless Transfers**: Easy movement between wallet and game
3. **Proven Security**: Battle-tested infrastructure
4. **Cross-Platform**: Works on all devices

### For Developers

1. **Established Infrastructure**: No need to build from scratch
2. **Community Support**: Large user base already familiar
3. **Documentation**: Comprehensive guides available
4. **API Integration**: Easy to implement and maintain

## Future Enhancements

### Planned Features

1. **Ben Wallet Mobile App Integration**: Direct connection to mobile wallet
2. **MyBen WebApp Integration**: Web-based account management
3. **Ben RPC Integration**: Enhanced blockchain interaction
4. **Ben OpenStats Integration**: Analytics and statistics

### Roadmap

- **Q1 2025**: Basic Ben Wallet integration
- **Q2 2025**: Mobile app connectivity
- **Q3 2025**: Advanced analytics integration
- **Q4 2025**: Full ecosystem integration

## Resources

- **Ben Wallet Documentation**: [https://ben-wallet.gitbook.io/ben-wallet/](https://ben-wallet.gitbook.io/ben-wallet/)
- **KALE Contract Source**: [https://github.com/kalepail/KALE-sc](https://github.com/kalepail/KALE-sc)
- **Launchtube API**: [https://launchtube.xyz/](https://launchtube.xyz/)
- **Stellar Documentation**: [https://developers.stellar.org/](https://developers.stellar.org/)

---

**Built on the shoulders of giants** - PixelKale leverages Ben Wallet's proven KALE infrastructure to create the ultimate blockchain farming experience.
