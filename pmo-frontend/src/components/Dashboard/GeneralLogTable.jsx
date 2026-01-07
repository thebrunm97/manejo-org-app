import React, { useState, useEffect } from 'react';
import { supabase } from '../../supabaseClient';
import {
  Box, Paper, Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Typography, Chip, IconButton,
  Tooltip, Dialog, DialogTitle, DialogContent, DialogContentText,
  TextField, DialogActions, Button, FormControlLabel, Switch,
  CircularProgress, useMediaQuery, useTheme, Card, CardContent, Stack, Divider
} from '@mui/material';

import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import HistoryIcon from '@mui/icons-material/History';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import ScienceIcon from '@mui/icons-material/Science';
import MobileLogCard from '../Common/MobileLogCard';

const GeneralLogTable = ({ pmoId }) => {
  const [registros, setRegistros] = useState([]);
  const [loading, setLoading] = useState(false);
  const [showDeleted, setShowDeleted] = useState(false);

  const theme = useTheme();
  // We use CSS display toggling for robustness, but keep hook for minor logic if needed
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estados do Modal
  const [openDialog, setOpenDialog] = useState(false);
  const [actionType, setActionType] = useState('');
  const [selectedItem, setSelectedItem] = useState(null);
  const [justificativa, setJustificativa] = useState('');
  const [editValues, setEditValues] = useState({ produto: '', quantidade: 0 });

  useEffect(() => {
    if (pmoId) fetchRegistros();
  }, [pmoId]);

  const fetchRegistros = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('caderno_campo')
        .select('*')
        .eq('pmo_id', pmoId)
        .order('data_registro', { ascending: false });

      if (error) {
        console.error("Erro ao buscar registros:", error);
        throw error;
      }
      setRegistros(data || []);
    } catch (error) {
      console.error("Erro ao buscar registros:", error);
      console.warn("Detalhes:", error.message);
      setRegistros([]);
    } finally {
      setLoading(false);
    }
  };

  // --- CORREÇÃO DO CRASH (map of undefined) ---
  // Garantir que registros seja sempre um array
  const safeRegistros = (registros && Array.isArray(registros)) ? registros : [];

  const visibleRegistros = (showDeleted
    ? safeRegistros
    : safeRegistros.filter(r => r && r.tipo_atividade !== 'CANCELADO')) || [];

  const handleOpenAction = (item, type) => {
    setSelectedItem(item);
    setActionType(type);
    setJustificativa('');

    if (type === 'EDIT') {
      const tipo = item.tipo_atividade;
      const detalhes = item.detalhes_tecnicos || {};

      // Inicializar campos baseado no tipo de atividade
      if (tipo === 'Manejo') {
        setEditValues({
          atividade: detalhes.atividade || item.observacao_original || '',
          local: item.talhao_canteiro || ''
        });
      } else if (tipo === 'Colheita') {
        setEditValues({
          produto: item.produto || detalhes.produto || detalhes.cultura || '',
          quantidade: item.quantidade_valor || detalhes.qtd || 0
        });
      } else if (tipo === 'Compra' || tipo === 'Venda') {
        setEditValues({
          produto: item.produto || detalhes.produto || '',
          valor: detalhes.valor || item.quantidade_valor || 0,
          quantidade: detalhes.qtd || item.quantidade_valor || 0
        });
      } else {
        // Fallback para outros tipos
        setEditValues({
          produto: item.produto || '',
          quantidade: item.quantidade_valor || 0
        });
      }
    }
    setOpenDialog(true);
  };

  const handleClose = () => {
    setOpenDialog(false);
    setSelectedItem(null);
  };

  const handleConfirmAction = async () => {
    if (justificativa.length < 5) {
      alert("A justificativa é obrigatória (mínimo 5 letras).");
      return;
    }

    try {
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

      let updatePayload = {};

      if (actionType === 'DELETE') {
        updatePayload = {
          tipo_atividade: 'CANCELADO',
          observacao_original: `[CANCELADO] ${selectedItem.observacao_original}`,
          detalhes_tecnicos: newDetails
        };
      } else if (actionType === 'EDIT') {
        const tipo = selectedItem.tipo_atividade;

        // Construir payload baseado no tipo de atividade
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
          // Fallback para outros tipos
          updatePayload = {
            produto: editValues.produto?.toUpperCase() || selectedItem.produto,
            quantidade_valor: parseFloat(editValues.quantidade) || 0,
            detalhes_tecnicos: newDetails
          };
        }
      }

      const { data, error } = await supabase
        .from('caderno_campo')
        .update(updatePayload)
        .eq('id', selectedItem.id)
        .select();

      if (error) throw error;

      if (!data || data.length === 0) {
        alert("⚠️ ATENÇÃO: O banco recusou a alteração. Verifique se o usuário tem permissão (RLS) no Supabase.");
        return;
      }

      await fetchRegistros();
      handleClose();

    } catch (err) {
      alert("Erro ao salvar: " + err.message);
    }
  };

  const getStatusColor = (tipo) => {
    const map = {
      'Insumo': 'warning', 'Manejo': 'info', 'Plantio': 'success',
      'Colheita': 'primary', 'CANCELADO': 'error'
    };
    return map[tipo] || 'default';
  };



  if (!pmoId) return (
    <Box sx={{ p: 3, textAlign: 'center', color: 'text.secondary' }}>
      Carregando caderno...
    </Box>
  );

  return (
    <Box sx={{ mt: 0, p: 2, bgcolor: '#fff', borderRadius: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 2 }}>
        <Typography variant="h6" sx={{ display: 'flex', alignItems: 'center', gap: 1, fontWeight: 'bold' }}>
          <ListAltIcon /> Diário de Campo Completo (Auditoria)
        </Typography>

        <FormControlLabel
          control={<Switch checked={showDeleted} onChange={(e) => setShowDeleted(e.target.checked)} color="error" />}
          label="Ver Excluídos"
        />
      </Box>

      {/* --- DESKTOP TABLE --- */}
      <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
        <TableContainer component={Paper} elevation={0} sx={{ border: '1px solid #eee', maxHeight: 500, width: '100%', overflowX: 'auto' }}>
          <Table stickyHeader size="small" sx={{ minWidth: 650 }}>
            <TableHead>
              <TableRow>
                <TableCell sx={{ width: '120px' }}>Data</TableCell>
                <TableCell sx={{ width: '120px' }}>Atividade</TableCell>
                <TableCell sx={{ width: '25%' }}>Produto / Local</TableCell>
                <TableCell sx={{ width: '10%' }}>Qtd</TableCell>
                <TableCell>Observação</TableCell>
                <TableCell align="right" sx={{ width: '80px' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {loading ? (
                <TableRow><TableCell colSpan={6} align="center"><CircularProgress size={24} sx={{ my: 2 }} /></TableCell></TableRow>
              ) : (visibleRegistros || []).length === 0 ? (
                <TableRow><TableCell colSpan={6} align="center" sx={{ py: 3 }}>Nenhum registro encontrado.</TableCell></TableRow>
              ) : (
                (visibleRegistros || []).map((row) => {
                  if (!row) return null; // Proteção contra linhas nulas
                  const isCancelado = row.tipo_atividade === 'CANCELADO';
                  const historico = row.detalhes_tecnicos?.historico_alteracoes || [];
                  const ultimaJustificativa = historico.length > 0 ? historico[historico.length - 1].motivo : null;

                  return (
                    <TableRow
                      key={row.id}
                      sx={{
                        bgcolor: isCancelado ? '#fff5f5' : 'inherit',
                        opacity: isCancelado ? 0.8 : 1
                      }}
                    >
                      <TableCell>{new Date(row.data_registro).toLocaleDateString('pt-BR')}</TableCell>
                      <TableCell>
                        <Chip
                          label={row.tipo_atividade}
                          color={getStatusColor(row.tipo_atividade)}
                          size="small"
                          variant={isCancelado ? "outlined" : "filled"}
                        />
                      </TableCell>
                      <TableCell>
                        <strong style={{ textDecoration: isCancelado ? 'line-through' : 'none', color: isCancelado ? '#d32f2f' : 'inherit' }}>
                          {row.produto}
                        </strong>
                        <Typography variant="caption" display="block" color="text.secondary">
                          {row.talhao_canteiro !== 'NÃO INFORMADO' ? row.talhao_canteiro : ''}
                        </Typography>
                      </TableCell>
                      <TableCell>{row.quantidade_valor} {row.quantidade_unidade}</TableCell>

                      <TableCell sx={{ maxWidth: 300 }}>
                        <Tooltip title={row.observacao_original}>
                          <Typography variant="body2" noWrap sx={{ textDecoration: isCancelado ? 'line-through' : 'none', color: isCancelado ? 'text.secondary' : 'text.primary' }}>
                            {row.observacao_original}
                          </Typography>
                        </Tooltip>

                        {isCancelado && ultimaJustificativa && (
                          <Box sx={{ mt: 1, p: 0.5, px: 1, bgcolor: '#ffebee', borderRadius: 1, border: '1px dashed #ef5350', display: 'inline-block' }}>
                            <Typography variant="caption" color="error" sx={{ fontWeight: 'bold' }}>
                              MOTIVO: {ultimaJustificativa}
                            </Typography>
                          </Box>
                        )}
                      </TableCell>

                      <TableCell align="right">
                        {!isCancelado ? (
                          <>
                            <Tooltip title="Corrigir">
                              <IconButton size="small" color="primary" onClick={() => handleOpenAction(row, 'EDIT')}>
                                <EditIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                            <Tooltip title="Invalidar">
                              <IconButton size="small" color="error" onClick={() => handleOpenAction(row, 'DELETE')}>
                                <DeleteIcon fontSize="small" />
                              </IconButton>
                            </Tooltip>
                          </>
                        ) : (
                          <Tooltip title="Registro Auditado">
                            <IconButton size="small" disabled><HistoryIcon /></IconButton>
                          </Tooltip>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })
              )}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>

      {/* --- MOBILE CARDS --- */}
      <Box sx={{ display: { xs: 'block', sm: 'none' } }}>
        {loading ? (
          <Box sx={{ display: 'flex', justifyContent: 'center', p: 3 }}><CircularProgress /></Box>
        ) : (visibleRegistros || []).length === 0 ? (
          <Paper elevation={0} sx={{ p: 4, textAlign: 'center', color: 'text.secondary', bgcolor: '#f5f5f5', borderRadius: 2 }}>
            <Typography>Nenhum registro encontrado.</Typography>
          </Paper>
        ) : (
          (visibleRegistros || []).map((row) => (
            <MobileLogCard
              key={row.id}
              reg={row}
              onEdit={(item) => handleOpenAction(item, 'EDIT')}
              onDelete={(item) => handleOpenAction(item, 'DELETE')}
            />
          ))
        )}
      </Box>

      <Dialog open={openDialog} onClose={handleClose}>
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
            autoFocus label="Justificativa (Obrigatória)" fullWidth multiline rows={2}
            value={justificativa} onChange={e => setJustificativa(e.target.value)}
            error={justificativa.length > 0 && justificativa.length < 5}
            helperText="Ex: Erro de digitação, produto errado, duplicidade..."
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleClose}>Cancelar</Button>
          <Button onClick={handleConfirmAction} variant="contained" color={actionType === 'DELETE' ? 'error' : 'primary'}>
            Confirmar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default GeneralLogTable;