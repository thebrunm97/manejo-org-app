import React, { useState } from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button,
  TextField, Typography, IconButton, FormControl, Select, MenuItem,
  InputLabel, Dialog, DialogTitle, DialogContent, DialogActions,
  Grid, FormControlLabel, Radio, RadioGroup, Stack, Divider, Alert
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import SproutIcon from '@mui/icons-material/Spa'; // Ícone para Empty State
import PropagacaoCard from './cards/PropagacaoCard'; // Importando o Card criado

// Função auxiliar para gerar ID único
const generateUniqueId = () => `item_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

function Secao9MUI({ data, onSectionChange }) {
  const safeData = data || {};

  // Estados do Modal
  const [modalOpen, setModalOpen] = useState(false);
  const [currentListKey, setCurrentListKey] = useState(null); // 'sementes_mudas_organicas' ou 'sementes_mudas_nao_organicas'
  const [editingItem, setEditingItem] = useState(null); // Se null, é modo de criação

  // Handler Genérico para campos de texto (Accordions 9.2, 9.3, 9.5, 9.6)
  const handleChange = (e) => {
    const { name, value } = e.target;
    // Estrutura específica do JSON do Supabase exige objeto aninhado em alguns casos, 
    // mas aqui simplificamos assumindo que o pai trata ou o formato é plano.
    // Verificando o formato original: { [name]: { [name]: value } }
    onSectionChange({ ...safeData, [name]: { [name]: value } });
  };

  // --- LÓGICA DO CRUD (CARDS & MODAL) ---

  const handleAddNew = (listKey) => {
    setCurrentListKey(listKey);
    setEditingItem({
      _id: generateUniqueId(),
      tipo: 'semente',
      especies: '',
      origem: '',
      quantidade: '',
      sistema_organico: true, // Padrão
      data_compra: ''
    });
    setModalOpen(true);
  };

  const handleEdit = (listKey, item) => {
    setCurrentListKey(listKey);
    setEditingItem({ ...item }); // Cópia para edição
    setModalOpen(true);
  };

  const handleDelete = (listKey, itemId) => {
    if (window.confirm('Tem certeza que deseja remover este item?')) {
      const list = safeData[listKey] || [];
      const newList = list.filter(i => i._id !== itemId);
      onSectionChange({ ...safeData, [listKey]: newList });
    }
  };

  const handleSaveModal = () => {
    if (!editingItem.especies) {
      alert('Por favor, informe a espécie/cultivar.');
      return;
    }

    const list = Array.isArray(safeData[currentListKey]) ? [...safeData[currentListKey]] : [];
    const index = list.findIndex(i => i._id === editingItem._id);

    if (index >= 0) {
      // Atualizar existente
      list[index] = editingItem;
    } else {
      // Adicionar novo
      list.push(editingItem);
    }

    onSectionChange({ ...safeData, [currentListKey]: list });
    setModalOpen(false);
    setEditingItem(null);
  };

  // Renderiza a lista de Cards
  const renderCardList = (listKey) => {
    const list = safeData[listKey] || [];

    if (list.length === 0) {
      return (
        <Box sx={{
          textAlign: 'center', py: 4, px: 2,
          bgcolor: '#f5f5f5', borderRadius: 2,
          border: '1px dashed #bdbdbd'
        }}>
          <SproutIcon sx={{ fontSize: 48, color: '#9e9e9e', mb: 1 }} />
          <Typography variant="body1" color="textSecondary">
            Nenhum item cadastrado nesta seção.
          </Typography>
          <Button
            startIcon={<AddCircleOutlineIcon />}
            onClick={() => handleAddNew(listKey)}
            sx={{ mt: 2 }}
          >
            Adicionar Agora
          </Button>
        </Box>
      );
    }

    return (
      <Stack spacing={2}>
        {list.map((item) => (
          <PropagacaoCard
            key={item._id || Math.random()}
            item={item}
            onEdit={() => handleEdit(listKey, item)}
            onDelete={() => handleDelete(listKey, item._id)}
          />
        ))}
        <Button
          startIcon={<AddCircleOutlineIcon />}
          variant="outlined"
          onClick={() => handleAddNew(listKey)}
        >
          Adicionar Outro
        </Button>
      </Stack>
    );
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2, textAlign: 'left', color: '#16a34a', fontWeight: 'bold' }}>
        Seção 9: Propagação Vegetal
      </Typography>

      {/* 9.1 - Sementes/Mudas Orgânicas */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>9.1. Origem das sementes/mudas (Produção Orgânica)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>
            Descreva a procedência de todas as espécies cultivadas no sistema orgânico.
          </Typography>
          {renderCardList('sementes_mudas_organicas')}
        </AccordionDetails>
      </Accordion>

      {/* 9.2 - Tratamento */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>9.2. Tratamento das sementes/mudas</Typography></AccordionSummary>
        <AccordionDetails>
          <TextField
            name="tratamento_sementes_mudas"
            label="Especifique se houver tratamento"
            value={safeData.tratamento_sementes_mudas?.tratamento_sementes_mudas || ''}
            onChange={handleChange}
            fullWidth multiline rows={3} variant="outlined"
          />
        </AccordionDetails>
      </Accordion>

      {/* 9.3 - Produção Própria */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>9.3. Manejo de produção própria</Typography></AccordionSummary>
        <AccordionDetails>
          <TextField
            name="manejo_producao_propria"
            label="Composição do substrato e tratamentos"
            value={safeData.manejo_producao_propria?.manejo_producao_propria || ''}
            onChange={handleChange}
            fullWidth multiline rows={3} variant="outlined"
          />
        </AccordionDetails>
      </Accordion>

      {/* 9.4 - Sementes/Mudas NÃO Orgânicas */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>9.4. Origem das sementes/mudas (Não Orgânicas)</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Alert severity="warning" sx={{ mb: 2 }}>
            Atenção: O uso de sementes não orgânicas requer justificativa e autorização.
          </Alert>
          {renderCardList('sementes_mudas_nao_organicas')}
        </AccordionDetails>
      </Accordion>

      {/* 9.5 & 9.6 - Transgênicos */}
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>9.5. Postura sobre transgênicos (Orgânico)</Typography></AccordionSummary>
        <AccordionDetails>
          <TextField
            name="postura_uso_materiais_transgenicos_organica"
            value={safeData.postura_uso_materiais_transgenicos_organica?.postura_uso_materiais_transgenicos_organica || ''}
            onChange={handleChange}
            fullWidth multiline rows={3}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>9.6. Cuidados com transgênicos (Não Orgânico)</Typography></AccordionSummary>
        <AccordionDetails>
          <TextField
            name="cuidados_uso_materiais_transgenicos_nao_organica"
            value={safeData.cuidados_uso_materiais_transgenicos_nao_organica?.cuidados_uso_materiais_transgenicos_nao_organica || ''}
            onChange={handleChange}
            fullWidth multiline rows={3}
          />
        </AccordionDetails>
      </Accordion>

      {/* --- MODAL DE EDIÇÃO/CRIAÇÃO --- */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle sx={{ bgcolor: '#16a34a', color: 'white' }}>
          {editingItem?._id ? 'Editar Item' : 'Novo Item'}
        </DialogTitle>
        <DialogContent dividers>
          <Grid container spacing={2} sx={{ mt: 0.5 }}>

            <Grid size={{ xs: 12, sm: 6 }}>
              <FormControl fullWidth>
                <InputLabel>Tipo</InputLabel>
                <Select
                  value={editingItem?.tipo || 'semente'}
                  label="Tipo"
                  onChange={(e) => setEditingItem({ ...editingItem, tipo: e.target.value })}
                >
                  <MenuItem value="semente">Semente</MenuItem>
                  <MenuItem value="muda">Muda</MenuItem>
                </Select>
              </FormControl>
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Data da Compra"
                type="date"
                fullWidth
                InputLabelProps={{ shrink: true }}
                value={editingItem?.data_compra ? editingItem.data_compra.split('T')[0] : ''}
                onChange={(e) => setEditingItem({ ...editingItem, data_compra: e.target.value })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Espécie / Cultivar"
                placeholder="Ex: Alface Crespa, Tomate Italiano"
                fullWidth
                required
                value={editingItem?.especies || ''}
                onChange={(e) => setEditingItem({ ...editingItem, especies: e.target.value })}
              />
            </Grid>

            <Grid size={{ xs: 12 }}>
              <TextField
                label="Origem (Fornecedor)"
                placeholder="Ex: Agropecuária Silva, Sementes Isla"
                fullWidth
                value={editingItem?.origem || ''}
                onChange={(e) => setEditingItem({ ...editingItem, origem: e.target.value })}
              />
            </Grid>

            <Grid size={{ xs: 12, sm: 6 }}>
              <TextField
                label="Quantidade"
                placeholder="Ex: 50g, 100 mudas"
                fullWidth
                value={editingItem?.quantidade || ''}
                onChange={(e) => setEditingItem({ ...editingItem, quantidade: e.target.value })}
              />
            </Grid>

            {/* Campo "Sistema Orgânico" aparece apenas na lista 9.1 */}
            {currentListKey === 'sementes_mudas_organicas' && (
              <Grid size={{ xs: 12, sm: 6 }}>
                <Typography variant="caption" display="block" gutterBottom>
                  Certificação Orgânica?
                </Typography>
                <RadioGroup
                  row
                  value={editingItem?.sistema_organico ? 'sim' : 'nao'}
                  onChange={(e) => setEditingItem({ ...editingItem, sistema_organico: e.target.value === 'sim' })}
                >
                  <FormControlLabel value="sim" control={<Radio color="success" />} label="Sim" />
                  <FormControlLabel value="nao" control={<Radio color="default" />} label="Não" />
                </RadioGroup>
              </Grid>
            )}

          </Grid>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setModalOpen(false)} color="inherit">Cancelar</Button>
          <Button onClick={handleSaveModal} variant="contained" sx={{ bgcolor: '#16a34a' }}>
            Salvar
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
}

export default Secao9MUI;