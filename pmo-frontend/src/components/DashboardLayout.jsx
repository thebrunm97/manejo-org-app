import React, { useState } from 'react';
import { Box, CssBaseline, IconButton, AppBar, Toolbar, Typography } from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import Sidebar from './Sidebar';

const drawerWidth = 260;

const DashboardLayout = ({ children }) => {
  const [mobileOpen, setMobileOpen] = useState(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <Box sx={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <CssBaseline />

      {/* APP BAR - Apenas Mobile para o botão Menu */}
      <AppBar
        position="fixed"
        elevation={0}
        sx={{
          display: { md: 'none' },
          bgcolor: '#ffffff',
          borderBottom: '1px solid #e2e8f0',
          color: '#0f172a',
          zIndex: (theme) => theme.zIndex.drawer + 1
        }}
      >
        <Toolbar>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2 }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div" sx={{ fontWeight: 700, color: '#16a34a' }}>
            AgroVivo
          </Typography>
        </Toolbar>
      </AppBar>

      {/* Sidebar Responsiva */}
      <Sidebar
        mobileOpen={mobileOpen}
        onClose={handleDrawerToggle}
      />

      {/* Área de Conteúdo Principal com SCROLL AUTOMÁTICO */}
      <Box
        component="main"
        sx={{
          flexGrow: 1,
          height: '100dvh', // Garante altura total da viewport
          display: 'flex',
          flexDirection: 'column',
          overflow: 'hidden', // O container principal não rola, apenas o filho
          bgcolor: '#f1f5f9',
        }}
      >
        {/* Spacer para o AppBar (Apenas Mobile) */}
        <Box sx={{ height: { xs: 56, md: 0 }, flexShrink: 0 }} />

        {/* Área Scrollável */}
        <Box
          sx={{
            flexGrow: 1,
            overflowY: 'auto',
            p: 3,
            scrollBehavior: 'smooth'
          }}
        >
          {/* Container centralizado */}
          <Box sx={{ maxWidth: '1600px', margin: '0 auto' }}>
            {children}
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default DashboardLayout;