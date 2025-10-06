// src/components/MainLayout.jsx

import React from 'react';
import { useAuth } from '../context/AuthContext';
import { Box, Typography, Button, Container, AppBar, Toolbar } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';

function MainLayout({ children, pageTitle }) {
  const { logout } = useAuth();

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
      <AppBar position="static" color="default" elevation={1}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            PMO Digital
          </Typography>
          <Button color="inherit" startIcon={<LogoutIcon />} onClick={logout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>

      {/* O Container do MUI garante margens e largura máxima consistentes */}
      <Container component="main" maxWidth="xl" sx={{ mt: 4, mb: 4, flexGrow: 1 }}>
        {/* Renderiza o conteúdo da página específica que foi passado para o layout */}
        {children}
      </Container>
    </Box>
  );
}

export default MainLayout;