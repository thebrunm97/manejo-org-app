// src/components/PmoForm/Secao11_MUI.jsx (Refatorado com Accordion)

import React from 'react';
// <<< TAREFA 1: Importar componentes do Accordion e remover os de Card >>>
import {
  Accordion, AccordionDetails, AccordionSummary, Box, TextField, Typography
} from '@mui/material';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

function Secao11MUI({ data, onSectionChange }) {
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
      <Typography variant="h4" component="h2" sx={{ mb: 2, textAlign: 'left' }}>
        Seção 11: Colheita
      </Typography>

      {/* <<< TAREFA 2: Cada pergunta agora é um Accordion >>> */}
      <Accordion defaultExpanded>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          {/* <<< TAREFA 3: O título da pergunta foi movido para cá >>> */}
          <Typography sx={{ fontWeight: 'bold' }}>
            11.1. Como é controlada a colheita dos produtos orgânicos?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            name="controle_colheita_organicos"
            value={safeData.controle_colheita_organicos?.controle_colheita_organicos || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Descreva as formas de controle aqui..."
          />
        </AccordionDetails>
      </Accordion>

      <Accordion>
        <AccordionSummary expandIcon={<ExpandMoreIcon />}>
          <Typography sx={{ fontWeight: 'bold' }}>
            11.2. Nos casos de produção paralela, como é controlada a colheita dos produtos não orgânicos e como é feita a separação?
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <TextField
            name="controle_colheita_nao_organicos"
            value={safeData.controle_colheita_nao_organicos?.controle_colheita_nao_organicos || ''}
            onChange={handleChange}
            variant="outlined"
            fullWidth
            multiline
            rows={4}
            placeholder="Descreva as formas de controle e separação aqui..."
          />
        </AccordionDetails>
      </Accordion>

    </Box>
  );
}

export default Secao11MUI;