## Implementación Passkeys + Soroban + Launchtube

### Objetivo
- El usuario puede:
  - Crear su cuenta con Passkeys (WebAuthn)
  - Firmar transacciones de Soroban con esa passkey
  - Enviar las transacciones usando Launchtube (relayer/paymaster)

### Flujo End-to-End
1) Registro de Passkey
   - UI: botón "Crear cuenta con Passkey"
   - Llamar a PasskeyKit (o WebAuthn) para crear credenciales y obtener `keyId`
   - Persistir `keyId` de forma segura (localStorage/sesión)

2) Construcción de Transacción Soroban
   - Usar bindings/SDK o js-stellar-sdk (invoke contract) para `plant`, `work`, `harvest`
   - Simular para obtener footprint, TTL y fees → `AssembledTransaction`

3) Firma con Passkey
   - `account.sign(assembledTx, { keyId })` con PasskeyKit
   - Validar errores de WebAuthn (cancel, timeout, not allowed)

4) Envío con Launchtube
   - `server.send(assembledTx)` con `PUBLIC_LAUNCHTUBE_URL` y `PUBLIC_LAUNCHTUBE_JWT`
   - Recibir `txHash` y `ledger`

### Dependencias
- passkey-kit (cliente y servidor)
- @stellar/stellar-sdk >= 13.x (minimal/rpc para Soroban)
- Endpoint y JWT de Launchtube

### Variables de Entorno (.env)
- PUBLIC_RPC_URL
- PUBLIC_NETWORK_PASSPHRASE
- PUBLIC_WALLET_WASM_HASH
- PUBLIC_LAUNCHTUBE_URL
- PUBLIC_LAUNCHTUBE_JWT
- PUBLIC_KALE_CONTRACT_ID (o el contrato que se use)

### Cambios de Código (alto nivel)
- `src/utils/passkey-kit.ts`
  - Confirmar instancia de `PasskeyKit` y `PasskeyServer` usando variables `.env`
- `src/wallet/launchtube-integration.js`
  - Añadir flujo preferente: crear → firmar con passkey → enviar con Launchtube
  - Fallback a firma local sólo si no hay passkey
- `src/wallet/launchtube-demo-wallet.js`
  - Reemplazar WebAuthn manual por PasskeyKit para coherencia
  - Centralizar `createSignAndSubmit` usando passkey cuando exista `keyId`
- SDK/bindings
  - Si se usan bindings (Client): construir `AssembledTransaction` y firmar con PasskeyKit

### Tareas
- T1: Infraestructura y entorno
  - Agregar/validar `.env` con PUBLIC_RPC_URL, PUBLIC_NETWORK_PASSPHRASE, PUBLIC_WALLET_WASM_HASH, PUBLIC_LAUNCHTUBE_URL, PUBLIC_LAUNCHTUBE_JWT, PUBLIC_KALE_CONTRACT_ID
  - Alinear versiones de `@stellar/stellar-sdk` (>=13.x) si aplica

- T2: Registro de Passkey
  - Implementar `createWallet()` con PasskeyKit → retornar `keyIdBase64`
  - Guardar `keyId` en almacenamiento seguro

- T3: Firma con Passkey
  - Sustituir `navigator.credentials` por `PasskeyKit.sign(assembledTx, { keyId })`
  - Manejar errores de usuario y tiempos de espera

- T4: Construcción de transacciones Soroban
  - Implementar métodos para `plant`, `work`, `harvest` que devuelvan `assembledTx`
  - Simulación previa para footprint/fees

- T5: Envío con Launchtube
  - Implementar `server.send(assembledTx)` usando URL/JWT de `.env`
  - Manejar respuestas (hash, ledger) y reintentos

- T6: UI/Endpoints
  - Botones: Login Passkey, Plant, Work, Harvest
  - Mostrar estado: conectado, keyId, contrato, hash/ledger

- T7: Pruebas
  - E2E: registro → plant → work → harvest con passkey
  - Errores: passkey ausente, JWT inválido, RPC indisponible

### Snippets de Referencia
- Registro y firma con PasskeyKit (pseudocódigo):
```
let at = await client.send({ addr, msg });
at = await account.sign(at, { keyId });
await server.send(at);
```

- Operación invoke (js-stellar-sdk):
```
const op = StellarSdk.Operation.invokeContractFunction({
  contract: PUBLIC_KALE_CONTRACT_ID,
  function: 'plant',
  args: [
    StellarSdk.nativeToScVal(publicKey, { type: 'address' }),
    StellarSdk.nativeToScVal(amount, { type: 'i128' }),
  ],
});
```

### Criterios de Aceptación
- El usuario puede crear y almacenar `keyId` con PasskeyKit
- `plant`, `work`, `harvest` firmados con passkey y enviados por Launchtube devuelven `txHash`
- Manejo de errores de WebAuthn y Launchtube con mensajes claros
- Documentación y scripts de prueba actualizados

### Riesgos y Mitigaciones
- WebAuthn no disponible → mensaje claro y fallback opcional
- SDK versión incompatible → fijar `@stellar/stellar-sdk@^13` y probar en testnet
- JWT de Launchtube expirado → refrescar/rotar y manejar 401


