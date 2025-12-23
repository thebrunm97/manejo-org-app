import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { 
  Box, 
  Drawer, 
  List, 
  ListItem, 
  ListItemButton, 
  ListItemIcon, 
  ListItemText, 
  Typography, 
  Avatar
} from '@mui/material';
import { 
  LayoutDashboard, 
  Sprout, 
  Map as MapIcon, 
  ClipboardList, 
  LogOut, 
  Menu as MenuIcon 
} from 'lucide-react';
import { useAuth } from '../context/AuthContext';

const drawerWidth = 260; // Largura do menu

const Sidebar = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { signOut, user } = useAuth();

  const menuItems = [
    { name: 'Visão Geral', icon: <LayoutDashboard size={22} />, path: '/' },
    { name: 'Planos de Manejo', icon: <ClipboardList size={22} />, path: '/planos' }, // Apontando para a nova lista
    { name: 'Caderno de Campo', icon: <MenuIcon size={22} />, path: '/caderno' },
    { name: 'Mapa (Em breve)', icon: <MapIcon size={22} />, path: '/mapa' },
    { name: 'Minhas Culturas', icon: <Sprout size={22} />, path: '/culturas' },
  ];

  const handleLogout = async () => {
    await signOut();
    navigate('/login');
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: drawerWidth,
        flexShrink: 0,
        '& .MuiDrawer-paper': {
          width: drawerWidth,
          boxSizing: 'border-box',
          backgroundColor: '#0f172a', // Cor escura
          color: '#94a3b8',
          borderRight: '1px solid #1e293b'
        },
      }}
    >
      {/* 1. Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid #1e293b' }}>
        <Box sx={{ 
            width: 35, 
            height: 35, 
            bgcolor: '#16a34a', // Verde Agro
            borderRadius: 2, 
            display: 'flex', 
            alignItems: 'center', 
            justifyContent: 'center',
            color: 'white',
            fontWeight: 'bold',
            boxShadow: '0 4px 12px rgba(22, 163, 74, 0.3)'
        }}>
          AV
        </Box>
        <Typography variant="h6" sx={{ color: 'white', fontWeight: 700, letterSpacing: '-0.5px' }}>
          AgroVivo
        </Typography>
      </Box>

      {/* 2. Menu com Scroll Invisível */}
      <Box sx={{ 
          overflowY: 'auto', 
          mt: 2, 
          flexGrow: 1,
          // CSS Mágico para esconder Scrollbar
          scrollbarWidth: 'none',  // Firefox
          '&::-webkit-scrollbar': { display: 'none' } // Chrome/Safari
      }}>
        <Typography variant="caption" sx={{ ml: 3, mb: 1, display: 'block', fontWeight: 600, color: '#475569' }}>
          GESTÃO
        </Typography>
        <List>
          {menuItems.map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5, px: 1.5 }}>
                <ListItemButton 
                  onClick={() => navigate(item.path)}
                  sx={{ 
                    borderRadius: 2,
                    bgcolor: active ? 'rgba(22, 163, 74, 0.15)' : 'transparent',
                    color: active ? '#4ade80' : 'inherit',
                    '&:hover': {
                      bgcolor: active ? 'rgba(22, 163, 74, 0.25)' : 'rgba(255, 255, 255, 0.05)',
                      color: active ? '#4ade80' : 'white',
                    }
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText 
                    primary={item.name} 
                    primaryTypographyProps={{ fontSize: '0.9rem', fontWeight: active ? 600 : 400 }} 
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* 3. Rodapé */}
      <Box sx={{ p: 2, borderTop: '1px solid #1e293b' }}>
         <List>
            <ListItem disablePadding>
                <ListItemButton 
                    onClick={handleLogout}
                    sx={{ 
                        borderRadius: 2, 
                        color: '#94a3b8', 
                        '&:hover': { color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)' } 
                    }} 
                >
                    <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><LogOut size={20}/></ListItemIcon>
                    <ListItemText primary="Sair" primaryTypographyProps={{ fontSize: '0.9rem' }}/>
                </ListItemButton>
            </ListItem>
         </List>

         <Box sx={{ mt: 2, p: 1.5, bgcolor: 'rgba(255,255,255,0.03)', borderRadius: 2, display: 'flex', alignItems: 'center', gap: 2 }}>
            <Avatar sx={{ width: 32, height: 32, bgcolor: '#16a34a', fontSize: '0.8rem' }}>
                {user?.email?.charAt(0).toUpperCase() || 'U'}
            </Avatar>
            <Box sx={{ overflow: 'hidden' }}>
                <Typography variant="subtitle2" sx={{ color: 'white', lineHeight: 1.2 }}>
                    {user?.email?.split('@')[0]}
                </Typography>
                <Typography variant="caption" sx={{ color: '#64748b' }}>
                    Plano Premium
                </Typography>
            </Box>
         </Box>
      </Box>
    </Drawer>
  );
};

export default Sidebar;