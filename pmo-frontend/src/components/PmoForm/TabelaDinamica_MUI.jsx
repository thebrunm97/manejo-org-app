// src/components/PmoForm/TabelaDinamica_MUI.jsx (VERSÃO RESPONSIVE TABLE-TO-CARD REFINADA)

import React, { useEffect, useState } from 'react';
import {
  Table, TableBody, TableCell, TableContainer,
  TableHead, TableRow, Paper, TextField, Button,
  Typography, IconButton, Box, FormControl, Select, MenuItem, Tooltip,
  useMediaQuery, useTheme, Card, CardContent, Divider, Chip, Stack, Grid,
  Collapse
} from '@mui/material';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';
import EditIcon from '@mui/icons-material/Edit';
import SaveIcon from '@mui/icons-material/Save';
import MapIcon from '@mui/icons-material/Map';
import AccessTimeIcon from '@mui/icons-material/AccessTime';
import LocalizacaoSafInput from './LocalizacaoSafInput';
import SeletorLocalizacaoSaf from './SeletorLocalizacaoSaf';

// Função para gerar um ID simples e único
const generateUniqueId = () => `row_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function TabelaDinamicaMUI({ title, columns = [], data = [], onDataChange, itemName = 'Item', itemNoun = 'o' }) {
  const theme = useTheme();
  // Detecção de Mobile (Table -> Cards)
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));

  // Estado para controlar qual CARD está em modo de edição (apenas mobile)
  const [editingId, setEditingId] = useState(null);

  // ==================================================================
  // ||      ESTADO INTERNO APENAS PARA GERENCIAR OS IDs ÚNICOS      ||
  // ==================================================================
  const [tableData, setTableData] = useState([]);

  useEffect(() => {
    // Sincroniza dados externos com internos, preservando IDs se existirem
    const dataWithIds = (Array.isArray(data) ? data : []).map(item => ({
      ...item,
      _id: item._id || generateUniqueId(),
    }));
    setTableData(dataWithIds);
  }, [data]);

  const handleItemChange = (id, fieldKey, value) => {
    const newData = (tableData || []).map(item => {
      if (item._id !== id) return item;
      return { ...item, [fieldKey]: value };
    });
    // Atualiza imediatamente o pai (Controlled Component)
    // No mobile, isso acontece enquanto o usuário digita no modo de edição
    onDataChange(newData);
  };

  const adicionarItem = () => {
    const novoItem = columns.reduce((acc, col) => {
      acc[col.key] = '';
      if (col.unitSelector) {
        acc[col.unitSelector.key] = col.unitSelector.options[0] || '';
      }
      return acc;
    }, {});

    const newId = generateUniqueId();
    novoItem._id = newId;

    // Se for mobile, já abre o novo item em modo de edição
    if (isMobile) {
      setEditingId(newId);
    }

    onDataChange([...tableData, novoItem]);
  };

  const removerItem = (id) => {
    if (window.confirm(`Tem certeza que deseja remover este ${itemName}?`)) {
      const newData = tableData.filter(item => item._id !== id);
      onDataChange(newData);
      if (editingId === id) setEditingId(null);
    }
  };

  const toggleEdit = (id) => {
    if (editingId === id) {
      // Salvar/Fechar
      setEditingId(null);
    } else {
      // Abrir Edição
      setEditingId(id);
    }
  };

  // --- HELPER: Exibir Valor Texto (Read-Only) ---
  const renderValue = (item, col) => {
    const val = item[col.key];

    // Suporte a Objetos (ex: Selectores Avançados que retornam { label: '...', id: '...' })
    if (val && typeof val === 'object' && val._display) {
      return val._display;
    }
    if (val && typeof val === 'object' && (val.talhao_nome || val.canteiro_nome)) {
      return `${val.talhao_nome || ''} > ${val.canteiro_nome || ''}`;
    }

    if (col.unitSelector) {
      return val ? `${val} ${item[col.unitSelector.key] || ''}` : '-';
    }
    return val || '-';
  };

  // --- HELPER: Renderizar Input (Form) ---
  const renderField = (item, col) => {
    if (col.type === 'saf_visual') {
      return (
        <SeletorLocalizacaoSaf
          value={item[col.key] || ''}
          onChange={(newValue) => handleItemChange(item._id, col.key, newValue)}
        />
      );
    }

    if (col.type === 'saf_location') {
      return (
        <LocalizacaoSafInput
          value={item[col.key] || ''}
          onChange={(newValue) => handleItemChange(item._id, col.key, newValue)}
          size="small"
        />
      );
    }

    if (col.unitSelector) {
      return (
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <TextField
            type={col.type || 'text'}
            value={item[col.key] || ''}
            onChange={(e) => handleItemChange(item._id, col.key, e.target.value)}
            variant="outlined"
            size="small"
            fullWidth
            label={isMobile ? col.header : undefined}
            placeholder={col.header}
          />
          <FormControl variant="outlined" size="small" sx={{ minWidth: 80 }}>
            <Select
              value={item[col.unitSelector.key] || (col.unitSelector.options && col.unitSelector.options.length > 0 ? col.unitSelector.options[0] : '')}
              onChange={(e) => handleItemChange(item._id, col.unitSelector.key, e.target.value)}
            >
              {(col.unitSelector.options || []).map(opt => <MenuItem key={opt} value={opt}>{opt}</MenuItem>)}
            </Select>
          </FormControl>
        </Box>
      );
    }

    return (
      <TextField
        type={col.type || 'text'}
        value={item[col.key] || ''}
        onChange={(e) => handleItemChange(item._id, col.key, e.target.value)}
        variant="outlined"
        size="small"
        fullWidth
        label={isMobile ? col.header : undefined}
        placeholder={col.header}
      />
    );
  };

  // --- SMART CARD LOGIC ---
  const getCardMap = (cols) => {
    // 1. Título (Produto/Cultura)
    const titleCol = cols.find(c => ['produto', 'cultura', 'especie', 'nome'].includes(c.key)) || cols[0];

    // 2. Badge (Atividade/Tipo/Status) -> Tenta encontrar colunas típicas
    const badgeCol = cols.find(c => ['atividade', 'tipo', 'status', 'categoria', 'operacao', 'manejo'].includes(c.key));

    // 3. Subtítulo (Local, Talhão)
    const subtitleCol = cols.find(c => ['talhoes_canteiros', 'local', 'localizacao'].includes(c.key));

    // 4. Data (para o header direito)
    const dateCol = cols.find(c => ['data', 'periodo', 'epoca', 'frequencia'].includes(c.key));

    // 5. Footer/Quantidade (com destaque)
    const footerCol = cols.find(c => c.unitSelector || ['quantidade', 'area_plantada', 'producao_esperada_ano', 'n_de_animais'].includes(c.key));

    return { titleCol, badgeCol, subtitleCol, dateCol, footerCol };
  };

  const { titleCol, badgeCol, subtitleCol, dateCol, footerCol } = getCardMap(columns);

  return (
    <Box sx={{ my: 2 }}>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1 }}>
        {title && <Typography variant="h6" sx={{ fontWeight: 600, color: '#2c3e50' }}>{title}</Typography>}
        {isMobile && (
          <Button
            variant="contained"
            size="small"
            startIcon={<AddCircleOutlineIcon />}
            onClick={adicionarItem}
            sx={{ textTransform: 'none', borderRadius: 2 }}
          >
            Adicionar
          </Button>
        )}
      </Box>

      {/* --- MOBILE VIEW: SMART CARDS (ADAPTIVE RENDERING) --- */}
      {isMobile ? (
        <Stack spacing={2}>
          {(tableData || []).map((item) => {
            const isEditing = editingId === item._id;

            return (
              <Card key={item._id} elevation={2} sx={{
                borderRadius: 3,
                border: isEditing ? `1.5px solid ${theme.palette.primary.main}` : 'none',
                transition: 'all 0.2s ease'
              }}>
                {/* --- MODO LEITURA (CARD FEED) --- */}
                {!isEditing && (
                  <CardContent sx={{ pb: '16px !important', pt: 2, px: 2 }}>

                    {/* 1. HEADER ROW: Chip (Atividade) | Data */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 1.5 }}>
                      <Box>
                        {badgeCol && item[badgeCol.key] ? (
                          <Chip
                            label={item[badgeCol.key]}
                            size="small"
                            color="success" // Padrão verde como solicitado (pode ser dinâmico no futuro)
                            variant="filled" // Filled para destaque
                            sx={{ height: 24, fontSize: '0.75rem', fontWeight: 600 }}
                          />
                        ) : (
                          // Fallback visual se não tiver badge
                          <Chip label={itemNoun === 'o' ? 'Registro' : 'Item'} size="small" variant="outlined" sx={{ height: 24, opacity: 0.7 }} />
                        )}
                      </Box>

                      <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5, color: 'text.secondary' }}>
                        {dateCol && item[dateCol.key] && (
                          <>
                            <AccessTimeIcon sx={{ fontSize: 14 }} />
                            <Typography variant="caption" sx={{ fontWeight: 500 }}>
                              {renderValue(item, dateCol)}
                            </Typography>
                          </>
                        )}
                      </Box>
                    </Box>

                    {/* 2. BODY: Título Destaque | Localização */}
                    <Box sx={{ mb: 2 }}>
                      <Typography variant="h6" sx={{ fontWeight: 800, lineHeight: 1.2, color: '#1e293b', mb: 0.5 }}>
                        {renderValue(item, titleCol)}
                      </Typography>

                      {subtitleCol && (
                        <Box sx={{ display: 'flex', alignItems: 'flex-start', gap: 0.5, color: '#64748b' }}>
                          <MapIcon sx={{ fontSize: 18, mt: 0.2 }} />
                          <Typography variant="body2" sx={{ fontWeight: 500 }}>
                            {renderValue(item, subtitleCol) || 'Sem local definido'}
                          </Typography>
                        </Box>
                      )}
                    </Box>

                    <Divider sx={{ my: 1.5, opacity: 0.6 }} />

                    {/* 3. FOOTER: Valor/Qtd | Ações */}
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>

                      {/* Valor em Destaque */}
                      <Box>
                        {footerCol && (
                          <Box>
                            <Typography variant="caption" color="text.secondary" sx={{ display: 'block', mb: -0.5 }}>
                              {footerCol.header}
                            </Typography>
                            <Typography variant="body1" fontWeight={800} color="primary.main">
                              {renderValue(item, footerCol)}
                            </Typography>
                          </Box>
                        )}
                      </Box>

                      {/* Botões de Ação (Large Touch Area) */}
                      <Box sx={{ display: 'flex', gap: 0 }}>
                        <Tooltip title="Editar">
                          <IconButton
                            onClick={() => toggleEdit(item._id)}
                            color="primary"
                            sx={{
                              padding: 1.5, // Touch target maior
                              '&:hover': { bgcolor: 'primary.50' }
                            }}
                          >
                            <EditIcon />
                          </IconButton>
                        </Tooltip>
                        <Tooltip title="Remover">
                          <IconButton
                            onClick={() => removerItem(item._id)}
                            color="error"
                            sx={{
                              padding: 1.5, // Touch target maior
                              '&:hover': { bgcolor: 'error.50' }
                            }}
                          >
                            <DeleteIcon />
                          </IconButton>
                        </Tooltip>
                      </Box>
                    </Box>
                  </CardContent>
                )}

                {/* --- MODO EDIÇÃO (EXPANDIDO) --- */}
                <Collapse in={isEditing}>
                  <Box sx={{ p: 2, bgcolor: '#f8fafc', borderTop: '1px solid #e2e8f0' }}>
                    <Stack spacing={2}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <Typography variant="caption" fontWeight="bold" color="primary">EDITAR REGISTRO</Typography>
                        <IconButton size="small" onClick={() => setEditingId(null)}>
                          <AccessTimeIcon sx={{ fontSize: 16 }} /> {/* Icon placeholder for close/minimize if needed */}
                        </IconButton>
                      </Box>

                      <Grid container spacing={2}>
                        {(columns || []).map(col => (
                          <Grid size={{ xs: 12 }} key={col.key}>
                            {renderField(item, col)}
                          </Grid>
                        ))}
                      </Grid>

                      <Box sx={{ display: 'flex', gap: 1, mt: 1 }}>
                        <Button
                          variant="outlined"
                          color="inherit"
                          onClick={() => setEditingId(null)}
                          fullWidth
                          sx={{ borderRadius: 2 }}
                        >
                          Cancelar
                        </Button>
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<SaveIcon />}
                          onClick={() => setEditingId(null)}
                          fullWidth
                          sx={{ borderRadius: 2, fontWeight: 'bold' }}
                        >
                          Salvar
                        </Button>
                      </Box>
                    </Stack>
                  </Box>
                </Collapse>
              </Card>
            );
          })}

          {tableData.length === 0 && (
            <Paper variant="outlined" sx={{ py: 4, textAlign: 'center', bgcolor: '#f8f9fa', borderStyle: 'dashed', borderRadius: 2 }}>
              <Typography variant="body2" color="text.secondary">
                Nenhum item registrado.
              </Typography>
              <Button
                startIcon={<AddCircleOutlineIcon />}
                onClick={adicionarItem}
                sx={{ mt: 1, textTransform: 'none' }}
              >
                Adicionar Primeiro Item
              </Button>
            </Paper>
          )}
        </Stack>
      ) : (
        /* --- DESKTOP VIEW: TABLE (MANTIDO) --- */
        <TableContainer component={Paper} variant="outlined">
          <Table size="small">
            <TableHead>
              <TableRow sx={{ bgcolor: '#f8fafc' }}>
                {(columns || []).map(col => <TableCell key={col.key} sx={{ fontWeight: '700', color: '#475569' }}>{col.header}</TableCell>)}
                <TableCell align="center" sx={{ fontWeight: '700', width: '90px', color: '#475569' }}>Ações</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {(tableData || []).map((item) => (
                <TableRow key={item._id} hover>
                  {(columns || []).map(col => (
                    <TableCell key={col.key}>
                      {renderField(item, col)}
                    </TableCell>
                  ))}
                  <TableCell align="center">
                    <Tooltip title="Remover item">
                      <IconButton onClick={() => removerItem(item._id)} color="error" size="small">
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Tooltip>
                  </TableCell>
                </TableRow>
              ))}
              {tableData.length === 0 && (
                <TableRow>
                  <TableCell colSpan={columns.length + 1} align="center" sx={{ py: 3, color: 'text.secondary' }}>
                    Nenhum registro adicionado.
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </TableContainer>
      )}

      {/* Botão Adicionar (Desktop) */}
      {!isMobile && (
        <Button
          type="button"
          startIcon={<AddCircleOutlineIcon />}
          onClick={adicionarItem}
          sx={{ mt: 2, textTransform: 'none', fontWeight: 600 }}
        >
          Adicionar nov{itemNoun} {itemName}
        </Button>
      )}
    </Box>
  );
}

export default TabelaDinamicaMUI;