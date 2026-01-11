import React, { useState, useEffect } from 'react';
import { Box, Stack, Typography, IconButton, TextField, Chip, Button, Avatar, CircularProgress, Paper, useMediaQuery, useTheme, Fab } from '@mui/material';

// IMPORTAÇÃO DIRETA DE ÍCONES (PARA EVITAR CRASH)
import SpaceDashboardIcon from '@mui/icons-material/SpaceDashboard';
import MapIcon from '@mui/icons-material/Map';
import SpaIcon from '@mui/icons-material/Spa';
import AssignmentIcon from '@mui/icons-material/Assignment';
import SettingsIcon from '@mui/icons-material/Settings';
import LogoutIcon from '@mui/icons-material/Logout';
import FilterListIcon from '@mui/icons-material/FilterList';
import AddIcon from '@mui/icons-material/Add';
import SearchIcon from '@mui/icons-material/Search';
import PublicIcon from '@mui/icons-material/Public';
import ZoomInIcon from '@mui/icons-material/ZoomIn';
import ZoomOutIcon from '@mui/icons-material/ZoomOut';
import MyLocationIcon from '@mui/icons-material/MyLocation';
import ArrowBackIcon from '@mui/icons-material/ArrowBack';

import { supabase } from '../supabaseClient';

// ESTILOS GLASSMORPHISM (RESTORED)
const glassStyle = {
    backdropFilter: 'blur(16px)',
    backgroundColor: 'rgba(20, 30, 40, 0.6)',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderRadius: '16px',
    color: '#e2e8f0',
    boxShadow: '0 8px 32px 0 rgba(0, 0, 0, 0.3)',
};

const glassHover = {
    ...glassStyle,
    cursor: 'pointer',
    transition: 'all 0.2s ease-in-out',
    '&:hover': {
        backgroundColor: 'rgba(255, 255, 255, 0.1)',
        transform: 'translateY(-2px)',
        borderColor: '#4ade80',
    }
};

const SidebarItem = ({ icon: Icon, active }) => (
    <IconButton
        sx={{
            color: active ? '#4ade80' : 'rgba(255,255,255,0.6)',
            bgcolor: active ? 'rgba(74, 222, 128, 0.1)' : 'transparent',
            borderRadius: '12px',
            p: 1.5,
            mb: 2,
            '&:hover': { bgcolor: 'rgba(255,255,255,0.1)', color: '#fff' }
        }}
    >
        <Icon fontSize="medium" />
    </IconButton>
);

const DesignLab = () => {
    const theme = useTheme();
    const isMobile = useMediaQuery(theme.breakpoints.down('md'));

    const [properties, setProperties] = useState([]);
    const [loading, setLoading] = useState(true);
    const [selectedProperty, setSelectedProperty] = useState(null);

    // FETCH DATA
    useEffect(() => {
        const fetchProperties = async () => {
            try {
                const { data: { user } } = await supabase.auth.getUser();
                const { data, error } = await supabase
                    .from('pmos')
                    .select('*')
                    .order('updated_at', { ascending: false });

                if (error) throw error;
                setProperties(data || []);
                // No mobile, não seleciona nada automaticamente para mostrar a lista primeiro
                if (!isMobile && data && data.length > 0) setSelectedProperty(data[0]);

            } catch (error) {
                console.error('Erro LAB:', error);
            } finally {
                setLoading(false);
            }
        };

        fetchProperties();
    }, [isMobile]); // Re-executa se mudar o viewport para ajustar seleção default

    const handleSelect = (item) => {
        console.log('Selecionado:', item.id);
        setSelectedProperty(item);
    };

    const handleBack = () => {
        setSelectedProperty(null);
    };

    return (
        <Box sx={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            overflow: 'hidden',
            background: 'linear-gradient(135deg, #052e16 0%, #115e59 50%, #0f172a 100%)',
            display: 'flex',
            p: isMobile ? 0 : 2,
            gap: 2,
            fontFamily: '"Outfit", sans-serif'
        }}>

            {/* 1. SIDEBAR (Esconde no Mobile por enquanto para focar na lista/mapa) */}
            {!isMobile && (
                <Box sx={{
                    ...glassStyle,
                    width: '80px',
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    py: 4
                }}>
                    <Avatar sx={{ bgcolor: '#4ade80', mb: 6, width: 40, height: 40, fontWeight: 'bold', color: '#064e3b' }}>
                        Ag
                    </Avatar>

                    <Stack sx={{ flexGrow: 1 }}>
                        <SidebarItem icon={SpaceDashboardIcon} />
                        <SidebarItem icon={MapIcon} active />
                        <SidebarItem icon={SpaIcon} />
                        <SidebarItem icon={AssignmentIcon} />
                        <SidebarItem icon={SettingsIcon} />
                    </Stack>

                    <IconButton sx={{ color: 'rgba(255,255,255,0.5)', '&:hover': { color: '#ef4444' } }}>
                        <LogoutIcon />
                    </IconButton>
                </Box>
            )}

            {/* 2. LISTA LATERAL (Mostra se NÃO é mobile, OU se é mobile e nada tá selecionado) */}
            {(!isMobile || (isMobile && !selectedProperty)) && (
                <Box sx={{
                    ...glassStyle,
                    width: isMobile ? '100%' : '360px',
                    height: isMobile ? '100vh' : 'auto',
                    borderRadius: isMobile ? 0 : '16px',
                    background: isMobile ? 'rgba(0,0,0,0.85)' : glassStyle.backgroundColor, // Mais escuro no mobile
                    display: 'flex',
                    flexDirection: 'column',
                    p: 3
                }}>
                    <Stack direction="row" justifyContent="space-between" alignItems="center" sx={{ mb: 3 }}>
                        <Typography variant="h6" sx={{ fontWeight: 700, color: '#f8fafc' }}>
                            Minhas Propriedades
                        </Typography>
                        <Stack direction="row" spacing={1}>
                            <IconButton size="small" sx={{ color: 'rgba(255,255,255,0.7)', border: '1px solid rgba(255,255,255,0.1)' }}>
                                <FilterListIcon fontSize="small" />
                            </IconButton>
                            <IconButton size="small" sx={{ color: '#064e3b', bgcolor: '#4ade80', '&:hover': { bgcolor: '#22c55e' } }}>
                                <AddIcon fontSize="small" />
                            </IconButton>
                        </Stack>
                    </Stack>

                    <Box sx={{ mb: 3, position: 'relative', display: 'flex', alignItems: 'center' }}>
                        <SearchIcon sx={{ position: 'absolute', left: 12, color: 'rgba(255,255,255,0.4)', zIndex: 1 }} />
                        <input
                            placeholder="Buscar propriedade..."
                            style={{
                                width: '100%',
                                backgroundColor: 'rgba(0,0,0,0.2)',
                                border: '1px solid rgba(255,255,255,0.1)',
                                borderRadius: '12px',
                                padding: '12px 12px 12px 40px',
                                color: 'white',
                                outline: 'none',
                                fontSize: '1rem'
                            }}
                        />
                    </Box>

                    <Stack spacing={2} sx={{ overflowY: 'auto', pr: 1, pb: 2 }}>
                        {loading ? (
                            <Box sx={{ display: 'flex', justifyContent: 'center', py: 4 }}>
                                <CircularProgress size={30} sx={{ color: '#4ade80' }} />
                            </Box>
                        ) : properties.length === 0 ? (
                            <Box sx={{ textAlign: 'center', py: 4, opacity: 0.6, color: '#fff' }}>
                                <SpaIcon sx={{ fontSize: 40, mb: 1, opacity: 0.5 }} />
                                <Typography variant="body2">Nenhuma propriedade encontrada.</Typography>
                            </Box>
                        ) : (
                            properties.map((item) => {
                                const nome = item.form_data?.secao_1_descricao_propriedade?.nome_propriedade ||
                                    item.nome_identificador ||
                                    "Propriedade Sem Nome";
                                const isSelected = selectedProperty && String(selectedProperty.id) === String(item.id);

                                return (
                                    <Box
                                        key={item.id}
                                        onClick={() => handleSelect(item)}
                                        sx={{
                                            ...glassHover,
                                            p: 2,
                                            display: 'flex',
                                            justifyContent: 'space-between',
                                            alignItems: 'center',
                                            backgroundColor: isSelected ? 'rgba(34, 197, 94, 0.25) !important' : 'rgba(255, 255, 255, 0.05)',
                                            border: isSelected ? '2px solid #4ade80 !important' : 'rgba(255, 255, 255, 0.1)',
                                            transform: isSelected ? 'scale(1.02)' : 'scale(1)',
                                            boxShadow: isSelected ? '0 0 15px rgba(74, 222, 128, 0.3)' : 'none'
                                        }}
                                    >
                                        <Box>
                                            <Typography variant="body2" sx={{ fontWeight: 600, color: '#f1f5f9' }}>
                                                {nome}
                                            </Typography>
                                            <Typography variant="caption" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                                {new Date(item.updated_at).toLocaleDateString()}
                                            </Typography>
                                        </Box>
                                        {isSelected && (
                                            <Chip label="Visível" size="small" sx={{ bgcolor: '#4ade80', color: '#064e3b', fontWeight: 'bold' }} />
                                        )}
                                    </Box>
                                );
                            })
                        )}
                    </Stack>
                </Box>
            )}

            {/* 3. WORKSPACE (MAPA) - Mostra se NÃO é mobile, OU se é mobile e tem algo selecionado */}
            {(!isMobile || (isMobile && selectedProperty)) && (
                <Box sx={{
                    ...glassStyle,
                    flexGrow: 1,
                    position: 'relative',
                    overflow: 'hidden',
                    backgroundColor: 'rgba(0,0,0,0.3)',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    borderRadius: isMobile ? 0 : '16px',
                    height: isMobile ? '100vh' : 'auto',
                    width: isMobile ? '100%' : 'auto'
                }}>
                    {/* Botão Voltar (Só no Mobile) */}
                    {isMobile && (
                        <Fab
                            onClick={handleBack}
                            size="small"
                            sx={{
                                position: 'absolute',
                                top: 16,
                                left: 16,
                                zIndex: 10,
                                bgcolor: '#fff',
                                color: '#064e3b'
                            }}
                        >
                            <ArrowBackIcon />
                        </Fab>
                    )}

                    {selectedProperty ? (
                        <Box sx={{ textAlign: 'center', p: 2 }}>
                            <Typography variant="h4" sx={{ color: 'white', textShadow: '0 0 10px rgba(0,0,0,0.5)', mb: 1, fontWeight: 'bold' }}>
                                📍 {selectedProperty.form_data?.secao_1_descricao_propriedade?.nome_propriedade || selectedProperty.nome_identificador || 'Propriedade Selecionada'}
                            </Typography>
                            <Typography variant="body1" sx={{ color: '#cbd5e1' }}>
                                ID: {selectedProperty.id}
                            </Typography>

                            <Box sx={{
                                mt: 4,
                                p: 4,
                                border: '2px dashed rgba(255,255,255,0.2)',
                                borderRadius: 4,
                                bgcolor: 'rgba(0,0,0,0.2)'
                            }}>
                                <PublicIcon sx={{ fontSize: 80, color: 'rgba(255,255,255,0.4)', mb: 2 }} />
                                <Typography variant="caption" display="block" sx={{ color: 'rgba(255,255,255,0.5)' }}>
                                    Componente de Mapa (React Leaflet) será injetado aqui.
                                </Typography>
                            </Box>
                        </Box>
                    ) : (
                        <Box sx={{ textAlign: 'center', opacity: 0.5 }}>
                            <PublicIcon sx={{ fontSize: 120, color: 'white', mb: 2 }} />
                            <Typography variant="h5" sx={{ color: 'rgba(255,255,255,0.8)' }}>
                                👈 Selecione uma propriedade na lista
                            </Typography>
                        </Box>
                    )}

                    {!isMobile && (
                        <Stack sx={{ position: 'absolute', bottom: 32, right: 32 }} spacing={1}>
                            <IconButton sx={{ ...glassStyle, borderRadius: 2 }}><ZoomInIcon /></IconButton>
                            <IconButton sx={{ ...glassStyle, borderRadius: 2 }}><ZoomOutIcon /></IconButton>
                            <IconButton sx={{ ...glassStyle, borderRadius: 2, color: '#4ade80' }}><MyLocationIcon /></IconButton>
                        </Stack>
                    )}
                </Box>
            )}

        </Box>
    );
};

export default DesignLab;
