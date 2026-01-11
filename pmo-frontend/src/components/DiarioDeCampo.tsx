import React, { useEffect, useState } from 'react';
import { supabase } from '../supabaseClient';
import { useAuth } from '../context/AuthContext';
import {
  CircularProgress, Menu, MenuItem, Alert,
  Box, Paper, Table, TableBody, TableCell,
  TableContainer, TableHead, TableRow, Typography,
  Chip, IconButton, Button, Tooltip, Card, CardContent, Stack,
  useMediaQuery, useTheme, Snackbar, TextField, FormControlLabel, Checkbox,
  Dialog, DialogTitle, DialogContent, DialogActions, DialogContentText,
  Popover, InputAdornment
} from '@mui/material';

import FilterListIcon from '@mui/icons-material/FilterList';
import RefreshIcon from '@mui/icons-material/Refresh';
import ScienceIcon from '@mui/icons-material/Science';
import ListAltIcon from '@mui/icons-material/ListAlt';
import AssessmentIcon from '@mui/icons-material/Assessment';
import CalendarTodayIcon from '@mui/icons-material/CalendarToday';
import TrendingUpIcon from '@mui/icons-material/TrendingUp';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import HistoryIcon from '@mui/icons-material/History';
import AddIcon from '@mui/icons-material/Add';
import PlaceIcon from '@mui/icons-material/Place';
import VisibilityIcon from '@mui/icons-material/Visibility';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import BlockIcon from '@mui/icons-material/Block';

// --- IMPORTS CRÍTICOS ---
// 1. Tipos
import { CadernoRegistro, CadernoCampoRecord, ActivityType } from '../types/CadernoTypes';
import FilterAltIcon from '@mui/icons-material/FilterAlt';
import CloseIcon from '@mui/icons-material/Close';
// 2. Serviço (Named Import Corrigido)
import { cadernoService } from '../services/cadernoService';

// --- COMPONENTES FILHOS ---
import ManualRecordDialog from './Dashboard/ManualRecordDialog';
import RecordDetailsDialog from './Dashboard/RecordDetailsDialog';
// import MobileLogCard from './Common/MobileLogCard';

interface DiarioDeCampoProps {
  pmoId?: number;
}

const DiarioDeCampo: React.FC<DiarioDeCampoProps> = ({ pmoId: propPmoId }) => {
  console.log('>>> RESSUSCITAÇÃO: Componente Iniciado');

  const auth = useAuth() as any;
  const user = auth?.user;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  const [internalPmoId, setInternalPmoId] = useState<number | undefined>(propPmoId);
  const [registros, setRegistros] = useState<CadernoRegistro[]>([]);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  // Estados de UI
  const [filtrosAtivos, setFiltrosAtivos] = useState({
    dataInicio: '',
    dataFim: '',
    tipo_atividade: 'Todos',
    produto: '',
    local: '',
    incluirCancelados: false
  });
  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const [colunaAtiva, setColunaAtiva] = useState<string | null>(null);

  // Estados de Dialog
  const [openManualDialog, setOpenManualDialog] = useState(false);
  const [recordToEdit, setRecordToEdit] = useState<CadernoCampoRecord | null>(null);

  // Estados de Delete/Cancelamento
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false);
  const [recordToDelete, setRecordToDelete] = useState<CadernoCampoRecord | null>(null);
  const [deleteReason, setDeleteReason] = useState('');

  // Estados dos Filtros (Excel-style)
  const [filterAnchorEl, setFilterAnchorEl] = useState<null | HTMLElement>(null);
  const [activeFilterColumn, setActiveFilterColumn] = useState<string | null>(null);

  // Estados para Detalhes
  const [selectedRecord, setSelectedRecord] = useState<CadernoCampoRecord | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);

  // 1. Resolver PMO ID
  useEffect(() => {
    const resolvePmo = async () => {
      if (propPmoId) {
        setInternalPmoId(propPmoId);
      } else if (user) {
        try {
          const { data } = await supabase.from('profiles').select('pmo_ativo_id').eq('id', user.id).single();
          if (data?.pmo_ativo_id) setInternalPmoId(data.pmo_ativo_id);
        } catch (e) { console.error(e); }
      }
    };
    resolvePmo();
  }, [propPmoId, user]);

  // 2. Buscar Dados (Blindado)
  useEffect(() => {
    if (internalPmoId) {
      fetchRegistros();
    }
  }, [internalPmoId]);

  const fetchRegistros = async () => {
    if (!internalPmoId) return;
    try {
      setLoading(true);
      setErrorMsg(null);
      console.log('>>> FETCH: Buscando dados para PMO', internalPmoId);

      // VERIFICAÇÃO DE SEGURANÇA
      if (!cadernoService || !cadernoService.getRegistros) {
        throw new Error("SERVIÇO NÃO CARREGADO. Verifique cadernoService.ts");
      }

      const data = await cadernoService.getRegistros(internalPmoId);
      console.log('>>> FETCH: Sucesso', data);
      setRegistros(data || []);
    } catch (error: any) {
      console.error('>>> CRITICAL ERROR:', error);
      setErrorMsg(`Erro: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  // Funções Auxiliares de Renderização
  const getStatusColor = (tipo: string): any => {
    const map: any = { 'Insumo': 'warning', 'Manejo': 'info', 'Plantio': 'success', 'Colheita': 'primary', 'CANCELADO': 'error' };
    return map[tipo] || 'default';
  };

  const handleOpenDetails = (reg: CadernoCampoRecord) => {
    setSelectedRecord(reg);
    setDetailsOpen(true);
  };

  const handleEditRecord = (reg: CadernoCampoRecord) => {
    setRecordToEdit(reg);
    setOpenManualDialog(true);
  };

  const handleCloseManualDialog = () => {
    setOpenManualDialog(false);
    setTimeout(() => setRecordToEdit(null), 200); // Small delay to prevent UI flicker before close
  };

  const handleOpenFilter = (event: React.MouseEvent<HTMLElement>, column: string) => {
    setFilterAnchorEl(event.currentTarget);
    setActiveFilterColumn(column);
  };

  const handleCloseFilter = () => {
    setFilterAnchorEl(null);
    setActiveFilterColumn(null);
  };

  const handleClearFilter = (column: string) => {
    switch (column) {
      case 'data':
        setFiltrosAtivos(prev => ({ ...prev, dataInicio: '', dataFim: '' }));
        break;
      case 'atividade':
        setFiltrosAtivos(prev => ({ ...prev, tipo_atividade: 'Todos' }));
        break;
      case 'produto':
        setFiltrosAtivos(prev => ({ ...prev, produto: '' }));
        break;
      case 'local':
        setFiltrosAtivos(prev => ({ ...prev, local: '' }));
        break;
    }
    // Opcional: fechar o filtro ao limpar ou manter aberto
  };

  const renderFilterContent = () => {
    switch (activeFilterColumn) {
      case 'data':
        return (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 250 }}>
            <Typography variant="subtitle2" fontWeight="bold">Filtrar por Período</Typography>
            <TextField
              label="Data Início"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filtrosAtivos.dataInicio}
              onChange={(e) => setFiltrosAtivos({ ...filtrosAtivos, dataInicio: e.target.value })}
            />
            <TextField
              label="Data Fim"
              type="date"
              size="small"
              fullWidth
              InputLabelProps={{ shrink: true }}
              value={filtrosAtivos.dataFim}
              onChange={(e) => setFiltrosAtivos({ ...filtrosAtivos, dataFim: e.target.value })}
            />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Button size="small" onClick={() => handleClearFilter('data')}>Limpar</Button>
              <Button size="small" variant="contained" onClick={handleCloseFilter}>Aplicar</Button>
            </Box>
          </Box>
        );
      case 'atividade':
        return (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 200 }}>
            <Typography variant="subtitle2" fontWeight="bold">Filtrar por Atividade</Typography>
            <TextField
              select
              label="Selecione"
              size="small"
              fullWidth
              value={filtrosAtivos.tipo_atividade}
              onChange={(e) => setFiltrosAtivos({ ...filtrosAtivos, tipo_atividade: e.target.value })}
            >
              <MenuItem value="Todos">Todas</MenuItem>
              <MenuItem value={ActivityType.PLANTIO}>Plantio</MenuItem>
              <MenuItem value={ActivityType.MANEJO}>Manejo</MenuItem>
              <MenuItem value={ActivityType.COLHEITA}>Colheita</MenuItem>
              <MenuItem value={ActivityType.INSUMO}>Insumo</MenuItem>
              <MenuItem value={ActivityType.OUTRO}>Outro</MenuItem>
              <MenuItem value={ActivityType.CANCELADO}>CANCELADO</MenuItem>
            </TextField>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mt: 1 }}>
              <Button size="small" onClick={() => handleClearFilter('atividade')}>Limpar</Button>
              <Button size="small" variant="contained" onClick={handleCloseFilter}>Aplicar</Button>
            </Box>
          </Box>
        );
      case 'produto':
        return (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 250 }}>
            <Typography variant="subtitle2" fontWeight="bold">Filtrar por Produto</Typography>
            <TextField
              label="Contém..."
              size="small"
              fullWidth
              autoFocus
              value={filtrosAtivos.produto}
              onChange={(e) => setFiltrosAtivos({ ...filtrosAtivos, produto: e.target.value })}
              InputProps={{
                endAdornment: filtrosAtivos.produto && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => handleClearFilter('produto')}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button size="small" variant="contained" onClick={handleCloseFilter}>Aplicar</Button>
            </Box>
          </Box>
        );
      case 'local':
        return (
          <Box sx={{ p: 2, display: 'flex', flexDirection: 'column', gap: 2, minWidth: 250 }}>
            <Typography variant="subtitle2" fontWeight="bold">Filtrar por Local</Typography>
            <TextField
              label="Contém..."
              size="small"
              fullWidth
              autoFocus
              value={filtrosAtivos.local}
              onChange={(e) => setFiltrosAtivos({ ...filtrosAtivos, local: e.target.value })}
              InputProps={{
                endAdornment: filtrosAtivos.local && (
                  <InputAdornment position="end">
                    <IconButton size="small" onClick={() => handleClearFilter('local')}>
                      <CloseIcon fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                )
              }}
            />
            <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 1 }}>
              <Button size="small" variant="contained" onClick={handleCloseFilter}>Aplicar</Button>
            </Box>
          </Box>
        );
      default:
        return null;
    }
  };

  const handleDeleteClick = (reg: CadernoCampoRecord) => {
    setRecordToDelete(reg);
    setDeleteReason('');
    setDeleteDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (!recordToDelete || !deleteReason.trim()) return;

    try {
      setLoading(true);
      const originalObs = recordToDelete.observacao_original || '';
      const cancelObs = `[CANCELADO em ${new Date().toLocaleDateString()}] Motivo: ${deleteReason} | Obs Original: ${originalObs}`;

      await cadernoService.updateRegistro(recordToDelete.id, {
        tipo_atividade: ActivityType.CANCELADO,
        observacao_original: cancelObs
      });

      setDeleteDialogOpen(false);
      setRecordToDelete(null);
      await fetchRegistros();

    } catch (error: any) {
      console.error('Erro ao cancelar registro:', error);
      setErrorMsg(`Erro ao cancelar: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const filteredRegistros = React.useMemo(() => {
    return registros.filter(reg => {
      // 1. Cancelados
      if (!filtrosAtivos.incluirCancelados && reg.tipo_atividade === ActivityType.CANCELADO) return false;

      // 2. Atividade
      if (filtrosAtivos.tipo_atividade !== 'Todos' && reg.tipo_atividade !== filtrosAtivos.tipo_atividade) return false;

      // 3. Produto
      if (filtrosAtivos.produto && !reg.produto?.toLowerCase().includes(filtrosAtivos.produto.toLowerCase())) return false;

      // 4. Local
      if (filtrosAtivos.local && !reg.talhao_canteiro?.toLowerCase().includes(filtrosAtivos.local.toLowerCase())) return false;

      // 5. Data
      if (filtrosAtivos.dataInicio) {
        const regDate = new Date(reg.data_registro);
        const filterDate = new Date(filtrosAtivos.dataInicio);
        // Ajuste para garantir comparação correta de datas ignorando horas
        // Como o input date é YYYY-MM-DD, e o UTC pode jogar para dia anterior, usamos string split para garantir dia local ou setHours com cuidado
        // Simplificação: setHours(0,0,0,0) funciona bem no layout local
        regDate.setHours(0, 0, 0, 0);
        filterDate.setHours(0, 0, 0, 0);
        // Adicionando margem de erro de fuso horário (UTC vs Local)
        // new Date('2025-01-10') cria UTC 00:00. reg.data_registro é ISO UTC.
        // Se o usuário está no Brasil (UTC-3), '2025-01-10T00:00:00Z' é '2025-01-09T21:00:00' local.
        // Para simplificar: converter ambos para string YYYY-MM-DD local pode ser arriscado dependendo do parsing.
        // Vamos usar a comparação direta de timestamp zerado com compensação de timezone se necessário.
        // Assumindo que o input retorna data local 'YYYY-MM-DD'.
        // new Date('YYYY-MM-DD') cria em UTC.
        // Vamos pegar o date string do registro e comparar strings YYYY-MM-DD.
        const regYMD = new Date(reg.data_registro).toISOString().split('T')[0];
        if (regYMD < filtrosAtivos.dataInicio) return false;
      }
      if (filtrosAtivos.dataFim) {
        const regYMD = new Date(reg.data_registro).toISOString().split('T')[0];
        if (regYMD > filtrosAtivos.dataFim) return false;
      }

      return true;
    });
  }, [registros, filtrosAtivos]);

  // Helper para Estilo da Linha (Alertas Visuais)
  const getRowSx = (reg: CadernoCampoRecord) => {
    const obs = reg.observacao_original || '';
    const isError = obs.includes('⛔') || obs.includes('RECUSADO');
    const isWarning = obs.includes('⚠️') || obs.includes('[SISTEMA') || obs.includes('ALERTA');

    if (isError) {
      return {
        bgcolor: (theme: any) => theme.palette.error.light + '20', // Opacidade 20%
        '&:hover': {
          bgcolor: (theme: any) => theme.palette.error.light + '40' // Opacidade 40%
        }
      };
    }
    if (isWarning) {
      return {
        bgcolor: (theme: any) => theme.palette.warning.light + '20',
        '&:hover': {
          bgcolor: (theme: any) => theme.palette.warning.light + '40'
        }
      };
    }
    return {
      '&:hover': { bgcolor: '#f8f9fa' }
    };
  };

  // Helper para Ícone de Alerta na Observação
  const getAlertIcon = (reg: CadernoCampoRecord) => {
    const obs = reg.observacao_original || '';
    if (obs.includes('⛔') || obs.includes('RECUSADO')) {
      return (
        <Tooltip title="Registro Recusado / Bloqueado">
          <BlockIcon color="error" fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
        </Tooltip>
      );
    }
    if (obs.includes('⚠️') || obs.includes('[SISTEMA') || obs.includes('ALERTA')) {
      return (
        <Tooltip title="Alerta do Sistema">
          <ReportProblemIcon color="warning" fontSize="small" sx={{ mr: 1, verticalAlign: 'middle' }} />
        </Tooltip>
      );
    }
    return null;
  };

  // Renderização Simplificada
  return (
    <Box sx={{ mt: 3, mb: 10, width: '100%', display: 'flex', flexDirection: 'column', gap: 3 }}>
      {/* CABEÇALHO */}
      {/* CABEÇALHO E FILTROS */}
      <Paper sx={{ p: 2, bgcolor: '#fff' }}>
        <Stack spacing={2}>
          {/* Header Superior */}
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6" sx={{ display: 'flex', gap: 1, fontWeight: 'bold', alignItems: 'center' }}>
              <ListAltIcon color="primary" /> Diário de Campo
            </Typography>
            <Box>
              <Button variant="outlined" startIcon={<RefreshIcon />} onClick={() => fetchRegistros()} sx={{ mr: 1 }}>
                Recarregar
              </Button>
              <Button variant="contained" color="success" startIcon={<AddIcon />} onClick={() => { setRecordToEdit(null); setOpenManualDialog(true); }}>
                Novo Registro
              </Button>
            </Box>
          </Stack>

          {/* Barra de Ações Superior (Reduzida) */}
          <Box sx={{ display: 'flex', justifyContent: 'flex-end', alignItems: 'center', gap: 2, bgcolor: '#f8f9fa', p: 1, borderRadius: 1 }}>
            <FormControlLabel
              control={
                <Checkbox
                  size="small"
                  checked={filtrosAtivos.incluirCancelados}
                  onChange={(e) => setFiltrosAtivos({ ...filtrosAtivos, incluirCancelados: e.target.checked })}
                />
              }
              label={<Typography variant="body2">Ver Cancelados</Typography>}
            />
          </Box>

          {/* Contador de Resultados */}
          <Typography variant="caption" color="text.secondary">
            Exibindo {filteredRegistros.length} de {registros.length} registros
          </Typography>
        </Stack>
      </Paper>

      {/* ÁREA DE CONTEÚDO */}
      {errorMsg && <Alert severity="error">{errorMsg}</Alert>}

      {loading ? (
        <Box sx={{ display: 'flex', justifyContent: 'center', p: 4 }}><CircularProgress /></Box>
      ) : filteredRegistros.length === 0 ? (
        <Alert severity="info">Nenhum registro encontrado com os filtros selecionados.</Alert>
      ) : (
        <TableContainer component={Paper}>
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#eee' }}>
                <TableCell>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    onClick={(e) => handleOpenFilter(e, 'data')}
                  >
                    Data
                    <FilterListIcon
                      fontSize="small"
                      sx={{ ml: 0.5, opacity: (filtrosAtivos.dataInicio || filtrosAtivos.dataFim) ? 1 : 0.3 }}
                      color={(filtrosAtivos.dataInicio || filtrosAtivos.dataFim) ? "primary" : "inherit"}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    onClick={(e) => handleOpenFilter(e, 'atividade')}
                  >
                    Atividade
                    <FilterListIcon
                      fontSize="small"
                      sx={{ ml: 0.5, opacity: filtrosAtivos.tipo_atividade !== 'Todos' ? 1 : 0.3 }}
                      color={filtrosAtivos.tipo_atividade !== 'Todos' ? "primary" : "inherit"}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    onClick={(e) => handleOpenFilter(e, 'produto')}
                  >
                    Produto
                    <FilterListIcon
                      fontSize="small"
                      sx={{ ml: 0.5, opacity: filtrosAtivos.produto ? 1 : 0.3 }}
                      color={filtrosAtivos.produto ? "primary" : "inherit"}
                    />
                  </Box>
                </TableCell>
                <TableCell>
                  <Box
                    sx={{ display: 'flex', alignItems: 'center', cursor: 'pointer', '&:hover': { color: 'primary.main' } }}
                    onClick={(e) => handleOpenFilter(e, 'local')}
                  >
                    Local
                    <FilterListIcon
                      fontSize="small"
                      sx={{ ml: 0.5, opacity: filtrosAtivos.local ? 1 : 0.3 }}
                      color={filtrosAtivos.local ? "primary" : "inherit"}
                    />
                  </Box>
                </TableCell>
                <TableCell>Resumo</TableCell>
                <TableCell align="center">Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRegistros.map((reg) => {
                const isCancelled = reg.tipo_atividade === ActivityType.CANCELADO;
                return (
                  <TableRow
                    key={reg.id}
                    hover
                    sx={{
                      ...getRowSx(reg),
                      ...(isCancelled && { opacity: 0.6, bgcolor: '#f5f5f5' })
                    }}
                  >
                    <TableCell>{new Date(reg.data_registro).toLocaleDateString()}</TableCell>
                    <TableCell>
                      <Chip label={reg.tipo_atividade} color={getStatusColor(reg.tipo_atividade)} size="small" variant={isCancelled ? 'outlined' : 'filled'} />
                    </TableCell>
                    <TableCell>{reg.produto}</TableCell>
                    <TableCell>{reg.talhao_canteiro}</TableCell>
                    <TableCell sx={{ maxWidth: 200, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {getAlertIcon(reg)}
                      {reg.observacao_original || '-'}
                    </TableCell>
                    <TableCell align="center">
                      <Tooltip title="Ver Detalhes">
                        <IconButton size="small" onClick={() => handleOpenDetails(reg)}>
                          <VisibilityIcon fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      {!isCancelled && (
                        <Tooltip title="Editar Registro">
                          <IconButton size="small" onClick={() => handleEditRecord(reg)} color="primary">
                            <EditIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                      {!isCancelled && (
                        <Tooltip title="Cancelar Registro">
                          <IconButton size="small" onClick={() => handleDeleteClick(reg)} color="error">
                            <DeleteIcon fontSize="small" />
                          </IconButton>
                        </Tooltip>
                      )}
                    </TableCell>
                  </TableRow>
                )
              })}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* DIALOGS */}
      <ManualRecordDialog
        open={openManualDialog}
        onClose={handleCloseManualDialog}
        pmoId={internalPmoId || 0}
        recordToEdit={recordToEdit}
        onRecordSaved={() => {
          fetchRegistros();
        }}
      />

      <RecordDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        record={selectedRecord}
      />

      {/* POPOVER DE FILTROS */}
      <Popover
        open={Boolean(filterAnchorEl)}
        anchorEl={filterAnchorEl}
        onClose={handleCloseFilter}
        anchorOrigin={{
          vertical: 'bottom',
          horizontal: 'left',
        }}
        transformOrigin={{
          vertical: 'top',
          horizontal: 'left',
        }}
      >
        {renderFilterContent()}
      </Popover>

      {/* DIALOG DE CONFIRMAÇÃO DE CANCELAMENTO */}
      <Dialog open={deleteDialogOpen} onClose={() => setDeleteDialogOpen(false)}>
        <DialogTitle>Cancelar Registro?</DialogTitle>
        <DialogContent>
          <DialogContentText sx={{ mb: 2 }}>
            Esta ação marcará o registro como CANCELADO. Ele continuará visível no histórico para fins de auditoria, mas não será mais contabilizado.
          </DialogContentText>
          <TextField
            autoFocus
            margin="dense"
            label="Motivo do Cancelamento"
            placeholder="Ex: Erro de digitação, registro duplicado..."
            fullWidth
            multiline
            rows={3}
            variant="outlined"
            value={deleteReason}
            onChange={(e) => setDeleteReason(e.target.value)}
            error={!deleteReason.trim()}
            helperText={!deleteReason.trim() ? "O motivo é obrigatório" : ""}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDeleteDialogOpen(false)}>Voltar</Button>
          <Button
            onClick={handleConfirmDelete}
            color="error"
            variant="contained"
            disabled={!deleteReason.trim()}
          >
            Confirmar Cancelamento
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default DiarioDeCampo;
