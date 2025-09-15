import { defineConfig } from 'vite'

export default defineConfig({
  server: {
    port: 8080,
    host: true
  },
  build: {
    target: 'esnext',
    rollupOptions: {
      external: []
    }
  },
  optimizeDeps: {
    include: ['passkey-kit']
  }
})
