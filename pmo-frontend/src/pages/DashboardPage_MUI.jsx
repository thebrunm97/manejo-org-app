import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';

// IMPORTAÇÃO PADRÃO DO GRID (Funciona em qualquer versão do MUI)
import {
  Box, Typography, Paper, Button, Chip, Grid
} from '@mui/material';

import { 
  PieChart, Pie, Cell, ResponsiveContainer, Tooltip as RechartsTooltip 
} from 'recharts';

import HarvestDashboard from '../components/Dashboard/HarvestDashboard';
import GeneralLogTable from '../components/Dashboard/GeneralLogTable';

import { 
  Sprout, ArrowRight, Leaf, Plus, MessageCircle, Settings, Smartphone
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

const chartData = [
  { name: 'Área Produtiva', value: 65, color: '#16a34a' },
  { name: 'Em descanso', value: 20, color: '#eab308' },
  { name: 'Reserva', value: 15, color: '#94a3b8' },
];

function DashboardPageMUI() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [profile, setProfile] = useState(null);
  const [pmoAtivo, setPmoAtivo] = useState(null);
  
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
            }
        } catch (error) {
            console.error("Erro ao carregar dados do dashboard:", error);
        }
      }
    };
    fetchData();
  }, [user]);

  const formatarTelefone = (telefoneFull) => {
    if (!telefoneFull) return null;
    const numeroLimpo = telefoneFull.split('@')[0];
    if (numeroLimpo.length > 4) {
        const ultimosDigitos = numeroLimpo.slice(-4);
        return `Conta final ****-${ultimosDigitos}`;
    }
    return "Conta Vinculada";
  };

  return (
    <Box sx={{ pb: 8 }}>
      
      {/* 1. CABEÇALHO */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', mb: 4 }}>
        <Box>
            <Typography variant="h4" sx={{ fontWeight: 800, color: '#0f172a', letterSpacing: '-1px', mb: 0.5 }}>
                Olá, {user?.email?.split('@')[0]}! 🚜
            </Typography>
            <Typography variant="body1" sx={{ color: '#64748b', fontSize: '1rem' }}>
                Resumo da produção em <span style={{textTransform: 'capitalize', fontWeight: 600}}>{hoje}</span>.
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', gap: 2 }}>
            <Button 
                variant="outlined" 
                startIcon={<Settings size={18} />}
                onClick={() => navigate('/planos')}
                sx={{ borderRadius: '12px', textTransform: 'none', fontWeight: 600, borderColor: '#cbd5e1', color: '#475569' }}
            >
                Gerenciar Planos
            </Button>
            <Button 
                variant="contained" 
                startIcon={<Plus size={20} />}
                onClick={() => navigate('/caderno')}
                sx={{ 
                    bgcolor: '#16a34a', color: 'white', borderRadius: '12px', px: 3, py: 1,
                    textTransform: 'none', fontWeight: 600, boxShadow: '0 4px 14px rgba(22, 163, 74, 0.4)'
                }}
            >
                Novo Registro
            </Button>
        </Box>
      </Box>

      {/* 2. GRID DE WIDGETS (USANDO GRID CLÁSSICO - ITEM/CONTAINER) */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        
        {/* WIDGET 1: WHATSAPP */}
        <Grid item xs={12} md={4}>
            <Paper sx={{ ...cardStyle, p: 3 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: profile?.telefone ? '#dcfce7' : '#f1f5f9', borderRadius: '14px', color: profile?.telefone ? '#16a34a' : '#64748b' }}>
                        <Smartphone size={24} />
                    </Box>
                    <Chip 
                        label={profile?.telefone ? "ATIVO" : "OFFLINE"} 
                        color={profile?.telefone ? "success" : "default"} 
                        size="small" 
                        sx={{ fontWeight: 700, borderRadius: 2 }} 
                    />
                </Box>
                <Typography variant="h6" fontWeight={700} color="#0f172a">Assistente IA</Typography>
                
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2, flex: 1 }}>
                    {profile?.telefone 
                        ? formatarTelefone(profile.telefone)
                        : "Vincule seu WhatsApp para enviar áudios."}
                </Typography>
                
                {!profile?.telefone && (
                     <Button variant="outlined" fullWidth size="small" color="success" onClick={() => navigate('/planos')} sx={{ borderRadius: 3 }}>
                        Vincular Agora
                     </Button>
                )}
            </Paper>
        </Grid>

        {/* WIDGET 2: PLANO ATIVO */}
        <Grid item xs={12} md={4}>
            <Paper sx={{ ...cardStyle, p: 3, bgcolor: '#0f172a', color: 'white' }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
                    <Box sx={{ p: 1.5, bgcolor: 'rgba(255,255,255,0.1)', borderRadius: '14px' }}>
                        <Leaf size={24} color="#4ade80" />
                    </Box>
                    <Typography variant="caption" sx={{ color: '#94a3b8', fontWeight: 600 }}>PLANO ATUAL</Typography>
                </Box>
                
                {pmoAtivo ? (
                    <>
                        <Typography variant="h5" fontWeight={700} noWrap>{pmoAtivo.nome_identificador}</Typography>
                        <Typography variant="body2" sx={{ color: '#94a3b8', mb: 3, flex: 1 }}>Versão {pmoAtivo.version || 1} • Em andamento</Typography>
                        <Button variant="contained" size="small" onClick={() => navigate('/caderno')} sx={{ bgcolor: '#4ade80', color: '#064e3b', borderRadius: 3, fontWeight: 700 }}>
                            Ver Caderno
                        </Button>
                    </>
                ) : (
                    <>
                        <Typography variant="h6">Nenhum plano ativo</Typography>
                        <Button onClick={() => navigate('/planos')} sx={{ color: '#4ade80', mt: 2 }}>Selecionar Plano</Button>
                    </>
                )}
            </Paper>
        </Grid>

       {/* WIDGET 3: GRÁFICO OTIMIZADO */}
        <Grid item xs={12} md={4}>
            <Paper sx={{ 
                ...cardStyle, 
                p: 3, 
                display: 'flex', 
                flexDirection: 'column',
                justifyContent: 'space-between',
                minHeight: 300 // Garante altura mínima para não achatar
            }}>
                <Typography variant="subtitle2" fontWeight={700} color="#0f172a">
                    Uso da Terra
                </Typography>
                
                {/* Container flexível que ocupa todo o espaço restante */}
                <Box sx={{ flexGrow: 1, width: '100%', minHeight: 200, mt: 2 }}>
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart margin={{ top: 0, left: 0, right: 0, bottom: 0 }}>
                            <Pie 
                                data={chartData} 
                                cx="50%" 
                                cy="50%" 
                                // USAR PORCENTAGEM É O SEGREDO DA RESPONSIVIDADE
                                innerRadius="60%" 
                                outerRadius="85%" 
                                paddingAngle={5} 
                                dataKey="value"
                                stroke="none" // Remove a borda branca dos fatias
                            >
                                {chartData.map((entry, index) => (
                                    <Cell key={`cell-${index}`} fill={entry.color} />
                                ))}
                            </Pie>
                            <RechartsTooltip 
                                contentStyle={{ 
                                    backgroundColor: '#fff',
                                    borderRadius: '12px', 
                                    border: '1px solid #e2e8f0', 
                                    boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)',
                                    color: '#1e293b'
                                }}
                                itemStyle={{ color: '#1e293b', fontWeight: 600 }}
                            />
                        </PieChart>
                    </ResponsiveContainer>
                </Box>
                
                {/* Legenda Opcional para preencher espaço visual se necessário */}
                <Box sx={{ display: 'flex', justifyContent: 'center', gap: 2, mt: 1 }}>
                    {chartData.map((entry, index) => (
                        <Box key={index} sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                            <Box sx={{ width: 8, height: 8, borderRadius: '50%', bgcolor: entry.color }} />
                            <Typography variant="caption" color="text.secondary">{entry.name}</Typography>
                        </Box>
                    ))}
                </Box>
            </Paper>
        </Grid>

      </Grid>

      {/* 3. ÁREA DE DADOS REAIS */}
      <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', mb: 2, display: 'flex', alignItems: 'center', gap: 1 }}>
        <Sprout size={20} /> Produção em Tempo Real
      </Typography>
      
      <Paper sx={{ ...cardStyle, p: 3, mb: 5 }}>
         <HarvestDashboard pmoId={profile?.pmo_ativo_id} />
      </Paper>

      {/* 4. TABELA LOGS */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ fontWeight: 700, color: '#0f172a', display: 'flex', alignItems: 'center', gap: 1 }}>
            <MessageCircle size={20} /> Últimas Atividades
        </Typography>
        <Button onClick={() => navigate('/caderno')} endIcon={<ArrowRight size={16} />} sx={{ textTransform: 'none', color: '#16a34a' }}>
            Ver tudo
        </Button>
      </Box>

      <Paper sx={{ ...cardStyle, p: 0, overflow: 'hidden', border: 'none' }}>
         <GeneralLogTable pmoId={profile?.pmo_ativo_id} />
      </Paper>

    </Box>
  );
}

export default DashboardPageMUI;