# Top-Kale-Smart-Contract Makefile

.PHONY: build clean deploy test install

# Build the smart contract
build:
	cd contracts/kale_farm && cargo build --target wasm32-unknown-unknown --release

# Clean build artifacts
clean:
	cargo clean
	rm -rf target/
	rm -rf PixelKale/node_modules/
	rm -rf node_modules/

# Install all dependencies
install:
	npm install
	cd PixelKale && npm install

# Deploy to testnet
deploy-testnet:
	cd PixelKale && node scripts/deploy-contracts.js testnet

# Deploy to mainnet
deploy-mainnet:
	cd PixelKale && node scripts/deploy-contracts.js mainnet

# Start the web interface
start:
	cd PixelKale && npm start

# Run tests
test:
	cd PixelKale && npm test

# Development mode
dev:
	cd PixelKale && npm run dev

# Full setup
setup: install build
	@echo "✅ Setup complete! Run 'make start' to begin farming."

# Help
help:
	@echo "Available commands:"
	@echo "  build          - Build the smart contract"
	@echo "  clean          - Clean all build artifacts"
	@echo "  install        - Install all dependencies"
	@echo "  deploy-testnet - Deploy to testnet"
	@echo "  deploy-mainnet - Deploy to mainnet"
	@echo "  start          - Start the web interface"
	@echo "  test           - Run tests"
	@echo "  dev            - Start in development mode"
	@echo "  setup          - Full setup (install + build)"
	@echo "  help           - Show this help"


