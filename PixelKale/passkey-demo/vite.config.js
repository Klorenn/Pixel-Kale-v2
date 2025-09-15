import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 8080,
    host: true,
    cors: true,
    headers: {
      'Cross-Origin-Embedder-Policy': 'require-corp',
      'Cross-Origin-Opener-Policy': 'same-origin'
    }
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: []
    }
  },
  optimizeDeps: {
    include: ['passkey-kit', '@stellar/stellar-sdk']
  },
  define: {
    global: 'globalThis'
  }
})
