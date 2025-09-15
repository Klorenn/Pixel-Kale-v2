# This Makefile is meant to be used with `make -C contracts/kale_farm` from the
# project root, or `make` from within the contracts/kale_farm directory.

# The name of the contract
CONTRACT_NAME = kale_farm

# The wasm file that will be produced
WASM_FILE = target/wasm32v1-none/release/soroban_$(CONTRACT_NAME)_contract.wasm

# Build the contract
.PHONY: build
build:
	cargo build --target wasm32v1-none --release

# Test the contract
.PHONY: test
test:
	cargo test

# Clean build artifacts
.PHONY: clean
clean:
	cargo clean

# Install dependencies
.PHONY: install
install:
	cargo install --path .

# Format code
.PHONY: fmt
fmt:
	cargo fmt

# Lint code
.PHONY: lint
lint:
	cargo clippy --target wasm32v1-none --release

# Deploy to testnet
.PHONY: deploy-testnet
deploy-testnet: build
	stellar contract deploy \
		--wasm $(WASM_FILE) \
		--source-account alice \
		--network testnet \
		--alias $(CONTRACT_NAME)

# Deploy to mainnet
.PHONY: deploy-mainnet
deploy-mainnet: build
	stellar contract deploy \
		--wasm $(WASM_FILE) \
		--source-account alice \
		--network mainnet \
		--alias $(CONTRACT_NAME)

# Invoke plant function
.PHONY: invoke-plant
invoke-plant:
	stellar contract invoke \
		--id $(CONTRACT_NAME) \
		--source-account alice \
		--network testnet \
		-- \
		plant \
		--farmer CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA \
		--stake-amount 1000

# Invoke work function
.PHONY: invoke-work
invoke-work:
	stellar contract invoke \
		--id $(CONTRACT_NAME) \
		--source-account alice \
		--network testnet \
		-- \
		work \
		--farmer CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA \
		--nonce 12345 \
		--zeros 3

# Invoke harvest function
.PHONY: invoke-harvest
invoke-harvest:
	stellar contract invoke \
		--id $(CONTRACT_NAME) \
		--source-account alice \
		--network testnet \
		-- \
		harvest \
		--farmer CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA \
		--farm-index 1

# Get kale balance
.PHONY: get-balance
get-balance:
	stellar contract invoke \
		--id $(CONTRACT_NAME) \
		--source-account alice \
		--network testnet \
		-- \
		get_kale_balance \
		--farmer CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA

# Get total kale
.PHONY: get-total-kale
get-total-kale:
	stellar contract invoke \
		--id $(CONTRACT_NAME) \
		--source-account alice \
		--network testnet \
		-- \
		get_total_kale

# Get farm index
.PHONY: get-farm-index
get-farm-index:
	stellar contract invoke \
		--id $(CONTRACT_NAME) \
		--source-account alice \
		--network testnet \
		-- \
		get_farm_index
