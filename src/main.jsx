// src/main.jsx (Com Registro do Service Worker)

import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// MUI Imports
import { ThemeProvider, createTheme } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';
import { ptBR } from '@mui/material/locale';

// Import do Provedor de Autenticação
import { AuthProvider } from './context/AuthContext';

// =======================================================
// ||         INÍCIO DA LÓGICA DE REGISTRO DO SW          ||
// =======================================================
// Verificamos se o navegador suporta Service Workers
if ('serviceWorker' in navigator) {
  // Usamos o evento 'load' para garantir que o registro não atrase
  // o carregamento inicial da página.
  window.addEventListener('load', () => {
    navigator.serviceWorker
      // O caminho '/sw.js' é relativo à raiz do domínio,
      // por isso colocamos o arquivo na pasta /public.
      .register('/sw.js')
      .then(registration => {
        console.log('Service Worker registrado com sucesso! Escopo:', registration.scope);
      })
      .catch(error => {
        console.error('Falha no registro do Service Worker:', error);
      });
  });
}
// =======================================================
// ||           FIM DA LÓGICA DE REGISTRO DO SW           ||
// =======================================================

// Tema do MUI (sem alterações)
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976D2',
    },
    secondary: {
      main: '#FFC107',
    },
    background: {
      default: '#f4f6f8',
      paper: '#ffffff',
    },
  },
  typography: {
    fontFamily: 'Roboto, -apple-system, BlinkMacSystemFont, "Segoe UI", "Helvetica Neue", Arial, sans-serif',
    h5: {
      fontWeight: 600,
    },
  },
}, ptBR);

// Renderização da aplicação (sem alterações)
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider> 
        <ThemeProvider theme={theme}>
          <CssBaseline />
          <App />
        </ThemeProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
);