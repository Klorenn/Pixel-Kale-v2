# 🚀 Deployment Guide

This guide covers deploying the KALE farming smart contract and web interface.

## 📋 Prerequisites

- Rust installed and configured
- Soroban CLI installed
- Stellar account with XLM for fees
- Node.js 16+ for web interface

## 🔧 Smart Contract Deployment

### 1. Compile Contract

```bash
# Compile for testnet
soroban contract build

# Compile for mainnet (optimized)
soroban contract build --release
```

### 2. Deploy to Testnet

```bash
# Set testnet configuration
export STELLAR_NETWORK=testnet
export HORIZON_URL=https://horizon-testnet.stellar.org

# Deploy contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/kale_farm.wasm \
  --source-account YOUR_ACCOUNT \
  --network testnet

# Note the contract ID for later use
```

### 3. Deploy to Mainnet

```bash
# Set mainnet configuration
export STELLAR_NETWORK=mainnet
export HORIZON_URL=https://horizon.stellar.org

# Deploy contract
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/kale_farm.wasm \
  --source-account YOUR_ACCOUNT \
  --network mainnet

# Note the contract ID for later use
```

### 4. Initialize Contract

```bash
# Initialize contract with parameters
soroban contract invoke \
  --id CONTRACT_ID \
  --source-account YOUR_ACCOUNT \
  --network testnet \
  -- initialize \
  --admin YOUR_ACCOUNT
```

## 🌐 Web Interface Deployment

### 1. Build for Production

```bash
# Install dependencies
npm install

# Build web interface
npm run build
```

### 2. Deploy to Static Hosting

#### Option A: GitHub Pages

```bash
# Build and deploy to GitHub Pages
npm run deploy:gh-pages
```

#### Option B: Netlify

```bash
# Build and deploy to Netlify
npm run build
netlify deploy --prod --dir=dist
```

#### Option C: Vercel

```bash
# Deploy to Vercel
vercel --prod
```

### 3. Deploy to VPS

```bash
# Install PM2 for process management
npm install -g pm2

# Start application
pm2 start start-freighter-server.js --name pixelkale

# Save PM2 configuration
pm2 save
pm2 startup
```

## 🔧 Environment Configuration

### 1. Create Environment File

```bash
# Copy example environment
cp env.example .env

# Edit environment variables
nano .env
```

### 2. Environment Variables

```env
# Network Configuration
STELLAR_NETWORK=testnet
HORIZON_URL=https://horizon-testnet.stellar.org
CONTRACT_ID=CDSWUUXGPWDZG76ISKSUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO

# Launchtube Configuration
LAUNCHTUBE_URL=https://testnet.launchtube.xyz
LAUNCHTUBE_TOKEN=your-token-here

# Server Configuration
PORT=3000
NODE_ENV=production
```

## 🧪 Testing Deployment

### 1. Test Smart Contract

```bash
# Test contract functions
npm run test:contract

# Test on testnet
npm run test:testnet

# Test on mainnet
npm run test:mainnet
```

### 2. Test Web Interface

```bash
# Test wallet integration
npm run test:wallet

# Test API endpoints
npm run test:api

# Test end-to-end
npm run test:e2e
```

## 🔒 Security Configuration

### 1. HTTPS Setup

```bash
# Install SSL certificate
certbot --nginx -d yourdomain.com

# Configure HTTPS redirect
# Add to nginx configuration
```

### 2. CORS Configuration

```javascript
// Configure CORS for production
const corsOptions = {
  origin: ['https://yourdomain.com', 'https://www.yourdomain.com'],
  credentials: true,
  optionsSuccessStatus: 200
};
```

### 3. Rate Limiting

```javascript
// Configure rate limiting
const rateLimit = require('express-rate-limit');

const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100 // limit each IP to 100 requests per windowMs
});
```

## 📊 Monitoring

### 1. Health Checks

```bash
# Check contract health
curl https://yourdomain.com/api/health

# Check wallet integration
curl https://yourdomain.com/api/wallet/status
```

### 2. Logging

```bash
# View application logs
pm2 logs pixelkale

# View error logs
pm2 logs pixelkale --err

# View output logs
pm2 logs pixelkale --out
```

### 3. Performance Monitoring

```bash
# Monitor PM2 processes
pm2 monit

# View process information
pm2 show pixelkale
```

## 🔄 Updates and Maintenance

### 1. Update Smart Contract

```bash
# Compile new version
soroban contract build --release

# Deploy new version
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/kale_farm.wasm \
  --source-account YOUR_ACCOUNT \
  --network testnet

# Update contract ID in configuration
```

### 2. Update Web Interface

```bash
# Pull latest changes
git pull origin main

# Install new dependencies
npm install

# Build and restart
npm run build
pm2 restart pixelkale
```

### 3. Database Migration

```bash
# Run database migrations
npm run migrate

# Backup database
npm run backup:db
```

## 🐛 Troubleshooting

### Common Issues

1. **Contract Deployment Failed**
   - Check account balance
   - Verify network connection
   - Check contract size limits

2. **Web Interface Not Loading**
   - Check server status
   - Verify environment variables
   - Check port availability

3. **Wallet Connection Issues**
   - Check CORS configuration
   - Verify HTTPS setup
   - Check wallet extension

### Debug Commands

```bash
# Check contract status
soroban contract invoke \
  --id CONTRACT_ID \
  --source-account YOUR_ACCOUNT \
  --network testnet \
  -- get_total_kale

# Check server status
pm2 status

# Check logs
pm2 logs pixelkale --lines 100
```

## 📚 Additional Resources

- [Soroban Deployment Guide](https://soroban.stellar.org/docs/deploying)
- [Stellar Network Documentation](https://developers.stellar.org/)
- [PM2 Documentation](https://pm2.keymetrics.io/docs/)
- [Nginx Configuration](https://nginx.org/en/docs/)

---

**Happy Deploying! 🚀**


