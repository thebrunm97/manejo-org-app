import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import {
  CircularProgress, Menu, MenuItem, Alert,
  Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography,
  Chip, IconButton, Button, Tooltip, Card, CardContent, Stack,
  useMediaQuery, useTheme, Divider,
  Dialog, DialogTitle, DialogContent, DialogContentText,
  DialogActions, TextField, Grid, Snackbar
} from '@mui/material';

import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScienceIcon from '@mui/icons-material/Science';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import PlaceIcon from '@mui/icons-material/Place';
import ManualRecordDialog from './Dashboard/ManualRecordDialog';
import MobileLogCard from './Common/MobileLogCard';

const DiarioDeCampo = ({ pmoId: propPmoId }) => {
  const { user } = useAuth();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm')); // Cards on mobile (<600px), Table on tablets/desktop (>=600px)

  const [internalPmoId, setInternalPmoId] = useState(propPmoId);

  // INICIALIZAÇÃO SEGURA: Começa sempre como array vazio []
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState(null);

  const [filtrosAtivos, setFiltrosAtivos] = useState({
    data_registro: 'Todos',
    tipo_atividade: 'Todos',
    produto: 'Todos'
  });

  const [anchorEl, setAnchorEl] = useState(null);
  const [colunaAtiva, setColunaAtiva] = useState(null);

  // Estados para Edição/Exclusão
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState(''); // 'EDIT' ou 'DELETE'
  const [selectedItem, setSelectedItem] = useState(null);
  const [editValues, setEditValues] = useState({});
  const [justificativa, setJustificativa] = useState('');
  const [showDeleted, setShowDeleted] = useState(false);
  const [openManualDialog, setOpenManualDialog] = useState(false);
  const [editingRecord, setEditingRecord] = useState(null);

  // 1. Resolve o PMO ID (Prop ou do Perfil)
  useEffect(() => {
    const resolvePmo = async () => {
      if (propPmoId) {
        setInternalPmoId(propPmoId);
      } else if (user) {
        try {
          const { data } = await supabase
            .from('profiles')
            .select('pmo_ativo_id')
            .eq('id', user.id)
            .single();
          if (data?.pmo_ativo_id) {
            setInternalPmoId(data.pmo_ativo_id);
          } else {
            setErrorMsg("Você não possui um plano de manejo ativo.");
          }
        } catch (err) {
          console.error("Erro ao resolver PMO:", err);
          setErrorMsg("Erro ao identificar plano de manejo.");
        }
      }
    };
    resolvePmo();
  }, [propPmoId, user]);

  // 2. Busca registros quando tiver ID
  useEffect(() => {
    if (internalPmoId) {
      fetchRegistros(internalPmoId);
    }
  }, [internalPmoId]);

  const fetchRegistros = async (idToUse) => {
    const targetId = idToUse || internalPmoId;
    if (!targetId) return;

    try {
      setLoading(true);
      setErrorMsg(null);

      const { data, error } = await supabase
        .from('caderno_campo')
        .select('*, talhoes ( nome )')
        .eq('pmo_id', targetId)
        .order('data_registro', { ascending: false });

      if (error) throw error;
      setRegistros(data || []);
    } catch (error) {
      console.error('Erro:', error.message);
      setRegistros([]);
      setErrorMsg("Erro ao carregar registros.");
    } finally {
      setLoading(false);
    }
  };

  // Fun\u00e7\u00f5es de Edi\u00e7\u00e3o/Exclus\u00e3o
  const handleOpenAction = (item, type) => {
    if (type === 'EDIT') {
      setEditingRecord(item);
      setOpenManualDialog(true);
      return;
    }

    // DELETE ACTION (Legacy Dialog)
    setSelectedItem(item);
    setActionType(type);
    setJustificativa('');
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
    setEditValues({});
    setJustificativa('');
  };

  // Snackbar State
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState('');
  const [snackbarSeverity, setSnackbarSeverity] = useState('success');

  const handleSnackbarClose = (event, reason) => {
    if (reason === 'clickaway') return;
    setSnackbarOpen(false);
  };

  const showSnackbar = (message, severity = 'success') => {
    setSnackbarMessage(message);
    setSnackbarSeverity(severity);
    setSnackbarOpen(true);
  };

  const handleConfirmAction = async () => {
    if (justificativa.length < 5) {
      alert('A justificativa é obrigatória (mínimo 5 letras).');
      return;
    }

    // Preparar Dados do Log
    const logEntry = {
      data: new Date().toISOString(),
      acao: actionType,
      motivo: justificativa,
      dados_anteriores: {
        tipo: selectedItem.tipo_atividade,
        produto: selectedItem.produto,
        qtd: selectedItem.quantidade_valor
      }
    };

    const currentDetails = selectedItem.detalhes_tecnicos || {};
    const historico = currentDetails.historico_alteracoes || [];
    const newDetails = {
      ...currentDetails,
      historico_alteracoes: [...historico, logEntry]
    };

    // --- OTIMISTIC UI FOR DELETE ---
    if (actionType === 'DELETE') {
      // 1. Snapshot do estado anterior (Backup)
      const previousRegistros = [...registros];

      // 2. Atualização Otimista (Remove da lista visualmente)
      setRegistros(prev => prev.filter(r => r.id !== selectedItem.id));

      // 3. Fecha o diálogo imediatamente
      handleClose();

      // 4. Request em Background
      try {
        const updatePayload = {
          tipo_atividade: 'CANCELADO',
          observacao_original: `[CANCELADO] ${selectedItem.observacao_original}`,
          detalhes_tecnicos: newDetails
        };

        const { error } = await supabase
          .from('caderno_campo')
          .update(updatePayload)
          .eq('id', selectedItem.id);

        if (error) throw error;

        // Sucesso: Mostra Toast
        showSnackbar('Registro excluído com sucesso!', 'success');

      } catch (err) {
        // Erro: Reverte o estado e avisa
        console.error("Erro na exclusão otimista:", err);
        setRegistros(previousRegistros); // Rollback
        showSnackbar('Erro ao excluir: ' + err.message, 'error');
      }
      return;
    }

    // --- STANDARD UI FOR EDIT (Wait for response) ---
    try {
      let updatePayload = {};
      const tipo = selectedItem.tipo_atividade;

      if (tipo === 'Manejo') {
        updatePayload = {
          talhao_canteiro: editValues.local || selectedItem.talhao_canteiro,
          observacao_original: editValues.atividade,
          detalhes_tecnicos: {
            ...newDetails,
            atividade: editValues.atividade,
            local: editValues.local
          }
        };
      } else if (tipo === 'Colheita') {
        updatePayload = {
          produto: editValues.produto?.toUpperCase() || selectedItem.produto,
          quantidade_valor: parseFloat(editValues.quantidade) || 0,
          detalhes_tecnicos: {
            ...newDetails,
            produto: editValues.produto,
            qtd: parseFloat(editValues.quantidade)
          }
        };
      } else if (tipo === 'Compra' || tipo === 'Venda') {
        updatePayload = {
          produto: editValues.produto?.toUpperCase() || selectedItem.produto,
          quantidade_valor: parseFloat(editValues.quantidade) || 0,
          detalhes_tecnicos: {
            ...newDetails,
            produto: editValues.produto,
            valor: parseFloat(editValues.valor) || 0,
            qtd: parseFloat(editValues.quantidade) || 0
          }
        };
      } else {
        updatePayload = {
          produto: editValues.produto?.toUpperCase() || selectedItem.produto,
          quantidade_valor: parseFloat(editValues.quantidade) || 0,
          detalhes_tecnicos: newDetails
        };
      }

      const { data, error } = await supabase
        .from('caderno_campo')
        .update(updatePayload)
        .eq('id', selectedItem.id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        showSnackbar('ATENÇÃO: O banco recusou a alteração (RLS).', 'warning');
        return;
      }

      await fetchRegistros();
      handleClose();
      showSnackbar('Registro atualizado com sucesso!', 'success');

    } catch (err) {
      showSnackbar('Erro ao salvar: ' + err.message, 'error');
    }
  };

  const abrirFiltro = (event, coluna) => {
    setAnchorEl(event.currentTarget);
    setColunaAtiva(coluna);
  };

  const fecharFiltro = (valor) => {
    if (valor) {
      setFiltrosAtivos(prev => ({ ...prev, [colunaAtiva]: valor }));
    }
    setAnchorEl(null);
    setColunaAtiva(null);
  };

  // TRAVA DE SEGURANÇA: filter
  const registrosFiltrados = (registros || []).filter(reg => {
    if (!reg) return false;
    const dataFormatada = reg.data_registro ? new Date(reg.data_registro).toLocaleDateString('pt-BR') : '-';

    const matchData = filtrosAtivos.data_registro === 'Todos' || dataFormatada === filtrosAtivos.data_registro;
    const matchTipo = filtrosAtivos.tipo_atividade === 'Todos' || reg.tipo_atividade === filtrosAtivos.tipo_atividade;
    const matchProduto = filtrosAtivos.produto === 'Todos' || reg.produto === filtrosAtivos.produto;
    return matchData && matchTipo && matchProduto;
  });

  // TRAVA DE SEGURANÇA: map
  const obterOpcoesunicas = (coluna) => {
    const safeRegs = Array.isArray(registros) ? registros : [];
    if (safeRegs.length === 0) return ['Todos'];

    const validRegs = safeRegs.filter(r => r);

    if (coluna === 'data_registro') {
      const datas = validRegs.map(r => r.data_registro ? new Date(r.data_registro).toLocaleDateString('pt-BR') : '-');
      return ['Todos', ...new Set(datas)];
    }

    const valores = validRegs.map(r => r[coluna] || '-');
    return ['Todos', ...new Set(valores)];
  };

  const getStatusColor = (tipo) => {
    const map = {
      'Insumo': 'warning', 'Manejo': 'info', 'Plantio': 'success',
      'Colheita': 'primary', 'CANCELADO': 'error', 'Outro': 'default'
    };
    return map[tipo] || 'default';
  };

  // Estatísticas Rápidas
  const totalRegistros = registros ? registros.length : 0;
  const atividadesHoje = registros ? registros.filter(r => {
    if (!r.data_registro) return false;
    const hoje = new Date().toISOString().split('T')[0];
    return r.data_registro.startsWith(hoje);
  }).length : 0;
  const ultimaAtividade = registros && registros.length > 0 ? new Date(registros[0].data_registro).toLocaleDateString('pt-BR') : '-';





  return (
    <Box sx={{ mt: 3, mb: 10, width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>

      {/* --- DASHBOARD CARDS (Wrap on mobile) --- */}
      <Stack direction={{ xs: 'column', sm: 'row' }} spacing={2}>
        <Card elevation={0} sx={{ flex: 1, bgcolor: '#e3f2fd', border: '1px solid #bbdefb', borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: '50%', color: '#1976d2', boxShadow: 1 }}>
              <AssessmentIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">TOTAL REGISTROS</Typography>
              <Typography variant="h5" fontWeight="800" color="#1565c0">{totalRegistros}</Typography>
            </Box>
          </CardContent>
        </Card>

        <Card elevation={0} sx={{ flex: 1, bgcolor: '#e8f5e9', border: '1px solid #c8e6c9', borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: '50%', color: '#2e7d32', boxShadow: 1 }}>
              <CalendarTodayIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">ATIVIDADES HOJE</Typography>
              <Typography variant="h5" fontWeight="800" color="#1b5e20">{atividadesHoje}</Typography>
            </Box>
          </CardContent>
        </Card>

        {/* Hide last card on very small screens to save space if needed, or keep stacked. Keeping stacked. */}
        <Card elevation={0} sx={{ flex: 1, bgcolor: '#fff3e0', border: '1px solid #ffe0b2', borderRadius: 2 }}>
          <CardContent sx={{ display: 'flex', alignItems: 'center', gap: 2, py: 2, '&:last-child': { pb: 2 } }}>
            <Box sx={{ p: 1.5, bgcolor: '#ffffff', borderRadius: '50%', color: '#ef6c00', boxShadow: 1 }}>
              <TrendingUpIcon />
            </Box>
            <Box>
              <Typography variant="caption" color="text.secondary" fontWeight="bold">ÚLTIMA ATUALIZAÇÃO</Typography>
              <Typography variant="h6" fontWeight="bold" color="#e65100">{ultimaAtividade}</Typography>
            </Box>
          </CardContent>
        </Card>
      </Stack>


      {/* --- MAIN CONTENT (List vs Table) --- */}
      <Box>
        <Grid container alignItems="center" justifyContent="space-between" spacing={2} sx={{ mb: 2, px: 1 }}>
          <Grid size={{ xs: 12, sm: 'grow' }}>
            <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: '800', color: '#2c3e50', letterSpacing: '-0.5px' }}>
              <ListAltIcon color="primary" /> Diário de Campo
            </Typography>
          </Grid>

          <Grid size={{ xs: 12, sm: 'auto' }}>
            <Stack direction="row" spacing={1} justifyContent={{ xs: 'stretch', sm: 'flex-end' }}>
              {/* Mobile Filters could go here in future */}
              <Button
                variant="contained"
                color="success"
                startIcon={<AddIcon />}
                onClick={() => setOpenManualDialog(true)}
                size={isMobile ? "medium" : "small"}
                fullWidth={isMobile}
                sx={{ textTransform: 'none', fontWeight: 'bold', boxShadow: 'none', borderRadius: 2, whiteSpace: 'nowrap', minWidth: 'fit-content' }}
              >
                + Novo Registro
              </Button>
              <Button
                variant="contained"
                startIcon={<RefreshIcon />}
                onClick={() => fetchRegistros()}
                size={isMobile ? "medium" : "small"}
                fullWidth={isMobile}
                sx={{ textTransform: 'none', fontWeight: 'bold', boxShadow: 'none', borderRadius: 2, whiteSpace: 'nowrap', minWidth: 'fit-content' }}
              >
                Atualizar
              </Button>
            </Stack>
          </Grid>
        </Grid>

        {errorMsg && (
          <Alert severity="warning" sx={{ mb: 2 }}>{errorMsg}</Alert>
        )}

        {loading ? (
          <Box sx={{ display: 'flex', justifyItems: 'center', p: 5 }}><CircularProgress /></Box>
        ) : (!registrosFiltrados || registrosFiltrados.length === 0) ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', color: 'text.secondary', bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography>Nenhum registro encontrado.</Typography>
          </Paper>
        ) : (
          <>
            {/* --- DESKTOP VIEW (Table) --- */}
            <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
              <TableContainer component={Paper} elevation={0} sx={{ width: '100%', borderRadius: 3, overflowX: 'auto', border: '1px solid #e0e0e0', boxShadow: '0 4px 20px rgba(0,0,0,0.05)' }}>
                <Table stickyHeader size="medium" sx={{ minWidth: '100%', tableLayout: 'fixed' }}>
                  <TableHead>
                    <TableRow sx={{ '& th': { fontWeight: '700', color: '#546e7a', bgcolor: '#f8f9fa', borderBottom: '2px solid #eef2f6' } }}>
                      {/* DATA: Fixed */}
                      <TableCell sx={{ width: '110px', whiteSpace: 'nowrap', px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={(e) => abrirFiltro(e, 'data_registro')}>
                          DATA
                          <FilterListIcon fontSize="small" sx={{ opacity: filtrosAtivos.data_registro !== 'Todos' ? 1 : 0.3, color: filtrosAtivos.data_registro !== 'Todos' ? 'primary.main' : 'inherit' }} />
                        </Box>
                      </TableCell>

                      {/* ATIVIDADE: Fixed */}
                      <TableCell sx={{ width: '105px', px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={(e) => abrirFiltro(e, 'tipo_atividade')}>
                          ATIVID.
                          <FilterListIcon fontSize="small" sx={{ opacity: filtrosAtivos.tipo_atividade !== 'Todos' ? 1 : 0.3, color: filtrosAtivos.tipo_atividade !== 'Todos' ? 'primary.main' : 'inherit' }} />
                        </Box>
                      </TableCell>

                      {/* PRODUTO: Fluid */}
                      <TableCell sx={{ width: '18%', px: 1 }}>
                        <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, cursor: 'pointer' }} onClick={(e) => abrirFiltro(e, 'produto')}>
                          PRODUTO
                          <FilterListIcon fontSize="small" sx={{ opacity: filtrosAtivos.produto !== 'Todos' ? 1 : 0.3, color: filtrosAtivos.produto !== 'Todos' ? 'primary.main' : 'inherit' }} />
                        </Box>
                      </TableCell>

                      {/* LOCAL / QTD: Fluid */}
                      <TableCell sx={{ width: '20%', px: 1 }}>LOCAL / QTD</TableCell>

                      {/* DETALHES: Fluid (Largest) */}
                      <TableCell sx={{ width: 'auto', px: 1 }}>DETALHES TÉCNICOS</TableCell>

                      {/* AÇÕES: Fixed */}
                      <TableCell align="right" sx={{ width: '80px', px: 1 }}>AÇÕES</TableCell>
                    </TableRow>
                  </TableHead>

                  <TableBody>
                    {registrosFiltrados.map((reg) => (
                      <TableRow key={reg.id || Math.random()} hover sx={{ '&:last-child td, &:last-child th': { border: 0 }, transition: 'background-color 0.2s' }}>
                        <TableCell sx={{ whiteSpace: 'nowrap', fontWeight: '500', color: '#37474f' }}>
                          {reg.data_registro ? new Date(reg.data_registro).toLocaleDateString('pt-BR') : '-'}
                        </TableCell>
                        <TableCell>
                          <Chip
                            label={reg.tipo_atividade || 'Outro'}
                            color={getStatusColor(reg.tipo_atividade)}
                            size="small"
                            variant="filled"
                            sx={{ fontWeight: '700', fontSize: '0.70rem', borderRadius: 1.5, height: 24 }}
                          />
                        </TableCell>
                        <TableCell>
                          <Typography variant="body2" sx={{ fontWeight: '600', color: '#263238' }}>{reg.produto || '-'}</Typography>
                        </TableCell>
                        <TableCell>
                          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 0.5 }}>
                            <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5, alignItems: 'center' }}>
                              {reg.talhao_id ? (
                                <Tooltip title="Localização verificada via GPS/IA">
                                  <Chip
                                    icon={<PlaceIcon style={{ color: 'white', fontSize: '1rem' }} />}
                                    label={reg.talhoes?.nome || 'Local Verificado'}
                                    color="success" // "Verificado" style
                                    size="small"
                                    sx={{ fontWeight: '700', fontSize: '0.75rem', height: 24 }}
                                  />
                                </Tooltip>
                              ) : reg.talhao_canteiro ? (
                                (() => {
                                  const locais = reg.talhao_canteiro.split(';').map(l => l.trim()).filter(Boolean);
                                  if (locais.length > 3) {
                                    return (
                                      <>
                                        {locais.slice(0, 2).map((loc, idx) => (
                                          <Chip key={idx} label={loc} size="small" variant="outlined" sx={{ bgcolor: '#f8fafc', fontSize: '0.75rem', height: 22 }} />
                                        ))}
                                        <Tooltip title={locais.slice(2).join('; ')}>
                                          <Chip label={`+${locais.length - 2}`} size="small" color="primary" sx={{ height: 22, fontWeight: 'bold' }} />
                                        </Tooltip>
                                      </>
                                    );
                                  }
                                  return locais.map((loc, idx) => (
                                    <Chip key={idx} label={loc} size="small" variant="outlined" sx={{ bgcolor: '#f8fafc', fontSize: '0.75rem', height: 22 }} />
                                  ));
                                })()
                              ) : (
                                <Typography variant="caption" color="text.secondary">-</Typography>
                              )}
                            </Box>

                            {reg.quantidade_valor > 0 && (
                              <Typography variant="body2" sx={{ fontWeight: '600', fontSize: '0.8rem', color: '#455a64' }}>
                                ⚖️ {reg.quantidade_valor} {reg.quantidade_unidade}
                              </Typography>
                            )}
                          </Box>
                        </TableCell>
                        <TableCell sx={{ px: 1 }}>
                          {reg.detalhes_tecnicos?.receita || reg.detalhes_tecnicos?.composicao ? (
                            <Tooltip title={reg.detalhes_tecnicos.receita || reg.detalhes_tecnicos.composicao}>
                              <Paper elevation={0} sx={{ p: 1, bgcolor: '#f1f8e9', borderRadius: 2, border: '1px solid #dcedc8', maxWidth: '100%', overflow: 'hidden' }}>
                                <Typography variant="caption" color="success.main" sx={{ display: 'flex', alignItems: 'center', gap: 0.5, fontWeight: '800', mb: 0.5, letterSpacing: '0.5px', textTransform: 'uppercase' }}>
                                  <ScienceIcon fontSize="inherit" /> RECEITA
                                </Typography>
                                <Typography variant="body2" color="#33691e" fontSize="0.85rem" sx={{ whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                                  {reg.detalhes_tecnicos.receita || reg.detalhes_tecnicos.composicao}
                                </Typography>
                              </Paper>
                            </Tooltip>
                          ) : (
                            <Tooltip title={reg.observacao_original || ''}>
                              <Typography variant="body2" color="text.secondary" sx={{ fontStyle: 'italic', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis', display: 'block' }}>
                                {reg.observacao_original || '-'}
                              </Typography>
                            </Tooltip>
                          )}
                        </TableCell>
                        <TableCell align="right">
                          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center' }}>
                            {/* Audit Indicator */}
                            {reg.detalhes_tecnicos?.justificativa_edicao && (
                              <Tooltip
                                title={
                                  <div style={{ textAlign: 'center' }}>
                                    <b>Editado em {reg.detalhes_tecnicos.data_edicao ? new Date(reg.detalhes_tecnicos.data_edicao).toLocaleDateString('pt-BR') : '?'}</b><br />
                                    "{reg.detalhes_tecnicos.justificativa_edicao}"
                                  </div>
                                }
                                arrow
                              >
                                <IconButton size="small" color="warning" sx={{ mr: 1 }}>
                                  <HistoryIcon fontSize="small" />
                                </IconButton>
                              </Tooltip>
                            )}

                            {reg.tipo_atividade !== 'CANCELADO' ? (
                              <>
                                <Tooltip title="Corrigir">
                                  <IconButton size="small" color="primary" onClick={() => handleOpenAction(reg, 'EDIT')} sx={{ mr: 0.5 }}>
                                    <EditIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                                <Tooltip title="Invalidar">
                                  <IconButton size="small" color="error" onClick={() => handleOpenAction(reg, 'DELETE')}>
                                    <DeleteIcon fontSize="small" />
                                  </IconButton>
                                </Tooltip>
                              </>
                            ) : (
                              <Tooltip title="Registro Auditado">
                                <span><IconButton size="small" disabled><HistoryIcon /></IconButton></span>
                              </Tooltip>
                            )}
                          </Box>
                        </TableCell>
                      </TableRow>
                    ))}
                  </TableBody>
                </Table>
              </TableContainer>
            </Box>

            {/* --- MOBILE VIEW (Cards) --- */}
            <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
              {/* Card Filters Hint could go here */}
              <Typography variant="caption" sx={{ mb: 1, display: 'block', color: 'text.secondary', textAlign: 'center' }}>
                Mostrando {registrosFiltrados.length} registros
              </Typography>
              {registrosFiltrados.map((reg) => (
                <MobileLogCard
                  key={reg.id || Math.random()}
                  reg={reg}
                  onEdit={(item) => handleOpenAction(item, 'EDIT')}
                  onDelete={(item) => handleOpenAction(item, 'DELETE')}
                />
              ))}
            </Box>
          </>
        )}

        <Menu
          anchorEl={anchorEl}
          open={Boolean(anchorEl)}
          onClose={() => fecharFiltro()}
          PaperProps={{ style: { maxHeight: 300, borderRadius: 12, boxShadow: '0 4px 20px rgba(0,0,0,0.1)' } }}
        >
          {colunaAtiva && obterOpcoesunicas(colunaAtiva).map((opcao) => (
            <MenuItem
              key={opcao}
              selected={filtrosAtivos[colunaAtiva] === opcao}
              onClick={() => fecharFiltro(opcao)}
              dense
              sx={{ fontSize: '0.875rem' }}
            >
              {opcao}
            </MenuItem>
          ))}
        </Menu>

        {/* Dialog de Edi\u00e7\u00e3o/Exclus\u00e3o */}
        <Dialog open={openDialog} onClose={handleClose} maxWidth="sm" fullWidth>
          <DialogTitle sx={{ color: actionType === 'DELETE' ? 'error.main' : 'primary.main' }}>
            {actionType === 'DELETE' ? 'Invalidar Registro' : 'Corrigir Registro'}
          </DialogTitle>
          <DialogContent>
            <DialogContentText sx={{ mb: 2 }}>
              {actionType === 'DELETE'
                ? "O registro será marcado como CANCELADO, mas mantido para auditoria."
                : "As alterações serão salvas no histórico do registro."}
            </DialogContentText>

            {actionType === 'EDIT' && (
              <Box sx={{ mb: 2 }}>
                {/* Campos dinâmicos baseados no tipo de atividade */}
                {selectedItem?.tipo_atividade === 'Manejo' && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Atividade Realizada"
                      fullWidth
                      value={editValues.atividade || ''}
                      onChange={e => setEditValues({ ...editValues, atividade: e.target.value })}
                      placeholder="Ex: Capina, Poda, Roçada"
                    />
                    <TextField
                      label="Local / Talhão"
                      fullWidth
                      value={editValues.local || ''}
                      onChange={e => setEditValues({ ...editValues, local: e.target.value })}
                      placeholder="Ex: Talhão 1, Canteiro A"
                    />
                  </Box>
                )}

                {selectedItem?.tipo_atividade === 'Colheita' && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Cultura/Produto"
                      fullWidth
                      value={editValues.produto || ''}
                      onChange={e => setEditValues({ ...editValues, produto: e.target.value })}
                    />
                    <TextField
                      label="Quantidade"
                      type="number"
                      fullWidth
                      value={editValues.quantidade || 0}
                      onChange={e => setEditValues({ ...editValues, quantidade: e.target.value })}
                    />
                  </Box>
                )}

                {(selectedItem?.tipo_atividade === 'Compra' || selectedItem?.tipo_atividade === 'Venda') && (
                  <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                    <TextField
                      label="Item/Produto"
                      fullWidth
                      value={editValues.produto || ''}
                      onChange={e => setEditValues({ ...editValues, produto: e.target.value })}
                    />
                    <Box sx={{ display: 'flex', gap: 2 }}>
                      <TextField
                        label="Valor (R$)"
                        type="number"
                        fullWidth
                        value={editValues.valor || 0}
                        onChange={e => setEditValues({ ...editValues, valor: e.target.value })}
                        InputProps={{ startAdornment: <span style={{ marginRight: 4 }}>R$</span> }}
                      />
                      <TextField
                        label="Quantidade"
                        type="number"
                        fullWidth
                        value={editValues.quantidade || 0}
                        onChange={e => setEditValues({ ...editValues, quantidade: e.target.value })}
                      />
                    </Box>
                  </Box>
                )}

                {/* Fallback para outros tipos */}
                {!['Manejo', 'Colheita', 'Compra', 'Venda'].includes(selectedItem?.tipo_atividade) && (
                  <Box sx={{ display: 'flex', gap: 2 }}>
                    <TextField
                      label="Produto"
                      fullWidth
                      value={editValues.produto || ''}
                      onChange={e => setEditValues({ ...editValues, produto: e.target.value })}
                    />
                    <TextField
                      label="Qtd"
                      type="number"
                      fullWidth
                      value={editValues.quantidade || 0}
                      onChange={e => setEditValues({ ...editValues, quantidade: e.target.value })}
                    />
                  </Box>
                )}
              </Box>
            )}

            <TextField
              autoFocus
              label="Justificativa (Obrigatória)"
              fullWidth
              multiline
              rows={2}
              value={justificativa}
              onChange={e => setJustificativa(e.target.value)}
              error={justificativa.length > 0 && justificativa.length < 5}
              helperText="Ex: Erro de digitação, produto errado, duplicidade..."
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={handleClose}>Cancelar</Button>
            <Button
              onClick={handleConfirmAction}
              variant="contained"
              color={actionType === 'DELETE' ? 'error' : 'primary'}
            >
              Confirmar
            </Button>
          </DialogActions>
        </Dialog>
      </Box>

      {/* Dialog de Novo Registro */}
      <ManualRecordDialog
        open={openManualDialog}
        onClose={() => {
          setOpenManualDialog(false);
          setEditingRecord(null);
        }}
        pmoId={internalPmoId}
        recordToEdit={editingRecord}
        onRecordSaved={() => {
          fetchRegistros();
          setOpenManualDialog(false);
          setEditingRecord(null);
        }}
      />

      {/* Snackbar para Feedback Otimista */}
      <Snackbar open={snackbarOpen} autoHideDuration={6000} onClose={handleSnackbarClose}>
        <Alert onClose={handleSnackbarClose} severity={snackbarSeverity} sx={{ width: '100%' }}>
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </Box>
  );
};

export default DiarioDeCampo;
