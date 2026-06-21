import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import federation from '@originjs/vite-plugin-federation'

export default defineConfig({
  plugins: [
    react(),
    federation({
      name: 'users',
      filename: 'remoteEntry.js',
      exposes: {
        './App': './src/App.tsx',
      },
      shared: ['react', 'react-dom', '@tanstack/react-query'],
    }),
  ],

  server: {
    port: 5001,
  },

  build: {
    target: 'esnext',
    minify: false,
    cssCodeSplit: false,
  },
})