// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import MainLayout from './components/MainLayout';
import DashboardPageMUI from './pages/DashboardPage_MUI';
import PmoFormPage from './pages/PmoFormPage';
import PmoDetailPageMUI from './pages/PmoDetailPage_MUI';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage'; // <-- 1. Importe a nova página

function App() {
  return (
    <Routes>
      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<SignUpPage />} /> {/* <-- 2. Adicione a nova rota */}

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
      
      <Route path="*" element={<h2>Página não encontrada</h2>} />
    </Routes>
  );
}

export default App;