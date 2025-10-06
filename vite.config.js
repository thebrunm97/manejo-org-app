// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  // Adicionamos esta seção para configurar o Vitest
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Arquivo de setup para os testes
  },
})