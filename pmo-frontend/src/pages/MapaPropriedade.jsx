import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, CircularProgress } from '@mui/material';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import PropertyMap from '../components/PropertyMap/PropertyMap';

const MapaPropriedade = () => {
    const { user } = useAuth();
    const [pmoId, setPmoId] = useState(null);
    const [loading, setLoading] = useState(true);

    // 1. Carregar Perfil e PMO ID
    useEffect(() => {
        const loadInitialData = async () => {
            try {
                if (!user) {
                    setLoading(false);
                    return;
                }

                const { data: profile, error: profileError } = await supabase
                    .from('profiles')
                    .select('pmo_ativo_id')
                    .eq('id', user.id)
                    .single();

                if (profileError) {
                    console.error("Erro ao carregar perfil:", profileError);
                }

                if (profile?.pmo_ativo_id) {
                    setPmoId(profile.pmo_ativo_id);
                }
            } catch (err) {
                console.error("Erro inesperado:", err);
            } finally {
                setLoading(false);
            }
        };

        loadInitialData();
    }, [user]);

    if (loading) {
        return (
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
                <CircularProgress />
            </Box>
        );
    }

    if (!pmoId) {
        return (
            <Box sx={{ p: 4, textAlign: 'center' }}>
                <Typography variant="h6" color="error">
                    Nenhum Plano de Manejo Ativo encontrado.
                </Typography>
                <Typography variant="body2">
                    Por favor, selecione ou crie um plano no seu perfil.
                </Typography>
            </Box>
        );
    }

    return (
        <Box sx={{ p: { xs: 2, md: 4 } }}>
            <Typography variant="h4" sx={{ fontWeight: '800', mb: 2, color: '#1e293b' }}>
                Mapa da Propriedade
            </Typography>
            <PropertyMap pmoId={pmoId} />
        </Box>
    );
};

export default MapaPropriedade;