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

interface SidebarProps {
  mobileOpen?: boolean;
  onClose?: () => void;
}

const Sidebar = ({ mobileOpen = false, onClose }: SidebarProps) => {
  const navigate = useNavigate();
  const location = useLocation();
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { logout, user } = useAuth() as any;

  const menuItems = [
    { name: 'Visão Geral', icon: <LayoutDashboard size={22} />, path: '/' },
    { name: 'Planos de Manejo', icon: <ClipboardList size={22} />, path: '/planos' },
    { name: 'Caderno de Campo', icon: <MenuIcon size={22} />, path: '/caderno' },
    { name: 'Mapa da Propriedade', icon: <MapIcon size={22} />, path: '/mapa' },
    { name: 'Minhas Culturas', icon: <Sprout size={22} />, path: '/culturas' },
  ];

  const handleLogout = async () => {
    await logout();
    navigate('/login');
  };

  const handleNavigate = (path: string) => {
    navigate(path);
    if (onClose) onClose(); // Close drawer on mobile selection
  };

  const drawerContent = (
    <>
      {/* 1. Logo */}
      <Box sx={{ p: 3, display: 'flex', alignItems: 'center', gap: 2, borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
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
          boxShadow: '0 0 15px rgba(22, 163, 74, 0.4)' // Glow tech
        }}>
          AV
        </Box>
        <Typography variant="h6" sx={{ color: '#f8fafc', fontWeight: 700, letterSpacing: '-0.5px' }}>
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
        <Typography variant="caption" sx={{ ml: 3, mb: 1, display: 'block', fontWeight: 600, color: '#94a3b8' }}>
          GESTÃO
        </Typography>
        <List>
          {(menuItems || []).map((item) => {
            const active = location.pathname === item.path;
            return (
              <ListItem key={item.name} disablePadding sx={{ mb: 0.5, px: 1.5 }}>
                <ListItemButton
                  onClick={() => handleNavigate(item.path)}
                  sx={{
                    borderRadius: '6px', // Slightly more rounded for buttons
                    mb: 0.5,
                    borderLeft: active ? '3px solid #4ade80' : '3px solid transparent', // Neon indicator
                    bgcolor: active ? 'rgba(21, 128, 61, 0.15) !important' : 'transparent',
                    color: active ? '#ffffff' : '#f1f5f9', // White active, Slate-100 inactive
                    '&:hover': {
                      bgcolor: 'rgba(255, 255, 255, 0.05)',
                      '& .MuiListItemIcon-root': { color: '#ffffff' }
                    },
                    transition: 'all 0.2s ease-in-out'
                  }}
                >
                  <ListItemIcon sx={{ minWidth: 40, color: active ? '#4ade80' : '#94a3b8' }}>
                    {item.icon}
                  </ListItemIcon>
                  <ListItemText
                    primary={item.name}
                    primaryTypographyProps={{
                      fontSize: '0.9rem',
                      fontWeight: active ? 600 : 400,
                      color: 'inherit' // Garante que herda do ListItemButton
                    }}
                  />
                </ListItemButton>
              </ListItem>
            );
          })}
        </List>
      </Box>

      {/* 3. Rodapé */}
      <Box sx={{ p: 2, borderTop: '1px solid rgba(255,255,255,0.08)' }}>
        <List>
          <ListItem disablePadding>
            <ListItemButton
              onClick={handleLogout}
              sx={{
                borderRadius: '6px',
                color: '#94a3b8',
                '&:hover': { color: '#ef4444', bgcolor: 'rgba(239, 68, 68, 0.1)' },
                transition: 'all 0.2s'
              }}
            >
              <ListItemIcon sx={{ minWidth: 40, color: 'inherit' }}><LogOut size={20} /></ListItemIcon>
              <ListItemText primary="Sair" primaryTypographyProps={{ fontSize: '0.9rem' }} />
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
            <Typography variant="caption" sx={{ color: '#cbd5e1' }}>
              Plano Premium
            </Typography>
          </Box>
        </Box>
      </Box>
    </>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      {/* MOBILE DRAWER (Temporary) */}
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={onClose}
        ModalProps={{ keepMounted: true }} // Better open performance on mobile
        sx={{
          display: { xs: 'block', md: 'none' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#1e293b', // Slate 800
            color: '#f8fafc', // Slate 50
            borderRight: '1px solid rgba(255,255,255,0.1)'
          },
        }}
      >
        {drawerContent}
      </Drawer>

      {/* DESKTOP DRAWER (Permanent) */}
      <Drawer
        variant="permanent"
        sx={{
          display: { xs: 'none', md: 'block' },
          '& .MuiDrawer-paper': {
            boxSizing: 'border-box',
            width: drawerWidth,
            backgroundColor: '#1e293b', // Slate 800
            color: '#f8fafc', // Slate 50
            borderRight: '1px solid rgba(255,255,255,0.1)'
          },
        }}
        open
      >
        {drawerContent}
      </Drawer>
    </Box>
  );
};

export default Sidebar;