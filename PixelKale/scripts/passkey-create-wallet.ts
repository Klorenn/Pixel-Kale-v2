import 'dotenv/config';

async function main() {
  try {
    const { PasskeyKit, PasskeyServer } = await import('passkey-kit');

    const account = new PasskeyKit({
      rpcUrl: process.env.PUBLIC_RPC_URL || 'https://soroban-testnet.stellar.org',
      networkPassphrase: process.env.PUBLIC_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
      walletWasmHash: process.env.PUBLIC_WALLET_WASM_HASH || '',
      timeoutInSeconds: 30,
    });

    const server = new PasskeyServer({
      rpcUrl: process.env.PUBLIC_RPC_URL || 'https://soroban-testnet.stellar.org',
      launchtubeUrl: process.env.PUBLIC_LAUNCHTUBE_URL || 'https://testnet.launchtube.xyz',
      launchtubeJwt: process.env.PUBLIC_LAUNCHTUBE_JWT || '',
    });

    console.log('🔑 Creating wallet with passkey...');
    const res = await account.createWallet('PixelKale', 'KALE Farmer');

    console.log('✅ Created wallet');
    console.log('keyIdBase64:', res.keyIdBase64);
    console.log('contractId :', res.contractId);

    if (res.signedTx) {
      console.log('📤 Sending creation transaction via Launchtube...');
      const sent = await server.send(res.signedTx);
      console.log('✅ Sent: hash=', sent.hash, 'ledger=', sent.ledger);
    } else {
      console.log('⚠️ No signedTx returned (kit version may not return it)');
    }
  } catch (e: any) {
    const msg = e?.message || String(e);
    if (/(navigator|window) is not defined/i.test(msg)) {
      console.error('❌ This operation requires a browser (WebAuthn). Use the Vite demo at http://localhost:5173 to create the passkey.');
    } else if (/Stripping types|node_modules.*\.ts/.test(msg)) {
      console.error('❌ TypeScript in node_modules requires running with tsx. The script already uses tsx — if error persists, reinstall dependencies.');
    } else {
      console.error('❌ Create wallet failed:', msg);
    }
    process.exitCode = 1;
  }
}

main();


