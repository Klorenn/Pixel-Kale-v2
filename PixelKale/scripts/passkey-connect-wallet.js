require('dotenv').config();

async function main() {
  const keyId = process.argv[2] || process.env.PIXELKALE_KEYID;
  if (!keyId) {
    console.error('Usage: npm run passkey:connect -- <keyIdBase64>');
    process.exit(1);
  }

  try {
    const { PasskeyKit } = await import('passkey-kit');

    const account = new PasskeyKit({
      rpcUrl: process.env.PUBLIC_RPC_URL || 'https://soroban-testnet.stellar.org',
      networkPassphrase: process.env.PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
      walletWasmHash: process.env.PUBLIC_WALLET_WASM_HASH || '',
      timeoutInSeconds: 30,
    });

    console.log('🔌 Connecting wallet with keyId...');
    const res = await account.connectWallet({ keyId });

    console.log('✅ Connected');
    console.log('keyIdBase64:', res.keyIdBase64);
    console.log('contractId :', res.contractId);
  } catch (e) {
    console.error('❌ Connect failed:', e?.message || e);
    process.exitCode = 1;
  }
}

main();


