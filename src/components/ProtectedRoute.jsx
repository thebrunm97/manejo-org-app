// src/components/ProtectedRoute.jsx

import React from 'react';
import { Navigate, useLocation } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

function ProtectedRoute({ children }) {
  const { authToken, isLoading } = useAuth();
  const location = useLocation();

  // Se ainda estivermos verificando o token, mostramos um loader
  if (isLoading) {
    return <h2>Carregando...</h2>;
  }

  // Se a verificação terminou e não há token, redireciona para o login
  if (!authToken) {
    // Passamos a localização atual para que possamos redirecionar de volta após o login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // Se houver um token, renderiza o componente filho (a página protegida)
  return children;
}

export default ProtectedRoute;