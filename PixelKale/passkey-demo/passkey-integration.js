// Exact PasskeyKit Integration - Converted from TypeScript to JavaScript
import { PasskeyKit, PasskeyServer } from 'passkey-kit';

export class PasskeyIntegration {
  constructor(config) {
    this.config = {
      rpId: window.location.hostname,
      timeoutInSeconds: 30,
      ...config
    };

    this.account = new PasskeyKit({
      rpcUrl: this.config.rpcUrl,
      networkPassphrase: this.config.networkPassphrase,
      walletWasmHash: this.config.walletWasmHash,
      rpId: this.config.rpId,
      timeoutInSeconds: this.config.timeoutInSeconds,
    });

    this.server = new PasskeyServer({
      rpcUrl: this.config.rpcUrl,
      launchtubeUrl: this.config.launchtubeUrl,
      launchtubeJwt: this.config.launchtubeJwt,
      forwardOnChain: true,
    });
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

  // Crear wallet con passkey
  async createWallet(name, description) {
    try {
      console.log('🔑 Creating wallet...');
      
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
      throw new Error(`Failed to create wallet: ${error.message}`);
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
}
