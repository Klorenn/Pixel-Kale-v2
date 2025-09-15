import 'dotenv/config';

async function main() {
  const keyId = process.argv[2] || process.env.PIXELKALE_KEYID;
  if (!keyId) {
    console.error('Usage: npx tsx scripts/passkey-connect-wallet.ts <keyIdBase64>');
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
  } catch (e: any) {
    const msg = e?.message || String(e);
    if (/(navigator|window) is not defined/i.test(msg)) {
      console.error('❌ This operation requires a browser for WebAuthn. Use the Vite demo for interactive auth.');
    } else if (/Stripping types|node_modules.*\.ts/.test(msg)) {
      console.error('❌ TypeScript in node_modules requires running with tsx. The script already uses tsx — if error persists, reinstall dependencies.');
    } else {
      console.error('❌ Connect failed:', msg);
    }
    process.exitCode = 1;
  }
}

main();


