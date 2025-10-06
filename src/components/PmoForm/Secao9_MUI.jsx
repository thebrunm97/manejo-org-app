// src/components/PmoForm/Secao9_MUI.jsx (Com a lógica da tabela 9.4 corrigida)

import React from 'react';
import {
  Accordion, AccordionDetails, AccordionSummary, Box, Button, Table, TableBody,
  TableCell, TableContainer, TableHead, TableRow, Paper, TextField,
  Typography, Radio, IconButton, FormControl, Select, MenuItem
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import DeleteIcon from '@mui/icons-material/Delete';

// Tabela customizada para 9.1 (Produção Orgânica)
const TabelaOrigemOrganicaMUI = ({ data, onDataChange }) => {
  const safeData = Array.isArray(data) ? data : [];

  const handleItemChange = (index, field, value) => {
    const newData = [...safeData];
    newData[index][field] = value;
    onDataChange(newData);
  };

  const adicionarItem = () => onDataChange([...safeData, { tipo: '', especies: '', origem: '', quantidade: '', sistema_organico: null, data_compra: '' }]);
  const removerItem = (index) => onDataChange(safeData.filter((_, i) => i !== index));

  return (
    <Box>
      <Typography variant="body2" color="textSecondary" sx={{ mb: 2 }}>É necessário descrever a procedência para todas as espécies cultivadas.</Typography>
      <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Espécies/Cultivares</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Origem (Fornecedor)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantidade</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Sistema Orgânico?</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Data da Compra</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <FormControl fullWidth variant="standard">
                    <Select value={item.tipo || ''} onChange={(e) => handleItemChange(index, 'tipo', e.target.value)}>
                      <MenuItem value="semente">Semente</MenuItem>
                      <MenuItem value="muda">Muda</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell><TextField variant="standard" fullWidth value={item.especies || ''} onChange={(e) => handleItemChange(index, 'especies', e.target.value)} /></TableCell>
                <TableCell><TextField variant="standard" fullWidth value={item.origem || ''} onChange={(e) => handleItemChange(index, 'origem', e.target.value)} /></TableCell>
                <TableCell><TextField variant="standard" fullWidth value={item.quantidade || ''} onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)} /></TableCell>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <Radio checked={item.sistema_organico === true} onChange={() => handleItemChange(index, 'sistema_organico', true)} name={`org-${index}`} /> <Typography variant="body2">Sim</Typography>
                    <Radio checked={item.sistema_organico === false} onChange={() => handleItemChange(index, 'sistema_organico', false)} name={`org-${index}`} /> <Typography variant="body2">Não</Typography>
                  </Box>
                </TableCell>
                <TableCell><TextField variant="standard" fullWidth type="date" InputLabelProps={{ shrink: true }} value={item.data_compra || ''} onChange={(e) => handleItemChange(index, 'data_compra', e.target.value)} /></TableCell>
                <TableCell align="center"><IconButton onClick={() => removerItem(index)} color="error"><DeleteIcon /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button startIcon={<AddCircleOutlineIcon />} onClick={adicionarItem} sx={{ mt: 2 }}>Adicionar Item</Button>
    </Box>
  );
};

// <<< CORREÇÃO: Tabela customizada para 9.4 (Produção NÃO Orgânica) >>>
const TabelaOrigemNaoOrganicaMUI = ({ data, onDataChange }) => {
  const safeData = Array.isArray(data) ? data : [];

  const handleItemChange = (index, field, value) => {
    const newData = [...safeData];
    newData[index][field] = value;
    onDataChange(newData);
  };
  
  const adicionarItem = () => onDataChange([...safeData, { tipo: '', especies: '', origem: '', quantidade: '' }]);
  const removerItem = (index) => onDataChange(safeData.filter((_, i) => i !== index));

  return (
    <Box>
       <TableContainer component={Paper} variant="outlined">
        <Table size="small">
          <TableHead>
            <TableRow>
              <TableCell sx={{ fontWeight: 'bold', minWidth: 120 }}>Tipo</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Espécies/Cultivares</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Origem (Fornecedor)</TableCell>
              <TableCell sx={{ fontWeight: 'bold' }}>Quantidade</TableCell>
              <TableCell align="center" sx={{ fontWeight: 'bold' }}>Ação</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {safeData.map((item, index) => (
              <TableRow key={index}>
                <TableCell>
                  <FormControl fullWidth variant="standard">
                    <Select value={item.tipo || ''} onChange={(e) => handleItemChange(index, 'tipo', e.target.value)}>
                      <MenuItem value="semente">Semente</MenuItem>
                      <MenuItem value="muda">Muda</MenuItem>
                    </Select>
                  </FormControl>
                </TableCell>
                <TableCell><TextField variant="standard" fullWidth value={item.especies || ''} onChange={(e) => handleItemChange(index, 'especies', e.target.value)} /></TableCell>
                <TableCell><TextField variant="standard" fullWidth value={item.origem || ''} onChange={(e) => handleItemChange(index, 'origem', e.target.value)} /></TableCell>
                <TableCell><TextField variant="standard" fullWidth value={item.quantidade || ''} onChange={(e) => handleItemChange(index, 'quantidade', e.target.value)} /></TableCell>
                <TableCell align="center"><IconButton onClick={() => removerItem(index)} color="error"><DeleteIcon /></IconButton></TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Button startIcon={<AddCircleOutlineIcon />} onClick={adicionarItem} sx={{ mt: 2 }}>Adicionar Item</Button>
    </Box>
  );
};


function Secao9MUI({ data, onSectionChange }) {
  const safeData = data || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({ ...safeData, [name]: { [name]: value } });
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2, textAlign: 'left' }}>
        Seção 9: Propagação Vegetal
      </Typography>

      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>9.1. Qual a origem das sementes e mudas utilizadas da produção orgânica?</Typography></AccordionSummary>
        <AccordionDetails>
          <TabelaOrigemOrganicaMUI data={safeData.sementes_mudas_organicas} onDataChange={(newData) => onSectionChange({ ...safeData, sementes_mudas_organicas: newData })} />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>9.2. É realizado algum tratamento nas sementes ou mudas? Se sim, especifique.</Typography></AccordionSummary>
        <AccordionDetails>
          <TextField name="tratamento_sementes_mudas" value={safeData.tratamento_sementes_mudas?.tratamento_sementes_mudas || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>9.3. Em caso de produção própria, comente o manejo adotado.</Typography></AccordionSummary>
        <AccordionDetails>
          <Typography variant="body2" color="textSecondary" sx={{ mb: 1 }}>Informe a composição do substrato e tratamentos.</Typography>
          <TextField name="manejo_producao_propria" value={safeData.manejo_producao_propria?.manejo_producao_propria || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" />
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>9.4. Qual a origem das sementes e mudas da produção não orgânica?</Typography></AccordionSummary>
        <AccordionDetails>
          {/* <<< CORREÇÃO: Substituído TabelaDinamicaMUI pela nova tabela customizada >>> */}
          <TabelaOrigemNaoOrganicaMUI
            data={safeData.sementes_mudas_nao_organicas}
            onDataChange={(newData) => onSectionChange({ ...safeData, sementes_mudas_nao_organicas: newData })}
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>9.5. Qual a postura da propriedade quanto ao uso de materiais transgênicos na produção orgânica?</Typography></AccordionSummary>
        <AccordionDetails>
          <TextField name="postura_uso_materiais_transgenicos_organica" value={safeData.postura_uso_materiais_transgenicos_organica?.postura_uso_materiais_transgenicos_organica || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}><Typography sx={{ fontWeight: 'bold' }}>9.6. Quais os cuidados da propriedade quanto ao uso de materiais transgênicos na produção não orgânica?</Typography></AccordionSummary>
        <AccordionDetails>
          <TextField name="cuidados_uso_materiais_transgenicos_nao_organica" value={safeData.cuidados_uso_materiais_transgenicos_nao_organica?.cuidados_uso_materiais_transgenicos_nao_organica || ''} onChange={handleChange} fullWidth multiline rows={3} variant="outlined" />
        </AccordionDetails>
      </Accordion>

    </Box>
  );
}

export default Secao9MUI;