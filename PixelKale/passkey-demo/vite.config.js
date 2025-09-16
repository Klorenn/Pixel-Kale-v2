import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 8080,
    host: true,
    cors: true,
    // https: true // Temporalmente deshabilitado para pruebas
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: []
    }
  },
  optimizeDeps: {
    include: ['passkey-kit', '@stellar/stellar-sdk', '@simplewebauthn/browser']
  },
  define: {
    global: 'globalThis'
  }
})
