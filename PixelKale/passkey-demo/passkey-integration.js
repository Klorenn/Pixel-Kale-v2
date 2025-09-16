// Real PasskeyKit Integration using @simplewebauthn/browser
import { PasskeyKit, PasskeyServer } from 'passkey-kit';
import { startRegistration, startAuthentication } from '@simplewebauthn/browser';

export class PasskeyIntegration {
  constructor(config) {
    this.config = {
      rpId: window.location.hostname,
      timeoutInSeconds: 60, // Aumentar de 30 a 60 segundos
      ...config
    };

    try {
      this.account = new PasskeyKit({
        rpcUrl: this.config.rpcUrl,
        networkPassphrase: this.config.networkPassphrase,
        walletWasmHash: this.config.walletWasmHash,
        timeoutInSeconds: this.config.timeoutInSeconds,
        WebAuthn: {
          startRegistration,
          startAuthentication
        }
      });

      this.server = new PasskeyServer({
        rpcUrl: this.config.rpcUrl,
        launchtubeUrl: this.config.launchtubeUrl,
        launchtubeJwt: this.config.launchtubeJwt,
        forwardOnChain: true,
      });
      
    } catch (error) {
      console.error('Error initializing PasskeyIntegration:', error);
      throw error;
    }
  }

  // Validar JWT
  validateJWT(jwt) {
    try {
      const parts = jwt.split('.');
      if (parts.length !== 3) return false;
      
      const payload = JSON.parse(atob(parts[1]));
      const now = Math.floor(Date.now() / 1000);
      
      if (now > payload.exp) {
        console.error('JWT expired');
        return false;
      }
      
      if (!payload.iat || typeof payload.iat !== 'number') {
        console.error('JWT has invalid iat field');
        return false;
      }
      
      return true;
    } catch (e) {
      console.error('Invalid JWT:', e);
      return false;
    }
  }

  // Crear wallet con mejor manejo de errores
  async createWallet(name, description) {
    try {
      console.log('🔑 Creating wallet...');
      
      // Verificar contexto seguro antes de proceder
      if (!window.isSecureContext && location.hostname !== 'localhost') {
        throw new Error('WebAuthn requires a secure context (HTTPS or localhost)');
      }

      // Verificar soporte de WebAuthn
      if (!window.PublicKeyCredential) {
        throw new Error('WebAuthn is not supported in this browser');
      }

      const res = await this.account.createWallet(name, description);
      
      console.log(`✅ Created wallet: contractId=${res.contractId}`);
      
      return {
        contractId: res.contractId,
        keyId: res.keyId,
        keyIdBase64: res.keyIdBase64,
        signedTx: res.signedTx
      };
    } catch (error) {
      console.error('Create wallet error:', error);
      
      // Proporcionar mensajes de error más específicos
      if (error.name === 'NotAllowedError') {
        throw new Error('Passkey creation was cancelled or not allowed. Make sure you have a passkey device configured.');
      } else if (error.name === 'NotSupportedError') {
        throw new Error('WebAuthn is not supported in this browser. Use Chrome 67+, Firefox 60+, Safari 13+, or Edge 18+.');
      } else if (error.name === 'InvalidStateError') {
        throw new Error('Invalid state for passkey creation. Try refreshing the page.');
      } else if (error.name === 'TimeoutError') {
        throw new Error('Passkey creation timed out. Please try again.');
      } else if (error.message.includes('secure context')) {
        throw new Error('WebAuthn requires a secure context. Use HTTPS or localhost.');
      } else {
        throw new Error(`Failed to create wallet: ${error.message}`);
      }
    }
  }

  // Conectar wallet existente
  async connectWallet(keyId, contractId) {
    try {
      console.log('🔌 Connecting wallet...');
      
      const res = await this.account.connectWallet({
        keyId,
        getContractId: async (kid) => {
          if (contractId) return contractId;
          const pasted = window.prompt('Paste contractId for this passkey:') || '';
          if (!pasted) throw new Error('Missing contractId');
          return pasted;
        },
      });

      const cid = res.contractId || contractId || '';
      
      console.log(`✅ Connected: contractId=${cid}`);
      
      return {
        contractId: cid,
        keyId,
        keyIdBase64: this.toBase64Url(keyId)
      };
    } catch (error) {
      console.error('Connect wallet error:', error);
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  // Enviar transacción firmada
  async sendTransaction(signedTx) {
    try {
      if (!this.config.launchtubeJwt) {
        throw new Error('Missing Launchtube JWT');
      }

      if (!this.validateJWT(this.config.launchtubeJwt)) {
        throw new Error('Invalid or expired JWT');
      }

      console.log('📤 Sending transaction via Launchtube...');
      
      const result = await this.server.send(signedTx);
      
      console.log(`✅ Sent: hash=${result.hash}`);
      return result;
    } catch (error) {
      console.error('Send transaction error:', error);
      throw new Error(`Failed to send transaction: ${error.message}`);
    }
  }

  // Crear y enviar wallet en un solo paso
  async createAndSendWallet(name, description) {
    const wallet = await this.createWallet(name, description);
    
    if (wallet.signedTx) {
      const sendResult = await this.sendTransaction(wallet.signedTx);
      return {
        ...wallet,
        txHash: sendResult.hash,
        ledger: sendResult.ledger
      };
    }
    
    return wallet;
  }

  // Firmar transacción personalizada
  async signTransaction(transaction, keyId) {
    try {
      console.log('✍️ Signing transaction...');
      
      const signedTx = await this.account.sign(transaction, { keyId });
      
      console.log('✅ Transaction signed');
      return signedTx;
    } catch (error) {
      console.error('Sign transaction error:', error);
      throw new Error(`Failed to sign transaction: ${error.message}`);
    }
  }

  // Utilidades
  toBase64Url(b64) {
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  fromBase64Url(u) {
    let s = u.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return s;
  }

  // Guardar en localStorage
  saveToStorage(keyId, contractId) {
    const keyIdB64url = this.toBase64Url(keyId);
    localStorage.setItem('pixelkale:keyId', keyIdB64url);
    localStorage.setItem('pixelkale:contractId', contractId);
  }

  // Cargar desde localStorage
  loadFromStorage() {
    const keyIdStored = localStorage.getItem('pixelkale:keyId');
    const contractId = localStorage.getItem('pixelkale:contractId');
    
    if (!keyIdStored || !contractId) return null;
    
    return {
      keyId: this.fromBase64Url(keyIdStored),
      contractId
    };
  }

  // Limpiar storage
  clearStorage() {
    localStorage.removeItem('pixelkale:keyId');
    localStorage.removeItem('pixelkale:contractId');
    localStorage.removeItem('pixelkale:lt_jwt');
  }

  // Verificar soporte de passkey (método estático)
  static async hasPasskeySupport() {
    try {
      return !!(
        typeof window !== 'undefined' &&
        'PublicKeyCredential' in window &&
        typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function' &&
        await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
      );
    } catch (e) {
      console.error('Error checking passkey support:', e);
      return false;
    }
  }
}

// Función utilitaria exportada para verificar soporte de passkey
export async function hasPasskeySupport() {
  try {
    return !!(
      typeof window !== 'undefined' &&
      'PublicKeyCredential' in window &&
      typeof PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable === 'function' &&
      await PublicKeyCredential.isUserVerifyingPlatformAuthenticatorAvailable()
    );
  } catch (e) {
    console.error('Error checking passkey support:', e);
    return false;
  }
}
