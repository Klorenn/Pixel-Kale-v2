require('dotenv').config();

function printConfig() {
  const cfg = {
    PUBLIC_RPC_URL: process.env.PUBLIC_RPC_URL,
    PUBLIC_NETWORK_PASSPHRASE: process.env.PUBLIC_NETWORK_PASSPHRASE,
    PUBLIC_WALLET_WASM_HASH: process.env.PUBLIC_WALLET_WASM_HASH,
    PUBLIC_LAUNCHTUBE_URL: process.env.PUBLIC_LAUNCHTUBE_URL,
    PUBLIC_LAUNCHTUBE_JWT: process.env.PUBLIC_LAUNCHTUBE_JWT,
    PUBLIC_KALE_CONTRACT_ID: process.env.PUBLIC_KALE_CONTRACT_ID,
  };
  console.log('Passkey env config:', cfg);
}

printConfig();


