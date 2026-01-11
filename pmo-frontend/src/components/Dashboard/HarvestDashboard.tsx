import React, { useEffect, useState, useCallback, useRef } from 'react';
import { supabase } from '../../supabaseClient';
import {
  Box, Paper, Typography, CircularProgress,
  Alert, Stack, Chip, Button, Avatar
} from '@mui/material';
import AgricultureIcon from '@mui/icons-material/Agriculture';
import ScaleIcon from '@mui/icons-material/Scale';
import SpaIcon from '@mui/icons-material/Spa';
import ScienceIcon from '@mui/icons-material/Science';
import LocalFloristIcon from '@mui/icons-material/LocalFlorist';
import Inventory2Icon from '@mui/icons-material/Inventory2';
import { useNavigate } from 'react-router-dom';
import { HarvestDashboardProps, SummaryData } from '../../types/HarvestTypes';
import { CadernoCampoRecord } from '../../types/CadernoTypes';
import { RealtimeChannel } from '@supabase/supabase-js';
import RecordDetailsDialog from './RecordDetailsDialog';

const getActivityIcon = (tipo: string) => {
  const t = tipo?.toLowerCase() || '';
  if (t.includes('colheita')) return <AgricultureIcon />;
  if (t.includes('plantio')) return <SpaIcon />;
  if (t.includes('manejo')) return <ScienceIcon />;
  if (t.includes('insumo')) return <Inventory2Icon />;
  return <LocalFloristIcon />;
};

const HarvestDashboard: React.FC<HarvestDashboardProps> = ({ pmoId, onDataUpdate }) => {
  const navigate = useNavigate();
  const [loading, setLoading] = useState<boolean>(false);
  const [activities, setActivities] = useState<CadernoCampoRecord[]>([]);
  const [resumo, setResumo] = useState<SummaryData>({});
  const [erro, setErro] = useState<string | null>(null);

  // Dialog State
  const [selectedRecord, setSelectedRecord] = useState<CadernoCampoRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  const channelRef = useRef<RealtimeChannel | null>(null);

  const calcularResumo = useCallback((dados: CadernoCampoRecord[]) => {
    // Only calculate summary for HARVESTS to maintain production semantics
    const harvestData = dados.filter(d => d.tipo_atividade === 'Colheita');

    const totalPorProduto = harvestData.reduce((acc: SummaryData, item) => {
      const prod = item.produto?.toUpperCase() || 'NÃO IDENTIFICADO';
      const qtd = Number(item.quantidade_valor) || 0;
      const unidade = item.quantidade_unidade || '';

      if (!acc[prod]) acc[prod] = { total: 0, unidade };
      acc[prod].total += qtd;
      return acc;
    }, {});

    setResumo(totalPorProduto);
  }, []);

  const fetchActivities = useCallback(async () => {
    if (!pmoId) return;

    try {
      setLoading((prev) => prev && activities.length === 0);
      setErro(null);

      const { data, error } = await supabase
        .from('caderno_campo')
        .select('*')
        .eq('pmo_id', pmoId)
        .neq('tipo_atividade', 'CANCELADO') // Filter out cancelled
        .order('data_registro', { ascending: false });

      if (error) {
        console.error('Erro ao buscar atividades:', error);
        throw error;
      }

      const safeData = (data as unknown as CadernoCampoRecord[]) || [];
      setActivities(safeData);
      calcularResumo(safeData);

      if (onDataUpdate && safeData.length > 0) {
        const mostRecent = safeData[0].data_registro;
        if (mostRecent) {
          onDataUpdate(new Date(mostRecent));
        }
      }

    } catch (error) {
      console.error('Erro ao buscar atividades:', error);
      setErro('Não foi possível carregar os dados recentes.');
    } finally {
      setLoading(false);
    }
  }, [pmoId, calcularResumo, onDataUpdate]);

  useEffect(() => {
    if (!pmoId) {
      setActivities([]);
      setResumo({});
      return;
    }

    setLoading(true);
    fetchActivities();

    if (channelRef.current) {
      supabase.removeChannel(channelRef.current);
    }

    const channel = supabase
      .channel(`harvest_dashboard_live_${pmoId}`)
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'caderno_campo',
          filter: `pmo_id=eq.${pmoId}`
        },
        () => {
          console.log('Realtime update detected for pmoId:', pmoId);
          fetchActivities();
        }
      )
      .subscribe();

    channelRef.current = channel;

    return () => {
      if (channelRef.current) {
        supabase.removeChannel(channelRef.current);
        channelRef.current = null;
      }
    };
  }, [pmoId, fetchActivities]);

  const handleCardClick = (record: CadernoCampoRecord) => {
    setSelectedRecord(record);
    setDetailsOpen(true);
  };

  if (!pmoId) {
    return (
      <Alert severity="info" sx={{ mt: 2, mb: 4 }}>
        Vincule um Plano de Manejo ao WhatsApp para ver o painel de produção.
      </Alert>
    );
  }

  if (loading && activities.length === 0) return <Box display="flex" justifyContent="center" p={4}><CircularProgress /></Box>;
  if (erro && activities.length === 0) return <Alert severity="error">{erro}</Alert>;

  return (
    <Box sx={{ flexGrow: 1, p: 2, bgcolor: '#fff', borderRadius: 2, boxShadow: 1 }}>
      <Typography variant="h6" gutterBottom component="div" sx={{ mb: 3, fontWeight: '800', color: '#1b5e20', letterSpacing: '-0.5px' }}>
        <AgricultureIcon sx={{ verticalAlign: 'middle', mr: 1 }} />
        Monitoramento de Produção
      </Typography>

      {/* --- SCROLLABLE SUMMARY ROW (HARVESTS ONLY) --- */}
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
          '&::-webkit-scrollbar': { height: '6px' },
          '&::-webkit-scrollbar-track': { backgroundColor: 'transparent' },
          '&::-webkit-scrollbar-thumb': { backgroundColor: '#e2e8f0', borderRadius: '10px' },
          '&::-webkit-scrollbar-thumb:hover': { backgroundColor: '#cbd5e1' }
        }}
      >
        {Object.entries(resumo).length === 0 ? (
          <Alert severity="info" sx={{ width: '100%', borderRadius: 3 }}>
            Nenhuma colheita registrada neste plano ainda.
          </Alert>
        ) : (
          Object.entries(resumo).map(([produto, dados]) => (
            <Paper
              key={produto}
              elevation={0}
              sx={{
                minWidth: '150px',
                aspectRatio: '1 / 0.9',
                flex: '0 0 auto',
                border: '1px solid #F0F0F0',
                borderRadius: 4,
                boxShadow: '0 4px 20px rgba(0,0,0,0.05)',
                p: 2.5,
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                alignItems: 'flex-start',
                transition: 'transform 0.2s',
                '&:hover': { transform: 'translateY(-4px)' }
              }}
            >
              <Avatar
                variant="rounded"
                sx={{
                  width: 48,
                  height: 48,
                  bgcolor: '#E8F5E9',
                  color: '#1B5E20',
                  borderRadius: 3,
                  mb: 1
                }}
              >
                <ScaleIcon fontSize="small" />
              </Avatar>

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

      {/* --- LATEST ACTIVITIES LIST (ALL TYPES) --- */}
      {(activities || []).length > 0 && (
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
              Ver Diário Completo
            </Button>
          </Box>

          <Stack spacing={2}>
            {(activities || []).slice(0, 5).map((row) => (
              <Paper
                key={row.id}
                elevation={0}
                onClick={() => handleCardClick(row)}
                sx={{
                  p: 2,
                  borderRadius: 4,
                  border: '1px solid #F0F0F0',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                  cursor: 'pointer',
                  transition: 'all 0.2s',
                  '&:hover': {
                    bgcolor: '#f8fafc',
                    transform: 'scale(1.01)',
                    boxShadow: '0 4px 12px rgba(0,0,0,0.05)'
                  }
                }}
              >
                <Avatar
                  variant="rounded"
                  sx={{
                    width: 48,
                    height: 48,
                    bgcolor: '#E8F5E9',
                    color: '#1B5E20',
                    borderRadius: 3,
                  }}
                >
                  {getActivityIcon(row.tipo_atividade)}
                </Avatar>

                <Box sx={{ flexGrow: 1, minWidth: 0 }}>
                  <Typography variant="body1" sx={{ fontWeight: 700, color: '#0f172a', lineHeight: 1.2 }}>
                    {row.tipo_atividade}
                  </Typography>
                  <Typography variant="body2" sx={{ color: '#64748b', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                    {row.produto}
                    {row.talhao_canteiro && (
                      <Typography component="span" variant="body2" sx={{ color: '#94a3b8' }}>
                        {' • '}{row.talhao_canteiro}
                      </Typography>
                    )}
                  </Typography>
                  {(row.quantidade_valor !== null && row.quantidade_valor !== undefined) && (
                    <Typography variant="caption" sx={{ color: '#10b981', fontWeight: 700, display: 'block', mt: 0.5 }}>
                      {row.quantidade_valor} {row.quantidade_unidade}
                    </Typography>
                  )}
                </Box>

                <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'flex-end', gap: 0.5 }}>
                  <Chip
                    label={new Date(row.data_registro).toLocaleDateString('pt-BR', { day: '2-digit', month: 'short' }).replace('.', '')}
                    size="small"
                    variant="filled"
                    sx={{
                      height: 24,
                      bgcolor: '#F1F5F9',
                      color: '#475569',
                      fontWeight: 700,
                      borderRadius: 1,
                      fontSize: '0.75rem'
                    }}
                  />
                  <Typography variant="caption" sx={{ color: '#cbd5e1', fontSize: '10px' }}>
                    Ver detalhes
                  </Typography>
                </Box>
              </Paper>
            ))}
          </Stack>
        </>
      )}

      <RecordDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        record={selectedRecord}
      />
    </Box>
  );
};

export default HarvestDashboard;