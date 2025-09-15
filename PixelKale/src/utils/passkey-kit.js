// PasskeyKit integration for PixelKale
// Based on kalepail do-math demo implementation
require('dotenv').config();

// Note: PasskeyKit is designed for browser/TypeScript environments
// For server-side usage, we'll create a simplified version that manages state
// The actual passkey operations will happen in the browser/frontend

// Configuration from environment
const config = {
    rpcUrl: process.env.PUBLIC_RPC_URL || 'https://soroban-mainnet.stellar.org',
    networkPassphrase: process.env.PUBLIC_NETWORK_PASSPHRASE || 'Public Global Stellar Network ; September 2015',
    walletWasmHash: process.env.PUBLIC_WALLET_WASM_HASH || '',
    launchtubeUrl: process.env.PUBLIC_LAUNCHTUBE_URL || 'https://launchtube.xyz',
    launchtubeJwt: process.env.PUBLIC_LAUNCHTUBE_JWT || '',
    kaleContractId: process.env.PUBLIC_KALE_CONTRACT_ID || 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA'
};

class PixelKalePasskey {
    constructor() {
        this.keyId = null;
        this.contractId = null;
        this.isConnected = false;
        this.sessions = new Map(); // Store multiple sessions
    }

    // Get configuration for frontend
    getConfig() {
        return {
            rpcUrl: config.rpcUrl,
            networkPassphrase: config.networkPassphrase,
            walletWasmHash: config.walletWasmHash,
            launchtubeUrl: config.launchtubeUrl,
            kaleContractId: config.kaleContractId
        };
    }

    // Store wallet session (called from frontend after passkey creation)
    storeSession(sessionData) {
        const { keyId, contractId, appName = 'PixelKale' } = sessionData;
        
        if (!keyId || !contractId) {
            return {
                success: false,
                error: 'keyId and contractId are required'
            };
        }

        // Store in memory (in production, use Redis or database)
        this.sessions.set(keyId, {
            keyId,
            contractId,
            appName,
            createdAt: new Date(),
            lastUsed: new Date()
        });

        // Set as current session
        this.keyId = keyId;
        this.contractId = contractId;
        this.isConnected = true;

        console.log('✅ Session stored successfully!');
        console.log(`   KeyId: ${keyId}`);
        console.log(`   Contract ID: ${contractId}`);

        return {
            success: true,
            keyId,
            contractId
        };
    }

    // Connect to existing session
    connectSession(keyId) {
        if (!keyId) {
            return {
                success: false,
                error: 'keyId is required'
            };
        }

        const session = this.sessions.get(keyId);
        if (!session) {
            return {
                success: false,
                error: 'Session not found'
            };
        }

        // Set as current session
        this.keyId = session.keyId;
        this.contractId = session.contractId;
        this.isConnected = true;

        // Update last used
        session.lastUsed = new Date();
        this.sessions.set(keyId, session);

        console.log('✅ Connected to session successfully!');
        console.log(`   KeyId: ${this.keyId}`);
        console.log(`   Contract ID: ${this.contractId}`);

        return {
            success: true,
            keyId: this.keyId,
            contractId: this.contractId
        };
    }

    // Disconnect current session
    disconnect() {
        this.keyId = null;
        this.contractId = null;
        this.isConnected = false;

        console.log('✅ Session disconnected');
        return { success: true };
    }

    // Get connection status
    getStatus() {
        return {
            isConnected: this.isConnected,
            keyId: this.keyId,
            contractId: this.contractId,
            config: this.getConfig()
        };
    }

    // List all sessions (for debugging)
    listSessions() {
        const sessions = Array.from(this.sessions.values());
        return {
            success: true,
            sessions: sessions.map(s => ({
                keyId: s.keyId,
                contractId: s.contractId,
                appName: s.appName,
                createdAt: s.createdAt,
                lastUsed: s.lastUsed
            })),
            currentSession: {
                keyId: this.keyId,
                contractId: this.contractId,
                isConnected: this.isConnected
            }
        };
    }
}

// Export singleton instance and classes
const pixelkalePasskey = new PixelKalePasskey();

module.exports = {
    PixelKalePasskey,
    pixelkalePasskey,
    config
};
