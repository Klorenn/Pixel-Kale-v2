import { PasskeyKit, PasskeyServer } from 'passkey-kit';

export interface PasskeyConfig {
  rpcUrl: string;
  networkPassphrase: string;
  walletWasmHash: string;
  launchtubeUrl: string;
  launchtubeJwt: string;
  rpId?: string;
  timeoutInSeconds?: number;
}

export interface WalletResult {
  contractId: string;
  keyId: string;
  keyIdBase64: string;
  signedTx?: any;
}

export class PasskeyIntegration {
  private account: PasskeyKit;
  private server: PasskeyServer;
  private config: PasskeyConfig;

  constructor(config: PasskeyConfig) {
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
  validateJWT(jwt: string): boolean {
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
  async createWallet(name: string, description: string): Promise<WalletResult> {
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
    } catch (error: any) {
      console.error('Create wallet error:', error);
      throw new Error(`Failed to create wallet: ${error.message}`);
    }
  }

  // Conectar wallet existente
  async connectWallet(keyId: string, contractId?: string): Promise<WalletResult> {
    try {
      console.log('🔌 Connecting wallet...');
      
      const res = await this.account.connectWallet({
        keyId,
        getContractId: async (kid: string) => {
          if (contractId) return contractId;
          const pasted = window.prompt('Paste contractId for this passkey:') || '';
          if (!pasted) throw new Error('Missing contractId');
          return pasted;
        },
      } as any);

      const cid = (res as any).contractId || contractId || '';
      
      console.log(`✅ Connected: contractId=${cid}`);
      
      return {
        contractId: cid,
        keyId,
        keyIdBase64: this.toBase64Url(keyId)
      };
    } catch (error: any) {
      console.error('Connect wallet error:', error);
      throw new Error(`Failed to connect wallet: ${error.message}`);
    }
  }

  // Enviar transacción firmada
  async sendTransaction(signedTx: any): Promise<{ hash: string; ledger: number }> {
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
    } catch (error: any) {
      console.error('Send transaction error:', error);
      throw new Error(`Failed to send transaction: ${error.message}`);
    }
  }

  // Crear y enviar wallet en un solo paso
  async createAndSendWallet(name: string, description: string): Promise<WalletResult & { txHash: string; ledger: number }> {
    const wallet = await this.createWallet(name, description);
    
    if (wallet.signedTx) {
      const sendResult = await this.sendTransaction(wallet.signedTx);
      return {
        ...wallet,
        txHash: sendResult.hash,
        ledger: sendResult.ledger
      };
    }
    
    return wallet as any;
  }

  // Firmar transacción personalizada
  async signTransaction(transaction: any, keyId: string): Promise<any> {
    try {
      console.log('✍️ Signing transaction...');
      
      const signedTx = await this.account.sign(transaction, { keyId });
      
      console.log('✅ Transaction signed');
      return signedTx;
    } catch (error: any) {
      console.error('Sign transaction error:', error);
      throw new Error(`Failed to sign transaction: ${error.message}`);
    }
  }

  // Utilidades
  private toBase64Url(b64: string): string {
    return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
  }

  private fromBase64Url(u: string): string {
    let s = u.replace(/-/g, '+').replace(/_/g, '/');
    while (s.length % 4) s += '=';
    return s;
  }

  // Guardar en localStorage
  saveToStorage(keyId: string, contractId: string): void {
    const keyIdB64url = this.toBase64Url(keyId);
    localStorage.setItem('pixelkale:keyId', keyIdB64url);
    localStorage.setItem('pixelkale:contractId', contractId);
  }

  // Cargar desde localStorage
  loadFromStorage(): { keyId: string; contractId: string } | null {
    const keyIdStored = localStorage.getItem('pixelkale:keyId');
    const contractId = localStorage.getItem('pixelkale:contractId');
    
    if (!keyIdStored || !contractId) return null;
    
    return {
      keyId: this.fromBase64Url(keyIdStored),
      contractId
    };
  }

  // Limpiar storage
  clearStorage(): void {
    localStorage.removeItem('pixelkale:keyId');
    localStorage.removeItem('pixelkale:contractId');
    localStorage.removeItem('pixelkale:lt_jwt');
  }
}
