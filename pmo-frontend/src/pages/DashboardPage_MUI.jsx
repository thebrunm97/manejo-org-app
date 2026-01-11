import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

// IMPORTAÇÃO PADRÃO DO GRID (Funciona em qualquer versão do MUI)
import {
    Box, Typography, Paper, Button, Chip, Grid, Skeleton
} from '@mui/material';

import HarvestDashboard from '../components/Dashboard/HarvestDashboard.tsx';
import GeneralLogTable from '../components/Common/GeneralLogTable';

import {
    Plus, MessageCircle, Settings, Smartphone, Edit,
    CloudSun, MapPin, CloudRain, Leaf, ArrowRight
} from 'lucide-react';

// --- ESTILO "AGRO SAAS" ---
const cardStyle = {
    borderRadius: '24px',
    boxShadow: '0px 10px 30px rgba(0,0,0,0.04)',
    border: '1px solid rgba(255,255,255,0.6)',
    bgcolor: '#ffffff',
    height: '100%',
    overflow: 'hidden',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.2s ease-in-out',
    '&:hover': {
        transform: 'translateY(-2px)',
        boxShadow: '0px 20px 40px rgba(0,0,0,0.06)',
    }
};

const WeatherWidget = () => {
    const [weather, setWeather] = useState(null);
    const [loading, setLoading] = useState(true);

    // COORDENADAS FIXAS DO USUÁRIO (UBERLÂNDIA/ARAGUARI REGION)
    const lat = -18.900582;
    const lon = -48.250880;

    useEffect(() => {
        const fetchWeather = async () => {
            try {
                // Fetch current + daily precipitation probability
                const response = await fetch(
                    `https://api.open-meteo.com/v1/forecast?latitude=${lat}&longitude=${lon}&current=temperature_2m,relative_humidity_2m,weather_code&daily=precipitation_probability_max&timezone=America%2FSao_Paulo`
                );
                const data = await response.json();
                setWeather(data);
            } catch (error) {
                console.error("Erro ao carregar clima:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchWeather();
    }, []);

    if (loading) return <Skeleton variant="rectangular" height={160} sx={{ borderRadius: '24px' }} />;

    const current = weather?.current || {};
    const daily = weather?.daily || {};

    const temp = Math.round(current.temperature_2m);
    const humidity = current.relative_humidity_2m;
    const rainChance = daily.precipitation_probability_max ? daily.precipitation_probability_max[0] : 0;

    return (
        <Paper sx={{ ...cardStyle, p: 3, background: 'linear-gradient(135deg, #e0f7fa 0%, #ffffff 100%)', border: '1px solid #b2ebf2' }}>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                <Box>
                    <Typography variant="h3" sx={{ fontWeight: 800, color: '#006064' }}>
                        {temp}°C
                    </Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, mt: 0.5 }}>
                        <MapPin size={14} color="#00838f" />
                        <Typography variant="caption" sx={{ fontWeight: 700, color: '#00838f', textTransform: 'uppercase' }}>
                            ARAGUARI, MG
                        </Typography>
                    </Box>
                </Box>
                <CloudSun size={32} color="#00bcd4" />
            </Box>

            <Box sx={{ mt: 3, display: 'flex', alignItems: 'center', justifyContent: 'space-between', borderTop: '1px solid rgba(0,131,143,0.1)', pt: 2 }}>
                <Box>
                    <Typography variant="caption" color="#0097a7" fontWeight={600} display="block">Umidade</Typography>
                    <Typography variant="body2" fontWeight={700} color="#006064">{humidity}%</Typography>
                </Box>

                <Box sx={{ textAlign: 'right' }}>
                    <Typography variant="caption" color="#0097a7" fontWeight={600} display="block">Chuva (Hoje)</Typography>
                    <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, justifyContent: 'flex-end' }}>
                        <CloudRain size={16} color={rainChance > 50 ? "#0288d1" : "#00bcd4"} />
                        <Typography variant="body2" fontWeight={700} color="#006064">{rainChance}%</Typography>
                    </Box>
                </Box>
            </Box>
        </Paper>
    );
};

import ManualRecordDialog from '../components/Dashboard/ManualRecordDialog';

function DashboardPageMUI() {
    const { user } = useAuth();
    const navigate = useNavigate();
    const [profile, setProfile] = useState(null);
    const [pmoAtivo, setPmoAtivo] = useState(null);
    const [lastMessageDate, setLastMessageDate] = useState(null);

    // Modal Control
    const [openRecordDialog, setOpenRecordDialog] = useState(false);
    const [refreshTrigger, setRefreshTrigger] = useState(0); // Forcing re-fetch

    const hoje = new Date().toLocaleDateString('pt-BR', { weekday: 'long', day: 'numeric', month: 'long' });

    useEffect(() => {
        const fetchData = async () => {
            if (user) {
                try {
                    const { data: profileData } = await supabase
                        .from('profiles')
                        .select('*')
                        .eq('id', user.id)
                        .single();
                    setProfile(profileData);

                    if (profileData?.pmo_ativo_id) {
                        const { data: pmoData } = await supabase
                            .from('pmos')
                            .select('nome_identificador, version')
                            .eq('id', profileData.pmo_ativo_id)
                            .single();
                        setPmoAtivo(pmoData);

                        // Buscar última atividade com tratamento de erro
                        try {
                            const { data: lastMsg, error: lastMsgError } = await supabase
                                .from('caderno_campo')
                                .select('criado_em')
                                .eq('pmo_id', profileData.pmo_ativo_id)
                                .order('criado_em', { ascending: false })
                                .limit(1);

                            if (lastMsgError) {
                                console.warn('Erro ao buscar última atividade:', lastMsgError);
                            } else if (lastMsg && lastMsg.length > 0 && lastMsg[0].criado_em) {
                                setLastMessageDate(new Date(lastMsg[0].criado_em));
                            }
                        } catch (err) {
                            console.warn('Falha ao carregar última atividade:', err);
                        }
                    }
                } catch (error) {
                    console.error("Erro ao carregar dados do dashboard:", error);
                }
            }
        };
        fetchData();
    }, [user, refreshTrigger]);

    const handleRecordSaved = () => {
        setRefreshTrigger(prev => prev + 1); // Refresh data
    };

    const formatarTelefone = (telefoneFull) => {
        if (!telefoneFull) return null;
        const numeroLimpo = telefoneFull.split('@')[0];
        if (numeroLimpo.length > 4) {
            const ultimosDigitos = numeroLimpo.slice(-4);
            return `WHATSAPP ID: ****-${ultimosDigitos}`;
        }
        return "Conta Vinculada";
    };

    const formatarDataRelativa = (date) => {
        if (!date) return 'Nenhuma atividade recente';
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHrs = Math.floor(diffMins / 60);
        const diffDays = Math.floor(diffHrs / 24);

        if (diffMins < 1) return 'Agora mesmo';
        if (diffMins < 60) return `${diffMins} min atrás`;
        if (diffHrs < 24) return `${diffHrs}h atrás`;
        return `${diffDays} dias atrás`;
    };

    const handleActivityUpdate = (date) => {
        if (date && (!lastMessageDate || new Date(date) > new Date(lastMessageDate))) {
            setLastMessageDate(new Date(date));
        }
    };

    return (
        <Box sx={{ pb: 8, overflowX: 'hidden' }}>

            {/* Modal de Registro Manual */}
            <ManualRecordDialog
                open={openRecordDialog}
                onClose={() => setOpenRecordDialog(false)}
                pmoId={profile?.pmo_ativo_id}
                onRecordSaved={handleRecordSaved}
            />

            {/* 1. CABEÇALHO RESPONSIVO */}
            <Box sx={{
                display: 'flex',
                flexDirection: { xs: 'column', md: 'row' },
                justifyContent: 'space-between',
                alignItems: 'center',
                gap: { xs: 2, md: 0 },
                mb: 4
            }}>
                <Box>
                    <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', mb: 0.5 }}>
                        Olá, {user?.email?.split('@')[0]}! 🚜
                    </Typography>
                    <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1rem' }}>
                        Resumo da produção em <span style={{ textTransform: 'capitalize', fontWeight: 600 }}>{hoje}</span>.
                    </Typography>
                </Box>
                <Box sx={{
                    display: 'flex',
                    flexDirection: { xs: 'column', sm: 'row' },
                    gap: 2,
                    width: { xs: '100%', sm: 'auto' }
                }}>
                    <Button
                        variant="outlined"
                        startIcon={<Settings size={18} />}
                        onClick={() => navigate('/planos')}
                        sx={{
                            borderRadius: '12px',
                            textTransform: 'none',
                            fontWeight: 600,
                            borderColor: '#cbd5e1',
                            color: '#475569',
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        Gerenciar Planos
                    </Button>
                    <Button
                        variant="contained"
                        startIcon={<Plus size={20} />}
                        onClick={() => setOpenRecordDialog(true)}
                        sx={{
                            bgcolor: '#16a34a',
                            color: 'white',
                            borderRadius: '12px',
                            px: 3,
                            py: 1,
                            textTransform: 'none',
                            fontWeight: 600,
                            boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)',
                            width: { xs: '100%', sm: 'auto' }
                        }}
                    >
                        Novo Registro
                    </Button>
                </Box>
            </Box>

            {/* 2. LAYOUT ASSIMÉTRICO */}
            <Grid container spacing={3} sx={{ mb: 4 }}>

                {/* --- COLUNA ESQUERDA: CONTROLES --- */}
                {/* --- COLUNA ESQUERDA: CONTROLES --- */}
                <Grid item xs={12} md={4} lg={3}>
                    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>

                        {/* 2.1 WIDGET: PLANO (AGORA O PRIMEIRO) */}
                        <Paper sx={{ ...cardStyle, p: 2.5, bgcolor: '#0f172a', color: 'white' }}>
                            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 2 }}>
                                <Leaf size={20} color="#4ade80" />
                                <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>PLANO ATUAL</Typography>
                            </Box>

                            {pmoAtivo ? (
                                <>
                                    <Typography variant="h6" fontWeight={700} sx={{ wordBreak: 'break-word', lineHeight: 1.2, mb: 0.5 }}>
                                        {pmoAtivo.nome_identificador}
                                    </Typography>
                                    <Typography variant="caption" sx={{ color: '#94a3b8', mb: 3, display: 'block' }}>
                                        v{pmoAtivo.version || 1} • Em andamento
                                    </Typography>

                                    <Box sx={{ mt: 'auto', display: 'flex', gap: 1 }}>
                                        <Button
                                            variant="contained" size="small" fullWidth
                                            onClick={() => navigate('/caderno')}
                                            sx={{ bgcolor: '#4ade80', color: '#064e3b', borderRadius: 2, fontWeight: 700, textTransform: 'none' }}
                                        >
                                            Ver
                                        </Button>
                                        <Button
                                            variant="outlined" size="small"
                                            onClick={() => navigate('/planos')}
                                            sx={{ borderColor: 'rgba(255,255,255,0.3)', color: 'white', borderRadius: 2, minWidth: 40 }}
                                        >
                                            <Edit size={16} />
                                        </Button>
                                    </Box>
                                </>
                            ) : (
                                <Typography variant="body2" sx={{ color: '#94a3b8' }}>Nenhum plano selecionado</Typography>
                            )}
                        </Paper>

                        {/* 2.2 WIDGET: CLIMA (AGORA O SEGUNDO) */}
                        <WeatherWidget />

                        {/* 2.3 WIDGET: ASSISTENTE (AGORA O TERCEIRO) */}
                        <Paper sx={{ ...cardStyle, p: 2.5 }}>
                            <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1 }}>
                                <Box sx={{ p: 1, bgcolor: profile?.telefone ? '#dcfce7' : '#f1f5f9', borderRadius: '10px', color: profile?.telefone ? '#16a34a' : '#64748b' }}>
                                    <Smartphone size={20} />
                                </Box>
                                <Chip
                                    label={profile?.telefone ? "ATIVO" : "OFFLINE"}
                                    color={profile?.telefone ? "success" : "default"}
                                    size="small"
                                    sx={{ fontWeight: 700, borderRadius: 1.5, height: 24 }}
                                />
                            </Box>
                            <Typography variant="subtitle1" fontWeight={700} color="#0f172a" sx={{ lineHeight: 1.2 }}>
                                Assistente Inteligente
                            </Typography>
                            <Typography variant="caption" color="text.secondary" sx={{ fontWeight: 500, mb: 2, display: 'block' }}>
                                {profile?.telefone ? formatarTelefone(profile.telefone) : "Não vinculado"}
                            </Typography>
                            <Box sx={{ mt: 'auto', p: 1.5, bgcolor: '#f8fafc', borderRadius: '16px', border: '1px solid #e2e8f0' }}>
                                <Typography variant="caption" color="text.secondary" sx={{ display: 'block', fontWeight: 600, fontSize: '0.7rem', textTransform: 'uppercase' }}>
                                    Última Atividade
                                </Typography>
                                <Typography variant="body2" color="#0f172a" fontWeight={600}>
                                    {lastMessageDate ? formatarDataRelativa(lastMessageDate) : '-'}
                                </Typography>
                            </Box>
                        </Paper>

                    </Box>
                </Grid>

                {/* --- COLUNA DIREITA: PRINCIPAL --- */}
                {/* --- COLUNA DIREITA: PRINCIPAL --- */}
                <Grid item xs={12} md={8} lg={9}>
                    <Paper sx={{ ...cardStyle, p: 3, minHeight: '100%' }}>
                        <HarvestDashboard
                            pmoId={profile?.pmo_ativo_id}
                            onDataUpdate={handleActivityUpdate}
                        />
                    </Paper>
                </Grid>

            </Grid>




        </Box>
    );
}

export default DashboardPageMUI;