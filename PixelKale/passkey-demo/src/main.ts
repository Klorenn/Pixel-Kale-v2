import { PasskeyKit, PasskeyServer } from 'passkey-kit';

const config = {
  rpcUrl: 'https://soroban-mainnet.stellar.org',
  networkPassphrase: 'Public Global Stellar Network ; September 2015',
  // Passkey wallet WASM hash known on mainnet (from official demo)
  walletWasmHash: 'ecd990f0b45ca6817149b6175f79b32efb442f35731985a084131e8265c4cd90',
  // Prefer official mainnet domain to avoid CORS issues
  launchtubeUrl: (import.meta as any).env?.VITE_LAUNCHTUBE_URL || 'https://launchtube.xyz',
  launchtubeJwt: (import.meta as any).env?.VITE_LAUNCHTUBE_JWT || localStorage.getItem('pixelkale:lt_jwt') || '',
};

const account = new PasskeyKit({
  rpcUrl: config.rpcUrl,
  networkPassphrase: config.networkPassphrase,
  walletWasmHash: config.walletWasmHash,
  // Configure rpId for WebAuthn to work with public domains
  rpId: window.location.hostname,
  timeoutInSeconds: 30,
});

// Verificar configuración WebAuthn
function validateWebAuthnConfig() {
  const rpId = window.location.hostname;
  const origin = window.location.origin;
  const isHttps = window.location.protocol === 'https:';
  const isLocalhost = rpId === 'localhost' || rpId === '127.0.0.1';
  
  appendLog('INFO', `WebAuthn Config Check:`);
  appendLog('INFO', `  rpId: ${rpId}`);
  appendLog('INFO', `  origin: ${origin}`);
  appendLog('INFO', `  isHttps: ${isHttps}`);
  appendLog('INFO', `  isLocalhost: ${isLocalhost}`);
  
  if (!isHttps && !isLocalhost) {
    appendLog('ERROR', 'WebAuthn requires HTTPS or localhost');
    return false;
  }
  
  if (rpId !== window.location.hostname) {
    appendLog('ERROR', `rpId mismatch: ${rpId} vs ${window.location.hostname}`);
    return false;
  }
  
  appendLog('INFO', '✅ WebAuthn configuration is valid');
  return true;
}

// Ejecutar validación al cargar
validateWebAuthnConfig();

function validateJWT(jwt: string): boolean {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) return false;
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (now > payload.exp) {
      appendLog('ERROR', 'JWT expired');
      return false;
    }
    
    if (!payload.iat || typeof payload.iat !== 'number') {
      appendLog('ERROR', 'JWT has invalid iat field');
      return false;
    }
    
    return true;
  } catch (e) {
    appendLog('ERROR', `Invalid JWT: ${e}`);
    return false;
  }
}

if (!config.launchtubeJwt) {
  const pasted = window.prompt('Paste Launchtube JWT (only needed once, stored locally):') || '';
  if (pasted) {
    if (validateJWT(pasted)) {
      localStorage.setItem('pixelkale:lt_jwt', pasted);
      config.launchtubeJwt = pasted;
      appendLog('INFO', 'JWT stored successfully');
    } else {
      appendLog('ERROR', 'Invalid JWT provided. Please get a new one from https://launchtube.xyz/gen');
      alert('JWT inválido. Por favor, obtén uno nuevo desde https://launchtube.xyz/gen');
    }
  }
} else if (!validateJWT(config.launchtubeJwt)) {
  appendLog('ERROR', 'Stored JWT is invalid or expired. Clearing all stored data...');
  localStorage.removeItem('pixelkale:lt_jwt');
  localStorage.removeItem('pixelkale:keyId');
  localStorage.removeItem('pixelkale:contractId');
  config.launchtubeJwt = '';
  alert('JWT almacenado es inválido o expirado. Se ha limpiado el estado. Por favor, obtén un nuevo JWT.');
}

const server = new PasskeyServer({
  rpcUrl: config.rpcUrl,
  launchtubeUrl: config.launchtubeUrl,
  launchtubeJwt: config.launchtubeJwt,
  // forwardOnChain instructs Launchtube to fetch WASM and submit onchain
  forwardOnChain: true,
});

const out = document.getElementById('out') as HTMLDivElement;
const logPanel = document.getElementById('logPanel') as HTMLPreElement;
const verboseChk = document.getElementById('verbose') as HTMLInputElement;
const clearBtn = document.getElementById('clearLogs') as HTMLButtonElement;
const copyBtn = document.getElementById('copyLogs') as HTMLButtonElement;

function appendLog(kind: 'INFO'|'WARN'|'ERROR', msg: string) {
  const line = `[${new Date().toISOString()}] [${kind}] ${msg}`;
  if (logPanel) {
    logPanel.textContent = (logPanel.textContent || '') + '\n' + line;
    logPanel.scrollTop = logPanel.scrollHeight;
  }
  if (kind === 'ERROR') console.error(msg); else if (kind === 'WARN') console.warn(msg); else console.log(msg);
}

function log(msg: string) {
  out.textContent = msg;
  appendLog('INFO', msg);
}

function errToString(e: unknown): string {
  if (!e) return 'Unknown error';
  if (typeof e === 'string') return e;
  // Handle DOMException separately (WebAuthn errors)
  if (typeof (window as any).DOMException !== 'undefined' && e instanceof (window as any).DOMException) {
    const de = e as DOMException;
    if (verboseChk?.checked) appendLog('ERROR', `DOMException object: ${JSON.stringify({ name: de.name, message: de.message })}`);
    return `DOMException ${de.name}: ${de.message || 'No message'}`;
  }
  if (e instanceof Error) {
    const base = e.message || Object.prototype.toString.call(e);
    try {
      const extra = JSON.stringify(e as any, Object.getOwnPropertyNames(e));
      if (verboseChk?.checked) appendLog('ERROR', `Error object: ${extra}`);
      return extra && extra !== '""' ? `${base} | ${extra}` : base;
    } catch {
      return base;
    }
  }
  try { return JSON.stringify(e as any); } catch { return String(e); }
}

// JWT validation function
function validateJWT(jwt: string): boolean {
  try {
    const parts = jwt.split('.');
    if (parts.length !== 3) {
      appendLog('ERROR', 'JWT must have 3 parts');
      return false;
    }
    
    const payload = JSON.parse(atob(parts[1]));
    const now = Math.floor(Date.now() / 1000);
    
    if (now > payload.exp) {
      appendLog('ERROR', `JWT expired at ${new Date(payload.exp * 1000).toISOString()}`);
      return false;
    }
    
    if (!payload.iat || typeof payload.iat !== 'number') {
      appendLog('ERROR', 'JWT has invalid iat field');
      return false;
    }
    
    if (!payload.sub || !payload.credits) {
      appendLog('ERROR', 'JWT missing required fields (sub, credits)');
      return false;
    }
    
    appendLog('INFO', `JWT valid - expires: ${new Date(payload.exp * 1000).toISOString()}, credits: ${payload.credits}`);
    return true;
  } catch (e) {
    appendLog('ERROR', `Invalid JWT: ${e}`);
    return false;
  }
}

// base64url helpers for storing keyId like in docs
function toBase64Url(b64: string): string {
  return b64.replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '');
}
function fromBase64Url(u: string): string {
  let s = u.replace(/-/g, '+').replace(/_/g, '/');
  while (s.length % 4) s += '=';
  return s;
}

(document.getElementById('create') as HTMLButtonElement).onclick = async () => {
  try {
    log('🔑 Creating wallet...');
    appendLog('INFO', `WebAuthn config: rpId=${window.location.hostname}, origin=${window.location.origin}`);
    
    let res;
    try {
      res = await account.createWallet('PixelKale', 'KALE Farmer');
    } catch (inner:any) {
      console.error('createWallet error object:', inner);
      const errorMsg = errToString(inner);
      if (/NotAllowedError|NotSupportedError|SecurityError/i.test(errorMsg)) {
        appendLog('ERROR', `WebAuthn error: ${errorMsg}. Ensure you're on HTTPS and using a supported browser.`);
      } else if (/InvalidStateError/i.test(errorMsg)) {
        appendLog('ERROR', `WebAuthn error: ${errorMsg}. Try refreshing the page and try again.`);
      }
      throw inner;
    }
    log(`✅ Created wallet: contractId=${res.contractId}`);
    if (res.signedTx) {
      if (!config.launchtubeJwt) {
        appendLog('ERROR', 'Missing Launchtube JWT. Set VITE_LAUNCTHUBE_JWT in .env or store it locally.');
        throw new Error('Missing Launchtube JWT');
      }
      // Recreate server to ensure latest JWT is used
      const srv = new PasskeyServer({
        rpcUrl: config.rpcUrl,
        launchtubeUrl: config.launchtubeUrl,
        launchtubeJwt: config.launchtubeJwt,
        forwardOnChain: true,
      });
      appendLog('INFO', `Launchtube config → url=${config.launchtubeUrl}, jwtPresent=${!!config.launchtubeJwt}`);
      log('📤 Sending creation transaction via Launchtube...');
      let sent;
      try {
        sent = await srv.send(res.signedTx);
      } catch (sendErr:any) {
        console.error('server.send error object:', sendErr);
        const s = errToString(sendErr);
        if (/INVALID_SIGNATURE/.test(s)) {
          appendLog('ERROR', 'INVALID_SIGNATURE: JWT inválido o expirado. Limpiando estado...');
          // Limpiar estado automáticamente
          localStorage.removeItem('pixelkale:lt_jwt');
          localStorage.removeItem('pixelkale:keyId');
          localStorage.removeItem('pixelkale:contractId');
          config.launchtubeJwt = '';
          alert('JWT inválido detectado. Estado limpiado. Por favor, obtén un nuevo JWT y vuelve a intentar.');
        }
        if (/split\'\)/i.test(s) || /reading 'split'/i.test(s)) {
          appendLog('ERROR', 'Server error reading Authorization header. Confirma que el JWT llegue como Authorization: Bearer <token>.');
        }
        if (/401|Unauthorized/i.test(s)) {
          appendLog('ERROR', 'JWT no autorizado. Verifica que el token esté activado en Launchtube.');
        }
        throw sendErr;
      }
      log(`✅ Sent: hash=${sent.hash}`);
    }
    const keyIdB64url = toBase64Url(res.keyIdBase64);
    localStorage.setItem('pixelkale:keyId', keyIdB64url);
    localStorage.setItem('pixelkale:contractId', res.contractId);
  } catch (e:any) {
    const msg = errToString(e);
    console.error('Create failed full object:', e);
    if (/Failed to fetch/i.test(msg)) {
      log('❌ Create failed: Failed to fetch (verifica JWT de Launchtube y conectividad HTTPS).');
    } else {
      log(`❌ Create failed: ${msg}`);
    }
  }
};

(document.getElementById('connect') as HTMLButtonElement).onclick = async () => {
  try {
    const keyIdStored = localStorage.getItem('pixelkale:keyId');
    const keyId = keyIdStored ? fromBase64Url(keyIdStored) : '';
    if (!keyId) return log('❌ No saved keyId');
    log('🔌 Connecting wallet...');

    // Try to resolve contractId locally or by asking the user
    let localContractId = localStorage.getItem('pixelkale:contractId') || '';
    const res = await account.connectWallet({
      keyId,
      // If PasskeyKit supports getContractId, provide a resolver
      // Fall back to local saved contract id or prompt
      // @ts-ignore - optional hook depending on kit version
      getContractId: async (kid: string) => {
        if (localContractId) return localContractId;
        const pasted = window.prompt('Paste contractId for this passkey (optional if already saved):') || '';
        if (!pasted) throw new Error('Missing contractId resolver');
        localContractId = pasted;
        return pasted;
      },
    } as any);

    // Prefer value returned from kit
    const cid = (res as any).contractId || localContractId || '';
    if (cid) localStorage.setItem('pixelkale:contractId', cid);
    log(`✅ Connected: contractId=${cid || '(unknown)'}`);
  } catch (e:any) {
    log(`❌ Connect failed: ${errToString(e)}`);
  }
};

// Controls
if (clearBtn) clearBtn.onclick = () => { if (logPanel) logPanel.textContent = '(logs cleared)'; };
if (copyBtn) copyBtn.onclick = async () => {
  const text = (logPanel?.textContent || '') + '\nCurrent config:\n' + JSON.stringify({
    rpcUrl: config.rpcUrl,
    networkPassphrase: config.networkPassphrase,
    launchtubeUrl: config.launchtubeUrl,
    jwtPresent: !!config.launchtubeJwt,
  }, null, 2);
  try { await navigator.clipboard.writeText(text); appendLog('INFO', 'Logs copied to clipboard'); } catch {}
};

(document.getElementById('status') as HTMLButtonElement).onclick = () => {
  const keyId = localStorage.getItem('pixelkale:keyId');
  const contractId = localStorage.getItem('pixelkale:contractId');
  log(`📊 Status => keyId=${keyId?.slice(0,16)}..., contractId=${contractId}`);
};

(document.getElementById('disconnect') as HTMLButtonElement).onclick = () => {
  localStorage.removeItem('pixelkale:keyId');
  localStorage.removeItem('pixelkale:contractId');
  log('✅ Disconnected');
};

// T4: Soroban transaction functions
async function plantKale() {
  try {
    const keyId = localStorage.getItem('pixelkale:keyId');
    const contractId = localStorage.getItem('pixelkale:contractId');
    
    if (!keyId || !contractId) {
      log('❌ No wallet connected. Create or connect wallet first.');
      return;
    }

    log('🌱 Planting KALE...');
    appendLog('INFO', `Planting KALE on contract: ${contractId}`);
    
    // TODO: Implement actual Soroban contract call
    // For now, just simulate
    await new Promise(resolve => setTimeout(resolve, 1000));
    log('✅ KALE planted successfully!');
    
  } catch (e:any) {
    log(`❌ Plant failed: ${errToString(e)}`);
  }
}

async function workKale() {
  try {
    const keyId = localStorage.getItem('pixelkale:keyId');
    const contractId = localStorage.getItem('pixelkale:contractId');
    
    if (!keyId || !contractId) {
      log('❌ No wallet connected. Create or connect wallet first.');
      return;
    }

    log('⛏️ Working on KALE...');
    appendLog('INFO', `Working on KALE for contract: ${contractId}`);
    
    // TODO: Implement actual Soroban contract call
    // For now, just simulate
    await new Promise(resolve => setTimeout(resolve, 1000));
    log('✅ KALE work completed!');
    
  } catch (e:any) {
    log(`❌ Work failed: ${errToString(e)}`);
  }
}

async function harvestKale() {
  try {
    const keyId = localStorage.getItem('pixelkale:keyId');
    const contractId = localStorage.getItem('pixelkale:contractId');
    
    if (!keyId || !contractId) {
      log('❌ No wallet connected. Create or connect wallet first.');
      return;
    }

    log('🌾 Harvesting KALE...');
    appendLog('INFO', `Harvesting KALE from contract: ${contractId}`);
    
    // TODO: Implement actual Soroban contract call
    // For now, just simulate
    await new Promise(resolve => setTimeout(resolve, 1000));
    log('✅ KALE harvested successfully!');
    
  } catch (e:any) {
    log(`❌ Harvest failed: ${errToString(e)}`);
  }
}

// Add button event listeners
(document.getElementById('plant') as HTMLButtonElement).onclick = plantKale;
(document.getElementById('work') as HTMLButtonElement).onclick = workKale;
(document.getElementById('harvest') as HTMLButtonElement).onclick = harvestKale;


