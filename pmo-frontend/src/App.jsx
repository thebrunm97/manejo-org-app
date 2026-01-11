// src/App.jsx

import React from 'react';
import { Routes, Route } from 'react-router-dom';
import ProtectedRoute from './components/ProtectedRoute';
import DebugErrorBoundary from './components/DebugErrorBoundary';

// Layout
import DashboardLayout from './components/DashboardLayout';

// Páginas
import DashboardPageMUI from './pages/DashboardPage_MUI';
import PmoFormPage from './pages/PmoFormPage';
import PmoDetailPageMUI from './pages/PmoDetailPage_MUI';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import DiarioDeCampo from './components/DiarioDeCampo';

// 1. IMPORTAÇÃO DA NOVA PÁGINA DE LISTAGEM
import PlanosManejoList from './pages/PlanosManejoList';
import MapaPropriedade from './pages/MapaPropriedade';
import MinhasCulturas from './pages/MinhasCulturas';
import DesignLab from './pages/DesignLab';

function App() {
  return (
    <Routes>
      {/* Rota de Debug (Visibilidade) */}
      <Route path="/lab" element={<DesignLab />} />

      {/* Rotas Públicas */}
      <Route path="/login" element={<LoginPage />} />
      <Route path="/cadastro" element={<SignUpPage />} />

      {/* Rotas Protegidas - Agora usando DashboardLayout */}

      {/* Rota 1: Dashboard Principal (Visão Geral) */}
      <Route
        path="/"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DebugErrorBoundary name="DashboardPageMUI">
                <DashboardPageMUI />
              </DebugErrorBoundary>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Rota 2: Listagem de Planos (NOVA ROTA) */}
      <Route
        path="/planos"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DebugErrorBoundary name="PlanosManejoList">
                <PlanosManejoList />
              </DebugErrorBoundary>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Rota Mapa */}
      <Route
        path="/mapa"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DebugErrorBoundary name="MapaPropriedade">
                <MapaPropriedade />
              </DebugErrorBoundary>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Rota 3: Criar Novo Plano */}
      <Route
        path="/pmo/novo"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PmoFormPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Rota 4: Editar Plano Existente */}
      <Route
        path="/pmo/:pmoId/editar"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <PmoFormPage />
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Rota 5: Detalhes do Plano */}
      <Route
        path="/pmo/:pmoId"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DebugErrorBoundary name="PmoDetailPageMUI">
                <PmoDetailPageMUI />
              </DebugErrorBoundary>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Rota 6: Caderno de Campo (Diário) */}
      <Route
        path="/caderno"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DebugErrorBoundary name="DiarioDeCampo">
                <DiarioDeCampo />
              </DebugErrorBoundary>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      {/* Rota 7: Minhas Culturas (Em Breve) */}
      <Route
        path="/culturas"
        element={
          <ProtectedRoute>
            <DashboardLayout>
              <DebugErrorBoundary name="MinhasCulturas">
                <MinhasCulturas />
              </DebugErrorBoundary>
            </DashboardLayout>
          </ProtectedRoute>
        }
      />

      <Route path="*" element={<h2>Página não encontrada</h2>} />
    </Routes>
  );
}

export default App;