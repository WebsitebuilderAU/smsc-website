import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

export default defineConfig({
  plugins: [react()],
  base: '/smsc-website/',
  build: {
    outDir: 'dist',
  },
})
