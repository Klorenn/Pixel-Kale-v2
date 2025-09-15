# 🔧 Smart Contract Guide

This guide covers the KALE farming smart contract implementation and usage.

## 📋 Overview

The KALE farming smart contract is built on Soroban and allows users to:
- Plant KALE by staking XLM
- Work on their farm to earn rewards
- Harvest KALE tokens
- Check balances and farm status

## 🏗️ Contract Structure

### Main Contract: `kale_farm`

**Location**: `contracts/kale_farm/src/lib.rs`

**Functions**:
- `plant(public_key, stake_amount)` - Start farming
- `work(public_key, hash, nonce)` - Work on farm
- `harvest(public_key, farm_index)` - Collect rewards
- `get_kale_balance(public_key)` - Check balance
- `get_farmer_status(public_key)` - Get farm status
- `get_total_kale()` - Get total KALE supply

## 🔧 Development Setup

### Prerequisites

```bash
# Install Rust
curl --proto '=https' --tlsv1.2 -sSf https://sh.rustup.rs | sh
source ~/.cargo/env

# Install Soroban CLI
cargo install --locked soroban-cli
```

### Compile Contract

```bash
# Compile for testnet
soroban contract build

# Compile for mainnet
soroban contract build --release
```

### Deploy Contract

```bash
# Deploy to testnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/kale_farm.wasm \
  --source-account YOUR_ACCOUNT \
  --network testnet

# Deploy to mainnet
soroban contract deploy \
  --wasm target/wasm32-unknown-unknown/release/kale_farm.wasm \
  --source-account YOUR_ACCOUNT \
  --network mainnet
```

## 📊 Contract Functions

### Plant KALE

```rust
pub fn plant(env: Env, public_key: Address, stake_amount: u64) -> Result<u32, Error>
```

**Parameters**:
- `public_key`: Stellar address of the farmer
- `stake_amount`: Amount of XLM to stake

**Returns**: Farm index

**Example**:
```javascript
const result = await contract.plant(
  "GARWCMCLMLEQA77CJMO6ASIZU3AG56VX7RZZ4CVX2WOLF42PYGNLBJ",
  1000
);
```

### Work KALE

```rust
pub fn work(env: Env, public_key: Address, hash: BytesN<32>, nonce: u64) -> Result<u64, Error>
```

**Parameters**:
- `public_key`: Stellar address of the farmer
- `hash`: 32-byte hash for proof of work
- `nonce`: Nonce value for hash generation

**Returns**: Rewards earned

**Example**:
```javascript
const result = await contract.work(
  "GARWCMCLMLEQA77CJMO6ASIZU3AG56VX7RZZ4CVX2WOLF42PYGNLBJ",
  hashBytes,
  12345
);
```

### Harvest KALE

```rust
pub fn harvest(env: Env, public_key: Address, farm_index: u32) -> Result<u64, Error>
```

**Parameters**:
- `public_key`: Stellar address of the farmer
- `farm_index`: Index of the farm to harvest

**Returns**: KALE tokens harvested

**Example**:
```javascript
const result = await contract.harvest(
  "GARWCMCLMLEQA77CJMO6ASIZU3AG56VX7RZZ4CVX2WOLF42PYGNLBJ",
  1
);
```

### Get KALE Balance

```rust
pub fn get_kale_balance(env: Env, public_key: Address) -> Result<u64, Error>
```

**Parameters**:
- `public_key`: Stellar address of the farmer

**Returns**: Current KALE balance

**Example**:
```javascript
const balance = await contract.get_kale_balance(
  "GARWCMCLMLEQA77CJMO6ASIZU3AG56VX7RZZ4CVX2WOLF42PYGNLBJ"
);
```

## 🌐 Network Configuration

### Testnet

```javascript
const TESTNET_CONFIG = {
  network: 'testnet',
  contractId: 'CDSWUUXGPWDZG76ISKSUCVPZJMD5YUV66J2FXFXFGDX25XKZJIEITAO',
  horizonUrl: 'https://horizon-testnet.stellar.org',
  passphrase: 'Test SDF Network ; September 2015'
};
```

### Mainnet

```javascript
const MAINNET_CONFIG = {
  network: 'mainnet',
  contractId: 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA',
  horizonUrl: 'https://horizon.stellar.org',
  passphrase: 'Public Global Stellar Network ; September 2015'
};
```

## 🧪 Testing

### Unit Tests

```bash
# Run contract tests
cargo test

# Run with output
cargo test -- --nocapture
```

### Integration Tests

```bash
# Test on testnet
npm run test:contract

# Test specific function
npm run test:plant
npm run test:work
npm run test:harvest
```

## 🔒 Security Considerations

### Input Validation

- All inputs are validated before processing
- Addresses are checked for validity
- Amounts are checked for overflow/underflow

### Access Control

- Only contract owner can modify critical parameters
- Users can only access their own data
- Farm operations are rate-limited

### Error Handling

- Comprehensive error messages
- Graceful failure handling
- Transaction rollback on errors

## 📈 Performance Optimization

### Gas Optimization

- Efficient data structures
- Minimal storage operations
- Optimized algorithms

### Memory Management

- Proper cleanup of temporary data
- Efficient memory allocation
- No memory leaks

## 🔧 Customization

### Adding New Functions

1. Define function in `lib.rs`
2. Add to contract interface
3. Update tests
4. Deploy new version

### Modifying Parameters

1. Update constants in contract
2. Recompile contract
3. Deploy to network
4. Update client code

## 📚 API Reference

### Contract Interface

```rust
pub trait KaleFarmTrait {
    fn plant(env: Env, public_key: Address, stake_amount: u64) -> Result<u32, Error>;
    fn work(env: Env, public_key: Address, hash: BytesN<32>, nonce: u64) -> Result<u64, Error>;
    fn harvest(env: Env, public_key: Address, farm_index: u32) -> Result<u64, Error>;
    fn get_kale_balance(env: Env, public_key: Address) -> Result<u64, Error>;
    fn get_farmer_status(env: Env, public_key: Address) -> Result<FarmerStatus, Error>;
    fn get_total_kale(env: Env) -> Result<u64, Error>;
}
```

### Data Types

```rust
pub struct FarmerStatus {
    pub farm_count: u32,
    pub total_staked: u64,
    pub total_earned: u64,
    pub last_work_time: u64,
}

pub struct Farm {
    pub owner: Address,
    pub stake_amount: u64,
    pub created_at: u64,
    pub last_work_time: u64,
    pub total_earned: u64,
}
```

## 🐛 Troubleshooting

### Common Issues

1. **Compilation Errors**
   - Check Rust version
   - Update dependencies
   - Check syntax

2. **Deployment Failures**
   - Check account balance
   - Verify network connection
   - Check contract size

3. **Runtime Errors**
   - Check input parameters
   - Verify account permissions
   - Check contract state

### Debug Tools

```bash
# Enable debug logging
export RUST_LOG=debug

# Run with debug info
cargo build --debug

# Check contract state
soroban contract invoke \
  --id CONTRACT_ID \
  --source-account YOUR_ACCOUNT \
  --network testnet \
  -- get_total_kale
```

## 📚 Additional Resources

- [Soroban Documentation](https://soroban.stellar.org/docs)
- [Stellar SDK](https://stellar.github.io/js-stellar-sdk/)
- [Rust Book](https://doc.rust-lang.org/book/)
- [Smart Contract Examples](https://github.com/stellar/soroban-examples)

---

**Happy Coding! 🦀**


