import React, { useEffect, useState } from 'react';
import { supabase } from '../../supabaseClient';
import {
  Box, Paper, Typography, CircularProgress,
  Alert, Stack, Chip, Divider, Button,
  List, ListItem, ListItemText, ListItemAvatar, Avatar
} from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ScaleIcon from '@mui/icons-material/Scale';
import AccessTimeIcon from '@mui/icons-material/AccessTime';

import { useNavigate } from 'react-router-dom';

const HarvestDashboard = ({ pmoId }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState(false);
  const [colheitas, setColheitas] = useState([]);
  const [resumo, setResumo] = useState({});
  const [erro, setErro] = useState(null);

  useEffect(() => {
    if (pmoId) {
      fetchColheitas();
    } else {
      setColheitas([]);
      setResumo({});
    }
  }, [pmoId]);

  const fetchColheitas = async () => {
    try {
      setLoading(true);
      setErro(null);

      const { data, error } = await supabase
        .from('caderno_campo')
        .select('*')
        .eq('tipo_atividade', 'Colheita')
        .eq('pmo_id', pmoId)
        .neq('tipo_atividade', 'CANCELADO') // Exclui cancelados aqui também
        .order('data_registro', { ascending: false });

      if (error) {
        console.error('Erro ao buscar colheitas:', error);
        throw error;
      }

      setColheitas(data || []);
      calcularResumo(data || []);
    } catch (error) {
      console.error('Erro ao buscar colheitas:', error);
      setErro('Não foi possível carregar os dados de produção. Verifique se o banco de dados está configurado corretamente.');
      setColheitas([]); // Fallback
    } finally {
      setLoading(false);
    }
  };

  const calcularResumo = (dados) => {
    const totalPorProduto = (dados || []).reduce((acc, item) => {
      const prod = item.produto || 'NÃO IDENTIFICADO';
      const qtd = parseFloat(item.quantidade_valor || 0);

      if (!acc[prod]) acc[prod] = { total: 0, unidade: item.quantidade_unidade };
      acc[prod].total += qtd;
      return acc;
    }, {});

    setResumo(totalPorProduto);
  };

  if (!pmoId) {
    return (
      <Alert severity="info" sx={{ mt: 2, mb: 4 }}>
        Vincule um Plano de Manejo ao WhatsApp para ver o painel de produção.
      </Alert>
    );
  }

  if (loading) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  if (erro) return <Alert severity="error">{erro}</Alert>;

  return (
    <Box sx={{ flexGrow: 1, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom component="div" sx={{ mb: 3, fontWeight: '800', color: '#1b5e20', letterSpacing: '-0.5px' }}>
        <AgricultureIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Monitoramento de Colheita
      </Typography>

      {/* --- SCROLLABLE SUMMARY ROW --- */}
      {/* --- CAROUSEL (Friendly Mobile Style) --- */}
      <Box
        sx={{
          display: 'flex',
          overflowX: 'auto',
          gap: 2,
          pb: 2,
          mb: 4,
          mx: -2,
          px: 2,
          scrollBehavior: 'smooth',
          // Custom Scrollbar
          '&::-webkit-scrollbar': { height: '6px' },
          '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#e2e8f0', borderRadius: '10px' },
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#cbd5e1' }
        }}
      >
        {Object.entries(resumo).length === 0 ? (
          <Alert severity="info" sx={{ width: '100%', borderRadius: 3 }}>Nenhuma colheita registrada neste plano ainda.</Alert>
        ) : (
          Object.entries(resumo).map(([produto, dados]) => (
            <Paper
              key={produto}
              elevation={0}
              sx={{
                minWidth: '150px',
                aspectRatio: '1 / 0.9',
                flex: '0 0 auto',
                border: '1px solid #F0F0F0', // Polished border
                borderRadius: 4, // 16px
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)', // Soft shadow
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start', // Left align
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              {/* Icon Header */}
              <Avatar
                variant="rounded"
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: '#E8F5E9', // Pastel Green
                  color: '#1B5E20',   // Dark Green
                  borderRadius: 3,    // ~12px
                  mb: 1
                }}
              >
                <ScaleIcon fontSize="small" />
              </Avatar>

              {/* Value & Label */}
              <Box sx={{ width: '100%' }}>
                <Typography variant="h4" sx={{ fontWeight: '800', color: '#1e293b', letterSpacing: '-1px', lineHeight: 1, mb: 0.5 }}>
                  {dados.total.toLocaleString('pt-BR')}
                  <Typography component="span" variant="body2" sx={{ fontWeight: '600', color: '#94a3b8', ml: 0.5 }}>
                    {dados.unidade}
                  </Typography>
                </Typography>

                <Typography
                  variant="body2"
                  sx={{
                    fontWeight: 600,
                    color: '#64748b',
                    textTransform: 'capitalize',
                    whiteSpace: 'nowrap',
                    overflow: 'hidden',
                    textOverflow: 'ellipsis'
                  }}
                >
                  {produto.toLowerCase()}
                </Typography>
              </Box>
            </Paper>
          ))
        )}
      </Box>

      {(colheitas || []).length > 0 && (
        <>
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mt: 4, mb: 3 }}>
            <Typography variant="h6" sx={{ color: '#1e293b', fontWeight: 800 }}>
              Últimas Atividades
            </Typography>
            <Button
              size="small"
              variant="text"
              onClick={() => navigate('/caderno')}
              sx={{ textTransform: 'none', color: '#059669', fontWeight: 700, borderRadius: 2, px: 2 }}
            >
              Ver tudo
            </Button>
          </Box>

          <Stack spacing={2}>
            {(colheitas || []).slice(0, 5).map((row) => (
              <Paper
                key={row.id}
                elevation={0}
                sx={{
                  p: 2,
                  borderRadius: 4, // 16px
                  border: '1px solid #F0F0F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  transition: 'background-color 0.2s',
                  '&:hover': { bgcolor: '#f8fafc' }
                }}
              >
                {/* Icon Box */}
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: '#E8F5E9', // Pastel Green
                    color: '#1B5E20',   // Dark Green
                    borderRadius: 3,    // ~12px
                  }}
                >
                  <AgricultureIcon />
                </Avatar>

                {/* Content */}
                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                    Colheita
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.produto}
                    {row.talhao_canteiro && (
                      <Typography component="span" variant="body2" sx={{ color: '#94a3b8' }}>
                        {' • '}{row.talhao_canteiro}
                      </Typography>
                    )}
                  </Typography>
                </Box>

                {/* Meta / Date */}
                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                  <Chip
                    label={new Date(row.data_registro).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')}
                    size="small"
                    variant="filled"
                    sx={{
                      height: 24,
                      bgcolor: '#F1F5F9', // Light Gray 
                      color: '#475569',
                      fontWeight: 700,
                      borderRadius: 1, // Tag look
                      fontSize: '0.75rem'
                    }}
                  />
                </Box>
              </Paper>
            ))}
          </Stack>
        </>
      )}
    </Box>
  );
};

export default HarvestDashboard;