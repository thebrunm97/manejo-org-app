import React from 'react';
import { Box, CssBaseline, Toolbar } from '@mui/material';
import Sidebar from './Sidebar';

const drawerWidth = 260; // Tem de ser igual à largura definida no Sidebar

const DashboardLayout = ({ children }) => {
  return (
    <Box sx={{ display: 'flex', minHeight: '100vh', bgcolor: '#f8fafc' }}>
      <CssBaseline />
      
      {/* Sidebar Fixo */}
      <Sidebar />

      {/* Área de Conteúdo Principal */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          p: 3,
          width: { sm: `calc(100% - ${drawerWidth}px)` },
          bgcolor: '#f1f5f9', // Fundo cinza bem claro para o conteúdo
          minHeight: '100vh'
        }}
      >
        {/* Container centralizado para telas muito largas */}
        <Box sx={{ maxWidth: '1600px', margin: '0 auto' }}>
            {children}
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;