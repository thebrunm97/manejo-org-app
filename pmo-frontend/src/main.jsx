// src/main.jsx

import React from 'react';
import ReactDOM from 'react-dom/client';
// Force Reload
import App from './App.jsx';
import { BrowserRouter } from 'react-router-dom';

// MUI Imports
import { ThemeProvider } from '@mui/material/styles';
import CssBaseline from '@mui/material/CssBaseline';

// Import do Provedor de Autenticação
import { AuthProvider } from './context/AuthContext';

// Import do ErrorBoundary
import ErrorBoundary from './components/ErrorBoundary';

// --- NOVO: Importa o Tema Personalizado (Agro Moderno) ---
import theme from './theme';

// =======================================================
// ||         INÍCIO DA LÓGICA DE REGISTRO DO SW          ||
// =======================================================
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker
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
// ||            FIM DA LÓGICA DE REGISTRO DO SW          ||
// =======================================================

// Renderização da aplicação
ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ErrorBoundary>
      <BrowserRouter>
        <AuthProvider>
          {/* Aplica o novo tema importado de theme.js */}
          <ThemeProvider theme={theme}>
            <CssBaseline />
            <App />
          </ThemeProvider>
        </AuthProvider>
      </BrowserRouter>
    </ErrorBoundary>
  </React.StrictMode>
);