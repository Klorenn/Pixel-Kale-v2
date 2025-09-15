// PasskeyKit integration for PixelKale (following do-math example exactly)
import { PasskeyKit, PasskeyServer } from "passkey-kit";

// Configuration matching the do-math example
const config = {
    rpcUrl: 'https://soroban-mainnet.stellar.org',
    networkPassphrase: 'Public Global Stellar Network ; September 2015',
    walletWasmHash: 'b62f62217ff256d557513793e9e44317b25b14401a8a6b6149a04d38d72d6c7c',
    launchtubeUrl: 'https://launchtube.xyz',
    launchtubeJwt: 'eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJzdWIiOiIyMDcwN2Q3YWJmNTUxN2MyYTZiZTA1Y2JlOGMzZjE2YmE5NTI4NGFmYWM5NDVlN2RkNmY3NTk4MTE2NWJiNTgwIiwiZXhwIjoxNzczNjI5Mjg4LCJjcmVkaXRzIjoxMDAwMDAwMDAwMCwiaWF0IjoxNzU3OTA0NDg4fQ.GVXtIm2mQfg8VrqofupCTFeKtkfCnzIBjR2DnSQQ2Sg',
    kaleContractId: 'CDL74RF5BLYR2YBLCCI7F5FB6TPSCLKEJUBSD2RSVWZ4YHF3VMFAIGWA'
};

// Initialize PasskeyKit (exactly like do-math example)
export const pk_server = new PasskeyServer({
    rpcUrl: config.rpcUrl,
    launchtubeUrl: config.launchtubeUrl,
    launchtubeJwt: config.launchtubeJwt,
});

export const pk_wallet = new PasskeyKit({
    rpcUrl: config.rpcUrl,
    networkPassphrase: config.networkPassphrase,
    walletWasmHash: config.walletWasmHash,
});

// State management
let keyId_: string = '';
let contractId_: string = '';

// Create wallet function (copied from do-math example)
export async function createWallet(): Promise<{success: boolean, keyId?: string, contractId?: string, error?: string}> {
    try {
        console.log('🔑 Creating wallet with PasskeyKit...');
        
        const { keyIdBase64, contractId, signedTx } = await pk_wallet.createWallet(
            "PixelKale",
            "KALE Farmer",
        );

        keyId_ = keyIdBase64;
        contractId_ = contractId;

        // Send wallet creation transaction
        const res = await pk_server.send(signedTx);
        console.log('✅ Wallet creation transaction sent:', res);

        // Store in localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('pixelkale:keyId', keyId_);
            localStorage.setItem('pixelkale:contractId', contractId_);
        }

        return {
            success: true,
            keyId: keyId_,
            contractId: contractId_
        };
    } catch (error) {
        console.error('❌ Create wallet failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Connect wallet function (copied from do-math example)
export async function connectWallet(keyId?: string): Promise<{success: boolean, keyId?: string, contractId?: string, error?: string}> {
    try {
        console.log('🔌 Connecting to wallet...');
        
        const targetKeyId = keyId || (typeof localStorage !== 'undefined' ? localStorage.getItem('pixelkale:keyId') : null);
        
        if (!targetKeyId) {
            throw new Error('No keyId provided');
        }

        const { keyIdBase64, contractId } = await pk_wallet.connectWallet({ keyId: targetKeyId });

        keyId_ = keyIdBase64;
        contractId_ = contractId;

        // Update localStorage
        if (typeof localStorage !== 'undefined') {
            localStorage.setItem('pixelkale:keyId', keyId_);
            localStorage.setItem('pixelkale:contractId', contractId_);
        }

        return {
            success: true,
            keyId: keyId_,
            contractId: contractId_
        };
    } catch (error) {
        console.error('❌ Connect wallet failed:', error);
        return {
            success: false,
            error: error.message
        };
    }
}

// Get current session
export function getSession() {
    return {
        keyId: keyId_,
        contractId: contractId_,
        isConnected: !!(keyId_ && contractId_)
    };
}

// Disconnect
export function disconnect() {
    keyId_ = '';
    contractId_ = '';
    
    if (typeof localStorage !== 'undefined') {
        localStorage.removeItem('pixelkale:keyId');
        localStorage.removeItem('pixelkale:contractId');
    }
}

export { config };
