# PixelKale Passkey Demo

Este demo muestra la integración de Passkeys (WebAuthn) con la blockchain de Stellar usando Soroban.

## Características

- 🔑 Creación de wallets usando Passkeys (Touch ID, Face ID, Windows Hello)
- 🌐 Integración con Stellar Mainnet
- 🌱 Operaciones de farming de KALE
- 📱 Soporte para dispositivos con autenticación biométrica
- 🔒 Manejo seguro de claves usando WebAuthn

## Requisitos

- Navegador moderno con soporte WebAuthn (Chrome 67+, Firefox 60+, Safari 13+, Edge 18+)
- Dispositivo con capacidad de Passkey (Touch ID, Face ID, Windows Hello)
- Node.js 16+ y npm

## Instalación

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev
```

## Uso

1. Abre https://localhost:8080 en tu navegador
2. Acepta el certificado de desarrollo (es seguro en localhost)
3. Usa los botones de la interfaz para:
   - Crear una nueva wallet con passkey
   - Conectar una wallet existente
   - Realizar operaciones de farming

## Configuración

El demo usa las siguientes dependencias principales:
- @simplewebauthn/browser: Para manejo de WebAuthn
- passkey-kit: Kit de integración de Passkeys con Stellar
- @stellar/stellar-sdk: SDK de Stellar

## Solución de Problemas

### Error: "WebAuthn requires a secure context"
- Asegúrate de usar HTTPS o localhost
- El demo no funcionará en HTTP en producción

### Error: "No passkey device found"
- Verifica que tu dispositivo tenga Touch ID, Face ID o Windows Hello configurado
- Asegúrate de que tu navegador soporte WebAuthn

### Error: "Operation timed out"
- Intenta de nuevo, asegurándote de completar la autenticación biométrica rápidamente
- Verifica que tu dispositivo de autenticación esté respondiendo

## Seguridad

- Las claves privadas nunca salen del dispositivo
- La autenticación usa el estándar WebAuthn
- Todas las operaciones requieren confirmación biométrica

## Licencia

MIT
