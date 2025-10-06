// src/components/PmoForm/Secao8_MUI.jsx (Refatorado com Accordion)

import React from 'react';
// <<< TAREFA 1: Importar componentes do Accordion e remover os de Card >>>
import {
  Accordion, AccordionDetails, AccordionSummary, Box, TextField, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import TabelaDinamicaMUI from './TabelaDinamica_MUI';

function Secao8MUI({ data, onSectionChange }) {
  const safeData = data || {};

  const handleChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({ 
      ...safeData, 
      [name]: { [name]: value } 
    });
  };

  const columnsInsumosFertilidade = [
    { header: 'Produto ou Manejo', key: 'produto_ou_manejo' },
    { header: 'Onde (em que cultura)', key: 'onde' },
    { header: 'Quando?', key: 'quando' },
    { header: 'Procedência Interna/Externa', key: 'procedencia' },
    { header: 'Composição', key: 'composicao' },
    { header: 'Marca', key: 'marca' },
    { header: 'Dosagem', key: 'dosagem' },
  ];

  return (
    // <<< TAREFA 1: A estrutura de Card foi substituída por um Box >>>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2, textAlign: 'left' }}>
        Seção 8: Insumos/Equipamentos
      </Typography>

      {/* <<< TAREFA 2: Cada pergunta agora é um Accordion >>> */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>8.1. Quais insumos/manejos são utilizados para melhorar a fertilidade do sistema orgânico?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TabelaDinamicaMUI
            columns={columnsInsumosFertilidade}
            data={safeData.insumos_melhorar_fertilidade}
            onDataChange={(newData) => onSectionChange({ ...safeData, insumos_melhorar_fertilidade: newData })}
            itemName="Insumo/Manejo"
            itemNoun="o"
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>8.2. Quais são os insumos utilizados na produção não orgânica?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField 
            name="insumos_producao_nao_organica" 
            value={safeData.insumos_producao_nao_organica?.insumos_producao_nao_organica || ''} 
            onChange={handleChange} 
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Descreva os insumos aqui..."
          />
        </AccordionDetails>
      </Accordion>
      
      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>8.3. Nos casos de produção paralela (produção orgânica e não orgânica), como são controlados os insumos e os equipamentos?</Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField 
            name="controle_insumos_producao_paralela" 
            value={safeData.controle_insumos_producao_paralela?.controle_insumos_producao_paralela || ''} 
            onChange={handleChange} 
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Descreva as medidas de controle aqui..."
          />
        </AccordionDetails>
      </Accordion>
      
    </Box>
  );
}

export default Secao8MUI;