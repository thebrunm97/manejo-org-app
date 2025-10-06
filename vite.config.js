// vite.config.js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react( )],

  // ADICIONE A LINHA ABAIXO:
  // Isso garante que os caminhos para os arquivos JS/CSS no build final
  // sejam absolutos a partir da raiz do domínio, corrigindo a página em branco.
  base: '/',

  // A sua configuração de teste permanece intacta.
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: './src/setupTests.js', // Arquivo de setup para os testes
  },
})
