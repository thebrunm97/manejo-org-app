// src/components/PmoForm/Secao17_MUI.jsx (Refatorado com Accordion)

import React from 'react';
// <<< TAREFA 1: Importar componentes do Accordion e remover os de Card >>>
import {
  Accordion, AccordionDetails, AccordionSummary, Box, TextField, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Secao17MUI({ data, onSectionChange }) {
  const safeData = data || {};

  // Handler para os campos de texto aninhados
  const handleChange = (e) => {
    const { name, value } = e.target;
    onSectionChange({
      ...safeData,
      [name]: { [name]: value }
    });
  };

  return (
    // <<< TAREFA 1: A estrutura de Card foi substituída por um Box >>>
    <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
      <Typography variant="h4" component="h2" sx={{ mb: 2 }}>
        Seção 17: Opinião
      </Typography>

      {/* <<< TAREFA 2: Cada pergunta agora é um Accordion >>> */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {/* <<< TAREFA 3: O título da pergunta foi movido para cá >>> */}
          <Typography sx={{ fontWeight: 'bold' }}>
            17.1. Quais os principais problemas enfrentados na produção orgânica?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            name="principais_problemas_producao_organica"
            value={safeData.principais_problemas_producao_organica?.principais_problemas_producao_organica || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Descreva os problemas aqui..."
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>
            17.2. Quais as principais vantagens da produção orgânica?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            name="principais_vantagens_producao_organica"
            value={safeData.principais_vantagens_producao_organica?.principais_vantagens_producao_organica || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Descreva as vantagens aqui..."
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>
            17.3. Outras informações que achar necessário.
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            name="outras_informacoes_necessarias"
            value={safeData.outras_informacoes_necessarias?.outras_informacoes_necessarias || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Adicione outras informações aqui..."
          />
        </AccordionDetails>
      </Accordion>

    </Box>
  );
}

export default Secao17MUI;