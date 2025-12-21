// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import DashboardPageMUI from './pages/DashboardPage_MUI';
import PmoFormPage from './pages/PmoFormPage';
import PmoDetailPageMUI from './pages/PmoDetailPage_MUI';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
// 1. Importar o novo componente do Caderno de Campo
import DiarioDeCampo from './components/DiarioDeCampo';

function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<SignUpPage />} />

      {/* Rotas Protegidas */}
      <Route 
        path="/" 
        element={<ProtectedRoute><MainLayout><DashboardPageMUI /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/pmo/novo" 
        element={<ProtectedRoute><MainLayout><PmoFormPage /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/pmo/:pmoId/editar" 
        element={<ProtectedRoute><MainLayout><PmoFormPage /></MainLayout></ProtectedRoute>} 
      />
      <Route 
        path="/pmo/:pmoId" 
        element={<ProtectedRoute><MainLayout><PmoDetailPageMUI /></MainLayout></ProtectedRoute>} 
      />
      
      {/* 2. Nova Rota Protegida para o Caderno de Campo Digital */}
      <Route 
        path="/caderno" 
        element={
          <ProtectedRoute>
            <MainLayout>
              <DiarioDeCampo />
            </MainLayout>
          </ProtectedRoute>
        } 
      />
      
      <Route path="*" element={<h2>Página não encontrada</h2>} />
    </Routes>
  );
}

export default App;